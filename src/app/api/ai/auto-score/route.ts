import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AttemptStatus } from "@prisma/client";

// AI Auto-Scoring Pipeline - Phase 13
// Integrates with OpenAI GPT-4o to score submissions based on rubric
const globalRateLimitStore = globalThis as unknown as {
  aiRateLimit?: number[];
};

function withinRateLimit() {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 10;
  const existing = globalRateLimitStore.aiRateLimit ?? [];
  const filtered = existing.filter((stamp) => now - stamp < windowMs);
  if (filtered.length >= maxRequests) {
    globalRateLimitStore.aiRateLimit = filtered;
    return false;
  }
  filtered.push(now);
  globalRateLimitStore.aiRateLimit = filtered;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    if (!withinRateLimit()) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Max 10 auto-score requests/minute.",
        },
        { status: 429 }
      );
    }

    const { attemptId, projectId, submissionUrl, submissionText, rubric } = await request.json();

    // Validation
    if (!attemptId || !projectId || (!submissionUrl && !submissionText)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: attemptId, projectId, and submissionUrl or submissionText",
        },
        { status: 400 }
      );
    }

    // In production, would:
    // 1. Download submission from submissionUrl (Supabase Storage)
    // 2. Extract text content (PDF → text, ZIP → read files)
    // 3. Call OpenAI GPT-4o with rubric-based prompt

    // TODO: Implement actual OpenAI integration
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [{
    //     role: "system",
    //     content: `You are an expert evaluator for a project marketplace...`,
    //   }, {
    //     role: "user",
    //     content: `Rubric: ${JSON.stringify(rubric)}\n\nSubmission: ${submissionText}`,
    //   }],
    //   temperature: 0.5,
    // });

    // Mock GPT-4o response
    const mockScore = {
      criterionScores: [
        {
          criterion: "Problem Understanding",
          score: 85,
          justification: "Clearly understood the business problem and dataset context.",
          strength: "Excellent articulation of the research question",
          improvement: "Could explore alternative interpretations",
        },
        {
          criterion: "Data Cleaning Quality",
          score: 80,
          justification: "Good handling of missing values and outliers.",
          strength: "Documented the cleaning process clearly",
          improvement: "Consider impact of outlier removal on results",
        },
        {
          criterion: "Analysis Depth",
          score: 88,
          justification: "Excellent root cause analysis with multiple methodologies.",
          strength:
            "Explored both quantitative metrics and qualitative patterns",
          improvement: "Could validate findings with statistical tests",
        },
        {
          criterion: "Visualization Quality",
          score: 82,
          justification: "Clear, accurate charts with good labeling.",
          strength: "Effective use of color and scale",
          improvement: "Add more context in axis labels",
        },
      ],
      overallScore: 83.75,
      overallSummary:
        "Strong analysis with excellent depth and methodology. The submission demonstrates solid data science fundamentals with room for refinement in statistical rigor. Would benefit from more detailed documentation of assumptions.",
      topStrengths: [
        "Comprehensive exploratory data analysis",
        "Clear storytelling through visualizations",
        "Sound business recommendations",
      ],
      topImprovements: [
        "More rigorous statistical validation",
        "Clearer documentation of data limitations",
        "Deeper segmentation analysis",
      ],
      estimatedLevel: "Mid",
    };

    try {
      await prisma.attempt.update({
        where: { id: attemptId },
        data: {
          autoScore: mockScore.overallScore,
          autoFeedback: mockScore,
          status: AttemptStatus.UNDER_REVIEW,
        },
      });
    } catch (dbError) {
      console.warn("Auto-score persistence skipped:", dbError);
    }

    return NextResponse.json(
      {
        success: true,
        data: mockScore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/ai/auto-score error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to score submission",
      },
      { status: 500 }
    );
  }
}
