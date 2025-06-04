import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { Newspaper, Share2 } from "lucide-react";

export interface StockPriceHistoryChartProps {
  ticker: string;
  data: Array<{ date: string; price: number }>;
}

export function StockPriceHistoryChart({ ticker, data }: StockPriceHistoryChartProps) {
  // Map data to the format expected by SampleLineChart
  const chartData = data.map((d) => ({ date: d.date, value: d.price }));
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>Stock Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <SampleLineChart title={`${ticker} Stock Price (1Y)`} data={chartData} />
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto">
          <Newspaper className="mr-2 h-4 w-4" />
          MORE DETAILS
        </Button>
        <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto">
          <Share2 className="mr-2 h-4 w-4" />
          SHARE
        </Button>
      </CardFooter>
    </Card>
  );
}