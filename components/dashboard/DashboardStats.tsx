
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle } from "lucide-react";
import { type InventoryItem } from "@/lib/inventory-data";

interface DashboardStatsProps {
  items: InventoryItem[];
}

const categoryColors = {
  "Pig Feeds": "bg-pink-500",
  "Chicken Feeds": "bg-yellow-500",
  Cattle: "bg-orange-500",
  Goat: "bg-green-500",
  Rabbit: "bg-purple-500",
  Fish: "bg-blue-500",
  Pet: "bg-red-500",
  Others: "bg-gray-500",
};

export function DashboardStats({ items }: DashboardStatsProps) {
  const totalItems = items.length;
  const outOfStockItems = items.filter((item) => item.stock === 0).length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <Card className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base md:text-lg font-black text-black">
              TOTAL ITEMS
            </CardTitle>
            <Package className="h-6 w-6 md:h-8 md:w-8 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-5xl font-black text-black transform -rotate-3">
              {totalItems}
            </div>
            <p className="text-xs md:text-sm text-black font-bold mt-2">
              ITEMS IN INVENTORY
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base md:text-lg font-black text-black">
              OUT OF STOCK
            </CardTitle>
            <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-5xl font-black text-black transform rotate-3">
              {outOfStockItems}
            </div>
            <p className="text-xs md:text-sm text-black font-bold mt-2">
              ITEMS NEED RESTOCKING
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 border-b-4 border-black">
          <CardTitle className="text-xl md:text-2xl font-black text-black">
            📊 CATEGORY ANALYTICS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Object.entries(categoryColors).map(([category, colorClass]) => {
              const categoryItems = items.filter((item) => item.category === category);
              const outOfStockInCategory = categoryItems.filter((item) => item.stock === 0).length;
              const totalStock = categoryItems.reduce((sum, item) => sum + item.stock, 0);

              return (
                <div key={category} className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                  <div className={`${colorClass} p-3 border-b-4 border-black`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-white text-xs md:text-sm tracking-wide">
                        {category.toUpperCase()}
                      </h3>
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
                        <Package className="w-3 h-3 md:w-4 md:h-4 text-black" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-4">
                    <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3">
                      <div className="text-center p-2 bg-blue-50 border-2 border-black">
                        <div className="font-black text-blue-600 text-lg md:text-xl">
                          {categoryItems.length}
                        </div>
                        <div className="font-bold text-black text-xs">PRODUCTS</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 border-2 border-black">
                        <div className="font-black text-green-600 text-lg md:text-xl">
                          {totalStock}
                        </div>
                        <div className="font-bold text-black text-xs">TOTAL STOCK</div>
                      </div>
                    </div>

                    <div className={`w-full h-3 border-2 border-black relative overflow-hidden ${outOfStockInCategory === categoryItems.length ? "bg-red-200" : "bg-green-200"}`}>
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: `${categoryItems.length > 0 ? ((categoryItems.length - outOfStockInCategory) / categoryItems.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between mt-2 text-xs">
                      <span className="font-bold text-green-600">
                        {categoryItems.length - outOfStockInCategory} Available
                      </span>
                      <span className="font-bold text-red-600">
                        {outOfStockInCategory} Out
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
