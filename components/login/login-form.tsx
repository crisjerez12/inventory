"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import type { User } from "@/lib/types";

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.user) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.username}!`,
        });
        onLogin({
          ...data.user,
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt,
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md professional-card">
        <CardHeader className="professional-header">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-4 border-2 border-border shadow-md rounded-lg">
              <Image
                src="/logo.jpg"
                alt="Microtek Logo"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-center text-white">
            Sign In to Your Account
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="login-username"
                className="font-medium text-foreground text-lg"
              >
                Username
              </Label>
              <Input
                id="login-username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className="professional-input font-medium text-lg p-4"
                disabled={isLoading}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="login-password"
                className="font-medium text-foreground text-lg"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="professional-input font-medium text-lg p-4 pr-16"
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-auto professional-button"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full professional-button font-medium py-4 text-xl disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6 mr-3" />
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
