import { NextRequest, NextResponse } from "next/server";

// Mock data from parent route - in production, import from DB
const MOCK_PROJECTS = [
  {
    id: "proj-1",
    companyId: "comp-1",
    title: "E-commerce Churn Analysis",
    domain: "DATA",
    difficulty: "INTERMEDIATE",
    description:
      "Analyze customer churn patterns in our e-commerce platform. Identify key indicators and provide actionable recommendations. You will have access to anonymized customer data spanning 2 years.",
    briefUrl: "https://example.com/briefs/churn.pdf",
    datasetUrl: "https://example.com/datasets/churn.csv",
    estimatedHours: 8,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxAttempts: 100,
    attemptFee: 29900,
    status: "ACTIVE",
    rubric: [
      {
        criterion: "Problem Understanding",
        weightage: 15,
        description: "Did they correctly interpret the ask?",
      },
      {
        criterion: "Data Cleaning Quality",
        weightage: 20,
        description: "Handled nulls, outliers, types correctly?",
      },
      {
        criterion: "Analysis Depth",
        weightage: 25,
        description: "Surface insights vs. root cause exploration",
      },
      {
        criterion: "Visualization Quality",
        weightage: 20,
        description: "Clear, accurate, well-labeled charts?",
      },
      {
        criterion: "Actionability of Insights",
        weightage: 20,
        description: "Can the business act on findings?",
      },
    ],
    tags: ["analytics", "python", "data-cleaning", "sql"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    company: {
      id: "comp-1",
      companyName: "TechCorp",
      logoUrl: null,
      verified: true,
      website: "https://techcorp.example.com",
    },
    attemptCount: 12,
    spotsRemaining: 88,
    submissions: [
      { rankNum: 1, studentName: "Student 1", score: 92, submittedAt: new Date() },
      { rankNum: 2, studentName: "Student 2", score: 88, submittedAt: new Date() },
      { rankNum: 3, studentName: "Student 3", score: 85, submittedAt: new Date() },
      { rankNum: 4, studentName: "Student 4", score: 82, submittedAt: new Date() },
      { rankNum: 5, studentName: "Student 5", score: 79, submittedAt: new Date() },
      { rankNum: 6, studentName: "Student 6", score: 76, submittedAt: new Date() },
      { rankNum: 7, studentName: "Student 7", score: 73, submittedAt: new Date() },
      { rankNum: 8, studentName: "Student 8", score: 70, submittedAt: new Date() },
      { rankNum: 9, studentName: "Student 9", score: 67, submittedAt: new Date() },
      { rankNum: 10, studentName: "Student 10", score: 64, submittedAt: new Date() },
    ],
    reviewer: {
      name: "Sarah Chen",
      role: "Lead Data Scientist",
      company: "Analytics Pro",
      rating: 4.9,
      totalReviews: 247,
      avatarUrl: null,
    },
  },
  {
    id: "proj-2",
    companyId: "comp-2",
    title: "Design a Mobile App Dashboard",
    domain: "DESIGN",
    difficulty: "INTERMEDIATE",
    description:
      "Redesign the mobile app dashboard for our project management tool. Focus on usability and modern aesthetics while maintaining mobile-first principles.",
    briefUrl: "https://example.com/briefs/dashboard.pdf",
    datasetUrl: null,
    estimatedHours: 12,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    maxAttempts: 100,
    attemptFee: 49900,
    status: "ACTIVE",
    rubric: [
      {
        criterion: "Problem Framing",
        weightage: 10,
        description: "Understood user pain point?",
      },
      {
        criterion: "User Flow Logic",
        weightage: 25,
        description: "Is the navigation intuitive?",
      },
      {
        criterion: "Visual Hierarchy",
        weightage: 20,
        description: "Clear reading order, emphasis on right elements?",
      },
      {
        criterion: "Component Consistency",
        weightage: 20,
        description: "Design system coherence?",
      },
      {
        criterion: "Accessibility Basics",
        weightage: 15,
        description: "Contrast ratios, tap target sizes?",
      },
      {
        criterion: "Innovation Factor",
        weightage: 10,
        description: "Something unexpected and delightful?",
      },
    ],
    tags: ["ui-design", "figma", "mobile", "ux"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    company: {
      id: "comp-2",
      companyName: "DesignStudio",
      logoUrl: null,
      verified: true,
      website: "https://designstudio.example.com",
    },
    attemptCount: 5,
    spotsRemaining: 95,
    submissions: [
      { rankNum: 1, studentName: "Designer A", score: 89, submittedAt: new Date() },
      { rankNum: 2, studentName: "Designer B", score: 85, submittedAt: new Date() },
      { rankNum: 3, studentName: "Designer C", score: 81, submittedAt: new Date() },
      { rankNum: 4, studentName: "Designer D", score: 78, submittedAt: new Date() },
      { rankNum: 5, studentName: "Designer E", score: 75, submittedAt: new Date() },
    ],
    reviewer: {
      name: "Mike Johnson",
      role: "Product Design Lead",
      company: "DesignStudio",
      rating: 4.8,
      totalReviews: 189,
      avatarUrl: null,
    },
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

    const project = MOCK_PROJECTS.find((p) => p.id === id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Verify company ownership
    // TODO: Validate request body
    // TODO: Update in database via Prisma

    return NextResponse.json(
      {
        success: false,
        error: "Project update coming in Phase 18",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
      },
      { status: 500 }
    );
  }
}
