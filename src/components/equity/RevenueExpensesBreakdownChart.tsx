"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParentSize } from '@visx/responsive';
import { Sankey, sankeyLinkHorizontal } from '@visx/sankey';

const sankeyData = {
  nodes: [
    { id: 'Off-Road' },
    { id: 'On-Road' },
    { id: 'Marine' },
    { id: 'Other Revenue' },
    { id: 'Total Revenue' },
    { id: 'Cost of Sales' },
    { id: 'Gross Profit' },
    { id: 'General & Admin' },
    { id: 'Research & Dev' },
    { id: 'Sales & Marketing' },
    { id: 'Non-Operating Exp' },
    { id: 'Total Expenses' },
    { id: 'Net Earnings' },
  ],
  links: [
    { source: 'Off-Road', target: 'Total Revenue', value: 5570000000 },
    { source: 'On-Road', target: 'Total Revenue', value: 932400000 },
    { source: 'Marine', target: 'Total Revenue', value: 472800000 },
    { source: 'Other Revenue', target: 'Total Revenue', value: 97800000 },
    { source: 'Total Revenue', target: 'Gross Profit', value: 1480000000 },
    { source: 'Total Revenue', target: 'Cost of Sales', value: 5590000000 },
    { source: 'Gross Profit', target: 'Net Earnings', value: 40200000 },
    { source: 'Gross Profit', target: 'Total Expenses', value: 1439800000 },
    { source: 'Total Expenses', target: 'General & Admin', value: 440200000 },
    { source: 'Total Expenses', target: 'Research & Dev', value: 332000000 },
    { source: 'Total Expenses', target: 'Sales & Marketing', value: 491600000 },
    { source: 'Total Expenses', target: 'Non-Operating Exp', value: 176000000 },
  ],
};

// Utility for currency formatting
const formatCurrency = (value: number) => {
  if (value >= 1_000_000_000) return `US$${(value / 1_000_000_000).toFixed(2)}b`;
  if (value >= 1_000_000) return `US$${(value / 1_000_000).toFixed(2)}m`;
  if (value >= 1_000) return `US$${(value / 1_000).toFixed(2)}k`;
  return `US$${value}`;
};

// Color mapping for node types
const nodeColors: Record<string, string> = {
  'Off-Road': '#4F8EF7',
  'On-Road': '#4F8EF7',
  'Marine': '#4F8EF7',
  'Other Revenue': '#4F8EF7',
  'Total Revenue': '#3887FE',
  'Cost of Sales': '#B8860B',
  'Gross Profit': '#6EE7B7',
  'General & Admin': '#D2B48C',
  'Research & Dev': '#D2B48C',
  'Sales & Marketing': '#D2B48C',
  'Non-Operating Exp': '#D2B48C',
  'Total Expenses': '#D2B48C',
  'Net Earnings': '#34D399',
};

const linkColors: Record<string, string> = {
  'Total Revenue': '#3887FE',
  'Cost of Sales': '#B8860B',
  'Gross Profit': '#6EE7B7',
  'Total Expenses': '#D2B48C',
  'Net Earnings': '#34D399',
};

const getNodeColor = (node: { id: string }) => nodeColors[node.id] || '#888';
const getLinkColor = (link: { target: { id?: string } | string }) => {
  const targetId = typeof link.target === 'string' ? link.target : link.target.id;
  return linkColors[targetId ?? ''] || '#69b3a2';
};

const RevenueExpensesBreakdownChart: React.FC = () => (
  <Card className="shadow-lg w-full">
    <CardHeader>
      <CardTitle className="text-xl">Revenue &amp; Expenses Breakdown</CardTitle>
      <CardDescription>
        How Example Corp makes and spends money. Based on latest reported earnings, on an LTM basis.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="w-full" style={{ height: '500px', position: 'relative' }}>
        <ParentSize>
          {({ width, height }) => (
            <svg width={width} height={height}>
              <Sankey
                root={sankeyData}
                extent={[[0, 0], [width, height]]}
                nodeWidth={20}
                nodePadding={25}
                nodeId={d => d.id}
              >
                {({ graph }) => (
                  <g>
                    {graph.links.map((link, i) => (
                      <path
                        key={`link-${i}`}
                        d={sankeyLinkHorizontal()(link) || undefined}
                        stroke={getLinkColor(link)}
                        strokeWidth={Math.max(1, link.width || 1)}
                        fill="none"
                        opacity={0.3}
                      />
                    ))}
                    {graph.nodes.map((node, i) => {
                      const x0 = node.x0 ?? 0;
                      const x1 = node.x1 ?? 0;
                      const y0 = node.y0 ?? 0;
                      const y1 = node.y1 ?? 0;
                      const labelX = x1 + 8;
                      const labelY = (y0 + y1) / 2;
                      const isRight = x0 > width / 2;
                      return (
                        <g key={`node-${i}`}> 
                          <rect
                            x={x0}
                            y={y0}
                            width={x1 - x0}
                            height={y1 - y0}
                            fill={getNodeColor(node)}
                            rx={3}
                          />
                          <text
                            x={isRight ? x0 - 8 : x1 + 8}
                            y={labelY - 8}
                            textAnchor={isRight ? 'end' : 'start'}
                            fill="#fff"
                            fontSize={14}
                            fontWeight="bold"
                            style={{ fontFamily: 'Inter, sans-serif', textShadow: '0 1px 4px #222' }}
                          >
                            {node.id}
                          </text>
                          <text
                            x={isRight ? x0 - 8 : x1 + 8}
                            y={labelY + 10}
                            textAnchor={isRight ? 'end' : 'start'}
                            fill="#b5b5b5"
                            fontSize={12}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {formatCurrency(node.value ?? 0)}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </Sankey>
            </svg>
          )}
        </ParentSize>
      </div>
    </CardContent>
  </Card>
);

export default RevenueExpensesBreakdownChart;
