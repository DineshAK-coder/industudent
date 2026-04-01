"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { StatusTimeline } from "@/components/StatusTimeline";
interface CriterionFeedback {
  score: number;
  feedback: string;
}

interface Attempt {
  id: string;
  status: string;
  submissionUrl?: string;
  submissionNote?: string;
  autoScore?: number;
  autoFeedback?: Record<string, CriterionFeedback>;
  finalScore?: number;
  submittedAt?: string | Date;
  paidAt: string | Date;
  processJournal?: string;
  wipScreenshots?: string[];
  timeBreakdown?: { research: number; building: number; refining: number };
  toolsUsed?: string[];
  aiDeclaration?: string;
  project: {
    title: string;
    domain: string;
    difficulty: string;
    estimatedHours: number;
    deadline: string | Date;
    rubric: Array<{ criterion: string; weightage: number }>;
  };
  review?: {
    overallScore?: number;
    writtenFeedback?: string;
  };
}

type AttemptStatus = "PAID" | "SUBMITTED" | "UNDER_REVIEW" | "REVIEWED" | "FLAGGED";
type TimelineStatus = "pending" | "completed" | "current";

const STATUS_STEPS: AttemptStatus[] = ["PAID", "SUBMITTED", "UNDER_REVIEW", "REVIEWED"];

