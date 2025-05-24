"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SWOTGeneratorForm } from "@/components/swot/swot-generator-form";
import { SWOTDisplay } from "@/components/swot/swot-display";
import type { GenerateSwotAnalysisOutput } from "@/ai/flows/generate-swot-analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SWOTAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<GenerateSwotAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisGenerated = (analysis: GenerateSwotAnalysisOutput) => {
    setAnalysisResult(analysis);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">AI-Powered SWOT Analysis</h1>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generate SWOT Insights</CardTitle>
            <CardDescription>
              Input company information below, and our AI will generate a Strengths, Weaknesses, Opportunities, and Threats analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SWOTGeneratorForm 
              onAnalysisGenerated={handleAnalysisGenerated} 
              onLoadingChange={handleLoadingChange} 
            />
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generating Analysis...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        )}

        {!isLoading && analysisResult && <SWOTDisplay analysis={analysisResult} />}
        
        {!isLoading && !analysisResult && (
           <Card className="shadow-md mt-8">
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>Your generated SWOT analysis will appear here once you submit company information.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
