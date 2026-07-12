"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { inngest } from "@/lib/inngest/client";
import prisma from "@/lib/prisma";

const analyzeDocumentSchema = z.object({
  curriculumDocumentId: z.string().trim().min(1),
  curriculumVersionId: z.string().trim().min(1),
});

export async function analyzeCurriculumDocument(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const { userId } = await auth();

  const parsed = analyzeDocumentSchema.safeParse({
    curriculumDocumentId: formData.get("curriculumDocumentId"),
    curriculumVersionId: formData.get("curriculumVersionId"),
  });

  if (!parsed.success) {
    throw new Error("A valid curriculum document and version are required.");
  }

  const document = await prisma.curriculumDocument.findFirst({
    where: {
      id: parsed.data.curriculumDocumentId,
      curriculumVersionId: parsed.data.curriculumVersionId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      curriculumVersionId: true,
      curriculumPackageId: true,
    },
  });

  if (!document) {
    throw new Error("The selected curriculum document is unavailable.");
  }

  const existingRun = await prisma.curriculumImportRun.findFirst({
    where: {
      curriculumDocumentId: document.id,
      status: {
        in: ["PENDING", "PROCESSING"],
      },
    },
    select: {
      id: true,
    },
  });

  if (existingRun) {
    throw new Error("This document already has an active Nova analysis.");
  }

  const importRun = await prisma.curriculumImportRun.create({
    data: {
      curriculumVersionId: document.curriculumVersionId,
      curriculumPackageId: document.curriculumPackageId,
      curriculumDocumentId: document.id,

      initiatedByClerkUserId: userId ?? null,

      status: "PENDING",
      extractionProvider: "OPENAI",
      extractionModel: "gpt-5.6",
      processedPages: 0,
    },
  });

  try {
    await inngest.send({
      name: "curriculum/import.requested",
      data: {
        importRunId: importRun.id,
      },
    });
  } catch (error) {
    await prisma.curriculumImportRun.update({
      where: {
        id: importRun.id,
      },
      data: {
        status: "FAILED",
        errorMessage: "The background analysis job could not be queued.",
        completedAt: new Date(),
      },
    });

    throw error;
  }

  revalidatePath(
    `/admin/curriculum-engine/versions/${document.curriculumVersionId}/documents`,
  );

  revalidatePath(
    `/admin/curriculum-engine/versions/${document.curriculumVersionId}/imports`,
  );
}
