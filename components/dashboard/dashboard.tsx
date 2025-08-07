"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navigation } from "@/components/navigation/navigation";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { ItemsSection } from "@/components/dashboard/items-section";
import { PrintSection } from "@/components/dashboard/print-section";
import { AccountSection } from "@/components/dashboard/account-section";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { User, InventoryItem } from "@/lib/types";

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Real-time updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchItems();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchItems]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardStats items={items} />;
      case "items":
        return <ItemsSection items={items} user={user} onItemsUpdate={fetchItems} />;
      case "print":
        return <PrintSection items={items} user={user} />;
      case "account":
        return <AccountSection user={user} />;
      default:
        return <DashboardStats items={items} />;
    }
  };

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar for desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        variant="mobile"
      />
    </div>
  );
}
