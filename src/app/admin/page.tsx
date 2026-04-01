"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Platform management and metrics</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: "2,847", color: "bg-blue-500" },
            { label: "Projects", value: "156", color: "bg-violet-500" },
            { label: "Submissions", value: "892", color: "bg-green-500" },
            { label: "Revenue", value: "₹4.2Cr", color: "bg-orange-500" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color}/20 border border-${stat.color.split("-")[1]}-700/50 rounded-lg p-6`}>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Projects", href: "/admin/projects", desc: "Approve/reject briefs" },
            { title: "Users", href: "/admin/users", desc: "User management" },
            { title: "Reviewers", href: "/admin/reviewers", desc: "Reviewer verification" },
            { title: "Payments", href: "/admin/payments", desc: "Payment reconciliation" },
            { title: "Companies", href: "/admin/companies", desc: "Company verification" },
            { title: "Integrity", href: "/admin/integrity", desc: "AI detection reports" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-slate-400 text-sm mt-2">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
