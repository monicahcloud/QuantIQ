import { z } from "zod";

export const gradeSubjectMappingSchema = z.object({
  countryId: z.string().trim().min(1, "Please select a country."),

  gradeLevelId: z.string().trim().min(1, "Please select a grade level."),

  subjectIds: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one subject."),
});

export type GradeSubjectMappingInput = z.infer<
  typeof gradeSubjectMappingSchema
>;
