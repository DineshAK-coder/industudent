"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getDomainColor, getDomainLabel, getDifficultyLabel } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Domain, Difficulty } from "@/types";
import confetti from "canvas-confetti";
import PaymentModal from "@/components/PaymentModal";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

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

type Tab = "overview" | "brief" | "rubric" | "submissions" | "faq";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isPaid, setIsPaid] = useState(false); // TODO: Check user session
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

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
  const daysLeft = Math.ceil(
    (new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Score distribution for histogram (mock data based on submissions)
  const scoreDistribution = [
    { range: "60-70", count: 2 },
    { range: "70-80", count: 3 },
    { range: "80-90", count: 4 },
    { range: "90-100", count: 3 },
  ];

  const verifyPayment = async (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const res = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        projectId: project.id,
        studentId: "user-1",
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Payment verification failed");
    setIsPaid(true);
    setPaymentMessage("Payment successful. Brief unlocked.");
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    if (data.data?.redirectTo) {
      window.location.href = data.data.redirectTo;
    }
  };

  const handleAttemptProject = async (totalAmount: number) => {
    setPaymentLoading(true);
    setPaymentMessage(null);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          amount: totalAmount,
          studentId: "user-1",
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      const order = orderData.data;
      const canUseRazorpay = typeof window !== "undefined" && Boolean(window.Razorpay);
      const keyId = order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (canUseRazorpay && order.mode === "live") {
        const instance = new window.Razorpay!({
          key: keyId,
          amount: order.amount,
          currency: order.currency,
          name: "ProofWork",
          description: project.title,
          order_id: order.id,
          handler: async (response: Record<string, string>) => {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          prefill: {
            name: "Student",
          },
          theme: {
            color: "#6C47FF",
          },
        });
        instance.open();
      } else {
        await verifyPayment({
          razorpayOrderId: order.id,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: "test_signature",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment failed";
      setPaymentMessage(message);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300 mb-4 inline-block">
            ← Back to Projects
          </Link>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Content */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-3 h-12 rounded ${domainColor}`} />
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
                  <div className="flex items-center gap-3">
                    {project.company.logoUrl ? (
                      <Image
                        src={project.company.logoUrl}
                        alt={project.company.companyName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-semibold text-white">
                        {project.company.companyName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-slate-300">{project.company.companyName}</span>
                    {project.company.verified && (
                      <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="px-3 py-1 bg-slate-800 rounded text-sm text-slate-300">
                  {getDomainLabel(project.domain as Domain)}
                </div>
                <div className="px-3 py-1 bg-amber-900/30 rounded text-sm text-amber-200">
                  {getDifficultyLabel(project.difficulty as Difficulty)}
                </div>
                {project.tags.map((tag) => (
                  <div key={tag} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Sidebar Preview */}
            <div className="lg:w-80">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="text-3xl font-bold text-orange-400 mb-1">
                  ₹{(project.attemptFee / 100).toFixed(0)}
                </div>
                <p className="text-sm text-slate-400 mb-6">Attempt fee</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Deadline</p>
                    <p className="text-lg font-semibold text-white">{daysLeft} days left</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Spots Remaining</p>
                    <div className="mt-2">
                      <p className="text-lg font-semibold text-white mb-2">
                        {project.spotsRemaining} of {project.maxAttempts}
                      </p>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-violet-500 h-2 rounded-full"
                          style={{
                            width: `${(project.spotsRemaining / project.maxAttempts) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  label={paymentLoading ? "Processing..." : "Attempt This Project"}
                  variant="primary"
                  className="w-full"
                  onClick={() => setPaymentModalOpen(true)}
                  disabled={paymentLoading}
                />

                <p className="text-xs text-slate-500 text-center mt-4">
                  This will unlock the project brief and submission guidelines
                </p>
                {paymentMessage && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-slate-300">{paymentMessage}</p>
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => setPaymentModalOpen(true)}
                        className="text-xs mt-1 underline text-violet-300 hover:text-violet-200"
                      >
                        Retry payment
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-800 bg-slate-950 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {(["overview", "brief", "rubric", "submissions", "faq"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium transition ${
                  activeTab === tab
                    ? "border-violet-500 text-violet-400"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About This Project</h2>
                <p className="text-slate-300 leading-7">{project.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">What You&apos;ll Need</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-violet-400">•</span>
                    <span>Python or R for data analysis</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-violet-400">•</span>
                    <span>Experience with pandas, SQL, or similar tools</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-violet-400">•</span>
                    <span>Visualization skills (matplotlib, seaborn, or equivalent)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">What You&apos;ll Submit</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-violet-400">•</span>
                    <span>Jupyter notebook or Python script (.ipynb or .py)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-violet-400">•</span>
                    <span>Analysis report (PDF) with visualizations and insights</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-violet-400">•</span>
                    <span>Your recommendations in a 1-page executive summary</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Reviewer</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    {project.reviewer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{project.reviewer.name}</p>
                    <p className="text-sm text-slate-400">{project.reviewer.role}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Company</p>
                    <p className="text-white">{project.reviewer.company}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Rating</p>
                    <p className="text-white">
                      ⭐ {project.reviewer.rating} ({project.reviewer.totalReviews} reviews)
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-slate-300">Full project brief (PDF)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-slate-300">Expert feedback from {project.reviewer.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-slate-300">Badge (if score &gt; 70)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-slate-300">Profile visibility to companies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Brief Tab */}
        {activeTab === "brief" && (
          <div className="text-center py-12">
            {isPaid ? (
              <div className="space-y-4">
                <p className="text-slate-400">Project brief unlocked. Preview below.</p>
                <div className="w-full h-[520px] rounded-lg border border-slate-800 overflow-hidden">
                  <iframe
                    title="Project brief"
                    src={project.briefUrl}
                    className="w-full h-full bg-slate-900"
                  />
                </div>
                <div className="flex justify-center gap-3">
                  <a
                    href={project.briefUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300 underline"
                  >
                    Open Brief in New Tab
                  </a>
                  {project.datasetUrl && (
                    <a
                      href={project.datasetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-300 hover:text-orange-200 underline"
                    >
                      Download Dataset
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-slate-400 mb-4">Complete your payment to unlock the project brief</p>
                <Button label="Unlock Brief (₹299)" variant="primary" onClick={() => setIsPaid(true)} />
              </div>
            )}
          </div>
        )}

        {/* Rubric Tab */}
        {activeTab === "rubric" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Evaluation Rubric</h2>
              <p className="text-slate-400 mb-6">
                Your submission will be evaluated on the following criteria. Total = 100 points.
              </p>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-slate-900 border-b border-slate-800">
                  <div className="px-4 py-3 font-semibold text-white">Criterion</div>
                  <div className="px-4 py-3 font-semibold text-white">Weight</div>
                  <div className="px-4 py-3 font-semibold text-white col-span-2">Description</div>
                </div>
                {project.rubric.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 border-b border-slate-800 hover:bg-slate-900/50 transition"
                  >
                    <div className="px-4 py-4 text-white font-medium">{item.criterion}</div>
                    <div className="px-4 py-4 text-slate-300">{item.weightage}%</div>
                    <div className="px-4 py-4 text-slate-300 col-span-2">{item.description}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
                <h3 className="font-semibold text-white mb-2">Scoring Guide</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>80-100: Excellent — exceeds expectations, clearly market-ready</p>
                  <p>60-80: Good — meets expectations, with room for improvement</p>
                  <p>&lt;60: Needs work — incomplete or significant gaps</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Leaderboard</h2>
              <p className="text-slate-400 mb-6">
                Anonymized rankings of top performers. Student names hidden as #1, #2, etc.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {project.submissions.map((submission) => (
                    <div
                      key={submission.rankNum}
                      className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-white font-bold">
                          {submission.rankNum}
                        </div>
                        <span className="text-white font-medium">Student #{submission.rankNum}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-violet-400">{submission.score}</p>
                        <p className="text-xs text-slate-400">points</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-4">Score Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="range" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                        }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

            {[
              {
                q: "How long do I have to complete this project?",
                a: `You have ${daysLeft} days from the project deadline. You can work at your own pace, but submission must be before the deadline.`,
              },
              {
                q: "Can I use AI tools like ChatGPT?",
                a: "Yes! We encourage using AI for research and reference. However, you must be able to explain every decision in your submission during a verification interview if your score is high enough.",
              },
              {
                q: "What if I don't complete it in time?",
                a: "Your attempt will be marked as incomplete. You can start a new attempt, but you'll need to pay the attempt fee again.",
              },
              {
                q: "How is my work evaluated?",
                a: "An expert reviewer will evaluate your work against the rubric criteria. You'll receive detailed feedback explaining their assessment.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
              >
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <PaymentModal
        open={paymentModalOpen}
        baseAmount={project.attemptFee}
        loading={paymentLoading}
        errorMessage={paymentMessage}
        onClose={() => setPaymentModalOpen(false)}
        onPay={(amount, tier) => {
          void tier;
          setPaymentModalOpen(false);
          void handleAttemptProject(amount);
        }}
      />
    </main>
  );
}
