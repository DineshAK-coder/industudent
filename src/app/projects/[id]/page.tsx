"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getDomainColor, getDomainLabel } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { Domain } from "@/types";

interface Project {
  id: string;
  title: string;
  domain: string;
  difficulty: string;
  description: string;
  briefUrl: string;
  datasetUrl?: string;
  estimatedHours: number;
  deadline: string | Date;
  attemptFee: number;
  company: {
    companyName: string;
    logoUrl?: string;
    verified?: boolean;
  };
  rubric: Array<{
    criterion: string;
    weightage: number;
    description: string;
  }>;
  tags: string[];
  spotsRemaining: number;
  maxAttempts: number;
  submissions: Array<{
    rankNum: number;
    studentName: string;
    score: number;
  }>;
  reviewer: {
    name: string;
    role: string;
    company: string;
    rating: number;
    totalReviews: number;
  };
}


export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullSize, setIsFullSize] = useState(false);
  const [repoLink, setRepoLink] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmitRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoLink.includes("github.com")) {
      setSubmissionSuccess(true);
      setRepoLink("");
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();

        if (data.success) {
          setProject(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Project not found</p>
          <Link href="/projects" className="text-violet-400 hover:text-violet-300">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const domainColor = getDomainColor(project.domain as Domain);

  return (
    <main className={`min-h-screen bg-slate-950 text-slate-100 ${isFullSize ? "overflow-hidden" : "py-10 px-6"}`}>
      
      {!isFullSize && (
        <div className="max-w-4xl mx-auto mb-6">
          <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300 font-medium inline-block transition-colors">
            ← Back to Projects
          </Link>
        </div>
      )}

      <div className={`mx-auto bg-slate-900 border border-slate-800 ${isFullSize ? "w-full min-h-screen rounded-none" : "max-w-4xl rounded-2xl shadow-2xl overflow-hidden"} flex flex-col transition-all duration-300`}>
        
        {/* --- Header Area --- */}
        {!isFullSize && (
          <div className="p-8 md:p-10 border-b border-slate-800 bg-slate-900">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-sm text-slate-400 font-mono uppercase tracking-wider">
                <span className={`px-2 py-1 rounded bg-slate-800 ${domainColor}`}>
                  {getDomainLabel(project.domain as Domain)}
                </span>
                <span>•</span>
                <span>{project.company.companyName}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                {project.title}
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                {project.description}
              </p>

              <div className="space-y-4 text-slate-300 mt-4">
                <h3 className="text-xl font-semibold text-white">What You&apos;ll Need</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Relevant programming language or software tools (e.g. VS Code, Python, Figma) pertinent to this domain.</li>
                  <li>Familiarity with industry-standard frameworks linked to the tags: {project.tags.join(", ")}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* --- Brief / File Viewer Area --- */}
        <div className={`relative bg-slate-950 ${isFullSize ? "flex-1 flex flex-col" : "h-[600px] border-b border-slate-800"}`}>
          <div className={`flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-sm font-mono text-slate-400 ${isFullSize ? "sticky top-0 z-50" : ""}`}>
            <span>project_brief.pdf</span>
            <button 
              onClick={() => setIsFullSize(!isFullSize)}
              className="hover:text-white flex items-center gap-2 transition"
            >
              {isFullSize ? "Exit Fullscreen" : "Enter Fullscreen"}
            </button>
          </div>
          
          <iframe
            title="Project brief"
            src={project.briefUrl}
            className="w-full flex-1 bg-slate-950"
            style={{ minHeight: isFullSize ? 'calc(100vh - 40px)' : '100%' }}
          />
        </div>

        {/* --- Submission / Git Repo Area --- */}
        {!isFullSize && (
          <div className="p-8 md:p-10 bg-slate-900">
            <h3 className="text-2xl font-bold text-white mb-4">Submit Your Work</h3>
            <p className="text-slate-400 mb-6 font-medium">Link your GitHub repository or preferred hosting containing the requested deliverables.</p>
            
            {submissionSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                <span className="text-xl">🎉</span>
                <span>Your project repository has been successfully submitted for review! Check your dashboard for updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitRepo} className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="url" 
                  required
                  placeholder="https://github.com/username/project..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                />
                <Button label="Submit Repository" variant="primary" type="submit" />
              </form>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
