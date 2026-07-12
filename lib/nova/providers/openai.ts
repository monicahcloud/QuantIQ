import OpenAI from "openai";

import { NovaConfigurationError } from "../errors";

let openAIClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (openAIClient) {
    return openAIClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new NovaConfigurationError("OPENAI_API_KEY is not configured.");
  }

  openAIClient = new OpenAI({
    apiKey,
  });

  return openAIClient;
}
