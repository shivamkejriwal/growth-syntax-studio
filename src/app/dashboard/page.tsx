import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Personalized Dashboard</h1>
          <Button>
            <Settings className="mr-2 h-4 w-4" /> Customize Dashboard
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125,670.89</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist Movers</CardTitle>
               <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+3 Stocks Up</div>
              <p className="text-xs text-muted-foreground">AAPL +2.5%, MSFT +1.8%</p>
            </CardContent>
          </Card>
        </div>

        {/* Customizable Chart Area */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Market Performance Overview</CardTitle>
              <CardDescription>Key indices and sector performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <SampleLineChart title="Market Index Trend" />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Breakdown of your assets by sector.</CardDescription>
            </CardHeader>
            <CardContent>
              <SampleBarChart title="Asset Allocation by Sector" />
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Watchlist Snapshot</CardTitle>
            <CardDescription>Quick view of your tracked companies.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {['AAPL', 'MSFT', 'GOOGL', 'AMZN'].map(ticker => (
                <Card key={ticker} className="p-4 text-center">
                  <Image src={`https://placehold.co/80x40.png`} alt={`${ticker} chart`} width={80} height={40} className="mx-auto mb-2" data-ai-hint="stock chart" />
                  <p className="font-semibold">{ticker}</p>
                  <p className="text-sm text-primary">+1.5%</p>
                </Card>
              ))}
              <Button variant="outline" className="h-full flex flex-col items-center justify-center">
                <PlusCircle className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-muted-foreground">Add to Watchlist</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}

// Minimalistic icons for card headers
function Star({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
