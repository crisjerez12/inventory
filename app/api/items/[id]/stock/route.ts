import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH update stock
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id);
    const { action, quantity, userId } = await request.json();

    if (!action || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid action and quantity are required" },
        { status: 400 }
      );
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    let newStock = item.stock;
    let historyQuantity = quantity;

    if (action === "add") {
      newStock = item.stock + quantity;
    } else if (action === "reduce") {
      if (quantity > item.stock) {
        return NextResponse.json(
          { success: false, error: "Insufficient stock" },
          { status: 400 }
        );
      }
      newStock = item.stock - quantity;
      historyQuantity = -quantity; // Negative for reduction
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Use 'add' or 'reduce'" },
        { status: 400 }
      );
    }

    // Update item stock
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { stock: newStock },
    });

    // Create history record
    await prisma.history.create({
      data: {
        itemId: item.id,
        userId: userId || 1,
        itemName: item.name,
        category: item.category,
        quantity: historyQuantity,
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
