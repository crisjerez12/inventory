"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Clock, Building2 } from 'lucide-react';
import { logout } from "@/app/actions/auth";
import { useToast } from "@/hooks/use-toast";
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
      `}>
        <div className="flex flex-col h-full">
          {/* Professional Header with Branding */}
          <div className="section-padding professional-header">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white mb-1">
                MICROTEK
              </h1>
              <p className="text-white/80 text-sm font-medium">
                Inventory Management
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/70 text-xs text-center">
                Welcome back, <span className="font-medium text-white">{user?.username}</span>
              </p>
              <div className="flex items-center justify-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-white/70 text-xs">Online</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-2">
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

          {/* System Status */}
          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <div className="professional-card p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">System Status</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Clock */}
          <div className="px-4 py-3 border-t border-border">
            <div className="professional-card p-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Live Time
                  </span>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-border">
            <Button
              onClick={handleLogout}
              className="w-full professional-button-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
            </h1>
            <p className="text-sm text-white/90 mt-1 text-center font-medium">
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
          <div className="p-4 border-t-3 border-black bg-muted/30">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Live Time
                </span>
              </div>
              <div className="text-xl font-bold text-primary">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t-3 border-black">
            <Button
              onClick={handleLogout}
              className="w-full brutal-button-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
