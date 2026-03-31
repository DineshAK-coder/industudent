import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex text-zinc-50 bg-zinc-950">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <Link href="/" className="flex items-center gap-2 mb-12 text-zinc-400 hover:text-white transition-colors w-fit">
          <GraduationCap className="w-6 h-6 text-indigo-500" />
          <span className="font-semibold text-xl tracking-tight text-white">Industudent</span>
        </Link>
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create your account</h1>
          <p className="text-zinc-400 mb-8">Join the marketplace and start proving your skills.</p>
          <div className="flex gap-4 mb-6">
            <button className="flex-1 py-2.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-100 font-medium text-sm flex items-center justify-center gap-2 ring-1 ring-indigo-500/50">
              I am a Student
            </button>
            <button className="flex-1 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-medium text-sm transition-colors">
              I am a Company
            </button>
          </div>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">First Name</label>
                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Last Name</label>
                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
              <input type="email" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
              <input type="password" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="••••••••" />
            </div>
            <button type="button" className="w-full bg-indigo-500 text-white font-semibold py-2.5 rounded-lg mt-6 hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-zinc-400 border-t border-zinc-800/80 pt-6">
            Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Log in</Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-zinc-900 p-12 flex-col justify-center relative overflow-hidden border-l border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px]" />
        
        <div className="max-w-md relative z-10 px-12 ml-auto">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-8 backdrop-blur-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-white leading-tight">Stop paying.<br/>Start proving.</h2>
          <p className="text-lg text-zinc-400 leading-relaxed">Join 4,000+ students getting hired purely on their skill and project performance, without ever submitting a standard resume.</p>
        </div>
      </div>
    </div>
  );
}
