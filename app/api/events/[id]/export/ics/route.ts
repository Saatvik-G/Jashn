import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as ics from "ics";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { timelineTasks: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Celebration not found" }, { status: 404 });
    }

    const eventsList: ics.EventAttributes[] = event.timelineTasks.map((task) => {
      const d = new Date(task.dueDate);
      return {
        title: `[${event.title}] ${task.title}`,
        description: `${task.notes || "Milestone Task"}\nPriority: ${task.priority}\nCategory: ${task.category}`,
        start: [d.getFullYear(), d.getMonth() + 1, d.getDate(), 9, 0],
        duration: { hours: 1 },
        status: task.status === "COMPLETED" ? "CONFIRMED" : "TENTATIVE",
        categories: [event.eventType, task.category],
      };
    });

    // Add celebration day itself
    const ed = new Date(event.eventDate);
    eventsList.push({
      title: `🎉 ${event.title} - Main Celebration Day!`,
      description: `Celebration Day at ${event.location}.\nHeadcount: ${event.guestCount} guests.\nTheme: ${event.theme || "Celebration"}`,
      start: [ed.getFullYear(), ed.getMonth() + 1, ed.getDate(), 10, 0],
      duration: { hours: 8 },
      status: "CONFIRMED",
      categories: [event.eventType, "MainEvent"],
    });

    const { error, value } = ics.createEvents(eventsList);

    if (error || !value) {
      console.error("ICS generation error:", error);
      return NextResponse.json({ error: "Failed to generate calendar file" }, { status: 500 });
    }

    return new Response(value, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${event.title.replace(/[^a-zA-Z0-9]/g, "_")}_schedule.ics"`,
      },
    });
  } catch (error) {
    console.error("GET /api/events/[id]/export/ics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
