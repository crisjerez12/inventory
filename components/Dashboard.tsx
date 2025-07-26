'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LogOut, Package, AlertTriangle, BarChart3, Box, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { inventoryData, type InventoryItem } from '@/lib/inventory-data';

interface DashboardProps {
  onLogout: () => void;
}

const categoryColors = {
  'Pig Feeds': 'bg-pink-500',
  'Chicken Feeds': 'bg-yellow-500',
  'Cattle': 'bg-orange-500',
  'Goat': 'bg-green-500',
  'Rabbit': 'bg-purple-500',
  'Fish': 'bg-blue-500',
  'Pet': 'bg-red-500',
  'Others': 'bg-gray-500',
};

const ITEMS_PER_PAGE = 10;

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = inventoryData.length;
  const outOfStockItems = inventoryData.filter(item => item.stock === 0).length;

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let filtered = inventoryData;
    
    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  // Reset to first page when filters change
  useState(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return 'destructive';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-cyan-300">
      {/* Header */}
      <header className="bg-yellow-400 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black border-4 border-white flex items-center justify-center transform rotate-12">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-black transform -rotate-2">FEED INVENTORY</h1>
                <p className="text-sm text-black font-bold">MANAGE YOUR ANIMAL FEEDS</p>
              </div>
            </div>
            <Button 
              onClick={onLogout} 
              className="flex items-center space-x-2 bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>LOGOUT</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000]">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 font-black text-black data-[state=active]:bg-green-400">
              <BarChart3 className="h-4 w-4" />
              <span>DASHBOARD</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center space-x-2 font-black text-black data-[state=active]:bg-green-400">
              <Box className="h-4 w-4" />
              <span>ITEMS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-black text-black">TOTAL ITEMS</CardTitle>
                  <Package className="h-8 w-8 text-black" />
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-black transform -rotate-3">{totalItems}</div>
                  <p className="text-sm text-black font-bold mt-2">ITEMS IN INVENTORY</p>
                </CardContent>
              </Card>

              <Card className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-black text-black">OUT OF STOCK</CardTitle>
                  <AlertTriangle className="h-8 w-8 text-black" />
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-black transform rotate-3">{outOfStockItems}</div>
                  <p className="text-sm text-black font-bold mt-2">ITEMS NEED RESTOCKING</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Overview */}
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-purple-400 border-b-4 border-black">
                <CardTitle className="text-2xl font-black text-black">CATEGORY OVERVIEW</CardTitle>
                <CardDescription className="text-black font-bold">STOCK LEVELS BY CATEGORY</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(categoryColors).map(([category, colorClass]) => {
                    const categoryItems = inventoryData.filter(item => item.category === category);
                    const categoryStock = categoryItems.reduce((sum, item) => sum + item.stock, 0);
                    const outOfStockInCategory = categoryItems.filter(item => item.stock === 0).length;

                    return (
                      <div key={category} className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] transition-all">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-6 h-6 border-2 border-black ${colorClass}`}></div>
                          <h3 className="font-black text-black">{category}</h3>
                        </div>
                        <div className="space-y-1 text-sm text-black font-bold">
                          <p>ITEMS: {categoryItems.length}</p>
                          <p>TOTAL STOCK: {categoryStock}</p>
                          {outOfStockInCategory > 0 && (
                            <p className="text-red-600 font-black">OUT OF STOCK: {outOfStockInCategory}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            {/* Search and Filter Controls */}
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-orange-400 border-b-4 border-black">
                <CardTitle className="text-2xl font-black text-black">SEARCH & FILTER</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="SEARCH ITEMS..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-4 border-black bg-white text-black font-bold placeholder:text-gray-500 focus:bg-yellow-100"
                    />
                    <Button 
                      onClick={handleSearch}
                      className="bg-blue-400 hover:bg-blue-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48 border-4 border-black bg-white text-black font-bold">
                      <SelectValue placeholder="SELECT CATEGORY" />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black bg-white">
                      <SelectItem value="ALL" className="font-bold">ALL CATEGORIES</SelectItem>
                      {Object.keys(categoryColors).map((category) => (
                        <SelectItem key={category} value={category} className="font-bold">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              <CardHeader className="bg-pink-400 border-b-4 border-black">
                <CardTitle className="text-2xl font-black text-black">INVENTORY ITEMS</CardTitle>
                <CardDescription className="text-black font-bold">
                  SHOWING {paginatedItems.length} OF {filteredItems.length} ITEMS
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedItems.map((item) => {
                    const isOutOfStock = item.stock === 0;
                    const categoryColor = categoryColors[item.category as keyof typeof categoryColors];

                    return (
                      <Card 
                        key={item.id} 
                        className={`border-4 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1 ${
                          isOutOfStock 
                            ? 'bg-gradient-to-br from-black to-red-900 text-white shadow-[8px_8px_0px_0px_#ff0000]' 
                            : 'bg-white shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000]'
                        }`}
                      >
                        <CardHeader className={`pb-3 ${isOutOfStock ? 'bg-red-800 border-b-4 border-red-500' : `${categoryColor} border-b-4 border-black`}`}>
                          <div className="flex items-start justify-between">
                            <CardTitle className={`text-lg font-black ${isOutOfStock ? 'text-white' : 'text-black'}`}>
                              {item.name}
                            </CardTitle>
                            <Badge 
                              className={`${isOutOfStock ? 'bg-red-500 border-2 border-white' : `${categoryColor} border-2 border-black`} text-black font-black`}
                            >
                              {item.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-sm font-bold ${isOutOfStock ? 'text-gray-300' : 'text-black'}`}>
                                STOCK LEVEL:
                              </span>
                              <Badge 
                                className={`${item.stock === 0 ? 'bg-red-500 text-white border-2 border-white' : 'bg-green-400 text-black border-2 border-black'} font-black`}
                              >
                                {item.stock} UNITS
                              </Badge>
                            </div>
                            {isOutOfStock && (
                              <div className="mt-3 p-3 bg-red-800 border-4 border-red-500">
                                <p className="text-sm text-white font-black flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  OUT OF STOCK - NEEDS RESTOCKING
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="bg-purple-400 hover:bg-purple-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      PREV
                    </Button>
                    <span className="text-black font-black text-lg bg-white border-4 border-black px-4 py-2">
                      PAGE {currentPage} OF {totalPages}
                    </span>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="bg-purple-400 hover:bg-purple-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      NEXT
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {filteredItems.length === 0 && (
                  <div className="text-center py-8 text-black font-black text-xl">NO ITEMS FOUND</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}