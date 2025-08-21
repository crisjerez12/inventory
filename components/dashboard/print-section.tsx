"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Download, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem, User } from "@/lib/types";

interface PrintSectionProps {
  items: InventoryItem[];
  user: User | null;
}

export function PrintSection({ items, user }: PrintSectionProps) {
  const [reportType, setReportType] = useState("inventory");
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [historyType, setHistoryType] = useState("reduce"); // Changed from "all" to "reduce"
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      let data;
      if (reportType === "inventory") {
        data = items;
      } else {
        // Fetch transaction data
        const response = await fetch(
          `/api/history?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&historyType=${historyType}`
        );
        const result = await response.json();
        data = result.success ? result.transactions : [];
      }

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          dateRange,
          data,
        }),
      });

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `microtek-${reportType}-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Report Generated",
          description:
            "Your report has been generated and downloaded successfully",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Generation Failed",
          description: errorData.error || "Failed to generate report",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="brutal-card">
        <CardHeader className="brutal-header">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <Printer className="h-5 w-5 mr-2" />
            Generate Reports
          </CardTitle>
          <CardDescription className="text-white/90">
            Create and download inventory and transaction reports
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label className="font-semibold text-foreground uppercase tracking-wide text-sm">
              Report Type
            </Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="brutal-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="brutal-select">
                <SelectItem value="inventory">Inventory Report</SelectItem>
                <SelectItem value="transactions">
                  Transaction History
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range for Transaction Reports */}
          {reportType === "transactions" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground uppercase tracking-wide text-sm">
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                    className="brutal-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground uppercase tracking-wide text-sm">
                    End Date
                  </Label>
                  <Input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                    className="brutal-input"
                  />
                </div>
              </div>
              // In the History Type selection section:
              <div className="space-y-2">
                <Label className="font-semibold text-foreground uppercase tracking-wide text-sm">
                  History Type
                </Label>
                <Select value={historyType} onValueChange={setHistoryType}>
                  <SelectTrigger className="brutal-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="brutal-select">
                    <SelectItem value="all">All Transactions</SelectItem>
                    {/* Removed: <SelectItem value="add">Stock In Only</SelectItem> */}
                    <SelectItem value="reduce">Stock Out Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full brutal-button-secondary py-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Generate & Download Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card className="brutal-card">
        <CardHeader className="brutal-header-secondary">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Report Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {" "}
            {/* Increased spacing from space-y-4 to space-y-6 */}
            <div className="p-6 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-bold text-black mb-4 uppercase tracking-wide text-sm">
                Report Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {" "}
                {/* Increased gap from gap-4 to gap-6 */}
                <div>
                  <span className="font-semibold">Type:</span>{" "}
                  {reportType === "inventory"
                    ? "Inventory Report"
                    : "Transaction History"}
                </div>
                <div>
                  <span className="font-semibold">Generated by:</span>{" "}
                  {user?.username}
                </div>
                {reportType === "transactions" && (
                  <>
                    <div>
                      <span className="font-semibold">Date Range:</span>{" "}
                      {dateRange.startDate} to {dateRange.endDate}
                    </div>
                    // In the preview section:
                    <div>
                      <span className="font-semibold">History Type:</span>{" "}
                      {historyType === "all"
                        ? "All Transactions"
                        : "Stock Out Only"}{" "}
                      {/* Removed stock in reference */}
                    </div>
                  </>
                )}
              </div>
            </div>
            {reportType === "inventory" && (
              <div className="p-4 bg-secondary/10 border-2 border-secondary/20 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                <h3 className="font-bold text-secondary mb-2 uppercase tracking-wide text-sm">
                  Inventory Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Total Items:</span>{" "}
                    {items.length}
                  </div>
                  <div>
                    <span className="font-semibold">Total Stock:</span>{" "}
                    {items.reduce((sum, item) => sum + item.stock, 0)}
                  </div>
                  <div>
                    <span className="font-semibold">Total Value:</span> ₱
                    {items
                      .reduce((sum, item) => sum + item.stock * item.price, 0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
