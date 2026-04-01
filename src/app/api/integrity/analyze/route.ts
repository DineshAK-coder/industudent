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

// ============================================================================
// LAYER 1: Automated Signal Analysis
// ============================================================================

interface SignalAnalysisResult {
  riskScore: number; // 0-100
  flags: {
    codeStyleUniformity: { flagged: boolean; reason: string };
    commitPatterns: { flagged: boolean; reason: string };
    deadCode: { flagged: boolean; reason: string };
    skillGap: { flagged: boolean; reason: string };
    perfectDocumentation: { flagged: boolean; reason: string };
  };
}

function analyzeSignals(submission: any): SignalAnalysisResult {
  const flags = {
    codeStyleUniformity: {
      flagged: false,
      reason: "Code style is consistent throughout",
    },
    commitPatterns: {
      flagged: false,
      reason: "Commit history shows organic development",
    },
    deadCode: {
      flagged: false,
      reason: "No significant dead or commented code detected",
    },
    skillGap: {
      flagged: false,
      reason: "Skill level matches submission complexity",
    },
    perfectDocumentation: {
      flagged: false,
      reason: "Documentation is clear but not suspiciously perfect",
    },
  };

  let riskScore = 15; // Base risk

  // Signal 1: Unusually uniform code style (possible AI indicator)
  const codeStyleScore = submission.codeStyleScore || 0.7;
  if (codeStyleScore > 0.9) {
    flags.codeStyleUniformity = {
      flagged: true,
      reason: `Code style uniformity extremely high (${(codeStyleScore * 100).toFixed(1)}% - possible AI generation indicator)`,
    };
    riskScore += 20;
  }

  // Signal 2: Perfect documentation structure
  const docScore = submission.documentationScore || 0.6;
  if (docScore > 0.95) {
    flags.perfectDocumentation = {
      flagged: true,
      reason: "Documentation structure suspiciously perfect (likely AI-generated)",
    };
    riskScore += 15;
  }

  // Signal 3: Skill complexity mismatch
  const skillGapScore = submission.skillGapScore || 0.5;
  if (skillGapScore > 0.85) {
    flags.skillGap = {
      flagged: true,
      reason: `Submission complexity (${skillGapScore.toFixed(2)}) significantly exceeds student's historical output patterns`,
    };
    riskScore += 25;
  }

  // Signal 4: Commit pattern analysis (if provided)
  const commits = submission.commits || [];
  if (commits.length > 0) {
    const commitMessages = commits.map((c: any) => c.message || "");
    const uniqueMessages = new Set(commitMessages);
    const repetitionRate = 1 - uniqueMessages.size / commits.length;

    if (repetitionRate > 0.7) {
      flags.commitPatterns = {
        flagged: true,
        reason: "Commit messages show high repetition pattern (suspicious consistency)",
      };
      riskScore += 12;
    }
  }

  // Signal 5: Dead code and commented sections
  const commentLineRatio = submission.commentedLineRatio || 0.05;
  if (commentLineRatio > 0.3) {
    flags.deadCode = {
      flagged: true,
      reason: `High ratio of commented code (${(commentLineRatio * 100).toFixed(1)}%) - may indicate copy-paste or auto-generation`,
    };
    riskScore += 10;
  }

  return {
    riskScore: Math.min(100, riskScore),
    flags,
  };
}

// ============================================================================
// LAYER 2: AI Vibe Check (GPT-4o Based)
// ============================================================================

interface AIVibeCheckResult {
  naturalLanguageScore: number;
  insightOriginality: number;
  effortEvidence: number;
  authenticityScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reasoning: string;
}

