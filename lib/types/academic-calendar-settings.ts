export type AcademicCalendarSettingActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialAcademicCalendarSettingActionState: AcademicCalendarSettingActionState =
  {
    success: false,
    message: "",
  };
