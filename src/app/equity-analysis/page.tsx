import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Activity, DollarSign, Zap } from "lucide-react";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import Image from "next/image";
import SharePriceVsFairValueChart from "@/components/equity/SharePriceVsFairValueChart";
import ManagementStackedAreaChart from "@/components/equity/ManagementStackedAreaChart";
import FinancialHealthLineChart from "@/components/equity/FinancialHealthLineChart";
import DividendAnalysisChart from "@/components/equity/DividendAnalysisChart";
import IntroSnowflakeChart from "@/components/equity/IntroSnowflakeChart";
import RevenueExpensesBreakdownChart from "@/components/equity/RevenueExpensesBreakdownChart";


export default function EquityAnalysisPage() {
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
          <IntroSnowflakeChart />
          <SharePriceVsFairValueChart
            currentPrice={sharePriceVsFairValueData.currentPrice}
            fairValue={sharePriceVsFairValueData.fairValue}
            undervaluedThresholdPercent={sharePriceVsFairValueData.undervaluedThresholdPercent}
            overvaluedThresholdPercent={sharePriceVsFairValueData.overvaluedThresholdPercent}
            currencySymbol={sharePriceVsFairValueData.currencySymbol}
            companyTicker={companyData.ticker}
            companyName={companyData.name}
          />
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Stock Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <SampleLineChart title={`${companyData.ticker} Stock Price (1Y)`} />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quarterly Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <SampleBarChart title={`${companyData.ticker} Quarterly Revenue &amp; Profit`} />
            </CardContent>
          </Card>
          <ManagementStackedAreaChart />
          <FinancialHealthLineChart />
          <DividendAnalysisChart />
        </div>
        <RevenueExpensesBreakdownChart />
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