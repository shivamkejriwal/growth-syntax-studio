import type { GenerateSwotAnalysisOutput } from "@/ai/flows/generate-swot-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Zap, Target } from "lucide-react";

interface SWOTDisplayProps {
  analysis: GenerateSwotAnalysisOutput | null;
}

const swotCategories = [
  { title: "Strengths", key: "strengths", icon: <CheckCircle className="h-6 w-6 text-green-500" />, color: "border-green-500" },
  { title: "Weaknesses", key: "weaknesses", icon: <XCircle className="h-6 w-6 text-red-500" />, color: "border-red-500" },
  { title: "Opportunities", key: "opportunities", icon: <Zap className="h-6 w-6 text-blue-500" />, color: "border-blue-500" },
  { title: "Threats", key: "threats", icon: <Target className="h-6 w-6 text-orange-500" />, color: "border-orange-500" },
] as const;


export function SWOTDisplay({ analysis }: SWOTDisplayProps) {
  if (!analysis) {
    return null;
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {swotCategories.map((category) => (
        <Card key={category.key} className={`shadow-lg ${category.color} border-l-4`}>
          <CardHeader className="flex flex-row items-center space-x-3">
            {category.icon}
            <CardTitle className="text-xl">{category.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis[category.key] && analysis[category.key].length > 0 ? (
              <ul className="list-disc space-y-2 pl-5">
                {analysis[category.key].map((item, index) => (
                  <li key={index} className="text-foreground/90">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No {category.title.toLowerCase()} identified.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
