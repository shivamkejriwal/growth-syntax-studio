
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

// Colors from the Angular example for closer matching
const COLOR_UNDERVALUED_ZONE_ANGULAR = "rgba(126, 158, 123, 1)"; // Muted Green #7E9E7B
const COLOR_ABOUT_RIGHT_ZONE_ANGULAR = "rgba(249, 201, 117, 1)"; // Muted Gold/Yellow #F9C975
const COLOR_OVERVALUED_ZONE_ANGULAR = "rgba(216, 69, 74, 1)";   // Muted Red #D8454A
const COLOR_BAR_FILL_ANGULAR = "rgba(132, 152, 191, 1)";    // Muted Blue-Grey #8498BF
const COLOR_BAR_BORDER_ANGULAR = "black";
const BAR_BORDER_WIDTH_ANGULAR = "1px";

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
  const overvaluedZoneDisplayHeight = Math.max(0, 100 - (undervaluedZoneDisplayHeight + aboutRightZoneDisplayHeight));

  const legendItems = [
    { label: "Undervalued", color: COLOR_UNDERVALUED_ZONE_ANGULAR },
    { label: "About Right", color: COLOR_ABOUT_RIGHT_ZONE_ANGULAR },
    { label: "Overvalued", color: COLOR_OVERVALUED_ZONE_ANGULAR },
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

        <div className="relative h-72 w-full max-w-xs mx-auto mt-4">
          {/* Background Zones: Rendered from bottom to top visually */}
          <div
            className="absolute bottom-0 left-0 w-full"
            style={{ height: `${undervaluedZoneDisplayHeight}%`, backgroundColor: COLOR_UNDERVALUED_ZONE_ANGULAR }}
          />
          <div
            className="absolute left-0 w-full"
            style={{ bottom: `${undervaluedZoneDisplayHeight}%`, height: `${aboutRightZoneDisplayHeight}%`, backgroundColor: COLOR_ABOUT_RIGHT_ZONE_ANGULAR }}
          />
          <div
            className="absolute left-0 w-full"
            style={{ bottom: `${undervaluedZoneDisplayHeight + aboutRightZoneDisplayHeight}%`, height: `${overvaluedZoneDisplayHeight}%`, backgroundColor: COLOR_OVERVALUED_ZONE_ANGULAR }}
          />

          {/* Bars Container */}
          <div className="absolute bottom-0 left-0 right-0 h-full flex justify-around items-end px-2 sm:px-4">
            {/* Fair Value Bar Item */}
            <div className="flex flex-col items-center w-2/5 sm:w-1/3">
              <div className="text-sm font-semibold mb-1 text-black"> {/* Text color black for contrast on light bar */}
                ${fairValue.toFixed(2)}
              </div>
              <div
                className="w-12 sm:w-14 rounded-t-sm"
                style={{
                  height: `${fairValuePercentage}%`,
                  backgroundColor: COLOR_BAR_FILL_ANGULAR,
                  border: `${BAR_BORDER_WIDTH_ANGULAR} solid ${COLOR_BAR_BORDER_ANGULAR}`,
                }}
              />
              <div className="mt-2 text-xs text-muted-foreground text-center">Fair Value</div>
            </div>

            {/* Share Price Bar Item */}
            <div className="flex flex-col items-center w-2/5 sm:w-1/3">
              <div className="text-sm font-semibold mb-1 text-black"> {/* Text color black for contrast on light bar */}
                ${sharePrice.toFixed(2)}
              </div>
              <div
                className="w-12 sm:w-14 rounded-t-sm"
                style={{
                  height: `${sharePricePercentage}%`,
                  backgroundColor: COLOR_BAR_FILL_ANGULAR,
                  border: `${BAR_BORDER_WIDTH_ANGULAR} solid ${COLOR_BAR_BORDER_ANGULAR}`,
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
        <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600">
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          SHARE
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ValueGaugeChart;
