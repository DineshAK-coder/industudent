"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { Domain, Difficulty } from "@/types";
import { getDomainLabel, getDifficultyLabel } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  domain: Domain;
  difficulty: Difficulty;
  description: string;
  attemptFee: number;
  estimatedHours: number;
  deadline: string | Date;
  company: { companyName: string; logoUrl: string | null };
  attemptCount: number;
  maxAttempts: number;
  spotsRemaining: number;
  tags: string[];
}

const DOMAINS: Domain[] = ["DATA", "DESIGN", "MARKETING", "FINANCE", "BACKEND", "PRODUCT", "SUPPLY_CHAIN"];
const DIFFICULTIES: Difficulty[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const FEE_RANGES = [
  { label: "₹0 - ₹500", min: 0, max: 50000 },
  { label: "₹500 - ₹1000", min: 50000, max: 100000 },
  { label: "₹1000+", min: 100000, max: Infinity },
];

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filter states
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(
    (searchParams.get("domain") as Domain) || null
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedDomain) params.append("domain", selectedDomain);
        if (selectedDifficulty) params.append("difficulty", selectedDifficulty);
        if (priceRange.min !== undefined) params.append("minFee", String(priceRange.min));
        if (priceRange.max !== undefined) params.append("maxFee", String(priceRange.max));
        if (searchQuery) params.append("search", searchQuery);
        params.append("page", String(page));

        const res = await fetch(`/api/projects?${params}`);
        const data = await res.json();

        if (data.success) {
          setProjects(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedDomain, selectedDifficulty, priceRange, searchQuery, page]);

  const handleClearFilters = () => {
    setSelectedDomain(null);
    setSelectedDifficulty(null);
    setPriceRange({});
    setSearchQuery("");
    setPage(1);
  };

  const hasActiveFilters = selectedDomain || selectedDifficulty || Object.keys(priceRange).length > 0 || searchQuery;

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-sm text-violet-400 hover:text-violet-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Browse Projects</h1>
          <p className="text-slate-400">
            Find real company projects to build, learn, and get hired
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-violet-400 hover:text-violet-300 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Project title..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Domain Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Domain</label>
                <div className="space-y-2">
                  {DOMAINS.map((domain) => (
                    <label key={domain} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="domain"
                        value={domain}
                        checked={selectedDomain === domain}
                        onChange={() => {
                          setSelectedDomain(selectedDomain === domain ? null : domain);
                          setPage(1);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-300">{getDomainLabel(domain)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Difficulty</label>
                <div className="space-y-2">
                  {DIFFICULTIES.map((difficulty) => (
                    <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        value={difficulty}
                        checked={selectedDifficulty === difficulty}
                        onChange={() => {
                          setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty);
                          setPage(1);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-300">{getDifficultyLabel(difficulty)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Attempt Fee</label>
                <div className="space-y-2">
                  {FEE_RANGES.map((range, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange.min === range.min && priceRange.max === range.max}
                        onChange={() => {
                          setPriceRange(
                            priceRange.min === range.min && priceRange.max === range.max
                              ? {}
                              : { min: range.min, max: range.max }
                          );
                          setPage(1);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-300">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-96 bg-slate-800 border border-slate-700 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4" aria-hidden>
                  🔍
                </p>
                <p className="text-slate-400 mb-2">No projects found matching your criteria</p>
                <p className="text-sm text-slate-500 mb-4">Try clearing filters or broadening your search.</p>
                <button
                  onClick={handleClearFilters}
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {selectedDomain && (
                      <span className="px-2 py-1 text-xs rounded bg-violet-900/40 text-violet-200">
                        Domain: {getDomainLabel(selectedDomain)}
                      </span>
                    )}
                    {selectedDifficulty && (
                      <span className="px-2 py-1 text-xs rounded bg-amber-900/40 text-amber-200">
                        Difficulty: {getDifficultyLabel(selectedDifficulty)}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">
                        Search: {searchQuery}
                      </span>
                    )}
                    {Object.keys(priceRange).length > 0 && (
                      <span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">
                        Fee filter applied
                      </span>
                    )}
                  </div>
                )}

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-8">
                  {projects.map((project) => (
                    <div key={project.id} className="h-full hover:cursor-pointer">
                      <ProjectCard
                        project={{
                          id: project.id,
                          title: project.title,
                          company: project.company.companyName,
                          domain: project.domain,
                          difficulty: project.difficulty,
                          description: project.description,
                          estimatedHours: project.estimatedHours,
                          attemptFee: project.attemptFee,
                          spotsTaken: project.attemptCount,
                          maxAttempts: project.maxAttempts,
                          tags: project.tags,
                          deadline: project.deadline.toString(),
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination info */}
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center text-sm text-slate-400">
                    Showing {projects.length} of {pagination.total} projects
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 rounded border border-slate-700 text-slate-300 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-slate-400">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1 rounded border border-slate-700 text-slate-300 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}
