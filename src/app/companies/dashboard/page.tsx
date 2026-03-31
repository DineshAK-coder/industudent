import Link from "next/link";
import { GraduationCap, Plus, Users, PlayCircle, BarChart3, TrendingUp, Settings } from "lucide-react";

export default function CompanyDashboard() {
  const activeProjects = [
    { title: "Optimize Checkout Flow", submissions: 42, avgScore: "84/100", status: "Active", daysLeft: 4 },
    { title: "Redesign User Onboarding", submissions: 18, avgScore: "76/100", status: "Active", daysLeft: 12 },
  ];

  const recentCandidates = [
    { name: "Rahul S.", project: "Optimize Checkout Flow", score: 94, status: "Interviewing" },
    { name: "Priya M.", project: "Redesign User Onboarding", score: 91, status: "Reviewing" },
    { name: "Aman K.", project: "Optimize Checkout Flow", score: 88, status: "Reviewing" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/80">
          <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <span className="bg-white text-zinc-950 rounded-md p-1">
              <GraduationCap className="w-5 h-5" />
            </span>
            Industudent
          </Link>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-medium text-sm">
            <BarChart3 className="w-4 h-4 text-zinc-400" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-lg font-medium text-sm transition-colors">
            <PlayCircle className="w-4 h-4" /> Active Projects
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-lg font-medium text-sm transition-colors">
            <Users className="w-4 h-4" /> Candidates
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-lg font-medium text-sm transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
        <div className="p-4 border-t border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">
              AC
            </div>
            <div>
              <div className="text-sm font-medium">Acme Corp</div>
              <div className="text-xs text-zinc-500">Growth Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-zinc-950 h-screen overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800/80 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
          <h1 className="text-lg font-semibold">Overview</h1>
          <button className="flex items-center gap-2 bg-white text-zinc-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Post Project
          </button>
        </header>

        <div className="p-8 max-w-6xl w-full">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-zinc-400 text-sm font-medium mb-2">Total Submissions</div>
              <div className="text-3xl font-bold flex items-end gap-2">
                60 <span className="text-sm font-medium text-emerald-400 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12%</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-zinc-400 text-sm font-medium mb-2">Avg. Score</div>
              <div className="text-3xl font-bold">81.5</div>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-zinc-400 text-sm font-medium mb-2">Interviews Scheduled</div>
              <div className="text-3xl font-bold">3</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-400" /> Active Projects
              </h2>
              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Project Title</th>
                      <th className="px-6 py-4 font-medium">Submissions</th>
                      <th className="px-6 py-4 font-medium">Avg Score</th>
                      <th className="px-6 py-4 font-medium">Time Left</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {activeProjects.map((p, i) => (
                      <tr key={i} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                        <td className="px-6 py-4 text-zinc-300">{p.submissions}</td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">{p.avgScore}</td>
                        <td className="px-6 py-4 text-indigo-400">{p.daysLeft} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Top Candidates
              </h2>
              <div className="space-y-4">
                {recentCandidates.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-emerald-400 font-mono text-sm font-bold bg-emerald-400/10 px-2 py-0.5 rounded">{c.score}</div>
                    </div>
                    <div className="text-xs text-zinc-400 mb-3">{c.project}</div>
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className={c.status === "Interviewing" ? "text-indigo-400" : "text-zinc-500"}>{c.status}</span>
                      <span className="text-white hover:text-indigo-400 transition-colors">View Profile &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
