import Link from "next/link";
import { GraduationCap, Search, Filter, Briefcase, ChevronRight, CircleOff } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    { title: "Optimize Checkout Flow", company: "Acme Corp", domain: "UI/UX Design", fee: "₹299", applications: 124, difficulty: "Medium", logo: "A" },
    { title: "Predict Customer Churn", company: "DataSync", domain: "Data Analytics", fee: "₹699", applications: 82, difficulty: "Hard", logo: "D" },
    { title: "Build Inventory REST API", company: "LogistiCore", domain: "Backend Dev", fee: "₹299", applications: 201, difficulty: "Medium", logo: "L" },
    { title: "D2C Marketing Campaign Strategy", company: "Glow Beauty", domain: "Marketing", fee: "₹699", applications: 45, difficulty: "Hard", logo: "G" },
    { title: "Financial Model for Cafe Expansion", company: "Beanery", domain: "Finance", fee: "₹1,499", applications: 32, difficulty: "Expert", logo: "B" },
    { title: "Write PRD for Mobile Onboarding", company: "FinSight", domain: "Product Management", fee: "₹299", applications: 156, difficulty: "Easy", logo: "F" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      {/* Navigation */}
      <nav className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <span className="bg-indigo-500 text-white rounded-md p-1">
              <GraduationCap className="w-5 h-5" />
            </span>
            <Link href="/">Industudent</Link>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/projects" className="text-sm text-white font-medium">Browse Projects</Link>
            <div className="h-6 w-px bg-zinc-800" />
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              JD
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Real-world Projects</h1>
            <p className="text-zinc-400">Prove your skills by solving real company problems.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="Search by domain, role, or company..." className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans" />
            </div>
            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
              <Filter className="w-4 h-4 text-zinc-400" /> Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <Link href={`/projects/${i}`} key={i} className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer flex flex-col justify-between h-full shadow-lg shadow-black/20">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xl text-zinc-300">
                    {project.logo}
                  </div>
                  <div className="px-2 py-1 rounded-full bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-700">
                    {project.difficulty}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                <p className="text-sm text-zinc-400 flex items-center gap-1.5 mb-6">
                  <Briefcase className="w-3.5 h-3.5" /> {project.company} &bull; {project.domain}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-0.5">Attempt Fee</span>
                  <span className="text-sm font-semibold text-white">{project.fee}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-indigo-400">
                  View Brief <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
