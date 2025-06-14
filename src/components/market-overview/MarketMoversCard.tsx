"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface MarketDataRow {
  ticker: string;
  close: number;
  change: string;
  changeType: "positive" | "negative";
  volume?: string; // Only for active table
}

interface MarketDataTableProps {
  data: MarketDataRow[];
  type: "gainer-loser" | "active";
}

const MarketDataTable: React.FC<MarketDataTableProps> = ({ data, type }) => {
  return (
    <div className="max-h-[300px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead className="text-right">Close</TableHead>
            <TableHead className="text-right">Change</TableHead>
            {type === "active" && <TableHead className="text-right">Volume</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.ticker}>
              <TableCell className="font-medium">{item.ticker}</TableCell>
              <TableCell className="text-right">{item.close.toFixed(2)}</TableCell>
              <TableCell className={`text-right font-medium ${item.changeType === "positive" ? "text-primary" : "text-destructive"}`}>
                {item.change}
              </TableCell>
              {type === "active" && <TableCell className="text-right">{item.volume}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface MarketMoversCardProps {
  currentDate: string;
  gainersData: MarketDataRow[];
  losersData: MarketDataRow[];
  activeData: MarketDataRow[];
  advancers: number;
  decliners: number;
}

export const MarketMoversCard: React.FC<MarketMoversCardProps> = ({ currentDate, gainersData, losersData, activeData, advancers, decliners }) => {
  const [activeMarketMoversTab, setActiveMarketMoversTab] = useState("gainers");

  return (
    <Card className="shadow-lg lg:col-span-2">
      <CardHeader>
        <CardTitle>Market Movers & Activity</CardTitle>
        <CardDescription>Market data for {currentDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMarketMoversTab} onValueChange={setActiveMarketMoversTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gainers">Gainers</TabsTrigger>
            <TabsTrigger value="losers">Losers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
          </TabsList>
          <TabsContent value="gainers">
            <MarketDataTable data={gainersData} type="gainer-loser" />
          </TabsContent>
          <TabsContent value="losers">
            <MarketDataTable data={losersData} type="gainer-loser" />
          </TabsContent>
          <TabsContent value="active">
            <MarketDataTable data={activeData} type="active" />
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-primary">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>Advancers: {advancers}</span>
          </div>
          <div className="h-2 w-1/2 bg-muted rounded-full relative">
            <div style={{ width: `${(advancers / (advancers + decliners)) * 100}%`}} className="h-2 bg-primary rounded-l-full"></div>
            <div className="absolute top-1/2 left-1/2 h-4 w-1 bg-primary-foreground border border-primary rounded-sm -translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="flex items-center text-destructive">
            <TrendingDown className="mr-1 h-4 w-4" />
            <span>Decliners: {decliners}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};