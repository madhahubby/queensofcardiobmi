// bmi-recommendation.ts
'use server';
/**
 * @fileOverview Generates personalized exercise and diet recommendations based on the user's BMI.
 *
 * - bmiAIRecommendation - A function that generates personalized exercise and diet recommendations based on the user's BMI.
 * - BMIAIRecommendationInput - The input type for the bmiAIRecommendation function.
 * - BMIAIRecommendationOutput - The return type for the bmiAIRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BMIAIRecommendationInputSchema = z.object({
  bmi: z.number().describe('The user\s BMI.'),
});
export type BMIAIRecommendationInput = z.infer<typeof BMIAIRecommendationInputSchema>;

const BMIAIRecommendationOutputSchema = z.object({
  recommendations: z.string().describe('Personalized exercise and diet recommendations based on the user\'s BMI.'),
});
export type BMIAIRecommendationOutput = z.infer<typeof BMIAIRecommendationOutputSchema>;

export async function bmiAIRecommendation(input: BMIAIRecommendationInput): Promise<BMIAIRecommendationOutput> {
  return bmiAIRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bmiAIRecommendationPrompt',
  input: {schema: BMIAIRecommendationInputSchema},
  output: {schema: BMIAIRecommendationOutputSchema},
  prompt: `You are a personal trainer and nutritionist. Based on the user's BMI, provide personalized exercise and diet recommendations. The recommendations should be tailored to improve their health and fitness.

BMI: {{{bmi}}}
`,
});

const bmiAIRecommendationFlow = ai.defineFlow(
  {
    name: 'bmiAIRecommendationFlow',
    inputSchema: BMIAIRecommendationInputSchema,
    outputSchema: BMIAIRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
