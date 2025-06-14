"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export interface SegmentData {
  name: string;
  change: string;
  icon: React.ReactNode;
}

interface SegmentsCardProps {
  sectorData: SegmentData[];
  industryData: SegmentData[];
}

export const SegmentsCard: React.FC<SegmentsCardProps> = ({ sectorData, industryData }) => {
  const [activeSegmentsTab, setActiveSegmentsTab] = useState("sectors");

  const renderSegmentList = (data: SegmentData[]) => (
    data.map((item) => (
      <div key={item.name} className="flex items-center justify-between text-sm py-1.5">
        <div className="flex items-center gap-2">
          {item.icon}
          <span>{item.name}</span>
        </div>
        <span className={parseFloat(item.change) >= 0 ? "text-primary" : "text-destructive"}>
          {item.change}
        </span>
      </div>
    ))
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Sectors & Industries</CardTitle>
        <Separator className="my-2" />
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={activeSegmentsTab} onValueChange={setActiveSegmentsTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="industries">Industries</TabsTrigger>
          </TabsList>
          <div>
            <TabsContent value="sectors" className="mt-0">{renderSegmentList(sectorData)}</TabsContent>
            <TabsContent value="industries" className="mt-0">{renderSegmentList(industryData)}</TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};