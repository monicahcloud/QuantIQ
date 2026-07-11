export type GradeSubjectActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialGradeSubjectActionState: GradeSubjectActionState = {
  success: false,
  message: "",
};
