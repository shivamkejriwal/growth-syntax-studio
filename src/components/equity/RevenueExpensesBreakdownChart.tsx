
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Group } from '@visx/group';
import { Sankey } from '@visx/sankey';
import { Text } from '@visx/text';
import { ParentSize } from '@visx/responsive';
import { useTooltip, useTooltipInPortal, defaultStyles as tooltipStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import type { SankeyLink as D3SankeyLink, SankeyNode as D3SankeyNode } from 'd3-sankey';
import { sankeyLinkHorizontal } from 'd3-sankey';

// Define colors based on the image and app theme
const colorRevenue = "hsl(var(--chart-1))"; // Blue from theme
const colorGrossProfit = "hsl(var(--chart-5))"; // Light Teal/Gray from theme
const colorCostOfSales = "#B8860B"; // DarkGoldenRod - specific color
const colorEarnings = "hsl(var(--chart-2))"; // Green from theme
const colorExpenses = "#D2B48C"; // Tan - specific color
const defaultLinkColor = "hsla(var(--muted-foreground), 0.3)";
const nodeStrokeColor = "hsl(var(--border))";

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
  totalRevenue: 7070000000, // Sum of the above
};
const profitData = {
  grossProfit: 1480000000,
  costOfSales: revenueData.totalRevenue - 1480000000, // Total Revenue - Gross Profit
};
const earningsData = {
  earnings: 40200000,
  expensesTotal: profitData.grossProfit - 40200000, // Gross Profit - Net Earnings
};
const expensesBreakdown = {
  generalAdmin: 440200000,
  researchDev: 332000000,
  salesMarketing: 491600000,
  // Ensure total expenses match
  nonOperating: earningsData.expensesTotal - (440200000 + 332000000 + 491600000),
};

interface NodeData { name: string; }
interface LinkData { source: number; target: number; value: number; }

const nodeData: NodeData[] = [
  // Level 0: Revenue Sources
  { name: "Off-Road" }, { name: "On-Road" }, { name: "Marine" }, { name: "Other Revenue" },
  // Level 1: Aggregated Revenue & Cost of Sales
  { name: "Total Revenue" },
  { name: "Cost of Sales" },
  // Level 2: Gross Profit & Expense Categories
  { name: "Gross Profit" },
  { name: "General & Admin" }, { name: "Research & Dev" }, { name: "Sales & Marketing" }, { name: "Non-Operating Exp" },
  // Level 3: Aggregated Expenses
  { name: "Total Expenses" },
  // Level 4: Net Earnings
  { name: "Net Earnings" }
];

const linkData: LinkData[] = [
  // Revenue sources to Total Revenue
  { source: 0, target: 4, value: revenueData.offRoad },
  { source: 1, target: 4, value: revenueData.onRoad },
  { source: 2, target: 4, value: revenueData.marine },
  { source: 3, target: 4, value: revenueData.other },
  // Total Revenue to Gross Profit and Cost of Sales
  { source: 4, target: 6, value: profitData.grossProfit }, // To Gross Profit
  { source: 4, target: 5, value: profitData.costOfSales }, // To Cost of Sales
  // Gross Profit to Total Expenses and Net Earnings
  { source: 6, target: 12, value: earningsData.earnings },    // To Net Earnings
  { source: 6, target: 11, value: earningsData.expensesTotal }, // To Total Expenses
  // Total Expenses to individual expense categories
  { source: 11, target: 7, value: expensesBreakdown.generalAdmin },
  { source: 11, target: 8, value: expensesBreakdown.researchDev },
  { source: 11, target: 9, value: expensesBreakdown.salesMarketing },
  { source: 11, target: 10, value: expensesBreakdown.nonOperating },
];

const sankeyGraph = {
  nodes: nodeData.map(node => ({ ...node })),
  links: linkData.map(link => ({ ...link })),
};

const getNodeColor = (node: D3SankeyNode<NodeData, LinkData>): string => {
  const { name } = node;
  if (["Off-Road", "On-Road", "Marine", "Other Revenue", "Total Revenue"].includes(name)) return colorRevenue;
  if (name === "Cost of Sales") return colorCostOfSales;
  if (name === "Gross Profit") return colorGrossProfit;
  if (["General & Admin", "Research & Dev", "Sales & Marketing", "Non-Operating Exp", "Total Expenses"].includes(name)) return colorExpenses;
  if (name === "Net Earnings") return colorEarnings;
  return 'grey'; // Default color for any unhandled nodes
};

