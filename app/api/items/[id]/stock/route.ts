import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH update stock
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, quantity, userId } = await request.json();
    const itemId = parseInt(params.id);

    if (!["add", "reduce"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'add' or 'reduce'" },
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    // Get current item
    const currentItem = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!currentItem) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    // Calculate new stock
    let newStock;
    if (action === "add") {
      newStock = currentItem.stock + quantity;
    } else if (action === "reduce") {
      if (currentItem.stock < quantity) {
        return NextResponse.json(
          { success: false, error: "Cannot reduce stock below zero" },
          { status: 400 }
        );
      }
      newStock = currentItem.stock - quantity;
    }

    // Update item stock
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { stock: newStock },
    });

    // Create history record
    await prisma.history.create({
      data: {
        itemId: updatedItem.id,
        userId: userId || 1,
        itemName: updatedItem.name,
        category: updatedItem.category,
        quantity: quantity,
        action: action,
      },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update stock" },
      { status: 500 }
    );
  }
}