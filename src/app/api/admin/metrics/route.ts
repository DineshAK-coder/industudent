import { NextRequest, NextResponse } from "next/server";

// Admin metrics endpoint
export async function GET(request: NextRequest) {
  try {
    // TODO: Query aggregated metrics from Prisma
    // const metrics = await Promise.all([
    //   prisma.user.count(),
    //   prisma.project.count(),
    //   prisma.attempt.count(),
    //   prisma.payment.aggregate({ _sum: { amount: true } }),
    //   prisma.integrityCheck.groupBy({...})
    // ]);

    // Mock response
    const metrics = {
      totalUsers: 2847,
      totalCompanies: 195,
      totalReviewers: 342,
      totalProjects: 156,
      activeProjects: 89,
      totalSubmissions: 892,
      averageScore: 76.4,
      totalRevenue: 420000000, // in paise
      integrityFlags: {
        high: 12,
        medium: 47,
        low: 823,
      },
      topDomains: [
        { domain: "DATA", count: 234 },
        { domain: "DESIGN", count: 189 },
        { domain: "BACKEND", count: 156 },
      ],
    };

    return NextResponse.json(
      {
        success: true,
        data: metrics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/metrics error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch metrics",
      },
      { status: 500 }
    );
  }
}
