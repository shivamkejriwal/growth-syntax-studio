
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { Globe, Landmark, Briefcase, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from 'react';

const sampleGainers = [
  { ticker: "AAPL", close: 165.30, change: "+3.32%", changeType: "positive" },
  { ticker: "BA", close: 197.85, change: "+0.93%", changeType: "positive" },
  { ticker: "BNTX", close: 351.74, change: "+4.81%", changeType: "positive" },
  { ticker: "CHGG", close: 27.85, change: "+6.70%", changeType: "positive" },
  { ticker: "CPIX", close: 5.03, change: "+21.79%", changeType: "positive" },
  { ticker: "GRTS", close: 13.20, change: "+25.95%", changeType: "positive" },
  { ticker: "LI", close: 35.44, change: "+2.96%", changeType: "positive" },
  { ticker: "MEIP", close: 3.37, change: "+19.50%", changeType: "positive" },
  { ticker: "MRNA", close: 352.43, change: "+0.24%", changeType: "positive" },
  { ticker: "MSTR", close: 721.43, change: "+3.32%", changeType: "positive" },
];

const sampleLosers = [
  { ticker: "NFLX", close: 400.10, change: "-2.08%", changeType: "negative" },
  { ticker: "ZM", close: 65.20, change: "-1.95%", changeType: "negative" },
  { ticker: "PYPL", close: 70.50, change: "-1.54%", changeType: "negative" },
  { ticker: "COIN", close: 150.80, change: "-3.10%", changeType: "negative" },
  { ticker: "HOOD", close: 10.20, change: "-4.50%", changeType: "negative" },
];

const sampleActive = [
  { ticker: "TSLA", close: 720.15, change: "+1.44%", changeType: "positive", volume: "120M" },
  { ticker: "AMD", close: 105.50, change: "-0.50%", changeType: "negative", volume: "95M" },
  { ticker: "NVDA", close: 410.25, change: "+1.26%", changeType: "positive", volume: "80M" },
  { ticker: "F", close: 12.50, change: "+0.80%", changeType: "positive", volume: "75M" },
  { ticker: "BAC", close: 35.00, change: "-0.20%", changeType: "negative", volume: "70M" },
];


export default function MarketOverviewPage() {
  const [activeTab, setActiveTab] = useState("gainers");

  const getTableData = () => {
    switch (activeTab) {
      case "gainers":
        return sampleGainers;
      case "losers":
        return sampleLosers;
      case "active":
        return sampleActive;
      default:
        return [];
    }
  };

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

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Market Movers & Activity</CardTitle>
            <CardDescription>Market data for {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                {/* Placeholder for the slider, can be implemented later */}
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
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Sector Performance</CardTitle>
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
    <div className="max-h-[400px] overflow-y-auto">
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

