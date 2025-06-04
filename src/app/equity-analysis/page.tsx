"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Activity, DollarSign, Zap } from "lucide-react";
import Image from "next/image";
import SharePriceVsFairValueChart from "@/components/equity/SharePriceVsFairValueChart";
import ManagementStackedAreaChart from "@/components/equity/ManagementStackedAreaChart";
import FinancialHealthLineChart from "@/components/equity/FinancialHealthLineChart";
import DividendAnalysisChart from "@/components/equity/DividendAnalysisChart";
import IntroSnowflakeChart from "@/components/equity/IntroSnowflakeChart";
import RevenueExpensesBreakdownChart from "@/components/equity/RevenueExpensesBreakdownChart";
import { StockPriceHistoryChart } from "@/components/equity/StockPriceHistoryChart";
import { QuarterlyEarningsChart } from "@/components/equity/QuarterlyEarningsChart";
import Finance from "@/math/finance";
import { getSampleData } from "@/services/nasdaqDataLink/sampleDataApi";
import { useEffect, useState } from "react";

// --- Unified Company Profile & Sample Data ---
interface CompanyProfile {
  name: string;
  ticker: string;
  sector: string;
  currency: string;
  logoUrl: string;
  valuation: string;
  peRatio: string;
  financialHealth: string;
  debtToEquity: string;
  futurePerformance: string;
  analystRating: string;
  pastDividends: string;
  yield: string;
  eps: string;
  epsGrowth: string;
  revenueGrowth: string;
  revenueGrowthPeriod: string;
}

const companyProfile: CompanyProfile = {
  name: "Example Corp",
  ticker: "EXMPL",
  sector: "Technology",
  currency: "USD",
  logoUrl: "https://placehold.co/100x40.png",
  valuation: "$150.7B",
  peRatio: "25.3",
  financialHealth: "Stable (B+)",
  debtToEquity: "0.45",
  futurePerformance: "Moderate Growth Expected",
  analystRating: "Buy (4.2/5)",
  pastDividends: "$1.20/share (Annual)",
  yield: "2.1%",
  eps: "$5.67",
  epsGrowth: "+8% YoY",
  revenueGrowth: "+12.5%",
  revenueGrowthPeriod: "Trailing Twelve Months",
};

// --- Sample Fundamentals for DCF ---
const sampleFundamentals = {
  revenue: 120_000_000_000,
  netIncome: 28_000_000_000,
  sharesOutstanding: 2_500_000_000,
  freeCashFlow: 25_000_000_000,
  growthRate: 0.07,
  capex: 5_000_000_000,
  debt: 15_000_000_000,
  cash: 10_000_000_000,
};

function getSharePriceVsFairValueData(
  profile: CompanyProfile,
  fundamentals: typeof sampleFundamentals
) {
  const growthOfMarket = 8.5;
  const riskFreeRate = 2.5;
  const timeFrame = 5;
  const discountRate = profile.sector === "Financial" ? growthOfMarket + riskFreeRate : growthOfMarket;
  const growthRate = profile.sector === "Financial" ? riskFreeRate : fundamentals.growthRate;
  const fundamentalsArr = [
    {
      REVENUE: fundamentals.revenue,
      NETINC: fundamentals.netIncome,
      SHARESWA: fundamentals.sharesOutstanding,
      FCF: fundamentals.freeCashFlow,
      CAPEX: fundamentals.capex,
      LIABILITIESNC: fundamentals.debt,
      NCFF: 0,
      NCFI: 0,
      NCFO: 0,
      DPS: 0,
    },
  ];
  const fairValue = Finance.evaluateDCF(
    { sector: profile.sector },
    fundamentalsArr,
    timeFrame,
    discountRate,
    riskFreeRate,
    growthRate
  );
  const currentPrice = Math.round(fairValue * 0.6 * 100) / 100;
  const undervaluedThreshold = Math.round(fairValue * 0.8 * 100) / 100;
  const overvaluedThreshold = Math.round(fairValue * 1.2 * 100) / 100;
  return {
    currentPrice,
    fairValue: Math.round(fairValue * 100) / 100,
    undervaluedThreshold,
    overvaluedThreshold,
    currencySymbol: profile.currency === "USD" ? "US$" : profile.currency + "$",
  };
}

const sharePriceVsFairValueData = getSharePriceVsFairValueData(companyProfile, sampleFundamentals);

