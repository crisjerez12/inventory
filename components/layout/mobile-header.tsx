"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  title: string;
}

export function MobileHeader({ isMenuOpen, onMenuToggle, title }: MobileHeaderProps) {
  return (
    <div className="lg:hidden bg-primary text-white p-4 flex items-center justify-between border-b-2 border-border">
      <h1 className="text-lg font-semibold">{title}</h1>
      <Button
        onClick={onMenuToggle}
        className="bg-transparent hover:bg-white/10 text-white p-2"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
}
