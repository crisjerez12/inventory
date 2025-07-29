
"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Box, Printer, User } from "lucide-react";

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
}

export function MobileNavigation({ activeTab, setActiveTab, user }: MobileNavigationProps) {
  const getTabButtonClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `flex flex-col items-center justify-center p-3 lg:p-4 lg:w-full lg:justify-start lg:flex-row font-black text-black border-4 border-black transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-[4px_4px_0px_0px_#000000] lg:shadow-[6px_6px_0px_0px_#000000] text-white"
        : "bg-white hover:bg-gradient-to-br hover:from-blue-300 hover:via-purple-400 hover:to-pink-400 hover:text-white shadow-[2px_2px_0px_0px_#000000] lg:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] lg:hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1"
    }`;
  };

  return (
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
  );
}
