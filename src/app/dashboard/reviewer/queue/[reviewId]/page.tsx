"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface Review {
  id: string;
  attemptId: string;
  projectId: string;
  project: { title: string; rubric: Array<{ criterion: string; weightage: number }> };
  attempt: {
    submissionUrl: string;
    autoScore: number;
    submissionNote: string;
  };
  scores?: Record<string, number>;
}
type RubricItem = {
  criterion: string;
  weightage: number;
};

export default function ReviewerWorkspacePage() {
  const params = useParams();
  const reviewId = params.reviewId as string;

  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [hireRecommend, setHireRecommend] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/reviews/${reviewId}`);
        const data = await res.json();

        if (data.success) {
          setReview(data.data);
          // Initialize scores
          const initialScores: Record<string, number> = {};
          data.data.project.rubric.forEach((r: RubricItem) => {
            initialScores[r.criterion] = 50;
          });
          setScores(initialScores);
        }
      } catch (error) {
        console.error("Failed to fetch review:", error);
      } finally {
        setLoading(false);
      }
    };

    if (reviewId) {
      fetchReview();
    }
  }, [reviewId]);

  const handleSubmit = async () => {
    if (feedback.split(/\s+/).length < 100) {
      alert("Feedback must be at least 100 words");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: review?.attemptId,
          reviewerId: "reviewer-1", // TODO: from session
          projectId: review?.projectId,
          scores,
          overallScore: calculateOverallScore(),
          writtenFeedback: feedback,
          strengthPoints: strengths,
          improvPoints: improvements,
          hireRecommend,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Review submitted! You'll earn ₹${data.data.payout}`);
        // Redirect to reviews list
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateOverallScore = () => {
    if (!review) return 0;
    let total = 0;
    let weights = 0;
    review.project.rubric.forEach((criterion) => {
      total += (scores[criterion.criterion] || 0) * (criterion.weightage / 100);
      weights += criterion.weightage;
    });
    return Math.round(total);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading review...</div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Review not found</p>
          <Link href="/dashboard/reviewer/queue" className="text-violet-400">
            Back to queue
          </Link>
        </div>
      </div>
    );
  }

  const rubricValid = review.project.rubric.every((r) => scores[r.criterion] !== undefined);
  const feedbackWordCount = feedback.split(/\s+/).length;
  const canSubmit = rubricValid && feedbackWordCount >= 100;

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/dashboard/reviewer/queue" className="text-sm text-violet-400 hover:text-violet-300">
            ← Back to Queue
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">{review.project.title}</h1>
        </div>
      </div>

      {/* Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto px-6 py-8 min-h-screen">
        {/* Left Panel - Submission Viewer (60%) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Student Submission</h2>

            {/* Auto-Score Reference */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-wide">AI Auto-Score (Reference Only)</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{review.attempt.autoScore}</p>
              <p className="text-sm text-slate-400 mt-1">Use this as guidance, not a binding score</p>
            </div>

            {/* Submission Note */}
            {review.attempt.submissionNote && (
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Student Note</p>
                <p className="text-slate-300">{review.attempt.submissionNote}</p>
              </div>
            )}

            {/* PDF/File Viewer */}
            <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-lg p-8 text-center min-h-96 flex items-center justify-center">
              <div>
                <p className="text-slate-400">📄 Submission file viewer would display here</p>
                <a
                  href={review.attempt.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 mt-4 inline-block underline"
                >
                  Download Submission
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Scoring (40%) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sticky top-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-6">Review Form</h2>

            {/* Rubric Scoring */}
            <div className="space-y-6 mb-6">
              {review.project.rubric.map((criterion) => (
                <div key={criterion.criterion}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-white">
                      {criterion.criterion}
                      <span className="text-xs text-slate-400 ml-2">({criterion.weightage}%)</span>
                    </label>
                    <span className="text-lg font-bold text-violet-400">{scores[criterion.criterion] || 0}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores[criterion.criterion] || 50}
                    onChange={(e) =>
                      setScores({ ...scores, [criterion.criterion]: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Poor (0)</span>
                    <span>Excellent (100)</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Score */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-wide">Weighted Score</p>
              <p className="text-3xl font-bold text-violet-400 mt-2">{calculateOverallScore()}</p>
            </div>

            {/* Written Feedback */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Written Feedback (min 100 words)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback on the submission..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-24"
              />
              <p className="text-xs text-slate-400 mt-1">
                {feedbackWordCount} / 100 words
              </p>
            </div>

            {/* Strengths & Improvements */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Strengths</label>
                <input
                  type="text"
                  placeholder="Add a strength"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                      setStrengths([...strengths, (e.target as HTMLInputElement).value]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {strengths.map((s, idx) => (
                    <div key={idx} className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-xs">
                      {s} ×
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Areas for Improvement</label>
                <input
                  type="text"
                  placeholder="Add an area"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                      setImprovements([...improvements, (e.target as HTMLInputElement).value]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {improvements.map((imp, idx) => (
                    <div key={idx} className="bg-amber-900/30 text-amber-300 px-2 py-1 rounded text-xs">
                      {imp} ×
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hire Recommendation */}
            <label className="flex items-center gap-2 cursor-pointer mb-6 p-3 bg-slate-800/30 rounded">
              <input
                type="checkbox"
                checked={hireRecommend}
                onChange={(e) => setHireRecommend(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-300">Recommend for hire</span>
            </label>

            {/* Submit Button */}
            <Button
              label={submitting ? "Submitting..." : "Submit Review"}
              variant={canSubmit ? "primary" : "secondary"}
              className="w-full"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            />

            <p className="text-xs text-slate-500 text-center mt-2">
              You&apos;ll earn ₹200-500 for this review
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
