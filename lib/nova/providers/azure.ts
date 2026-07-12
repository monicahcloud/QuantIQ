import { NovaConfigurationError } from "../errors";

export function getAzureOpenAIClient(): never {
  throw new NovaConfigurationError(
    "Azure OpenAI support has not been configured yet.",
  );
}
