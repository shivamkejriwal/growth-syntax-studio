"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleLineChart } from "@/components/charts/sample-line-chart"; // Placeholder for timeline

// Helper function to format currency (simplified)
const formatCurrency = (value: number, unit: 'b' | 'm' | 'k' = 'b') => {
  let valStr = "";
  if (unit === 'b') valStr = (value / 1_000_000_000).toFixed(2) + 'b';
  else if (unit === 'm') valStr = (value / 1_000_000).toFixed(2) + 'm';
  else valStr = (value / 1_000).toFixed(2) + 'k';
  return `US$${valStr}`;
};

// Define colors based on the image
const colorRevenue = "hsl(var(--chart-1))"; // Blue
const colorGrossProfit = "hsl(var(--chart-5))"; // Light Teal/Gray
const colorCostOfSales = "#B8860B"; // DarkGoldenRod - for Cost of Sales & Expenses
const colorEarnings = "hsl(var(--chart-2))"; // Green
const colorExpenses = "#D2B48C"; // Tan - for general expenses and sub-categories

interface DataPointProps {
  label: string;
  value: string;
  barColor: string;
  barHeight?: string; // e.g., "h-16"
  badgeText?: string;
  badgeColor?: "blue" | "green" | "yellow";
  className?: string;
}

const DataPoint: React.FC<DataPointProps> = ({ label, value, barColor, barHeight = "h-12", badgeText, badgeColor, className }) => {
  let badgeBg = "";
  if (badgeColor === "blue") badgeBg = "bg-blue-500 hover:bg-blue-600";
  else if (badgeColor === "green") badgeBg = "bg-green-500 hover:bg-green-600";
  else if (badgeColor === "yellow") badgeBg = "bg-yellow-600 hover:bg-yellow-700";
  
  return (
    <div className={cn("flex items-start space-x-2 py-1", className)}>
      <div className="flex-shrink-0">
        <div style={{ backgroundColor: barColor }} className={cn("w-2 rounded-sm", barHeight)}></div>
      </div>
      <div className="flex-grow">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
      {badgeText && (
        <Badge variant="default" className={cn("ml-auto text-xs text-white", badgeBg)}>
          {badgeText}
        </Badge>
      )}
    </div>
  );
};


