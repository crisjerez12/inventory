import { NextRequest, NextResponse } from "next/server";
import { addInventoryItem, getInventoryItems } from "@/app/actions/inventory";

export async function GET() {
  try {
    const result = await getInventoryItems();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get items API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await addInventoryItem(data);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Add item API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