export default function AttemptDetailPage() {
  const params = useParams();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processJournal, setProcessJournal] = useState("");
  const [wipFiles, setWipFiles] = useState<File[]>([]);
  const [timeBreakdown, setTimeBreakdown] = useState({ research: 0, building: 0, refining: 0 });
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [aiDeclaration, setAiDeclaration] = useState("");
  const [confirmedOwnWork, setConfirmedOwnWork] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await fetch(`/api/attempts/${attemptId}`);
        const data = await res.json();

        if (data.success) {
          setAttempt(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch attempt:", error);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchAttempt();
    }
  }, [attemptId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleWipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setWipFiles(files.slice(0, 5));
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) => (prev.includes(tool) ? prev.filter((item) => item !== tool) : [...prev, tool]));
  };

  const handleSubmit = async () => {
    if (!file || !attempt) return;
    setSubmitError(null);

    if (processJournal.trim().split(/\s+/).length < 150) {
      setSubmitError("Process journal must be at least 150 words.");
      return;
    }
    if (wipFiles.length < 1) {
      setSubmitError("Upload at least 1 WIP screenshot.");
      return;
    }
    if (!aiDeclaration) {
      setSubmitError("Please select AI usage declaration.");
      return;
    }
    if (!confirmedOwnWork) {
      setSubmitError("Please confirm this is your own work.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("attemptId", attempt.id);
      formData.append("processJournal", processJournal);
      formData.append("aiDeclaration", aiDeclaration);
      formData.append("toolsUsed", JSON.stringify(selectedTools));
      formData.append("timeBreakdown", JSON.stringify(timeBreakdown));
      wipFiles.forEach((wip) => formData.append("wipScreenshots", wip));

      const res = await fetch("/api/upload/submission", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Update attempt status to SUBMITTED
        await fetch(`/api/attempts/${attemptId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "SUBMITTED",
            submissionUrl: data.data.url,
            submissionNote: `Submitted with ${wipFiles.length} WIP files`,
            processJournal: data.data.processJournal,
            wipScreenshots: data.data.wipScreenshots,
            timeBreakdown: data.data.timeBreakdown,
            toolsUsed: data.data.toolsUsed,
            aiDeclaration: data.data.aiDeclaration,
          }),
        });

        // Refresh attempt
        const updatedRes = await fetch(`/api/attempts/${attemptId}`);
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setAttempt(updatedData.data);
        }
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      setSubmitError("Failed to submit. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading attempt...</div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Attempt not found</p>
          <Link href="/dashboard/student" className="text-violet-400 hover:text-violet-300">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.indexOf(attempt.status as AttemptStatus);
  const stepStatus = (index: number): TimelineStatus => {
    if (index <= currentStatusIndex) return "completed";
    if (index === currentStatusIndex + 1) return "current";
    return "pending";
  };
  const timelineSteps = [
    { label: "Paid", status: stepStatus(0) },
    { label: "Brief Unlocked", status: stepStatus(1) },
    { label: "Submitted", status: stepStatus(2) },
    { label: "Under Review", status: stepStatus(3) },
    { label: "Reviewed", status: stepStatus(4) },
  ];

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard/student"
            className="text-sm text-violet-400 hover:text-violet-300 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{attempt.project.title}</h1>
          <p className="text-slate-400">Status: {attempt.status}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <StatusTimeline steps={timelineSteps} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* PAID Status - Submission Form */}
        {attempt.status === "PAID" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Submit Your Work</h2>

              <div className="space-y-6">
                {/* Process Journal */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Process Journal (min 150 words)
                  </label>
                  <textarea
                    placeholder="Tell us: What did you try first that didn&apos;t work? What was the hardest part? What would you do differently with more time?"
                    value={processJournal}
                    onChange={(e) => setProcessJournal(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-32"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    {processJournal.trim() ? processJournal.trim().split(/\s+/).length : 0} / 150 words
                  </p>
                </div>

                {/* WIP Screenshots */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    WIP Screenshots (min 1, max 5)
                  </label>
                  <input type="file" accept="image/*" multiple onChange={handleWipUpload} className="w-full text-sm text-slate-300" />
                  <p className="text-xs text-slate-500 mt-2">Selected {wipFiles.length} screenshot(s)</p>
                </div>

                {/* Time Breakdown */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Time Spent</label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Research", "Building", "Refining"].map((label) => (
                      <div key={label}>
                        <label className="block text-xs text-slate-400 mb-2">{label} (hours)</label>
                        <input
                          type="number"
                          min="0"
                          max="24"
                          placeholder="0"
                          value={timeBreakdown[label.toLowerCase() as keyof typeof timeBreakdown]}
                          onChange={(e) =>
                            setTimeBreakdown((prev) => ({
                              ...prev,
                              [label.toLowerCase()]: Number(e.target.value || 0),
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools Used */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Tools Used</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Python", "Excel", "Figma", "Jupyter", "SQL", "None of the above"].map((tool) => (
                      <label key={tool} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedTools.includes(tool)}
                          onChange={() => toggleTool(tool)}
                        />
                        <span className="text-sm text-slate-300">{tool}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* AI Declaration */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">AI Usage Declaration</label>
                  <div className="space-y-2">
                    {[
                      "I did not use AI for this submission",
                      "I used AI for research/reference only",
                      "I used AI as a tool, but all decisions are mine",
                      "AI generated parts which I modified substantially",
                    ].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ai-usage"
                          className="w-4 h-4"
                          checked={aiDeclaration === option}
                          onChange={() => setAiDeclaration(option)}
                        />
                        <span className="text-sm text-slate-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Your Work (PDF or ZIP, max 50MB)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.zip"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-violet-600 file:text-white"
                  />
                  {file && <p className="mt-2 text-sm text-green-400">Selected: {file.name}</p>}
                </div>

                {/* Confirmation */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={confirmedOwnWork}
                    onChange={(e) => setConfirmedOwnWork(e.target.checked)}
                  />
                  <span className="text-sm text-slate-300">
                    I confirm this is my own work and I understand the integrity policy
                  </span>
                </label>

                <Button
                  label={uploading ? "Uploading..." : "Submit My Work"}
                  variant="primary"
                  className="w-full"
                  disabled={!file || uploading}
                  onClick={handleSubmit}
                />
                {submitError && <p className="text-sm text-red-300">{submitError}</p>}
              </div>
            </div>

            {/* Rubric Reminder */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Evaluation Rubric</h3>
              <div className="space-y-3">
                {attempt.project.rubric.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-300">{item.criterion}</span>
                    <span className="text-slate-400">{item.weightage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBMITTED/UNDER_REVIEW Status */}
        {(attempt.status === "SUBMITTED" || attempt.status === "UNDER_REVIEW") && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your submission is in review</h2>
              <p className="text-slate-400 mb-6">
                An expert reviewer is evaluating your work. This typically takes 24-48 hours.
              </p>
              <p className="text-sm text-slate-500">Estimated review time: ~2 days</p>
            </div>
          </div>
        )}

        {/* REVIEWED Status */}
        {attempt.status === "REVIEWED" && attempt.autoScore !== undefined && (
          <div className="space-y-8">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-violet-900/40 to-orange-900/40 border border-violet-700/50 rounded-lg p-8 text-center">
              <p className="text-slate-300 mb-2">Your Score</p>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-orange-400 mb-2">
                {attempt.autoScore}
              </div>
              <p className="text-slate-400">out of 100 points</p>
            </div>

            {/* AI Feedback */}
            {attempt.autoFeedback && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-6">AI Auto-Feedback</h3>
                <div className="space-y-4">
                  {Object.entries(attempt.autoFeedback).map(([criterion, data]) => (
                    <div key={criterion} className="border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-white">{criterion}</p>
                        <p className="text-lg font-bold text-violet-400">{data.score}</p>
                      </div>
                      <p className="text-sm text-slate-300">{data.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Try Another */}
            <div className="text-center">
              <Link href="/projects" className="inline-block">
                <Button label="Attempt Another Project" variant="primary" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
