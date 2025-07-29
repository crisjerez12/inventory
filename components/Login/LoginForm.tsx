
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, User, Lock, ArrowRight } from "lucide-react";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  error: string;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(username, password);
  };

  return (
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
  );
}
