import {
  curriculumExtractionSchema,
  type CurriculumExtraction,
} from "../schemas/curriculum-extraction";
import { NovaValidationError } from "../errors";

export function validateCurriculumExtraction(
  value: unknown,
): CurriculumExtraction {
  const parsed = curriculumExtractionSchema.safeParse(value);

  if (!parsed.success) {
    throw new NovaValidationError(
      "The extracted curriculum did not match the required structure.",
      parsed.error.flatten(),
    );
  }

  return parsed.data;
}
