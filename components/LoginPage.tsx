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
import { Package, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
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

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = onLogin(username, password);
    if (!success) {
      setError("Invalid username or password. Try admin/password");
    } else {
      toast({
        title: "LOGIN SUCCESSFUL",
        description: "Welcome back! Access granted to inventory management system",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-yellow-300">
      <Card className="w-full max-w-md border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
        <CardHeader className="text-center space-y-4 bg-blue-400 border-b-4 border-black">
          <div className="mx-auto w-16 h-16 bg-black border-4 border-white flex items-center justify-center transform rotate-3">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black text-black transform -rotate-1">
              FEED INVENTORY
            </CardTitle>
            <CardDescription className="mt-2 text-black font-bold">
              MANAGE YOUR ANIMAL FEEDS
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-black font-bold text-lg"
              >
                USERNAME
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="ENTER USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-4 border-black bg-white text-black font-bold placeholder:text-gray-500 focus:bg-yellow-100 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-black font-bold text-lg"
              >
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="ENTER PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-4 border-black bg-white text-black font-bold placeholder:text-gray-500 focus:bg-yellow-100 transition-all"
              />
            </div>
            {error && (
              <Alert className="border-4 border-red-500 bg-red-100 animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800 font-bold">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-green-400 hover:bg-green-500 text-black font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
