"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const PANES = [
  {
    title: "Student",
    steps: ["Browse", "Pay", "Build", "Get Feedback", "Get Hired"],
    description: "Attempt real company briefs, earn verified feedback, and build a portfolio that companies trust.",
  },
  {
    title: "Company",
    steps: ["Post Brief", "Get Solutions", "Spot Talent", "Hire"],
    description: "Post live challenges, crowdsource high-quality answers, and discover screened student talent.",
  },
  {
    title: "Reviewer",
    steps: ["Apply", "Get Assigned", "Review", "Get Paid"],
    description: "Evaluate submissions, earn per review, and help students grow with structured feedback.",
  },
];

export function HowItWorksTabs() {
  const [active, setActive] = useState(0);
  const pane = PANES[active];

  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
      <div className="mb-6 flex flex-wrap gap-3">
        {PANES.map((item, index) => (
          <Button
            key={item.title}
            variant={index === active ? "primary" : "ghost"}
            onClick={() => setActive(index)}
            className="text-xs px-4 py-2"
          >
            {item.title}
          </Button>
        ))}
      </div>
      <div className="rounded-3xl bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">{pane.title} workflow</p>
        <p className="mt-3 text-lg font-semibold text-white">{pane.description}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {pane.steps.map((step) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-200">
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
