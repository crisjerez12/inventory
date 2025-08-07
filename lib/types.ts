export interface User {
  id: string;
  username: string;
  role: "Admin" | "Staff";
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  customerName: string;
  date: string;
  invoiceNumber: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: "add" | "reduce";
  quantity: number;
  price: number;
  totalAmount: number;
  customerName?: string;
  date: string;
  invoiceNumber?: string;
  userId: string;
  username: string;
  createdAt: string;
}

// Professional Category Colors
export const CATEGORY_COLORS = {
  "Pig Feeds": "bg-category-feeds",
  "Chicken Feeds": "bg-category-medicines", 
  "Cattle": "bg-category-supplements",
  "Goat": "bg-category-equipment",
  "Rabbit": "bg-category-feeds",
  "Fish": "bg-category-medicines",
  "Pet": "bg-category-supplements",
  "Others": "bg-category-others",
} as const;
