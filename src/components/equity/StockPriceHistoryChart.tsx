import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { ChartCardFooter } from './ChartCardFooter';

export interface StockPriceHistoryChartProps {
  ticker: string;
  data: Array<{ date: string; price: number }>;
}

export function StockPriceHistoryChart({ ticker, data }: StockPriceHistoryChartProps) {
  // Map data to the format expected by SampleLineChart
  const chartData = data.map((d) => ({ date: d.date, value: d.price }));
  return (
    <Card className="shadow-lg w-full flex flex-col">
      <CardHeader>
        <CardTitle>Stock Price History</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <SampleLineChart title={`${ticker} Stock Price (1Y)`} data={chartData} />
      </CardContent>
      <ChartCardFooter />
    </Card>
  );
}