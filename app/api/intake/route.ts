import { NextRequest, NextResponse } from "next/server";
import { parseEventIntake } from "@/lib/gemini/client";
import { z } from "zod";

const IntakeRequestSchema = z.object({
  prompt: z.string().min(5).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = IntakeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request. Please provide event details between 5 and 2000 characters." },
        { status: 400 }
      );
    }

    const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const result = await parseEventIntake(parsed.data.prompt, clientIp);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/intake error:", error);
    return NextResponse.json(
      { error: "Failed to process intake request. Please try again." },
      { status: 500 }
    );
  }
}
