import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseReplanRequest } from "@/lib/gemini/client";
import { computeReplanDiff, ReplanInput } from "@/lib/engine/diff";
import { EventSnapshot, EventType, TimelineTaskData } from "@/lib/engine/types";
import { z } from "zod";

const ReplanRequestSchema = z.object({
  prompt: z.string().optional(),
  guestCount: z.number().int().min(1).max(10000).optional(),
  totalBudget: z.number().positive().max(1000000000).optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        budgetItems: true,
        timelineTasks: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Celebration not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = ReplanRequestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid replan request" }, { status: 400 });
    }

    let proposed: ReplanInput = {
      guestCount: validated.data.guestCount,
      totalBudget: validated.data.totalBudget,
      eventDate: validated.data.eventDate,
    };
    let explanation = "Plan adjustments calculated deterministically.";
    let toolInvoked = "none";
    let isOffline = false;

    // If natural language prompt was provided, parse with Gemini function calling
    if (validated.data.prompt && validated.data.prompt.trim().length > 0) {
      const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const parseResult = await parseReplanRequest(validated.data.prompt, clientIp);

      explanation = parseResult.explanation;
      toolInvoked = parseResult.tool;
      isOffline = parseResult.isOffline;

      if (parseResult.tool === "update_guest_count") {
        proposed.guestCount = parseResult.args.guestCount as number;
      } else if (parseResult.tool === "change_budget") {
        proposed.totalBudget = parseResult.args.totalBudget as number;
      } else if (parseResult.tool === "move_date") {
        proposed.eventDate = parseResult.args.eventDate as string;
      }
    }

    const currentSnapshot: EventSnapshot = {
      title: event.title,
      eventType: event.eventType as EventType,
      guestCount: event.guestCount,
      totalBudget: event.totalBudget,
      eventDate: event.eventDate.toISOString().split("T")[0],
      budgetItems: event.budgetItems,
      timelineTasks: event.timelineTasks.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        offsetDays: t.offsetDays,
        dueDate: t.dueDate.toISOString().split("T")[0],
        status: t.status as TimelineTaskData["status"],
        priority: t.priority as TimelineTaskData["priority"],
        isCriticalPath: t.isCriticalPath,
      })),
    };

    // Calculate deterministic diff (Rule 1 & Rule 4)
    const diff = computeReplanDiff(currentSnapshot, proposed);

    return NextResponse.json({
      diff,
      toolInvoked,
      explanation,
      proposed,
      isOffline,
    });
  } catch (error) {
    console.error("POST /api/events/[id]/replan error:", error);
    return NextResponse.json({ error: "Failed to compute plan diff" }, { status: 500 });
  }
}
