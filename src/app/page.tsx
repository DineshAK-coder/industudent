import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Briefcase, GraduationCap, Code, LineChart, PenTool } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Navigation */}
      <nav className="w-full border-b border-zinc-800/40 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <span className="bg-indigo-500 text-white rounded-md p-1">
              <GraduationCap className="w-5 h-5" />
            </span>
            Industudent
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/projects" className="text-sm text-zinc-400 hover:text-white transition-colors">Browse Projects</Link>
            <Link href="/companies" className="text-sm text-zinc-400 hover:text-white transition-colors">For Companies</Link>
            <Link href="/login" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full relative px-6 py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Now accepting early access companies
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 pb-2">
          Your work speaks. <br className="hidden md:block"/> Not your resume.
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
          The "Learn by Doing" Project Marketplace where students prove their skills by solving real-world company problems, and get hired for exactly what they can do.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/projects" className="group rounded-full bg-white text-zinc-950 px-8 py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
            Start a Project
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/companies" className="rounded-full bg-white/5 border border-white/10 text-white px-8 py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            Post a Problem
          </Link>
        </div>
        
        <div className="mt-16 flex items-center gap-8 text-sm text-zinc-500 font-medium hidden sm:flex">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real Company Data</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Expert Reviewed</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Skill Badges</div>
        </div>
      </section>

      {/* Domain Categories */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-zinc-800/40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Prove your skills in any domain</h2>
            <p className="text-zinc-400 max-w-xl">Tackle 4-12 hour mini-projects created by series B+ startups and enterprises looking for verified talent.</p>
          </div>
          <Link href="/projects" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 mt-4 md:mt-0 transition-colors">
            View all projects <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Data Analytics", icon: LineChart, desc: "Clean datasets, find insights, build models.", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
            { name: "UI/UX Design", icon: PenTool, desc: "Redesign flows, improve conversion.", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
            { name: "Backend Dev", icon: Code, desc: "Build REST APIs, optimize queries.", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
            { name: "Product Management", icon: Briefcase, desc: "Write PRDs, analyze user interviews.", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
          ].map((domain, i) => (
            <div key={i} className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer overflow-hidden">
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-6 ${domain.color}`}>
                <domain.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{domain.name}</h3>
              <p className="text-sm text-zinc-400">{domain.desc}</p>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5 text-zinc-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="w-full bg-zinc-900 border-t border-b border-zinc-800/40 py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Stop paying for theory. Start getting paid for results.</h2>
            <div className="space-y-6">
              {[
                { title: "Affordable Attempt Fees", desc: "Pay a fraction of bootcamp costs. Get access to the real problem brief and automated or manual expert reviews." },
                { title: "Structured Feedback", desc: "Whether you succeed or fail, you get actionable feedback from industry professionals. Every attempt is a learning loop." },
                { title: "Direct Pipeline to Interviews", desc: "Top submissions are automatically flagged to the hiring teams. No resume screening, no cold DMs. Just proof of work." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 shrink-0">
                    <span className="text-zinc-300 font-bold">{i+1}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-sm text-zinc-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent blur-3xl rounded-full" />
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
              <div className="flex items-center gap-4 border-b border-zinc-800 pb-6 mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Acme Corp Frontend Challenge</h3>
                  <p className="text-sm text-zinc-400">Optimize cart checkout flow</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-sm text-zinc-300">Your Submission Score</span>
                  <span className="text-emerald-400 font-mono font-bold">92/100</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-sm text-zinc-300">Company Status</span>
                  <span className="text-indigo-400 font-medium text-sm flex items-center gap-1">Interview Requested <ArrowRight className="w-3 h-3"/></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-zinc-400">
           <GraduationCap className="w-5 h-5" />
           <span className="font-semibold text-zinc-300">Industudent</span> &copy; {new Date().getFullYear()}
        </div>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="/about" className="hover:text-zinc-300">About</Link>
          <Link href="/pricing" className="hover:text-zinc-300">Pricing</Link>
          <Link href="/terms" className="hover:text-zinc-300">Terms</Link>
          <Link href="/privacy" className="hover:text-zinc-300">Privacy</Link>
        </div>
      </footer>
    </main>
  );
}