async function performAIVibeCheck(
  submissionText: string
): Promise<AIVibeCheckResult> {
  try {
    const openaiClient = getOpenAI();
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI detection expert. Analyze the submission for signs of AI generation vs. human authenticity.

Respond with JSON: {
  "naturalLanguageScore": 0-100,
  "insightOriginality": 0-100,
  "effortEvidence": 0-100,
  "authenticityScore": 0-100,
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "reasoning": "explanation"
}`,
        },
        {
          role: "user",
          content: `Please analyze this submission for authenticity:\n\n${submissionText.substring(0, 3000)}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return {
        naturalLanguageScore: 50,
        insightOriginality: 50,
        effortEvidence: 50,
        authenticityScore: 50,
        riskLevel: "MEDIUM",
        reasoning: "Unable to analyze",
      };
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("AI vibe check error:", error);
    return {
      naturalLanguageScore: 50,
      insightOriginality: 50,
      effortEvidence: 50,
      authenticityScore: 50,
      riskLevel: "MEDIUM",
      reasoning: "Analysis failed",
    };
  }
}

// ============================================================================
// LAYER 3: Cohort Similarity Analysis (Simplified)
// ============================================================================

interface CohortAnalysisResult {
  similarSubmissions: Array<{ attemptId: string; similarity: number }>;
  suspiciousClusters: number;
  recommendation: string;
}

