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
  const totalInventoryValue = items.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const highestPrice = items.length > 0 ? Math.max(...items.map(item => item.price)) : 0;
  const lowestPrice = items.length > 0 ? Math.min(...items.map(item => item.price)) : 0;
  const averagePrice = items.length > 0 ? (items.reduce((sum, item) => sum + item.price, 0) / items.length) : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="professional-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Total Items
            </CardTitle>
            <Package className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {totalItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Items in inventory
            </p>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Total Value
            </CardTitle>
            <DollarSign className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ₱{totalInventoryValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Inventory value
            </p>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Low Stock
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Items ≤ 10 units
            </p>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardHeader className="bg-destructive text-white rounded-t-lg">
            <CardTitle className="text-sm font-semibold text-white uppercase tracking-wide">
              Out of Stock
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent className="bg-destructive text-white rounded-b-lg">
            <div className="text-3xl font-bold text-white">
              {outOfStockItems}
            </div>
            <p className="text-xs text-white/90 mt-1">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Summary */}
      <Card className="professional-card">
        <CardHeader className="professional-header">
          <CardTitle className="text-xl font-semibold text-white flex items-center">
            <Info className="h-5 w-5 mr-2" /> Inventory Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-primary text-lg">Stock Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                  <span className="font-medium text-foreground">In Stock Items</span>
                  <span className="font-semibold text-primary text-lg">
                    {items.filter(item => item.stock > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <span className="font-medium text-foreground">Out of Stock Items</span>
                  <span className="font-semibold text-destructive text-lg">
                    {outOfStockItems}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="font-medium text-foreground">Low Stock Items</span>
                  <span className="font-semibold text-orange-600 text-lg">
                    {lowStockItems}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-primary text-lg">Value & Pricing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="font-medium text-foreground">Total Inventory Value</span>
                  <span className="font-semibold text-primary text-lg">
                    ₱{totalInventoryValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="font-medium text-foreground">Highest Price Item</span>
                  <span className="font-semibold text-primary text-lg">
                    ₱{highestPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="font-medium text-foreground">Average Item Price</span>
                  <span className="font-semibold text-primary text-lg">
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
