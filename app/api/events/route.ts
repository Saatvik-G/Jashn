import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDefaultBudget } from "@/lib/engine/budget";
import { generateDefaultTimeline } from "@/lib/engine/timeline";
import { EventType } from "@/lib/engine/types";
import { z } from "zod";

const CreateEventSchema = z.object({
  title: z.string().min(2).max(100),
  eventType: z.enum(["WEDDING", "BIRTHDAY", "COMMUNITY"]),
  guestCount: z.number().int().min(1).max(10000),
  totalBudget: z.number().positive().max(1000000000),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().min(2).max(100),
  notes: z.string().optional(),
  theme: z.string().optional(),
});

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
      include: {
        budgetItems: true,
        timelineTasks: true,
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to fetch celebrations." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateEventSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { title, eventType, guestCount, totalBudget, eventDate, location, notes, theme } =
      validated.data;

    // Deterministic Budget Generation
    const budgetItemsData = generateDefaultBudget(eventType as EventType, totalBudget);

    // Deterministic Timeline Generation
    const timelineTasksData = generateDefaultTimeline(eventType as EventType, eventDate);

    const event = await prisma.event.create({
      data: {
        title,
        eventType,
        guestCount,
        totalBudget,
        eventDate: new Date(eventDate),
        location,
        notes,
        theme,
        currency: "INR",
        budgetItems: {
          create: budgetItemsData.map((item) => ({
            category: item.category,
            allocatedAmount: item.allocatedAmount,
            spentAmount: 0,
            notes: item.notes,
          })),
        },
        timelineTasks: {
          create: timelineTasksData.map((task) => ({
            title: task.title,
            category: task.category,
            dueDate: new Date(task.dueDate),
            offsetDays: task.offsetDays,
            priority: task.priority,
            status: task.status,
            isCriticalPath: task.isCriticalPath,
            notes: task.notes,
          })),
        },
      },
      include: {
        budgetItems: true,
        timelineTasks: true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
  }
}
