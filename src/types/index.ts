import {
  User,
  StudentProfile,
  CompanyProfile,
  ReviewerProfile,
  Project,
  Attempt,
  Review,
  Badge,
  Payment,
  IntegrityCheck,
  VerificationInterview,
  Role,
  Domain,
  Difficulty,
  ProjectStatus,
  AttemptStatus,
  PaymentType,
  PaymentStatus,
} from "@prisma/client";
import type { DefaultSession } from "next-auth";

// ─────────────────────────────────────────────
// Re-export Prisma enums for convenience
// ─────────────────────────────────────────────
export type {
  Role,
  Domain,
  Difficulty,
  ProjectStatus,
  AttemptStatus,
  PaymentType,
  PaymentStatus,
};

// ─────────────────────────────────────────────
// NextAuth session augmentation
// ─────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      profileId: string | null;
      hasProfile: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    profileId?: string | null;
  }
}

// ─────────────────────────────────────────────
// Composite types (Prisma model + relations)
// ─────────────────────────────────────────────
export type UserWithProfile = User & {
  studentProfile: StudentProfile | null;
  companyProfile: CompanyProfile | null;
  reviewerProfile: ReviewerProfile | null;
};

export type ProjectWithCompany = Project & {
  company: CompanyProfile & { user: Pick<User, "name" | "avatar"> };
  _count?: { attempts: number };
};

export type ProjectWithAttempts = Project & {
  company: CompanyProfile & { user: Pick<User, "name" | "avatar"> };
  attempts: Attempt[];
  _count: { attempts: number };
};

export type AttemptWithDetails = Attempt & {
  project: Project & {
    company: CompanyProfile & { user: Pick<User, "name" | "avatar"> };
  };
  user: Pick<User, "id" | "name" | "avatar" | "email">;
  review: Review | null;
  payment: Payment | null;
  integrityCheck: IntegrityCheck | null;
  interview: VerificationInterview | null;
};

export type ReviewWithDetails = Review & {
  attempt: AttemptWithDetails;
  reviewer: ReviewerProfile & { user: Pick<User, "name" | "avatar"> };
};

export type StudentProfileWithBadges = StudentProfile & {
  badges: Badge[];
  user: Pick<User, "id" | "name" | "email" | "avatar">;
};

export type ReviewerProfileWithStats = ReviewerProfile & {
  user: Pick<User, "id" | "name" | "email" | "avatar">;
  reviews: Review[];
};

// ─────────────────────────────────────────────
// API response wrappers
// ─────────────────────────────────────────────
export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// ─────────────────────────────────────────────
// Rubric types (stored as JSON in DB)
// ─────────────────────────────────────────────
export type RubricCriterion = {
  id: string;
  label: string;
  description: string;
  maxScore: number;
  weight: number; // 0–1, must sum to 1 across all criteria
};

export type RubricScores = Record<string, number>; // criterionId → score earned

export type AutoFeedbackResult = {
  criterionId: string;
  score: number;
  feedback: string;
}[];

// ─────────────────────────────────────────────
// Integrity check types (stored as JSON in DB)
// ─────────────────────────────────────────────
export type IntegrityDimensionScores = {
  textOriginality: number;
  processAuthenticity: number;
  timelineConsistency: number;
  cohortSimilarity: number;
  aiDeclarationConsistency: number;
};

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// ─────────────────────────────────────────────
// Onboarding form data
// ─────────────────────────────────────────────
export type StudentOnboardingData = {
  college: string;
  graduationYear: number;
  domains: Domain[];
  bio?: string;
  linkedinUrl?: string;
};

export type CompanyOnboardingData = {
  companyName: string;
  industry: string;
  size: string;
  website?: string;
};

export type ReviewerOnboardingData = {
  domains: Domain[];
  yearsExp: number;
  currentRole: string;
  ratePerReview: number;
};

export type OnboardingPayload =
  | ({ role: "STUDENT" } & StudentOnboardingData)
  | ({ role: "COMPANY" } & CompanyOnboardingData)
  | ({ role: "REVIEWER" } & ReviewerOnboardingData);
