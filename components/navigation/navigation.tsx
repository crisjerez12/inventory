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
          ? "bg-primary text-white shadow-[var(--shadow-brutal)] border-4 border-black rounded-none font-black"
          : "bg-white text-foreground hover:bg-primary/20 hover:text-primary border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none font-bold"
      }`;
    }

    return `flex items-center justify-start w-full p-4 font-black transition-colors rounded-none ${
      isActive
        ? "bg-primary text-white shadow-[var(--shadow-brutal)] border-4 border-black"
        : "bg-white text-foreground hover:bg-primary/20 hover:text-primary border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-6 border-black p-2 shadow-[var(--shadow-brutal-xl)]">
        <div className="flex justify-around items-center">
          {navigationItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              onClick={() => setActiveTab(id)}
              className={getTabButtonClass(id)}
              variant="ghost"
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-black uppercase tracking-widest">
                {variant === "mobile" && id === "dashboard" ? "Dash" : label}
              </span>
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
          <span className="uppercase tracking-widest font-black">{label}</span>
        </Button>
      ))}
    </div>
  );
}
