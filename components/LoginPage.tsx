"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "./Login/LoginForm";
import { WelcomeSection } from "./Login/WelcomeSection";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (username: string, password: string) => {
    setError("");
    setIsLoading(true);

    const success = await onLogin(username, password);
    if (!success) {
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
              <LoginForm 
                onSubmit={handleSubmit}
                error={error}
                isLoading={isLoading}
              />

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
        <WelcomeSection />
      </div>
    </div>
  );
}