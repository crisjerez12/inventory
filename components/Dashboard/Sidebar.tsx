
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package, BarChart3, Box, Printer, User, LogOut } from "lucide-react";

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: User | null;
}

export function Sidebar({ activeTab, setActiveTab, onLogout, user }: SidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTabButtonClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `flex flex-col items-center justify-center p-3 lg:p-4 lg:w-full lg:justify-start lg:flex-row font-black text-black border-4 border-black transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-[4px_4px_0px_0px_#000000] lg:shadow-[6px_6px_0px_0px_#000000] text-white"
        : "bg-white hover:bg-gradient-to-br hover:from-blue-300 hover:via-purple-400 hover:to-pink-400 hover:text-white shadow-[2px_2px_0px_0px_#000000] lg:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] lg:hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1"
    }`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    const dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ];
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return {
      time: `${displayHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`,
      day: dayNames[date.getDay()],
      date: `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
    };
  };

  return (
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
          <div className="text-center space-y-2">
            {/* Clock Face */}
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="absolute inset-0 bg-white border-4 border-gray-300 rounded-full"></div>
              <div className="absolute inset-2 bg-gray-100 border-2 border-gray-400 rounded-full"></div>

              {/* Clock Numbers */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-black text-black">12</div>
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-black text-black">3</div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-black text-black">6</div>
              <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-black text-black">9</div>

              {/* Clock Hands */}
              <div
                className="absolute top-1/2 left-1/2 w-0.5 bg-black origin-bottom transform -translate-x-1/2 -translate-y-full"
                style={{
                  height: "20px",
                  transform: `translate(-50%, -100%) rotate(${
                    (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5
                  }deg)`,
                }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 w-0.5 bg-black origin-bottom transform -translate-x-1/2 -translate-y-full"
                style={{
                  height: "24px",
                  transform: `translate(-50%, -100%) rotate(${currentTime.getMinutes() * 6}deg)`,
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
  );
}
