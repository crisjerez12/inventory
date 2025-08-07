"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Box, Printer, User } from 'lucide-react';
import type { User as UserType } from "@/lib/types";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType | null;
  variant?: 'desktop' | 'mobile';
}

export function Navigation({ activeTab, setActiveTab, user, variant = 'desktop' }: NavigationProps) {
  const getTabButtonClass = (tabName: string) => {
    const isActive = activeTab === tabName;

    if (variant === 'mobile') {
      return `flex flex-col items-center justify-center p-3 font-medium text-sm transition-colors ${
        isActive 
          ? "bg-primary text-white shadow-md" 
          : "bg-white text-foreground hover:bg-muted border border-border"
      }`;
    }

    return `flex items-center justify-start w-full p-4 font-medium transition-colors rounded-lg ${
      isActive 
        ? "bg-primary text-white shadow-md" 
        : "bg-white text-foreground hover:bg-muted border border-border"
    }`;
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'items', label: 'Items', icon: Box },
    { id: 'print', label: 'Print', icon: Printer },
    ...(user?.role === "Admin" ? [{ id: 'account', label: 'Account', icon: User }] : []),
  ];

  if (variant === 'mobile') {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border p-2 shadow-lg">
        <div className="flex justify-around items-center">
          {navigationItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              onClick={() => setActiveTab(id)}
              className={getTabButtonClass(id)}
              variant="ghost"
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{variant === 'mobile' && id === 'dashboard' ? 'Dash' : label}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {navigationItems.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          onClick={() => setActiveTab(id)}
          className={getTabButtonClass(id)}
          variant="ghost"
        >
          <Icon className="h-5 w-5 mr-3" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
