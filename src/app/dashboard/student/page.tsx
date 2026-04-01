"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function StudentDashboard() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-slate-400">Track your attempts and earn badges</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Attempts", value: "3", color: "bg-blue-500" },
            { label: "Total Score", value: "87", color: "bg-violet-500" },
            { label: "Badges Earned", value: "2", color: "bg-green-500" },
            { label: "Earnings", value: "₹0", color: "bg-orange-500" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color}/20 border border-${stat.color.split("-")[1]}-700/50 rounded-lg p-6`}>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/student/attempts" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">My Attempts</h3>
            <p className="text-slate-400 text-sm mt-2">View all submissions and feedback</p>
          </Link>

          <Link href="/dashboard/student/profile" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">My Profile</h3>
            <p className="text-slate-400 text-sm mt-2">Edit profile and resume</p>
          </Link>

          <Link href="/dashboard/student/badges" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">Badges</h3>
            <p className="text-slate-400 text-sm mt-2">View your achievements</p>
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Recommended For You</h2>
          <Link href="/projects" className="inline-block">
            <Button label="Browse Projects" variant="primary" />
          </Link>
        </div>
      </div>
    </main>
  );
}
