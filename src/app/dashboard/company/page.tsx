"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CompanyDashboard() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Company Dashboard</h1>
          <p className="text-slate-400">Manage your projects and talent pipeline</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Projects", value: "3", color: "bg-blue-500" },
            { label: "Total Submissions", value: "24", color: "bg-violet-500" },
            { label: "Shortlisted", value: "8", color: "bg-green-500" },
            { label: "Hired", value: "2", color: "bg-orange-500" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color}/20 border border-${stat.color.split("-")[1]}-700/50 rounded-lg p-6`}>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/company/projects" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">My Projects</h3>
            <p className="text-slate-400 text-sm mt-2">View and manage posted projects</p>
          </Link>

          <Link href="/dashboard/company/projects/new" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">Post New Project</h3>
            <p className="text-slate-400 text-sm mt-2">Create a new project brief</p>
          </Link>

          <Link href="/dashboard/company/talent" className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            <h3 className="text-lg font-semibold text-white">Talent Pipeline</h3>
            <p className="text-slate-400 text-sm mt-2">Review and hire candidates</p>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/dashboard/company/billing">
            <Button label="View Billing" variant="secondary" />
          </Link>
        </div>
      </div>
    </main>
  );
}
