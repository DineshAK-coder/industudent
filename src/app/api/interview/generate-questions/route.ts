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

export async function POST(request: NextRequest) {
  try {
    const { attemptId, projectTitle, submissionSummary, riskFactors } =
      await request.json();

    if (!attemptId) {
      return NextResponse.json(
        { error: "Missing attemptId" },
        { status: 400 }
      );
    }

    // Fetch attempt details
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      select: {
        id: true,
        userId: true,
        projectId: true,
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      );
    }

    // Fetch project separately
    const project = await prisma.project.findUnique({
      where: { id: attempt.projectId },
      select: { title: true, description: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Generate interview questions using GPT-4o
    const systemPrompt = `You are an expert technical interviewer for project submissions. Generate 8-10 targeted interview questions to verify the authenticity of a project submission.

Risk factors to focus on: ${riskFactors?.join(", ") || "General verification"}

The questions should:
1. Be open-ended and require detailed technical knowledge to answer
2. Probe specific implementation decisions visible in the submission
3. Test understanding of the problem domain
4. Ask about debugging/troubleshooting moments
5. Verify depth of learning and understanding

Return a JSON object:
{
  "questions": [
    {
      "question": "specific question text",
      "category": "process" | "technical" | "decision" | "learning" | "challenge",
      "difficulty": "easy" | "medium" | "hard",
      "timeLimit": 90
    }
  ],
  "interviewStrategy": "brief explanation of approach",
  "estimatedDuration": 15
}`;

    const openaiClient = getOpenAI();
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Project: ${projectTitle || project.title}
Risk Indicators: ${riskFactors?.join(", ") || "Standard verification"}
Submission Summary: ${submissionSummary || "See attached submission"}

Generate verification interview questions to assess authenticity.`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate interview questions");
    }

    const generatedData = JSON.parse(content);

    // Create/update VerificationInterview record
    const interview = await prisma.verificationInterview.upsert({
      where: { attemptId },
      create: {
        attemptId,
        triggeredBy: "SYSTEM",
        status: "IN_PROGRESS",
        generatedQuestions: (generatedData.questions || []) as any,
        studentResponses: [] as any,
        interviewNotes: generatedData.interviewStrategy,
        estimatedDuration: generatedData.estimatedDuration || 15,
        scheduledDeadline: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
      },
      update: {
        generatedQuestions: (generatedData.questions || []) as any,
        interviewNotes: generatedData.interviewStrategy,
        estimatedDuration: generatedData.estimatedDuration || 15,
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        interviewId: interview.id,
        attemptId,
        projectTitle: project.title,
        questions: generatedData.questions || [],
        interviewStrategy: generatedData.interviewStrategy,
        estimatedDuration: generatedData.estimatedDuration,
        instructions: `You will be asked ${generatedData.questions?.length || 8} questions about your submission.
Answer each question thoroughly and honestly.
Consider providing video responses for a more authentic evaluation.
Time limit: ${generatedData.estimatedDuration || 15} minutes total.`,
      },
    });
  } catch (error) {
    console.error("POST /api/interview/generate-questions error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate interview questions",
      },
      { status: 500 }
    );
  }
}
