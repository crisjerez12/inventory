"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "Admin") {
      return { success: false, error: "Unauthorized" };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function updateUser(
  userId: string,
  data: {
    username?: string;
    password?: string;
    role?: string;
  }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "Admin") {
      return { success: false, error: "Unauthorized" };
    }

    const updateData: any = {};
    
    if (data.username) {
      updateData.username = data.username;
    }
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    if (data.role) {
      updateData.role = data.role;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "Admin") {
      return { success: false, error: "Unauthorized" };
    }

    // Don't allow deleting yourself
    if (currentUser.id === userId) {
      return { success: false, error: "Cannot delete your own account" };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
