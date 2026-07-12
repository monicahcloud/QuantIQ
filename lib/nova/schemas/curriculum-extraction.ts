import { z } from "zod";

export const curriculumNodeTypeSchema = z.enum([
  "DOMAIN",
  "STRAND",
  "STANDARD",
  "BENCHMARK",
  "OBJECTIVE",
  "OUTCOME",
  "EXPECTATION",
  "SUCCESS_CRITERIA",
  "VOCABULARY",
  "ESSENTIAL_QUESTION",
  "BIG_IDEA",
  "MISCONCEPTION",
  "KEY_SKILL",
  "COMPETENCY",
  "CONTENT",
  "TOPIC",
  "SUBTOPIC",
  "INDICATOR",
  "LEARNING_TARGET",
  "OTHER",
]);

export const bloomsLevelSchema = z.enum([
  "REMEMBER",
  "UNDERSTAND",
  "APPLY",
  "ANALYZE",
  "EVALUATE",
  "CREATE",
]);

export const difficultyLevelSchema = z.enum([
  "FOUNDATIONAL",
  "DEVELOPING",
  "PROFICIENT",
  "ADVANCED",
]);

export type ExtractedCurriculumNode = {
  nodeType: z.infer<typeof curriculumNodeTypeSchema>;
  title: string;
  code: string | null;
  description: string | null;
  officialText: string | null;
  sourcePage: number | null;
  sourceSection: string | null;
  sequence: number;
  isRequired: boolean;
  isAssessable: boolean;
  estimatedMinutes: number | null;
  bloomsLevel: z.infer<typeof bloomsLevelSchema> | null;
  difficulty: z.infer<typeof difficultyLevelSchema> | null;
  children: ExtractedCurriculumNode[];
};

export const extractedCurriculumNodeSchema: z.ZodType<ExtractedCurriculumNode> =
  z.lazy(() =>
    z.object({
      nodeType: curriculumNodeTypeSchema,
      title: z.string().min(1),
      code: z.string().nullable(),
      description: z.string().nullable(),
      officialText: z.string().nullable(),
      sourcePage: z.number().int().positive().nullable(),
      sourceSection: z.string().nullable(),
      sequence: z.number().int().positive(),
      isRequired: z.boolean(),
      isAssessable: z.boolean(),
      estimatedMinutes: z.number().int().positive().nullable(),
      bloomsLevel: bloomsLevelSchema.nullable(),
      difficulty: difficultyLevelSchema.nullable(),
      children: z.array(extractedCurriculumNodeSchema),
    }),
  );

export const curriculumExtractionSchema = z.object({
  documentSummary: z.object({
    title: z.string(),
    curriculumName: z.string().nullable(),
    versionLabel: z.string().nullable(),
    countryName: z.string().nullable(),
    administrativeDivisionName: z.string().nullable(),
    authorityName: z.string().nullable(),
    languageCode: z.string().nullable(),
    issuedDate: z.string().nullable(),
    effectiveDate: z.string().nullable(),
    totalPages: z.number().int().positive().nullable(),
  }),

  frameworks: z.array(
    z.object({
      name: z.string().min(1),
      code: z.string().nullable(),
      description: z.string().nullable(),
      sequence: z.number().int().positive(),

      packages: z.array(
        z.object({
          name: z.string().min(1),
          code: z.string().nullable(),
          description: z.string().nullable(),

          educationLevelName: z.string().min(1),
          gradeLevelName: z.string().min(1),
          subjectName: z.string().min(1),

          sequence: z.number().int().positive(),

          nodes: z.array(extractedCurriculumNodeSchema),
        }),
      ),
    }),
  ),

  warnings: z.array(z.string()),

  confidence: z.object({
    overall: z.number().min(0).max(1),
    metadata: z.number().min(0).max(1),
    structure: z.number().min(0).max(1),
    wording: z.number().min(0).max(1),
  }),
});

export type CurriculumExtraction = z.infer<typeof curriculumExtractionSchema>;
