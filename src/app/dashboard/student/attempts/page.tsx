"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface Attempt {
  id: string;
  project: { id: string; title: string; domain: string };
  status: string;
  autoScore?: number;
  finalScore?: number;
  submittedAt?: string;
  paidAt: string;
}

export default function StudentAttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        // TODO: Get userId from session
        const res = await fetch(`/api/attempts?userId=user-1`);
        const data = await res.json();

        if (data.success) {
          setAttempts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PAID: "bg-blue-900/30 text-blue-200 border-blue-700/50",
      SUBMITTED: "bg-amber-900/30 text-amber-200 border-amber-700/50",
      UNDER_REVIEW: "bg-purple-900/30 text-purple-200 border-purple-700/50",
      REVIEWED: "bg-green-900/30 text-green-200 border-green-700/50",
      FLAGGED: "bg-red-900/30 text-red-200 border-red-700/50",
    };
    return colors[status] || "bg-slate-800 text-slate-300";
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard/student" className="text-sm text-violet-400 hover:text-violet-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">My Attempts</h1>
          <p className="text-slate-400">Track your project submissions and feedback</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-slate-400 text-center py-12">Loading attempts...</div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-slate-400 mb-4">You haven&apos;t attempted any projects yet</p>
            <Link href="/projects">
              <Button label="Browse Projects" variant="primary" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <Link
                key={attempt.id}
                href={`/dashboard/student/attempts/${attempt.id}`}
                className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{attempt.project.title}</h3>
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium border ${getStatusColor(attempt.status)}`}
                      >
                        {attempt.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Domain: {attempt.project.domain} • Started:{" "}
                      {new Date(attempt.paidAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    {attempt.finalScore !== undefined && (
                      <div>
                        <p className="text-2xl font-bold text-violet-400">{attempt.finalScore}</p>
                        <p className="text-xs text-slate-400">Final Score</p>
                      </div>
                    )}
                    {attempt.autoScore !== undefined && attempt.finalScore === undefined && (
                      <div>
                        <p className="text-2xl font-bold text-amber-400">{attempt.autoScore}</p>
                        <p className="text-xs text-slate-400">AI Score</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
