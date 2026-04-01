"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, CheckCircle2 } from "lucide-react";

export default function CompanyLoginPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    linkedinUrl: "",
    websiteUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/company-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit verification request");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-[#0e0e0f] text-white selection:bg-violet-500/30 selection:text-violet-300 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-zinc-800 bg-[#131314] p-8 md:p-10 shadow-2xl"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-8">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="mb-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-violet-500">
                Details Received!
              </h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto">
                We will call you within 24-48 hours. Once called and approved, your company can access our employer plans and talent pool.
              </p>
              <Link
                href="/"
                className="mt-10 inline-flex items-center justify-center rounded-xl bg-zinc-800 px-6 py-3 font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                  <Building2 className="h-7 w-7 text-violet-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Company Verification</h1>
                <p className="text-zinc-400">
                  Please provide your official company details. Our team manually verifies every partner to ensure a high-quality talent pool.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-zinc-300 mb-2">
                    Official Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                    Official Email ID
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="founder@acmecorp.com"
                  />
                </div>

                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-zinc-300 mb-2">
                    Official LinkedIn Page URL
                  </label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    required
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="https://linkedin.com/company/acmecorp"
                  />
                </div>

                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-zinc-300 mb-2">
                    Official Web Page
                  </label>
                  <input
                    id="websiteUrl"
                    type="url"
                    required
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="https://acmecorp.com"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-4 font-bold text-white hover:from-violet-500 hover:to-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                        Submitting...
                      </span>
                    ) : (
                      "Request Verification"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
