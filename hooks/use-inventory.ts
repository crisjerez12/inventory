"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem, User, CustomerInfo } from "@/lib/types";

export function useInventory(user: User | null) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const addItem = async (itemData: {
    name: string;
    price: number;
    stock: number;
  }) => {
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Item Added",
          description: `${itemData.name} has been added to inventory`,
        });
        await fetchItems(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add item",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateStock = async (
    itemId: string,
    action: "add" | "reduce",
    quantity: number,
    customerInfo?: CustomerInfo
  ) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          quantity,
          customerInfo,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Stock Updated",
          description: `Stock ${action === "add" ? "added" : "reduced"} successfully`,
        });
        await fetchItems(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update stock",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Item Deleted",
          description: "Item has been removed from inventory",
        });
        await fetchItems(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete item",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    items,
    isLoading,
    addItem,
    updateStock,
    deleteItem,
    refreshItems: fetchItems,
  };
}
