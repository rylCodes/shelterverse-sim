import { X } from "lucide-react";
import { roomById } from "@/lib/bunker/rooms";
import { floorById } from "@/lib/bunker/floors";
import { systemById } from "@/lib/bunker/systems";
import { roomStatus } from "@/lib/bunker/simulation";
import type { SimState, Status } from "@/lib/bunker/types";

const label: Record<Status, string> = { ok: "Nominal", warn: "Warning", crit: "Critical" };
const color: Record<Status, string> = {
  ok: "var(--status-ok)",
  warn: "var(--status-warn)",
  crit: "var(--status-crit)",
};

export function RoomInfoPanel({ state, onClose }: { state: SimState; onClose: () => void }) {
  if (!state.selectedRoom) return null;
  const room = roomById(state.selectedRoom);
  if (!room) return null;
  const st = roomStatus(room.id, state);
  const floor = floorById(room.floor);

  return (
    <aside className="rounded border border-border bg-card/85 p-3 backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            {floor.code} · {floor.short}
          </p>
          <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-foreground">{room.name}</h3>
        </div>
        <button onClick={onClose} aria-label="Close room panel" className="rounded border border-border p-1 text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{room.purpose}</p>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded border border-border bg-background/40 px-2 py-1.5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Status</dt>
          <dd className="font-mono text-xs" style={{ color: color[st] }}>{label[st]}</dd>
        </div>
        <div className="rounded border border-border bg-background/40 px-2 py-1.5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{room.metricLabel}</dt>
          <dd className="font-mono text-xs tabular-nums text-foreground">
            {room.metricBase}
            {room.metricUnit ? ` ${room.metricUnit}` : ""}
          </dd>
        </div>
      </dl>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Connected systems</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {room.systems.map((s) => (
          <span
            key={s}
            className="rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]"
            style={{ borderColor: systemById(s).color, color: systemById(s).color }}
          >
            {systemById(s).label}
          </span>
        ))}
      </div>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Why it matters</p>
      <p className="mt-1 text-xs leading-relaxed text-foreground">{room.why}</p>
    </aside>
  );
}
