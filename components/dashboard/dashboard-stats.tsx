"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, TrendingUp, Info } from 'lucide-react';
import type { InventoryItem } from "@/lib/types";

interface DashboardStatsProps {
  items: InventoryItem[];
}

export function DashboardStats({ items }: DashboardStatsProps) {
  const totalItems = items.length;
  const outOfStockItems = items.filter((item) => item.stock === 0).length;
  const lowStockItems = items.filter((item) => item.stock > 0 && item.stock <= 10).length;
  const highestPrice = items.length > 0 ? Math.max(...items.map(item => item.price)) : 0;
  const lowestPrice = items.length > 0 ? Math.min(...items.map(item => item.price)) : 0;
  const averagePrice = items.length > 0 ? (items.reduce((sum, item) => sum + item.price, 0) / items.length) : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="brutal-card-intense">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="brutal-typography-sm text-foreground">
              Total Items
            </CardTitle>
            <Package className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="brutal-typography-xl text-primary">
              {totalItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-bold uppercase tracking-wide">
              Items in inventory
            </p>
          </CardContent>
        </Card>

        <Card className="brutal-card-intense">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="brutal-typography-sm text-foreground">
              Low Stock
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="brutal-typography-xl text-orange-600">
              {lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-bold uppercase tracking-wide">
              Items ≤ 10 units
            </p>
          </CardContent>
        </Card>

        <Card className="brutal-card-intense">
          <CardHeader className="bg-destructive text-white border-b-6 border-black">
            <CardTitle className="brutal-typography-sm text-white">
              Out of Stock
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent className="bg-destructive text-white">
            <div className="brutal-typography-xl text-white">
              {outOfStockItems}
            </div>
            <p className="text-xs text-white/90 mt-1 font-bold uppercase tracking-wide">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Summary */}
      <Card className="brutal-card-intense">
        <CardHeader className="brutal-header border-b-6 border-black">
          <CardTitle className="brutal-typography-lg text-white flex items-center">
            <Info className="h-5 w-5 mr-2" /> Inventory Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="brutal-text-header text-primary text-base">Stock Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-100 border-4 border-black rounded-none shadow-[var(--shadow-brutal)]">
                  <span className="font-black text-foreground uppercase tracking-wide">In Stock Items</span>
                  <span className="brutal-typography-md text-primary">
                    {items.filter(item => item.stock > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-100 border-4 border-black rounded-none shadow-[var(--shadow-brutal)]">
                  <span className="font-black text-foreground uppercase tracking-wide">Out of Stock Items</span>
                  <span className="brutal-typography-md text-destructive">
                    {outOfStockItems}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-100 border-4 border-black rounded-none shadow-[var(--shadow-brutal)]">
                  <span className="font-black text-foreground uppercase tracking-wide">Low Stock Items</span>
                  <span className="brutal-typography-md text-orange-600">
                    {lowStockItems}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="brutal-text-header text-primary text-base">Value & Pricing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-100 border-4 border-black rounded-none shadow-[var(--shadow-brutal)]">
                  <span className="font-black text-foreground uppercase tracking-wide">Highest Price Item</span>
                  <span className="brutal-typography-md text-primary">
                    ₱{highestPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-100 border-4 border-black rounded-none shadow-[var(--shadow-brutal)]">
                  <span className="font-black text-foreground uppercase tracking-wide">Average Item Price</span>
                  <span className="brutal-typography-md text-primary">
                    ₱{averagePrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
