import { zodTextFormat } from "openai/helpers/zod";

import {
  curriculumExtractionSchema,
  type CurriculumExtraction,
} from "../schemas/curriculum-extraction";
import { novaConfig } from "../config";
import { NovaParsingError, NovaProviderError } from "../errors";
import { novaLogger } from "../logger";
import { getOpenAIClient } from "../providers";
import { recordNovaUsage } from "../telemetry";
import { withRetry } from "../shared/retry";

export type ParseCurriculumDocumentInput = {
  fileUrl: string;
  documentTitle: string;
  curriculumVersionName: string;
  countryName: string;
  mimeType?: string | null;
};

export async function parseCurriculumDocument({
  fileUrl,
  documentTitle,
  curriculumVersionName,
  countryName,
  mimeType,
}: ParseCurriculumDocumentInput): Promise<CurriculumExtraction> {
  const startedAt = Date.now();
  const client = getOpenAIClient();

  try {
    const response = await withRetry(() =>
      client.responses.parse({
        model: novaConfig.model,

        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: `
You are Nova Curriculum Intelligence.

Analyze only the supplied official curriculum document.

Requirements:
- Preserve official curriculum wording whenever possible.
- Never invent standards, benchmarks, objectives, grades, subjects, codes, dates, or page numbers.
- Use null when information is missing.
- Add uncertainty, contradictions, and missing information to warnings.
- Organize the output into frameworks, grade-and-subject packages, and hierarchical curriculum nodes.
- Keep strands, standards, benchmarks, objectives, outcomes, success criteria, vocabulary, misconceptions, essential questions, and big ideas as nodes.
- Mark measurable learning targets as assessable when justified.
- Return confidence values between 0 and 1.
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

Extract the curriculum structure from the attached document.
                `.trim(),
              },
              {
                type: "input_file",
                file_url: fileUrl,
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

        max_output_tokens: novaConfig.maxOutputTokens,
      }),
    );

    if (!response.output_parsed) {
      throw new NovaParsingError(
        "Nova returned no structured curriculum extraction.",
      );
    }

    await recordNovaUsage({
      provider: novaConfig.provider,
      model: novaConfig.model,
      operation: "curriculum.parseDocument",
      latencyMs: Date.now() - startedAt,
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      totalTokens: response.usage?.total_tokens,
      success: true,
    });

    return response.output_parsed;
  } catch (error) {
    novaLogger.error("Curriculum extraction failed.", error);

    await recordNovaUsage({
      provider: novaConfig.provider,
      model: novaConfig.model,
      operation: "curriculum.parseDocument",
      latencyMs: Date.now() - startedAt,
      success: false,
    });

    if (error instanceof NovaParsingError) {
      throw error;
    }

    throw new NovaProviderError(
      "Nova could not analyze the curriculum document.",
      error,
    );
  }
}
