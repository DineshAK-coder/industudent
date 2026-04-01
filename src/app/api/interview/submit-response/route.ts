import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lazy initialize OpenAI only when needed
let openai: any = null;

function getOpenAI() {
  if (!openai) {
    const OpenAI = require("openai").default;
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

interface InterviewResponse {
  questionId: number;
  questionText: string;
  studentResponse: string;
  videoUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { attemptId, responses, videoUrl } = await request.json();

    if (!attemptId || !responses || responses.length === 0) {
      return NextResponse.json(
        {
          error: "Missing required fields: attemptId, responses",
        },
        { status: 400 }
      );
    }

    // Fetch interview and attempt
    const interview = await prisma.verificationInterview.findUnique({
      where: { attemptId },
    });

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      select: { projectId: true },
    });

    if (!interview || !attempt) {
      return NextResponse.json(
        { error: "Interview or attempt not found" },
        { status: 404 }
      );
    }

    // Fetch project title
    const project = await prisma.project.findUnique({
      where: { id: attempt.projectId },
      select: { title: true },
    });

    // Analyze responses for authenticity
    const analysisPrompt = `You are an expert technical interviewer analyzing student responses to verification interview questions.

Evaluate the responses for:
1. Technical depth and accuracy
2. Evidence of real implementation experience
3. Authentic voice and language patterns
4. Problem-solving approach evidence
5. Consistency with submission quality level

Questions and responses:
${responses
  .map(
    (r: InterviewResponse, idx: number) =>
      `Q${idx + 1}: ${r.questionText}
A: ${r.studentResponse}`
  )
  .join("\n\n")}

Respond with JSON:
{
  "authenticityScore": 0-100,
  "technicalDepth": 0-100,
  "consistencyWithSubmission": 0-100,
  "redFlags": ["list of concerns if any"],
  "strengths": ["list of strong points"],
  "overallAssessment": "AUTHENTIC" | "QUESTIONABLE" | "SUSPICIOUS",
  "recommendedAction": "APPROVE" | "REQUIRE_MORE_INFO" | "INVESTIGATE",
  "reasoning": "detailed explanation"
}`;

    const openaiClient = getOpenAI();
    
    const analysisResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: analysisPrompt,
        },
        {
          role: "user",
          content: `Project: ${project?.title || "Unknown"}
Analyze these interview responses for authenticity.`,
        },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const analysisContent = analysisResponse.choices[0].message.content;
    if (!analysisContent) {
      throw new Error("Failed to analyze responses");
    }

    const analysis = JSON.parse(analysisContent);

    // Update interview record
    const updatedInterview = await prisma.verificationInterview.update({
      where: { attemptId },
      data: {
        studentResponses: responses as any,
        videoUrl: videoUrl || null,
        completedAt: new Date(),
        status: "COMPLETED",
        analysisResults: analysis as any,
        interviewScore: analysis.authenticityScore,
        outcome: analysis.overallAssessment,
      },
    });

    // Update attempt status based on analysis
    let newStatus: "REVIEWED" | "FLAGGED" =
      "REVIEWED";
    if (analysis.authenticityScore < 40) {
      newStatus = "FLAGGED";
    }

    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        status: newStatus,
      },
    });

    // Update integrity check with interview results
    await prisma.integrityCheck.update({
      where: { attemptId },
      data: {
        flagged: analysis.authenticityScore < 40,
        analysisResults: {
          interviewResults: analysis,
        } as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        interviewId: updatedInterview.id,
        attemptId,
        analysis,
        authenticityScore: analysis.authenticityScore,
        verdict: analysis.overallAssessment,
        recommendedAction: analysis.recommendedAction,
        completedAt: updatedInterview.completedAt,
      },
    });
  } catch (error) {
    console.error("POST /api/interview/submit-response error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit interview response",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get("attemptId");

    if (!attemptId) {
      return NextResponse.json(
        { error: "Missing attemptId" },
        { status: 400 }
      );
    }

    const interview = await prisma.verificationInterview.findUnique({
      where: { attemptId },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error("GET /api/interview/submit-response error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve interview" },
      { status: 500 }
    );
  }
}
