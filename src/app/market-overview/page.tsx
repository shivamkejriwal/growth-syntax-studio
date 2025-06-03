
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { Globe, Landmark, Briefcase, TrendingUp, TrendingDown, Cog, Wrench, MessageSquare, ShoppingCart, Shield, Tag, Users, Flame, BriefcaseMedical, ShoppingBag, Lightbulb, Home, Zap, BusFront, Settings2, Layers, HardHat, DollarSign, Percent, Plane, FlaskConical, Shirt, Square, HeartPulse, Megaphone, Tv, Car, Building, Truck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";

const sampleGainers = [
  { ticker: "AAPL", close: 165.30, change: "+3.32%", changeType: "positive" as const },
  { ticker: "BA", close: 197.85, change: "+0.93%", changeType: "positive" as const },
  { ticker: "BNTX", close: 351.74, change: "+4.81%", changeType: "positive" as const },
  { ticker: "CHGG", close: 27.85, change: "+6.70%", changeType: "positive" as const },
  { ticker: "CPIX", close: 5.03, change: "+21.79%", changeType: "positive" as const },
  { ticker: "GRTS", close: 13.20, change: "+25.95%", changeType: "positive" as const },
  { ticker: "LI", close: 35.44, change: "+2.96%", changeType: "positive" as const },
  { ticker: "MEIP", close: 3.37, change: "+19.50%", changeType: "positive" as const },
  { ticker: "MRNA", close: 352.43, change: "+0.24%", changeType: "positive" as const },
  { ticker: "MSTR", close: 721.43, change: "+3.32%", changeType: "positive" as const },
];

const sampleLosers = [
  { ticker: "NFLX", close: 400.10, change: "-2.08%", changeType: "negative" as const },
  { ticker: "ZM", close: 65.20, change: "-1.95%", changeType: "negative" as const },
  { ticker: "PYPL", close: 70.50, change: "-1.54%", changeType: "negative" as const },
  { ticker: "COIN", close: 150.80, change: "-3.10%", changeType: "negative" as const },
  { ticker: "HOOD", close: 10.20, change: "-4.50%", changeType: "negative" as const },
];

const sampleActive = [
  { ticker: "TSLA", close: 720.15, change: "+1.44%", changeType: "positive" as const, volume: "120M" },
  { ticker: "AMD", close: 105.50, change: "-0.50%", changeType: "negative" as const, volume: "95M" },
  { ticker: "NVDA", close: 410.25, change: "+1.26%", changeType: "positive" as const, volume: "80M" },
  { ticker: "F", close: 12.50, change: "+0.80%", changeType: "positive" as const, volume: "75M" },
  { ticker: "BAC", close: 35.00, change: "-0.20%", changeType: "negative" as const, volume: "70M" },
];

const sectorData = [
  { name: "Basic Industries", change: "-0.83%", icon: <Cog className="h-5 w-5 text-muted-foreground" /> },
  { name: "Basic Materials", change: "-0.91%", icon: <Layers className="h-5 w-5 text-muted-foreground" /> },
  { name: "Capital Goods", change: "-1.16%", icon: <Wrench className="h-5 w-5 text-muted-foreground" /> },
  { name: "Communication Services", change: "-0.66%", icon: <MessageSquare className="h-5 w-5 text-muted-foreground" /> },
  { name: "Consumer Cyclical", change: "-1.39%", icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" /> },
  { name: "Consumer Defensive", change: "-1.17%", icon: <Shield className="h-5 w-5 text-muted-foreground" /> },
  { name: "Consumer Durables", change: "-1.11%", icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" /> },
  { name: "Consumer Non-Durables", change: "-0.29%", icon: <Tag className="h-5 w-5 text-muted-foreground" /> },
  { name: "Consumer Services", change: "-0.61%", icon: <Users className="h-5 w-5 text-muted-foreground" /> },
  { name: "Energy", change: "-2.16%", icon: <Flame className="h-5 w-5 text-muted-foreground" /> },
  { name: "Finance", change: "-0.62%", icon: <Landmark className="h-5 w-5 text-muted-foreground" /> },
  { name: "Financial Services", change: "-1.00%", icon: <DollarSign className="h-5 w-5 text-muted-foreground" /> },
  { name: "Health Care", change: "-0.63%", icon: <BriefcaseMedical className="h-5 w-5 text-muted-foreground" /> },
  { name: "Industrials", change: "-0.79%", icon: <HardHat className="h-5 w-5 text-muted-foreground" /> },
  { name: "Miscellaneous", change: "-1.03%", icon: <ShoppingBag className="h-5 w-5 text-muted-foreground" /> },
  { name: "Public Utilities", change: "0.51%", icon: <Lightbulb className="h-5 w-5 text-muted-foreground" /> },
  { name: "Real Estate", change: "0.01%", icon: <Home className="h-5 w-5 text-muted-foreground" /> },
  { name: "Technology", change: "0.48%", icon: <Zap className="h-5 w-5 text-muted-foreground" /> },
  { name: "Transportation", change: "-0.95%", icon: <BusFront className="h-5 w-5 text-muted-foreground" /> },
  { name: "Utilities", change: "0.53%", icon: <Settings2 className="h-5 w-5 text-muted-foreground" /> },
];

const industryData = [
  { name: "Accident & Health Insurance", change: "-0.28%", icon: <HeartPulse className="h-5 w-5 text-muted-foreground" /> },
  { name: "Advertising", change: "0.07%", icon: <Megaphone className="h-5 w-5 text-muted-foreground" /> },
  { name: "Advertising Agencies", change: "-1.79%", icon: <Tv className="h-5 w-5 text-muted-foreground" /> },
  { name: "Aerospace", change: "-0.69%", icon: <Plane className="h-5 w-5 text-muted-foreground" /> },
  { name: "Aerospace & Defense", change: "-0.96%", icon: <Shield className="h-5 w-5 text-muted-foreground" /> },
  { name: "Agricultural Chemicals", change: "-0.82%", icon: <FlaskConical className="h-5 w-5 text-muted-foreground" /> },
  { name: "Agricultural Inputs", change: "-1.44%", icon: <Square className="h-5 w-5 text-muted-foreground" /> },
  { name: "Air Freight & Delivery", change: "-1.40%", icon: <Truck className="h-5 w-5 text-muted-foreground" /> },
  { name: "Airlines", change: "-1.95%", icon: <Plane className="h-5 w-5 text-muted-foreground" /> },
  { name: "Airports & Air Services", change: "-2.28%", icon: <Square className="h-5 w-5 text-muted-foreground" /> },
  { name: "Aluminum", change: "-2.34%", icon: <Layers className="h-5 w-5 text-muted-foreground" /> },
  { name: "Apparel", change: "-0.55%", icon: <Shirt className="h-5 w-5 text-muted-foreground" /> },
  { name: "Apparel Manufacturing", change: "-1.77%", icon: <Square className="h-5 w-5 text-muted-foreground" /> },
  { name: "Apparel Retail", change: "-0.72%", icon: <Square className="h-5 w-5 text-muted-foreground" /> },
  { name: "Asset Management", change: "0.08%", icon: <DollarSign className="h-5 w-5 text-muted-foreground" /> },
  { name: "Auto & Truck Dealerships", change: "-1.45%", icon: <Square className="h-5 w-5 text-muted-foreground" /> },
  { name: "Auto Manufacturers", change: "0.21%", icon: <Car className="h-5 w-5 text-muted-foreground" /> },
  { name: "Auto Manufacturing", change: "-2.08%", icon: <Cog className="h-5 w-5 text-muted-foreground" /> },
  { name: "Auto Parts", change: "-1.88%", icon: <Wrench className="h-5 w-5 text-muted-foreground" /> },
  { name: "Banks", change: "-0.37%", icon: <Landmark className="h-5 w-5 text-muted-foreground" /> },
  { name: "Biotechnology", change: "+1.20%", icon: <FlaskConical className="h-5 w-5 text-muted-foreground" /> },
  { name: "Building Materials", change: "-0.15%", icon: <Building className="h-5 w-5 text-muted-foreground" /> },
];


export default function MarketOverviewPage() {
  const [activeMarketMoversTab, setActiveMarketMoversTab] = useState("gainers");
  const [activeSegmentsTab, setActiveSegmentsTab] = useState("sectors");


  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
          <div className="flex items-center space-x-2">
            <Select defaultValue="us-market">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-market">US Market</SelectItem>
                <SelectItem value="global-market">Global Market</SelectItem>
                <SelectItem value="emerging-markets">Emerging Markets</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="1y">
              <SelectTrigger className="w-full md:w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="5y">5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={<Globe />} title="Global Market Cap" value="$95.2 Trillion" change="+0.8%" changeType="positive" />
          <StatCard icon={<Landmark />} title="S&P 500 Index" value="4,500.75" change="-0.2%" changeType="negative" />
          <StatCard icon={<Briefcase />} title="Tech Sector Performance" value="Leading" change="+1.5% today" changeType="positive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle>Market Movers & Activity</CardTitle>
              <CardDescription>Market data for {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeMarketMoversTab} onValueChange={setActiveMarketMoversTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="gainers">Gainers</TabsTrigger>
                  <TabsTrigger value="losers">Losers</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                </TabsList>
                <TabsContent value="gainers">
                  <MarketDataTable data={sampleGainers} type="gainer-loser" />
                </TabsContent>
                <TabsContent value="losers">
                  <MarketDataTable data={sampleLosers} type="gainer-loser" />
                </TabsContent>
                <TabsContent value="active">
                  <MarketDataTable data={sampleActive} type="active" />
                </TabsContent>
              </Tabs>
               <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center text-primary">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span>Advancers: 2242</span>
                  </div>
                  <div className="h-2 w-1/2 bg-muted rounded-full relative">
                      <div className="h-2 w-1/2 bg-primary rounded-l-full"></div>
                      <div className="absolute top-1/2 left-1/2 h-4 w-1 bg-primary-foreground border border-primary rounded-sm -translate-y-1/2 -translate-x-1/2"></div>
                  </div>
                  <div className="flex items-center text-destructive">
                    <TrendingDown className="mr-1 h-4 w-4" />
                    <span>Decliners: 5806</span>
                  </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Sectors & Industries</CardTitle>
               <Separator className="my-2" />
                 <Tabs value={activeSegmentsTab} onValueChange={setActiveSegmentsTab} className="w-full pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sectors">Sectors</TabsTrigger>
                  <TabsTrigger value="industries">Industries</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[340px] overflow-y-auto">
              <TabsContent value="sectors" className="mt-0">
                {sectorData.map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between text-sm py-1.5">
                    <div className="flex items-center gap-2">
                      {sector.icon}
                      <span>{sector.name}</span>
                    </div>
                    <span className={parseFloat(sector.change) >= 0 ? "text-primary" : "text-destructive"}>
                      {sector.change}
                    </span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="industries" className="mt-0">
                {industryData.map((industry) => (
                  <div key={industry.name} className="flex items-center justify-between text-sm py-1.5">
                    <div className="flex items-center gap-2">
                      {industry.icon}
                      <span>{industry.name}</span>
                    </div>
                    <span className={parseFloat(industry.change) >= 0 ? "text-primary" : "text-destructive"}>
                      {industry.change}
                    </span>
                  </div>
                ))}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Sector Performance Chart</CardTitle>
              <CardDescription>Year-to-date performance by major sectors.</CardDescription>
            </CardHeader>
            <CardContent>
              <SampleBarChart title="Sector Performance (YTD)" />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Key Economic Indicators</CardTitle>
              <CardDescription>Inflation, GDP Growth, Unemployment Rate.</CardDescription>
            </CardHeader>
            <CardContent>
              <SampleLineChart title="Inflation Rate Trend" />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Industry Heatmap</CardTitle>
            <CardDescription>Visual overview of industry performance (placeholder).</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
            <p className="text-muted-foreground">Industry Heatmap Placeholder</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

interface MarketDataRow {
  ticker: string;
  close: number;
  change: string;
  changeType: "positive" | "negative";
  volume?: string; // Only for active table
}

interface MarketDataTableProps {
  data: MarketDataRow[];
  type: "gainer-loser" | "active";
}

function MarketDataTable({ data, type }: MarketDataTableProps) {
  return (
    <div className="max-h-[300px] overflow-y-auto"> {/* Adjusted max height */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead className="text-right">Close</TableHead>
            <TableHead className="text-right">Change</TableHead>
            {type === "active" && <TableHead className="text-right">Volume</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.ticker}>
              <TableCell className="font-medium">{item.ticker}</TableCell>
              <TableCell className="text-right">{item.close.toFixed(2)}</TableCell>
              <TableCell className={`text-right font-medium ${item.changeType === "positive" ? "text-primary" : "text-destructive"}`}>
                {item.change}
              </TableCell>
              {type === "active" && <TableCell className="text-right">{item.volume}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
}

function StatCard({ icon, title, value, change, changeType }: StatCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${changeType === "positive" ? "text-primary" : "text-destructive"}`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
