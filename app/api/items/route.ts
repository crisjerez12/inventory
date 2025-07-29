import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all items
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST create new item
export async function POST(request: NextRequest) {
  try {
    const { name, category, stock, userId } = await request.json();

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: "Name and category are required" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        name,
        category,
        stock: stock || 0,
      },
    });

    // Create history record
    await prisma.history.create({
      data: {
        itemId: item.id,
        userId: userId || 1, // Default to admin if no user provided
        itemName: item.name,
        category: item.category,
        quantity: item.stock,
        action: "create",
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}
