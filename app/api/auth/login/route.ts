import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createDefaultAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Ensure default admin exists
  await createDefaultAdmin();
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const result = await authenticateUser(username, password);
    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