async function performCohortAnalysis(
  projectId: string
): Promise<CohortAnalysisResult> {
  // Simplified: Just flag if multiple high-scoring submissions recently
  try {
    const recentAttempts = await prisma.attempt.findMany({
      where: {
        projectId,
        autoScore: { gte: 85 },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { id: true, autoScore: true },
      take: 20,
    });

    const suspiciousCount = recentAttempts.length;
    const clusters = suspiciousCount > 5 ? 1 : 0;

    return {
      similarSubmissions: recentAttempts.map((a: { id: string; autoScore: number | null }) => ({
        attemptId: a.id,
        similarity: 0.85,
      })),
      suspiciousClusters: clusters,
      recommendation:
        suspiciousCount > 5
          ? "FLAG: Multiple similar high-scoring submissions detected"
          : "No suspicious similarity patterns",
    };
  } catch (error) {
    console.error("Cohort analysis error:", error);
    return {
      similarSubmissions: [],
      suspiciousClusters: 0,
      recommendation: "Analysis unavailable",
    };
  }
}

// ============================================================================
// LAYER 4: Process Evidence Validation
// ============================================================================

interface ProcessEvidenceResult {
  journalValid: boolean;
  screenshotsValid: boolean;
  timeBreakdownValid: boolean;
  toolsDeclared: boolean;
  aiDeclarationPresent: boolean;
  issues: string[];
  completenessScore: number;
}

function validateProcessEvidence(submission: any): ProcessEvidenceResult {
  const issues: string[] = [];
  let completenessScore = 100;

  // Journal validation
  const journalLength = submission.processJournal?.length || 0;
  const journalValid =
    journalLength >= 150 && journalLength <= 50000;
  if (!journalValid) {
    issues.push(
      `Process journal invalid (chars: ${journalLength}, require 150-50000)`
    );
    completenessScore -= 25;
  }

  // Screenshots validation
  const screenshotsCount = submission.wipScreenshots?.length || 0;
  const screenshotsValid = screenshotsCount >= 1 && screenshotsCount <= 50;
  if (!screenshotsValid) {
    issues.push(
      `WIP screenshots count invalid (${screenshotsCount} provided, require 1-50)`
    );
    completenessScore -= 20;
  }

  // Time breakdown validation
  const timeBreakdown = submission.timeBreakdown || {};
  const totalTime =
    (timeBreakdown.planning || 0) +
    (timeBreakdown.execution || 0) +
    (timeBreakdown.testing || 0) +
    (timeBreakdown.documentation || 0) ||
    0;
  const timeBreakdownValid = totalTime > 0 && totalTime <= 500;
  if (!timeBreakdownValid) {
    issues.push(
      `Time breakdown invalid (total: ${totalTime}h, valid range: 0-500h)`
    );
    completenessScore -= 20;
  }

  // Tools validation
  const toolsCount = submission.toolsUsed?.length || 0;
  const toolsDeclared = toolsCount > 0;
  if (!toolsDeclared) {
    issues.push("No tools declared");
    completenessScore -= 15;
  }

  // AI declaration validation
  const aiDeclarationPresent = submission.aiDeclaration !== null;
  if (!aiDeclarationPresent) {
    issues.push("AI usage declaration missing");
    completenessScore -= 25;
  }

  return {
    journalValid,
    screenshotsValid,
    timeBreakdownValid,
    toolsDeclared,
    aiDeclarationPresent,
    issues,
    completenessScore: Math.max(0, completenessScore),
  };
}

// ============================================================================
// MAIN INTEGRITY ANALYSIS ENDPOINT
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attemptId, submissionData, projectId, autoScore } = body;

    if (!attemptId || !submissionData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ========== LAYER 1: Signal Analysis ==========
    const layer1Result = analyzeSignals(submissionData);

    // ========== LAYER 2: AI Vibe Check ==========
    const layer2Result = await performAIVibeCheck(
      submissionData.submissionText || ""
    );

    // ========== LAYER 3: Cohort Similarity ==========
    const layer3Result = await performCohortAnalysis(projectId);

    // ========== LAYER 4: Process Evidence ==========
    const layer4Result = validateProcessEvidence(submissionData);

    // ========== Overall Risk Calculation ==========
    const riskScores = [
      { score: layer1Result.riskScore, weight: 0.25 },
      {
        score:
          layer2Result.riskLevel === "CRITICAL"
            ? 95
            : layer2Result.riskLevel === "HIGH"
              ? 70
              : layer2Result.riskLevel === "MEDIUM"
                ? 45
                : 20,
        weight: 0.3,
      },
      { score: layer3Result.suspiciousClusters * 40, weight: 0.15 },
      { score: 100 - layer4Result.completenessScore, weight: 0.2 },
    ];

    const overallRiskScore = riskScores.reduce(
      (sum, r) => sum + r.score * r.weight,
      0
    );

    // Determine integrity action
    let integrityAction = "PASS";
    let flagged = false;
    let riskLevel = "LOW";

    if (overallRiskScore > 70) {
      integrityAction = "REQUIRE_INTERVIEW";
      flagged = true;
      riskLevel = "CRITICAL";
    } else if (overallRiskScore > 40) {
      integrityAction = "EXTRA_SCRUTINY";
      flagged = true;
      riskLevel = "HIGH";
    }

    // ========== Store Results ==========

    // Update or create IntegrityCheck
    const integrityCheck = await prisma.integrityCheck.upsert({
      where: { attemptId },
      create: {
        attemptId,
        flagged,
        riskLevel,
        analysisResults: {
          layer1: layer1Result,
          layer2: layer2Result,
          layer3: layer3Result,
          layer4: layer4Result,
          overallRiskScore: Math.round(overallRiskScore),
          integrityAction,
          timestamp: new Date().toISOString(),
        } as any,
      },
      update: {
        flagged,
        riskLevel,
        analysisResults: {
          layer1: layer1Result,
          layer2: layer2Result,
          layer3: layer3Result,
          layer4: layer4Result,
          overallRiskScore: Math.round(overallRiskScore),
          integrityAction,
          timestamp: new Date().toISOString(),
        } as any,
      },
    });

    // Create VerificationInterview if required
    if (integrityAction === "REQUIRE_INTERVIEW") {
      await prisma.verificationInterview.upsert({
        where: { attemptId },
        create: {
          attemptId,
          triggeredBy: "SYSTEM",
          status: "PENDING",
          generatedQuestions: [],
          studentResponses: [],
          scheduledDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        update: {
          status: "PENDING",
          scheduledDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Update attempt status
      await prisma.attempt.update({
        where: { id: attemptId },
        data: {
          status: "FLAGGED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        attemptId,
        integrityCheckId: integrityCheck.id,
        layer1: layer1Result,
        layer2: layer2Result,
        layer3: layer3Result,
        layer4: layer4Result,
        overallRiskScore: Math.round(overallRiskScore),
        integrityAction,
        flagged,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("POST /api/integrity/analyze error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Integrity analysis failed",
      },
      { status: 500 }
    );
  }
}
