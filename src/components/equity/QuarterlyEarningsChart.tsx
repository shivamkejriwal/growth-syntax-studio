import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";

const companyData = { ticker: "EXMPL" }; // Replace with real data or props as needed

export function QuarterlyEarningsChart() {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>Quarterly Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <SampleBarChart title={`${companyData.ticker} Quarterly Revenue & Profit`} />
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