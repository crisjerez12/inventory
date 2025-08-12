"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addInventoryItem(data: {
  name: string;
  price: number;
  stock: number;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock,
      },
    });

    // Log the transaction
    await prisma.transaction.create({
      data: {
        itemId: item.id,
        itemName: item.name,
        type: "add",
        quantity: data.stock,
        price: data.price,
        totalAmount: data.stock * data.price,
        date: new Date().toISOString(),
        userId: user.id,
        username: user.username,
      },
    });

    revalidatePath("/");
    return { success: true, item };
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return { success: false, error: "Failed to add item" };
  }
}

export async function updateInventoryStock(
  itemId: string,
  action: "add" | "reduce",
  quantity: number,
  customerInfo?: {
    customerName: string;
    date: string;
    invoiceNumber: string;
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    let newStock: number;
    if (action === "add") {
      newStock = item.stock + quantity;
    } else {
      if (item.stock < quantity) {
        return { success: false, error: "Insufficient stock" };
      }
      newStock = item.stock - quantity;
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { stock: newStock },
    });

    // Log the transaction
    await prisma.transaction.create({
      data: {
        itemId: item.id,
        itemName: item.name,
        type: action,
        quantity: quantity,
        price: item.price,
        totalAmount: quantity * item.price,
        customerName: customerInfo?.customerName || null,
        date: customerInfo?.date ? new Date(customerInfo.date) : new Date(),
        invoiceNumber: customerInfo?.invoiceNumber || null,
        userId: user.id,
        username: user.username,
      },
    });

    revalidatePath("/");
    return { success: true, item: updatedItem };
  } catch (error) {
    console.error("Error updating inventory stock:", error);
    return { success: false, error: "Failed to update stock" };
  }
}

export async function deleteInventoryItem(itemId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete related transactions first
    await prisma.transaction.deleteMany({
      where: { itemId },
    });

    // Delete the item
    await prisma.inventoryItem.delete({
      where: { id: itemId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function getInventoryItems() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, items };
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return { success: false, error: "Failed to fetch items", items: [] };
  }
}
