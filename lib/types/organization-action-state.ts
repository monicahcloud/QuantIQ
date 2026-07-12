export type OrganizationActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialOrganizationActionState: OrganizationActionState = {
  success: false,
  message: "",
};
