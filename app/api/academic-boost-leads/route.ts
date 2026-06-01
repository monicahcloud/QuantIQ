import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const lead = await prisma.academicBoostLead.create({
      data: {
        parentName: body.parentName,
        parentEmail: body.parentEmail,
        parentPhone: body.parentPhone,
        preferredContact: body.preferredContact,

        studentName: body.studentName,
        studentAge: body.studentAge,
        gradeEntering: body.gradeEntering,
        currentSchool: body.currentSchool,

        programSelection: body.programSelection,
        academicConcerns: body.academicConcerns ?? [],
        academicNotes: body.academicNotes,
        parentGoals: body.parentGoals,
        medicalNotes: body.medicalNotes,

        emergencyContactName: body.emergencyContactName,
        emergencyContactPhone: body.emergencyContactPhone,

        consent: Boolean(body.consent),
        source: body.source || "Website Form",
        formResponses: body.formResponses || body,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead saved successfully",
      leadId: lead.id,
    });
  } catch (error) {
    console.error("Academic Boost lead error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save lead",
      },
      { status: 500 },
    );
  }
}
