export type AcademicWeekActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  generatedCount?: number;
};

export const initialAcademicWeekActionState: AcademicWeekActionState = {
  success: false,
  message: "",
};
