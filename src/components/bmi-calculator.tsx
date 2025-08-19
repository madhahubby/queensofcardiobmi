"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HeartPulse, Bot, Scale, Ruler, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { bmiAIRecommendation } from "@/ai/flows/bmi-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  weight: z.coerce
    .number({ invalid_type_error: "Please enter a valid number." })
    .positive("Weight must be a positive number."),
  height: z.coerce
    .number({ invalid_type_error: "Please enter a valid number." })
    .positive("Height must be a positive number."),
});

type BmiResult = {
  value: string;
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
  color: "blue" | "green" | "yellow" | "red";
};

export function BmiCalculator() {
  const [isPending, startTransition] = React.useTransition();
  const [bmiResult, setBmiResult] = React.useState<BmiResult | null>(null);
  const [recommendation, setRecommendation] = React.useState<string | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: "" as unknown as number,
      height: "" as unknown as number,
    },
  });

  function getBmiCategory(bmi: number): BmiResult {
    if (bmi < 18.5) {
      return {
        value: bmi.toFixed(1),
        category: "Underweight",
        color: "blue",
      };
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return { value: bmi.toFixed(1), category: "Normal", color: "green" };
    } else if (bmi >= 25 && bmi <= 29.9) {
      return {
        value: bmi.toFixed(1),
        category: "Overweight",
        color: "yellow",
      };
    } else {
      return { value: bmi.toFixed(1), category: "Obese", color: "red" };
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setBmiResult(null);
    setRecommendation(null);
    const heightInMeters = values.height / 100;
    const bmiValue = values.weight / (heightInMeters * heightInMeters);

    if (isNaN(bmiValue) || !isFinite(bmiValue)) {
      toast({
        variant: "destructive",
        title: "Invalid calculation",
        description: "Please check your inputs and try again.",
      });
      return;
    }

    const result = getBmiCategory(bmiValue);
    setBmiResult(result);

    startTransition(async () => {
      try {
        const { recommendations } = await bmiAIRecommendation({ bmi: bmiValue });
        setRecommendation(recommendations);
      } catch (error) {
        console.error("AI recommendation error:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description:
            "Could not fetch recommendations at this time. Please try again later.",
        });
        setRecommendation(null);
      }
    });
  }

  const badgeColorClasses = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="space-y-6 w-full">
      <Card className="w-full shadow-lg border-primary/20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                BMI Calculator
              </CardTitle>
              <CardDescription>
                Enter your weight and height to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Scale className="w-4 h-4" /> Weight (kg)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 65"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> Height (cm)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 170"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full font-bold"
                disabled={isPending}
                size="lg"
              >
                {isPending ? (
                  <>
                    <Bot className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <HeartPulse className="mr-2 h-4 w-4" />
                    Calculate & Get Recommendations
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {(bmiResult || isPending) && (
        <Card className="w-full shadow-lg border-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-accent" /> Your Results
            </CardTitle>
            <CardDescription>
              Here's your BMI and personalized AI recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bmiResult && (
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">Your BMI</p>
                  <p className="text-4xl font-extrabold text-primary">
                    {bmiResult.value}
                  </p>
                </div>
                <Badge
                  className={`px-4 py-2 text-sm font-semibold ${
                    badgeColorClasses[bmiResult.color]
                  }`}
                >
                  {bmiResult.category}
                </Badge>
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5" /> AI Recommendations
              </h3>
              {isPending && !recommendation && (
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              )}
              {recommendation && (
                <div className="prose prose-sm dark:prose-invert text-foreground/90 p-4 bg-secondary/50 rounded-lg">
                  <p className="whitespace-pre-wrap">{recommendation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
