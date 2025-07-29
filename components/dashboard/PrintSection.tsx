
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Download, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type InventoryItem } from "@/lib/inventory-data";

interface PrintSectionProps {
  items: InventoryItem[];
}

export function PrintSection({ items }: PrintSectionProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [printForm, setPrintForm] = useState({
    reportType: "history",
    dateType: "specific",
    specificDate: "",
    month: "",
    year: "",
  });
  const { toast } = useToast();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const generatePDF = async (reportType: string) => {
    setIsGeneratingPDF(true);
    
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          dateFilter: printForm,
          items: reportType === "outOfStock" ? items.filter(item => item.stock === 0) : 
                 reportType === "inStock" ? items.filter(item => item.stock > 0) : 
                 items,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${reportType}-report-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: "PDF GENERATED",
          description: `${reportType.toUpperCase()} report has been downloaded successfully`,
        });
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const isDateValid = () => {
    if (printForm.dateType === "specific") {
      if (!printForm.specificDate) return false;
      const selectedDate = new Date(printForm.specificDate);
      return selectedDate <= currentDate;
    } else if (printForm.dateType === "month") {
      if (!printForm.month || !printForm.year) return false;
      const selectedYear = parseInt(printForm.year);
      const selectedMonth = parseInt(printForm.month);
      return selectedYear < currentYear || (selectedYear === currentYear && selectedMonth <= currentMonth);
    } else if (printForm.dateType === "year") {
      if (!printForm.year) return false;
      return parseInt(printForm.year) <= currentYear;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Transaction History Report */}
      <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
        <CardHeader className="bg-blue-400 border-b-4 border-black">
          <CardTitle className="text-xl md:text-2xl font-black text-black flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            TRANSACTION HISTORY REPORT
          </CardTitle>
          <CardDescription className="text-black font-bold">
            Generate professional PDF reports for transaction history
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="font-black text-black mb-2 block text-sm">DATE TYPE</Label>
              <Select
                value={printForm.dateType}
                onValueChange={(value) => setPrintForm({ ...printForm, dateType: value })}
              >
                <SelectTrigger className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-4 border-black">
                  <SelectItem value="specific" className="font-bold">Specific Date</SelectItem>
                  <SelectItem value="month" className="font-bold">Month</SelectItem>
                  <SelectItem value="year" className="font-bold">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {printForm.dateType === "specific" && (
              <div>
                <Label className="font-black text-black mb-2 block text-sm">SELECT DATE</Label>
                <Input
                  type="date"
                  value={printForm.specificDate}
                  onChange={(e) => setPrintForm({ ...printForm, specificDate: e.target.value })}
                  max={currentDate.toISOString().split('T')[0]}
                  className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]"
                />
              </div>
            )}

            {printForm.dateType === "month" && (
              <>
                <div>
                  <Label className="font-black text-black mb-2 block text-sm">SELECT MONTH</Label>
                  <Select
                    value={printForm.month}
                    onValueChange={(value) => setPrintForm({ ...printForm, month: value })}
                  >
                    <SelectTrigger className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black">
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = i + 1;
                        const monthName = new Date(2024, i, 1).toLocaleString('default', { month: 'long' });
                        const disabled = printForm.year && parseInt(printForm.year) === currentYear && month > currentMonth;
                        return (
                          <SelectItem 
                            key={month} 
                            value={month.toString()} 
                            disabled={disabled}
                            className="font-bold"
                          >
                            {monthName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-black text-black mb-2 block text-sm">SELECT YEAR</Label>
                  <Select
                    value={printForm.year}
                    onValueChange={(value) => setPrintForm({ ...printForm, year: value })}
                  >
                    <SelectTrigger className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black">
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = currentYear - i;
                        return (
                          <SelectItem key={year} value={year.toString()} className="font-bold">
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {printForm.dateType === "year" && (
              <div>
                <Label className="font-black text-black mb-2 block text-sm">SELECT YEAR</Label>
                <Select
                  value={printForm.year}
                  onValueChange={(value) => setPrintForm({ ...printForm, year: value })}
                >
                  <SelectTrigger className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-black">
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = currentYear - i;
                      return (
                        <SelectItem key={year} value={year.toString()} className="font-bold">
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            onClick={() => generatePDF("history")}
            disabled={!isDateValid() || isGeneratingPDF}
            className="w-full bg-blue-400 hover:bg-blue-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            GENERATE HISTORY REPORT
          </Button>
        </CardContent>
      </Card>

      {/* Stock Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Out of Stock Report */}
        <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
          <CardHeader className="bg-red-400 border-b-4 border-black">
            <CardTitle className="text-xl font-black text-black">
              📋 OUT OF STOCK REPORT
            </CardTitle>
            <CardDescription className="text-black font-bold">
              Products that need restocking ({items.filter(item => item.stock === 0).length} items)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              onClick={() => generatePDF("outOfStock")}
              disabled={isGeneratingPDF}
              className="w-full bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Printer className="h-4 w-4 mr-2" />
              )}
              PRINT OUT OF STOCK
            </Button>
          </CardContent>
        </Card>

        {/* In Stock Report */}
        <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
          <CardHeader className="bg-green-400 border-b-4 border-black">
            <CardTitle className="text-xl font-black text-black">
              📦 IN STOCK REPORT
            </CardTitle>
            <CardDescription className="text-black font-bold">
              Available products in inventory ({items.filter(item => item.stock > 0).length} items)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              onClick={() => generatePDF("inStock")}
              disabled={isGeneratingPDF}
              className="w-full bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Printer className="h-4 w-4 mr-2" />
              )}
              PRINT IN STOCK
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
