"use server";

import { prisma } from "@/lib/prisma";
import { createAuthToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, message: "Invalid credentials" };
    }

    const token = createAuthToken(user.id);
    
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { 
      success: true, 
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

export async function register(username: string, password: string, role: string = "Staff") {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { success: false, message: "Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    return { 
      success: true, 
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "An error occurred during registration" };
  }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    // Get current user from token
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token.value, process.env.SESSION_SECRET) as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.error("Password update error:", error);
    return { success: false, message: "An error occurred while updating password" };
  }
}

export async function logout() {
  cookies().delete("auth-token");
  redirect("/");
}
