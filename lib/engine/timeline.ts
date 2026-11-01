import {
  EventType,
  TimelineTaskData,
  TimelineSummary,
  TaskPriority,
  TaskStatus,
} from "./types";

interface MilestoneTemplate {
  title: string;
  category: string;
  offsetDays: number;
  priority: TaskPriority;
  isCriticalPath: boolean;
  notes?: string;
  dependencyTitles?: string[];
}

export const TIMELINE_TEMPLATES: Record<EventType, MilestoneTemplate[]> = {
  WEDDING: [
    {
      title: "Confirm Auspicious Date & Guest Headcount",
      category: "PLANNING",
      offsetDays: -180,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Consult family and lock primary muhurat and provisional guest tally.",
    },
    {
      title: "Lock Wedding Venue & Stage Lawns",
      category: "VENUE",
      offsetDays: -150,
      priority: "HIGH",
      isCriticalPath: true,
      dependencyTitles: ["Confirm Auspicious Date & Guest Headcount"],
      notes: "Verify capacity, generator backup, green rooms, and curfew permissions.",
    },
    {
      title: "Shortlist & Book Feast Caterer",
      category: "CATERING",
      offsetDays: -120,
      priority: "HIGH",
      isCriticalPath: true,
      dependencyTitles: ["Lock Wedding Venue & Stage Lawns"],
      notes: "Conduct food tasting and finalize live counter assortment.",
    },
    {
      title: "Book Candid Photographer & Cinematographer",
      category: "PHOTO",
      offsetDays: -90,
      priority: "HIGH",
      isCriticalPath: false,
      notes: "Lock dates for pre-wedding, Sangeet, and main ceremony coverage.",
    },
    {
      title: "Finalize Decor & Mandap Staging Theme",
      category: "DECOR",
      offsetDays: -75,
      priority: "MEDIUM",
      isCriticalPath: false,
      dependencyTitles: ["Lock Wedding Venue & Stage Lawns"],
      notes: "Select floral color palette, entrance arches, and lighting ambiance.",
    },
    {
      title: "Send Formal Digital & Printed Invitations",
      category: "GUESTS",
      offsetDays: -60,
      priority: "HIGH",
      isCriticalPath: true,
      dependencyTitles: ["Lock Wedding Venue & Stage Lawns"],
      notes: "Dispatch invites and initiate online RSVP tracking.",
    },
    {
      title: "Bridal & Groom Wardrobe & Makeup Trials",
      category: "ATTIRE",
      offsetDays: -45,
      priority: "MEDIUM",
      isCriticalPath: false,
      notes: "Schedule makeup artists for bride and family elders.",
    },
    {
      title: "Lock DJ, Sound & Dhol Troupe",
      category: "ENTERTAINMENT",
      offsetDays: -30,
      priority: "MEDIUM",
      isCriticalPath: false,
      notes: "Curate Sangeet dance tracks and ceremonial entry music.",
    },
    {
      title: "Catering Headcount Final Lock",
      category: "CATERING",
      offsetDays: -14,
      priority: "HIGH",
      isCriticalPath: true,
      dependencyTitles: ["Send Formal Digital & Printed Invitations", "Shortlist & Book Feast Caterer"],
      notes: "Lock guaranteed minimum plate count with 10% buffer.",
    },
    {
      title: "Distribute Day-of-Event Run of Show",
      category: "PLANNING",
      offsetDays: -7,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Brief key family coordinators, assign cash float handlers, and verify emergency contacts.",
    },
    {
      title: "Venue Handover & Sound Check",
      category: "VENUE",
      offsetDays: -1,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Inspect floral stage setup, test microphones, and confirm electrical backup.",
    },
    {
      title: "Celebration Day Execution & Vendor Clearance",
      category: "PLANNING",
      offsetDays: 0,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Execute festivities, monitor feast replenishment, and disburse vendor settlements.",
    },
  ],
  BIRTHDAY: [
    {
      title: "Decide Theme & Expected Kid/Adult Count",
      category: "PLANNING",
      offsetDays: -30,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Choose character or color theme and approximate headcount.",
    },
    {
      title: "Book Party Venue / Play Zone",
      category: "VENUE",
      offsetDays: -25,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Confirm dedicated play area, slots, and external cake permission.",
    },
    {
      title: "Send WhatsApp Digital Invitations",
      category: "GUESTS",
      offsetDays: -20,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Collect RSVP confirmation for food boxes and return gift count.",
    },
    {
      title: "Book Magician, Game Host & Face Painter",
      category: "ENTERTAINMENT",
      offsetDays: -15,
      priority: "MEDIUM",
      isCriticalPath: false,
      notes: "Confirm age-appropriate 45-minute interactive routine.",
    },
    {
      title: "Order Custom Themed Cake & Party Menu",
      category: "CATERING",
      offsetDays: -10,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Order 3kg cake, finger foods, mocktails, and dietary options.",
    },
    {
      title: "Assemble Return Gift Hampers & Decor Items",
      category: "DECOR",
      offsetDays: -5,
      priority: "MEDIUM",
      isCriticalPath: false,
      notes: "Prepare personalized gift bags, balloons, and photo backdrop.",
    },
    {
      title: "Event Day Setup & Cake Cutting Celebration",
      category: "PLANNING",
      offsetDays: 0,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Arrive 1 hour early for balloon assembly and sound setup.",
    },
  ],
  COMMUNITY: [
    {
      title: "Form Committee & Define Festival Budget",
      category: "PLANNING",
      offsetDays: -60,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Approve budget, divide sub-committees (cultural, stage, food, security).",
    },
    {
      title: "Acquire Police, Fire & Local Society Permissions",
      category: "PERMITS_SECURITY",
      offsetDays: -45,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Submit NOC applications for sound curfew and fire safety apparatus.",
    },
    {
      title: "Contract Staging, Line-Array Sound & Lighting",
      category: "VENUE",
      offsetDays: -35,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Lock stage dimensions, LED wall, and compound ambient illumination.",
    },
    {
      title: "Announce Community Contests & Rangoli Registrations",
      category: "ACTIVITIES",
      offsetDays: -25,
      priority: "MEDIUM",
      isCriticalPath: false,
      notes: "Publish flyer on society notice board and resident portal.",
    },
    {
      title: "Finalize Prasad & Refreshment Vendor",
      category: "CATERING",
      offsetDays: -20,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Order 400 meal packets/bhojan with hygienic distribution setup.",
    },
    {
      title: "Final Volunteer Dry-Run & Safety Check",
      category: "PLANNING",
      offsetDays: -7,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Test crowd flow barricades, emergency exits, and audio monitors.",
    },
    {
      title: "Festival Day Celebration & Community Aarti",
      category: "PLANNING",
      offsetDays: 0,
      priority: "HIGH",
      isCriticalPath: true,
      notes: "Coordinate live performances, prize distributions, and waste segregation.",
    },
  ],
};

