export type NovaUsageRecord = {
  provider: string;
  model: string;
  operation: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCostUsd?: number;
  success: boolean;
};

export async function recordNovaUsage(usage: NovaUsageRecord): Promise<void> {
  console.info("[Nova Usage]", usage);

  // Later:
  // await prisma.aIGenerationRun.create(...)
  // Send to Sentry, PostHog, Datadog, or another analytics service.
}
