
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
      <Card className="w-full max-w-md bg-white border-8 border-black shadow-[16px_16px_0px_0px_#000000] rounded-none transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-green-500 text-white border-b-8 border-black">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <img src="/images/microtek-logo.png" alt="Microtek Logo" className="h-16" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black text-center uppercase tracking-wider">
            MICROTEK INVENTORY
          </CardTitle>
          <CardDescription className="text-blue-100 text-center font-bold text-lg">
            Animal Feed Solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 bg-green-400">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="login-username" className="font-black text-blue-900 text-lg uppercase tracking-wide">
                Username
              </Label>
              <Input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="border-4 border-black bg-white focus:border-blue-900 transition-colors font-bold text-lg p-4 shadow-[4px_4px_0px_0px_#000000] rounded-none"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="login-password" className="font-black text-blue-900 text-lg uppercase tracking-wide">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="border-4 border-black bg-white focus:border-blue-900 transition-colors font-bold text-lg p-4 pr-16 shadow-[4px_4px_0px_0px_#000000] rounded-none"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-auto bg-blue-900 hover:bg-green-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] rounded-none"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-green-500 text-white font-black py-4 text-xl uppercase tracking-wider border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none transition-all duration-200 hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  SIGNING IN...
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6 mr-3" />
                  SIGN IN
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
