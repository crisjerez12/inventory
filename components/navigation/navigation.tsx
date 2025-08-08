"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Box, Printer, User } from "lucide-react";
import type { User as UserType } from "@/lib/types";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType | null;
  variant?: "desktop" | "mobile";
}

export function Navigation({
  activeTab,
  setActiveTab,
  user,
  variant = "desktop",
}: NavigationProps) {
  // const isMobile = useIsMobile();

  // Don't render anything if it's a very small device and mobile variant
  // if (variant === "mobile" && isMobile && window.innerWidth < 480) {
  //   return null;
  // }

  const getTabButtonClass = (tabName: string) => {
    const isActive = activeTab === tabName;

    if (variant === "mobile") {
      return `flex flex-col items-center justify-center p-3 font-medium text-sm transition-colors ${
        isActive
          ? "bg-primary text-white shadow-md rounded-lg"
          : "bg-white text-foreground hover:bg-primary/10 hover:text-primary shadow-sm rounded-lg"
      }`;
    }

    return `flex items-center justify-start w-full p-3 font-medium transition-all duration-200 rounded-lg ${
      isActive
        ? "bg-primary text-white shadow-md"
        : "bg-white text-foreground hover:bg-primary/10 hover:text-primary shadow-sm hover:shadow-md"
    }`;
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "items", label: "Items", icon: Box },
    { id: "print", label: "Print", icon: Printer },
    ...(user?.role === "Admin"
      ? [{ id: "account", label: "Account", icon: User }]
      : []),
  ];

  if (variant === "mobile") {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 shadow-xl">
        <div className="flex justify-around items-center">
          {navigationItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              onClick={() => setActiveTab(id)}
              className={getTabButtonClass(id)}
              variant="ghost"
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">
                {variant === "mobile" && id === "dashboard" ? "Dash" : label}
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {navigationItems.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          onClick={() => setActiveTab(id)}
          className={getTabButtonClass(id)}
          variant="ghost"
        >
          <Icon className="h-5 w-5 mr-3" />
          <span className="font-medium">{label}</span>
        </Button>
      ))}
    </div>
  );
}