/**
 * Calculates due date given event date and day offset
 */
export function calculateDueDate(eventDateStr: string, offsetDays: number): string {
  const eventDate = new Date(eventDateStr);
  const targetDate = new Date(eventDate.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split("T")[0];
}

/**
 * Generates initial timeline tasks backward from event date
 */
export function generateDefaultTimeline(
  eventType: EventType,
  eventDateStr: string
): TimelineTaskData[] {
  const templates = TIMELINE_TEMPLATES[eventType] || TIMELINE_TEMPLATES.WEDDING;
  const eventDate = new Date(eventDateStr);
  const now = new Date();
  const daysRemaining = Math.max(
    0,
    Math.round((eventDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  );

  const isCompressed =
    (eventType === "WEDDING" && daysRemaining < 60) ||
    (eventType === "BIRTHDAY" && daysRemaining < 15) ||
    (eventType === "COMMUNITY" && daysRemaining < 30);

  return templates.map((tmpl, index) => {
    // If timeline is compressed, compress negative offsets proportionally so tasks fit
    let effectiveOffset = tmpl.offsetDays;
    if (isCompressed && tmpl.offsetDays < 0 && daysRemaining > 0) {
      const minOffset = Math.min(...templates.map((t) => t.offsetDays));
      const compressionFactor = daysRemaining / Math.abs(minOffset);
      effectiveOffset = Math.max(
        -daysRemaining,
        Math.round(tmpl.offsetDays * Math.min(1, compressionFactor * 0.9))
      );
    }

    const dueDate = calculateDueDate(eventDateStr, effectiveOffset);

    return {
      id: `task_${index + 1}`,
      title: tmpl.title,
      category: tmpl.category,
      offsetDays: effectiveOffset,
      dueDate,
      status: "PENDING" as TaskStatus,
      priority: tmpl.priority,
      isCriticalPath: tmpl.isCriticalPath,
      notes: tmpl.notes,
    };
  });
}

/**
 * Analyzes timeline health, identifies this week's checklist, and evaluates schedule risk
 */
export function calculateTimelineSummary(
  tasks: TimelineTaskData[],
  eventDateStr: string,
  eventType: EventType
): TimelineSummary {
  const eventDate = new Date(eventDateStr);
  const now = new Date();
  // Strip time for clean day diff
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

  const daysRemaining = Math.round(
    (targetDate.getTime() - todayDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  // Evaluate risk level
  let riskLevel: "LOW" | "MODERATE" | "HIGH_SCHEDULE_RISK" = "LOW";
  let riskReason: string | undefined;

  if (eventType === "WEDDING") {
    if (daysRemaining < 30) {
      riskLevel = "HIGH_SCHEDULE_RISK";
      riskReason = `Only ${daysRemaining} days left! Wedding vendor contracts and attire fittings require urgent expedited closure.`;
    } else if (daysRemaining < 60) {
      riskLevel = "MODERATE";
      riskReason = `Timeline is tight (${daysRemaining} days remaining). Priority must be given to critical-path vendors.`;
    }
  } else if (eventType === "BIRTHDAY") {
    if (daysRemaining < 7) {
      riskLevel = "HIGH_SCHEDULE_RISK";
      riskReason = `Only ${daysRemaining} days left! Cake order and venue booking must be locked today.`;
    } else if (daysRemaining < 14) {
      riskLevel = "MODERATE";
      riskReason = `Two weeks remaining. Confirm RSVPs to finalize party food orders.`;
    }
  } else if (eventType === "COMMUNITY") {
    if (daysRemaining < 14) {
      riskLevel = "HIGH_SCHEDULE_RISK";
      riskReason = `Only ${daysRemaining} days left! Sound permissions and police NOCs require immediate follow-up.`;
    } else if (daysRemaining < 30) {
      riskLevel = "MODERATE";
      riskReason = `One month remaining. Confirm volunteer teams and staging vendor.`;
    }
  }

  // Calculate "This Week" tasks (due within next 7 days, or overdue pending tasks)
  const oneWeekAhead = new Date(todayDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const tasksThisWeek = tasks.filter((task) => {
    if (task.status === "COMPLETED") return false;
    const due = new Date(task.dueDate);
    return due <= oneWeekAhead;
  });

  const criticalPathTasks = tasks.filter((t) => t.isCriticalPath);

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const completionPercentage =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Sort tasks chronologically by dueDate
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return {
    eventDate: eventDateStr,
    daysRemaining,
    riskLevel,
    riskReason,
    tasksThisWeek,
    criticalPathTasks,
    allTasks: sortedTasks,
    completionPercentage,
  };
}
