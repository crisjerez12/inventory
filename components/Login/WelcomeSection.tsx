
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, BarChart3, Shield, Clock } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="flex flex-col justify-center space-y-6">
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-black border-4 border-white flex items-center justify-center transform rotate-12 shadow-[6px_6px_0px_0px_#ffffff]">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white transform -rotate-2 drop-shadow-lg">
              FEED INVENTORY
            </h1>
            <p className="text-lg md:text-xl text-white font-bold">
              PROFESSIONAL ANIMAL FEED MANAGEMENT SYSTEM
            </p>
          </div>
        </div>
        
        <p className="text-white text-lg md:text-xl font-bold mb-8 leading-relaxed">
          Streamline your animal feed business with our comprehensive inventory management solution. 
          Track stock levels, manage categories, and generate detailed reports with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-yellow-400 to-orange-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_#000000] transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center font-black text-black text-lg">
              <BarChart3 className="h-6 w-6 mr-2" />
              ANALYTICS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black font-bold text-sm">
              Real-time dashboard with comprehensive insights into your inventory performance and trends.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-400 to-blue-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_#000000] transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center font-black text-black text-lg">
              <Shield className="h-6 w-6 mr-2" />
              SECURITY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black font-bold text-sm">
              Secure user authentication and role-based access control to protect your business data.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-pink-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_#000000] transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center font-black text-black text-lg">
              <Package className="h-6 w-6 mr-2" />
              INVENTORY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black font-bold text-sm">
              Complete stock management for all animal feed categories with automated alerts.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-400 to-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_#000000] transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center font-black text-black text-lg">
              <Clock className="h-6 w-6 mr-2" />
              REAL-TIME
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black font-bold text-sm">
              Live updates and instant synchronization across all your devices and locations.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6 border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] transform -rotate-1">
        <div className="text-center">
          <h3 className="font-black text-xl mb-2">🎯 TRUSTED BY PROFESSIONALS</h3>
          <p className="font-bold text-sm">
            Join thousands of feed retailers and distributors who trust our system to manage their inventory efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}
