import { roomsByFloor } from "./rooms";
import type { SystemId } from "./types";

export const VIEW_W = 1200;
export const SURFACE_H = 210;
export const FLOOR_H = 112;
export const FLOOR_COUNT = 10;
export const VIEW_H = SURFACE_H + FLOOR_H * FLOOR_COUNT;

export const ROOM_X0 = 132;
export const ROOM_X1 = 1058;
export const SHAFT_X = 1070;

export const floorY = (floor: number) => SURFACE_H + (floor - 1) * FLOOR_H;
export const floorMid = (floor: number) => floorY(floor) + FLOOR_H / 2;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const cache = new Map<string, Rect>();

export function roomRect(id: string): Rect {
  const cached = cache.get(id);
  if (cached) return cached;
  for (let f = 1; f <= FLOOR_COUNT; f++) {
    const rooms = roomsByFloor(f);
    const total = rooms.reduce((s, r) => s + r.span, 0);
    const gap = 6;
    const usable = ROOM_X1 - ROOM_X0 - gap * (rooms.length - 1);
    let x = ROOM_X0;
    for (const r of rooms) {
      const w = (r.span / total) * usable;
      cache.set(r.id, { x, y: floorY(f) + 18, w, h: FLOOR_H - 30 });
      x += w + gap;
    }
  }
  return cache.get(id)!;
}

export interface FlowDef {
  system: SystemId;
  riserX: number;
  from: number;
  to: number;
  branches: number[];
}

export const FLOWS: FlowDef[] = [
  { system: "water", riserX: 46, from: 3, to: 10, branches: [4, 5, 6, 7, 8, 10] },
  { system: "air", riserX: 62, from: 3, to: 9, branches: [4, 5, 6, 7, 8, 9] },
  { system: "power", riserX: 78, from: 1, to: 10, branches: [3, 4, 5, 8, 10] },
  { system: "food", riserX: 94, from: 5, to: 10, branches: [8, 10] },
  { system: "medical", riserX: 110, from: 4, to: 10, branches: [6, 7, 8, 9, 10] },
  { system: "comms", riserX: 46, from: 2, to: 10, branches: [1, 3, 4, 5, 6, 7, 8, 9, 10] },
  { system: "waste", riserX: 62, from: 5, to: 10, branches: [6, 7, 8, 9, 10] },
  { system: "people", riserX: 78, from: 1, to: 9, branches: [1, 4, 5, 6, 7, 8, 9] },
];

export function flowPath(flow: FlowDef): string {
  const y0 = floorMid(flow.from);
  const y1 = floorMid(flow.to);
  const parts = [`M ${flow.riserX} ${y0} L ${flow.riserX} ${y1}`];
  for (const b of flow.branches) {
    parts.push(`M ${flow.riserX} ${floorMid(b)} L ${ROOM_X0 - 8} ${floorMid(b)}`);
  }
  return parts.join(" ");
}

export const SYSTEM_ROOMS = (system: SystemId) =>
  Array.from({ length: FLOOR_COUNT }, (_, i) => roomsByFloor(i + 1))
    .flat()
    .filter((r) => r.systems.includes(system))
    .map((r) => r.id);
