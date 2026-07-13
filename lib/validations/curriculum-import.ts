import { z } from "zod";

export const createCurriculumImportSchema = z.object({
  curriculumDocumentId: z.string().min(1, "A curriculum document is required."),
});

export type CreateCurriculumImportInput = z.infer<
  typeof createCurriculumImportSchema
>;
