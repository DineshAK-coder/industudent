import { z } from "zod";
import { Domain, Difficulty } from "@prisma/client";

// ─────────────────────────────────────────────
// Onboarding schemas
// ─────────────────────────────────────────────
export const studentOnboardingSchema = z.object({
  role: z.literal("STUDENT"),
  college: z.string().min(2, "College name is required"),
  graduationYear: z
    .number()
    .int()
    .min(2020, "Invalid graduation year")
    .max(2035, "Invalid graduation year"),
  domains: z
    .array(z.nativeEnum(Domain))
    .min(1, "Select at least one domain")
    .max(3, "Select up to 3 domains"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const companyOnboardingSchema = z.object({
  role: z.literal("COMPANY"),
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"] as const),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const reviewerOnboardingSchema = z.object({
  role: z.literal("REVIEWER"),
  domains: z
    .array(z.nativeEnum(Domain))
    .min(1, "Select at least one domain")
    .max(3, "Select up to 3 domains"),
  yearsExp: z
    .number()
    .int()
    .min(1, "Must have at least 1 year of experience")
    .max(50, "Invalid value"),
  currentRole: z.string().min(2, "Current role is required"),
  ratePerReview: z
    .number()
    .int()
    .min(10000, "Minimum rate is ₹100 (10000 paise)")
    .max(1000000, "Maximum rate is ₹10,000"),
});

export const onboardingSchema = z.discriminatedUnion("role", [
  studentOnboardingSchema,
  companyOnboardingSchema,
  reviewerOnboardingSchema,
]);

export type StudentOnboardingInput = z.infer<typeof studentOnboardingSchema>;
export type CompanyOnboardingInput = z.infer<typeof companyOnboardingSchema>;
export type ReviewerOnboardingInput = z.infer<typeof reviewerOnboardingSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;

// ─────────────────────────────────────────────
// Project creation schema
// ─────────────────────────────────────────────
const rubricCriterionSchema = z.object({
  id: z.string().cuid(),
  label: z.string().min(2, "Label is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  maxScore: z.number().min(1).max(100),
  weight: z.number().min(0.01).max(1),
});

export const createProjectSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters").max(120),
    domain: z.nativeEnum(Domain),
    difficulty: z.nativeEnum(Difficulty),
    description: z
      .string()
      .min(50, "Description must be at least 50 characters")
      .max(5000),
    briefUrl: z.string().url("Must be a valid URL"),
    datasetUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    estimatedHours: z.number().int().min(1).max(500),
    deadline: z.string().datetime({ message: "Invalid deadline" }),
    maxAttempts: z.number().int().min(10).max(10000).default(100),
    attemptFee: z
      .number()
      .int()
      .min(1000, "Minimum fee is ₹10")
      .max(5000000, "Maximum fee is ₹50,000"),
    rubric: z
      .array(rubricCriterionSchema)
      .min(2, "Add at least 2 rubric criteria")
      .max(10, "Maximum 10 rubric criteria"),
    tags: z
      .array(z.string().min(1).max(30))
      .min(1, "Add at least 1 tag")
      .max(10, "Maximum 10 tags"),
  })
  .refine(
    (data) => {
      const totalWeight = data.rubric.reduce((sum, c) => sum + c.weight, 0);
      return Math.abs(totalWeight - 1) < 0.01;
    },
    { message: "Rubric weights must sum to 1.0", path: ["rubric"] }
  );

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// ─────────────────────────────────────────────
// Attempt submission schema
// ─────────────────────────────────────────────
export const submitAttemptSchema = z.object({
  submissionUrl: z.string().url("Must be a valid submission URL"),
  submissionNote: z
    .string()
    .max(1000, "Submission note must be under 1000 characters")
    .optional(),
  processJournal: z
    .string()
    .min(100, "Process journal must be at least 100 characters")
    .max(10000),
  wipScreenshots: z
    .array(z.string().url())
    .min(1, "Upload at least 1 WIP screenshot"),
  timeBreakdown: z
    .object({
      research: z.number().min(0),
      execution: z.number().min(0),
      review: z.number().min(0),
      total: z.number().min(0),
    })
    .optional(),
  toolsUsed: z.array(z.string().min(1)).min(1, "List at least 1 tool used"),
  aiDeclaration: z
    .string()
    .max(1000, "AI declaration must be under 1000 characters")
    .optional(),
});

export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;

// ─────────────────────────────────────────────
// Review submission schema
// ─────────────────────────────────────────────
export const submitReviewSchema = z.object({
  scores: z.record(z.string(), z.number().min(0).max(100)),
  writtenFeedback: z
    .string()
    .min(200, "Written feedback must be at least 200 characters")
    .max(5000),
  videoFeedbackUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  strengthPoints: z
    .array(z.string().min(5))
    .min(1, "Add at least 1 strength point")
    .max(5),
  improvPoints: z
    .array(z.string().min(5))
    .min(1, "Add at least 1 improvement point")
    .max(5),
  hireRecommend: z.boolean(),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

// ─────────────────────────────────────────────
// Payment webhook schema
// ─────────────────────────────────────────────
export const razorpayWebhookSchema = z.object({
  entity: z.string(),
  account_id: z.string(),
  event: z.string(),
  contains: z.array(z.string()),
  payload: z.record(z.string(), z.unknown()),
  created_at: z.number(),
});

export type RazorpayWebhookPayload = z.infer<typeof razorpayWebhookSchema>;

// ─────────────────────────────────────────────
// Search / filter schemas
// ─────────────────────────────────────────────
export const projectFilterSchema = z.object({
  domain: z.nativeEnum(Domain).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  minFee: z.number().int().min(0).optional(),
  maxFee: z.number().int().optional(),
  search: z.string().max(100).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(12),
  sortBy: z.enum(["newest", "deadline", "fee-asc", "fee-desc"]).default("newest"),
});

export type ProjectFilterInput = z.infer<typeof projectFilterSchema>;
