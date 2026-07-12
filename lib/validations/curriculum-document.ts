import { z } from "zod";

export const curriculumDocumentTypeSchema = z.enum([
  "CURRICULUM",
  "PACING_GUIDE",
  "SCOPE_AND_SEQUENCE",
  "STANDARDS",
  "FRAMEWORK",
  "ASSESSMENT_GUIDE",
  "TEACHER_GUIDE",
  "RESOURCE_GUIDE",
  "OTHER",
]);

const optionalDateSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return value;
}, z.coerce.date().nullable());

export const curriculumDocumentMetadataSchema = z
  .object({
    curriculumVersionId: z.string().trim().min(1),
    curriculumPackageId: z.string().trim().optional(),

    title: z.string().trim().min(2).max(200),
    description: z.string().trim().max(1500).optional(),

    documentType: curriculumDocumentTypeSchema,

    issuedDate: optionalDateSchema,
    effectiveDate: optionalDateSchema,
    expirationDate: optionalDateSchema,

    isPrimarySource: z.boolean(),
  })
  .superRefine((data, context) => {
    if (
      data.effectiveDate &&
      data.expirationDate &&
      data.expirationDate < data.effectiveDate
    ) {
      context.addIssue({
        code: "custom",
        path: ["expirationDate"],
        message: "The expiration date must be on or after the effective date.",
      });
    }
  });
