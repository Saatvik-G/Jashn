import { NextRequest, NextResponse } from "next/server";
import { draftVendorOutreach } from "@/lib/gemini/client";
import { z } from "zod";

const OutreachRequestSchema = z.object({
  category: z.string().min(2),
  eventType: z.string().default("Celebration"),
  location: z.string().default("City"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = OutreachRequestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid outreach request parameters" }, { status: 400 });
    }

    const { category, eventType, location } = validated.data;
    const result = await draftVendorOutreach(category, { eventType, location });

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/vendors/outreach error:", error);
    return NextResponse.json({ error: "Failed to draft outreach" }, { status: 500 });
  }
}
