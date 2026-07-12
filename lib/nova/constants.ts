export const NOVA_NAME = "Nova";

export const NOVA_PROVIDERS = [
  "OPENAI",
  "ANTHROPIC",
  "GOOGLE",
  "AZURE",
] as const;

export type NovaProvider = (typeof NOVA_PROVIDERS)[number];

export const DEFAULT_NOVA_PROVIDER: NovaProvider = "OPENAI";

export const DEFAULT_NOVA_MODEL = process.env.NOVA_MODEL ?? "gpt-5.5";

export const DEFAULT_MAX_OUTPUT_TOKENS = 16_000;
