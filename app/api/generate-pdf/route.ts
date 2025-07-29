
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { reportType, dateFilter, items } = await request.json();

    // Import dynamic modules
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF('p', 'mm', 'a4'); // A4 size for professional look
    
    // Company header with professional styling
    doc.setFillColor(34, 49, 63); // Dark blue header
    doc.rect(0, 0, 210, 35, 'F');
    
    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVENTORY MANAGEMENT SYSTEM', 20, 15);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Animal Feed Supply Store', 20, 25);
    
    // Reset text color for body
    doc.setTextColor(0, 0, 0);
    
    // Report title with clean styling
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
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
    doc.text(reportTitle, 20, 50);
    
    // Date and time in smaller, clean format
    const now = new Date();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 20, 58);
    
    let startY = 65;
    
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
      doc.text(dateText, 20, 65);
      startY = 72;
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
    
    // Professional table styling
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: startY,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
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
    
    // Professional footer
    const finalY = (doc as any).lastAutoTable.finalY || startY + 50;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, finalY + 15, 190, finalY + 15);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Inventory Management System', 20, finalY + 22);
    doc.text(`Total Records: ${tableData.length}`, 20, finalY + 28);
    
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
