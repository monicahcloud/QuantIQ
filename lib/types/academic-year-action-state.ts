export type AcademicYearActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialAcademicYearActionState: AcademicYearActionState = {
  success: false,
  message: "",
};
