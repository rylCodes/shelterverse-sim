import { useEffect, useRef, useState } from "react";
import { Floor } from "./Floor";
import { Surface } from "./Surface";
import { SystemFlow } from "./SystemFlow";
import { PeopleLayer } from "./PeopleLayer";
import { FLOORS } from "@/lib/bunker/floors";
import { ROOMS } from "@/lib/bunker/rooms";
import {
  FLOOR_H,
  SURFACE_H,
  VIEW_H,
  VIEW_W,
  floorY,
  roomRect,
} from "@/lib/bunker/flows";
import { roomStatus, stressedSystems } from "@/lib/bunker/simulation";
import { scenarioById } from "@/lib/bunker/scenarios";
import type { SimState } from "@/lib/bunker/types";

type Box = [number, number, number, number];

function useAnimatedBox(target: Box) {
  const [box, setBox] = useState<Box>(target);
  const raf = useRef<number | null>(null);
  const current = useRef<Box>(target);

  useEffect(() => {
    const start = [...current.current] as Box;
    const t0 = performance.now();
    const dur = 700;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const next = start.map((v, i) => v + (target[i]! - v) * e) as Box;
      current.current = next;
      setBox(next);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target[0], target[1], target[2], target[3]]);

  return box;
}

interface Props {
  state: SimState;
  onSelectRoom: (id: string | null) => void;
  onSelectFloor: (id: number) => void;
}

export function BunkerVisualization({ state, onSelectRoom, onSelectFloor }: Props) {
  const sc = scenarioById(state.scenario);
  const stressed = stressedSystems(state.resources);

  let target: Box = [0, 0, VIEW_W, VIEW_H];
  if (state.selectedRoom) {
    const r = roomRect(state.selectedRoom);
    const pad = 210;
    target = [
      Math.max(0, r.x - pad),
      Math.max(0, r.y - 80),
      Math.min(VIEW_W, r.w + pad * 2),
      Math.min(VIEW_H, r.h + 190),
    ];
  } else if (state.selectedFloor) {
    target = [0, floorY(state.selectedFloor) - 26, VIEW_W, FLOOR_H + 52];
  }
  const box = useAnimatedBox(target);

  const dimmedRooms = state.selectedSystem
    ? new Set(ROOMS.filter((r) => !r.systems.includes(state.selectedSystem!)).map((r) => r.id))
    : null;

  const shake = state.scenario === "earthquake";
  const emergency = sc.emergencyLighting;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-[var(--concrete-dark)]">
      <svg
        viewBox={box.join(" ")}
        className={`h-full w-full ${shake ? "bsb-shake" : ""}`}
        preserveAspectRatio="xMidYMid meet"
        onClick={() => onSelectRoom(null)}
        role="img"
        aria-label="Cutaway section of the ten floor BSB shelter"
      >
        <defs>
          <linearGradient id="depth" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0 0 0)" stopOpacity="0.45" />
            <stop offset="20%" stopColor="oklch(0 0 0)" stopOpacity="0" />
            <stop offset="80%" stopColor="oklch(0 0 0)" stopOpacity="0" />
            <stop offset="100%" stopColor="oklch(0 0 0)" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="var(--concrete-dark)" />
        <Surface scenario={state.scenario} />

        {/* earth shell around the shelter */}
        <rect x={0} y={SURFACE_H} width={VIEW_W} height={VIEW_H - SURFACE_H} fill="oklch(0.19 0.012 250)" />

        {FLOORS.map((f) => (
          <Floor
            key={f.id}
            floor={f}
            state={state}
            statusFor={(id) => roomStatus(id, state)}
            dimmedRooms={dimmedRooms}
            emergency={emergency}
            onSelectRoom={(id) => onSelectRoom(id)}
            onSelectFloor={onSelectFloor}
          />
        ))}

        <SystemFlow active={state.selectedSystem} stressed={stressed} />
        <PeopleLayer
          scenario={state.scenario}
          population={state.population}
          highlight={state.selectedSystem === "people"}
          dimFloors={state.selectedFloor ? [state.selectedFloor] : null}
        />

        {emergency && (
          <rect
            x={0}
            y={SURFACE_H}
            width={VIEW_W}
            height={VIEW_H - SURFACE_H}
            fill="var(--status-crit)"
            opacity={0.1}
            className="bsb-flicker"
            style={{ pointerEvents: "none" }}
          />
        )}
        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="url(#depth)" style={{ pointerEvents: "none" }} />
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 rounded border border-border bg-background/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
        {state.selectedRoom
          ? "Room focus"
          : state.selectedFloor
            ? `Floor ${state.selectedFloor}`
            : "Full section"}
        {" · "}
        {sc.label}
      </div>
    </div>
  );
}
