"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";

// Helper: Calculate percent difference
function getActualPercentageDiff(currentPrice: number, fairValue: number) {
  return fairValue > 0 ? ((currentPrice - fairValue) / fairValue) * 100 : 0;
}

// Helper: Determine valuation status and color
function getValuationStatus(currentPrice: number, fairValue: number, undervaluedThreshold: number, overvaluedThreshold: number) {
  if (currentPrice < undervaluedThreshold) {
    return { status: "Undervalued", color: "text-emerald-500" };
  } else if (currentPrice > overvaluedThreshold) {
    return { status: "Overvalued", color: "text-red-500" };
  } else {
    if (currentPrice < fairValue) {
      return { status: "Fairly Valued", color: "text-emerald-500" };
    } else if (currentPrice > fairValue) {
      return { status: "Fairly Valued", color: "text-red-500" };
    } else {
      return { status: "Fairly Valued", color: "text-foreground" };
    }
  }
}

// Helper: Chart calculations
function getChartWidths(currentPrice: number, fairValue: number, undervaluedThreshold: number, overvaluedThreshold: number) {
  const chartMaxX = Math.max(currentPrice, fairValue, overvaluedThreshold) * 1.25;
  const toPercentWidth = (value: number) => (value / chartMaxX) * 100;
  return {
    currentPriceBarWidth: toPercentWidth(currentPrice),
    fairValueBarWidth: toPercentWidth(fairValue),
    undervaluedZoneWidth: toPercentWidth(undervaluedThreshold),
    aboutRightZoneWidth: toPercentWidth(overvaluedThreshold - undervaluedThreshold),
    overvaluedZoneWidth: 100 - (toPercentWidth(undervaluedThreshold) + toPercentWidth(overvaluedThreshold - undervaluedThreshold)),
  };
}

interface SharePriceVsFairValueChartProps {
  ticker: string;
  currentPrice: number;
  fairValue: number;
  undervaluedThreshold: number; // Not percent, absolute value
  overvaluedThreshold: number;  // Not percent, absolute value
  currencySymbol?: string;
  companyName?: string;
}

const SharePriceVsFairValueChart: React.FC<SharePriceVsFairValueChartProps> = ({
  ticker,
  currentPrice,
  fairValue,
  undervaluedThreshold,
  overvaluedThreshold,
  currencySymbol = "$",
  companyName = "Example Corp"
}) => {
  const actualPercentageDiff = getActualPercentageDiff(currentPrice, fairValue);
  const { status: valuationStatus, color: statusColor } = getValuationStatus(currentPrice, fairValue, undervaluedThreshold, overvaluedThreshold);
  const { currentPriceBarWidth, fairValueBarWidth, undervaluedZoneWidth, aboutRightZoneWidth, overvaluedZoneWidth } = getChartWidths(currentPrice, fairValue, undervaluedThreshold, overvaluedThreshold);

  // Use numeric values for bar height and gap
  const barHeightClass = "h-20"; // Keep bars thick
  const chartAreaHeightClass = "h-64"; // Much taller chart area for more space

  // Increase spacing between bars by adjusting top/bottom values
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Share Price vs Fair Value
        </CardTitle>
        <CardDescription>
          What is the Fair Price of {ticker} when looking at its future cash flows? For this estimate we use a Discounted Cash Flow model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-center mb-6 ${statusColor}`}>
          <p className="text-3xl font-bold">
            {Math.abs(actualPercentageDiff).toFixed(1)}%
          </p>
          <p className="text-sm">
            {valuationStatus}
          </p>
        </div>

        <div className="w-full mb-4">
          <div className={`relative ${chartAreaHeightClass} mb-2`}> 
            <div className="absolute top-0 left-0 h-full flex w-full rounded">
              <div
                style={{ width: `${undervaluedZoneWidth}%` }}
                className="bg-emerald-500/30 h-full"
              />
              <div
                style={{ width: `${aboutRightZoneWidth}%` }}
                className="bg-amber-500/30 h-full"
              />
              <div
                style={{ width: `${overvaluedZoneWidth}%` }}
                className="diagonal-stripes-destructive h-full"
              />
            </div>

            {/* Current Price Bar & Label */}
            <div className={`absolute top-8 left-0 w-full flex items-center`} style={{ height: 'auto' }}>
              <div
                className={`bg-emerald-400 ${barHeightClass} rounded-sm`}
                style={{ width: `${currentPriceBarWidth}%` }}
              />
              <div className="ml-2 p-2 bg-card rounded-sm shadow-md text-popover-foreground">
                <div className="text-xs">Current Price</div>
                <div className="text-sm font-semibold">{currencySymbol}{currentPrice.toFixed(2)}</div>
              </div>
            </div>

            {/* Fair Value Bar & Label */}
            <div className={`absolute bottom-8 left-0 w-full flex items-center`} style={{ height: 'auto' }}>
              <div
                className={`bg-emerald-600 ${barHeightClass} rounded-sm`} 
                style={{ width: `${fairValueBarWidth}%` }}
              />
              <div className="ml-2 p-2 bg-card rounded-sm shadow-md text-popover-foreground">
                <div className="text-xs">Fair Value</div>
                <div className="text-sm font-semibold">{currencySymbol}{fairValue.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span className="text-emerald-500 text-center" style={{ flexBasis: `${undervaluedZoneWidth > 0 ? undervaluedThreshold : 0}%`}}>{undervaluedThreshold} Undervalued</span>
          <span className="text-center" style={{ flexBasis: `${aboutRightZoneWidth > 0 ? (100 - undervaluedThreshold - overvaluedThreshold) : 0}%`}}>About Right</span>
          <span className="text-red-500 text-center" style={{ flexBasis: `${overvaluedZoneWidth > 0 ? overvaluedThreshold : 0}%`}}>{overvaluedThreshold} Overvalued</span>
        </div>
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
};

export default SharePriceVsFairValueChart;
