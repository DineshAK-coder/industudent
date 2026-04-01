import { type Domain } from "@prisma/client";
import { DOMAIN_COLORS, DOMAIN_ICONS, DOMAIN_LABELS } from "@/lib/utils";

export function DomainTile({
  domain,
  activeProjects,
  avgScore,
}: {
  domain: Domain;
  activeProjects: number;
  avgScore: number;
}) {
  return (
    <div className="group rounded-[24px] border border-white/10 bg-slate-950/80 p-6 transition hover:border-violet-500/40 hover:bg-slate-900/90">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl">{DOMAIN_ICONS[domain]}</span>
        <div>
          <p className="text-sm font-semibold text-slate-300">{DOMAIN_LABELS[domain]}</p>
          <p className="mt-1 text-xs text-slate-500">{activeProjects} active projects</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-white/5 px-4 py-3">
        <p className="text-xs uppercase text-slate-500">Top performer avg score</p>
        <p className="mt-2 text-2xl font-semibold text-white">{avgScore}%</p>
      </div>
    </div>
  );
}
