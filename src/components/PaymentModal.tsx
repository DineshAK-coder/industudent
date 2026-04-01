"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type FeeTier = "standard" | "priority" | "premium";

interface PaymentModalProps {
  open: boolean;
  baseAmount: number;
  loading: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onPay: (totalAmount: number, tier: FeeTier) => void;
}

const TIER_MULTIPLIER: Record<FeeTier, number> = {
  standard: 1,
  priority: 1.2,
  premium: 1.4,
};

const TIER_LABELS: Record<FeeTier, string> = {
  standard: "Standard Review",
  priority: "Priority Review (24h)",
  premium: "Premium Review + Mentor Notes",
};

export default function PaymentModal({
  open,
  baseAmount,
  loading,
  errorMessage,
  onClose,
  onPay,
}: PaymentModalProps) {
  const [tier, setTier] = useState<FeeTier>("standard");
  if (!open) return null;

  const subtotal = Math.round(baseAmount * TIER_MULTIPLIER[tier]);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h3 className="text-xl font-semibold text-white mb-2">Complete Payment</h3>
        <p className="text-sm text-slate-400 mb-6">
          Unlock project brief, rubric submission, and expert review.
        </p>

        <div className="space-y-3 mb-6">
          {(Object.keys(TIER_LABELS) as FeeTier[]).map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setTier(key)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                key === tier
                  ? "border-violet-500 bg-violet-900/20 text-violet-200"
                  : "border-slate-700 text-slate-300"
              }`}
            >
              {TIER_LABELS[key]}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-slate-700 p-4 mb-6 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Base fee</span>
            <span>₹{(subtotal / 100).toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-slate-300 mt-2">
            <span>GST (18%)</span>
            <span>₹{(gst / 100).toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-white font-semibold mt-3 pt-3 border-t border-slate-700">
            <span>Total</span>
            <span>₹{(total / 100).toFixed(0)}</span>
          </div>
        </div>

        {errorMessage && <p className="text-sm text-red-300 mb-4">{errorMessage}</p>}

        <div className="flex gap-3">
          <Button
            label="Cancel"
            variant="ghost"
            className="w-full"
            onClick={onClose}
            disabled={loading}
          />
          <Button
            label={loading ? "Processing..." : "Pay Now"}
            variant="primary"
            className="w-full"
            onClick={() => onPay(total, tier)}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
