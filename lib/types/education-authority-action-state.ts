export type EducationAuthorityActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialEducationAuthorityActionState: EducationAuthorityActionState =
  {
    success: false,
    message: "",
  };
