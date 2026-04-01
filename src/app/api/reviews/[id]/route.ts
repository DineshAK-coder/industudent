import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // TODO: Query Review from DB
    // const review = await prisma.review.findUnique({
    //   where: { id },
    //   include: { attempt: true, project: true, reviewer: true },
    // });

    // Mock response
    const mockReview = {
      id,
      attemptId: "attempt-1",
      projectId: "proj-1",
      reviewerId: "reviewer-1",
      scores: {
        "Problem Understanding": 85,
        "Data Cleaning": 80,
        "Analysis Depth": 88,
        "Visualization": 82,
      },
      overallScore: 84,
      writtenFeedback:
        "Excellent work on this analytics project. Your approach shows strong fundamentals...",
      strengthPoints: ["Clear analysis", "Good visualizations"],
      improvPoints: ["Add more statistical validation", "Expand on business implications"],
      hireRecommend: true,
      createdAt: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        data: mockReview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/reviews/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch review",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // Reviewers can only edit within 1 hour of submission
    // TODO: Validate review ownership and time window
    // TODO: Update Review record in DB

    return NextResponse.json(
      {
        success: true,
        data: { id, ...updates },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/reviews/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update review",
      },
      { status: 500 }
    );
  }
}
