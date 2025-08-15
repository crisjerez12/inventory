"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Clock } from 'lucide-react';
import { logout } from "@/app/actions/auth";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import type { User } from "@/lib/types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    onLogout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="professional-button p-2"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-border shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ borderRight: '6px solid black' }}>
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="p-6 brutal-header border-b-6 border-black">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white p-4 border-6 border-black shadow-[var(--shadow-brutal-xl)] rounded-none">
                <Image
                  src="/logo.jpg"
                  alt="Microtek Logo"
                  width={200}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="brutal-typography-lg text-center text-white">
              Inventory System
            </h1>
            <p className="text-sm text-white/90 mt-1 text-center font-black uppercase tracking-wide">
              Welcome, {user?.username}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <Navigation
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              user={user}
              variant="desktop"
            />
          </div>

          {/* Digital Clock */}
          <div className="p-4 border-t-6 border-black bg-yellow-100">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-black text-black uppercase tracking-widest">
                  Live Time
                </span>
              </div>
              <div className="text-xl font-black text-black">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-black font-bold uppercase tracking-wide">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t-6 border-black">
            <Button
              onClick={handleLogout}
              className="w-full brutal-button-destructive py-4 font-black"
            >
              <LogOut className="h-4 w-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
