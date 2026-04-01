import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validations";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  try {
    // Check if user already has a profile
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        studentProfile: { select: { id: true } },
        companyProfile: { select: { id: true } },
        reviewerProfile: { select: { id: true } },
      },
    });

    const hasProfile =
      existing?.studentProfile ||
      existing?.companyProfile ||
      existing?.reviewerProfile;

    if (hasProfile) {
      return NextResponse.json(
        { success: false, error: "Profile already exists" },
        { status: 409 }
      );
    }

    // Create the appropriate profile and update the user's role
    if (data.role === "STUDENT") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { role: Role.STUDENT },
        }),
        prisma.studentProfile.create({
          data: {
            userId,
            college: data.college,
            graduationYear: data.graduationYear,
            domains: data.domains,
            bio: data.bio ?? null,
            linkedinUrl: data.linkedinUrl || null,
          },
        }),
      ]);
    } else if (data.role === "COMPANY") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { role: Role.COMPANY },
        }),
        prisma.companyProfile.create({
          data: {
            userId,
            companyName: data.companyName,
            industry: data.industry,
            size: data.size,
            website: data.website || null,
          },
        }),
      ]);
    } else if (data.role === "REVIEWER") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { role: Role.REVIEWER },
        }),
        prisma.reviewerProfile.create({
          data: {
            userId,
            domains: data.domains,
            yearsExp: data.yearsExp,
            currentRole: data.currentRole,
            ratePerReview: data.ratePerReview,
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[onboarding] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
