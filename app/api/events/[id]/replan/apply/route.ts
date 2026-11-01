import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ApplyDiffSchema = z.object({
  guestCount: z.number().int().min(1).max(10000),
  totalBudget: z.number().positive().max(1000000000),
  eventDate: z.string().optional(),
  categoryDeltas: z.array(
    z.object({
      category: z.string(),
      afterAllocated: z.number().nonnegative(),
    })
  ),
  newTasks: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      dueDate: z.string(),
      offsetDays: z.number(),
      priority: z.string(),
      isCriticalPath: z.boolean(),
      notes: z.string().optional(),
    })
  ),
  reason: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { budgetItems: true, timelineTasks: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Celebration not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = ApplyDiffSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid diff data" }, { status: 400 });
    }

    const { guestCount, totalBudget, eventDate, categoryDeltas, newTasks, reason } =
      validated.data;

    const beforeSnapshot = JSON.stringify({
      guestCount: event.guestCount,
      totalBudget: event.totalBudget,
      eventDate: event.eventDate,
    });

    // Run transaction to ensure atomic consistency
    await prisma.$transaction(async (tx) => {
      // 1. Update event details
      await tx.event.update({
        where: { id },
        data: {
          guestCount,
          totalBudget,
          ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
        },
      });

      // 2. Update category budget items
      for (const delta of categoryDeltas) {
        const existing = event.budgetItems.find((b) => b.category === delta.category);
        if (existing) {
          await tx.budgetItem.update({
            where: { id: existing.id },
            data: { allocatedAmount: delta.afterAllocated },
          });
        }
      }

      // 3. Insert newly generated tasks
      for (const task of newTasks) {
        await tx.timelineTask.create({
          data: {
            eventId: id,
            title: task.title,
            category: task.category,
            dueDate: new Date(task.dueDate),
            offsetDays: task.offsetDays,
            priority: task.priority,
            isCriticalPath: task.isCriticalPath,
            status: "PENDING",
            notes: task.notes,
          },
        });
      }

      // 4. Log audit trail
      await tx.auditLog.create({
        data: {
          eventId: id,
          changeType: "PLAN_REBALANCE",
          description: reason || `Updated guests to ${guestCount}, budget to ₹${totalBudget.toLocaleString("en-IN")}.`,
          beforeSnapshot,
          afterSnapshot: JSON.stringify({ guestCount, totalBudget, eventDate }),
        },
      });
    });

    return NextResponse.json({ success: true, message: "Replanned changes applied successfully!" });
  } catch (error) {
    console.error("POST /api/events/[id]/replan/apply error:", error);
    return NextResponse.json({ error: "Failed to apply replan diff" }, { status: 500 });
  }
}
