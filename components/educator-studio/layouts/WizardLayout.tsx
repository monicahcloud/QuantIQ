"use client";

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

import { AppStepper } from "@/components/ui/app-stepper";
import type { AppStepperStep } from "@/components/ui/app-stepper";
import { Button } from "@/components/ui/button";

type WizardLayoutProps = {
  steps: AppStepperStep[];
  currentStep: number;
  children: ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
  onStepChange?: (step: number) => void;
};

export default function WizardLayout({
  steps,
  currentStep,
  children,
  onPrevious,
  onNext,
  onSaveDraft,
  onStepChange,
  isFirstStep,
  isLastStep,
  nextLabel,
  isSubmitting = false,
}: WizardLayoutProps) {
  return (
    <div className="w-full space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              Step {currentStep + 1} of {steps.length}
            </p>

            <h2 className="mt-1 text-lg font-black text-[#071d4e]">
              {steps[currentStep]?.label}
            </h2>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
          </p>
        </div>
        <AppStepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={onStepChange}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {children}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {!isFirstStep && (
              <Button type="button" variant="outline" onClick={onPrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {onSaveDraft && (
              <Button type="button" variant="ghost" onClick={onSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
            )}

            <Button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className="bg-blue-700 hover:bg-blue-800">
              {isSubmitting
                ? "Please wait..."
                : (nextLabel ?? (isLastStep ? "Generate Lesson" : "Continue"))}

              {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
