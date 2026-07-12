import { NovaConfigurationError } from "../errors";

export function getGoogleAIClient(): never {
  throw new NovaConfigurationError(
    "Google AI support has not been configured yet.",
  );
}
