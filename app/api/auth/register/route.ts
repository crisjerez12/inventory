import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password, role = "Staff" } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const result = await createUser(username, password, role);

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
