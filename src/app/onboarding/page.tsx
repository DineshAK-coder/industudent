"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Domain } from "@prisma/client";
import { DOMAIN_LABELS, DOMAIN_ICONS, cn } from "@/lib/utils";

type Role = "STUDENT" | "COMPANY" | "REVIEWER";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;
type CompanySize = (typeof COMPANY_SIZES)[number];

// ─── Step 1: Choose role ────────────────────────────────────────────────────
function RoleSelector({
  onSelect,
}: {
  onSelect: (role: Role) => void;
}) {
  const roles: { id: Role; title: string; desc: string; emoji: string }[] = [
    {
      id: "STUDENT",
      title: "I'm a Student",
      desc: "Attempt real-world case studies posted by companies and earn verified badges.",
      emoji: "🎓",
    },
    {
      id: "COMPANY",
      title: "I'm a Company",
      desc: "Post case study projects and discover top student talent through scored submissions.",
      emoji: "🏢",
    },
    {
      id: "REVIEWER",
      title: "I'm a Reviewer",
      desc: "Evaluate student submissions in your domain using structured rubrics and earn per review.",
      emoji: "⭐",
    },
  ];

  return (
    <div className="grid gap-4">
      {roles.map((r) => (
        <motion.button
          key={r.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(r.id)}
          className="group relative flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10"
        >
          <span className="text-3xl">{r.emoji}</span>
          <div>
            <p className="font-semibold text-white">{r.title}</p>
            <p className="mt-0.5 text-sm text-zinc-400">{r.desc}</p>
          </div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
            →
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// ─── Domain multi-select ────────────────────────────────────────────────────
function DomainPicker({
  selected,
  onChange,
  max = 3,
}: {
  selected: Domain[];
  onChange: (domains: Domain[]) => void;
  max?: number;
}) {
  const domains = Object.values(Domain);
  const toggle = (d: Domain) => {
    if (selected.includes(d)) {
      onChange(selected.filter((x) => x !== d));
    } else if (selected.length < max) {
      onChange([...selected, d]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {domains.map((d) => {
        const isSelected = selected.includes(d);
        return (
          <button
            key={d}
            type="button"
            onClick={() => toggle(d)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
              isSelected
                ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white",
              selected.length >= max && !isSelected && "cursor-not-allowed opacity-40"
            )}
          >
            <span>{DOMAIN_ICONS[d]}</span>
            <span>{DOMAIN_LABELS[d]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Input field ────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all",
        className
      )}
      {...props}
    />
  );
}

// ─── Student form ───────────────────────────────────────────────────────────
function StudentForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
}) {
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!college.trim()) e.college = "College is required";
    const y = parseInt(year);
    if (!y || y < 2020 || y > 2035) e.year = "Enter a valid graduation year (2020–2035)";
    if (domains.length === 0) e.domains = "Select at least one domain";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      role: "STUDENT",
      college,
      graduationYear: parseInt(year),
      domains,
      bio: bio || undefined,
      linkedinUrl: linkedin || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="College / University" error={errors.college}>
        <Input
          id="college"
          placeholder="e.g. IIT Bombay"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />
      </Field>
      <Field label="Graduation Year" error={errors.year}>
        <Input
          id="grad-year"
          type="number"
          placeholder="e.g. 2026"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min={2020}
          max={2035}
        />
      </Field>
      <Field label="Your domains (pick up to 3)" error={errors.domains}>
        <DomainPicker selected={domains} onChange={setDomains} />
      </Field>
      <Field label="Bio (optional)">
        <textarea
          id="bio"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
          rows={3}
          placeholder="Tell companies a bit about yourself…"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
        />
      </Field>
      <Field label="LinkedIn URL (optional)">
        <Input
          id="linkedin"
          placeholder="https://linkedin.com/in/username"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
        />
      </Field>
      <SubmitButton loading={loading} />
    </form>
  );
}

// ─── Company form ───────────────────────────────────────────────────────────
function CompanyForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
}) {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState<CompanySize | "">("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = "Company name is required";
    if (!industry.trim()) e.industry = "Industry is required";
    if (!size) e.size = "Select a company size";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      role: "COMPANY",
      companyName,
      industry,
      size,
      website: website || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Company Name" error={errors.companyName}>
        <Input
          id="company-name"
          placeholder="e.g. Acme Corp"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </Field>
      <Field label="Industry" error={errors.industry}>
        <Input
          id="industry"
          placeholder="e.g. Fintech, E-commerce, EdTech"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
      </Field>
      <Field label="Company Size" error={errors.size}>
        <div className="flex flex-wrap gap-2">
          {COMPANY_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                size === s
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
              )}
            >
              {s} employees
            </button>
          ))}
        </div>
      </Field>
      <Field label="Website (optional)">
        <Input
          id="website"
          placeholder="https://yourcompany.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </Field>
      <SubmitButton loading={loading} />
    </form>
  );
}

