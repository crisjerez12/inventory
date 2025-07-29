
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { type InventoryItem } from "@/lib/inventory-data";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  role: string;
}

interface ItemsTableProps {
  items: InventoryItem[];
  currentItems: InventoryItem[];
  onStockUpdate: (item: InventoryItem, operation: "add" | "reduce") => void;
  onDeleteItem: (item: InventoryItem) => void;
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

export function ItemsTable({ items, currentItems, onStockUpdate, onDeleteItem, user }: ItemsTableProps) {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleStockOperation = async (item: InventoryItem, operation: "add" | "reduce") => {
    const key = `${item.id}-${operation}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await onStockUpdate(item, operation);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleDelete = async (item: InventoryItem) => {
    const key = `${item.id}-delete`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await onDeleteItem(item);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
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
            {currentItems.map((item) => (
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
                      onClick={() => handleStockOperation(item, "add")}
                      disabled={loadingStates[`${item.id}-add`]}
                      size="sm"
                      className="bg-green-400 hover:bg-green-500 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
                    >
                      {loadingStates[`${item.id}-add`] ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleStockOperation(item, "reduce")}
                      disabled={item.stock === 0 || loadingStates[`${item.id}-reduce`]}
                      size="sm"
                      className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                    >
                      {loadingStates[`${item.id}-reduce`] ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={loadingStates[`${item.id}-delete`]}
                          size="sm"
                          className="bg-red-400 hover:bg-red-500 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
                        >
                          {loadingStates[`${item.id}-delete`] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-black text-black">CONFIRM DELETION</AlertDialogTitle>
                          <AlertDialogDescription className="font-bold text-black">
                            Are you sure you want to permanently remove "{item.name}" from the inventory system? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                            NO
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item)}
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {currentItems.map((item) => (
          <Card key={item.id} className="bg-gradient-to-br from-white to-gray-50 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="font-black text-black text-lg leading-tight">{item.name}</h3>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className={`px-3 py-1 border-2 border-black font-black text-black text-xs ${categoryColors[item.category as keyof typeof categoryColors]}`}>
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-600 mb-1">STOCK</div>
                  <div className="font-black text-black text-lg">
                    {item.stock === 0 ? (
                      <span className="text-red-600 text-sm">OUT OF STOCK</span>
                    ) : (
                      item.stock
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => handleStockOperation(item, "add")}
                  disabled={loadingStates[`${item.id}-add`]}
                  size="sm"
                  className="bg-green-400 hover:bg-green-500 text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all px-4 py-2 disabled:opacity-50"
                >
                  {loadingStates[`${item.id}-add`] ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-1" />
                  )}
                  ADD
                </Button>
                <Button
                  onClick={() => handleStockOperation(item, "reduce")}
                  disabled={item.stock === 0 || loadingStates[`${item.id}-reduce`]}
                  size="sm"
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 px-4 py-2"
                >
                  {loadingStates[`${item.id}-reduce`] ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Minus className="h-4 w-4 mr-1" />
                  )}
                  REDUCE
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={loadingStates[`${item.id}-delete`]}
                      size="sm"
                      className="bg-red-400 hover:bg-red-500 text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all px-4 py-2 disabled:opacity-50"
                    >
                      {loadingStates[`${item.id}-delete`] ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      DELETE
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-sm mx-4">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-black text-black">CONFIRM DELETION</AlertDialogTitle>
                      <AlertDialogDescription className="font-bold text-black">
                        Are you sure you want to permanently remove "{item.name}" from the inventory system? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                        NO
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item)}
                        className="bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        YES
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
