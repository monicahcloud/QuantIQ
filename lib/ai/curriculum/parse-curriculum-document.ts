import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import {
  curriculumExtractionSchema,
  type CurriculumExtraction,
} from "@/lib/ai/curriculum/curriculum-extraction-schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ParseCurriculumDocumentInput = {
  fileUrl: string;
  mimeType: string | null;
  documentTitle: string;
  curriculumVersionName: string;
  countryName: string;
};

export async function parseCurriculumDocument({
  fileUrl,
  mimeType,
  documentTitle,
  curriculumVersionName,
  countryName,
}: ParseCurriculumDocumentInput): Promise<CurriculumExtraction> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await openai.responses.parse({
    model: "gpt-5.6",

    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `
You are Nova Curriculum Intelligence.

Extract official curriculum information from the supplied document.

Rules:
- Preserve official wording exactly whenever possible.
- Do not invent standards, objectives, codes, dates, grades, subjects, or page numbers.
- Use null when information is missing.
- Add uncertainty or conflicts to the warnings array.
- Build the curriculum as frameworks, packages, and hierarchical nodes.
- Frameworks may represent stages such as Preschool, Primary, Junior High, Secondary, IGCSE, PYP, or MYP.
- Packages represent one education level, grade, and subject combination.
- Keep vocabulary, misconceptions, success criteria, essential questions, and big ideas as child curriculum nodes when present.
- Mark directly measurable objectives, outcomes, standards, benchmarks, indicators, and learning targets as assessable when appropriate.
- Confidence values must be between 0 and 1.
            `.trim(),
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `
Known metadata:
Document title: ${documentTitle}
Curriculum version: ${curriculumVersionName}
Country: ${countryName}
MIME type: ${mimeType ?? "unknown"}

Analyze the attached official curriculum source.
            `.trim(),
          },
          {
            type: "input_file",
            file_url: fileUrl,
            detail: "high",
          },
        ],
      },
    ],

    text: {
      format: zodTextFormat(
        curriculumExtractionSchema,
        "curriculum_extraction",
      ),
    },
  });

  if (!response.output_parsed) {
    throw new Error("Nova did not return a valid curriculum extraction.");
  }

  return response.output_parsed;
}
