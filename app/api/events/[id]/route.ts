import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBudgetSummary } from "@/lib/engine/budget";
import { calculateTimelineSummary } from "@/lib/engine/timeline";
import { EventType, TimelineTaskData } from "@/lib/engine/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        budgetItems: true,
        timelineTasks: {
          orderBy: { dueDate: "asc" },
        },
        vendorCategories: {
          include: { quotes: true },
        },
        ideas: true,
        auditLogs: {
          orderBy: { appliedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Celebration not found" }, { status: 404 });
    }

    const eventDateStr = event.eventDate.toISOString().split("T")[0];

    // Compute deterministic summaries strictly in TypeScript
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

    return NextResponse.json({
      event,
      budgetSummary,
      timelineSummary,
    });
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete celebration" }, { status: 500 });
  }
}
