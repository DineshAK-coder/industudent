"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/AuthModal";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const words = "Your work speaks. Your resume doesn't have to.".split(" ");

  return (
    <div className="dark min-h-screen bg-[#0e0e0f] text-white selection:bg-violet-500/30 selection:text-violet-300 font-sans">

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal onClose={() => setIsAuthModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-zinc-800/30 bg-zinc-950/60 backdrop-blur-xl shadow-2xl shadow-black/40 flex justify-between items-center px-8 sm:px-12 py-3 z-50">
        <div className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center">
          Industudent<span className="text-violet-500">.</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#domains" className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm">Domains</Link>
          <Link href="#stats" className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm">Stats</Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium"
          >
            Log In
          </button>
          <Link
            href="/auth/company-login"
            className="bg-gradient-to-br from-[#8a4cfc] to-[#bd9dff] px-5 py-2 rounded-lg text-black text-sm font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            Partner with Us
          </Link>
        </div>
      </nav>

      <main>
        {/* ─── Hero ─── */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,_rgba(138,76,252,0.22),_transparent_55%)] blur-3xl" />

          {/* Headline */}
          <h1 className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl leading-[1.05] text-zinc-100 mb-8">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.09, duration: 0.5 }}
                className={`inline-block mr-[0.25em] ${
                  ["resume", "doesn't", "have", "to."].includes(word)
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#bd9dff] via-[#a67aff] to-[#c38bf5]"
                    : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="relative z-10 text-lg md:text-xl text-zinc-400 max-w-xl mx-auto mb-12 font-light leading-relaxed"
          >
            Attempt real projects. Get verified feedback. Get hired.
          </motion.p>

          {/* Single CTA - triggers student login */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="relative z-10"
          >
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-br from-[#8a4cfc] to-[#bd9dff] px-12 py-4 rounded-xl text-black font-bold text-lg shadow-xl shadow-violet-500/20 hover:scale-[1.03] active:scale-[0.98] transition-transform"
            >
              Get Started
            </button>
          </motion.div>
        </section>

        {/* ─── Key Stats ─── */}
        <section id="stats" className="max-w-7xl mx-auto px-6 md:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "₹4.2Cr", label: "Stipends Saved" },
              { value: "12,000+", label: "Projects Shipped" },
              { value: "340+", label: "Elite Hires" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-10 rounded-2xl bg-[#131314] border border-zinc-800 flex flex-col items-center justify-center text-center group hover:bg-[#201f21] hover:border-violet-500/30 transition-colors"
              >
                <span className="text-5xl md:text-6xl font-extrabold text-zinc-100 mb-2 group-hover:text-violet-400 transition-colors">
                  {stat.value}
                </span>
                <span className="text-sm uppercase tracking-widest text-zinc-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Domain Explorer ─── */}
        <section id="domains" className="max-w-7xl mx-auto px-6 md:px-8 py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-zinc-100 mb-4">Domain Explorer</h2>
              <p className="text-zinc-400 max-w-md">Find the technical track that matches your ambition. Verified projects by industry leaders.</p>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-violet-400 text-sm uppercase tracking-widest font-bold flex items-center gap-2 group"
            >
              View all tracks <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[600px]">
            {/* Data Engineering - Large, clicking triggers student login */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="md:col-span-2 md:row-span-2 bg-[#201f21] rounded-3xl p-8 border border-zinc-800 relative overflow-hidden group hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(138,76,252,0.12)] transition-all duration-500 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <span className="text-violet-400 text-xl">📊</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-violet-400 font-bold">In High Demand</span>
                </div>
                <h3 className="text-3xl font-bold text-zinc-100 mb-4">Data Engineering</h3>
                <p className="text-zinc-400 max-w-xs mb-8">Build robust pipelines and scalable architectures using modern data stacks.</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">840 Projects Active</span>
                <span className="font-bold text-zinc-100 group-hover:text-violet-400 transition-colors flex items-center gap-1">
                  Explore → <span className="text-xs opacity-60 font-normal">(Login required)</span>
                </span>
              </div>
            </motion.div>

            {/* UI Design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="md:col-span-2 bg-[#131314] rounded-3xl p-8 border border-zinc-800 hover:bg-[#201f21] hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(138,76,252,0.1)] transition-all group overflow-hidden cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                    <span className="text-purple-400">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-2">UI Design & Systems</h3>
                  <p className="text-sm text-zinc-400 max-w-xs">Master the art of architectural visual languages.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-2xl font-bold text-zinc-100">1.2k</span>
                  <span className="text-[10px] uppercase text-zinc-500">Submissions</span>
                </div>
              </div>
            </motion.div>

            {/* Back-end */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-[#131314] rounded-3xl p-8 border border-zinc-800 hover:bg-[#201f21] hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(138,76,252,0.1)] transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6">
                <span className="text-pink-400">⌨️</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Back-end</h3>
              <span className="text-xs text-zinc-500">320 Open Roles</span>
            </motion.div>

            {/* Analyst */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-[#131314] rounded-3xl p-8 border border-zinc-800 hover:bg-[#201f21] hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(138,76,252,0.1)] transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                <span className="text-blue-400">📈</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Analyst</h3>
              <span className="text-xs text-zinc-500">210 Verified Projects</span>
            </motion.div>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        {/* ─── Final CTAs ─── */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">Ready to curate your future?</h2>
            <p className="text-zinc-400 mb-12 text-lg">Join the network where proof of work is the only currency.</p>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* Jobseeker → student login modal */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center justify-between gap-8 bg-zinc-100 hover:bg-white text-zinc-950 px-8 py-6 rounded-2xl group transition-all hover:scale-[1.02]"
            >
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-widest block mb-1 opacity-60">I am a</span>
                <span className="text-2xl font-bold">Jobseeker</span>
              </div>
              <span className="group-hover:translate-x-2 transition-transform inline-block text-xl">→</span>
            </button>

            {/* Company → company onboarding */}
            <Link
              href="/auth/company-login"
              className="flex items-center justify-between gap-8 bg-[#201f21] border border-zinc-800 hover:border-violet-500/40 text-zinc-100 px-8 py-6 rounded-2xl group transition-all hover:scale-[1.02]"
            >
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-widest block mb-1 opacity-60">I am a</span>
                <span className="text-2xl font-bold">Company</span>
              </div>
              <span className="group-hover:translate-x-2 transition-transform inline-block text-xl">→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-zinc-100 flex items-center">
            Industudent<span className="text-violet-500">.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">Cookie Policy</Link>
          </div>
          <div className="text-sm text-zinc-500">
            © 2026 Industudent. Empowering the next generation.
          </div>
        </div>
      </footer>
    </div>
  );
}
