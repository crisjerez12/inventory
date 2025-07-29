
"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000000]">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-black`} />
        </div>
        {text && (
          <p className="font-black text-black text-sm">{text}</p>
        )}
      </div>
    </div>
  );
}
