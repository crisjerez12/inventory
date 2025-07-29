
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { reportType, dateFilter, items } = await request.json();

    // Import dynamic modules
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF('p', 'mm', 'a4'); // A4 size for professional look
    
    // Professional header with company branding
    doc.setFillColor(30, 58, 138); // Navy blue
    doc.rect(0, 0, 210, 40, 'F');
    
    // Company logo area
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 8, 50, 24, 'F');
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(8);
    doc.text('MICROTEK', 18, 18);
    doc.text('LOGO', 18, 24);
    
    // Company information
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MICROTEK', 75, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Animal Feed Solutions', 75, 28);
    doc.text('Professional Inventory Management', 75, 34);
    
    // Contact information (right aligned)
    doc.setFontSize(8);
    doc.text('Email: info@microtek.com', 150, 20);
    doc.text('Phone: +1 (555) 123-4567', 150, 25);
    doc.text('www.microtek.com', 150, 30);
    
    // Professional line separator
    doc.setFillColor(134, 204, 22); // Green accent
    doc.rect(0, 40, 210, 2, 'F');
    
    // Reset text color for document body
    doc.setTextColor(0, 0, 0);
    
    // Document title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    let reportTitle = '';
    switch (reportType) {
      case 'history':
        reportTitle = 'INVENTORY TRANSACTION HISTORY REPORT';
        break;
      case 'outOfStock':
        reportTitle = 'OUT OF STOCK PRODUCTS REPORT';
        break;
      case 'inStock':
        reportTitle = 'IN STOCK PRODUCTS REPORT';
        break;
    }
    
    // Center the title
    const titleWidth = doc.getTextWidth(reportTitle);
    const pageWidth = doc.internal.pageSize.width;
    const titleX = (pageWidth - titleWidth) / 2;
    
    doc.text(reportTitle, titleX, 55);
    
    // Document metadata box
    doc.setFillColor(248, 250, 252); // Light gray background
    doc.rect(15, 65, 180, 20, 'F');
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, 65, 180, 20);
    
    // Report metadata
    const now = new Date();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Report Generated:', 20, 72);
    doc.text(`${now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })} at ${now.toLocaleTimeString('en-US')}`, 55, 72);
    
    doc.text('Report Type:', 20, 78);
    doc.text(reportTitle.toLowerCase().replace(/report/g, '').trim(), 55, 78);
    
    let startY = 92;
    
    if (reportType === 'history' && dateFilter) {
      let dateText = '';
      if (dateFilter.dateType === 'specific') {
        dateText = `Specific Date: ${new Date(dateFilter.specificDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`;
      } else if (dateFilter.dateType === 'month') {
        const monthName = new Date(2024, parseInt(dateFilter.month) - 1, 1).toLocaleString('default', { month: 'long' });
        dateText = `Period: ${monthName} ${dateFilter.year}`;
      } else if (dateFilter.dateType === 'year') {
        dateText = `Period: Year ${dateFilter.year}`;
      }
      
      doc.text('Report Period:', 120, 72);
      doc.text(dateText.replace(/Period: |Specific Date: /, ''), 155, 72);
      
      doc.text('Status:', 120, 78);
      doc.text('CONFIDENTIAL', 155, 78);
    } else {
      doc.text('Status:', 120, 72);
      doc.text('CONFIDENTIAL', 155, 72);
      
      doc.text('Classification:', 120, 78);
      doc.text('Internal Use Only', 155, 78);
    }
    
    // Table data preparation
    let tableData: any[][] = [];
    let headers: string[] = [];
    
    if (reportType === 'history') {
      const history = await prisma.history.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      
      headers = ['Date', 'Product Name', 'Category', 'Action', 'Quantity', 'User ID'];
      tableData = history.map(record => [
        new Date(record.createdAt).toLocaleDateString('en-US'),
        record.itemName.length > 30 ? record.itemName.substring(0, 27) + '...' : record.itemName,
        record.category,
        record.action.charAt(0).toUpperCase() + record.action.slice(1),
        record.quantity.toString(),
        record.userId.toString()
      ]);
    } else {
      headers = ['Product Name', 'Category', 'Stock Level', 'Status'];
      tableData = items.map((item: any) => [
        item.name.length > 35 ? item.name.substring(0, 32) + '...' : item.name,
        item.category,
        item.stock.toString(),
        item.stock === 0 ? 'OUT OF STOCK' : 'IN STOCK'
      ]);
    }
    
    // Professional table styling
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: startY,
      margin: { left: 15, right: 15 },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
        fontStyle: 'normal',
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [30, 58, 138], // Navy blue header
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Very light gray
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      columnStyles: reportType === 'history' ? {
        0: { cellWidth: 30, halign: 'center' },
        1: { cellWidth: 45 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 25, halign: 'center' },
      } : {
        0: { cellWidth: 70 },
        1: { cellWidth: 45 },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 35, halign: 'center' },
      },
      didDrawPage: (data) => {
        // Professional page footer
        const pageCount = doc.internal.pages.length - 1;
        
        // Footer line
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(15, 280, 195, 280);
        
        // Footer text
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('MICROTEK - Animal Feed Solutions | Confidential Document', 15, 287);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, 170, 287);
      }
    });
    
    // Document summary
    const finalY = (doc as any).lastAutoTable.finalY || startY + 50;
    
    // Summary box
    if (finalY < 240) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, finalY + 15, 180, 25, 'F');
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, finalY + 15, 180, 25);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('REPORT SUMMARY', 20, finalY + 25);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Records: ${tableData.length}`, 20, finalY + 32);
      doc.text(`Generated by: MICROTEK Inventory Management System v2.0`, 20, finalY + 37);
      
      doc.text('Document Classification: Internal Use Only', 110, finalY + 32);
      doc.text(`Report ID: MIK-${Date.now().toString().slice(-6)}`, 110, finalY + 37);
    }
    
    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="microtek-${reportType}-report-${Date.now()}.pdf"`,
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
