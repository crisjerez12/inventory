"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Search, Box } from 'lucide-react';
import { ItemsTable } from "./items-table";
import { StockDialog } from "./stock-dialog";
import { useInventory } from "@/hooks/use-inventory";
import type { InventoryItem, User, CustomerInfo } from "@/lib/types";

interface ItemsSectionProps {
  items: InventoryItem[];
  user: User | null;
  onItemsUpdate: () => void;
}

export function ItemsSection({ items, user, onItemsUpdate }: ItemsSectionProps) {
  const { addItem, updateStock, deleteItem } = useInventory(user);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Form states
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockOperation, setStockOperation] = useState<"add" | "reduce">("add");
  const [newItem, setNewItem] = useState({
    name: "",
    price: "" as string | number,
    stock: "" as string | number,
  });

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("All");

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      onItemsUpdate();
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [onItemsUpdate]);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && item.stock > 0) ||
        (stockFilter === "Out of Stock" && item.stock === 0) ||
        (stockFilter === "Low Stock" && item.stock > 0 && item.stock <= 10);

      return matchesSearch && matchesStock;
    });
  }, [items, searchTerm, stockFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.price) {
      return;
    }

    setIsAddingItem(true);
    const success = await addItem({
      name: newItem.name,
      price: typeof newItem.price === "string" ? parseFloat(newItem.price) || 0 : newItem.price,
      stock: typeof newItem.stock === "string" ? parseInt(newItem.stock) || 0 : newItem.stock,
    });

    if (success) {
      setNewItem({ name: "", price: "", stock: "" });
      setIsAddDialogOpen(false);
      setCurrentPage(1);
      onItemsUpdate(); // Immediate update
    }
    setIsAddingItem(false);
  };

  const handleStockUpdate = async (
    item: InventoryItem,
    operation: "add" | "reduce"
  ) => {
    setSelectedItem(item);
    setStockOperation(operation);
    setIsStockDialogOpen(true);
  };

  const handleStockSubmit = async (quantity: number, customerInfo?: CustomerInfo) => {
    if (!selectedItem) return;

    const success = await updateStock(
      selectedItem.id,
      stockOperation,
      quantity,
      customerInfo
    );

    if (success) {
      setIsStockDialogOpen(false);
      setSelectedItem(null);
      onItemsUpdate(); // Immediate update
    }
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    const success = await deleteItem(item.id);
    if (success) {
      const newTotalPages = Math.ceil((items.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      onItemsUpdate(); // Immediate update
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="professional-card">
        <CardHeader className="professional-header-secondary">
          <CardTitle className="text-xl font-semibold text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-medium text-foreground mb-2 block">
                Search Products
              </Label>
              <Input
                placeholder="Enter product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="professional-input"
              />
            </div>
            <div>
              <Label className="font-medium text-foreground mb-2 block">
                Filter by Stock
              </Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="professional-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="professional-select">
                  <SelectItem value="All">All Items</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock (≤10)</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card className="professional-card">
        <CardHeader className="professional-header">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Box className="h-5 w-5 mr-2" />
                Inventory Items
              </CardTitle>
              <CardDescription className="text-white/90">
                Manage your products ({filteredItems.length} items found)
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="professional-button-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="professional-card max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="font-semibold text-primary">
                    Add New Item
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Enter product details for inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right font-medium text-foreground">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="col-span-3 professional-input"
                      placeholder="Product name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right font-medium text-foreground">
                      Price
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="col-span-3 professional-input"
                      placeholder="₱ Price"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right font-medium text-foreground">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                      className="col-span-3 professional-input"
                      placeholder="Initial stock"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setIsAddDialogOpen(false)}
                    variant="outline"
                    className="border-2 border-border"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    disabled={isAddingItem}
                    className="professional-button-secondary"
                  >
                    {isAddingItem ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Add Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ItemsTable
            items={items}
            currentItems={currentItems}
            onStockUpdate={handleStockUpdate}
            onDeleteItem={handleDeleteItem}
            user={user}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 p-4 professional-card bg-muted/30">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="professional-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>

              <div className="flex items-center space-x-2 overflow-x-auto">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 ${
                      currentPage === page
                        ? "professional-button"
                        : "professional-button bg-white text-black hover:bg-primary hover:text-white"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="professional-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stock Dialog */}
      <StockDialog
        isOpen={isStockDialogOpen}
        onClose={() => setIsStockDialogOpen(false)}
        selectedItem={selectedItem}
        operation={stockOperation}
        onSubmit={handleStockSubmit}
      />
    </div>
  );
}
