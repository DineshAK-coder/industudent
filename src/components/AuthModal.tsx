"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { X, Building2, GraduationCap } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-[#0e0e0f] shadow-2xl p-6 md:p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to Industudent</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Are you joining us to showcase your skills, or to discover top talent?
          </p>
        </div>

        <div className="grid gap-4">
          {/* Jobseeker → goes to login page */}
          <Link
            href="/auth/login"
            className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-[#131314] p-4 transition-all hover:border-violet-500/40 hover:bg-[#201f21] hover:shadow-[0_0_20px_rgba(138,76,252,0.1)]"
          >
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">I am a Jobseeker</h3>
                <p className="text-xs text-zinc-400">Attempt projects and get hired</p>
              </div>
            </div>
            <div className="text-zinc-600 group-hover:text-violet-400 transition-colors text-lg">→</div>
          </Link>

          {/* Company → goes to company onboarding */}
          <Link
            href="/auth/company-login"
            className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-[#131314] p-4 transition-all hover:border-violet-500/40 hover:bg-[#201f21] hover:shadow-[0_0_20px_rgba(138,76,252,0.1)]"
          >
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">I am a Company</h3>
                <p className="text-xs text-zinc-400">Partner with us & source talent</p>
              </div>
            </div>
            <div className="text-zinc-600 group-hover:text-violet-400 transition-colors text-lg">→</div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
