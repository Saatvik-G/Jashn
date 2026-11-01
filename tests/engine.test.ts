import { describe, it, expect } from "vitest";
import {
  computeCostPerHead,
  formatINR,
  formatCompactINR,
  generateDefaultBudget,
  calculateBudgetSummary,
  rebalanceBudget,
  computeTradeOffs,
} from "../lib/engine/budget";
import {
  calculateDueDate,
  generateDefaultTimeline,
  calculateTimelineSummary,
} from "../lib/engine/timeline";
import { computeReplanDiff } from "../lib/engine/diff";
import { EventSnapshot } from "../lib/engine/types";

describe("Budget Engine (lib/engine/budget.ts)", () => {
  it("calculates cost per head deterministically without LLM math", () => {
    expect(computeCostPerHead(1000000, 100)).toBe(10000);
    expect(computeCostPerHead(1200000, 150)).toBe(8000);
    expect(computeCostPerHead(1200000, 220)).toBe(5455);
    expect(computeCostPerHead(0, 50)).toBe(0);
    expect(computeCostPerHead(50000, 0)).toBe(0);
  });

  it("formats Indian Rupee currency correctly", () => {
    const formatted = formatINR(1000000);
    // Should contain ₹ and 10,00,000
    expect(formatted).toContain("10,00,000");

    expect(formatCompactINR(1200000)).toBe("₹12 L");
    expect(formatCompactINR(45000)).toBe("₹45 K");
  });

  it("generates default wedding budget where sum of allocated equals total budget", () => {
    const total = 1000000;
    const items = generateDefaultBudget("WEDDING", total);
    const sum = items.reduce((acc, curr) => acc + curr.allocatedAmount, 0);

    expect(sum).toBe(total);
    const catering = items.find((i) => i.category === "CATERING");
    expect(catering?.allocatedAmount).toBe(350000); // 35%
  });

  it("detects overrun and tight budget health states accurately", () => {
    const items = generateDefaultBudget("WEDDING", 1000000);
    // Healthy initially
    let summary = calculateBudgetSummary(items, 1000000, 150, "WEDDING");
    expect(summary.health).toBe("HEALTHY");

    // Spend 96% -> TIGHT
    items[0].spentAmount = 350000;
    items[1].spentAmount = 250000;
    items[2].spentAmount = 130000;
    items[3].spentAmount = 120000;
    items[4].spentAmount = 80000;
    items[5].spentAmount = 40000;
    summary = calculateBudgetSummary(items, 1000000, 150, "WEDDING");
    expect(summary.health).toBe("TIGHT");

    // Spend over 1,000,000 -> OVERRUN
    items[0].spentAmount += 60000;
    summary = calculateBudgetSummary(items, 1000000, 150, "WEDDING");
    expect(summary.health).toBe("OVERRUN");
    expect(summary.overrunAmount).toBe(30000);
  });

  it("computes 3 deterministic trade-offs strictly in code", () => {
    const items = generateDefaultBudget("WEDDING", 1000000);
    const guestCount = 200;
    const tradeOffs = computeTradeOffs(items, 1000000, guestCount);

    expect(tradeOffs).toHaveLength(3);
    const menuTradeOff = tradeOffs.find((t) => t.id === "menu_tier");
    // guestCount * 250 = 200 * 250 = 50000
    expect(menuTradeOff?.estimatedSavings).toBe(50000);

    const venueTradeOff = tradeOffs.find((t) => t.id === "off_peak_timing");
    // 25% of 1M = 250,000 * 0.15 = 37,500
    expect(venueTradeOff?.estimatedSavings).toBe(37500);
  });

  it("rebalances budget items preserving total new allocation sum", () => {
    const items = generateDefaultBudget("WEDDING", 1000000);
    const rebalanced = rebalanceBudget(items, 1500000, "WEDDING");
    const sum = rebalanced.reduce((acc, curr) => acc + curr.allocatedAmount, 0);

    expect(sum).toBe(1500000);
    const catering = rebalanced.find((i) => i.category === "CATERING");
    expect(catering?.allocatedAmount).toBe(525000); // 35% of 1.5M
  });
});

describe("Timeline Engine (lib/engine/timeline.ts)", () => {
  it("calculates due date backward from event date accurately", () => {
    const eventDate = "2026-12-31";
    const dueDate = calculateDueDate(eventDate, -30);
    expect(dueDate).toBe("2026-12-01");
  });

  it("generates default wedding timeline with critical path milestones", () => {
    const eventDate = "2027-06-01";
    const tasks = generateDefaultTimeline("WEDDING", eventDate);

    expect(tasks.length).toBeGreaterThan(5);
    const criticalTasks = tasks.filter((t) => t.isCriticalPath);
    expect(criticalTasks.length).toBeGreaterThan(0);

    const venueTask = tasks.find((t) => t.category === "VENUE");
    expect(venueTask).toBeDefined();
  });

  it("identifies high schedule risk when days remaining are severely compressed", () => {
    // Event is 10 days away for a wedding
    const soonDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const tasks = generateDefaultTimeline("WEDDING", soonDate);
    const summary = calculateTimelineSummary(tasks, soonDate, "WEDDING");

    expect(summary.riskLevel).toBe("HIGH_SCHEDULE_RISK");
    expect(summary.riskReason).toContain("10 days left");
  });
});

describe("Diff Engine (lib/engine/diff.ts)", () => {
  const mockSnapshot: EventSnapshot = {
    title: "Jaipur Heritage Wedding",
    eventType: "WEDDING",
    guestCount: 150,
    totalBudget: 1200000,
    eventDate: "2027-11-15",
    budgetItems: generateDefaultBudget("WEDDING", 1200000),
    timelineTasks: generateDefaultTimeline("WEDDING", "2027-11-15"),
  };

  it("evaluates replan from 150 to 220 guests, updating cost-per-head and injecting catering task", () => {
    const diff = computeReplanDiff(mockSnapshot, { guestCount: 220 });

    expect(diff.guestCount.before).toBe(150);
    expect(diff.guestCount.after).toBe(220);
    expect(diff.guestCount.delta).toBe(70);

    // Initial per head: 12,00,000 / 150 = 8000
    // New per head: 12,00,000 / 220 = 5455
    expect(diff.costPerHead.before).toBe(8000);
    expect(diff.costPerHead.after).toBe(5455);
    expect(diff.costPerHead.delta).toBe(-2545);

    // Should include injected catering task
    const cateringTask = diff.newTasks.find((t) => t.category === "CATERING");
    expect(cateringTask).toBeDefined();
    expect(cateringTask?.title).toContain("+70 Guests");

    // Warnings should flag venue capacity
    expect(diff.warnings.some((w) => w.includes("fire and seating capacity"))).toBe(true);
  });

  it("handles event postponement and updates backward milestone tasks", () => {
    const diff = computeReplanDiff(mockSnapshot, { eventDate: "2027-12-15" });

    expect(diff.eventDate).toBeDefined();
    expect(diff.eventDate?.daysShifted).toBe(30);

    const vendorNotificationTask = diff.newTasks.find((t) => t.category === "PLANNING");
    expect(vendorNotificationTask).toBeDefined();
    expect(vendorNotificationTask?.title).toContain("Notify All Shortlisted Vendors");
  });
});
