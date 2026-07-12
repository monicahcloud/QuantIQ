export type CurriculumVersionActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialCurriculumVersionActionState: CurriculumVersionActionState =
  {
    success: false,
    message: "",
  };
