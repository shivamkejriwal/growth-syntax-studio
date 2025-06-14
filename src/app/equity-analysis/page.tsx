"use client"; // Required because we're using useState

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Activity, DollarSign, Zap, ArrowLeft } from "lucide-react";
import React, { useState } from "react"; // Import useState
import Image from "next/image";
import { SharePriceVsFairValueChart, sharePriceVsFairValueChartName } from "@/components/equity/SharePriceVsFairValueChart";
import { ManagementStackedAreaChart, managementStackedAreaChartName } from "@/components/equity/ManagementStackedAreaChart";
import { FinancialHealthLineChart, financialHealthChartName } from "@/components/equity/FinancialHealthLineChart";
import { DividendAnalysisChart, dividendAnalysisChartName } from "@/components/equity/DividendAnalysisChart";
import { IntroSnowflakeChart, introSnowflakeChartName } from "@/components/equity/IntroSnowflakeChart";
import { RevenueExpensesBreakdownChart, revenueExpensesBreakdownChartName } from "@/components/equity/RevenueExpensesBreakdownChart";
import { StockPriceHistoryChart, stockPriceHistoryChartName } from "@/components/equity/StockPriceHistoryChart";
import { QuarterlyEarningsChart, quarterlyEarningsChartName } from "@/components/equity/QuarterlyEarningsChart";

// --- Stock Price History Sample Data ---
const stockPriceHistoryData = [
  { date: '2024-06-01', price: 37.5 },
  { date: '2024-06-08', price: 38.1 },
  { date: '2024-06-15', price: 39.0 },
  { date: '2024-06-22', price: 38.7 },
  { date: '2024-06-29', price: 39.5 },
  { date: '2024-07-06', price: 40.2 },
  { date: '2024-07-13', price: 41.0 },
  { date: '2024-07-20', price: 40.8 },
  { date: '2024-07-27', price: 41.5 },
  { date: '2024-08-03', price: 42.0 },
  { date: '2024-08-10', price: 41.7 },
  { date: '2024-08-17', price: 42.3 },
  { date: '2024-08-24', price: 43.0 },
  { date: '2024-08-31', price: 43.5 },
  { date: '2024-09-07', price: 44.0 },
  { date: '2024-09-14', price: 43.8 },
  { date: '2024-09-21', price: 44.5 },
  { date: '2024-09-28', price: 45.0 },
  { date: '2024-10-05', price: 45.7 },
  { date: '2024-10-12', price: 46.2 },
  { date: '2024-10-19', price: 46.0 },
  { date: '2024-10-26', price: 46.8 },
  { date: '2024-11-02', price: 47.2 },
  { date: '2024-11-09', price: 47.5 },
  { date: '2024-11-16', price: 48.0 },
  { date: '2024-11-23', price: 48.3 },
  { date: '2024-11-30', price: 48.7 },
  { date: '2024-12-07', price: 49.0 },
  { date: '2024-12-14', price: 49.5 },
  { date: '2024-12-21', price: 50.0 },
  { date: '2024-12-28', price: 50.3 },
  { date: '2025-01-04', price: 50.7 },
  { date: '2025-01-11', price: 51.0 },
  { date: '2025-01-18', price: 51.5 },
  { date: '2025-01-25', price: 52.0 },
  { date: '2025-02-01', price: 52.3 },
  { date: '2025-02-08', price: 52.7 },
  { date: '2025-02-15', price: 53.0 },
  { date: '2025-02-22', price: 53.5 },
  { date: '2025-03-01', price: 54.0 },
  { date: '2025-03-08', price: 54.3 },
  { date: '2025-03-15', price: 54.7 },
  { date: '2025-03-22', price: 55.0 },
  { date: '2025-03-29', price: 55.5 },
  { date: '2025-04-05', price: 56.0 },
  { date: '2025-04-12', price: 56.3 },
  { date: '2025-04-19', price: 56.7 },
  { date: '2025-04-26', price: 57.0 },
  { date: '2025-05-03', price: 57.5 },
  { date: '2025-05-10', price: 58.0 },
  { date: '2025-05-17', price: 58.3 },
  { date: '2025-05-24', price: 58.7 },
  { date: '2025-05-31', price: 59.0 },
];

// --- Management Chart Sample Data ---
const managementChartData = [
  { year: '2011', research: 100, production: 150, acquisitions: 200 },
  { year: '2012', research: 120, production: 180, acquisitions: 220 },
  { year: '2013', research: 200, production: 250, acquisitions: 210 },
  { year: '2014', research: 180, production: 220, acquisitions: 230 },
  { year: '2015', research: 190, production: 240, acquisitions: 250 },
  { year: '2016', research: 170, production: 260, acquisitions: 270 },
  { year: '2017', research: 160, production: 230, acquisitions: 280 },
  { year: '2018', research: 220, production: 300, acquisitions: 260 },
  { year: '2019', research: 210, production: 270, acquisitions: 240 },
  { year: '2020', research: 200, production: 250, acquisitions: 200 },
];

