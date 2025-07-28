"use client";

import { useState, useEffect } from "react";
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/components/Dashboard";
import { Toaster } from "@/components/ui/toaster";

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("userData");
    if (authStatus === "true" && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} user={user} />
      )}
      <Toaster />
    </div>
  );
}
