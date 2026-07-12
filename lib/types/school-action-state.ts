export type SchoolActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialSchoolActionState: SchoolActionState = {
  success: false,
  message: "",
};
