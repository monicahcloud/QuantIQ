import { z } from "zod";

export const curriculumScopeSchema = z.enum([
  "COUNTRY",
  "ADMINISTRATIVE_DIVISION",
  "AUTHORITY",
  "ORGANIZATION",
  "SCHOOL",
]);

export const curriculumVersionStatusSchema = z.enum([
  "DRAFT",
  "UNDER_REVIEW",
  "APPROVED",
  "PUBLISHED",
  "RETIRED",
  "ARCHIVED",
]);

const optionalDateSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return value;
}, z.coerce.date().nullable());

export const curriculumVersionSchema = z
  .object({
    countryId: z.string().trim().min(1, "Please select a country."),

    administrativeDivisionId: z.string().trim().optional(),
    authorityId: z.string().trim().optional(),
    organizationId: z.string().trim().optional(),
    schoolId: z.string().trim().optional(),

    name: z
      .string()
      .trim()
      .min(2, "Curriculum name must contain at least 2 characters.")
      .max(180, "Curriculum name must not exceed 180 characters."),

    code: z
      .string()
      .trim()
      .min(2, "Curriculum code is required.")
      .max(50, "Curriculum code must not exceed 50 characters."),

    slug: z
      .string()
      .trim()
      .min(2, "Slug is required.")
      .max(180, "Slug must not exceed 180 characters.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug may only contain lowercase letters, numbers, and hyphens.",
      ),

    versionLabel: z
      .string()
      .trim()
      .max(100, "Version label must not exceed 100 characters.")
      .optional(),

    languageCode: z
      .string()
      .trim()
      .min(2, "Language code is required.")
      .max(15, "Language code must not exceed 15 characters.")
      .regex(
        /^[a-z]{2,3}(?:-[A-Z]{2})?$/,
        "Use a language code such as en, en-BS, es, or fr.",
      ),

    scope: curriculumScopeSchema,

    description: z
      .string()
      .trim()
      .max(2000, "Description must not exceed 2,000 characters.")
      .optional(),

    notes: z
      .string()
      .trim()
      .max(3000, "Notes must not exceed 3,000 characters.")
      .optional(),

    effectiveFrom: optionalDateSchema,
    effectiveTo: optionalDateSchema,
    publishedAt: optionalDateSchema,

    isCurrent: z.boolean(),

    status: curriculumVersionStatusSchema,
  })
  .superRefine((data, context) => {
    if (
      data.effectiveFrom &&
      data.effectiveTo &&
      data.effectiveTo < data.effectiveFrom
    ) {
      context.addIssue({
        code: "custom",
        path: ["effectiveTo"],
        message: "The end date must be on or after the start date.",
      });
    }

    if (
      data.scope === "ADMINISTRATIVE_DIVISION" &&
      !data.administrativeDivisionId
    ) {
      context.addIssue({
        code: "custom",
        path: ["administrativeDivisionId"],
        message: "Please select an administrative division.",
      });
    }

    if (data.scope === "AUTHORITY" && !data.authorityId) {
      context.addIssue({
        code: "custom",
        path: ["authorityId"],
        message: "Please select an education authority.",
      });
    }

    if (data.scope === "ORGANIZATION" && !data.organizationId) {
      context.addIssue({
        code: "custom",
        path: ["organizationId"],
        message: "Please select an organization.",
      });
    }

    if (data.scope === "SCHOOL" && !data.schoolId) {
      context.addIssue({
        code: "custom",
        path: ["schoolId"],
        message: "Please select a school.",
      });
    }

    if (data.status === "PUBLISHED" && !data.publishedAt) {
      context.addIssue({
        code: "custom",
        path: ["publishedAt"],
        message: "A published curriculum requires a publication date.",
      });
    }

    if (data.isCurrent && !["APPROVED", "PUBLISHED"].includes(data.status)) {
      context.addIssue({
        code: "custom",
        path: ["isCurrent"],
        message:
          "Only approved or published curriculum versions may be current.",
      });
    }
  });

export const curriculumVersionIdSchema = z.object({
  curriculumVersionId: z
    .string()
    .trim()
    .min(1, "A valid curriculum version is required."),
});

export type CurriculumVersionInput = z.infer<typeof curriculumVersionSchema>;
