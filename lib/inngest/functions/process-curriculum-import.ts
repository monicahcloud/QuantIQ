import type { CurriculumExtraction } from "@/lib/nova/schemas/curriculum-extraction";

import { inngest } from "@/lib/inngest/client";

type CurriculumNode =
  CurriculumExtraction["frameworks"][number]["packages"][number]["nodes"][number];

export const processCurriculumImport = inngest.createFunction(
  {
    id: "process-curriculum-import",
    name: "Process Curriculum Import",
    triggers: {
      event: "curriculum/import.requested",
    },
    retries: 3,
  },
  async ({ event, step }) => {
    const { importRunId } = event.data;

    await step.run("log-import-request", async () => {
      console.log("Processing curriculum import:", importRunId);
    });

    return {
      success: true,
      importRunId,
    };
  },
);

export function flattenNodes(nodes: CurriculumNode[]): CurriculumNode[] {
  return nodes.flatMap((node) => [node, ...flattenNodes(node.children)]);
}
