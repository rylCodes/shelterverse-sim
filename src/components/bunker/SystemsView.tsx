import { SYSTEMS } from "@/lib/bunker/systems";
import { systemLevel, statusOf, stressedSystems } from "@/lib/bunker/simulation";
import type { Resources, SystemId } from "@/lib/bunker/types";

interface Props {
  selected: SystemId | null;
  onSelect: (id: SystemId | null) => void;
  resources: Resources;
}

export function SystemsView({ selected, onSelect, resources }: Props) {
  const stressed = stressedSystems(resources);
  const active = selected ? SYSTEMS.find((s) => s.id === selected) : null;

  return (
    <section aria-label="Explore systems" className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Explore systems
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {SYSTEMS.map((s) => {
          const level = systemLevel(s.id, resources);
          const st = statusOf(level);
          const on = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(on ? null : s.id)}
              className={`flex items-center justify-between gap-1 rounded border px-2 py-1.5 text-left transition-colors ${
                on ? "border-primary bg-primary/15" : "border-border bg-card/60 hover:border-primary/50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
                  {s.label}
                </span>
              </span>
              <span
                className="font-mono text-[10px] tabular-nums"
                style={{
                  color:
                    stressed.has(s.id) || st !== "ok"
                      ? st === "crit"
                        ? "var(--status-crit)"
                        : "var(--status-warn)"
                      : "var(--status-ok)",
                }}
              >
                {Math.round(level)}
              </span>
            </button>
          );
        })}
      </div>
      {active && (
        <div className="rounded border border-border bg-card/70 p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: active.color }}>
            {active.label} dependency chain
          </p>
          <p className="mt-1 font-mono text-[11px] text-foreground">{active.chain}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{active.description}</p>
        </div>
      )}
    </section>
  );
}
