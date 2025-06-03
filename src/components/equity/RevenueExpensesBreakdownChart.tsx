
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Group } from '@visx/group';
import { Sankey, SankeyNode, SankeyLink } from '@visx/sankey';
import { Text } from '@visx/text';
import { ParentSize } from '@visx/responsive';
import { useTooltip, useTooltipInPortal, defaultStyles as tooltipStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';

// Define colors based on the image and app theme
const colorRevenue = "hsl(var(--chart-1))"; // Blue from theme
const colorGrossProfit = "hsl(var(--chart-5))"; // Light Teal/Gray from theme
const colorCostOfSales = "#B8860B"; // DarkGoldenRod - for Cost of Sales
const colorEarnings = "hsl(var(--chart-2))"; // Green from theme
const colorExpenses = "#D2B48C"; // Tan - for general expenses
const defaultLinkColor = "hsla(var(--muted-foreground), 0.3)";
const nodeStrokeColor = "hsl(var(--border))";

// Helper function to format currency (simplified)
const formatCurrency = (value: number | undefined, unit: 'b' | 'm' | 'k' = 'b', precision = 2) => {
  if (value === undefined) return 'N/A';
  let valStr = "";
  if (unit === 'b') valStr = (value / 1_000_000_000).toFixed(precision) + 'b';
  else if (unit === 'm') valStr = (value / 1_000_000).toFixed(precision) + 'm';
  else valStr = (value / 1_000).toFixed(precision) + 'k';
  return `US$${valStr}`;
};

const revenueData = {
  offRoad: 5570000000,
  onRoad: 932400000,
  marine: 472800000,
  other: 97800000,
  totalRevenue: 7070000000, // This will be sum of inputs in Sankey
};
const profitData = {
  grossProfit: 1480000000,
  costOfSales: 5590000000, // Total Revenue - Gross Profit
};
const earningsData = {
  earnings: 40200000, // Gross Profit - Total Expenses
  expensesTotal: 1440000000,
};
const expensesBreakdown = {
  generalAdmin: 440200000,
  researchDev: 332000000,
  salesMarketing: 491600000,
  nonOperating: 175300000,
};

const nodeData = [
  { name: "Off-Road" }, { name: "On-Road" }, { name: "Marine" }, { name: "Other Revenue" },
  { name: "Total Revenue" },
  { name: "Cost of Sales" },
  { name: "Gross Profit" },
  { name: "General & Admin" }, { name: "Research & Dev" }, { name: "Sales & Marketing" }, { name: "Non-Operating Exp" },
  { name: "Total Expenses" },
  { name: "Net Earnings" } // Renamed from "Earnings" for clarity
];

const linkData = [
  // Revenue sources to Total Revenue
  { source: 0, target: 4, value: revenueData.offRoad },
  { source: 1, target: 4, value: revenueData.onRoad },
  { source: 2, target: 4, value: revenueData.marine },
  { source: 3, target: 4, value: revenueData.other },

  // Total Revenue splits into Gross Profit and Cost of Sales
  { source: 4, target: 6, value: profitData.grossProfit }, // To Gross Profit
  { source: 4, target: 5, value: profitData.costOfSales }, // To Cost of Sales

  // Gross Profit splits into Net Earnings and Total Expenses
  { source: 6, target: 12, value: earningsData.earnings }, // To Net Earnings
  { source: 6, target: 11, value: earningsData.expensesTotal }, // To Total Expenses

  // Total Expenses splits into individual expense categories
  { source: 11, target: 7, value: expensesBreakdown.generalAdmin },
  { source: 11, target: 8, value: expensesBreakdown.researchDev },
  { source: 11, target: 9, value: expensesBreakdown.salesMarketing },
  { source: 11, target: 10, value: expensesBreakdown.nonOperating },
];

const sankeyGraph = {
  nodes: nodeData.map(node => ({ ...node })), // Clone nodes
  links: linkData.map(link => ({ ...link })), // Clone links
};

const getNodeColor = (node: { name: string }): string => {
  const { name } = node;
  if (["Off-Road", "On-Road", "Marine", "Other Revenue", "Total Revenue"].includes(name)) return colorRevenue;
  if (name === "Cost of Sales") return colorCostOfSales;
  if (name === "Gross Profit") return colorGrossProfit;
  if (["General & Admin", "Research & Dev", "Sales & Marketing", "Non-Operating Exp", "Total Expenses"].includes(name)) return colorExpenses;
  if (name === "Net Earnings") return colorEarnings;
  return 'grey';
};

const margin = { top: 20, right: 150, bottom: 20, left: 150 }; // Increased margins for labels

const RevenueExpensesBreakdownChart: React.FC = () => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<any>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl">Revenue &amp; Expenses Breakdown</CardTitle>
        <CardDescription>
          How Example Corp makes and spends money. Based on latest reported earnings, on an LTM basis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-20 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground text-sm mb-4">
          Timeline Chart Area (2014-2025) - Placeholder
        </div>

        <div ref={containerRef} className="w-full" style={{ height: '500px', position: 'relative' }}>
          <ParentSize>
            {({ width, height }) => (
              <Sankey
                data={sankeyGraph}
                width={width}
                height={height}
                margin={margin}
                nodeWidth={20}
                nodePadding={25}
                iterations={32} // Default is 32
                nodeSort={null} // Preserve node order from data
              >
                {({ data }) => ( // data here is { nodes, links } with layout properties
                  <Group>
                    {/* Links */}
                    {data.links.map((link, i) => (
                      <SankeyLink
                        key={`link-${i}`}
                        link={link}
                        sourceNodeColor={getNodeColor(link.source as any)}
                        targetNodeColor={getNodeColor(link.target as any)}
                        color={defaultLinkColor}
                        strokeWidth={Math.max(1, link.width || 0)}
                        opacity={0.7}
                        onMouseEnter={(event) => {
                          const point = localPoint(event) || { x: 0, y: 0 };
                          showTooltip({
                            tooltipData: `Value: ${formatCurrency(link.value, 'b')}`,
                            tooltipTop: point.y,
                            tooltipLeft: point.x,
                          });
                        }}
                        onMouseLeave={hideTooltip}
                      />
                    ))}

                    {/* Nodes */}
                    {data.nodes.map((node, i) => (
                       <SankeyNode
                        key={`node-${i}`}
                        node={node}
                        color={getNodeColor(node)}
                        stroke={nodeStrokeColor}
                        strokeWidth={1}
                        opacity={1}
                        onMouseEnter={(event) => {
                          const point = localPoint(event) || { x: 0, y: 0 };
                           showTooltip({
                            tooltipData: `${node.name}: ${formatCurrency(node.value, 'b')}`,
                            tooltipTop: point.y,
                            tooltipLeft: point.x,
                          });
                        }}
                        onMouseLeave={hideTooltip}
                      >
                        {/* Custom Node Labeling */}
                        <Text
                          x={(node.x1 || 0) - (node.x0 || 0) > 50 ? 6 : (node.x1 || 0) - (node.x0 || 0) + 6} // position right or inside
                          y={((node.y1 || 0) - (node.y0 || 0)) / 2}
                          verticalAnchor="middle"
                          textAnchor={(node.x1 || 0) - (node.x0 || 0) > 50 ? "start" : "start"}
                          style={{ 
                            fill: 'hsl(var(--foreground))', 
                            fontSize: '10px',
                            pointerEvents: 'none'
                          }}
                        >
                          {node.name}
                        </Text>
                         <Text
                          x={(node.x1 || 0) - (node.x0 || 0) > 50 ? 6 : (node.x1 || 0) - (node.x0 || 0) + 6}
                          y={((node.y1 || 0) - (node.y0 || 0)) / 2 + 12}
                          verticalAnchor="middle"
                          textAnchor={(node.x1 || 0) - (node.x0 || 0) > 50 ? "start" : "start"}
                          style={{ 
                            fill: 'hsl(var(--muted-foreground))', 
                            fontSize: '9px',
                            fontWeight: 'bold',
                            pointerEvents: 'none'
                          }}
                        >
                          {formatCurrency(node.value, 'b')}
                        </Text>
                       </SankeyNode>
                    ))}
                  </Group>
                )}
              </Sankey>
            )}
          </ParentSize>
           {tooltipOpen && tooltipData && (
            <TooltipInPortal
              key={Math.random()} // HACK ensure position recompute on Data change
              top={tooltipTop}
              left={tooltipLeft}
              style={{
                ...tooltipStyles,
                background: 'hsl(var(--popover))',
                color: 'hsl(var(--popover-foreground))',
                border: '1px solid hsl(var(--border))',
                fontSize: '12px',
                padding: '8px',
              }}
            >
              {tooltipData}
            </TooltipInPortal>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueExpensesBreakdownChart;
