import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";

export interface QuarterlyEarningsChartProps {
  ticker: string;
  data: Array<{ quarter: string; revenue: number; profit: number }>;
}

export function QuarterlyEarningsChart({ ticker, data }: QuarterlyEarningsChartProps) {
  // Map data to the format expected by SampleBarChart
  const chartData = data.map(d => ({ month: d.quarter, desktop: d.revenue, mobile: d.profit }));
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>Quarterly Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <SampleBarChart title={`${ticker} Quarterly Revenue & Profit`} data={chartData} />
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