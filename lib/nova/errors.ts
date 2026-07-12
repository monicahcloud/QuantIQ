export class NovaError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "NovaError";
  }
}

export class NovaConfigurationError extends NovaError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "NovaConfigurationError";
  }
}

export class NovaProviderError extends NovaError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "NovaProviderError";
  }
}

export class NovaValidationError extends NovaError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "NovaValidationError";
  }
}

export class NovaParsingError extends NovaError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "NovaParsingError";
  }
}
