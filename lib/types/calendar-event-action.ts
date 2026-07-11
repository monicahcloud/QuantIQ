export type CalendarEventActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialCalendarEventActionState: CalendarEventActionState = {
  success: false,
  message: "",
};
