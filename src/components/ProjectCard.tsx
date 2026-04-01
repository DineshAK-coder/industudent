import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Domain, Difficulty } from "@/types";
import {
  cn,
  DOMAIN_COLORS,
  DOMAIN_LABELS,
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
  formatCurrency,
  formatRelativeTime,
  truncate,
} from "@/lib/utils";

export type ProjectCardProps = {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  domain: Domain;
  difficulty: Difficulty;
  description: string;
  estimatedHours: number;
  attemptFee: number;
  spotsTaken: number;
  maxAttempts: number;
  tags: string[];
  deadline: string;
};

export function ProjectCard({ project }: { project: ProjectCardProps }) {
  const progress = Math.min(100, Math.round((project.spotsTaken / project.maxAttempts) * 100));

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-1 hover:border-violet-400/40"
    >
      <div className={cn("h-2 rounded-full", DOMAIN_COLORS[project.domain])} />
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white">
          {project.companyLogo ? (
            <img src={project.companyLogo} alt={project.company} className="h-10 w-10 rounded-2xl object-cover" />
          ) : (
            project.company
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{DOMAIN_LABELS[project.domain]}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{truncate(project.title, 62)}</h3>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-3 py-1 text-xs font-medium", DOMAIN_COLORS[project.domain])}> {DOMAIN_LABELS[project.domain]} </span>
        <span className={cn("rounded-full px-3 py-1 text-xs font-medium", DIFFICULTY_COLORS[project.difficulty])}> {DIFFICULTY_LABELS[project.difficulty]} </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">{project.description}</p>

      <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <span>⏱</span>
          <span>{project.estimatedHours} hours</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{formatRelativeTime(project.deadline)} left</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Attempt fee</p>
          <p className="mt-1 text-lg font-semibold text-orange-300">{formatCurrency(project.attemptFee)}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>Attempt</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-full bg-white/5">
        <div className="h-2 rounded-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{project.spotsTaken} of {project.maxAttempts} spots taken</p>
    </Link>
  );
}

export default ProjectCard;
