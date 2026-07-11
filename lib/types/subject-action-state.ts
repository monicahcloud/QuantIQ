export type SubjectActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialSubjectActionState: SubjectActionState = {
  success: false,
  message: "",
};