// --- Financial Health Sample Data ---
const financialHealthData = [
  { year: '2012', debt: 150, netWorth: 400 },
  { year: '2013', debt: 160, netWorth: 550 },
  { year: '2014', debt: 165, netWorth: 520 },
  { year: '2015', debt: 170, netWorth: 530 },
  { year: '2016', debt: 200, netWorth: 540 },
  { year: '2017', debt: 280, netWorth: 450 },
  { year: '2018', debt: 250, netWorth: 460 },
  { year: '2019', debt: 240, netWorth: 455 },
  { year: '2020', debt: 260, netWorth: 470 },
  { year: '2021', debt: 300, netWorth: 500 },
];

// --- Dividend Analysis Sample Data ---
const dividendChartData = [
  { year: '2012', dps: 0.50 },
  { year: '2013', dps: 0.55 },
  { year: '2014', dps: 0.62 },
  { year: '2015', dps: 0.68 },
  { year: '2016', dps: 0.75 },
  { year: '2017', dps: 0.83 },
  { year: '2018', dps: 0.90 },
  { year: '2019', dps: 1.00 },
  { year: '2020', dps: 1.05 },
  { year: '2021', dps: 1.12 },
];
const dividendMetrics = [
  { label: "Score", value: "7" },
  { label: "Safety", value: "8" },
  { label: "Dividend History", value: "10" },
  { label: "Increasing Dividends", value: "10" },
  { label: "Stability", value: "1" },
  { label: "Dividend Yield", value: "2.5%", isPercentage: true },
];

// --- Quarterly Earnings Sample Data ---
const quarterlyEarningsData = [
  { quarter: 'Q1 2024', revenue: 1200, profit: 300 },
  { quarter: 'Q2 2024', revenue: 1350, profit: 350 },
  { quarter: 'Q3 2024', revenue: 1400, profit: 370 },
  { quarter: 'Q4 2024', revenue: 1500, profit: 400 },
  { quarter: 'Q1 2025', revenue: 1550, profit: 420 },
];

// --- Revenue & Expenses Breakdown Sample Data ---
const revenueExpensesData = {
  nodes: [
    { id: 'Off-Road' },
    { id: 'On-Road' },
    { id: 'Marine' },
    { id: 'Other Revenue' },
    { id: 'Total Revenue' },
    { id: 'Cost of Sales' },
    { id: 'Gross Profit' },
    { id: 'General & Admin' },
    { id: 'Research & Dev' },
    { id: 'Sales & Marketing' },
    { id: 'Non-Operating Exp' },
    { id: 'Total Expenses' },
    { id: 'Net Earnings' },
  ],
  links: [
    { source: 'Off-Road', target: 'Total Revenue', value: 5570000000 },
    { source: 'On-Road', target: 'Total Revenue', value: 932400000 },
    { source: 'Marine', target: 'Total Revenue', value: 472800000 },
    { source: 'Other Revenue', target: 'Total Revenue', value: 97800000 },
    { source: 'Total Revenue', target: 'Gross Profit', value: 1480000000 },
    { source: 'Total Revenue', target: 'Cost of Sales', value: 5590000000 },
    { source: 'Gross Profit', target: 'Net Earnings', value: 40200000 },
    { source: 'Gross Profit', target: 'Total Expenses', value: 1439800000 },
    { source: 'Total Expenses', target: 'General & Admin', value: 440200000 },
    { source: 'Total Expenses', target: 'Research & Dev', value: 332000000 },
    { source: 'Total Expenses', target: 'Sales & Marketing', value: 491600000 },
    { source: 'Total Expenses', target: 'Non-Operating Exp', value: 176000000 },
  ],
};

