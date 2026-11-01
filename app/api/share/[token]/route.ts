import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBudgetSummary } from "@/lib/engine/budget";
import { calculateTimelineSummary } from "@/lib/engine/timeline";
import { EventType, TimelineTaskData } from "@/lib/engine/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const event = await prisma.event.findUnique({
      where: { shareToken: token },
      include: {
        budgetItems: true,
        timelineTasks: { orderBy: { dueDate: "asc" } },
        ideas: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Invalid or expired share link" }, { status: 404 });
    }

    if (event.shareTokenExpiry && new Date() > event.shareTokenExpiry) {
      return NextResponse.json({ error: "This share link has expired" }, { status: 410 });
    }

    const eventDateStr = event.eventDate.toISOString().split("T")[0];

    const budgetSummary = calculateBudgetSummary(
      event.budgetItems,
      event.totalBudget,
      event.guestCount,
      event.eventType as EventType
    );

    const mappedTasks: TimelineTaskData[] = event.timelineTasks.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      offsetDays: t.offsetDays,
      dueDate: t.dueDate.toISOString().split("T")[0],
      status: t.status as TimelineTaskData["status"],
      priority: t.priority as TimelineTaskData["priority"],
      isCriticalPath: t.isCriticalPath,
      notes: t.notes || undefined,
    }));

    const timelineSummary = calculateTimelineSummary(
      mappedTasks,
      eventDateStr,
      event.eventType as EventType
    );

    // Sanitized read-only projection (Strictly no PII, no edit routes)
    const readOnlyEvent = {
      title: event.title,
      eventType: event.eventType,
      eventDate: eventDateStr,
      guestCount: event.guestCount,
      totalBudget: event.totalBudget,
      currency: event.currency,
      location: event.location,
      theme: event.theme,
      notes: event.notes,
      ideas: event.ideas,
    };

    return NextResponse.json({
      event: readOnlyEvent,
      budgetSummary,
      timelineSummary,
      readOnly: true,
    });
  } catch (error) {
    console.error("GET /api/share/[token] error:", error);
    return NextResponse.json({ error: "Failed to load shared celebration" }, { status: 500 });
  }
}
