"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import type { InventoryItem, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ItemsTableProps {
items: InventoryItem[];
currentItems: InventoryItem[];
onStockUpdate: (item: InventoryItem, operation: "add" | "reduce") => void;
onDeleteItem: (item: InventoryItem) => void;
user: User | null;
}

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

const getStockDisplay = (stock: number) => {
  if (stock === 0) {
    return <span className="stock-out">OUT OF STOCK</span>;
  } else if (stock <= 10) {
    return <span className="stock-low">{stock} (LOW)</span>;
  } else {
    return <span className="stock-good">{stock}</span>;
  }
};

return (
  <>
    {/* Desktop Table View */}
    <div className="hidden md:block">
      <div className="brutal-table bg-white rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="brutal-header rounded-t-lg">
              <TableHead className="font-bold text-white text-base uppercase tracking-wide py-4">PRODUCT NAME</TableHead>
              <TableHead className="font-bold text-white text-base uppercase tracking-wide py-4">PRICE</TableHead>
              <TableHead className="font-bold text-white text-base uppercase tracking-wide py-4">STOCK</TableHead>
              <TableHead className="font-bold text-white text-base uppercase tracking-wide py-4">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.id} className="border-b-2 border-gray-200 hover:bg-muted/30 transition-colors">
                <TableCell className="font-semibold text-foreground text-base py-4">{item.name}</TableCell>
                <TableCell className="font-semibold text-foreground text-base py-4">
                  ₱{item.price.toLocaleString()}
                </TableCell>
                <TableCell className="font-semibold py-4">
                  {getStockDisplay(item.stock)}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleStockOperation(item, "add")}
                      disabled={loadingStates[`${item.id}-add`]}
                      size="sm"
                      className="brutal-button-secondary px-4 py-2"
                    >
                      {loadingStates[`${item.id}-add`] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleStockOperation(item, "reduce")}
                      disabled={item.stock === 0 || loadingStates[`${item.id}-reduce`]}
                      size="sm"
                      className="brutal-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingStates[`${item.id}-reduce`] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={loadingStates[`${item.id}-delete`]}
                          size="sm"
                          className="brutal-button-destructive px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingStates[`${item.id}-delete`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="brutal-card bg-white max-w-md mx-4 rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-bold text-foreground text-lg uppercase tracking-wide">
                            ⚠️ CONFIRM DELETION
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground font-medium text-base">
                            ARE YOU SURE YOU WANT TO PERMANENTLY REMOVE "{item.name}" FROM THE INVENTORY? THIS ACTION CANNOT BE UNDONE!
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-4">
                          <AlertDialogCancel className="brutal-button bg-white text-black border-3 border-black font-semibold uppercase rounded-md">
                            CANCEL
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item)}
                            className="brutal-button-destructive"
                          >
                            DELETE
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
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-6">
      {currentItems.map((item) => (
        <Card key={item.id} className="brutal-card bg-white rounded-lg">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="font-bold text-foreground text-lg leading-tight uppercase tracking-wide">
                {item.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 brutal-card bg-primary/10 rounded-lg">
                <div className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wide">PRICE</div>
                <div className="font-bold text-primary text-xl">
                  ₱{item.price.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 brutal-card bg-secondary/10 rounded-lg">
                <div className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wide">STOCK</div>
                <div className="font-bold text-xl">
                  {getStockDisplay(item.stock)}
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => handleStockOperation(item, "add")}
                disabled={loadingStates[`${item.id}-add`]}
                size="sm"
                className="brutal-button-secondary px-6 py-3"
              >
                {loadingStates[`${item.id}-add`] ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5 mr-2" />
                )}
                ADD
              </Button>
              <Button
                onClick={() => handleStockOperation(item, "reduce")}
                disabled={item.stock === 0 || loadingStates[`${item.id}-reduce`]}
                size="sm"
                className="brutal-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingStates[`${item.id}-reduce`] ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Minus className="h-5 w-5 mr-2" />
                )}
                REDUCE
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={loadingStates[`${item.id}-delete`]}
                    size="sm"
                    className="brutal-button-destructive px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[`${item.id}-delete`] ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5 mr-2" />
                    )}
                    DELETE
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="brutal-card bg-white max-w-sm mx-4 rounded-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold text-foreground text-base uppercase tracking-wide">
                      ⚠️ CONFIRM DELETION
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground font-medium">
                      ARE YOU SURE YOU WANT TO PERMANENTLY REMOVE "{item.name}"? THIS ACTION CANNOT BE UNDONE!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel className="brutal-button bg-white text-black border-3 border-black font-semibold uppercase rounded-md">
                      CANCEL
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(item)}
                      className="brutal-button-destructive"
                    >
                      DELETE
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