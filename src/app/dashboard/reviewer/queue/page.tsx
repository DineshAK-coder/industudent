"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Review {
  id: string;
  status: string;
  project: { title: string };
  attempt: { autoScore: number };
  student: { name: string };
}

export default function ReviewerQueuePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch(`/api/reviews?reviewerId=reviewer-1&status=PENDING`);
        const data = await res.json();

        if (data.success) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch queue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard/reviewer" className="text-sm text-violet-400 hover:text-violet-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Review Queue</h1>
          <p className="text-slate-400">
            {reviews.length} {reviews.length === 1 ? "submission" : "submissions"} waiting for review
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-slate-400 text-center py-12">Loading queue...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-slate-400">No submissions waiting for review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/dashboard/reviewer/queue/${review.id}`}
                className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{review.project.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">AI Score: {review.attempt.autoScore}/100</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-violet-400">Start Review →</p>
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