const RevenueExpensesBreakdownChart: React.FC = () => {
  // Data from the image
  const revenueData = {
    offRoad: 5570000000,
    onRoad: 932400000,
    marine: 472800000,
    other: 97800000,
    totalRevenue: 7070000000,
  };
  const profitData = {
    grossProfit: 1480000000,
    costOfSales: 5590000000,
  };
  const earningsData = {
    earnings: 40200000,
    expensesTotal: 1440000000,
  };
  const expensesBreakdown = {
    generalAdmin: 440200000,
    researchDev: 332000000,
    salesMarketing: 491600000,
    nonOperating: 175300000,
  };

  const calculateBarHeight = (value: number, maxValue: number, baseHeightClass: string = "h-16") => {
    const minHeightPx = 8; // Minimum height for small values to be visible
    const maxHeightPx = 64; // Corresponds to h-16 (4rem)
    
    if (maxValue === 0) return `h-[${minHeightPx}px]`;
    const proportion = Math.max(0.05, value / maxValue); // Ensure a minimum proportion for visibility
    const calculatedHeightPx = Math.max(minHeightPx, proportion * maxHeightPx);
    return `h-[${Math.min(calculatedHeightPx, maxHeightPx).toFixed(0)}px]`;
  }
  
  const totalRevenueSources = revenueData.offRoad + revenueData.onRoad + revenueData.marine + revenueData.other;


  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl">Revenue &amp; Expenses Breakdown</CardTitle>
        <CardDescription>
          How Example Corp makes and spends money. Based on latest reported earnings, on an LTM basis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Chart Placeholder */}
        <div className="h-20 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground text-sm">
          Timeline Chart Area (2014-2025) - Placeholder
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-x-2 items-start">
          {/* Column 1: Revenue Sources */}
          <div className="md:col-span-2 space-y-1 pr-2">
            <DataPoint label="Off-Road" value={formatCurrency(revenueData.offRoad, 'b')} barColor={colorRevenue} barHeight={calculateBarHeight(revenueData.offRoad, totalRevenueSources)} />
            <DataPoint label="On-Road" value={formatCurrency(revenueData.onRoad, 'm')} barColor={colorRevenue} barHeight={calculateBarHeight(revenueData.onRoad, totalRevenueSources)} />
            <DataPoint label="Marine" value={formatCurrency(revenueData.marine, 'm')} barColor={colorRevenue} barHeight={calculateBarHeight(revenueData.marine, totalRevenueSources)} />
            <DataPoint label="Other" value={formatCurrency(revenueData.other, 'm')} barColor={colorRevenue} barHeight={calculateBarHeight(revenueData.other, totalRevenueSources)} />
          </div>

          {/* Connector Arrow (Simplified) */}
          <div className="hidden md:flex md:col-span-1 items-center justify-center h-full">
            <div className="w-px h-3/4 bg-border relative">
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-border"></div>
            </div>
          </div>

          {/* Column 2: Total Revenue, GP, CoS */}
          <div className="md:col-span-2 space-y-1 pr-2">
            <DataPoint label="Total Revenue" value={formatCurrency(revenueData.totalRevenue, 'b')} barColor={colorRevenue} barHeight="h-20" badgeText="Revenue" badgeColor="blue" />
            <div className="pt-4 space-y-1">
              <DataPoint label="Gross Profit" value={formatCurrency(profitData.grossProfit, 'b')} barColor={colorGrossProfit} barHeight={calculateBarHeight(profitData.grossProfit, revenueData.totalRevenue)} />
              <DataPoint label="Cost of Sales" value={formatCurrency(profitData.costOfSales, 'b')} barColor={colorCostOfSales} barHeight={calculateBarHeight(profitData.costOfSales, revenueData.totalRevenue, "h-20")} />
            </div>
          </div>
          
          {/* Connector Arrow (Simplified) */}
          <div className="hidden md:flex md:col-span-1 items-center justify-center h-full">
             <div className="w-px h-1/2 bg-border relative">
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-border"></div>
            </div>
          </div>


          {/* Column 3: Earnings, Expenses */}
          <div className="md:col-span-2 space-y-1 pr-2">
            <DataPoint label="Earnings" value={formatCurrency(earningsData.earnings, 'm')} barColor={colorEarnings} barHeight={calculateBarHeight(earningsData.earnings, profitData.grossProfit)} badgeText="Earnings" badgeColor="green" />
             <div className="pt-4">
                <DataPoint label="Total Expenses" value={formatCurrency(earningsData.expensesTotal, 'b')} barColor={colorExpenses} barHeight={calculateBarHeight(earningsData.expensesTotal, profitData.grossProfit, "h-20")} badgeText="Expenses" badgeColor="yellow" />
             </div>
          </div>

          {/* Connector Arrow (Simplified) */}
           <div className="hidden md:flex md:col-span-1 items-center justify-center h-full">
             <div className="w-px h-1/2 bg-border relative">
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-border"></div>
            </div>
          </div>

          {/* Column 4: Expense Breakdown */}
          <div className="md:col-span-2 space-y-1">
            <DataPoint label="General &amp; Admin..." value={formatCurrency(expensesBreakdown.generalAdmin, 'm')} barColor={colorExpenses} barHeight={calculateBarHeight(expensesBreakdown.generalAdmin, earningsData.expensesTotal)} />
            <DataPoint label="Research &amp; Devel..." value={formatCurrency(expensesBreakdown.researchDev, 'm')} barColor={colorExpenses} barHeight={calculateBarHeight(expensesBreakdown.researchDev, earningsData.expensesTotal)} />
            <DataPoint label="Sales &amp; Marketin..." value={formatCurrency(expensesBreakdown.salesMarketing, 'm')} barColor={colorExpenses} barHeight={calculateBarHeight(expensesBreakdown.salesMarketing, earningsData.expensesTotal)} />
            <DataPoint label="Non-Operating Ex..." value={formatCurrency(expensesBreakdown.nonOperating, 'm')} barColor={colorExpenses} barHeight={calculateBarHeight(expensesBreakdown.nonOperating, earningsData.expensesTotal)} />
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default RevenueExpensesBreakdownChart;