const margin = { top: 20, right: 150, bottom: 20, left: 150 }; // Increased left/right margin for labels

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
            {({ width, height }) => {
              if (width <= 0 || height <= 0) {
                return null; 
              }
              return (
                <Sankey
                  data={sankeyGraph}
                  width={width}
                  height={height}
                  margin={margin}
                  nodeWidth={20} 
                  nodePadding={25} 
                  iterations={32} 
                  nodeSort={null} 
                >
                  {(sankeyLayout) => {
                     if (!sankeyLayout || !sankeyLayout.data || !sankeyLayout.data.nodes || !sankeyLayout.data.links) {
                        console.warn('VisX Sankey layout returned invalid or incomplete data.', sankeyLayout);
                        return (
                          <svg width={width} height={height}>
                            <text x={width/2} y={height/2} textAnchor="middle" fill="hsl(var(--destructive))">
                              Error: Could not render Sankey chart. Data might be invalid.
                            </text>
                          </svg>
                        );
                      }
                    const processedData = sankeyLayout.data;
                    return (
                      <Group>
                        {/* Render Links */}
                        {processedData.links.map((link, i) => {
                          const d3Link = link as D3SankeyLink<NodeData, LinkData>;
                          const sourceNode = d3Link.source as D3SankeyNode<NodeData, LinkData>;
                          const sourceNodeColor = getNodeColor(sourceNode);
                          const linkColor = sourceNodeColor.replace('hsl', 'hsla').replace(')', ', 0.3)');

                          return (
                            <path
                              key={`link-${i}`}
                              d={sankeyLinkHorizontal()(d3Link) || ''}
                              stroke={linkColor}
                              strokeWidth={Math.max(1, d3Link.width || 0)}
                              fill="none"
                              opacity={0.7} 
                              onMouseEnter={(event) => {
                                const point = localPoint(event.currentTarget.ownerSVGElement!, event) || { x: 0, y: 0 };
                                showTooltip({
                                  tooltipData: `${(d3Link.source as D3SankeyNode<NodeData, LinkData>).name} → ${(d3Link.target as D3SankeyNode<NodeData, LinkData>).name}: ${formatCurrency(d3Link.value, 'b')}`,
                                  tooltipTop: point.y,
                                  tooltipLeft: point.x,
                                });
                              }}
                              onMouseLeave={hideTooltip}
                            />
                          );
                        })}

                        {/* Render Nodes */}
                        {processedData.nodes.map((node, i) => {
                          const d3Node = node as D3SankeyNode<NodeData, LinkData>;
                          const nodeWidthVal = (d3Node.x1 ?? 0) - (d3Node.x0 ?? 0);
                          const nodeHeightVal = (d3Node.y1 ?? 0) - (d3Node.y0 ?? 0);
                          return (
                            <Group
                              key={`node-${i}`}
                              top={d3Node.y0}
                              left={d3Node.x0}
                              onMouseEnter={(event: React.MouseEvent<SVGGElement>) => {
                                 const point = localPoint(event.currentTarget.ownerSVGElement!, event) || { x: 0, y: 0 };
                                showTooltip({
                                  tooltipData: `${d3Node.name}: ${formatCurrency(d3Node.value, 'b')}`,
                                  tooltipTop: point.y,
                                  tooltipLeft: point.x,
                                });
                              }}
                              onMouseLeave={hideTooltip}
                            >
                              <rect
                                width={nodeWidthVal}
                                height={nodeHeightVal}
                                fill={getNodeColor(d3Node)}
                                stroke={nodeStrokeColor}
                                strokeWidth={1}
                                opacity={1}
                              />
                              <Text
                                x={nodeWidthVal > 50 && nodeHeightVal > 20 ? 6 : nodeWidthVal + 6}
                                y={nodeHeightVal / 2}
                                verticalAnchor="middle"
                                textAnchor={(d3Node.x0 ?? 0) < width / 2 ? "start" : "end"}
                                style={{
                                  fill: 'hsl(var(--foreground))',
                                  fontSize: '10px',
                                  pointerEvents: 'none',
                                }}
                              >
                                {d3Node.name}
                              </Text>
                              {nodeHeightVal > 15 && (
                                <Text
                                  x={nodeWidthVal > 50 && nodeHeightVal > 20 ? 6 : nodeWidthVal + 6}
                                  y={nodeHeightVal / 2 + 12}
                                  verticalAnchor="middle"
                                  textAnchor={(d3Node.x0 ?? 0) < width / 2 ? "start" : "end"}
                                  style={{
                                    fill: 'hsl(var(--muted-foreground))',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    pointerEvents: 'none',
                                  }}
                                >
                                  {formatCurrency(d3Node.value, 'b')}
                                </Text>
                              )}
                            </Group>
                          );
                        })}
                      </Group>
                    );
                  }}
                </Sankey>
              );
            }}
          </ParentSize>
           {tooltipOpen && tooltipData && (
            <TooltipInPortal
              key={Math.random()} 
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