// --- Unified Company Sample Data (from sampleDataApi) ---
async function buildCompanySampleData(ticker: string) {
  // Fetch all relevant tables in parallel
  const [quotes, fundamentals, balanceSheet, cashFlow, incomeStatement] = await Promise.all([
    getSampleData({ table: "QUOTES", filter: { symbol: ticker } }),
    getSampleData({ table: "FUNDAMENTAL_DETAILS", filter: { symbol: ticker } }),
    getSampleData({ table: "BALANCE_SHEET", filter: { symbol: ticker } }),
    getSampleData({ table: "CASH_FLOW_STATEMENT", filter: { symbol: ticker } }),
    getSampleData({ table: "INCOME_STATEMENT", filter: { symbol: ticker } }),
  ]);

  // Filter for the correct ticker in all arrays
  const filteredQuotes = quotes.filter((q: any) => q.symbol === ticker);
  const filteredFundamentals = fundamentals.filter((f: any) => f.symbol === ticker);
  const filteredBalanceSheet = balanceSheet.filter((b: any) => b.symbol === ticker);
  const filteredCashFlow = cashFlow.filter((c: any) => c.symbol === ticker);
  const filteredIncomeStatement = incomeStatement.filter((i: any) => i.symbol === ticker);

  const quote = filteredQuotes[0] || {};
  const fundamental = filteredFundamentals[0] || {};

  // Profile
  const profile = {
    name: quote.name || ticker,
    ticker: quote.symbol || ticker,
    sector: fundamental.sector || "N/A",
    currency: quote.currency || "USD",
    logoUrl: "https://placehold.co/100x40.png",
    valuation: quote.marketcap ? `$${(quote.marketcap / 1e9).toFixed(1)}B` : "N/A",
    peRatio: quote.pe ? quote.pe.toString() : "N/A",
    financialHealth: "Stable (B+)",
    debtToEquity: filteredBalanceSheet[0]?.debttoequity || "N/A",
    futurePerformance: "Moderate Growth Expected",
    analystRating: "Buy (4.2/5)",
    pastDividends: fundamental.dividend ? `$${fundamental.dividend}/share (Annual)` : "N/A",
    yield: fundamental.dividendyield ? `${fundamental.dividendyield}%` : "N/A",
    eps: quote.eps ? `$${quote.eps}` : "N/A",
    epsGrowth: "+8% YoY",
    revenueGrowth: "+12.5%",
    revenueGrowthPeriod: "Trailing Twelve Months",
  };

  // Fundamentals for DCF
  const fundamentalsForDcf = {
    revenue: fundamental.revenue || 0,
    netIncome: fundamental.netincome || 0,
    sharesOutstanding: quote.sharesoutstanding || 0,
    freeCashFlow: filteredCashFlow[0]?.fcf || 0,
    growthRate: 0.07,
    capex: filteredCashFlow[0]?.capex || 0,
    debt: filteredBalanceSheet[0]?.totaldebt || 0,
    cash: filteredBalanceSheet[0]?.cashandequivalents || 0,
  };

  // Stock price history (bars)
  const bars = (await getSampleData({ table: "BARS", filter: { symbol: ticker } })).filter((bar: any) => bar.symbol === ticker);
  // Sort bars by date ascending for proper chart rendering
  const stockPriceHistory = bars
    .map((bar: any) => ({
      date: bar.date,
      price: bar.close,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Management/Capex allocation (cash flow statement)
  const managementRaw = filteredCashFlow.map((row: any) => ({
    year: row.fiscalyear || row.date || "",
    NCFI: row.ncfi || 0,
    CAPEX: row.capex || 0,
    RND: row.rnd || 0,
  }));

  // Financial health (balance sheet)
  const financialHealth = filteredBalanceSheet.map((row: any) => ({
    year: row.fiscalyear || row.date || "",
    debt: row.totaldebt || 0,
    netWorth: row.totalassets || 0,
  }));

  // Dividend chart (fundamental details)
  const dividendChart = filteredFundamentals.map((row: any) => ({
    year: row.fiscalyear || row.date || "",
    dps: row.dividend || 0,
  }));

  // Quarterly earnings (income statement)
  const quarterlyEarnings = filteredIncomeStatement.map((row: any) => ({
    quarter: row.fiscalperiod || row.date || "",
    revenue: row.revenue || 0,
    profit: row.profit !== undefined ? row.profit : row.netincome || 0,
  }));

  // Revenue/expenses breakdown (income statement)
  const firstIS = filteredIncomeStatement[0] || {};
  const revenueExpenses = {
    nodes: [
      { id: 'Total Revenue' },
      { id: 'Cost of Sales' },
      { id: 'Gross Profit' },
      { id: 'Total Expenses' },
      { id: 'Net Earnings' },
    ],
    links: [
      { source: 'Total Revenue', target: 'Gross Profit', value: firstIS.grossprofit || 0 },
      { source: 'Total Revenue', target: 'Cost of Sales', value: firstIS.costofrevenue || 0 },
      { source: 'Gross Profit', target: 'Net Earnings', value: firstIS.netincome || 0 },
      { source: 'Gross Profit', target: 'Total Expenses', value: firstIS.totalexpenses || 0 },
    ],
  };

  // Dividend metrics (static or derived)
  const dividendMetrics = [
    { label: "Score", value: "7" },
    { label: "Safety", value: "8" },
    { label: "Dividend History", value: "10" },
    { label: "Increasing Dividends", value: "10" },
    { label: "Stability", value: "1" },
    { label: "Dividend Yield", value: profile.yield, isPercentage: true },
  ];

  return {
    profile,
    fundamentals: fundamentalsForDcf,
    stockPriceHistory,
    managementRaw,
    financialHealth,
    dividendChart,
    dividendMetrics,
    quarterlyEarnings,
    revenueExpenses,
  };
}

// Usage in a React component (client-side):
// const [companySampleData, setCompanySampleData] = useState<any>(null);
// useEffect(() => {
//   buildCompanySampleData("AAPL").then(setCompanySampleData);
// }, []);

export default function EquityAnalysisPage() {
  const companyData = companyProfile;
  // --- State for async sample data ---
  const [companySampleData, setCompanySampleData] = useState<any | null>(null);

  useEffect(() => {
    buildCompanySampleData(companyData.ticker).then(setCompanySampleData);
  }, [companyData.ticker]);

  // Show loading state until data is loaded
  if (!companySampleData) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-lg text-muted-foreground">Loading company data...</div>
        </div>
      </AppShell>
    );
  }

  // Management chart data transformation
  const managementChartData = companySampleData.managementRaw.map((row: any) => {
    const allocation = Finance.getCashAllocationData({ NCFI: row.NCFI, CAPEX: row.CAPEX, RND: row.RND });
    return {
      year: row.year,
      research: allocation.rnd,
      production: allocation.capex,
      acquisitions: allocation.acquisitions,
    };
  });

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
              <Image src={companyData.logoUrl} alt={`${companyData.name} logo`} width={100} height={40} data-ai-hint="company logo"/>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard icon={<DollarSign />} title="Valuation" value={companyData.valuation} subValue={`P/E Ratio: ${companyData.peRatio}`} />
            <InfoCard icon={<Briefcase />} title="Financial Health" value={companyData.financialHealth} subValue={`Debt/Equity: ${companyData.debtToEquity}`} />
            <InfoCard icon={<Zap />} title="Future Performance" value={companyData.futurePerformance} subValue={`Analyst Rating: ${companyData.analystRating}`} />
            <InfoCard icon={<Activity />} title="Past Dividends" value={companyData.pastDividends} subValue={`Yield: ${companyData.yield}`} />
            <Card className="p-4 bg-card/70">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Earnings Per Share (EPS)</h3>
              <p className="text-xl font-semibold">{companyData.eps}</p>
              <p className="text-xs text-primary">{companyData.epsGrowth}</p>
            </Card>
            <Card className="p-4 bg-card/70">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Revenue Growth</h3>
              <p className="text-xl font-semibold">{companyData.revenueGrowth}</p>
              <p className="text-xs text-muted-foreground">{companyData.revenueGrowthPeriod}</p>
            </Card>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <IntroSnowflakeChart />
          <SharePriceVsFairValueChart
            currentPrice={sharePriceVsFairValueData.currentPrice}
            fairValue={sharePriceVsFairValueData.fairValue}
            undervaluedThreshold={sharePriceVsFairValueData.undervaluedThreshold}
            overvaluedThreshold={sharePriceVsFairValueData.overvaluedThreshold}
            currencySymbol={sharePriceVsFairValueData.currencySymbol}
            ticker={companyData.ticker}
            companyName={companyData.name}
          />
          <StockPriceHistoryChart 
            ticker={companyData.ticker}
            data={companySampleData.stockPriceHistory}
          />
          <ManagementStackedAreaChart data={managementChartData} />
          <FinancialHealthLineChart data={companySampleData.financialHealth} />
          <DividendAnalysisChart data={companySampleData.dividendChart} metrics={companySampleData.dividendMetrics} />
          <QuarterlyEarningsChart 
            ticker={companyData.ticker}
            data={companySampleData.quarterlyEarnings}
          />
          <RevenueExpensesBreakdownChart data={companySampleData.revenueExpenses} />
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
