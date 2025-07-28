"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  User,
  Lock,
  ArrowRight,
  Plus,
  Eye,
  Printer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = onLogin(username, password);
    const isAuthenticated = await success;
    if (!isAuthenticated) {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
      return;
    }
    toast({
      title: "ACCESS GRANTED",
      description: "Welcome to the Inventory Management System",
    });
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        backgroundColor: "#f0fdf4",
        opacity: 0.9,
        backgroundImage:
          "radial-gradient(#1e3a8a 0.5px, transparent 0.5px), radial-gradient(#1e3a8a 0.5px, #f0fdf4 0.5px)",
        backgroundSize: "25px 25px",
        backgroundPosition: "0 0, 12px 12px",
      }}
    >
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Login Card - Left Side */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="border-6 border-slate-900 bg-white shadow-[12px_12px_0px_0px_#1e3a8a] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[8px_8px_0px_0px_#1e3a8a] transition-all duration-200 relative before:absolute before:inset-2 before:border-2 before:border-gray-300 before:pointer-events-none">
            <CardHeader className="p-6 bg-white border-b-4 border-green-200">
              <CardTitle className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tight">
                SYSTEM ACCESS
              </CardTitle>
              <CardDescription className="text-center text-gray-600 font-bold">
                Log in your account
              </CardDescription>
            </CardHeader>

            {/* Form Section */}
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-wide"
                  >
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-12 border-4 border-slate-900 bg-white text-slate-900 font-bold placeholder:text-gray-400 focus:bg-green-50 focus:border-green-600 transition-all duration-200"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-wide"
                  >
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-4 border-slate-900 bg-white text-slate-900 font-bold placeholder:text-gray-400 focus:bg-green-50 focus:border-green-600 transition-all duration-200"
                  />
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert className="border-4 border-red-500 bg-red-50 animate-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 font-bold">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-black text-lg border-4 border-slate-900 shadow-[6px_6px_0px_0px_#1e3a8a] hover:shadow-[3px_3px_0px_0px_#1e3a8a] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 uppercase tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Access System
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Help Section */}
              <div className="mt-6 pt-4 border-t-4 border-green-200">
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-gray-600">
                    NEED ASSISTANCE?
                  </p>
                  <p className="text-xs text-gray-500">
                    Contact IT support for account recovery
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Panel - Right Side */}
        <div className="space-y-6">
          {/* Welcome Section with Logo */}
          <div className="bg-white border-6 border-slate-900 p-8 shadow-[8px_8px_0px_0px_#22c55e] relative before:absolute before:inset-2 before:border-2 before:border-gray-300 before:pointer-events-none">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Microtek Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  WELCOME TO
                </h2>
                <h3 className="text-2xl font-black text-green-600">
                  INVENTORY SYSTEM
                </h3>
              </div>
            </div>
            <p className="text-gray-700 font-bold text-lg leading-relaxed">
              Manage your inventory efficiently with our comprehensive inventory
              management system designed for modern businesses.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-500 text-white p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#1e3a8a] relative before:absolute before:inset-2 before:border-2 before:border-green-300 before:pointer-events-none">
              <div className="flex items-center gap-4">
                <Plus className="w-10 h-10" />
                <div>
                  <h4 className="font-black text-xl mb-1">ADD STOCKS</h4>
                  <p className="text-sm font-bold opacity-90">
                    Add new inventory items to your stock
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 border-4 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] relative before:absolute before:inset-2 before:border-2 before:border-slate-600 before:pointer-events-none">
              <div className="flex items-center gap-4">
                <Eye className="w-10 h-10" />
                <div>
                  <h4 className="font-black text-xl mb-1">MONITOR STOCKS</h4>
                  <p className="text-sm font-bold opacity-90">
                    Track and monitor your inventory levels
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-500 text-white p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#1e3a8a]">
              <div className="flex items-center gap-4">
                <Printer className="w-10 h-10" />
                <div>
                  <h4 className="font-black text-xl mb-1">PRINT HISTORY</h4>
                  <p className="text-sm font-bold opacity-90">
                    Generate and print inventory reports
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
