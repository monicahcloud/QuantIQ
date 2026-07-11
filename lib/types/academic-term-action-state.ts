export type AcademicTermActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialAcademicTermActionState: AcademicTermActionState = {
  success: false,
  message: "",
};
