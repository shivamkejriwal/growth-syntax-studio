import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { Globe, Landmark, Briefcase } from "lucide-react";

export default function MarketOverviewPage() {
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
