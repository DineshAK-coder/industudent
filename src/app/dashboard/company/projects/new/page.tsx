"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

const DOMAINS: string[] = ["DATA", "DESIGN", "MARKETING", "FINANCE", "BACKEND", "PRODUCT", "SUPPLY_CHAIN"];
const DIFFICULTIES: string[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    difficulty: "",
    estimatedHours: "",
    attemptFee: "",
    maxAttempts: "",
    briefUrl: "",
    tagsRaw: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDomainSelect = (domain: string) => {
    setFormData((prev) => ({ ...prev, domain }));
  };
  
  const handleDifficultySelect = (difficulty: string) => {
    setFormData((prev) => ({ ...prev, difficulty }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimatedHours: parseInt(formData.estimatedHours),
          attemptFee: parseInt(formData.attemptFee) * 100, // Convert to paise
          maxAttempts: parseInt(formData.maxAttempts),
          tags: formData.tagsRaw.split(",").map(t => t.trim()).filter(Boolean)
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/company");
      }, 2000);
      
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 pb-20">
      
      {/* Sticky Header Nav */}
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/company" className="text-sm font-medium text-slate-400 hover:text-white transition">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
             {success && <span className="text-sm font-medium text-emerald-400">Project saved! Redirecting...</span>}
             <Button 
                label={isSubmitting ? "Publishing..." : "Publish Project"} 
                variant="primary" 
                onClick={handleSubmit} 
                className="py-2"
                disabled={isSubmitting || success}
              />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="mb-10 lg:mb-16">
           <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">Draft a New Project</h1>
           <p className="text-lg text-slate-400">Provide a comprehensive brief to attract top vetted talent on the platform.</p>
        </div>

        {errorMsg && (
          <div className="p-4 mb-8 border border-rose-500/30 bg-rose-500/10 rounded-xl text-rose-400 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section: Basic Details */}
          <section className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
             <div className="pb-4 border-b border-slate-800 mb-6">
               <h2 className="text-xl font-bold text-white">1. Core Information</h2>
               <p className="text-sm text-slate-400 mt-1">The title and main problem statement.</p>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Project Title</label>
                <input 
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Design a Mobile App Dashboard"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition"
                  value={formData.title}
                  onChange={handleChange}
                />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Project Description</label>
                <textarea 
                  name="description"
                  required
                  rows={4}
                  placeholder="A concise summary of what needs to be accomplished..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition resize-y"
                  value={formData.description}
                  onChange={handleChange}
                />
             </div>
          </section>

          {/* Section: Classification */}
          <section className="space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
             <div className="pb-4 border-b border-slate-800 mb-6">
               <h2 className="text-xl font-bold text-white">2. Classification</h2>
               <p className="text-sm text-slate-400 mt-1">Categorize the requirements for appropriate jobseeker targeting.</p>
             </div>
             
             <div className="space-y-3">
               <label className="text-sm font-semibold text-slate-300">Target Domain</label>
               <div className="flex flex-wrap gap-3">
                 {DOMAINS.map(domain => (
                   <button
                     key={domain}
                     type="button"
                     onClick={() => handleDomainSelect(domain)}
                     className={`px-4 py-2 rounded-full text-xs font-bold transition-colors border ${formData.domain === domain ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                   >
                     {domain}
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-3">
               <label className="text-sm font-semibold text-slate-300">Complexity / Difficulty</label>
               <div className="flex flex-wrap gap-3">
                 {DIFFICULTIES.map(difficulty => (
                   <button
                     key={difficulty}
                     type="button"
                     onClick={() => handleDifficultySelect(difficulty)}
                     className={`px-4 py-2 rounded-full text-xs font-bold transition-colors border ${formData.difficulty === difficulty ? 'bg-orange-600/20 border-orange-500/50 text-orange-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                   >
                     {difficulty}
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Tags / Required Skills</label>
                <input 
                  name="tagsRaw"
                  type="text"
                  placeholder="e.g. React, UX/UI, Node.js (Comma separated)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition"
                  value={formData.tagsRaw}
                  onChange={handleChange}
                />
             </div>
          </section>

          {/* Section: Economics & Delivery */}
          <section className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
             <div className="pb-4 border-b border-slate-800 mb-6">
               <h2 className="text-xl font-bold text-white">3. Logistics</h2>
               <p className="text-sm text-slate-400 mt-1">Set the expectations for compensation, time, and deliverables.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Attempt Fee (₹)</label>
                  <input 
                    name="attemptFee"
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-violet-500 transition"
                    value={formData.attemptFee}
                    onChange={handleChange}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Estimated Hours</label>
                  <input 
                    name="estimatedHours"
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 8"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-violet-500 transition"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Max Spots Available</label>
                  <input 
                    name="maxAttempts"
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 50"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-violet-500 transition"
                    value={formData.maxAttempts}
                    onChange={handleChange}
                  />
               </div>
            </div>
            
            <div className="space-y-2 mt-6 border-t border-slate-800 pt-6">
                <label className="text-sm font-semibold text-slate-300 flex justify-between">
                  <span>Project Brief URL (PDF/MD)</span>
                </label>
                <input 
                  name="briefUrl"
                  type="url"
                  required
                  placeholder="https://your-hosting.com/brief.pdf"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition"
                  value={formData.briefUrl}
                  onChange={handleChange}
                />
             </div>
          </section>

        </form>
      </div>

    </main>
  );
}
