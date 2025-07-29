import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id);
    const { userId } = await request.json();

    // Get item details before deletion for history
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    // Create history record before deletion
    await prisma.history.create({
      data: {
        itemId: item.id,
        userId: userId || 1,
        itemName: item.name,
        category: item.category,
        quantity: 0,
        action: "delete",
      },
    });

    // Delete the item (history records will be cascade deleted)
    await prisma.item.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
