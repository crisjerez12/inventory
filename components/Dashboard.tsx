"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LogOut,
  Package,
  AlertTriangle,
  BarChart3,
  Box,
  Plus,
  Minus,
  Trash2,
  Clock,
} from "lucide-react";
import { inventoryData, type InventoryItem } from "@/lib/inventory-data";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onLogout: () => void;
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

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [items, setItems] = useState<InventoryItem[]>(inventoryData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockOperation, setStockOperation] = useState<'add' | 'minus'>('add');
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Pig Feeds",
    stock: 0,
  });
  const [stockChange, setStockChange] = useState(0);
  const { toast } = useToast();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalItems = items.length;
  const outOfStockItems = items.filter((item) => item.stock === 0).length;

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast({
        title: "VALIDATION ERROR",
        description: "Product name is required for inventory registration",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...items.map(item => item.id)) + 1;
    const itemToAdd: InventoryItem = {
      id: newId,
      name: newItem.name,
      category: newItem.category,
      stock: newItem.stock,
    };

    setItems([...items, itemToAdd]);
    setNewItem({ name: "", category: "Pig Feeds", stock: 0 });
    setIsAddDialogOpen(false);
    
    toast({
      title: "INVENTORY UPDATED",
      description: `New product "${newItem.name}" successfully added to inventory system`,
    });
  };

  const handleStockChange = () => {
    if (!selectedItem) return;

    if (stockOperation === 'minus' && stockChange > selectedItem.stock) {
      toast({
        title: "INSUFFICIENT INVENTORY",
        description: "Cannot reduce stock below zero. Please adjust quantity accordingly",
        variant: "destructive",
      });
      return;
    }

    const updatedItems = items.map(item => {
      if (item.id === selectedItem.id) {
        const newStock = stockOperation === 'add' 
          ? item.stock + stockChange 
          : item.stock - stockChange;
        return { ...item, stock: Math.max(0, newStock) };
      }
      return item;
    });

    setItems(updatedItems);
    setIsStockDialogOpen(false);
    setStockChange(0);
    
    const action = stockOperation === 'add' ? 'increased' : 'decreased';
    toast({
      title: "STOCK ADJUSTMENT COMPLETED",
      description: `Inventory for "${selectedItem.name}" successfully ${action} by ${stockChange} units`,
    });
  };

  const handleDeleteItem = (item: InventoryItem) => {
    const updatedItems = items.filter(i => i.id !== item.id);
    setItems(updatedItems);
    
    toast({
      title: "PRODUCT REMOVED",
      description: `"${item.name}" has been permanently removed from inventory database`,
    });
  };

  const openStockDialog = (item: InventoryItem, operation: 'add' | 'minus') => {
    setSelectedItem(item);
    setStockOperation(operation);
    setStockChange(0);
    setIsStockDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-cyan-300 flex">
      {/* Sidebar */}
      <div className="w-80 bg-yellow-400 border-r-8 border-black flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-4 border-black">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-black border-4 border-white flex items-center justify-center transform rotate-12">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black transform -rotate-2">
                FEED INVENTORY
              </h1>
              <p className="text-sm text-black font-bold">
                MANAGE YOUR ANIMAL FEEDS
              </p>
            </div>
          </div>
          
          {/* Current Time */}
          <div className="bg-black text-white p-3 border-4 border-white shadow-[4px_4px_0px_0px_#ffffff] transform -rotate-1">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-black text-sm">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="text-xs font-bold mt-1">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <Button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full justify-start font-black text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all ${
                activeTab === "dashboard" ? "bg-green-400" : "bg-white hover:bg-green-400"
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              DASHBOARD
            </Button>
            <Button
              onClick={() => setActiveTab("items")}
              className={`w-full justify-start font-black text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all ${
                activeTab === "items" ? "bg-green-400" : "bg-white hover:bg-green-400"
              }`}
            >
              <Box className="h-4 w-4 mr-2" />
              ITEMS
            </Button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t-4 border-black">
          <Button
            onClick={onLogout}
            className="w-full bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" />
            LOGOUT
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-black text-black">
                    TOTAL ITEMS
                  </CardTitle>
                  <Package className="h-8 w-8 text-black" />
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-black transform -rotate-3">
                    {totalItems}
                  </div>
                  <p className="text-sm text-black font-bold mt-2">
                    ITEMS IN INVENTORY
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-black text-black">
                    OUT OF STOCK
                  </CardTitle>
                  <AlertTriangle className="h-8 w-8 text-black" />
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-black transform rotate-3">
                    {outOfStockItems}
                  </div>
                  <p className="text-sm text-black font-bold mt-2">
                    ITEMS NEED RESTOCKING
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category Overview */}
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-purple-400 border-b-4 border-black">
                <CardTitle className="text-2xl font-black text-black">
                  CATEGORY OVERVIEW
                </CardTitle>
                <CardDescription className="text-black font-bold">
                  STOCK LEVELS BY CATEGORY
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(categoryColors).map(
                    ([category, colorClass]) => {
                      const categoryItems = items.filter(
                        (item) => item.category === category
                      );
                      const outOfStockInCategory = categoryItems.filter(
                        (item) => item.stock === 0
                      ).length;

                      return (
                        <div
                          key={category}
                          className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div
                              className={`w-6 h-6 border-2 border-black ${colorClass}`}
                            ></div>
                            <h3 className="font-black text-black text-sm">
                              {category}
                            </h3>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-black text-black text-lg">
                                {categoryItems.length}
                              </div>
                              <div className="font-bold text-black">ITEMS</div>
                            </div>
                            <div className="text-center">
                              <div className="font-black text-green-600 text-lg">
                                {categoryItems.length - outOfStockInCategory}
                              </div>
                              <div className="font-bold text-black">IN STOCK</div>
                            </div>
                            <div className="text-center">
                              <div className="font-black text-red-600 text-lg">
                                {outOfStockInCategory}
                              </div>
                              <div className="font-bold text-black">OUT</div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "items" && (
          <div className="space-y-6">
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-green-400 border-b-4 border-black">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-black text-black">
                      INVENTORY ITEMS
                    </CardTitle>
                    <CardDescription className="text-black font-bold">
                      MANAGE YOUR PRODUCT INVENTORY
                    </CardDescription>
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-400 hover:bg-blue-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        ADD ITEM
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                      <DialogHeader>
                        <DialogTitle className="font-black text-black">ADD NEW ITEM</DialogTitle>
                        <DialogDescription className="font-bold text-black">
                          Enter product details for inventory registration
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right font-black text-black">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="col-span-3 border-4 border-black font-bold"
                            placeholder="Enter product name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right font-black text-black">
                            Category
                          </Label>
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
                          <Label htmlFor="stock" className="text-right font-black text-black">
                            Stock
                          </Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newItem.stock}
                            onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
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
                          className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                          SUBMIT
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-4 border-black">
                      <TableHead className="font-black text-black text-lg">PRODUCT NAME</TableHead>
                      <TableHead className="font-black text-black text-lg">CATEGORY</TableHead>
                      <TableHead className="font-black text-black text-lg">STOCK</TableHead>
                      <TableHead className="font-black text-black text-lg">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className="border-b-2 border-black">
                        <TableCell className="font-bold text-black">{item.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 border-2 border-black font-black text-black text-xs ${categoryColors[item.category as keyof typeof categoryColors]}`}>
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell className="font-black text-black text-lg">
                          {item.stock === 0 ? (
                            <span className="text-red-600">OUT OF STOCK</span>
                          ) : (
                            item.stock
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => openStockDialog(item, 'add')}
                              size="sm"
                              className="bg-green-400 hover:bg-green-500 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => openStockDialog(item, 'minus')}
                              size="sm"
                              className="bg-yellow-400 hover:bg-yellow-500 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="bg-red-400 hover:bg-red-500 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-black text-black">
                                    CONFIRM DELETION
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="font-bold text-black">
                                    Are you sure you want to permanently remove "{item.name}" from the inventory system? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                                    NO
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteItem(item)}
                                    className="bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                                  >
                                    YES
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Stock Change Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
          <DialogHeader>
            <DialogTitle className="font-black text-black">
              {stockOperation === 'add' ? 'ADD STOCK' : 'REDUCE STOCK'}
            </DialogTitle>
            <DialogDescription className="font-bold text-black">
              {selectedItem && (
                <>
                  Current stock for "{selectedItem.name}": {selectedItem.stock} units
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockChange" className="text-right font-black text-black">
                Quantity
              </Label>
              <Input
                id="stockChange"
                type="number"
                value={stockChange}
                onChange={(e) => setStockChange(parseInt(e.target.value) || 0)}
                className="col-span-3 border-4 border-black font-bold"
                placeholder={`Enter quantity to ${stockOperation}`}
                min="0"
                max={stockOperation === 'minus' ? selectedItem?.stock : undefined}
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