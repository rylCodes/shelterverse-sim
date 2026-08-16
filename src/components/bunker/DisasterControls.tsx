import { SCENARIOS } from "@/lib/bunker/scenarios";
import type { ScenarioId } from "@/lib/bunker/types";
import { Activity, CloudLightning, Flame, PowerOff, Sun, Waves } from "lucide-react";

const ICONS = { sun: Sun, activity: Activity, waves: Waves, flame: Flame, "cloud-lightning": CloudLightning, "power-off": PowerOff } as const;

interface Props {
  scenario: ScenarioId;
  onSelect: (id: ScenarioId) => void;
}

export function DisasterControls({ scenario, onSelect }: Props) {
  const active = SCENARIOS.find((s) => s.id === scenario)!;
  return (
    <section aria-label="Disaster simulation" className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Simulate disaster
      </p>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {SCENARIOS.map((s) => {
          const Icon = ICONS[s.icon as keyof typeof ICONS];
          const on = scenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`flex items-center gap-1.5 rounded border px-2 py-2 text-left transition-colors ${
                on
                  ? s.id === "normal"
                    ? "border-[var(--status-ok)] bg-[var(--status-ok)]/12"
                    : "border-[var(--status-crit)] bg-[var(--status-crit)]/12"
                  : "border-border bg-card/60 hover:border-primary/50"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em]">{s.label}</span>
            </button>
          );
        })}
      </div>
      <div className="rounded border border-border bg-card/60 p-2.5">
        <p className="text-xs text-foreground">{active.summary}</p>
        <ul className="mt-1.5 space-y-0.5">
          {active.effects.map((e) => (
            <li key={e} className="flex gap-1.5 text-[11px] leading-snug text-muted-foreground">
              <span className="text-primary">›</span>
              {e}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
