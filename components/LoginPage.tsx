
"use client";

import { useState } from "react";
import { LoginForm } from "./Login/LoginForm";
import { WelcomeSection } from "./Login/WelcomeSection";

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-300 to-green-300 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12">
        <WelcomeSection />
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}
