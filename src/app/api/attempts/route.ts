import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock data for attempts
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
    project: {
      id: "proj-1",
      title: "E-commerce Churn Analysis",
      domain: "DATA",
    },
    review: null,
  },
  {
    id: "attempt-2",
    projectId: "proj-2",
    userId: "user-1",
    status: "PAID",
    submissionUrl: null,
    submissionNote: null,
    autoScore: null,
    autoFeedback: null,
    finalScore: null,
    submittedAt: null,
    paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    project: {
      id: "proj-2",
      title: "Design a Mobile App Dashboard",
      domain: "DESIGN",
    },
    review: null,
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");

    try {
      const dbAttempts = await prisma.attempt.findMany({
        where: {
          ...(userId ? { userId } : {}),
          ...(projectId ? { projectId } : {}),
          ...(status ? { status: status as never } : {}),
        },
        include: {
          project: { select: { id: true, title: true, domain: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(
        {
          success: true,
          data: dbAttempts,
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.warn("GET /api/attempts falling back to mock:", dbError);
    }

    // Filter attempts
    let filtered = [...MOCK_ATTEMPTS];

    if (userId) {
      filtered = filtered.filter((a) => a.userId === userId);
    }

    if (projectId) {
      filtered = filtered.filter((a) => a.projectId === projectId);
    }

    if (status) {
      filtered = filtered.filter((a) => a.status === status);
    }

    return NextResponse.json(
      {
        success: true,
        data: filtered,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/attempts error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch attempts",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Verify user authentication
    const { projectId, userId } = await request.json();

    // TODO: Verify unique attempt (not already attempted)
    // TODO: Create Attempt record in DB
    // TODO: Return attempt ID

    return NextResponse.json(
      {
        success: false,
        error: "Attempt creation should happen via payment verification",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/attempts error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create attempt",
      },
      { status: 500 }
    );
  }
}
