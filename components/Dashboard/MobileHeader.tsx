"use client";

import { Button } from "@/components/ui/button";
import { Package, LogOut } from "lucide-react";

interface MobileHeaderProps {
  onLogout: () => void;
}

export function MobileHeader({ onLogout }: MobileHeaderProps) {
  return (
    <div className="lg:hidden bg-yellow-400 border-b-4 border-black p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black border-4 border-white flex items-center justify-center transform rotate-12">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-black transform -rotate-2">
              MICROTEK INVENTORY
            </h1>
            <p className="text-xs md:text-sm text-black font-bold">
              MANAGE YOUR STOCKS
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
  );
}
