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
import { Eye, EyeOff, LogIn, Loader2, Building2, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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
      <Card className="w-full max-w-md professional-card animate-fade-in">
        <CardHeader className="professional-header text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <Building2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              MICROTEK
            </CardTitle>
            <p className="text-white/80 text-sm">
              Inventory Management System
            </p>
          </div>
        </CardHeader>
        <CardContent className="card-padding bg-white">
          <div className="mb-6 text-center">
            <h2 className="heading-2 mb-2">Welcome Back</h2>
            <p className="caption-text">Sign in to access your dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="login-username"
                  className="text-sm font-medium text-foreground"
                >
                  Username
                </Label>
                <Input
                  id="login-username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  className="professional-input focus-ring"
                  disabled={isLoading}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="login-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="professional-input focus-ring pr-12"
                    disabled={isLoading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-auto hover:bg-muted rounded-md"
                    disabled={isLoading}
                    variant="ghost"
                    size="sm"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full professional-button text-base py-3 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Secure Login Protected
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="login-username"
                className="font-semibold text-foreground text-base uppercase tracking-wide"
              >
                Username
              </Label>
              <Input
                id="login-username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className="brutal-input font-medium text-base p-4"
                disabled={isLoading}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="login-password"
                className="font-semibold text-foreground text-base uppercase tracking-wide"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="brutal-input font-medium text-base p-4 pr-16"
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-auto brutal-button"
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
              className="w-full brutal-button font-semibold py-4 text-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-3" />
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
