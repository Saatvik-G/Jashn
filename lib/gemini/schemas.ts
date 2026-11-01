import { z } from "zod";

/**
 * Zod schemas for input validation and Gemini function calling parameters
 */

// Conversational Intake Parse Schema
export const IntakeParseSchema = z.object({
  title: z.string().min(2).max(100),
  eventType: z.enum(["WEDDING", "BIRTHDAY", "COMMUNITY"]),
  guestCount: z.number().int().min(1).max(10000),
  totalBudget: z.number().positive().max(1000000000),
  eventDate: z.string(),
  location: z.string().min(2).max(100),
  theme: z.string().optional(),
  notes: z.string().optional(),
  isContradiction: z.boolean(),
  contradictionReason: z.string().optional(),
  clarifyingQuestions: z.array(z.string()).optional(),
});

export type IntakeParseResult = z.infer<typeof IntakeParseSchema>;

// Gemini Function Calling Tool Argument Schemas
export const UpdateGuestCountArgsSchema = z.object({
  guestCount: z.number().int().min(1, "Guest count must be at least 1").max(10000, "Guest count cannot exceed 10,000"),
  reason: z.string().optional(),
});

export const ChangeBudgetArgsSchema = z.object({
  totalBudget: z.number().positive("Budget must be positive").max(1000000000, "Budget cannot exceed 100 Crore"),
  reason: z.string().optional(),
});

export const MoveDateArgsSchema = z.object({
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  reason: z.string().optional(),
});

export const AddTaskArgsSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters").max(120),
  category: z.string(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  notes: z.string().optional(),
});

export const ReassignBudgetArgsSchema = z.object({
  fromCategory: z.string(),
  toCategory: z.string(),
  amount: z.number().positive("Transfer amount must be positive"),
  reason: z.string().optional(),
});

// Ideas Schema
export const GeneratedIdeaSchema = z.object({
  type: z.enum(["THEME", "MENU", "DECOR", "ACTIVITY", "INVITATION"]),
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  minCost: z.number().nonnegative(),
  maxCost: z.number().positive(),
});

export const IdeasListSchema = z.object({
  ideas: z.array(GeneratedIdeaSchema),
});

// Outreach Drafting Schema
export const OutreachDraftSchema = z.object({
  vendorCategory: z.string(),
  whatsAppMessage: z.string().min(10),
  formalEmailSubject: z.string().min(5),
  formalEmailBody: z.string().min(20),
  negotiationTips: z.array(z.string()).min(1),
  redFlagsToWatch: z.array(z.string()).min(1),
});
