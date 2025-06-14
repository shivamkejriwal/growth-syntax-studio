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
import Finance from "@/math/finance"; // Import utility function for cash allocation data
import { getSampleEquitiesTickers } from "@/services/nasdaqDataLink/sampleDataApi";

// Define an interface for the bar data items (matching bars.json structure)
interface BarDataItem {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Define an interface for the data format expected by StockPriceHistoryChart
interface StockPriceHistoryChartItem {
  date: string;
  price: number;
}

// Define an interface for the raw balance sheet data items (matching balance-sheet.json structure)
interface BalanceSheetItem {
  symbol: string;
  calendardate: string; // e.g., "2021-12-31"
  debt: number;
  equity: number;
  assets: number;
  reporttype?: string; // Made optional
  currency?: string;   // Made optional
  bvps?: number;
  cashneq?: number;
  liabilities?: number;
  investmentsnc?: number;
  receivables?: number;
  inventory?: number;
  ppnenet?: number;
  intangibles?: number;
  tangibles?: number;
}

// Define an interface for the raw income statement data items (matching income-statement.json structure)
interface IncomeStatementItem {
  symbol: string;
  calendardate: string; // e.g., "2024-03-31"
  revenue: number;
  cor: number; // Cost of Revenue
  opinc: number; // Operating Income
  eps: number | null; // Earnings Per Share
  ebitda: number | null; // Earnings Before Interest, Taxes, Depreciation, and Amortization
  ebit: number | null; // Earnings Before Interest and Taxes
  gp: number; // Gross Profit
  rnd: number; // Research and Development
  sgna: number; // Selling, General & Administrative
  opex: number; // Operating Expenses
  taxexp: number; // Income Tax Expense
  netinc: number; // Net Income
  shareswa: number | null; // Weighted Average Shares Outstanding
  reporttype?: string; // Made optional as not all entries have it
  currency?: string;   // Made optional
}

// Define an interface for the raw cash flow statement data items
interface CashFlowStatementItem {
  symbol: string;
  calendardate: string; // e.g., "2021-12-31"
  ncfi?: number;         // Net Cash Flow from Investing
  capex?: number;        // Capital Expenditures (now stored as negative in JSON)
  reporttype?: string;   // AR, AQ etc.
  currency?: string;
  opex?: number;         // Operating Expenses
  ncff?: number;         // Net Cash Flow from Financing
  fcf?: number;          // Free Cash Flow
  ncfo?: number;         // Net Cash Flow from Operations
  sbcomp?: number;       // Stock-Based Compensation
  depamor?: number;      // Depreciation and Amortization
  ncfcommon?: number;    // Net Cash Flow from Common Stock
  ncfinv?: number;       // Net Change in Investments / Other Investing Activities
}

interface ManagementChartDataPoint {
  year: string;
  research: number;
  production: number;
  acquisitions: number;
}

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

