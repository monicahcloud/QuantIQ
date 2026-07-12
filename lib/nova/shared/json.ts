import { NovaParsingError } from "../errors";

export function parseJsonSafely<T>(value: string): T {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    throw new NovaParsingError("Nova returned invalid JSON.", error);
  }
}

export function stringifyJsonSafely(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new NovaParsingError("Nova output could not be serialized.", error);
  }
}
