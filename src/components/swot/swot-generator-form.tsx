"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { generateSwotAnalysis, type GenerateSwotAnalysisOutput } from "@/ai/flows/generate-swot-analysis";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  companyInformation: z.string().min(50, {
    message: "Company information must be at least 50 characters.",
  }).max(5000, {
    message: "Company information must not exceed 5000 characters.",
  }),
});

interface SWOTGeneratorFormProps {
  onAnalysisGenerated: (analysis: GenerateSwotAnalysisOutput) => void;
  onLoadingChange: (loading: boolean) => void;
}

export function SWOTGeneratorForm({ onAnalysisGenerated, onLoadingChange }: SWOTGeneratorFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyInformation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onLoadingChange(true);
    try {
      const analysis = await generateSwotAnalysis({ companyInformation: values.companyInformation });
      onAnalysisGenerated(analysis);
      toast({
        title: "SWOT Analysis Generated",
        description: "The AI has successfully analyzed the company information.",
      });
    } catch (error) {
      console.error("Error generating SWOT analysis:", error);
      toast({
        title: "Error Generating Analysis",
        description: "An error occurred while generating the SWOT analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyInformation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Company Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide comprehensive details about the company: its mission, products/services, target market, competitors, financial status, recent news, industry trends, etc."
                  className="min-h-[200px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The more detailed the information, the better the SWOT analysis. (Min 50 characters, Max 5000)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Analysis...
            </>
          ) : (
            "Generate SWOT Analysis"
          )}
        </Button>
      </form>
    </Form>
  );
}