  const getQuarterFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    const quarter = Math.floor((date.getMonth() + 3) / 3);
    return `Q${quarter} ${date.getFullYear()}`;
  };



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

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        const rawBarData: BarDataItem[] = await getSampleEquitiesTickers({
          ticker: companyData.ticker, // "EXMPL"
          table: 'BARS',
          // date and range are optional for getSampleEquitiesTickers if not filtering by date
        });

        // Transform data for the StockPriceHistoryChart
        const formattedData = rawBarData.map(item => ({
          date: item.date,
          price: item.close, // Using 'close' price for the chart
        }));
        setStockPriceHistoryData(formattedData);
      } catch (error) {
        console.error("Failed to fetch stock price history:", error);
      }
    };
    fetchStockHistory();

    const fetchFinancialHealth = async () => {
      try {
        const rawBalanceSheetData: BalanceSheetItem[] = await getSampleEquitiesTickers({
          ticker: companyData.ticker, // "EXMPL"
          table: 'BALANCE_SHEET',
        });

        // Transform data for the FinancialHealthLineChart
        // The chart expects { year: string; debt: number; equity: number }
        const formattedData = rawBalanceSheetData.map(item => ({
          year: item.calendardate.substring(0, 4), // Extract year from "YYYY-MM-DD"
          debt: item.debt,
          equity: item.equity,
        }));
        setFinancialHealthData(formattedData);
      } catch (error) {
        console.error("Failed to fetch financial health data:", error);
      }
    };
    fetchFinancialHealth();

    const fetchQuarterlyEarnings = async () => {
      try {
        const rawIncomeStatementData: IncomeStatementItem[] = await getSampleEquitiesTickers({
          ticker: companyData.ticker, // "EXMPL"
          table: 'INCOME_STATEMENT',
        });

        // Transform data for the QuarterlyEarningsChart
        // The chart expects { quarter: string; revenue: number; netIncome: number }
        const formattedData = rawIncomeStatementData.map(item => ({
          quarter: getQuarterFromDate(item.calendardate),
          revenue: item.revenue,
          netIncome: item.netinc,
        }));
        // Sort by calendar date to ensure chronological order for the chart
        formattedData.sort((a, b) => new Date(rawIncomeStatementData.find(item => getQuarterFromDate(item.calendardate) === a.quarter)!.calendardate).getTime() - new Date(rawIncomeStatementData.find(item => getQuarterFromDate(item.calendardate) === b.quarter)!.calendardate).getTime());
        setQuarterlyEarningsData(formattedData);
      } catch (error) {
        console.error("Failed to fetch quarterly earnings data:", error);
      }
    };
    fetchQuarterlyEarnings();

    const fetchManagementAllocationData = async () => {
      if (!companyData.ticker) return;
      try {
        const rawCashFlowData: CashFlowStatementItem[] = await getSampleEquitiesTickers({
          ticker: companyData.ticker,
          table: 'CASH_FLOW_STATEMENT',
        });

        const rawIncomeStatementData: IncomeStatementItem[] = await getSampleEquitiesTickers({
          ticker: companyData.ticker,
          table: 'INCOME_STATEMENT',
        });

        // Filter for annual reports and the specific ticker
        const annualCashFlow = rawCashFlowData.filter(
          item => item.symbol === companyData.ticker && item.reporttype === 'AR'
        );
        const annualIncome = rawIncomeStatementData.filter(
          item => item.symbol === companyData.ticker && item.reporttype === 'AR'
        );

        // Combine data by year
        const combinedFinancials = annualCashFlow.map(cfItem => {
          const year = cfItem.calendardate.substring(0, 4);
          const incomeItem = annualIncome.find(
            incItem => incItem.calendardate.substring(0, 4) === year
          );
          return {
            year: year,
            ncfi: cfItem.ncfi || 0, // Default to 0 if undefined
            // CAPEX is stored as negative in JSON, Finance.getCashAllocationData likely expects positive
            capexReported: cfItem.capex !== undefined ? Math.abs(cfItem.capex) : 0,
            // Use RND from income statement, default to 0 if not found for that year
            rndReported: incomeItem && incomeItem.rnd !== undefined ? incomeItem.rnd : 0,
          };
        }).filter(item => item.rndReported !== undefined); // Ensure RND was processed (even if 0)

        // Sort by year for chronological order in the chart
        combinedFinancials.sort((a, b) => parseInt(a.year) - parseInt(b.year));

        const chartData = combinedFinancials.map(item => {
          const allocation = Finance.getCashAllocationData({
            NCFI: item.ncfi,
            CAPEX: item.capexReported,
            RND: item.rndReported,
          });
          return {
            year: item.year,
            research: allocation.rnd,
            production: allocation.capex,
            acquisitions: allocation.acquisitions,
          };
        });
        setManagementChartData(chartData);
      } catch (error) {
        console.error("Failed to fetch management allocation data:", error);
        setManagementChartData([]); // Reset or handle error appropriately
      }
    };
    fetchManagementAllocationData();

  }, [companyData.ticker]); // Dependency array ensures this runs when ticker changes


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
