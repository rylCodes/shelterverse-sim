import { Room } from "./Room";
import { roomsByFloor } from "@/lib/bunker/rooms";
import { FLOOR_H, ROOM_X0, VIEW_W, floorY, SHAFT_X } from "@/lib/bunker/flows";
import type { FloorDef, SimState, Status } from "@/lib/bunker/types";

interface Props {
  floor: FloorDef;
  state: SimState;
  statusFor: (id: string) => Status;
  dimmedRooms: Set<string> | null;
  emergency: boolean;
  onSelectRoom: (id: string) => void;
  onSelectFloor: (id: number) => void;
}

export function Floor({
  floor,
  state,
  statusFor,
  dimmedRooms,
  emergency,
  onSelectRoom,
  onSelectFloor,
}: Props) {
  const y = floorY(floor.id);
  const rooms = roomsByFloor(floor.id);
  const focused = state.selectedFloor === null || state.selectedFloor === floor.id;

  return (
    <g opacity={focused ? 1 : 0.45} style={{ transition: "opacity 400ms ease" }}>
      {/* structural slab */}
      <rect x={0} y={y} width={VIEW_W} height={FLOOR_H} fill="var(--concrete-dark)" />
      <rect x={0} y={y} width={VIEW_W} height={5} fill="var(--concrete-light)" opacity={0.5} />
      <rect x={0} y={y + FLOOR_H - 4} width={VIEW_W} height={4} fill="var(--concrete-light)" opacity={0.35} />
      {/* concrete texture ticks */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1={i * 52}
          y1={y + 5}
          x2={i * 52}
          y2={y + FLOOR_H - 4}
          stroke="var(--concrete-light)"
          strokeWidth={0.4}
          opacity={0.08}
        />
      ))}

      {/* floor label */}
      <g
        onClick={() => onSelectFloor(floor.id)}
        style={{ cursor: "pointer" }}
      >
        <text x={8} y={y + 20} fontSize={13} fontWeight={700} fill="var(--foreground)" opacity={0.6} letterSpacing={1}>
          {floor.code}
        </text>
        <text
          x={ROOM_X0}
          y={y + 13}
          fontSize={8}
          fill="var(--muted-foreground)"
          letterSpacing={2.4}
          style={{ textTransform: "uppercase" }}
        >
          {floor.name}
        </text>
      </g>

      {/* rooms */}
      {rooms.map((room) => (
        <Room
          key={room.id}
          room={room}
          status={statusFor(room.id)}
          selected={state.selectedRoom === room.id}
          dimmed={
            (dimmedRooms ? dimmedRooms.has(room.id) : false) ||
            (state.selectedRoom !== null && state.selectedRoom !== room.id)
          }
          emergency={emergency}
          onSelect={onSelectRoom}
        />
      ))}

      {/* elevator + stairs */}
      <g opacity={0.9}>
        <rect x={SHAFT_X} y={y + 18} width={44} height={FLOOR_H - 30} rx={2} fill="var(--concrete)" stroke="var(--concrete-light)" strokeWidth={1} />
        <rect x={SHAFT_X + 10} y={y + 30} width={24} height={FLOOR_H - 54} rx={1.5} fill="var(--concrete-dark)" stroke="var(--sys-power)" strokeWidth={0.7} opacity={0.9} />
        <text x={SHAFT_X + 4} y={y + 28} fontSize={6} fill="var(--muted-foreground)" letterSpacing={1}>
          LIFT
        </text>
        <rect x={SHAFT_X + 50} y={y + 18} width={44} height={FLOOR_H - 30} rx={2} fill="var(--concrete)" stroke="var(--concrete-light)" strokeWidth={1} />
        {Array.from({ length: 5 }).map((_, i) => (
          <rect
            key={i}
            x={SHAFT_X + 54 + i * 7}
            y={y + FLOOR_H - 18 - i * 12}
            width={9}
            height={4}
            fill="var(--concrete-light)"
            opacity={0.75}
          />
        ))}
        <text x={SHAFT_X + 54} y={y + 28} fontSize={6} fill="var(--muted-foreground)" letterSpacing={1}>
          STAIR
        </text>
      </g>
    </g>
  );
}
