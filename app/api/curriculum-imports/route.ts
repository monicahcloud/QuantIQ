import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { inngest } from "@/lib/inngest/client";
import prisma from "@/lib/prisma";
import { createCurriculumImportSchema } from "@/lib/validations/curriculum-import";

export async function POST(request: Request) {
  let importRunId: string | null = null;

  try {
    await requireAdmin();

    const body: unknown = await request.json();
    const parsed = createCurriculumImportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid curriculum document.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const document = await prisma.curriculumDocument.findFirst({
      where: {
        id: parsed.data.curriculumDocumentId,
        status: "ACTIVE",
        curriculumVersion: {
          status: {
            not: "ARCHIVED",
          },
        },
      },
      select: {
        id: true,
        curriculumVersionId: true,
        curriculumPackageId: true,
        title: true,
        fileUrl: true,
        mimeType: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected curriculum document is unavailable.",
        },
        { status: 404 },
      );
    }

    const activeImport = await prisma.curriculumImportRun.findFirst({
      where: {
        curriculumDocumentId: document.id,
        status: {
          in: ["PENDING", "PROCESSING"],
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (activeImport) {
      return NextResponse.json(
        {
          success: false,
          message: "This document already has an import in progress.",
          importRunId: activeImport.id,
          status: activeImport.status,
        },
        { status: 409 },
      );
    }

    const importRun = await prisma.$transaction(async (transaction) => {
      const createdImportRun = await transaction.curriculumImportRun.create({
        data: {
          curriculumVersionId: document.curriculumVersionId,
          curriculumPackageId: document.curriculumPackageId,
          curriculumDocumentId: document.id,
          status: "PENDING",
          processedPages: 0,
        },
      });

      await transaction.curriculumExtraction.create({
        data: {
          importRunId: createdImportRun.id,

          // rawJson is required in your current Prisma model.
          // It will be replaced with Nova's structured result.
          rawJson: {},

          warnings: [],
          status: "PENDING",
        },
      });

      return createdImportRun;
    });

    importRunId = importRun.id;

    await inngest.send({
      name: "curriculum/import.requested",
      data: {
        importRunId: importRun.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Curriculum import started.",
        importRunId: importRun.id,
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Unable to start curriculum import:", error);

    if (importRunId) {
      await prisma.$transaction([
        prisma.curriculumImportRun.update({
          where: {
            id: importRunId,
          },
          data: {
            status: "FAILED",
            errorMessage: "The curriculum import event could not be started.",
            completedAt: new Date(),
          },
        }),

        prisma.curriculumExtraction.upsert({
          where: {
            importRunId,
          },
          create: {
            importRunId,
            rawJson: {},
            warnings: ["The curriculum import event could not be started."],
            status: "FAILED",
          },
          update: {
            status: "FAILED",
            warnings: ["The curriculum import event could not be started."],
          },
        }),
      ]);
    }

    return NextResponse.json(
      {
        success: false,
        message: "The curriculum import could not be started.",
      },
      { status: 500 },
    );
  }
}
