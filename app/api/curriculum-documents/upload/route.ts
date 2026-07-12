import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { curriculumDocumentMetadataSchema } from "@/lib/validations/curriculum-document";

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
]);

const maxFileSize = 50 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Please select a file." },
        { status: 400 },
      );
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF, DOCX, XLSX, and CSV files are supported.",
        },
        { status: 400 },
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          success: false,
          message: "The file must not exceed 50 MB.",
        },
        { status: 400 },
      );
    }

    const parsed = curriculumDocumentMetadataSchema.safeParse({
      curriculumVersionId: formData.get("curriculumVersionId"),
      curriculumPackageId: formData.get("curriculumPackageId") || undefined,
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      documentType: formData.get("documentType"),
      issuedDate: formData.get("issuedDate"),
      effectiveDate: formData.get("effectiveDate"),
      expirationDate: formData.get("expirationDate"),
      isPrimarySource: formData.get("isPrimarySource") === "true",
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the document information.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const version = await prisma.curriculumVersion.findFirst({
      where: {
        id: parsed.data.curriculumVersionId,
        status: {
          not: "ARCHIVED",
        },
      },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!version) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected curriculum version is unavailable.",
        },
        { status: 404 },
      );
    }

    if (parsed.data.curriculumPackageId) {
      const curriculumPackage = await prisma.curriculumPackage.findFirst({
        where: {
          id: parsed.data.curriculumPackageId,
          curriculumFramework: {
            curriculumVersionId: version.id,
          },
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      });

      if (!curriculumPackage) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The selected curriculum package does not belong to this version.",
          },
          { status: 400 },
        );
      }
    }

    const safeFileName = sanitizeFileName(file.name);

    const pathname = [
      "curriculum",
      version.slug,
      `${Date.now()}-${safeFileName}`,
    ].join("/");

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    const document = await prisma.$transaction(async (transaction) => {
      if (parsed.data.isPrimarySource) {
        await transaction.curriculumDocument.updateMany({
          where: {
            curriculumVersionId: version.id,
            isPrimarySource: true,
            status: "ACTIVE",
          },
          data: {
            isPrimarySource: false,
          },
        });
      }

      return transaction.curriculumDocument.create({
        data: {
          curriculumVersionId: version.id,
          curriculumPackageId: parsed.data.curriculumPackageId ?? null,

          title: parsed.data.title,
          description: parsed.data.description ?? null,
          documentType: parsed.data.documentType,

          originalFileName: file.name,
          storedFileName: blob.pathname.split("/").at(-1) ?? null,
          fileUrl: blob.url,
          storageKey: blob.pathname,

          mimeType: file.type,
          sizeBytes: file.size,

          issuedDate: parsed.data.issuedDate,
          effectiveDate: parsed.data.effectiveDate,
          expirationDate: parsed.data.expirationDate,

          isPrimarySource: parsed.data.isPrimarySource,
          status: "ACTIVE",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Curriculum document uploaded successfully.",
      documentId: document.id,
    });
  } catch (error) {
    console.error("Unable to upload curriculum document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "The curriculum document could not be uploaded.",
      },
      { status: 500 },
    );
  }
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
}
