
"use client";

import { Plus, Eye, Printer } from "lucide-react";
import Image from "next/image";

export function WelcomeSection() {
  return (
    <div className="space-y-6">
      {/* Welcome Section with Logo */}
      <div className="bg-white border-6 border-slate-900 p-8 shadow-[8px_8px_0px_0px_#22c55e] relative before:absolute before:inset-2 before:border-2 before:border-gray-300 before:pointer-events-none">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="Microtek Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              WELCOME TO
            </h2>
            <h3 className="text-2xl font-black text-green-600">
              INVENTORY SYSTEM
            </h3>
          </div>
        </div>
        <p className="text-gray-700 font-bold text-lg leading-relaxed">
          Manage your inventory efficiently with our comprehensive inventory
          management system designed for modern businesses.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-green-500 text-white p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#1e3a8a] relative before:absolute before:inset-2 before:border-2 before:border-green-300 before:pointer-events-none">
          <div className="flex items-center gap-4">
            <Plus className="w-10 h-10" />
            <div>
              <h4 className="font-black text-xl mb-1">ADD STOCKS</h4>
              <p className="text-sm font-bold opacity-90">
                Add new inventory items to your stock
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 border-4 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] relative before:absolute before:inset-2 before:border-2 before:border-slate-600 before:pointer-events-none">
          <div className="flex items-center gap-4">
            <Eye className="w-10 h-10" />
            <div>
              <h4 className="font-black text-xl mb-1">MONITOR STOCKS</h4>
              <p className="text-sm font-bold opacity-90">
                Track and monitor your inventory levels
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-500 text-white p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#1e3a8a]">
          <div className="flex items-center gap-4">
            <Printer className="w-10 h-10" />
            <div>
              <h4 className="font-black text-xl mb-1">PRINT HISTORY</h4>
              <p className="text-sm font-bold opacity-90">
                Generate and print inventory reports
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
