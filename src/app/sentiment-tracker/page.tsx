import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SentimentGaugeChart } from "@/components/charts/sentiment-gauge-chart";
import { SampleLineChart } from "@/components/charts/sample-line-chart"; // For historical sentiment

export default function SentimentTrackerPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Market Sentiment Tracker</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SentimentGaugeChart />
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Sentiment Over Time</CardTitle>
              <CardDescription>Historical view of the Fear & Greed Index.</CardDescription>
            </CardHeader>
            <CardContent>
              <SampleLineChart title="Historical Sentiment" />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sentiment Components (Placeholder)</CardTitle>
            <CardDescription>Breakdown of factors contributing to market sentiment.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Market Momentum", value: "Strong Positive", trend: "+2.1%" },
              { name: "Stock Price Strength", value: "Neutral", trend: "-0.5%" },
              { name: "Stock Price Breadth", value: "Positive", trend: "+1.2%" },
              { name: "Put/Call Ratio", value: "Slightly Bearish", trend: "0.95" },
              { name: "Market Volatility (VIX)", value: "Low", trend: "15.2" },
              { name: "Safe Haven Demand", value: "Moderate", trend: "Bonds Up" },
            ].map(item => (
              <Card key={item.name} className="p-4 bg-card/70">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-xl font-semibold text-primary">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.trend}</p>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
