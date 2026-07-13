import { inngest } from "@/lib/inngest/client";
import prisma from "@/lib/prisma";

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
    const importRunId = event.data.importRunId as string;

    const importRun = await step.run("load-import-run", async () => {
      return prisma.curriculumImportRun.findUnique({
        where: {
          id: importRunId,
        },
        include: {
          curriculumDocument: true,
          curriculumVersion: {
            include: {
              country: true,
            },
          },
          extraction: true,
        },
      });
    });

    if (!importRun) {
      throw new Error(`Curriculum import run ${importRunId} was not found.`);
    }

    await step.run("mark-import-processing", async () => {
      await prisma.$transaction([
        prisma.curriculumImportRun.update({
          where: {
            id: importRun.id,
          },
          data: {
            status: "PROCESSING",
            startedAt: new Date(),
            completedAt: null,
            errorMessage: null,
          },
        }),

        prisma.curriculumExtraction.upsert({
          where: {
            importRunId: importRun.id,
          },
          create: {
            importRunId: importRun.id,
            rawJson: {},
            warnings: [],
            status: "PENDING",
          },
          update: {
            status: "PENDING",
          },
        }),
      ]);
    });

    await step.run("confirm-import-pipeline", async () => {
      console.info("[Curriculum Import]", {
        importRunId: importRun.id,
        documentId: importRun.curriculumDocument.id,
        documentTitle: importRun.curriculumDocument.title,
        fileUrl: importRun.curriculumDocument.fileUrl,
        version: importRun.curriculumVersion.name,
        country: importRun.curriculumVersion.country.name,
      });
    });

    await step.run("mark-import-review-required", async () => {
      await prisma.$transaction([
        prisma.curriculumImportRun.update({
          where: {
            id: importRun.id,
          },
          data: {
            status: "REVIEW_REQUIRED",
            importSummary: {
              pipelineConnected: true,
              message:
                "The import pipeline is connected. Nova parsing is the next step.",
            },
            completedAt: new Date(),
          },
        }),

        prisma.curriculumExtraction.upsert({
          where: {
            importRunId: importRun.id,
          },
          create: {
            importRunId: importRun.id,
            status: "REVIEW_REQUIRED",
            rawJson: {
              pipelineConnected: true,
              documentTitle: importRun.curriculumDocument.title,
            },
            warnings: ["Nova parsing has not been enabled for this test run."],
          },
          update: {
            status: "REVIEW_REQUIRED",
            rawJson: {
              pipelineConnected: true,
              documentTitle: importRun.curriculumDocument.title,
            },
            warnings: ["Nova parsing has not been enabled for this test run."],
          },
        }),
      ]);
    });

    return {
      success: true,
      importRunId: importRun.id,
    };
  },
);
