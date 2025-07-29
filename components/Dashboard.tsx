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
  Printer,
  User,
  Loader2,
  Download,
  Calendar,
  Edit,
  UserX,
} from "lucide-react";
import { type InventoryItem } from "@/lib/inventory-data";
import { useToast } from "@/hooks/use-toast";

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

interface StaffUser {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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

  // Loading states
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingStaff, setIsUpdatingStaff] = useState(false);
  const [isDeletingStaff, setIsDeletingStaff] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockOperation, setStockOperation] = useState<"add" | "reduce">("add");
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Pig Feeds",
    stock: "" as string | number,
  });
  const [stockChange, setStockChange] = useState("" as string | number);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);
  const [staffForm, setStaffForm] = useState({ username: "", role: "Staff" });
  const [staffList, setStaffList] = useState<StaffUser[]>([]);

  // Print form states
  const [printForm, setPrintForm] = useState({
    reportType: "history", // history, outOfStock, inStock
    dateType: "specific", // specific, month, year
    specificDate: "",
    month: "",
    year: "",
  });

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
      const response = await fetch("/api/items");
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  const fetchStaff = async () => {
    if (user?.role !== "Admin") return;
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setStaffList(data.users.filter((u: StaffUser) => u.role === "Staff"));
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchStaff();
  }, [user]);

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
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && item.stock > 0) ||
        (stockFilter === "Out of Stock" && item.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [items, searchTerm, categoryFilter, stockFilter]);

  const totalItems = items.length;
  const outOfStockItems = items.filter((item) => item.stock === 0).length;
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

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          stock:
            typeof newItem.stock === "string"
              ? parseInt(newItem.stock) || 0
              : newItem.stock,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh items list
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
    }
  };

  const handleStockChange = async () => {
    if (!selectedItem) return;

    const changeAmount =
      typeof stockChange === "string"
        ? parseInt(stockChange) || 0
        : stockChange;

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
        // Refresh items list
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

  const handleRegisterUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim()) {
      toast({
        title: "VALIDATION ERROR",
        description: "Username and password are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          role: "Staff",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "USER REGISTERED",
          description: `New staff account "${newUser.username}" created successfully`,
        });
        setNewUser({ username: "", password: "" });
        setIsRegisterDialogOpen(false);
      } else {
        toast({
          title: "REGISTRATION FAILED",
          description: data.error || "Failed to create user account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "REGISTRATION ERROR",
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
        // Refresh items list
        fetchItems();

        // Adjust current page if needed
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

  // Format time for analog display
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      time: `${displayHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`,
      day: dayNames[date.getDay()],
      date: `${
        monthNames[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`,
    };
  };

  const openStockDialog = (item: InventoryItem, operation: "add" | "minus") => {
    setSelectedItem(item);
    setStockOperation(operation);
    setStockChange("");
    setIsStockDialogOpen(true);
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
            <Button
              onClick={() => setActiveTab("dashboard")}
              className={getTabButtonClass("dashboard")}
            >
              <BarChart3 className="h-4 w-4 lg:mr-2" />
              <span className="text-xs lg:text-base">DASHBOARD</span>
            </Button>
            <Button
              onClick={() => setActiveTab("items")}
              className={getTabButtonClass("items")}
            >
              <Box className="h-4 w-4 lg:mr-2" />
              <span className="text-xs lg:text-base">ITEMS</span>
            </Button>
            <Button
              onClick={() => setActiveTab("print")}
              className={getTabButtonClass("print")}
            >
              <Printer className="h-4 w-4 lg:mr-2" />
              <span className="text-xs lg:text-base">PRINT</span>
            </Button>
            {user?.role === "Admin" && (
              <Button
                onClick={() => setActiveTab("account")}
                className={getTabButtonClass("account")}
              >
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
            {/* Analog Clock Design */}
            <div className="text-center space-y-2">
              {/* Clock Face */}
              <div className="relative w-16 h-16 mx-auto mb-3">
                <div className="absolute inset-0 bg-white border-4 border-gray-300 rounded-full"></div>
                <div className="absolute inset-2 bg-gray-100 border-2 border-gray-400 rounded-full"></div>

                {/* Clock Numbers */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-black text-black">
                  12
                </div>
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-black text-black">
                  3
                </div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-black text-black">
                  6
                </div>
                <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-black text-black">
                  9
                </div>

                {/* Clock Hands */}
                <div
                  className="absolute top-1/2 left-1/2 w-0.5 bg-black origin-bottom transform -translate-x-1/2 -translate-y-full"
                  style={{
                    height: "20px",
                    transform: `translate(-50%, -100%) rotate(${
                      (currentTime.getHours() % 12) * 30 +
                      currentTime.getMinutes() * 0.5
                    }deg)`,
                  }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/2 w-0.5 bg-black origin-bottom transform -translate-x-1/2 -translate-y-full"
                  style={{
                    height: "24px",
                    transform: `translate(-50%, -100%) rotate(${
                      currentTime.getMinutes() * 6
                    }deg)`,
                  }}
                ></div>

                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 border border-black rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              {/* Digital Time */}
              <div className="space-y-1">
                <div className="font-black text-lg tracking-wider">
                  {formatTime(currentTime).time}
                </div>
                <div className="font-bold text-sm text-yellow-300">
                  {formatTime(currentTime).day}
                </div>
                <div className="font-bold text-xs text-gray-300">
                  {formatTime(currentTime).date}
                </div>
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
              <h1 className="text-lg md:text-xl font-black text-black transform -rotate-2">
                FEED INVENTORY
              </h1>
              <p className="text-xs md:text-sm text-black font-bold">
                MANAGE YOUR ANIMAL FEEDS
              </p>
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
        {activeTab === "dashboard" && (
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
                <CardDescription className="text-white font-bold opacity-90 text-sm md:text-base">
                  Comprehensive inventory distribution across all product
                  categories
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {Object.entries(categoryColors).map(
                    ([category, colorClass]) => {
                      const categoryItems = items.filter(
                        (item) => item.category === category
                      );
                      const outOfStockInCategory = categoryItems.filter(
                        (item) => item.stock === 0
                      ).length;
                      const totalStock = categoryItems.reduce(
                        (sum, item) => sum + item.stock,
                        0
                      );

                      return (
                        <div
                          key={category}
                          className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                        >
                          {/* Category Header */}
                          <div
                            className={`${colorClass} p-3 border-b-4 border-black`}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-black text-white text-xs md:text-sm tracking-wide">
                                {category.toUpperCase()}
                              </h3>
                              <div className="w-6 h-6 md:w-8 md:h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
                                <Package className="w-3 h-3 md:w-4 md:h-4 text-black" />
                              </div>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="p-3 md:p-4">
                            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3">
                              <div className="text-center p-2 bg-blue-50 border-2 border-black">
                                <div className="font-black text-blue-600 text-lg md:text-xl">
                                  {categoryItems.length}
                                </div>
                                <div className="font-bold text-black text-xs">
                                  PRODUCTS
                                </div>
                              </div>
                              <div className="text-center p-2 bg-green-50 border-2 border-black">
                                <div className="font-black text-green-600 text-lg md:text-xl">
                                  {totalStock}
                                </div>
                                <div className="font-bold text-black text-xs">
                                  TOTAL STOCK
                                </div>
                              </div>
                            </div>

                            {/* Status Bar */}
                            <div
                              className={`w-full h-3 border-2 border-black relative overflow-hidden ${
                                outOfStockInCategory === categoryItems.length
                                  ? "bg-red-200"
                                  : "bg-green-200"
                              }`}
                            >
                              <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{
                                  width: `${
                                    categoryItems.length > 0
                                      ? ((categoryItems.length -
                                          outOfStockInCategory) /
                                          categoryItems.length) *
                                        100
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>

                            <div className="flex justify-between mt-2 text-xs">
                              <span className="font-bold text-green-600">
                                {categoryItems.length - outOfStockInCategory}{" "}
                                Available
                              </span>
                              <span className="font-bold text-red-600">
                                {outOfStockInCategory} Out
                              </span>
                            </div>
                          </div>

                          {/* Status Indicator */}
                          <div className="absolute top-2 right-2">
                            <div
                              className={`w-3 h-3 rounded-full border-2 border-white ${
                                outOfStockInCategory === 0
                                  ? "bg-green-500"
                                  : outOfStockInCategory ===
                                    categoryItems.length
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                            ></div>
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
          <div className="space-y-4 md:space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-blue-400 border-b-4 border-black">
                <CardTitle className="text-lg md:text-xl font-black text-black">
                  🔍 SEARCH & FILTERS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div>
                    <Label className="font-black text-black mb-2 block text-sm">
                      SEARCH PRODUCTS
                    </Label>
                    <Input
                      placeholder="Enter product name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]"
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <Label className="font-black text-black mb-2 block text-sm">
                      FILTER BY CATEGORY
                    </Label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-4 border-black">
                        <SelectItem value="All" className="font-bold">
                          All Categories
                        </SelectItem>
                        {Object.keys(categoryColors).map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="font-bold"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <Label className="font-black text-black mb-2 block text-sm">
                      FILTER BY STOCK
                    </Label>
                    <Select value={stockFilter} onValueChange={setStockFilter}>
                      <SelectTrigger className="border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-4 border-black">
                        <SelectItem value="All" className="font-bold">
                          All Items
                        </SelectItem>
                        <SelectItem value="In Stock" className="font-bold">
                          In Stock Only
                        </SelectItem>
                        <SelectItem value="Out of Stock" className="font-bold">
                          Out of Stock Only
                        </SelectItem>
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
                    <CardTitle className="text-xl md:text-2xl font-black text-black">
                      INVENTORY ITEMS
                    </CardTitle>
                    <CardDescription className="text-black font-bold text-sm md:text-base">
                      MANAGE YOUR PRODUCT INVENTORY ({filteredItems.length}{" "}
                      items found)
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-400 hover:bg-blue-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        ADD ITEM
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
                      <DialogHeader>
                        <DialogTitle className="font-black text-black">
                          ADD NEW ITEM
                        </DialogTitle>
                        <DialogDescription className="font-bold text-black">
                          Enter product details for inventory registration
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="name"
                            className="text-right font-black text-black text-sm"
                          >
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={newItem.name}
                            onChange={(e) =>
                              setNewItem({ ...newItem, name: e.target.value })
                            }
                            className="col-span-3 border-4 border-black font-bold"
                            placeholder="Enter product name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="category"
                            className="text-right font-black text-black text-sm"
                          >
                            Category
                          </Label>
                          <Select
                            value={newItem.category}
                            onValueChange={(value) =>
                              setNewItem({ ...newItem, category: value })
                            }
                          >
                            <SelectTrigger className="col-span-3 border-4 border-black font-bold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-4 border-black">
                              {Object.keys(categoryColors).map((category) => (
                                <SelectItem
                                  key={category}
                                  value={category}
                                  className="font-bold"
                                >
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="stock"
                            className="text-right font-black text-black text-sm"
                          >
                            Stock
                          </Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newItem.stock}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                stock: e.target.value,
                              })
                            }
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
                          className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                          SUBMIT
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-4 border-black">
                        <TableHead className="font-black text-black text-lg">
                          PRODUCT NAME
                        </TableHead>
                        <TableHead className="font-black text-black text-lg">
                          CATEGORY
                        </TableHead>
                        <TableHead className="font-black text-black text-lg">
                          STOCK
                        </TableHead>
                        <TableHead className="font-black text-black text-lg">
                          ACTIONS
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((item) => (
                        <TableRow
                          key={item.id}
                          className="border-b-2 border-black"
                        >
                          <TableCell className="font-bold text-black">
                            {item.name}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 border-2 border-black font-black text-black text-xs ${
                                categoryColors[
                                  item.category as keyof typeof categoryColors
                                ]
                              }`}
                            >
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
                                onClick={() => openStockDialog(item, "add")}
                                size="sm"
                                className="bg-green-400 hover:bg-green-500 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => openStockDialog(item, "minus")}
                                disabled={item.stock === 0}
                                size="sm"
                                className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
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
                                <AlertDialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="font-black text-black">
                                      CONFIRM DELETION
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="font-bold text-black">
                                      Are you sure you want to permanently
                                      remove "{item.name}" from the inventory
                                      system? This action cannot be undone.
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
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {currentItems.map((item) => (
                    <Card
                      key={item.id}
                      className="bg-gradient-to-br from-white to-gray-50 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        {/* First Row - Product Name */}
                        <div className="mb-3">
                          <h3 className="font-black text-black text-lg leading-tight">
                            {item.name}
                          </h3>
                        </div>

                        {/* Second Row - Category and Stock */}
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span
                              className={`px-3 py-1 border-2 border-black font-black text-black text-xs ${
                                categoryColors[
                                  item.category as keyof typeof categoryColors
                                ]
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-gray-600 mb-1">
                              STOCK
                            </div>
                            <div className="font-black text-black text-lg">
                              {item.stock === 0 ? (
                                <span className="text-red-600 text-sm">
                                  OUT OF STOCK
                                </span>
                              ) : (
                                item.stock
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Third Row - Action Buttons */}
                        <div className="flex justify-center space-x-3">
                          <Button
                            onClick={() => openStockDialog(item, "add")}
                            size="sm"
                            className="bg-green-400 hover:bg-green-500 text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all px-4 py-2"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            ADD
                          </Button>
                          <Button
                            onClick={() => openStockDialog(item, "minus")}
                            disabled={item.stock === 0}
                            size="sm"
                            className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 px-4 py-2"
                          >
                            <Minus className="h-4 w-4 mr-1" />
                            MINUS
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-red-400 hover:bg-red-500 text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all px-4 py-2"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                DELETE
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-sm mx-4">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-black text-black">
                                  CONFIRM DELETION
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-bold text-black">
                                  Are you sure you want to permanently remove "
                                  {item.name}" from the inventory system? This
                                  action cannot be undone.
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
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 p-4 bg-gray-100 border-4 border-black">
                    <Button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                    >
                      PREVIOUS
                    </Button>

                    <div className="flex items-center space-x-2 overflow-x-auto">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 md:w-12 md:h-12 font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all ${
                              currentPage === page
                                ? "bg-green-400 text-black"
                                : "bg-white hover:bg-green-400 text-black"
                            }`}
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                    >
                      NEXT
                    </Button>
                  </div>
                )}

                {/* Items count info */}
                <div className="mt-4 text-center">
                  <p className="font-bold text-black text-sm">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredItems.length)} of{" "}
                    {filteredItems.length} items
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "account" && user?.role === "Admin" && (
          <div className="space-y-4 md:space-y-6">
            {/* User Profile Section */}
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-blue-400 border-b-4 border-black">
                <CardTitle className="text-xl md:text-2xl font-black text-black">
                  👤 USER PROFILE
                </CardTitle>
                <CardDescription className="text-black font-bold">
                  Current user information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border-4 border-black">
                      <h3 className="font-black text-black mb-2">USERNAME</h3>
                      <p className="text-lg font-bold text-green-600">
                        {user.username}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 border-4 border-black">
                      <h3 className="font-black text-black mb-2">ROLE</h3>
                      <p className="text-lg font-bold text-purple-600">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border-4 border-black">
                      <h3 className="font-black text-black mb-2">CREATED</h3>
                      <p className="text-sm font-bold text-blue-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 border-4 border-black">
                      <h3 className="font-black text-black mb-2">
                        LAST UPDATED
                      </h3>
                      <p className="text-sm font-bold text-orange-600">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Guidelines */}
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-green-400 border-b-4 border-black">
                <CardTitle className="text-xl md:text-2xl font-black text-black">
                  📋 SYSTEM GUIDELINES
                </CardTitle>
                <CardDescription className="text-black font-bold">
                  How to use the inventory management system effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-50 border-4 border-black">
                    <h3 className="font-black text-black mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      INVENTORY MANAGEMENT
                    </h3>
                    <ul className="space-y-2 text-sm font-bold text-black">
                      <li>
                        • Add new products using the "ADD ITEM" button in the
                        Items tab
                      </li>
                      <li>
                        • Use the search and filter options to find specific
                        products
                      </li>
                      <li>
                        • Monitor stock levels and restock when items are
                        running low
                      </li>
                      <li>
                        • Update stock quantities using the + and - buttons
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 border-4 border-black">
                    <h3 className="font-black text-black mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      USER ROLES
                    </h3>
                    <ul className="space-y-2 text-sm font-bold text-black">
                      <li>
                        • <strong>Admin:</strong> Full access to all features
                        including user management
                      </li>
                      <li>
                        • <strong>Staff:</strong> Access to inventory management
                        and reporting
                      </li>
                      <li>
                        • Only Admin users can access the Account tab and
                        register new users
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 border-4 border-black">
                    <h3 className="font-black text-black mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      IMPORTANT NOTES
                    </h3>
                    <ul className="space-y-2 text-sm font-bold text-black">
                      <li>
                        • Always double-check stock quantities before making
                        changes
                      </li>
                      <li>• Keep product names clear and descriptive</li>
                      <li>• Regularly monitor out-of-stock items</li>
                      <li>• Contact IT support for technical issues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Registration */}
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-purple-400 border-b-4 border-black">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black text-black">
                      👥 USER REGISTRATION
                    </CardTitle>
                    <CardDescription className="text-black font-bold">
                      Register new staff accounts (Admin only)
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isRegisterDialogOpen}
                    onOpenChange={setIsRegisterDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        REGISTER USER
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
                      <DialogHeader>
                        <DialogTitle className="font-black text-black">
                          REGISTER NEW STAFF
                        </DialogTitle>
                        <DialogDescription className="font-bold text-black">
                          Create a new staff account with default Staff role
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="newUsername"
                            className="text-right font-black text-black text-sm"
                          >
                            Username
                          </Label>
                          <Input
                            id="newUsername"
                            value={newUser.username}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                username: e.target.value,
                              })
                            }
                            className="col-span-3 border-4 border-black font-bold"
                            placeholder="Enter username"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="newPassword"
                            className="text-right font-black text-black text-sm"
                          >
                            Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                password: e.target.value,
                              })
                            }
                            className="col-span-3 border-4 border-black font-bold"
                            placeholder="Enter password"
                          />
                        </div>
                        <div className="p-3 bg-blue-50 border-2 border-black">
                          <p className="text-sm font-bold text-black">
                            <strong>Note:</strong> New accounts will be created
                            with Staff role by default.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => setIsRegisterDialogOpen(false)}
                          className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                          CANCEL
                        </Button>
                        <Button
                          onClick={handleRegisterUser}
                          className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                          REGISTER
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="p-4 bg-gray-50 border-4 border-black">
                  <h3 className="font-black text-black mb-3">
                    REGISTRATION PROCESS
                  </h3>
                  <ol className="space-y-2 text-sm font-bold text-black">
                    <li>1. Click the "REGISTER USER" button above</li>
                    <li>2. Enter a unique username for the new staff member</li>
                    <li>3. Set a secure password for the account</li>
                    <li>
                      4. The account will be created with Staff role
                      automatically
                    </li>
                    <li>
                      5. New users can immediately log in with their credentials
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "print" && (
          <div className="flex items-center justify-center h-full">
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
              <CardHeader className="bg-orange-400 border-b-4 border-black text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-black border-4 border-white flex items-center justify-center transform rotate-12">
                    <Printer className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl md:text-2xl font-black text-black transform -rotate-1">
                  PRINT FEATURE
                </CardTitle>
                <CardDescription className="text-black font-bold">
                  COMING SOON
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 text-center">
                <div className="space-y-4">
                  <div className="text-4xl md:text-6xl font-black text-gray-400 transform rotate-3">
                    🚧
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-black">
                    TO BE ADDED LATER
                  </h3>
                  <p className="text-black font-bold text-sm md:text-base">
                    This feature is currently under development and will be
                    available in a future update.
                  </p>
                  <div className="mt-6 p-4 bg-yellow-100 border-4 border-black">
                    <p className="text-sm font-bold text-black">
                      📋 PLANNED FEATURES:
                    </p>
                    <ul className="text-xs font-bold text-black mt-2 space-y-1">
                      <li>•Print Inventory Reports</li>
                      <li>•Inventory History</li>
                      <li>•Category Summaries</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation - Instagram Style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-yellow-400 border-t-4 border-black p-2">
        <div className="flex justify-around items-center">
          <Button
            onClick={() => setActiveTab("dashboard")}
            className={getTabButtonClass("dashboard")}
          >
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs font-black">DASHBOARD</span>
          </Button>
          <Button
            onClick={() => setActiveTab("items")}
            className={getTabButtonClass("items")}
          >
            <Box className="h-5 w-5 mb-1" />
            <span className="text-xs font-black">ITEMS</span>
          </Button>
          <Button
            onClick={() => setActiveTab("print")}
            className={getTabButtonClass("print")}
          >
            <Printer className="h-5 w-5 mb-1" />
            <span className="text-xs font-black">PRINT</span>
          </Button>
          {user?.role === "Admin" && (
            <Button
              onClick={() => setActiveTab("account")}
              className={getTabButtonClass("account")}
            >
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
                    <div className="font-black text-black">
                      📊 CURRENT STOCK
                    </div>
                    <div className="text-2xl font-black text-green-600">
                      {selectedItem.stock} units
                    </div>
                  </div>
                  {stockOperation === "add" && (
                    <div className="p-3 bg-blue-50 border-2 border-black">
                      <div className="font-black text-black">📈 IMPACT</div>
                      <div className="text-sm">
                        New stock will be:{" "}
                        <strong>
                          {selectedItem.stock +
                            (typeof stockChange === "string"
                              ? parseInt(stockChange) || 0
                              : stockChange)}{" "}
                          units
                        </strong>
                      </div>
                    </div>
                  )}
                  {stockOperation === "minus" && (
                    <div className="p-3 bg-yellow-50 border-2 border-black">
                      <div className="font-black text-black">📉 IMPACT</div>
                      <div className="text-sm">
                        New stock will be:{" "}
                        <strong>
                          {Math.max(
                            0,
                            selectedItem.stock -
                              (typeof stockChange === "string"
                                ? parseInt(stockChange) || 0
                                : stockChange)
                          )}{" "}
                          units
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
              <Label
                htmlFor="stockChange"
                className="text-right font-black text-black text-sm"
              >
                Quantity
              </Label>
              <Input
                id="stockChange"
                type="number"
                value={stockChange}
                onChange={(e) => setStockChange(e.target.value)}
                onFocus={() => handleInputFocus("stockChange")}
                className="col-span-3 border-4 border-black font-bold"
                placeholder={`Enter quantity to ${stockOperation}`}
                min="0"
                max={
                  stockOperation === "minus" ? selectedItem?.stock : undefined
                }
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
