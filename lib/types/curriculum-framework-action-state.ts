export type CurriculumFrameworkActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialCurriculumFrameworkActionState: CurriculumFrameworkActionState =
  {
    success: false,
    message: "",
  };
