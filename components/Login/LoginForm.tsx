
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast({
        title: "VALIDATION ERROR",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "LOGIN SUCCESSFUL",
          description: `Welcome back, ${data.user.username}!`,
        });
        onLogin(data.user);
      } else {
        toast({
          title: "LOGIN FAILED",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "CONNECTION ERROR",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md bg-white border-2 border-blue-900 shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <div className="flex items-center justify-center mb-2">
            <img src="/images/microtek-logo.jpg" alt="Microtek Logo" className="h-12" />
          </div>
          <CardTitle className="text-xl font-bold text-center">
            MICROTEK INVENTORY
          </CardTitle>
          <CardDescription className="text-blue-100 text-center">
            Animal Feed Solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-username" className="font-semibold text-blue-900">
                Username
              </Label>
              <Input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="border-2 border-gray-300 focus:border-green-500 transition-colors"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" className="font-semibold text-blue-900">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="border-2 border-gray-300 focus:border-green-500 transition-colors pr-12"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-auto bg-transparent hover:bg-gray-100 text-gray-500 border-none shadow-none"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