// ─── Reviewer form ──────────────────────────────────────────────────────────
function ReviewerForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
}) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [yearsExp, setYearsExp] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [rate, setRate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (domains.length === 0) e.domains = "Select at least one domain";
    const y = parseInt(yearsExp);
    if (!y || y < 1 || y > 50) e.yearsExp = "Enter valid years (1–50)";
    if (!currentRole.trim()) e.currentRole = "Current role is required";
    const r = parseInt(rate) * 100; // convert ₹ to paise
    if (!r || r < 10000 || r > 1000000) e.rate = "Rate must be ₹100–₹10,000 per review";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      role: "REVIEWER",
      domains,
      yearsExp: parseInt(yearsExp),
      currentRole,
      ratePerReview: parseInt(rate) * 100, // store in paise
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Your domains of expertise (pick up to 3)" error={errors.domains}>
        <DomainPicker selected={domains} onChange={setDomains} />
      </Field>
      <Field label="Years of Experience" error={errors.yearsExp}>
        <Input
          id="years-exp"
          type="number"
          placeholder="e.g. 5"
          value={yearsExp}
          onChange={(e) => setYearsExp(e.target.value)}
          min={1}
          max={50}
        />
      </Field>
      <Field label="Current Role / Title" error={errors.currentRole}>
        <Input
          id="current-role"
          placeholder="e.g. Senior Data Scientist at Google"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
        />
      </Field>
      <Field label="Rate per review (₹)" error={errors.rate}>
        <Input
          id="rate"
          type="number"
          placeholder="e.g. 500"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          min={100}
          max={10000}
        />
        <p className="text-xs text-zinc-500">Min ₹100 · Max ₹10,000 per review</p>
      </Field>
      <SubmitButton loading={loading} />
    </form>
  );
}

// ─── Submit button ──────────────────────────────────────────────────────────
function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      id="onboarding-submit"
      type="submit"
      disabled={loading}
      className="relative flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Setting up your profile…
        </span>
      ) : (
        "Complete Setup →"
      )}
    </button>
  );
}

// ─── Main onboarding page ───────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStep("details");
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      // Force session refresh and redirect to dashboard
      const dashboards: Record<Role, string> = {
        STUDENT: "/student",
        COMPANY: "/company",
        REVIEWER: "/reviewer",
      };

      router.push(dashboards[role!]);
      router.refresh(); // invalidate cached session
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleLabels: Record<Role, string> = {
    STUDENT: "Student Profile",
    COMPANY: "Company Profile",
    REVIEWER: "Reviewer Profile",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 py-16">
      {/* Background aurora */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-700/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-700/15 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <span className="text-xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {step === "role" ? "Welcome to InduStudent" : roleLabels[role!]}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {step === "role"
                ? "Tell us who you are to get started"
                : "A few more details to set up your profile"}
            </p>
          </div>

          {/* Step indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {["role", "details"].map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  step === s
                    ? "w-8 bg-indigo-500"
                    : i < ["role", "details"].indexOf(step)
                    ? "w-3 bg-indigo-500/50"
                    : "w-3 bg-white/10"
                )}
              />
            ))}
          </div>

          {/* Back button */}
          <AnimatePresence mode="wait">
            {step === "details" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setStep("role")}
                className="mb-4 flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                ← Back
              </motion.button>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === "role" && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <RoleSelector onSelect={handleRoleSelect} />
              </motion.div>
            )}
            {step === "details" && role === "STUDENT" && (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <StudentForm onSubmit={handleSubmit} loading={loading} />
              </motion.div>
            )}
            {step === "details" && role === "COMPANY" && (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <CompanyForm onSubmit={handleSubmit} loading={loading} />
              </motion.div>
            )}
            {step === "details" && role === "REVIEWER" && (
              <motion.div
                key="reviewer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <ReviewerForm onSubmit={handleSubmit} loading={loading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
