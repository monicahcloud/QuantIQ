export type EducationLevelActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialEducationLevelActionState: EducationLevelActionState = {
  success: false,
  message: "",
};
