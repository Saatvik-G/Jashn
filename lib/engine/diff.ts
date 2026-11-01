import { EventSnapshot, ReplanDiff, TimelineTaskData } from "./types";
import { computeCostPerHead, rebalanceBudget } from "./budget";
import { calculateDueDate } from "./timeline";

export interface ReplanInput {
  guestCount?: number;
  totalBudget?: number;
  eventDate?: string;
  notes?: string;
}

/**
 * Computes deterministic diff between current event snapshot and proposed replanned state
 */
export function computeReplanDiff(
  current: EventSnapshot,
  proposed: ReplanInput
): ReplanDiff {
  const newGuestCount = proposed.guestCount ?? current.guestCount;
  const newTotalBudget = proposed.totalBudget ?? current.totalBudget;
  const newEventDate = proposed.eventDate ?? current.eventDate;

  const guestDelta = newGuestCount - current.guestCount;
  const budgetDelta = newTotalBudget - current.totalBudget;

  const currentCostPerHead = computeCostPerHead(current.totalBudget, current.guestCount);
  const newCostPerHead = computeCostPerHead(newTotalBudget, newGuestCount);
  const costPerHeadDelta = newCostPerHead - currentCostPerHead;

  // Rebalance categories if budget changed
  const rebalancedItems = rebalanceBudget(
    current.budgetItems,
    newTotalBudget,
    current.eventType
  );

  const categoryDeltas = rebalancedItems.map((newItem) => {
    const oldItem = current.budgetItems.find((i) => i.category === newItem.category);
    const beforeAllocated = oldItem ? oldItem.allocatedAmount : 0;
    const delta = newItem.allocatedAmount - beforeAllocated;

    return {
      category: newItem.category,
      name: newItem.category,
      beforeAllocated,
      afterAllocated: newItem.allocatedAmount,
      delta,
    };
  });

  const newTasks: TimelineTaskData[] = [];
  const warnings: string[] = [];

  // Guest count changes logic
  if (guestDelta > 0) {
    newTasks.push({
      id: `task_replan_catering_${Date.now()}`,
      title: `Update Catering Contract: +${guestDelta} Guests`,
      category: "CATERING",
      offsetDays: -14,
      dueDate: calculateDueDate(newEventDate, -14),
      status: "PENDING",
      priority: "HIGH",
      isCriticalPath: true,
      notes: `Headcount expanded from ${current.guestCount} to ${newGuestCount}. Notify caterer of plate guarantee update.`,
    });

    if (guestDelta >= 30) {
      warnings.push(
        `Guest count increased significantly (+${guestDelta}). Verify that venue fire and seating capacity can accommodate ${newGuestCount} attendees.`
      );
    }

    if (budgetDelta === 0) {
      warnings.push(
        `Total budget remained unchanged. Per-head allocation decreased from ₹${currentCostPerHead.toLocaleString("en-IN")} to ₹${newCostPerHead.toLocaleString("en-IN")}. Consider rebalancing or simplifying menus.`
      );
    }
  } else if (guestDelta < 0) {
    warnings.push(
      `Guest count reduced by ${Math.abs(guestDelta)}. Per-head purchasing power increased to ₹${newCostPerHead.toLocaleString("en-IN")}.`
    );
  }

  // Budget changes logic
  if (budgetDelta > 0) {
    warnings.push(
      `Budget increased by ₹${budgetDelta.toLocaleString("en-IN")}. Surplus has been proportionally distributed across categories.`
    );
  } else if (budgetDelta < 0) {
    warnings.push(
      `Budget reduced by ₹${Math.abs(budgetDelta).toLocaleString("en-IN")}. Allocations compressed proportionally.`
    );
  }

  // Date changes logic
  let eventDateDiff: ReplanDiff["eventDate"] = undefined;
  if (newEventDate !== current.eventDate) {
    const oldD = new Date(current.eventDate).getTime();
    const newD = new Date(newEventDate).getTime();
    const daysShifted = Math.round((newD - oldD) / (24 * 60 * 60 * 1000));

    eventDateDiff = {
      before: current.eventDate,
      after: newEventDate,
      daysShifted,
    };

    if (daysShifted < 0) {
      warnings.push(
        `Event was moved earlier by ${Math.abs(daysShifted)} days. All backward milestone due dates have been compressed.`
      );
    } else {
      warnings.push(
        `Event was postponed by ${daysShifted} days. You now have more lead time for vendor lock-in.`
      );
    }

    newTasks.push({
      id: `task_replan_date_${Date.now()}`,
      title: `Notify All Shortlisted Vendors of New Date (${newEventDate})`,
      category: "PLANNING",
      offsetDays: -30,
      dueDate: calculateDueDate(newEventDate, -30),
      status: "PENDING",
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Verify vendor availability and update contracts for new date.",
    });
  }

  return {
    guestCount: {
      before: current.guestCount,
      after: newGuestCount,
      delta: guestDelta,
    },
    totalBudget: {
      before: current.totalBudget,
      after: newTotalBudget,
      delta: budgetDelta,
    },
    costPerHead: {
      before: currentCostPerHead,
      after: newCostPerHead,
      delta: costPerHeadDelta,
    },
    eventDate: eventDateDiff,
    categoryDeltas,
    newTasks,
    removedTasks: [],
    warnings,
  };
}
