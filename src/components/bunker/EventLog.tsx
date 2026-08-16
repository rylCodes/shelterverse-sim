import type { EventEntry, Status } from "@/lib/bunker/types";

const color: Record<Status, string> = {
  ok: "var(--status-ok)",
  warn: "var(--status-warn)",
  crit: "var(--status-crit)",
};

export function EventLog({ events, className = "" }: { events: EventEntry[]; className?: string }) {
  return (
    <section aria-label="Event log" className={`flex min-h-0 flex-col ${className}`}>
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Event log
      </p>
      <ol className="min-h-0 flex-1 space-y-1 overflow-y-auto rounded border border-border bg-card/50 p-2">
        {events.map((e) => (
          <li key={e.id} className="flex gap-2 font-mono text-[10.5px] leading-snug">
            <span className="shrink-0 tabular-nums text-muted-foreground">{e.time}</span>
            <span style={{ color: color[e.level] }}>{e.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
