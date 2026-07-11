export type CountryActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialCountryActionState: CountryActionState = {
  success: false,
  message: "",
};