export default function EquityAnalysisPage() {
  const [focusedChartKey, setFocusedChartKey] = useState<string | null>(null);

  const companyData = {
    name: "Example Corp",
    ticker: "EXMPL",
    valuation: "$150.7B",
    peRatio: "25.3",
    financialHealth: "Stable (B+)",
    debtToEquity: "0.45",
    futurePerformance: "Moderate Growth Expected",
    analystRating: "Buy (4.2/5)",
    pastDividends: "$1.20/share (Annual)",
    yield: "2.1%",
  };

  const sharePriceVsFairValueData = {
    currentPrice: 37.96,
    fairValue: 62.93,
    undervaluedThresholdPercent: 20,
    overvaluedThresholdPercent: 20,
    currencySymbol: "US$",
  };

  const handleChartFocus = (chartKey: string) => {
    setFocusedChartKey(chartKey);
    window.scrollTo(0, 0); // Scroll to top when a chart is focused
  };

  const handleClearFocus = () => {
    setFocusedChartKey(null);
  };

  // Define all chart configurations in an array for easier management
  const allChartConfigs = [
    {
      key: introSnowflakeChartName,
      component: <IntroSnowflakeChart onMoreDetailsClick={handleChartFocus} />,
    },
    {
      key: sharePriceVsFairValueChartName,
      component: (
        <SharePriceVsFairValueChart
          currentPrice={sharePriceVsFairValueData.currentPrice}
          fairValue={sharePriceVsFairValueData.fairValue}
          undervaluedThreshold={sharePriceVsFairValueData.fairValue * (1 - sharePriceVsFairValueData.undervaluedThresholdPercent / 100)}
          overvaluedThreshold={sharePriceVsFairValueData.fairValue * (1 + sharePriceVsFairValueData.overvaluedThresholdPercent / 100)}
          currencySymbol={sharePriceVsFairValueData.currencySymbol}
          ticker={companyData.ticker}
          companyName={companyData.name}
          onMoreDetailsClick={handleChartFocus}
        />
      ),
    },
    {
      key: stockPriceHistoryChartName,
      component: <StockPriceHistoryChart ticker={companyData.ticker} data={stockPriceHistoryData} onMoreDetailsClick={handleChartFocus} />,
    },
    {
      key: managementStackedAreaChartName,
      component: <ManagementStackedAreaChart data={managementChartData} onMoreDetailsClick={handleChartFocus} />,
    },
    {
      key: financialHealthChartName,
      component: <FinancialHealthLineChart data={financialHealthData} onMoreDetailsClick={handleChartFocus} />,
    },
    {
      key: dividendAnalysisChartName,
      component: <DividendAnalysisChart data={dividendChartData} metrics={dividendMetrics} onMoreDetailsClick={handleChartFocus} />,
    },
    {
      key: quarterlyEarningsChartName,
      component: <QuarterlyEarningsChart ticker={companyData.ticker} data={quarterlyEarningsData} onMoreDetailsClick={handleChartFocus} />,
    },
    {
      key: revenueExpensesBreakdownChartName,
      component: <RevenueExpensesBreakdownChart data={revenueExpensesData} onMoreDetailsClick={handleChartFocus} />,
    },
  ];

  if (focusedChartKey) {
    const focusedChart = allChartConfigs.find(chart => chart.key === focusedChartKey);
    return (
      <AppShell>
        <div className="p-4 md:p-6">
          <Button onClick={handleClearFocus} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
          </Button>
          {focusedChart ? <div className="w-full">{focusedChart.component}</div> : <p>Chart not found.</p>}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Equity Analysis</h1>
          <div className="flex w-full md:w-auto items-center space-x-2">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search company (e.g., AAPL)" className="pl-8 md:w-[300px]" />
            </div>
            <Button>Analyze</Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{companyData.name} ({companyData.ticker})</CardTitle>
                <CardDescription>Detailed financial overview and performance metrics.</CardDescription>
              </div>
              <Image src="https://placehold.co/100x40.png" alt={`${companyData.name} logo`} width={100} height={40} data-ai-hint="company logo"/>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard icon={<DollarSign />} title="Valuation" value={companyData.valuation} subValue={`P/E Ratio: ${companyData.peRatio}`} />
            <InfoCard icon={<Briefcase />} title="Financial Health" value={companyData.financialHealth} subValue={`Debt/Equity: ${companyData.debtToEquity}`} />
            <InfoCard icon={<Zap />} title="Future Performance" value={companyData.futurePerformance} subValue={`Analyst Rating: ${companyData.analystRating}`} />
            <InfoCard icon={<Activity />} title="Past Dividends" value={companyData.pastDividends} subValue={`Yield: ${companyData.yield}`} />
            
             <Card className="p-4 bg-card/70">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Earnings Per Share (EPS)</h3>
              <p className="text-xl font-semibold">$5.67</p>
              <p className="text-xs text-primary">+8% YoY</p>
            </Card>
             <Card className="p-4 bg-card/70">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Revenue Growth</h3>
              <p className="text-xl font-semibold">+12.5%</p>
              <p className="text-xs text-muted-foreground">Trailing Twelve Months</p>
            </Card>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {allChartConfigs.map(chartConfig => (
            <React.Fragment key={chartConfig.key}>
              {chartConfig.component}
            </React.Fragment>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subValue?: string;
}

function InfoCard({ icon, title, value, subValue }: InfoCardProps) {
  return (
    <Card className="p-4 bg-card/70">
      <div className="flex items-center space-x-3 mb-2">
        <span className="p-2 bg-primary/20 text-primary rounded-md">{icon}</span>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <p className="text-xl font-semibold">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </Card>
  );
}
