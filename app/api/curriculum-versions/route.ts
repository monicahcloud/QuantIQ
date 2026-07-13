import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";

type CreateCurriculumVersionBody = {
  countryId?: string;
  name?: string;
  code?: string;
  versionLabel?: string;
  languageCode?: string;
  description?: string;
  notes?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  scope?: string;
  status?: string;
  isCurrent?: boolean;
};

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = (await request.json()) as CreateCurriculumVersionBody;

    const countryId = body.countryId?.trim();
    const name = body.name?.trim();
    const code = body.code?.trim().toUpperCase();

    if (!countryId || !name || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Country, name, and code are required.",
        },
        { status: 400 },
      );
    }

    const country = await prisma.country.findFirst({
      where: {
        id: countryId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!country) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected country is unavailable.",
        },
        { status: 404 },
      );
    }

    const slug = createSlug(`${name}-${body.versionLabel || code}`);

    const existingVersion = await prisma.curriculumVersion.findFirst({
      where: {
        countryId,
        OR: [
          {
            code,
          },
          {
            slug,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (existingVersion) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A curriculum version with this code or name already exists.",
        },
        { status: 409 },
      );
    }

    const version = await prisma.$transaction(async (transaction) => {
      if (body.isCurrent) {
        await transaction.curriculumVersion.updateMany({
          where: {
            countryId,
            isCurrent: true,
          },
          data: {
            isCurrent: false,
          },
        });
      }

      return transaction.curriculumVersion.create({
        data: {
          countryId,
          name,
          code,
          slug,
          versionLabel: normalizeOptional(body.versionLabel),
          languageCode: body.languageCode?.trim() || "en",
          description: normalizeOptional(body.description),
          notes: normalizeOptional(body.notes),
          effectiveFrom: parseOptionalDate(body.effectiveFrom),
          effectiveTo: parseOptionalDate(body.effectiveTo),
          scope: parseScope(body.scope),
          status: parseStatus(body.status),
          isCurrent: body.isCurrent === true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Curriculum version created successfully.",
        versionId: version.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to create curriculum version:", error);

    return NextResponse.json(
      {
        success: false,
        message: "The curriculum version could not be created.",
      },
      { status: 500 },
    );
  }
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeOptional(value?: string) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function parseOptionalDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function parseScope(value?: string) {
  const allowed = [
    "COUNTRY",
    "ADMINISTRATIVE_DIVISION",
    "AUTHORITY",
    "ORGANIZATION",
    "SCHOOL",
  ] as const;

  return allowed.includes(value as (typeof allowed)[number])
    ? (value as (typeof allowed)[number])
    : "COUNTRY";
}

function parseStatus(value?: string) {
  const allowed = ["DRAFT", "UNDER_REVIEW", "APPROVED", "PUBLISHED"] as const;

  return allowed.includes(value as (typeof allowed)[number])
    ? (value as (typeof allowed)[number])
    : "DRAFT";
}
