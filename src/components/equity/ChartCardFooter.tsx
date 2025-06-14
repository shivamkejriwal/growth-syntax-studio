"use client";

import React from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";

export const ChartCardFooter: React.FC = () => {
  return (
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
  );
};