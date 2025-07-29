import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET history records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = itemId ? { itemId: parseInt(itemId) } : {};

    const history = await prisma.history.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, history });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
