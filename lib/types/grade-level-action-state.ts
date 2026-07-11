export type GradeLevelActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialGradeLevelActionState: GradeLevelActionState = {
  success: false,
  message: "",
};
