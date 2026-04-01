import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-20 sm:px-8 lg:px-10">
        <div className="w-full rounded-[32px] border border-white/10 bg-slate-900/90 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
          <h1 className="text-4xl font-semibold text-white">Login to ProofWork</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Sign in with Google and finish onboarding to unlock student, company, and reviewer dashboards.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-400"
            >
              Sign in with Google
            </button>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
