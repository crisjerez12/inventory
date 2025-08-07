"use client";

import { LoginForm } from "@/components/login/login-form";
import { WelcomeSection } from "@/components/login/welcome-section";
import type { User } from "@/lib/types";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <WelcomeSection />
          <LoginForm onLogin={onLogin} />
        </div>
      </div>
    </div>
  );
}
