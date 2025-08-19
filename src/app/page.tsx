import Image from 'next/image';
import { BmiCalculator } from '@/components/bmi-calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="QueensOfCardio Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            QueensOfCardio
          </h1>
          <p className="mt-2 text-base md:text-lg text-foreground/70">
            For the Queens of Cardio. Calculate your BMI and get personalized
            recommendations to rock your fitness journey.
          </p>
        </div>
        <BmiCalculator />
      </div>
    </main>
  );
}
