"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ReviewerDashboard() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Reviewer Dashboard</h1>
          <p className="text-slate-400">Manage your reviews and earnings</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Reviews", value: "5", color: "bg-amber-500" },
            { label: "Completed", value: "42", color: "bg-green-500" },
            { label: "Rating", value: "4.8★", color: "bg-yellow-500" },
            { label: "Pending Payout", value: "₹2,400", color: "bg-violet-500" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color}/20 border border-${stat.color.split("-")[1]}-700/50 rounded-lg p-6`}>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/reviewer/queue" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">Review Queue</h3>
            <p className="text-slate-400 text-sm mt-2">Start reviewing submissions</p>
          </Link>

          <Link href="/dashboard/reviewer/completed" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">Completed Reviews</h3>
            <p className="text-slate-400 text-sm mt-2">View history and feedback</p>
          </Link>

          <Link href="/dashboard/reviewer/earnings" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">Earnings</h3>
            <p className="text-slate-400 text-sm mt-2">Payout history and invoices</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
