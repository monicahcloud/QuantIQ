import {
  DEFAULT_MAX_OUTPUT_TOKENS,
  DEFAULT_NOVA_MODEL,
  DEFAULT_NOVA_PROVIDER,
} from "./constants";

export const novaConfig = {
  provider: DEFAULT_NOVA_PROVIDER,
  model: DEFAULT_NOVA_MODEL,
  maxOutputTokens: DEFAULT_MAX_OUTPUT_TOKENS,
} as const;

export function validateNovaConfig() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing from the server environment.");
  }
}
