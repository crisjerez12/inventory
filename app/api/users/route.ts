import { NextResponse } from "next/server";
import { getUsers } from "@/app/actions/users";

export async function GET() {
  try {
    const result = await getUsers();
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error("Get users API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
