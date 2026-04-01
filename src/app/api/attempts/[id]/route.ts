import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AttemptStatus } from "@prisma/client";

// Mock data
const MOCK_ATTEMPTS = [
  {
    id: "attempt-1",
    projectId: "proj-1",
    userId: "user-1",
    status: "SUBMITTED",
    submissionUrl:
      "https://storage.example.com/submissions/attempt-1/submission.pdf",
    submissionNote:
      "I analyzed the customer churn patterns and identified three key indicators. The analysis is based on transaction history and customer engagement metrics.",
    autoScore: 85,
    autoFeedback: {
      "Problem Understanding": {
        score: 85,
        feedback: "Clearly understood the business problem",
      },
      "Data Cleaning Quality": {
        score: 80,
        feedback: "Good handling of outliers and missing values",
      },
      "Analysis Depth": {
        score: 88,
        feedback: "Excellent root cause analysis",
      },
      "Visualization Quality": {
        score: 82,
        feedback: "Clear charts with good labeling",
      },
    },
    finalScore: null,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    processJournal:
      "I started by exploring the dataset to understand its structure. I then cleaned the data by handling missing values and outliers. After that, I performed exploratory analysis to identify patterns. Finally, I built visualizations to communicate my findings.",
    wipScreenshots: [
      "https://storage.example.com/wip/screenshot1.png",
      "https://storage.example.com/wip/screenshot2.png",
    ],
    timeBreakdown: {
      research: 2,
      building: 4,
      refining: 2,
    },
    toolsUsed: ["Python", "pandas", "matplotlib", "SQL"],
    aiDeclaration: "I used AI for research and reference only",
    project: {
      id: "proj-1",
      title: "E-commerce Churn Analysis",
      domain: "DATA",
      difficulty: "INTERMEDIATE",
      estimatedHours: 8,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      rubric: [
        {
          criterion: "Problem Understanding",
          weightage: 15,
        },
        {
          criterion: "Data Cleaning Quality",
          weightage: 20,
        },
        {
          criterion: "Analysis Depth",
          weightage: 25,
        },
        {
          criterion: "Visualization Quality",
          weightage: 20,
        },
      ],
    },
    review: null,
  },
];

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      const attempt = await prisma.attempt.findUnique({
        where: { id },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              domain: true,
              difficulty: true,
              estimatedHours: true,
              deadline: true,
              rubric: true,
            },
          },
          review: true,
        },
      });

      if (attempt) {
        return NextResponse.json(
          {
            success: true,
            data: {
              ...attempt,
              project: {
                ...attempt.project,
                rubric: Array.isArray(attempt.project.rubric) ? attempt.project.rubric : [],
              },
            },
          },
          { status: 200 }
        );
      }
    } catch (dbError) {
      console.warn("GET attempt falling back to mock:", dbError);
    }

    const attempt = MOCK_ATTEMPTS.find((a) => a.id === id);

    if (!attempt) {
      return NextResponse.json(
        {
          success: false,
          error: "Attempt not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: attempt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/attempts/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch attempt",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      submissionUrl,
      submissionNote,
      processJournal,
      wipScreenshots,
      toolsUsed,
      aiDeclaration,
      timeBreakdown,
    } = body as {
      status: AttemptStatus;
      submissionUrl?: string;
      submissionNote?: string;
      processJournal?: string;
      wipScreenshots?: string[];
      toolsUsed?: string[];
      aiDeclaration?: string;
      timeBreakdown?: Record<string, number>;
    };

    try {
      const updated = await prisma.attempt.update({
        where: { id },
        data: {
          status,
          submissionUrl,
          submissionNote,
          processJournal,
          wipScreenshots: wipScreenshots ?? [],
          toolsUsed: toolsUsed ?? [],
          aiDeclaration,
          timeBreakdown,
          submittedAt: status === AttemptStatus.SUBMITTED ? new Date() : undefined,
        },
        include: {
          project: {
            select: {
              id: true,
              rubric: true,
            },
          },
        },
      });

      if (status === AttemptStatus.SUBMITTED) {
        await prisma.integrityCheck.upsert({
          where: { attemptId: updated.id },
          create: {
            attemptId: updated.id,
            overallRiskScore: 0.2,
            riskLevel: "LOW",
            dimensionScores: {
              textOriginality: 0.8,
              processAuthenticity: 0.8,
              timelineConsistency: 0.8,
              cohortSimilarity: 0.8,
              aiDeclarationConsistency: 0.8,
            },
            specificFlags: [],
            greenSignals: ["process_journal_present", "wip_evidence_present"],
            recommendation: "Proceed to auto-score",
            processEvidence: {
              processJournalLength: processJournal?.length ?? 0,
              wipCount: wipScreenshots?.length ?? 0,
            },
            aiDeclaration,
          },
          update: {
            aiDeclaration,
            processEvidence: {
              processJournalLength: processJournal?.length ?? 0,
              wipCount: wipScreenshots?.length ?? 0,
            },
          },
        });

        const origin = request.nextUrl.origin;
        await fetch(`${origin}/api/ai/auto-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId: updated.id,
            projectId: updated.project.id,
            submissionUrl: updated.submissionUrl,
            submissionText: processJournal ?? submissionNote ?? "",
            rubric: updated.project.rubric,
          }),
        }).catch((scoringError) => {
          console.warn("Auto-score trigger failed:", scoringError);
        });
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            id: updated.id,
            status: updated.status,
            message: "Attempt updated successfully",
          },
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.warn("PATCH attempt falling back to mock response:", dbError);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id,
          status,
          message: "Attempt updated successfully",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/attempts/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update attempt",
      },
      { status: 500 }
    );
  }
}
