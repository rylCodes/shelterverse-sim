import { Pause, Play, RotateCcw } from "lucide-react";

interface Props {
  day: number;
  hour: number;
  minute: number;
  running: boolean;
  onToggleRun: () => void;
  onAdvance: (days: number) => void;
  onReset: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function TimeControls({ day, hour, minute, running, onToggleRun, onAdvance, onReset }: Props) {
  const btn =
    "rounded border border-border bg-card/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10";
  return (
    <section aria-label="Time simulation" className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 font-mono text-[11px] tabular-nums text-primary">
        DAY {pad(day)} · {pad(hour)}:{pad(minute)}
      </span>
      <button onClick={onToggleRun} className={btn} aria-pressed={running}>
        {running ? <Pause className="mr-1 inline h-3 w-3" /> : <Play className="mr-1 inline h-3 w-3" />}
        {running ? "Running" : "Paused"}
      </button>
      <button onClick={() => onAdvance(1)} className={btn}>+1 day</button>
      <button onClick={() => onAdvance(7)} className={btn}>+7 days</button>
      <button onClick={() => onAdvance(30)} className={btn}>+30 days</button>
      <button onClick={onReset} className={btn}>
        <RotateCcw className="mr-1 inline h-3 w-3" />
        Reset
      </button>
    </section>
  );
}
