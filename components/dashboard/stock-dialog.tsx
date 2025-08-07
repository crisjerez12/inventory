"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { InventoryItem, CustomerInfo } from "@/lib/types";

interface StockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: InventoryItem | null;
  operation: "add" | "reduce";
  onSubmit: (quantity: number, customerInfo?: CustomerInfo) => Promise<void>;
}

export function StockDialog({
  isOpen,
  onClose,
  selectedItem,
  operation,
  onSubmit,
}: StockDialogProps) {
  const [stockChange, setStockChange] = useState<string | number>(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    customerName: "",
    date: new Date().toISOString().split("T")[0],
    invoiceNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total amount automatically
  const totalAmount =
    selectedItem && operation === "reduce"
      ? (typeof stockChange === "string"
          ? parseInt(stockChange) || 0
          : stockChange) * selectedItem.price
      : 0;

  const handleSubmit = async () => {
    const quantity =
      typeof stockChange === "string"
        ? parseInt(stockChange) || 0
        : stockChange;

    if (quantity <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(
        quantity,
        operation === "reduce" ? customerInfo : undefined
      );

      // Reset form
      setStockChange(1);
      setCustomerInfo({
        customerName: "",
        date: new Date().toISOString().split("T")[0],
        invoiceNumber: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="brutal-card max-w-3xl mx-4 p-6">
        <DialogHeader>
          <DialogTitle className="font-bold text-primary uppercase tracking-wide">
            {operation === "add" ? "Add Stock" : "Reduce Stock"}
          </DialogTitle>
        </DialogHeader>
        <div
          className={`grid grid-cols-1 gap-6 py-4 ${
            operation === "reduce" ? "md:grid-cols-2" : ""
          }`}
        >
          {/* Left Column: Description */}
          <DialogDescription className="text-muted-foreground font-medium space-y-4">
            <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="font-semibold text-primary mb-2 uppercase tracking-wide text-sm">
                📦 Product Information
              </div>
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedItem.name}
                </div>
                <div>
                  <span className="font-semibold">Price:</span> ₱
                  {selectedItem.price.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="p-4 bg-secondary/10 border-2 border-secondary/20 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="font-semibold text-secondary mb-2 uppercase tracking-wide text-sm">
                📊 Current Stock
              </div>
              <div className="text-xl font-bold text-secondary">
                {selectedItem.stock} units
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                <span className="font-semibold">Current Value:</span> ₱
                {(selectedItem.stock * selectedItem.price).toLocaleString()}
              </div>
            </div>
            {operation === "reduce" && totalAmount > 0 && (
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="font-semibold text-orange-700 mb-2 uppercase tracking-wide text-sm">
                  💰 Transaction Value
                </div>
                <div className="text-lg font-bold text-orange-700">
                  ₱{totalAmount.toLocaleString()}
                </div>
                <div className="text-sm text-orange-600 font-medium">
                  {typeof stockChange === "string"
                    ? parseInt(stockChange) || 0
                    : stockChange}{" "}
                  units × ₱{selectedItem.price.toLocaleString()}
                </div>
              </div>
            )}
          </DialogDescription>

          {/* Right Column: Fields */}
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="stockChange"
                className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
              >
                Quantity
              </Label>
              <Input
                id="stockChange"
                type="number"
                value={stockChange}
                onChange={(e) => setStockChange(e.target.value)}
                className="col-span-3 brutal-input"
                placeholder={`Enter quantity to ${operation}`}
                min="0"
                max={operation === "reduce" ? selectedItem.stock : undefined}
              />
            </div>
            {operation === "reduce" && (
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="customerName"
                    className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
                  >
                    Customer
                  </Label>
                  <Input
                    id="customerName"
                    value={customerInfo.customerName}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        customerName: e.target.value,
                      })
                    }
                    className="col-span-3 brutal-input"
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="date"
                    className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
                  >
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={customerInfo.date}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, date: e.target.value })
                    }
                    className="col-span-3 brutal-input"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="invoiceNumber"
                    className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
                  >
                    Invoice
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={customerInfo.invoiceNumber}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        invoiceNumber: e.target.value,
                      })
                    }
                    className="col-span-3 brutal-input"
                    placeholder="Enter invoice number"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="brutal-button-neutral"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className={
              operation === "add"
                ? "brutal-button-success"
                : "brutal-button-warning"
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
