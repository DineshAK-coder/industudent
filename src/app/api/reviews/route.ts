import { NextRequest, NextResponse } from "next/server";

// Get all reviews for a reviewer or submit a new review
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reviewerId = searchParams.get("reviewerId");
    const status = searchParams.get("status"); // PENDING, COMPLETED

    // TODO: Query from Prisma
    // const reviews = await prisma.review.findMany({
    //   where: {
    //     reviewerId,
    //     ...(status && { attempt: { status } }),
    //   },
    //   include: { attempt: true, project: true },
    // });

    // Mock data
    const mockReviews = [
      {
        id: "review-1",
        attemptId: "attempt-1",
        reviewerId: "reviewer-1",
        status: "PENDING",
        project: { id: "proj-1", title: "E-commerce Churn Analysis" },
        attempt: {
          id: "attempt-1",
          submissionUrl: "https://storage.example.com/submission.pdf",
          autoScore: 85,
        },
        student: { name: "John Doe" },
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: mockReviews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      attemptId,
      reviewerId,
      projectId,
      scores,
      overallScore,
      writtenFeedback,
      strengthPoints,
      improvPoints,
      hireRecommend,
      videoFeedbackUrl,
    } = await request.json();

    // Validation
    if (!attemptId || !reviewerId || !projectId || !overallScore || !writtenFeedback) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required review fields",
        },
        { status: 400 }
      );
    }

    // Word count validation
    if (writtenFeedback.split(/\s+/).length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Written feedback must be at least 100 words",
        },
        { status: 400 }
      );
    }

    // TODO: Create Review record in DB
    // const review = await prisma.review.create({
    //   data: {
    //     attemptId,
    //     reviewerId,
    //     projectId,
    //     scores,
    //     overallScore,
    //     writtenFeedback,
    //     strengthPoints,
    //     improvPoints,
    //     hireRecommend,
    //     videoFeedbackUrl,
    //   },
    // });

    // TODO: Update Attempt status to REVIEWED
    // TODO: Determine badge award based on IntegrityCheck + score
    // TODO: Send REVIEW_READY email to student
    // TODO: Update ReviewerProfile earnings

    return NextResponse.json(
      {
        success: true,
        data: {
          reviewId: `review_${Date.now()}`,
          payout: Math.floor(Math.random() * 500) + 200,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit review",
      },
      { status: 500 }
    );
  }
}
