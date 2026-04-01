import { NextRequest, NextResponse } from "next/server";
import { Domain, Difficulty } from "@/types";

// Mock data - replace with Prisma queries later
const MOCK_PROJECTS = [
  {
    id: "proj-1",
    companyId: "comp-1",
    title: "E-commerce Churn Analysis",
    domain: "DATA" as Domain,
    difficulty: "INTERMEDIATE" as Difficulty,
    description:
      "Analyze customer churn patterns in our e-commerce platform. Identify key indicators and provide actionable recommendations.",
    briefUrl: "https://example.com/briefs/churn.pdf",
    datasetUrl: "https://example.com/datasets/churn.csv",
    estimatedHours: 8,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxAttempts: 100,
    attemptFee: 29900, // ₹299
    status: "ACTIVE" as const,
    rubric: [
      {
        criterion: "Data Cleaning Quality",
        weightage: 20,
        description: "Handled nulls, outliers, types correctly?",
      },
      {
        criterion: "Analysis Depth",
        weightage: 25,
        description: "Surface insights vs root cause exploration",
      },
      {
        criterion: "Visualization Quality",
        weightage: 20,
        description: "Clear, accurate, well-labeled charts?",
      },
    ],
    tags: ["analytics", "python", "data-cleaning"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    company: {
      companyName: "TechCorp",
      logoUrl: null,
    },
    attemptCount: 12,
    spotsRemaining: 88,
  },
  {
    id: "proj-2",
    companyId: "comp-2",
    title: "Design a Mobile App Dashboard",
    domain: "DESIGN" as Domain,
    difficulty: "INTERMEDIATE" as Difficulty,
    description:
      "Redesign the mobile app dashboard for our project management tool. Focus on usability and modern aesthetics.",
    briefUrl: "https://example.com/briefs/dashboard.pdf",
    datasetUrl: null,
    estimatedHours: 12,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    maxAttempts: 100,
    attemptFee: 49900, // ₹499
    status: "ACTIVE" as const,
    rubric: [
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
    ],
    tags: ["ui-design", "figma", "mobile"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    company: {
      companyName: "DesignStudio",
      logoUrl: null,
    },
    attemptCount: 5,
    spotsRemaining: 95,
  },
  {
    id: "proj-3",
    companyId: "comp-3",
    title: "Payment Gateway Integration",
    domain: "BACKEND" as Domain,
    difficulty: "ADVANCED" as Difficulty,
    description:
      "Integrate Razorpay payment gateway into an existing Node.js backend service with proper error handling and webhooks.",
    briefUrl: "https://example.com/briefs/payment.pdf",
    datasetUrl: null,
    estimatedHours: 10,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    maxAttempts: 50,
    attemptFee: 69900, // ₹699
    status: "ACTIVE" as const,
    rubric: [
      {
        criterion: "Code Quality",
        weightage: 20,
        description: "Readable, clean, follows conventions?",
      },
      {
        criterion: "Error Handling",
        weightage: 20,
        description: "Comprehensive and user-friendly errors?",
      },
      {
        criterion: "Security Basics",
        weightage: 20,
        description: "No obvious vulnerabilities?",
      },
    ],
    tags: ["backend", "node.js", "payments"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    company: {
      companyName: "FinTech Inc",
      logoUrl: null,
    },
    attemptCount: 8,
    spotsRemaining: 42,
  },
  {
    id: "proj-4",
    companyId: "comp-1",
    title: "Growth Marketing Strategy",
    domain: "MARKETING" as Domain,
    difficulty: "INTERMEDIATE" as Difficulty,
    description:
      "Develop a comprehensive growth marketing strategy for Q2. Include channel mix, messaging, and KPIs.",
    briefUrl: "https://example.com/briefs/marketing.pdf",
    datasetUrl: null,
    estimatedHours: 6,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    maxAttempts: 100,
    attemptFee: 39900, // ₹399
    status: "ACTIVE" as const,
    rubric: [
      {
        criterion: "Audience Definition",
        weightage: 15,
        description: "Clear ICP articulation?",
      },
      {
        criterion: "Channel Rationale",
        weightage: 20,
        description: "Why these channels for this audience?",
      },
      {
        criterion: "Message Clarity",
        weightage: 25,
        description: "Is the core message sharp?",
      },
    ],
    tags: ["marketing", "strategy", "growth"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    company: {
      companyName: "TechCorp",
      logoUrl: null,
    },
    attemptCount: 3,
    spotsRemaining: 97,
  },
  {
    id: "proj-5",
    companyId: "comp-4",
    title: "React Component Library",
    domain: "BACKEND" as Domain,
    difficulty: "ADVANCED" as Difficulty,
    description:
      "Build a reusable React component library with TypeScript, Storybook, and comprehensive documentation.",
    briefUrl: "https://example.com/briefs/components.pdf",
    datasetUrl: null,
    estimatedHours: 15,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    maxAttempts: 50,
    attemptFee: 79900, // ₹799
    status: "ACTIVE" as const,
    rubric: [
      {
        criterion: "Architecture Decisions",
        weightage: 25,
        description: "Appropriate patterns for the problem?",
      },
      {
        criterion: "Code Quality",
        weightage: 20,
        description: "Readable and maintainable?",
      },
    ],
    tags: ["frontend", "react", "typescript"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    company: {
      companyName: "DevShop",
      logoUrl: null,
    },
    attemptCount: 2,
    spotsRemaining: 48,
  },
  {
    id: "proj-6",
    companyId: "comp-2",
    title: "Product Spec: AI-Powered Chat",
    domain: "PRODUCT" as Domain,
    difficulty: "INTERMEDIATE" as Difficulty,
    description:
      "Write a comprehensive product specification for an AI-powered customer support chat feature.",
    briefUrl: "https://example.com/briefs/spec.pdf",
    datasetUrl: null,
    estimatedHours: 8,
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    maxAttempts: 100,
    attemptFee: 29900, // ₹299
    status: "ACTIVE" as const,
    rubric: [
      {
        criterion: "User Problem Clarity",
        weightage: 20,
        description: "Is the problem statement sharp?",
      },
      {
        criterion: "Spec Completeness",
        weightage: 25,
        description: "Edge cases and acceptance criteria?",
      },
    ],
    tags: ["product", "ai", "specification"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    company: {
      companyName: "DesignStudio",
      logoUrl: null,
    },
    attemptCount: 1,
    spotsRemaining: 99,
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const domainFilter = searchParams.get("domain");
    const difficultyFilter = searchParams.get("difficulty");
    const minFee = searchParams.get("minFee");
    const maxFee = searchParams.get("maxFee");
    const search = searchParams.get("search")?.toLowerCase();
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 12;

    // Filter projects
    let filtered = [...MOCK_PROJECTS];

    if (domainFilter) {
      filtered = filtered.filter((p) => p.domain === domainFilter);
    }

    if (difficultyFilter) {
      filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    }

    if (minFee) {
      const min = parseInt(minFee);
      filtered = filtered.filter((p) => p.attemptFee >= min);
    }

    if (maxFee) {
      const max = parseInt(maxFee);
      filtered = filtered.filter((p) => p.attemptFee <= max);
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    // Pagination
    const totalCount = filtered.length;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedProjects = filtered.slice(startIdx, endIdx);

    return NextResponse.json(
      {
        success: true,
        data: paginatedProjects,
        pagination: {
          page,
          pageSize,
          total: totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Verify company role
    // TODO: Validate request body
    // TODO: Save to database via Prisma
    // TODO: Handle file uploads to Supabase

    return NextResponse.json(
      {
        success: false,
        error: "Project creation coming in Phase 18",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 }
    );
  }
}
