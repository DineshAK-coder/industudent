"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectCardProps } from "@/components/ProjectCard";
import { ProjectCard } from "@/components/ProjectCard";
import { DomainTile } from "@/components/DomainTile";
import type { Domain, Difficulty } from "@/types";

const featuredProjects: ProjectCardProps[] = [
  {
    id: "brief-1",
    title: "SaaS onboarding audit for early-stage product teams",
    company: "NovaScale",
    domain: "PRODUCT" as Domain,
    difficulty: "INTERMEDIATE" as Difficulty,
    description:
      "Improve conversion, reduce churn, and design a product-led growth roadmap for a B2B onboarding flow.",
    estimatedHours: 12,
    attemptFee: 29900,
    spotsTaken: 67,
    maxAttempts: 100,
    tags: ["product", "growth", "ux"],
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "brief-2",
    title: "Market segmentation model for a grocery delivery brand",
    company: "FreshLoop",
    domain: "DATA" as Domain,
    difficulty: "BEGINNER" as Difficulty,
    description:
      "Use user and order metrics to identify churn drivers, retention cohorts, and business-friendly recommendations.",
    estimatedHours: 10,
    attemptFee: 29900,
    spotsTaken: 38,
    maxAttempts: 100,
    tags: ["data", "analytics", "retention"],
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "brief-3",
    title: "Design a landing page for a fintech savings app",
    company: "Vaultly",
    domain: "DESIGN" as Domain,
    difficulty: "BEGINNER" as Difficulty,
    description:
      "Create a high-converting hero, dashboard mockup, and mobility-first microcopy for first-time savers.",
    estimatedHours: 8,
    attemptFee: 29900,
    spotsTaken: 54,
    maxAttempts: 100,
    tags: ["design", "ux", "fintech"],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const domainGrid = [
  { domain: "DATA" as Domain, activeProjects: 28, avgScore: 82 },
  { domain: "DESIGN" as Domain, activeProjects: 22, avgScore: 86 },
  { domain: "MARKETING" as Domain, activeProjects: 18, avgScore: 79 },
  { domain: "BACKEND" as Domain, activeProjects: 14, avgScore: 81 },
  { domain: "PRODUCT" as Domain, activeProjects: 16, avgScore: 84 },
  { domain: "FINANCE" as Domain, activeProjects: 10, avgScore: 77 },
  { domain: "SUPPLY_CHAIN" as Domain, activeProjects: 8, avgScore: 73 },
];

import { useState, useEffect } from "react";
// Bypassing NextAuth for now
// import { getSession } from "next-auth/react";

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Completely bypass DB and NextAuth; read the mock email
    const email = localStorage.getItem("mock_user_email");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Dynamic Navbar */}
      <nav className="absolute top-0 w-full flex justify-end p-6 z-50">
        {userEmail && (
          <div className="bg-violet-500/20 border border-violet-500/30 rounded-full px-4 py-2 text-sm font-semibold text-violet-300">
            Hi {userEmail} 👋
          </div>
        )}
      </nav>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(108,71,255,0.24),_transparent_45%)] blur-3xl" />
      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 py-12 sm:px-8 lg:px-10">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              Student projects, verified feedback, hiring-ready work.
            </div>
            <div className="max-w-xl space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Your work speaks. Your resume doesn&apos;t have to.
              </h1>
              <p className="text-xl leading-8 text-slate-300">
                Attempt real projects from real companies. Get expert feedback. Get hired — before you even graduate.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/projects" className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40">
                Browse Projects →
              </Link>
              <Link href="/dashboard/student/attempts" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/30">
                My Projects
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/90 p-8 shadow-[0_50px_120px_rgba(15,23,42,0.5)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.16),_transparent_35%)]" />
            <div className="relative space-y-6">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.32em] text-violet-300">Sample project brief</p>
                <h2 className="text-2xl font-semibold text-white">E-commerce conversion growth challenge</h2>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-2xl bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-200">Data</span>
                  <span className="rounded-2xl bg-white/5 px-3 py-1 text-sm text-slate-300">₹299</span>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  Analyze live user funnels, identify friction points in checkout, and recommend three product experiments to lift purchase rate.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                  <span>Delivery report</span>
                  <span>Auto feedback</span>
                  <span>Verified badge</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Deadline</p>
                  <p className="mt-2 text-lg font-semibold text-white">8 days left</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Score estimate</p>
                  <p className="mt-2 text-lg font-semibold text-white">83 / 100</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Featured projects</p>
            <h3 className="text-2xl font-semibold text-white">Hand-picked briefs from verified partners.</h3>
          </div>
          <div className="grid gap-4">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Explore domains</p>
            <h2 className="text-3xl font-semibold text-white">Projects across every skill path.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {domainGrid.map((domain) => (
              <DomainTile key={domain.domain} {...domain} />
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-white/10 bg-slate-950/90 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="text-sm font-semibold text-white">ProofWork</p>
            <p className="mt-2 text-sm text-slate-500">A modern student marketplace for verified project experience.</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Newsletter email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              className="min-w-0 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
            />
            <button type="submit" className="rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-400">
              Join updates
            </button>
          </form>
        </div>
      </footer>
    </main>
  );
}
