"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, BarChart3, Shield, Clock } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="space-y-8">
      {/* Main Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="bg-white p-6 border-8 border-black shadow-[16px_16px_0px_0px_#000000] transform rotate-3">
            <img src="/images/microtek-logo.png" alt="Microtek Logo" className="h-32" />
          </div>
        </div>
        <div className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_#000000] p-8 transform -rotate-1">
          <h1 className="text-5xl md:text-6xl font-black text-blue-900 uppercase tracking-wider">
            MICROTEK INVENTORY
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-green-500 uppercase tracking-wide mt-4">
            Animal Feed Solutions
          </h2>
          <p className="text-blue-900 font-bold text-xl max-w-md mx-auto mt-6 uppercase">
            Professional inventory management system for animal feeds and livestock nutrition products.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-green-400 border-6 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-300 transform rotate-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center font-black text-blue-600 text-xl uppercase tracking-wide">
              <div className="bg-white p-2 border-4 border-black mr-4">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              SECURE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600 font-bold text-base uppercase">
              Enterprise-grade security ensures your feed inventory data is protected with advanced encryption.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-900 border-6 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-300 transform -rotate-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center font-black text-white text-xl uppercase tracking-wide">
              <div className="bg-green-200 p-2 border-4 border-black mr-4">
                <BarChart3 className="h-8 w-8 text-blue-900" />
              </div>
              EFFICIENT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-400 font-bold text-base uppercase">
              Optimized feed management with instant stock updates and high-performance tracking.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-6 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-300 transform rotate-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center font-black text-blue-600 text-xl uppercase tracking-wide">
              <div className="bg-green-200 p-2 border-4 border-black mr-4">
                <Clock className="h-8 w-8 text-blue-900" />
              </div>
              REAL-TIME
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600 font-bold text-base uppercase">
              Live feed stock synchronization and instant updates across all your farm locations.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-500 border-6 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-300 transform -rotate-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center font-black text-white text-xl uppercase tracking-wide">
              <div className="bg-white p-2 border-4 border-black mr-4">
                <Package className="h-8 w-8 text-blue-900" />
              </div>
              RELIABLE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white font-bold text-base uppercase">
              Dependable system trusted by livestock farmers for critical feed inventory management.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-900 text-white p-8 border-8 border-black shadow-[12px_12px_0px_0px_#000000] transform rotate-1">
        <div className="text-center">
          <h3 className="font-black text-2xl mb-4 uppercase tracking-wider">🌾 TRUSTED BY FEED PROFESSIONALS</h3>
          <p className="font-bold text-lg text-green-400 uppercase">
            Join livestock farmers and feed dealers who trust Microtek for their animal feed inventory management needs.
          </p>
        </div>
      </div>
    </div>
  );
}