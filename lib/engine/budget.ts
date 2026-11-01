import {
  EventType,
  BudgetItemData,
  BudgetSummary,
  BudgetTemplateCategory,
  TradeOff,
  BudgetHealth,
} from "./types";

export const BUDGET_TEMPLATES: Record<EventType, BudgetTemplateCategory[]> = {
  WEDDING: [
    {
      category: "CATERING",
      name: "Catering & Live Counters",
      percentage: 35,
      description: "Appetizers, main feast buffet, live specialty counters, desserts",
      iconName: "Utensils",
    },
    {
      category: "VENUE",
      name: "Venue & Staging",
      percentage: 25,
      description: "Banquet/lawn rental, stage fabrication, generator backup",
      iconName: "Castle",
    },
    {
      category: "DECOR",
      name: "Decor & Floral Design",
      percentage: 13,
      description: "Mandap/stage backdrop, entrance floral arch, lighting ambience",
      iconName: "Sparkles",
    },
    {
      category: "PHOTO",
      name: "Photography & Cinematography",
      percentage: 12,
      description: "Candid photographer, cinematic video team, drone coverage",
      iconName: "Camera",
    },
    {
      category: "ATTIRE",
      name: "Attire, Styling & Makeup",
      percentage: 8,
      description: "Bridal/groom makeup artist, family hair/styling",
      iconName: "Crown",
    },
    {
      category: "ENTERTAINMENT",
      name: "Music, Sound & DJ",
      percentage: 4,
      description: "DJ setup, sound engineer, dhol players, wireless microphones",
      iconName: "Music",
    },
    {
      category: "CONTINGENCY",
      name: "Contingency & Cash Float",
      percentage: 3,
      description: "Emergency reserves for extra plates, tipping, last-minute supplies",
      iconName: "ShieldCheck",
    },
  ],
  BIRTHDAY: [
    {
      category: "CATERING",
      name: "F&B, Cake & Mocktails",
      percentage: 35,
      description: "Custom themed cake, finger foods, pizza/pasta counter, dessert bar",
      iconName: "Utensils",
    },
    {
      category: "VENUE",
      name: "Venue & Play Area",
      percentage: 30,
      description: "Party hall rental, soft play / arcade access fee",
      iconName: "Castle",
    },
    {
      category: "DECOR",
      name: "Theme Decor & Favors",
      percentage: 15,
      description: "Balloon arch, character cutouts, welcome banner, return gift hampers",
      iconName: "Sparkles",
    },
    {
      category: "ENTERTAINMENT",
      name: "Emcee, Magic & Games",
      percentage: 12,
      description: "Host/entertainer, magician/puppet show, game prizes",
      iconName: "Music",
    },
    {
      category: "CONTINGENCY",
      name: "Buffer Fund",
      percentage: 8,
      description: "Extra guests, extended hall rental hour buffer",
      iconName: "ShieldCheck",
    },
  ],
  COMMUNITY: [
    {
      category: "VENUE",
      name: "Staging, Sound & Lighting",
      percentage: 35,
      description: "Main cultural stage, line-array speakers, LED wall, festive fairy lights",
      iconName: "Castle",
    },
    {
      category: "CATERING",
      name: "Prasad, Refreshments & Stalls",
      percentage: 30,
      description: "Community bhojan/prasad distribution, tea/water stations",
      iconName: "Utensils",
    },
    {
      category: "PERMITS_SECURITY",
      name: "Security, Permits & Cleaning",
      percentage: 15,
      description: "Police/fire NOC fees, dedicated security guards, sanitation crew",
      iconName: "ShieldCheck",
    },
    {
      category: "ACTIVITIES",
      name: "Prizes, Rangoli & Contests",
      percentage: 10,
      description: "Trophies, festival gift hampers, art supplies for contests",
      iconName: "Sparkles",
    },
    {
      category: "CONTINGENCY",
      name: "Emergency Contingency",
      percentage: 10,
      description: "Weather contingency, backup diesel generator, medical first-aid kit",
      iconName: "ShieldCheck",
    },
  ],
};

/**
 * Format currency in Indian Rupees with comma separation (e.g. ₹12,50,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Format compact Indian Rupee notation (e.g. ₹12.5L or ₹45K)
 */
