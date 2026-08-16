import { RESOURCE_META, statusOf, sustainabilityDays, activeCascades } from "@/lib/bunker/simulation";
import { POPULATION_BREAKDOWN } from "@/lib/bunker/systems";
import type { SimState, Status } from "@/lib/bunker/types";
import { AlertTriangle, Users } from "lucide-react";

const color: Record<Status, string> = {
  ok: "var(--status-ok)",
  warn: "var(--status-warn)",
  crit: "var(--status-crit)",
};

function Gauge({ label, value, large }: { label: string; value: number; large?: boolean | undefined }) {
  const st = statusOf(value);
  const r = 20;
  const c = Math.PI * r; // half circle length
  const offset = c * (1 - value / 100);
  return (
    <div className="flex items-center gap-2.5 rounded border border-border bg-card/60 px-2.5 py-2">
      <svg width={48} height={28} viewBox="0 0 48 28" aria-hidden>
        <path d="M 4 25 A 20 20 0 0 1 44 25" fill="none" stroke="var(--concrete-light)" strokeWidth={5} strokeLinecap="round" />
        <path
          d="M 4 25 A 20 20 0 0 1 44 25"
          fill="none"
          stroke={color[st]}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms ease, stroke 400ms ease" }}
        />
      </svg>
      <div className="min-w-0 flex-1">
        <p className={`font-mono uppercase tracking-[0.16em] text-muted-foreground ${large ? "text-[11px]" : "text-[9px]"}`}>
          {label}
        </p>
        <p className={`font-mono tabular-nums ${large ? "text-xl" : "text-sm"}`} style={{ color: color[st] }}>
          {Math.round(value)}%
        </p>
      </div>
    </div>
  );
}

export function SurvivalDashboard({ state, large }: { state: SimState; large?: boolean }) {
  const days = sustainabilityDays(state.resources);
  const cascades = activeCascades(state.resources);

  return (
    <section aria-label="Survival dashboard" className="flex flex-col gap-2">
      <div className="flex items-center justify-between rounded border border-border bg-card/70 px-3 py-2">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <Users className="h-3.5 w-3.5" aria-hidden /> Population
        </span>
        <span className="font-mono text-base tabular-nums text-foreground">
          {state.population} <span className="text-muted-foreground">/ {state.capacity}</span>
        </span>
      </div>

      <div className={`grid gap-1.5 ${large ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-1"}`}>
        {RESOURCE_META.map((m) => (
          <Gauge key={m.key} label={m.label} value={state.resources[m.key]} large={large} />
        ))}
      </div>

      <div className="rounded border border-primary/40 bg-primary/10 px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Estimated sustainability
        </p>
        <p className="font-mono text-lg tabular-nums text-primary">~{days} days</p>
      </div>

      {cascades.length > 0 && (
        <div className="rounded border border-[var(--status-warn)]/50 bg-[var(--status-warn)]/10 p-2.5">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--status-warn)]">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> Cascading effects
          </p>
          <ul className="mt-1.5 space-y-1">
            {cascades.map((c) => (
              <li key={c.label} className="text-[11px] leading-snug text-foreground">
                <span className="font-mono uppercase text-[var(--status-warn)]">{c.label}</span>{" "}
                <span className="text-muted-foreground">→ {c.affects.join(", ")} warning</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!large && (
        <div className="rounded border border-border bg-card/50 p-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Population breakdown
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {POPULATION_BREAKDOWN.map((p) => (
              <li key={p.label} className="flex justify-between text-[11px] text-muted-foreground">
                <span>{p.label}</span>
                <span className="font-mono tabular-nums text-foreground">{p.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        Simulation values — for educational demonstration
      </p>
    </section>
  );
}
