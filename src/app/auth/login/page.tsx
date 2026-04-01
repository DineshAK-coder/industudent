"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Construction } from "lucide-react";

function WipBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
      <Construction className="h-2.5 w-2.5" />
      WIP
    </span>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Completely bypass DB and NextAuth, just mock a successful login instantly
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_user_email", email);
    }
    
    router.push("/student-home");
  };


  return (
    <div className="dark min-h-screen bg-[#0e0e0f] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_50%_0%,_rgba(138,76,252,0.18),_transparent_60%)] blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Back link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-zinc-800 bg-[#131314] p-8 md:p-10 shadow-2xl"
        >
          {/* Logo + heading */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center text-2xl font-bold text-zinc-100">
              Industudent<span className="text-violet-500">.</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mt-4">Sign in to your account</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Access real projects, expert feedback, and hiring opportunities.
            </p>
          </div>

          {emailSent ? (
            /* ─── Email sent confirmation ─── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                <Mail className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Check your inbox</h3>
              <p className="text-sm text-zinc-400">
                We sent a sign-in link to{" "}
                <span className="text-violet-300 font-medium">{email}</span>.
                Click it to continue.
              </p>
              <button
                onClick={() => { setEmailSent(false); setEmailMode(false); setEmail(""); }}
                className="mt-6 text-sm text-zinc-500 hover:text-white transition-colors"
              >
                ← Use a different method
              </button>
            </motion.div>
          ) : emailMode ? (
            /* ─── Email input form ─── */
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleEmailSignIn}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Your email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-colors ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-violet-500 focus:ring-violet-500'}`}
                />
              </div>
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 font-semibold text-white hover:from-violet-500 hover:to-violet-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Send magic link
              </button>
              <button
                type="button"
                onClick={() => setEmailMode(false)}
                className="w-full text-sm text-zinc-500 hover:text-white transition-colors py-2"
              >
                ← Other sign-in options
              </button>
            </motion.form>
          ) : (
            /* ─── Provider buttons ─── */
            <div className="flex flex-col gap-3">

              {/* Google — WIP */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed select-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-40" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="opacity-50">Continue with Google</span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <WipBadge />
                </span>
              </motion.div>

              {/* GitHub — WIP */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed select-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current opacity-40" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span className="opacity-50">Continue with GitHub</span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <WipBadge />
                </span>
              </motion.div>

              {/* Apple — WIP */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.4 }}
                className="relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed select-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current opacity-40" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="opacity-50">Continue with Apple</span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <WipBadge />
                </span>
              </motion.div>

              {/* Divider */}
              <div className="my-1 flex items-center gap-4">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-xs text-zinc-600 uppercase tracking-widest">Or</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* Email — ACTIVE */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.4 }}
                onClick={() => setEmailMode(true)}
                className="relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl border border-violet-500/40 bg-violet-500/5 text-violet-300 hover:text-white hover:bg-violet-500/10 hover:border-violet-400/60 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Mail className="h-4 w-4" />
                Continue with Email
                <span className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                  ✓ Active
                </span>
              </motion.button>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-zinc-600">
            By signing in you agree to our{" "}
            <Link href="#" className="text-violet-400 hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="text-violet-400 hover:underline">Privacy Policy</Link>.
          </p>
        </motion.div>

        {/* Company partner link */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Are you a company?{" "}
          <Link href="/auth/company-login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
            Partner with us →
          </Link>
        </p>
      </div>
    </div>
  );
}
