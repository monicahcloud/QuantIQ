"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type AppStepperStep = {
  id: string;
  label: string;
  description?: string;
};

type AppStepperProps = {
  steps: AppStepperStep[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  className?: string;
};

export function AppStepper({
  steps,
  currentStep,
  onStepChange,
  className,
}: AppStepperProps) {
  const progress =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-slate-200 md:block" />

        <div
          className="absolute left-0 top-5 hidden h-0.5 bg-blue-700 transition-all duration-300 md:block"
          style={{
            width: `${progress}%`,
          }}
        />

        <div
          className="relative grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          }}>
          {steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = Boolean(onStepChange && index <= currentStep);

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) {
                    onStepChange?.(index);
                  }
                }}
                className={cn(
                  "flex items-start gap-3 text-left md:flex-col md:items-center md:text-center",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}>
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-white text-sm font-black transition",
                    isComplete && "border-blue-700 bg-blue-700 text-white",
                    isCurrent &&
                      "border-blue-700 text-blue-700 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]",
                    !isComplete &&
                      !isCurrent &&
                      "border-slate-200 text-slate-400",
                  )}>
                  {isComplete ? <Check className="h-5 w-5" /> : index + 1}
                </div>

                <div className="pt-1 md:pt-0">
                  <p
                    className={cn(
                      "text-sm font-black",
                      isComplete || isCurrent
                        ? "text-[#071d4e]"
                        : "text-slate-400",
                    )}>
                    {step.label}
                  </p>

                  {step.description && (
                    <p className="mt-1 hidden text-xs leading-5 text-slate-500 lg:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
