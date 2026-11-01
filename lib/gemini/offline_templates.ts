import { EventType } from "../engine/types";
import { IntakeParseResult } from "./schemas";

/**
 * Deterministic Contradiction Evaluator (Rule 1: Zero LLM math)
 */
export function evaluateIntakeFeasibility(
  eventType: EventType,
  guestCount: number,
  totalBudget: number,
  eventDateStr: string
): { isContradiction: boolean; contradictionReason?: string; clarifyingQuestions?: string[] } {
  const costPerHead = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;
  const eventDate = new Date(eventDateStr);
  const now = new Date();

  // Date check
  if (eventDate.getTime() <= now.getTime()) {
    return {
      isContradiction: true,
      contradictionReason: "Event date must be in the future to build a backward planning schedule.",
      clarifyingQuestions: ["What target month or auspicious date would you like to plan for?"],
    };
  }

  // Wedding checks
  if (eventType === "WEDDING") {
    if (costPerHead < 800) {
      return {
        isContradiction: true,
        contradictionReason: `At ₹${totalBudget.toLocaleString("en-IN")} for ${guestCount} guests, your per-head allocation is only ₹${costPerHead.toLocaleString("en-IN")}. Standard Indian wedding feasts and basic banquet venues require a minimum of ~₹1,200–₹2,500 per guest.`,
        clarifyingQuestions: [
          `Would you prefer to adjust the guest count to an intimate gathering (~${Math.round(totalBudget / 1500)} guests)?`,
          `Or would you like to revise the overall wedding budget to ~₹${Math.round((guestCount * 1800) / 100000)} Lakh?`,
          "Or proceed with a community hall / home catering format?",
        ],
      };
    }
  }

  // Birthday checks
  if (eventType === "BIRTHDAY") {
    if (costPerHead < 300) {
      return {
        isContradiction: true,
        contradictionReason: `₹${totalBudget.toLocaleString("en-IN")} for ${guestCount} guests allocates ₹${costPerHead} per head. Birthday cake, snack boxes, and venue minimums typically start around ~₹600–₹1,200 per attendee.`,
        clarifyingQuestions: [
          "Would you like to host at home/park with DIY snack boxes?",
          "Or adjust guest count to close family and classmates?",
        ],
      };
    }
  }

  // Community event checks
  if (eventType === "COMMUNITY") {
    if (costPerHead < 250) {
      return {
        isContradiction: true,
        contradictionReason: `₹${totalBudget.toLocaleString("en-IN")} for ${guestCount} attendees equals ₹${costPerHead}/person, which may not cover staging, line-array sound permits, and prasad distribution.`,
        clarifyingQuestions: [
          "Do you have community contributions or society maintenance sponsor funds?",
          "Can staging equipment be sourced from existing resident committee assets?",
        ],
      };
    }
  }

  return { isContradiction: false };
}

/**
 * Offline Fallback Celebration Plans when Gemini is unavailable or quota is exceeded
 */
export function getOfflineIntakePlan(text: string): IntakeParseResult {
  const lower = text.toLowerCase();

  // Detect event type
  let eventType: EventType = "WEDDING";
  if (lower.includes("birthday") || lower.includes("bday") || lower.includes("kid")) {
    eventType = "BIRTHDAY";
  } else if (lower.includes("diwali") || lower.includes("society") || lower.includes("community") || lower.includes("mela")) {
    eventType = "COMMUNITY";
  }

  // Detect numbers
  let guestCount = eventType === "WEDDING" ? 150 : eventType === "BIRTHDAY" ? 35 : 300;
  if (/(\d+)\s*(?:guests|people|pax|members)/i.test(text)) {
    const match = text.match(/(\d+)\s*(?:guests|people|pax|members)/i);
    if (match) guestCount = parseInt(match[1], 10);
  }

  let totalBudget = eventType === "WEDDING" ? 1200000 : eventType === "BIRTHDAY" ? 40000 : 250000;
  if (/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)/i.test(text)) {
    const match = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)/i);
    if (match) totalBudget = Math.round(parseFloat(match[1]) * 100000);
  } else if (/(\d+(?:\.\d+)?)\s*(?:k|thousand)/i.test(text)) {
    const match = text.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand)/i);
    if (match) totalBudget = Math.round(parseFloat(match[1]) * 1000);
  }

  // Target date 120 days in future
  const future = new Date();
  future.setDate(future.getDate() + (eventType === "WEDDING" ? 120 : 30));
  const eventDate = future.toISOString().split("T")[0];

  // Contradiction feasibility check
  const feasibility = evaluateIntakeFeasibility(eventType, guestCount, totalBudget, eventDate);

  const title =
    eventType === "WEDDING"
      ? "Celebratory Grand Wedding"
      : eventType === "BIRTHDAY"
      ? "Special Milestone Birthday Celebration"
      : "Community Grand Festive Gathering";

  return {
    title,
    eventType,
    guestCount,
    totalBudget,
    eventDate,
    location: "Celebration Lawn / Banquet, Central City",
    theme: eventType === "WEDDING" ? "Marigold & Royal Crimson" : eventType === "BIRTHDAY" ? "Neon Stars & Pastel Confetti" : "Festive Diya Saffron",
    notes: text,
    isContradiction: feasibility.isContradiction,
    contradictionReason: feasibility.contradictionReason,
    clarifyingQuestions: feasibility.clarifyingQuestions,
  };
}

/**
 * Offline Outreach Generator
 */
export function getOfflineOutreachDraft(category: string) {
  return {
    vendorCategory: category,
    whatsAppMessage:
      "Namaste {{VendorName}}! We are planning our {{EventType}} on {{EventDate}} in {{VenueLocation}} for approx {{GuestCount}} guests. We admire your portfolio and would like to check your availability, review menu/packages, and request a detailed estimate. Looking forward to connecting!",
    formalEmailSubject:
      "Vendor Inquiry: {{EventType}} Celebration on {{EventDate}} - {{GuestCount}} Guests",
    formalEmailBody:
      "Dear {{VendorName}} Team,\n\nWe are in the process of locking key vendor partnerships for our upcoming {{EventType}} scheduled for {{EventDate}} at {{VenueLocation}}.\n\nKey celebration details:\n- Expected Headcount: Approx {{GuestCount}} attendees\n- Date & Slot: {{EventDate}}\n\nCould you kindly share:\n1. Your current date availability and brochure packages\n2. Pricing structures and terms for extra hours/plates\n3. Advance booking deposit policies\n\nThank you,\n{{YourName}}\n{{ContactPhone}}",
    negotiationTips: [
      "Always request complimentary add-ons (e.g. extra live mocktail counter or extra teaser video) rather than direct fee discounts.",
      "Ask for a written 10% plate buffer tolerance before final headcount billing.",
      "Check whether electricity generator fuel and cleanup charges are explicitly bundled.",
    ],
    redFlagsToWatch: [
      "Vendor refuses a written contract or changes pricing verbally.",
      "No backup equipment or replacement staff clause in case of vendor illness.",
      "Unreasonable 100% advance demand prior to the event date.",
    ],
  };
}
