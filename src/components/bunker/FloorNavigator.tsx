import { FLOORS } from "@/lib/bunker/floors";
import { Layers } from "lucide-react";

interface Props {
  selected: number | null;
  onSelect: (id: number | null) => void;
  compact?: boolean;
}

export function FloorNavigator({ selected, onSelect, compact }: Props) {
  return (
    <nav aria-label="Floor navigation" className="flex flex-col gap-1">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Navigate
      </p>
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 rounded border px-2.5 py-2 text-left font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
          selected === null
            ? "border-primary bg-primary/15 text-foreground"
            : "border-border bg-card/60 text-muted-foreground hover:border-primary/60 hover:text-foreground"
        }`}
      >
        <Layers className="h-3.5 w-3.5" aria-hidden /> Overview
      </button>
      {FLOORS.map((f) => (
        <button
          key={f.id}
          onClick={() => onSelect(f.id)}
          className={`group flex items-center gap-2 rounded border px-2.5 py-1.5 text-left transition-colors ${
            selected === f.id
              ? "border-primary bg-primary/15 text-foreground"
              : "border-border bg-card/60 text-muted-foreground hover:border-primary/60 hover:text-foreground"
          }`}
        >
          <span className="font-mono text-[11px] tabular-nums text-primary">{f.code}</span>
          {!compact && (
            <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em]">
              {f.short}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
