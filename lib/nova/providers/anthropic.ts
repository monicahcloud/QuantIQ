import { NovaConfigurationError } from "../errors";

export function getAnthropicClient(): never {
  throw new NovaConfigurationError(
    "Anthropic support has not been configured yet.",
  );
}
