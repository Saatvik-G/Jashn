import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TaskUpdateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    const body = await req.json();
    const validated = TaskUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid task update data" }, { status: 400 });
    }

    const task = await prisma.timelineTask.update({
      where: { id: taskId, eventId: id },
      data: validated.data,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("PATCH /api/events/[id]/tasks/[taskId] error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
