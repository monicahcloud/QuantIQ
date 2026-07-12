import type { ZodType } from "zod";

import { NovaValidationError } from "../errors";

export function validateNovaOutput<T>(schema: ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new NovaValidationError(
      "Nova output did not match the required schema.",
      result.error.flatten(),
    );
  }

  return result.data;
}
