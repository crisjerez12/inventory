import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const historyType = searchParams.get("historyType");

    let whereClause: any = {};

    // Since date is stored as string, we need to filter differently
    if (startDate && endDate) {
      // Get all transactions and filter in memory, or use string comparison
      // For better performance, consider changing the schema to use DateTime
      const transactions = await prisma.transaction.findMany({
        where:
          historyType && historyType !== "all" ? { type: historyType } : {},
        orderBy: { createdAt: "desc" },
      });

      // Filter by date range in memory since date is stored as string
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });

      return NextResponse.json({
        success: true,
        transactions: filteredTransactions,
      });
    }

    if (historyType && historyType !== "all") {
      whereClause.type = historyType;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
