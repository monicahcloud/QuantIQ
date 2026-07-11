"use client";

import { useState } from "react";
import { toast } from "sonner";

import WizardLayout from "@/components/educator-studio/layouts/WizardLayout";
import type { AppStepperStep } from "@/components/ui/app-stepper";

import LessonBasicInformation from "./LessonBasicInfo";
import LessonObjectives from "./LessonObjectives";
import LessonAiOptions from "./steps/LessonAIOptions";
import LessonReview from "./steps/LessonReview";
import LessonStudentInformation from "./steps/LessonStudentInformation";

const steps: AppStepperStep[] = [
  {
    id: "basic",
    label: "Basic",
    description: "Subject and lesson details",
  },
  {
    id: "students",
    label: "Students",
    description: "Class needs and learning levels",
  },
  {
    id: "objectives",
    label: "Objectives",
    description: "Goals and success criteria",
  },
  {
    id: "options",
    label: "AI Options",
    description: "Teaching style and resources",
  },
  {
    id: "review",
    label: "Review",
    description: "Confirm and generate",
  },
];

export type LessonWizardData = {
  subject: string;
  gradeLevel: string;
  topic: string;
  title: string;
  lessonDate: string;
  duration: string;
  curriculum: string;
  standards: string;

  className: string;
  classSize: string;
  learningLevels: string[];
  studentNeeds: string[];

  learningObjectives: string[];
  successCriteria: string[];
  assessmentType: string;

  teachingStyles: string[];
  complexity: string;
  generateResources: string[];
};

const initialData: LessonWizardData = {
  subject: "",
  gradeLevel: "",
  topic: "",
  title: "",
  lessonDate: "",
  duration: "45",
  curriculum: "",
  standards: "",

  className: "",
  classSize: "",
  learningLevels: [],
  studentNeeds: [],

  learningObjectives: [""],
  successCriteria: [""],
  assessmentType: "",

  teachingStyles: [],
  complexity: "standard",
  generateResources: [],
};

export default function LessonWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<LessonWizardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateData(values: Partial<LessonWizardData>) {
    setData((current) => ({
      ...current,
      ...values,
    }));
  }

  function validateCurrentStep() {
    if (currentStep === 0) {
      if (!data.subject) {
        toast.error("Please select a subject.");
        return false;
      }

      if (!data.gradeLevel) {
        toast.error("Please select a grade level.");
        return false;
      }

      if (!data.topic.trim()) {
        toast.error("Please enter a lesson topic.");
        return false;
      }

      if (!data.title.trim()) {
        toast.error("Please enter a lesson title.");
        return false;
      }
    }

    if (currentStep === 1) {
      if (!data.classSize.trim()) {
        toast.error("Please enter the class size.");
        return false;
      }

      if (data.learningLevels.length === 0) {
        toast.error("Please select at least one learning level.");
        return false;
      }
    }

    if (currentStep === 2) {
      const objectives = data.learningObjectives.filter(
        (objective) => objective.trim().length > 0,
      );

      const criteria = data.successCriteria.filter(
        (criterion) => criterion.trim().length > 0,
      );

      if (objectives.length === 0) {
        toast.error("Please add at least one learning objective.");
        return false;
      }

      if (criteria.length === 0) {
        toast.error("Please add at least one success criterion.");
        return false;
      }

      if (!data.assessmentType) {
        toast.error("Please select an assessment type.");
        return false;
      }
    }

    if (currentStep === 3 && data.teachingStyles.length === 0) {
      toast.error("Please select at least one teaching style.");
      return false;
    }

    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    void handleGenerate();
  }

  function handlePrevious() {
    setCurrentStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStepChange(step: number) {
    if (step <= currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleSaveDraft() {
    console.log("Save lesson draft:", data);
    toast.success("Lesson draft is ready to be connected to the database.");
  }

  async function handleGenerate() {
    try {
      setIsSubmitting(true);

      console.log("Generate lesson:", data);

      toast.success("Lesson information is ready for generation.");
    } catch {
      toast.error("Something went wrong while preparing the lesson.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardLayout
      steps={steps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      isFirstStep={currentStep === 0}
      isLastStep={currentStep === steps.length - 1}
      isSubmitting={isSubmitting}>
      {currentStep === 0 && (
        <LessonBasicInformation data={data} updateData={updateData} />
      )}

      {currentStep === 1 && (
        <LessonStudentInformation data={data} updateData={updateData} />
      )}

      {currentStep === 2 && (
        <LessonObjectives data={data} updateData={updateData} />
      )}

      {currentStep === 3 && (
        <LessonAiOptions data={data} updateData={updateData} />
      )}

      {currentStep === 4 && <LessonReview data={data} />}
    </WizardLayout>
  );
}
