"use client";

import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface TimelineStep {
  label: string;
  status: "pending" | "completed" | "current";
  date?: Date;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
}

export function StatusTimeline({ steps }: StatusTimelineProps) {
  return (
    <div className="relative">
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4">
            {/* Icon */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  step.status === "completed"
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : step.status === "current"
                      ? "bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse"
                      : "bg-slate-800/50 border-slate-700 text-slate-500"
                }`}
              >
                {step.status === "completed" && <CheckCircle2 size={24} />}
                {step.status === "current" && <Clock size={24} />}
                {step.status === "pending" && <AlertCircle size={24} />}
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`w-1 h-12 my-2 ${
                    step.status === "completed" ? "bg-green-500/50" : "bg-slate-700/50"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="pt-2">
              <p
                className={`font-semibold text-sm ${
                  step.status === "completed"
                    ? "text-green-400"
                    : step.status === "current"
                      ? "text-blue-400"
                      : "text-slate-500"
                }`}
              >
                {step.label}
              </p>
              {step.date && (
                <p className="text-xs text-slate-500 mt-1">
                  {step.date.toLocaleDateString()} at{" "}
                  {step.date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
