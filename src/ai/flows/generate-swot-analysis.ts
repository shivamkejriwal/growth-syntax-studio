// src/ai/flows/generate-swot-analysis.ts
'use server';
/**
 * @fileOverview SWOT analysis AI agent.
 *
 * - generateSwotAnalysis - A function that handles the SWOT analysis process.
 * - GenerateSwotAnalysisInput - The input type for the generateSwotAnalysis function.
 * - GenerateSwotAnalysisOutput - The return type for the generateSwotAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSwotAnalysisInputSchema = z.object({
  companyInformation: z
    .string()
    .describe('Comprehensive information about the company to analyze.'),
});
export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;

const GenerateSwotAnalysisOutputSchema = z.object({
  strengths: z.array(z.string()).describe('List of strengths of the company.'),
  weaknesses: z.array(z.string()).describe('List of weaknesses of the company.'),
  opportunities: z.array(z.string()).describe('List of opportunities for the company.'),
  threats: z.array(z.string()).describe('List of threats to the company.'),
});
export type GenerateSwotAnalysisOutput = z.infer<typeof GenerateSwotAnalysisOutputSchema>;

export async function generateSwotAnalysis(input: GenerateSwotAnalysisInput): Promise<GenerateSwotAnalysisOutput> {
  return generateSwotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSwotAnalysisPrompt',
  input: {schema: GenerateSwotAnalysisInputSchema},
  output: {schema: GenerateSwotAnalysisOutputSchema},
  prompt: `Analyze the following company information and generate a SWOT analysis:

Company Information: {{{companyInformation}}}

Consider the internal strengths and weaknesses, as well as external opportunities and threats.

Format the output as a JSON object with keys for strengths, weaknesses, opportunities, and threats. Each key should contain a list of strings.`,
});

const generateSwotAnalysisFlow = ai.defineFlow(
  {
    name: 'generateSwotAnalysisFlow',
    inputSchema: GenerateSwotAnalysisInputSchema,
    outputSchema: GenerateSwotAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
