"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LogOut, Package, BarChart3, Box, Plus, Printer, User, Clock, Loader2 } from "lucide-react";
import { type InventoryItem } from "@/lib/inventory-data";
import { useToast } from "@/hooks/use-toast";

// Import new components
import { DashboardStats } from "./dashboard/DashboardStats";
import { ItemsTable } from "./dashboard/ItemsTable";
import { LoadingSpinner } from "./dashboard/LoadingSpinner";
import { PrintSection } from "./dashboard/PrintSection";
import { AccountSection } from "./dashboard/AccountSection";

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardProps {
  onLogout: () => void;
  user: User | null;
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

export function Dashboard({ onLogout, user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Form states
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockOperation, setStockOperation] = useState<"add" | "reduce">("add");
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Pig Feeds",
    stock: "" as string | number,
  });
  const [stockChange, setStockChange] = useState("" as string | number);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const { toast } = useToast();

  // Fetch functions
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/items");
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && item.stock > 0) ||
        (stockFilter === "Out of Stock" && item.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [items, searchTerm, categoryFilter, stockFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter]);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) {
      toast({
        title: "VALIDATION ERROR",
        description: "Product name is required for inventory registration",
        variant: "destructive",
      });
      return;
    }

    setIsAddingItem(true);
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          stock: typeof newItem.stock === "string" ? parseInt(newItem.stock) || 0 : newItem.stock,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchItems();
        setNewItem({ name: "", category: "Pig Feeds", stock: "" });
        setIsAddDialogOpen(false);
        setCurrentPage(1);

        toast({
          title: "INVENTORY UPDATED",
          description: `New product "${newItem.name}" successfully added to inventory system`,
        });
      } else {
        toast({
          title: "ERROR",
          description: data.error || "Failed to add item",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleStockChange = async () => {
    if (!selectedItem) return;

    const changeAmount = typeof stockChange === "string" ? parseInt(stockChange) || 0 : stockChange;

    if (changeAmount <= 0) {
      toast({
        title: "VALIDATION ERROR",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/items/${selectedItem.id}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: stockOperation,
          quantity: changeAmount,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchItems();
        setIsStockDialogOpen(false);
        setStockChange("");

        const action = stockOperation === "add" ? "increased" : "decreased";
        toast({
          title: "STOCK ADJUSTMENT COMPLETED",
          description: `Inventory for "${selectedItem.name}" successfully ${action} by ${changeAmount} units`,
        });
      } else {
        toast({
          title: "ERROR",
          description: data.error || "Failed to update stock",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchItems();
        const newTotalPages = Math.ceil((items.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        toast({
          title: "PRODUCT REMOVED",
          description: `"${item.name}" has been permanently removed from inventory database`,
        });
      } else {
        toast({
          title: "ERROR",
          description: data.error || "Failed to delete item",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }
  };

  const handleStockUpdate = async (item: InventoryItem, operation: "add" | "reduce") => {
    setSelectedItem(item);
    setStockOperation(operation);
    setStockChange(1); // Default value
    setIsStockDialogOpen(true);
  };

  // Format time for analog display
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return {
      time: `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`,
      day: dayNames[date.getDay()],
      date: `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
    };
  };

  const handleInputFocus = (inputType: "stock" | "stockChange") => {
    if (inputType === "stock") {
      setNewItem({ ...newItem, stock: "" });
    } else if (inputType === "stockChange") {
      setStockChange("");
    }
  };

  const getTabButtonClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `flex flex-col items-center justify-center p-3 lg:p-4 lg:w-full lg:justify-start lg:flex-row font-black text-black border-4 border-black transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-[4px_4px_0px_0px_#000000] lg:shadow-[6px_6px_0px_0px_#000000] text-white"
        : "bg-white hover:bg-gradient-to-br hover:from-blue-300 hover:via-purple-400 hover:to-pink-400 hover:text-white shadow-[2px_2px_0px_0px_#000000] lg:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] lg:hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1"
    }`;
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading inventory data..." />;
  }

  return (
    <div className="h-screen bg-cyan-300 flex flex-col lg:flex-row overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:flex w-80 bg-yellow-400 border-r-8 border-black flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b-4 border-black">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-black border-4 border-white flex items-center justify-center transform rotate-12">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black transform -rotate-2">
                INVENTORY SYSTEM
              </h1>
              <p className="text-sm text-black font-bold">
                MANAGE YOUR ANIMAL FEEDS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            <Button onClick={() => setActiveTab("dashboard")} className={getTabButtonClass("dashboard")}>
              <BarChart3 className="h-4 w-4 lg:mr-2" />
              <span className="text-xs lg:text-base">DASHBOARD</span>
            </Button>
            <Button onClick={() => setActiveTab("items")} className={getTabButtonClass("items")}>
              <Box className="h-4 w-4 lg:mr-2" />
              <span className="text-xs lg:text-base">ITEMS</span>
            </Button>
            <Button onClick={() => setActiveTab("print")} className={getTabButtonClass("print")}>
              <Printer className="h-4 w-4 lg:mr-2" />
              <span className="text-xs lg:text-base">PRINT</span>
            </Button>
            {user?.role === "Admin" && (
              <Button onClick={() => setActiveTab("account")} className={getTabButtonClass("account")}>
                <User className="h-4 w-4 lg:mr-2" />
                <span className="text-xs lg:text-base">ACCOUNT</span>
              </Button>
            )}
          </div>
        </div>

        {/* Time and Logout */}
        <div className="p-6 border-t-4 border-black space-y-4">
          {/* Current Time */}
          <div className="bg-gradient-to-br from-gray-800 to-black text-white p-4 border-4 border-white shadow-[6px_6px_0px_0px_#ffffff] transform -rotate-1">
            <div className="text-center space-y-2">
              <div className="relative w-16 h-16 mx-auto mb-3">
                <div className="absolute inset-0 bg-white border-4 border-gray-300 rounded-full"></div>
                <div className="absolute inset-2 bg-gray-100 border-2 border-gray-400 rounded-full"></div>

                {/* Clock Numbers */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-black text-black">12</div>
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-black text-black">3</div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-black text-black">6</div>
                <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-black text-black">9</div>

                {/* Clock Hands */}
                <div
                  className="absolute top-1/2 left-1/2 w-0.5 bg-black origin-bottom transform -translate-x-1/2 -translate-y-full"
                  style={{
                    height: "20px",
                    transform: `translate(-50%, -100%) rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5}deg)`,
                  }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/2 w-0.5 bg-black origin-bottom transform -translate-x-1/2 -translate-y-full"
                  style={{
                    height: "24px",
                    transform: `translate(-50%, -100%) rotate(${currentTime.getMinutes() * 6}deg)`,
                  }}
                ></div>

                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 border border-black rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              <div className="space-y-1">
                <div className="font-black text-lg tracking-wider">{formatTime(currentTime).time}</div>
                <div className="font-bold text-sm text-yellow-300">{formatTime(currentTime).day}</div>
                <div className="font-bold text-xs text-gray-300">{formatTime(currentTime).date}</div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={onLogout}
            className="w-full bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" />
            LOGOUT
          </Button>
        </div>
      </div>

      {/* Mobile/Tablet Header */}
      <div className="lg:hidden bg-yellow-400 border-b-4 border-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black border-4 border-white flex items-center justify-center transform rotate-12">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black text-black transform -rotate-2">FEED INVENTORY</h1>
              <p className="text-xs md:text-sm text-black font-bold">MANAGE YOUR ANIMAL FEEDS</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            className="bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all px-3 py-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-20 lg:pb-8">
        <Suspense fallback={<LoadingSpinner text="Loading content..." />}>
          {activeTab === "dashboard" && <DashboardStats items={items} />}

          {activeTab === "items" && (
            <div className="space-y-4 md:space-y-6">
              {/* Search and Filters */}
              <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                <CardHeader className="bg-blue-400 border-b-4 border-black">
                  <CardTitle className="text-lg md:text-xl font-black text-black">🔍 SEARCH & FILTERS</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="font-black text-black mb-2 block text-sm">SEARCH PRODUCTS</Label>
                      <Input
                        placeholder="Enter product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]"
                      />
                    </div>

                    <div>
                      <Label className="font-black text-black mb-2 block text-sm">FILTER BY CATEGORY</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-4 border-black">
                          <SelectItem value="All" className="font-bold">All Categories</SelectItem>
                          {Object.keys(categoryColors).map((category) => (
                            <SelectItem key={category} value={category} className="font-bold">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="font-black text-black mb-2 block text-sm">FILTER BY STOCK</Label>
                      <Select value={stockFilter} onValueChange={setStockFilter}>
                        <SelectTrigger className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-4 border-black">
                          <SelectItem value="All" className="font-bold">All Items</SelectItem>
                          <SelectItem value="In Stock" className="font-bold">In Stock Only</SelectItem>
                          <SelectItem value="Out of Stock" className="font-bold">Out of Stock Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                <CardHeader className="bg-green-400 border-b-4 border-black">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-black text-black">INVENTORY ITEMS</CardTitle>
                      <CardDescription className="text-black font-bold text-sm md:text-base">
                        MANAGE YOUR PRODUCT INVENTORY ({filteredItems.length} items found)
                      </CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-400 hover:bg-blue-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                          <Plus className="h-4 w-4 mr-2" />
                          ADD ITEM
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
                        <DialogHeader>
                          <DialogTitle className="font-black text-black">ADD NEW ITEM</DialogTitle>
                          <DialogDescription className="font-bold text-black">
                            Enter product details for inventory registration
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right font-black text-black text-sm">Name</Label>
                            <Input
                              id="name"
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              className="col-span-3 border-4 border-black font-bold"
                              placeholder="Enter product name"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right font-black text-black text-sm">Category</Label>
                            <Select
                              value={newItem.category}
                              onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                            >
                              <SelectTrigger className="col-span-3 border-4 border-black font-bold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="border-4 border-black">
                                {Object.keys(categoryColors).map((category) => (
                                  <SelectItem key={category} value={category} className="font-bold">
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right font-black text-black text-sm">Stock</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={newItem.stock}
                              onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                              onFocus={() => handleInputFocus("stock")}
                              className="col-span-3 border-4 border-black font-bold"
                              placeholder="Enter initial stock"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => setIsAddDialogOpen(false)}
                            className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                          >
                            CANCEL
                          </Button>
                          <Button
                            onClick={handleAddItem}
                            disabled={isAddingItem}
                            className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                          >
                            {isAddingItem ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            SUBMIT
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <ItemsTable
                    items={items}
                    currentItems={currentItems}
                    onStockUpdate={handleStockUpdate}
                    onDeleteItem={handleDeleteItem}
                    user={user}
                  />

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 p-4 bg-gray-100 border-4 border-black">
                      <Button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                      >
                        PREVIOUS
                      </Button>

                      <div className="flex items-center space-x-2 overflow-x-auto">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 md:w-12 md:h-12 font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all ${
                              currentPage === page ? "bg-green-400 text-black" : "bg-white hover:bg-green-400 text-black"
                            }`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                      >
                        NEXT
                      </Button>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <p className="font-bold text-black text-sm">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "print" && <PrintSection items={items} />}

          {activeTab === "account" && user?.role === "Admin" && <AccountSection user={user} />}
        </Suspense>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-yellow-400 border-t-4 border-black p-2">
        <div className="flex justify-around items-center">
          <Button onClick={() => setActiveTab("dashboard")} className={getTabButtonClass("dashboard")}>
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs font-black">DASHBOARD</span>
          </Button>
          <Button onClick={() => setActiveTab("items")} className={getTabButtonClass("items")}>
            <Box className="h-5 w-5 mb-1" />
            <span className="text-xs font-black">ITEMS</span>
          </Button>
          <Button onClick={() => setActiveTab("print")} className={getTabButtonClass("print")}>
            <Printer className="h-5 w-5 mb-1" />
            <span className="text-xs font-black">PRINT</span>
          </Button>
          {user?.role === "Admin" && (
            <Button onClick={() => setActiveTab("account")} className={getTabButtonClass("account")}>
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs font-black">ACCOUNT</span>
            </Button>
          )}
        </div>
      </div>

      {/* Stock Change Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="font-black text-black">
              {stockOperation === "add" ? "ADD STOCK" : "REDUCE STOCK"}
            </DialogTitle>
            <DialogDescription className="font-bold text-black">
              {selectedItem && (
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 border-2 border-black">
                    <div className="font-black text-black">📦 PRODUCT INFO</div>
                    <div className="text-sm">
                      <strong>Name:</strong> {selectedItem.name}
                    </div>
                    <div className="text-sm">
                      <strong>Category:</strong> {selectedItem.category}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 border-2 border-black">
                    <div className="font-black text-black">📊 CURRENT STOCK</div>
                    <div className="text-2xl font-black text-green-600">{selectedItem.stock} units</div>
                  </div>
                  {stockOperation === "add" && (
                    <div className="p-3 bg-blue-50 border-2 border-black">
                      <div className="font-black text-black">📈 IMPACT</div>
                      <div className="text-sm">
                        New stock will be:{" "}
                        <strong>
                          {selectedItem.stock + (typeof stockChange === "string" ? parseInt(stockChange) || 0 : stockChange)} units
                        </strong>
                      </div>
                    </div>
                  )}
                  {stockOperation === "reduce" && (
                    <div className="p-3 bg-yellow-50 border-2 border-black">
                      <div className="font-black text-black">📉 IMPACT</div>
                      <div className="text-sm">
                        New stock will be:{" "}
                        <strong>
                          {Math.max(0, selectedItem.stock - (typeof stockChange === "string" ? parseInt(stockChange) || 0 : stockChange))} units
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockChange" className="text-right font-black text-black text-sm">Quantity</Label>
              <Input
                id="stockChange"
                type="number"
                value={stockChange}
                onChange={(e) => setStockChange(e.target.value)}
                onFocus={() => handleInputFocus("stockChange")}
                className="col-span-3 border-4 border-black font-bold"
                placeholder={`Enter quantity to ${stockOperation}`}
                min="0"
                max={stockOperation === "reduce" ? selectedItem?.stock : undefined}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsStockDialogOpen(false)}
              className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleStockChange}
              className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              SUBMIT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}