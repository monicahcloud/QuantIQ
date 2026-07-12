import { z } from "zod";

export const extractedCurriculumNodeSchema: z.ZodType<{
  nodeType:
    | "DOMAIN"
    | "STRAND"
    | "STANDARD"
    | "BENCHMARK"
    | "OBJECTIVE"
    | "OUTCOME"
    | "EXPECTATION"
    | "SUCCESS_CRITERIA"
    | "VOCABULARY"
    | "ESSENTIAL_QUESTION"
    | "BIG_IDEA"
    | "MISCONCEPTION"
    | "KEY_SKILL"
    | "COMPETENCY"
    | "CONTENT"
    | "TOPIC"
    | "SUBTOPIC"
    | "INDICATOR"
    | "LEARNING_TARGET"
    | "OTHER";
  title: string;
  code: string | null;
  description: string | null;
  officialText: string | null;
  sourcePage: number | null;
  sequence: number;
  isRequired: boolean;
  isAssessable: boolean;
  estimatedMinutes: number | null;
  bloomsLevel:
    | "REMEMBER"
    | "UNDERSTAND"
    | "APPLY"
    | "ANALYZE"
    | "EVALUATE"
    | "CREATE"
    | null;
  difficulty: "FOUNDATIONAL" | "DEVELOPING" | "PROFICIENT" | "ADVANCED" | null;
  children: Array<unknown>;
}> = z.lazy(() =>
  z.object({
    nodeType: z.enum([
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
    ]),

    title: z.string(),
    code: z.string().nullable(),
    description: z.string().nullable(),
    officialText: z.string().nullable(),
    sourcePage: z.number().int().positive().nullable(),
    sequence: z.number().int().positive(),
    isRequired: z.boolean(),
    isAssessable: z.boolean(),
    estimatedMinutes: z.number().int().positive().nullable(),

    bloomsLevel: z
      .enum([
        "REMEMBER",
        "UNDERSTAND",
        "APPLY",
        "ANALYZE",
        "EVALUATE",
        "CREATE",
      ])
      .nullable(),

    difficulty: z
      .enum(["FOUNDATIONAL", "DEVELOPING", "PROFICIENT", "ADVANCED"])
      .nullable(),

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
      name: z.string(),
      code: z.string().nullable(),
      description: z.string().nullable(),
      sequence: z.number().int().positive(),

      packages: z.array(
        z.object({
          name: z.string(),
          educationLevelName: z.string(),
          gradeLevelName: z.string(),
          subjectName: z.string(),
          code: z.string().nullable(),
          description: z.string().nullable(),
          sequence: z.number().int().positive(),
          nodes: z.array(extractedCurriculumNodeSchema),
        }),
      ),
    }),
  ),

  warnings: z.array(z.string()),

  confidence: z.object({
    overall: z.number().min(0).max(1),
    structure: z.number().min(0).max(1),
    metadata: z.number().min(0).max(1),
  }),
});

export type CurriculumExtraction = z.infer<typeof curriculumExtractionSchema>;
