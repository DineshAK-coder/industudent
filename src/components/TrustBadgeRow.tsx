import { Button } from "@/components/ui/Button";

const TRUST_BADGES = [
  "2,400+ students",
  "180+ companies",
  "94% feedback rating",
];

export function TrustBadgeRow() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {TRUST_BADGES.map((badge) => (
        <div key={badge} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
          {badge}
        </div>
      ))}
    </div>
  );
}
