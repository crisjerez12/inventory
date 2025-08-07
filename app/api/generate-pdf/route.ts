import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { reportType, dateRange, data } = await request.json();

    // Validate data
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: "Invalid data provided" },
        { status: 400 }
      );
    }

    // Import dynamic modules
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF("p", "mm", "a4"); // A4 size for professional look

    // Professional header with company branding (Black and White)
    doc.setFillColor(0, 0, 0); // Black
    doc.rect(0, 0, 210, 40, "F");

    // Company logo area (White background, Black text)
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 8, 50, 24, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text("MICROTEK", 18, 18);
    doc.text("LOGO", 18, 24);

    // Company information (White text on Black background)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("MICROTEK", 75, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Animal Feed Solutions", 75, 28);
    doc.text("Professional Inventory Management", 75, 34);

    // Contact information (right aligned, White text)
    doc.setFontSize(8);
    doc.text("Email: info@microtek.com", 150, 20);
    doc.text("Phone: +1 (555) 123-4567", 150, 25);
    doc.text("www.microtek.com", 150, 30);

    // Professional line separator (Black)
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 40, 210, 2, "F");

    // Reset text color for document body
    doc.setTextColor(0, 0, 0);

    // Document title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    let reportTitle = "";
    switch (reportType) {
      case "inventory":
        reportTitle = "INVENTORY REPORT";
        break;
      case "transactions":
        reportTitle = "TRANSACTION HISTORY REPORT";
        break;
      default:
        reportTitle = "SYSTEM REPORT";
    }

    // Center the title
    const titleWidth = doc.getTextWidth(reportTitle);
    const pageWidth = doc.internal.pageSize.width;
    const titleX = (pageWidth - titleWidth) / 2;

    doc.text(reportTitle, titleX, 55);

    // Document metadata box (White background, Black border)
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 65, 180, 20, "F");
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0); // Black border
    doc.rect(15, 65, 180, 20);

    // Report metadata
    const now = new Date();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Report Generated:", 20, 72);
    doc.text(
      `${now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })} at ${now.toLocaleTimeString("en-US")}`,
      55,
      72
    );

    doc.text("Report Type:", 20, 78);
    doc.text(reportTitle, 55, 78);

    let startY = 92;

    if (reportType === "transactions" && dateRange) {
      doc.text("Report Period:", 120, 72);
      doc.text(`${dateRange.startDate} to ${dateRange.endDate}`, 155, 72);
      doc.text("Status:", 120, 78);
      doc.text("CONFIDENTIAL", 155, 78);
    } else {
      doc.text("Status:", 120, 72);
      doc.text("CONFIDENTIAL", 155, 72);
      doc.text("Classification:", 120, 78);
      doc.text("Internal Use Only", 155, 78);
    }

    // Table data preparation
    let tableData: any[][] = [];
    let headers: string[] = [];

    if (reportType === "transactions" && data.length > 0) {
      headers = [
        "Date",
        "Product Name",
        "Type",
        "Quantity",
        "Amount",
        "Customer",
      ];
      tableData = data.map((transaction: any) => [
        new Date(transaction.date).toLocaleDateString() || transaction.date,
        transaction.itemName?.length > 30
          ? transaction.itemName.substring(0, 27) + "..."
          : transaction.itemName || "N/A",
        transaction.type
          ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
          : "N/A",
        transaction.quantity?.toString() || "0",
        `₱${(transaction.totalAmount || 0).toFixed(2)}`,
        transaction.customerName || "-",
      ]);
    } else if (reportType === "inventory" && data.length > 0) {
      headers = ["Product Name", "Price", "Stock", "Total Value"];
      tableData = data.map((item: any) => [
        item.name?.length > 35
          ? item.name.substring(0, 32) + "..."
          : item.name || "N/A",
        `₱${(item.price || 0).toLocaleString()}`,
        (item.stock || 0).toString(),
        `₱${((item.price || 0) * (item.stock || 0)).toFixed(2)}`,
      ]);
    }

    // Only create table if we have data
    if (tableData.length > 0) {
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: startY,
        margin: { left: 15, right: 15 },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: [0, 0, 0], // Black lines
          lineWidth: 0.5,
          fontStyle: "normal",
          textColor: [0, 0, 0], // Black text
        },
        headStyles: {
          fillColor: [255, 255, 255], // White header (transparent)
          textColor: [0, 0, 0], // Black text
          fontStyle: "bold",
          fontSize: 10,
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255], // White for all rows (transparent)
        },
        bodyStyles: {
          textColor: [0, 0, 0], // Black text
        },

        columnStyles:
          reportType === "transactions"
            ? {
                0: { cellWidth: 25, halign: "center" },
                1: { cellWidth: 40 },
                2: { cellWidth: 20, halign: "center" },
                3: { cellWidth: 20, halign: "center" },
                4: { cellWidth: 25, halign: "center" },
                5: { cellWidth: 40 },
              }
            : {
                0: { cellWidth: 80 },
                1: { cellWidth: 30, halign: "center" },
                2: { cellWidth: 20, halign: "center" },
                3: { cellWidth: 40, halign: "center" },
              },
        didDrawPage: (data) => {
          const pageCount = doc.internal.pages.length - 1;
          doc.setLineWidth(0.5);
          doc.setDrawColor(0, 0, 0);
          doc.line(15, 280, 195, 280);
          doc.setFontSize(8);
          doc.setTextColor(50, 50, 50);
          doc.setFont("helvetica", "normal");
          doc.text(
            "MICROTEK - Animal Feed Solutions | Confidential Document",
            15,
            287
          );
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, 170, 287);
        },
      });
    } else {
      // Add "No data available" message
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        "No data available for the selected criteria.",
        105,
        startY + 30,
        { align: "center" }
      );
    }

    // Document summary (Black and White)
    const finalY = (doc as any).lastAutoTable?.finalY || startY + 50;

    if (finalY < 240) {
      doc.setFillColor(255, 255, 255); // White
      doc.rect(15, finalY + 15, 180, 25, "F");
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0); // Black
      doc.rect(15, finalY + 15, 180, 25);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Black
      doc.text("REPORT SUMMARY", 20, finalY + 25);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Black
      doc.text(`Total Records: ${tableData.length}`, 20, finalY + 32);
      doc.text(
        "Generated by: MICROTEK Inventory Management System v2.1",
        20,
        finalY + 37
      );
      doc.text("Document Classification: Internal Use Only", 110, finalY + 32);
      doc.text(
        `Report ID: MIK-${reportType.toUpperCase()}-${Date.now()
          .toString()
          .slice(-6)}`,
        110,
        finalY + 37
      );
    }

    // Generate PDF as binary string and convert to buffer
    const pdfOutput = doc.output("blob");
    const arrayBuffer = await pdfOutput.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="microtek-${reportType}-report-${Date.now()}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
