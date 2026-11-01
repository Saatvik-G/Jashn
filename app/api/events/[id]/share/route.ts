import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // 128-bit cryptographically secure random token (32 hex chars)
    const token = crypto.randomBytes(16).toString("hex");
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.event.update({
      where: { id },
      data: {
        shareToken: token,
        shareTokenExpiry: expiry,
      },
    });

    const shareUrl = `/share/${token}`;
    return NextResponse.json({ shareToken: token, shareUrl, expiry });
  } catch (error) {
    console.error("POST /api/events/[id]/share error:", error);
    return NextResponse.json({ error: "Failed to generate share link" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.event.update({
      where: { id },
      data: {
        shareToken: null,
        shareTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: "Share link revoked" });
  } catch (error) {
    console.error("DELETE /api/events/[id]/share error:", error);
    return NextResponse.json({ error: "Failed to revoke share link" }, { status: 500 });
  }
}
