import { Fixtures } from "./Fixtures";
import { roomRect } from "@/lib/bunker/flows";
import type { RoomDef, Status, SystemId } from "@/lib/bunker/types";
import { systemById } from "@/lib/bunker/systems";

interface Props {
  room: RoomDef;
  status: Status;
  selected: boolean;
  dimmed: boolean;
  emergency: boolean;
  onSelect: (id: string) => void;
}

const statusColor: Record<Status, string> = {
  ok: "var(--status-ok)",
  warn: "var(--status-warn)",
  crit: "var(--status-crit)",
};

function truncate(name: string, w: number) {
  const max = Math.max(3, Math.floor(w / 4.6));
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

export function Room({ room, status, selected, dimmed, emergency, onSelect }: Props) {
  const rect = roomRect(room.id);
  const primary: SystemId = room.systems[0] ?? "people";
  const accent = systemById(primary).color;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={room.name}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(room.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(room.id);
        }
      }}
      style={{
        cursor: "pointer",
        opacity: dimmed ? 0.16 : 1,
        transition: "opacity 400ms ease",
        outline: "none",
      }}
    >
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={rect.h}
        rx={3}
        fill={emergency ? "oklch(0.22 0.03 25)" : "var(--concrete)"}
        stroke={selected ? accent : "var(--concrete-light)"}
        strokeWidth={selected ? 2 : 1}
      />
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={11}
        rx={2}
        fill={accent}
        opacity={selected ? 0.3 : 0.12}
      />
      {selected && (
        <rect
          x={rect.x - 2}
          y={rect.y - 2}
          width={rect.w + 4}
          height={rect.h + 4}
          rx={4}
          fill="none"
          stroke={accent}
          strokeWidth={1}
          opacity={0.55}
          className="bsb-pulse"
        />
      )}
      <Fixtures kind={room.fixture} rect={rect} accent={accent} />
      <text
        x={rect.x + 5}
        y={rect.y + 8.5}
        fontSize={7.2}
        letterSpacing={0.4}
        fill="var(--foreground)"
        opacity={0.85}
        style={{ pointerEvents: "none", textTransform: "uppercase" }}
      >
        {truncate(room.name, rect.w - 14)}
      </text>
      <circle
        cx={rect.x + rect.w - 5}
        cy={rect.y + 5.5}
        r={2.4}
        fill={statusColor[status]}
        className={status === "ok" ? undefined : "bsb-pulse"}
      />
    </g>
  );
}
