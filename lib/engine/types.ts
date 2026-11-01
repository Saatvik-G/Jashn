export type EventType = "WEDDING" | "BIRTHDAY" | "COMMUNITY";

export type BudgetHealth = "HEALTHY" | "TIGHT" | "OVERRUN";

export interface BudgetItemData {
  id?: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  notes?: string | null;
}

export interface BudgetTemplateCategory {
  category: string;
  name: string;
  percentage: number;
  description: string;
  iconName: string;
}

export interface TradeOff {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedSavings: number;
  impactScore: "LOW" | "MEDIUM" | "HIGH";
  actionType: "MENU_SIMPLIFY" | "OFF_PEAK_TIMING" | "DIGITAL_INVITES";
}

export interface BudgetSummary {
  totalBudget: number;
  totalAllocated: number;
  totalSpent: number;
  remainingBudget: number;
  guestCount: number;
  costPerHead: number;
  health: BudgetHealth;
  overrunAmount: number;
  tradeOffs: TradeOff[];
  categories: {
    category: string;
    name: string;
    allocatedAmount: number;
    spentAmount: number;
    percentageOfTotal: number;
    isOverrun: boolean;
  }[];
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface TimelineTaskData {
  id?: string;
  title: string;
  category: string;
  offsetDays: number; // Days relative to event date (negative = before event)
  dueDate: string; // ISO date string
  status: TaskStatus;
  priority: TaskPriority;
  isCriticalPath: boolean;
  dependencies?: string[];
  notes?: string;
}

export interface TimelineSummary {
  eventDate: string;
  daysRemaining: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH_SCHEDULE_RISK";
  riskReason?: string;
  tasksThisWeek: TimelineTaskData[];
  criticalPathTasks: TimelineTaskData[];
  allTasks: TimelineTaskData[];
  completionPercentage: number;
}

export interface EventSnapshot {
  title: string;
  eventType: EventType;
  guestCount: number;
  totalBudget: number;
  eventDate: string;
  budgetItems: BudgetItemData[];
  timelineTasks: TimelineTaskData[];
}

export interface ReplanDiff {
  guestCount: {
    before: number;
    after: number;
    delta: number;
  };
  totalBudget: {
    before: number;
    after: number;
    delta: number;
  };
  costPerHead: {
    before: number;
    after: number;
    delta: number;
  };
  eventDate?: {
    before: string;
    after: string;
    daysShifted: number;
  };
  categoryDeltas: {
    category: string;
    name: string;
    beforeAllocated: number;
    afterAllocated: number;
    delta: number;
  }[];
  newTasks: TimelineTaskData[];
  removedTasks: string[];
  warnings: string[];
}
