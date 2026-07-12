export type AdministrativeDivisionActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialAdministrativeDivisionActionState: AdministrativeDivisionActionState =
  {
    success: false,
    message: "",
  };
