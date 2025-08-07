"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/login/login-form";
import { Dashboard } from "@/components/dashboard/dashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { User } from "@/lib/types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}
