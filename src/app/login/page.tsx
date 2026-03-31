import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex text-zinc-50 bg-zinc-950">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <Link href="/" className="flex items-center gap-2 mb-12 text-zinc-400 hover:text-white transition-colors w-fit">
          <GraduationCap className="w-6 h-6 text-indigo-500" />
          <span className="font-semibold text-xl tracking-tight text-white">Industudent</span>
        </Link>
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-zinc-400 mb-8">Sign in to your account to continue.</p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
              <input type="email" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans" placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-zinc-300">Password</label>
                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
              </div>
              <input type="password" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="••••••••" />
            </div>
            <button type="button" className="w-full bg-white text-zinc-950 font-semibold py-2.5 rounded-lg mt-6 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-zinc-400 border-t border-zinc-800/80 pt-6">
            Don't have an account? <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Create one</Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-zinc-900 p-12 flex-col justify-center relative overflow-hidden border-l border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10" />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px]" />
        
        <div className="max-w-md relative z-10 px-12">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-8 backdrop-blur-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-white leading-tight">Prove it.<br/>Don't just say it.</h2>
          <p className="text-lg text-zinc-400 leading-relaxed">Join the only marketplace built on merit. Your verified project submissions are your new resume. Top companies are waiting.</p>
        </div>
      </div>
    </div>
  );
}
