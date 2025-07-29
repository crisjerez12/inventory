
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { reportType, dateFilter, items } = await request.json();

    // Import dynamic modules
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF('p', 'mm', 'a4'); // A4 size for professional look
    
    // Company header with Microtek branding
    doc.setFillColor(30, 58, 138); // Navy blue matching Microtek logo
    doc.rect(0, 0, 210, 35, 'F');
    
    // Add decorative green stripe
    doc.setFillColor(134, 204, 22); // Green accent from logo
    doc.rect(0, 35, 210, 3, 'F');
    
    // Company name with neobrutalist styling
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MICROTEK', 15, 18);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Animal Feed Solutions', 15, 28);
    
    // Logo space (placeholder for now - would need actual logo implementation)
    doc.setFillColor(255, 255, 255);
    doc.rect(160, 8, 40, 20, 'F');
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(8);
    doc.text('MICROTEK LOGO', 165, 18);
    
    // Reset text color for body
    doc.setTextColor(0, 0, 0);
    
    // Report title with neobrutalist styling
    doc.setFillColor(134, 204, 22); // Green background
    doc.rect(15, 48, 180, 12, 'F');
    doc.setLineWidth(2);
    doc.setDrawColor(0, 0, 0);
    doc.rect(15, 48, 180, 12);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138); // Navy blue text
    let reportTitle = '';
    switch (reportType) {
      case 'history':
        reportTitle = 'TRANSACTION HISTORY REPORT';
        break;
      case 'outOfStock':
        reportTitle = 'OUT OF STOCK PRODUCTS REPORT';
        break;
      case 'inStock':
        reportTitle = 'IN STOCK PRODUCTS REPORT';
        break;
    }
    doc.text(reportTitle, 20, 57);
    
    // Date and time with neobrutalist box
    const now = new Date();
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.rect(15, 65, 100, 8, 'F');
    doc.setLineWidth(1);
    doc.rect(15, 65, 100, 8);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 18, 71);
    
    let startY = 80;
    
    if (reportType === 'history' && dateFilter) {
      let dateText = 'Period: ';
      if (dateFilter.dateType === 'specific') {
        dateText += `${new Date(dateFilter.specificDate).toLocaleDateString()}`;
      } else if (dateFilter.dateType === 'month') {
        const monthName = new Date(2024, parseInt(dateFilter.month) - 1, 1).toLocaleString('default', { month: 'long' });
        dateText += `${monthName} ${dateFilter.year}`;
      } else if (dateFilter.dateType === 'year') {
        dateText += `Year ${dateFilter.year}`;
      }
      
      // Period info box
      doc.setFillColor(255, 255, 255);
      doc.rect(120, 65, 75, 8, 'F');
      doc.setLineWidth(1);
      doc.setDrawColor(0, 0, 0);
      doc.rect(120, 65, 75, 8);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text(dateText, 123, 71);
      startY = 82;
    }
    
    // Reset text color for table
    doc.setTextColor(0, 0, 0);
    
    // Table data
    let tableData: any[][] = [];
    let headers: string[] = [];
    
    if (reportType === 'history') {
      const history = await prisma.history.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      
      headers = ['Date', 'Product', 'Category', 'Action', 'Qty', 'User'];
      tableData = history.map(record => [
        new Date(record.createdAt).toLocaleDateString(),
        record.itemName.length > 20 ? record.itemName.substring(0, 17) + '...' : record.itemName,
        record.category.length > 15 ? record.category.substring(0, 12) + '...' : record.category,
        record.action.toUpperCase(),
        record.quantity.toString(),
        `User ${record.userId}`
      ]);
    } else {
      headers = ['Product Name', 'Category', 'Stock', 'Status'];
      tableData = items.map((item: any) => [
        item.name.length > 25 ? item.name.substring(0, 22) + '...' : item.name,
        item.category.length > 15 ? item.category.substring(0, 12) + '...' : item.category,
        item.stock.toString(),
        item.stock === 0 ? 'OUT OF STOCK' : 'IN STOCK'
      ]);
    }
    
    // Neobrutalist table styling with Microtek colors
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: startY,
      margin: { left: 15, right: 15 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [0, 0, 0], // Black borders for neobrutalist look
        lineWidth: 1,
        fontStyle: 'bold',
      },
      headStyles: {
        fillColor: [30, 58, 138], // Navy blue header
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [134, 204, 22, 0.1], // Light green alternate rows
      },
      bodyStyles: {
        textColor: [30, 58, 138], // Navy blue text
      },
      columnStyles: reportType === 'history' ? {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 15 },
        5: { cellWidth: 20 },
      } : {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
      },
      didDrawPage: (data) => {
        // Add page numbers
        const pageCount = doc.internal.pages.length - 1;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, 180, 285);
      }
    });
    
    // Neobrutalist footer
    const finalY = (doc as any).lastAutoTable.finalY || startY + 50;
    
    // Footer background box
    doc.setFillColor(134, 204, 22); // Green background
    doc.rect(15, finalY + 10, 180, 15, 'F');
    doc.setLineWidth(2);
    doc.setDrawColor(0, 0, 0);
    doc.rect(15, finalY + 10, 180, 15);
    
    doc.setFontSize(8);
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.text('Generated by Microtek Feed Inventory Management System', 20, finalY + 18);
    doc.text(`Total Records: ${tableData.length}`, 20, finalY + 22);
    doc.text('© Microtek - Animal Feed Solutions', 120, finalY + 22);
    
    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${reportType}-report-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
