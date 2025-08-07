"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, BarChart3, Users, Shield } from 'lucide-react';

export function WelcomeSection() {
  const features = [
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track and manage your inventory with ease"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Get insights with detailed reports and analytics"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage staff access and permissions"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is safe with enterprise-grade security"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Professional Inventory Management
        </h1>
        <p className="text-lg text-muted-foreground">
          Streamline your business operations with our comprehensive inventory management system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white border-2 border-border shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-semibold text-primary">
                <feature.icon className="h-5 w-5 mr-2 text-secondary" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
