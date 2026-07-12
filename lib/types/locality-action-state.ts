export type LocalityActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialLocalityActionState: LocalityActionState = {
  success: false,
  message: "",
};
