"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, BarChart3, Shield, Clock } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="space-y-8">
      {/* Main Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center mb-6">
          <img src="/images/microtek-logo.jpg" alt="Microtek Logo" className="h-24" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
          MICROTEK INVENTORY
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-green-600">
          Animal Feed Solutions
        </h2>
        <p className="text-blue-800 font-medium text-lg max-w-md mx-auto">
          Professional inventory management system for animal feeds and livestock nutrition products.
        </p>
      </div>

{/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-400">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center font-semibold text-blue-900 text-lg">
              <Shield className="h-6 w-6 mr-2 text-green-600" />
              SECURE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 font-medium text-sm">
              Enterprise-grade security ensures your feed inventory data is protected with advanced encryption.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-400">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center font-semibold text-blue-900 text-lg">
              <BarChart3 className="h-6 w-6 mr-2 text-green-600" />
              EFFICIENT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 font-medium text-sm">
              Optimized feed management with instant stock updates and high-performance tracking.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-400">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center font-semibold text-blue-900 text-lg">
              <Clock className="h-6 w-6 mr-2 text-green-600" />
              REAL-TIME
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 font-medium text-sm">
              Live feed stock synchronization and instant updates across all your farm locations.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-lg shadow-xl">
        <div className="text-center">
          <h3 className="font-bold text-xl mb-2">🌾 TRUSTED BY FEED PROFESSIONALS</h3>
          <p className="font-medium text-sm text-blue-100">
            Join livestock farmers and feed dealers who trust Microtek for their animal feed inventory management needs.
          </p>
        </div>
      </div>
    </div>
  );
}