"use client"; // Required because we're using useState

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Activity, DollarSign, Zap, ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react"; // Import useState and useEffect
import Image from "next/image";
import { SharePriceVsFairValueChart, sharePriceVsFairValueChartName } from "@/components/equity/SharePriceVsFairValueChart";
import { ManagementStackedAreaChart, managementStackedAreaChartName } from "@/components/equity/ManagementStackedAreaChart";
import { FinancialHealthLineChart, financialHealthChartName } from "@/components/equity/FinancialHealthLineChart";
import { DividendAnalysisChart, dividendAnalysisChartName } from "@/components/equity/DividendAnalysisChart";
import { IntroSnowflakeChart, introSnowflakeChartName } from "@/components/equity/IntroSnowflakeChart";
import { RevenueExpensesBreakdownChart, revenueExpensesBreakdownChartName } from "@/components/equity/RevenueExpensesBreakdownChart";
import { StockPriceHistoryChart, stockPriceHistoryChartName } from "@/components/equity/StockPriceHistoryChart";
import { QuarterlyEarningsChart, quarterlyEarningsChartName } from "@/components/equity/QuarterlyEarningsChart";
import { getSampleEquitiesTickers } from "@/services/nasdaqDataLink/sampleDataApi";
import {
  BarDataItem,
  StockPriceHistoryChartItem,
  BalanceSheetItem,
  IncomeStatementItem,
  CashFlowStatementItem,
  ManagementChartDataPoint,
  InfoCardProps,
} from "./interfaces";
import { processFetchedEquityData } from "./utils";

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
  const [stockPriceHistoryData, setStockPriceHistoryData] = useState<StockPriceHistoryChartItem[]>([]);
  const [financialHealthData, setFinancialHealthData] = useState<Array<{ year: string; debt: number; equity: number }>>([]);
  const [quarterlyEarningsData, setQuarterlyEarningsData] = useState<Array<{ quarter: string; revenue: number; netIncome: number }>>([]);
  const [managementChartData, setManagementChartData] = useState<ManagementChartDataPoint[]>([]);
  const [dividendChartData, setDividendChartData] = useState<Array<{ year: string; dps: number }>>([]);
  const [dividendMetrics, setDividendMetrics] = useState<Array<{ label: string; value: string; isPercentage?: boolean }>>([]);
  const [sharePriceVsFairValueData, setSharePriceVsFairValueData] = useState({
    currentPrice: 0,
    fairValue: 0,
    undervaluedThresholdPercent: 20,
    overvaluedThresholdPercent: 20,
    currencySymbol: "$",
  });

  // Reset all chart data to empty arrays
  const resetAllChartData = () => {
    setStockPriceHistoryData([]);
    setFinancialHealthData([]);
    setQuarterlyEarningsData([]);
    setManagementChartData([]);
    setDividendChartData([]);
    setDividendMetrics([]);
  };

  const handleChartFocus = (chartKey: string) => {
    setFocusedChartKey(chartKey);
    window.scrollTo(0, 0); // Scroll to top when a chart is focused
  };

  const handleClearFocus = () => {
    setFocusedChartKey(null);
  };

  const fetchAllData = async () => {
    if (!companyData.ticker) {
      // Reset data if ticker is not available
      resetAllChartData();
      setSharePriceVsFairValueData({
        currentPrice: 0,
        fairValue: 0,
        undervaluedThresholdPercent: 20,
        overvaluedThresholdPercent: 20,
        currencySymbol: "$",
      });
      return;
    }

    try {
      // Fetch all required raw data in parallel
      const [
        rawBarData,
        rawBalanceSheetData,
        rawIncomeStatementData,
        rawCashFlowData,
      ] = await Promise.all([
        getSampleEquitiesTickers({ ticker: companyData.ticker, table: 'BARS' }) as Promise<BarDataItem[]>,
        getSampleEquitiesTickers({ ticker: companyData.ticker, table: 'BALANCE_SHEET' }) as Promise<BalanceSheetItem[]>,
        getSampleEquitiesTickers({ ticker: companyData.ticker, table: 'INCOME_STATEMENT' }) as Promise<IncomeStatementItem[]>,
        getSampleEquitiesTickers({ ticker: companyData.ticker, table: 'CASH_FLOW_STATEMENT' }) as Promise<CashFlowStatementItem[]>,
      ]);
      console.log("Fetched raw data:", {
        rawBarData,
        rawBalanceSheetData,
        rawIncomeStatementData,
        rawCashFlowData,
      });
      // Process all fetched data using the common function
      const processedData = processFetchedEquityData(
        rawBarData,
        rawBalanceSheetData,
        rawIncomeStatementData,
        rawCashFlowData,
        companyData
      );

      // Update states with processed data
      setStockPriceHistoryData(processedData.stockPriceHistory);
      setFinancialHealthData(processedData.financialHealth);
      setQuarterlyEarningsData(processedData.quarterlyEarnings);
      setManagementChartData(processedData.managementAllocation);
      setDividendChartData(processedData.dividendChartData);
      setDividendMetrics(processedData.dividendMetrics);
      setSharePriceVsFairValueData(processedData.sharePriceVsFairValueData);
    } catch (error) {
      console.error("Failed to fetch equity data:", error);
      resetAllChartData();
      setSharePriceVsFairValueData({
        currentPrice: 0,
        fairValue: 0,
        undervaluedThresholdPercent: 20,
        overvaluedThresholdPercent: 20,
        currencySymbol: "$",
      });
    }
  };

  // Build companyData from processed state variables and static values
  const companyData = {
    name: "Polaris",
    ticker: "PII",
    valuation: sharePriceVsFairValueData.fairValue ? `$${sharePriceVsFairValueData.fairValue}B` : "$150.7B",
    peRatio: "25.3", // If you have a peRatio in processedData, use it here
    financialHealth: financialHealthData.length > 0 ? `Stable (${financialHealthData[0].debt < 1 ? 'B+' : 'B'})` : "Stable (B+)",
    debtToEquity: financialHealthData.length > 0 ? financialHealthData[0].debt.toFixed(2) : "0.45",
    futurePerformance: "Moderate Growth Expected", // Add from processedData if available
    analystRating: "Buy (4.2/5)", // Add from processedData if available
    pastDividends: dividendChartData.length > 0 ? `$${dividendChartData[dividendChartData.length-1].dps}/share (Annual)` : "$1.20/share (Annual)",
    yield: dividendMetrics.find((m: any) => m.label === "Dividend DPS")?.value ? `${dividendMetrics.find((m: any) => m.label === "Dividend DPS")?.value}%` : "2.1%",
  };

  useEffect(() => {
    fetchAllData();
  }, [companyData.ticker]); // Dependency array ensures this runs when ticker changes

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
