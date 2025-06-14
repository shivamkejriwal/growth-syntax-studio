"use client";

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardFooter } from './ChartCardFooter';

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
      onMoreDetailsClick?: (chartKey: string) => void;
}

export const sharePriceVsFairValueChartName = "share-price-vs-fair-value";

export const SharePriceVsFairValueChart: React.FC<SharePriceVsFairValueChartProps> = ({
  ticker,
  currentPrice,
  fairValue,
  undervaluedThreshold,
  overvaluedThreshold,
  currencySymbol = "$",
  companyName = "Example Corp",
  onMoreDetailsClick,
}) => {
  const actualPercentageDiff = getActualPercentageDiff(currentPrice, fairValue);
  const { status: valuationStatus, color: statusColor } = getValuationStatus(currentPrice, fairValue, undervaluedThreshold, overvaluedThreshold);
  const { currentPriceBarWidth, fairValueBarWidth, undervaluedZoneWidth, aboutRightZoneWidth, overvaluedZoneWidth } = getChartWidths(currentPrice, fairValue, undervaluedThreshold, overvaluedThreshold);
  const cardTitle = "Share Price vs Fair Value";
  const cardRef = useRef<HTMLDivElement>(null);

  // Use numeric values for bar height and gap
  const barHeightClass = "h-20"; // Keep bars thick
  const chartAreaHeightClass = "h-64"; // Much taller chart area for more space
  // Increase spacing between bars by adjusting top/bottom values
  return (
    <Card className="shadow-lg w-full flex flex-col" ref={cardRef}>
      <CardHeader>
        <CardTitle className="text-xl">
          Share Price vs Fair Value
        </CardTitle>
        <CardDescription>
          What is the Fair Price of {ticker} when looking at its future cash flows? For this estimate we use a Discounted Cash Flow model.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
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
          <span className="text-emerald-500 text-center" style={{ flexBasis: `${undervaluedZoneWidth > 0 ? undervaluedThreshold : 0}%`}}>{undervaluedThreshold.toFixed(2)} Undervalued</span>
          <span className="text-center" style={{ flexBasis: `${aboutRightZoneWidth > 0 ? (100 - undervaluedThreshold - overvaluedThreshold) : 0}%`}}>About Right</span>
          <span className="text-red-500 text-center" style={{ flexBasis: `${overvaluedZoneWidth > 0 ? overvaluedThreshold : 0}%`}}>{overvaluedThreshold.toFixed(2)} Overvalued</span>
        </div>
      </CardContent>
      <ChartCardFooter cardTitle={cardTitle} chartName={sharePriceVsFairValueChartName} cardRef={cardRef} onMoreDetailsClick={onMoreDetailsClick} />
    </Card>
  );
};
