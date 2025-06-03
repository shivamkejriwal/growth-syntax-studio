
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, Share2 } from "lucide-react";

interface ValueGaugeChartProps {
  fairValue: number;
  sharePrice: number;
  undervaluedZoneMax: number;
  aboutRightZoneMax: number;
  chartDisplayMaxY: number;
}

const COLOR_UNDERVALUED = "#90EE90"; // Soft Green from PRD
const COLOR_ABOUT_RIGHT = "#FFD700"; // Gold/Yellow - better contrast than light beige on dark theme
const COLOR_OVERVALUED = "#F08080";  // Gentle Red from PRD
const COLOR_BAR_FILL = "hsl(215, 35%, 55%)"; // Muted blue for bars
const COLOR_BAR_BORDER = "hsl(215, 30%, 35%)"; // Darker border for bars

const ValueGaugeChart: FC<ValueGaugeChartProps> = ({
  fairValue,
  sharePrice,
  undervaluedZoneMax,
  aboutRightZoneMax,
  chartDisplayMaxY,
}) => {
  const calculatePercentageHeight = (value: number) => {
    if (chartDisplayMaxY === 0) return 0; // Avoid division by zero
    return Math.max(0, Math.min(100, (value / chartDisplayMaxY) * 100)); // Ensure >= 0 and cap at 100%
  }

  const fairValuePercentage = calculatePercentageHeight(fairValue);
  const sharePricePercentage = calculatePercentageHeight(sharePrice);

  const undervaluedZoneDisplayHeight = calculatePercentageHeight(undervaluedZoneMax);
  const aboutRightZoneDisplayHeight = calculatePercentageHeight(aboutRightZoneMax - undervaluedZoneMax);
  // Calculate overvalued zone height to fill remaining space, ensuring it's not negative
  const overvaluedZoneDisplayHeight = Math.max(0, 100 - (undervaluedZoneDisplayHeight + aboutRightZoneDisplayHeight));


  const legendItems = [
    { label: "Undervalued", color: COLOR_UNDERVALUED },
    { label: "About Right", color: COLOR_ABOUT_RIGHT },
    { label: "Overvalued", color: COLOR_OVERVALUED },
  ];

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Value</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow flex flex-col">
        <div className="flex justify-start items-center space-x-3 sm:space-x-4 mb-4 text-xs pl-1">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center">
              <span
                className="h-3 w-3 mr-1.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="relative h-72 w-full max-w-xs mx-auto mt-4 flex-grow"> {/* Container for zones and bars */}
          {/* Background Zones: Rendered from bottom to top visually */}
          <div
            className="absolute bottom-0 left-0 w-full"
            style={{ height: `${undervaluedZoneDisplayHeight}%`, backgroundColor: COLOR_UNDERVALUED }}
          />
          <div
            className="absolute left-0 w-full"
            style={{ bottom: `${undervaluedZoneDisplayHeight}%`, height: `${aboutRightZoneDisplayHeight}%`, backgroundColor: COLOR_ABOUT_RIGHT }}
          />
          <div
            className="absolute left-0 w-full"
            style={{ bottom: `${undervaluedZoneDisplayHeight + aboutRightZoneDisplayHeight}%`, height: `${overvaluedZoneDisplayHeight}%`, backgroundColor: COLOR_OVERVALUED }}
          />

          {/* Bars */}
          <div className="absolute bottom-0 left-0 right-0 h-full flex justify-around items-end px-2 sm:px-4">
            {/* Fair Value Bar */}
            <div className="flex flex-col items-center w-2/5 sm:w-1/3">
              <div className="text-sm font-semibold mb-1 text-foreground">
                ${fairValue.toFixed(2)}
              </div>
              <div
                className="w-12 sm:w-14 rounded-t-sm shadow-md"
                style={{ 
                  height: `${fairValuePercentage}%`, 
                  backgroundColor: COLOR_BAR_FILL,
                  borderLeft: `2px solid ${COLOR_BAR_BORDER}`,
                  borderRight: `2px solid ${COLOR_BAR_BORDER}`,
                  borderTop: `2px solid ${COLOR_BAR_BORDER}`,
                  borderBottom: 'none', // Base of the bar sits on the x-axis
                }}
              />
              <div className="mt-2 text-xs text-muted-foreground text-center">Fair Value</div>
            </div>

            {/* Share Price Bar */}
            <div className="flex flex-col items-center w-2/5 sm:w-1/3">
              <div className="text-sm font-semibold mb-1 text-foreground">
                ${sharePrice.toFixed(2)}
              </div>
              <div
                className="w-12 sm:w-14 rounded-t-sm shadow-md"
                style={{ 
                  height: `${sharePricePercentage}%`, 
                  backgroundColor: COLOR_BAR_FILL,
                  borderLeft: `2px solid ${COLOR_BAR_BORDER}`,
                  borderRight: `2px solid ${COLOR_BAR_BORDER}`,
                  borderTop: `2px solid ${COLOR_BAR_BORDER}`,
                  borderBottom: 'none',
                 }}
              />
              <div className="mt-2 text-xs text-muted-foreground text-center">Share Price</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-border mt-auto">
        <Button variant="ghost" size="sm" className="text-xs">
          <ListChecks className="mr-1.5 h-3.5 w-3.5" />
          MORE DETAILS
        </Button>
        <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive-foreground hover:bg-destructive/90">
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          SHARE
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ValueGaugeChart;

