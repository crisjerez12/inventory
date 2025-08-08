"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, TrendingUp, Info, BarChart3 } from 'lucide-react';
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
      {/* Welcome Section */}
      <div className="professional-card card-padding gradient-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-1 mb-2">Dashboard Overview</h1>
            <p className="body-text">Monitor your inventory performance and key metrics</p>
          </div>
          <div className="hidden md:block">
            <BarChart3 className="h-12 w-12 text-primary/20" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="professional-card animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">
              {totalItems}
            </div>
            <p className="text-sm text-muted-foreground">
              Products in stock
            </p>
          </CardContent>
        </Card>

        <Card className="professional-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">
              ₱{totalInventoryValue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Inventory value
            </p>
          </CardContent>
        </Card>

        <Card className="professional-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock
            </CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">
              {lowStockItems}
            </div>
            <p className="text-sm text-muted-foreground">
              Items ≤ 10 units
            </p>
          </CardContent>
        </Card>

        <Card className="professional-card animate-fade-in border-red-200" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">
              {outOfStockItems}
            </div>
            <p className="text-sm text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Summary */}
      <Card className="professional-card">
        <CardHeader className="professional-header">
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Inventory Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="card-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="heading-3 text-primary">Stock Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium text-foreground">In Stock Items</span>
                  <span className="font-bold text-green-600 text-lg">
                    {items.filter(item => item.stock > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="font-medium text-foreground">Out of Stock Items</span>
                  <span className="font-bold text-red-600 text-lg">
                    {outOfStockItems}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="font-medium text-foreground">Low Stock Items</span>
                  <span className="font-bold text-yellow-600 text-lg">
                    {lowStockItems}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="heading-3 text-primary">Value & Pricing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="font-medium text-foreground">Total Inventory Value</span>
                  <span className="font-bold text-blue-600 text-lg">
                    ₱{totalInventoryValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="font-medium text-foreground">Highest Price Item</span>
                  <span className="font-bold text-purple-600 text-lg">
                    ₱{highestPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <span className="font-medium text-foreground">Average Item Price</span>
                  <span className="font-bold text-indigo-600 text-lg">
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
