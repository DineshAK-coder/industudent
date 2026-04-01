import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { Domain, Difficulty, Role, ProjectStatus, AttemptStatus } from "@prisma/client";

// ─────────────────────────────────────────────
// Tailwind class merger
// ─────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────
// Date formatters
// ─────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// ─────────────────────────────────────────────
// Score formatters
// ─────────────────────────────────────────────
export function formatScore(score: number | null | undefined): string {
  if (score == null) return "—";
  return score.toFixed(1);
}

export function scoreToGrade(score: number): "A+" | "A" | "B" | "C" | "D" | "F" {
  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

// ─────────────────────────────────────────────
// Currency (amounts stored in paise)
// ─────────────────────────────────────────────
export function formatCurrency(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

// ─────────────────────────────────────────────
// Domain labels & colors
// ─────────────────────────────────────────────
export const DOMAIN_LABELS: Record<Domain, string> = {
  DATA: "Data Science",
  DESIGN: "Design",
  MARKETING: "Marketing",
  FINANCE: "Finance",
  BACKEND: "Backend Engineering",
  PRODUCT: "Product Management",
  SUPPLY_CHAIN: "Supply Chain",
};

export const DOMAIN_COLORS: Record<Domain, string> = {
  DATA: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  DESIGN: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  MARKETING: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  FINANCE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  BACKEND: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  PRODUCT: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  SUPPLY_CHAIN: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

export const DOMAIN_ICONS: Record<Domain, string> = {
  DATA: "📊",
  DESIGN: "🎨",
  MARKETING: "📣",
  FINANCE: "💹",
  BACKEND: "⚙️",
  PRODUCT: "🧩",
  SUPPLY_CHAIN: "🔗",
};

// ─────────────────────────────────────────────
// Difficulty labels & styles
// ─────────────────────────────────────────────
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ADVANCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ─────────────────────────────────────────────
// Project status labels
// ─────────────────────────────────────────────
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  DRAFT: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CLOSED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ARCHIVED: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
};

// ─────────────────────────────────────────────
// Attempt status labels
// ─────────────────────────────────────────────
export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  PAID: "Paid – Not Started",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  REVIEWED: "Reviewed",
  FLAGGED: "Flagged",
};

export const ATTEMPT_STATUS_COLORS: Record<AttemptStatus, string> = {
  PAID: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  SUBMITTED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  UNDER_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  REVIEWED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  FLAGGED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ─────────────────────────────────────────────
// Role labels
// ─────────────────────────────────────────────
export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Student",
  COMPANY: "Company",
  REVIEWER: "Reviewer",
  ADMIN: "Admin",
};

export const ROLE_REDIRECT: Record<Role, string> = {
  STUDENT: "/student",
  COMPANY: "/company",
  REVIEWER: "/reviewer",
  ADMIN: "/admin",
};

// ─────────────────────────────────────────────
// Misc helpers
// ─────────────────────────────────────────────
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function generateInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─────────────────────────────────────────────
// Label getters
// ─────────────────────────────────────────────
export function getDomainLabel(domain: Domain): string {
  return DOMAIN_LABELS[domain];
}

export function getDomainColor(domain: Domain): string {
  return DOMAIN_COLORS[domain];
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}