export function formatCompactINR(amount: number): string {
  if (isNaN(amount) || amount <= 0) return "₹0";
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (abs >= 100000) {
    return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, "")} L`;
  }
  if (abs >= 1000) {
    return `₹${(amount / 1000).toFixed(0)} K`;
  }
  return formatINR(amount);
}

/**
 * Deterministic cost per head calculation
 */
export function computeCostPerHead(totalBudget: number, guestCount: number): number {
  if (guestCount <= 0 || totalBudget <= 0) return 0;
  return Math.round(totalBudget / guestCount);
}

/**
 * Generates initial allocated budget items deterministically from total budget and event type
 */
export function generateDefaultBudget(eventType: EventType, totalBudget: number): BudgetItemData[] {
  const template = BUDGET_TEMPLATES[eventType] || BUDGET_TEMPLATES.WEDDING;
  let runningSum = 0;

  const items = template.map((cat, idx) => {
    // For the last item, allocate remaining rupees to guarantee exact 100% total sum
    const isLast = idx === template.length - 1;
    const allocatedAmount = isLast
      ? Math.max(0, totalBudget - runningSum)
      : Math.round((totalBudget * cat.percentage) / 100);

    runningSum += allocatedAmount;

    return {
      category: cat.category,
      allocatedAmount,
      spentAmount: 0,
      notes: cat.description,
    };
  });

  return items;
}

/**
 * Compute the 3 deterministic trade-offs strictly in code without LLM math
 */
export function computeTradeOffs(
  budgetItems: BudgetItemData[],
  totalBudget: number,
  guestCount: number
): TradeOff[] {
  const cateringItem = budgetItems.find((b) => b.category === "CATERING");
  const venueItem = budgetItems.find((b) => b.category === "VENUE");

  const cateringAllocation = cateringItem ? cateringItem.allocatedAmount : totalBudget * 0.35;
  const venueAllocation = venueItem ? venueItem.allocatedAmount : totalBudget * 0.25;

  // 1. Menu Tier Optimization: Saving ₹250/guest by curating 2 fewer redundant live counters
  const menuSavings = Math.min(
    Math.round(guestCount * 250),
    Math.round(cateringAllocation * 0.2)
  );

  // 2. Off-Peak Day / Muhurat Timing: 15% discount on venue booking
  const venueSavings = Math.round(venueAllocation * 0.15);

  // 3. Digital Invites & Eco Favors: Saves ₹80/guest or up to 3% of total budget
  const digitalInvitesSavings = Math.min(
    Math.round(guestCount * 80),
    Math.round(totalBudget * 0.03)
  );

  return [
    {
      id: "menu_tier",
      title: "Streamline Buffet & Counters",
      description: `Replace 2 duplicate live chaat counters with signature chef specials. Saves ₹250 per plate across ${guestCount} guests.`,
      category: "CATERING",
      estimatedSavings: menuSavings,
      impactScore: "LOW",
      actionType: "MENU_SIMPLIFY",
    },
    {
      id: "off_peak_timing",
      title: "Venue Slot / Day-of-Week Advantage",
      description: "Host during daytime muhurat or Friday evening to negotiate a 15% venue fee reduction.",
      category: "VENUE",
      estimatedSavings: venueSavings,
      impactScore: "MEDIUM",
      actionType: "OFF_PEAK_TIMING",
    },
    {
      id: "digital_invites",
      title: "Digital Video Invites & Paperless RSVP",
      description: `Opt for personalized WhatsApp video invitations and digital tracking instead of physical boxed print runs.`,
      category: "DECOR",
      estimatedSavings: digitalInvitesSavings,
      impactScore: "LOW",
      actionType: "DIGITAL_INVITES",
    },
  ];
}

/**
 * Compute complete budget health and breakdown
 */
export function calculateBudgetSummary(
  budgetItems: BudgetItemData[],
  totalBudget: number,
  guestCount: number,
  eventType: EventType
): BudgetSummary {
  const template = BUDGET_TEMPLATES[eventType] || BUDGET_TEMPLATES.WEDDING;
  const totalAllocated = budgetItems.reduce((acc, curr) => acc + curr.allocatedAmount, 0);
  const totalSpent = budgetItems.reduce((acc, curr) => acc + curr.spentAmount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const costPerHead = computeCostPerHead(totalBudget, guestCount);

  let health: BudgetHealth = "HEALTHY";
  const overrunAmount = Math.max(0, totalSpent - totalBudget);

  if (totalSpent > totalBudget) {
    health = "OVERRUN";
  } else if (totalSpent >= totalBudget * 0.95 || totalAllocated > totalBudget) {
    health = "TIGHT";
  }

  const categoryMap = new Map(budgetItems.map((item) => [item.category, item]));

  const categories = template.map((tmpl) => {
    const item = categoryMap.get(tmpl.category) || {
      allocatedAmount: 0,
      spentAmount: 0,
    };
    const percentageOfTotal =
      totalBudget > 0 ? Math.round((item.allocatedAmount / totalBudget) * 100) : tmpl.percentage;
    const isOverrun = item.spentAmount > item.allocatedAmount;

    return {
      category: tmpl.category,
      name: tmpl.name,
      allocatedAmount: item.allocatedAmount,
      spentAmount: item.spentAmount,
      percentageOfTotal,
      isOverrun,
    };
  });

  const tradeOffs = computeTradeOffs(budgetItems, totalBudget, guestCount);

  return {
    totalBudget,
    totalAllocated,
    totalSpent,
    remainingBudget,
    guestCount,
    costPerHead,
    health,
    overrunAmount,
    tradeOffs,
    categories,
  };
}

/**
 * Rebalance existing budget items deterministically when total budget changes
 */
export function rebalanceBudget(
  existingItems: BudgetItemData[],
  newTotalBudget: number,
  eventType: EventType
): BudgetItemData[] {
  if (existingItems.length === 0) {
    return generateDefaultBudget(eventType, newTotalBudget);
  }

  const currentTotalAllocated = existingItems.reduce(
    (acc, curr) => acc + curr.allocatedAmount,
    0
  );

  if (currentTotalAllocated === 0) {
    return generateDefaultBudget(eventType, newTotalBudget);
  }

  let runningSum = 0;
  return existingItems.map((item, index) => {
    const isLast = index === existingItems.length - 1;
    const ratio = item.allocatedAmount / currentTotalAllocated;
    const newAllocated = isLast
      ? Math.max(0, newTotalBudget - runningSum)
      : Math.round(newTotalBudget * ratio);

    runningSum += newAllocated;

    return {
      ...item,
      allocatedAmount: newAllocated,
    };
  });
}
