import type { RoomDef, SystemId } from "./types";
import { roomsByFloor } from "./rooms";

export interface RoomBox {
  room: RoomDef;
  /** center x */
  x: number;
  /** center z */
  z: number;
  /** width along x */
  w: number;
  /** depth along z */
  d: number;
  /** which side of the corridor */
  side: "north" | "south";
}

export interface FloorLayout {
  boxes: RoomBox[];
  width: number;
  depth: number;
  corridorWidth: number;
  wallHeight: number;
  core: { x: number; z: number; w: number; d: number };
}

interface Row {
  side: "north" | "south";
  items: { room: RoomDef; w: number }[];
  total: number;
}

const CORRIDOR = 2.4;
const ROOM_DEPTH = 4.2;
const WALL_H = 2.7;
const GAP = 0.12;
const CORE_W = 3.2;

/** Deterministic, data-driven layout: two room bands either side of a central corridor. */
export function floorLayout(floorId: number): FloorLayout {
  const rooms = roomsByFloor(floorId);

  const north: Row = { side: "north", items: [], total: 0 };
  const south: Row = { side: "south", items: [], total: 0 };

  for (const room of rooms) {
    const w = Math.max(2.4, room.span * 3.1);
    const row = north.total <= south.total ? north : south;
    row.items.push({ room, w });
    row.total += w + GAP;
  }

  const rowSpan = Math.max(north.total, south.total);
  const coreX = rowSpan / 2 + CORE_W / 2 + 0.6;
  const width = (coreX + CORE_W / 2) * 2 + 1.2;
  const depth = ROOM_DEPTH * 2 + CORRIDOR + 1.2;

  const boxes: RoomBox[] = [];
  for (const row of [north, south]) {
    let cursor = -row.total / 2;
    for (const item of row.items) {
      const x = cursor + item.w / 2;
      cursor += item.w + GAP;
      boxes.push({
        room: item.room,
        x,
        w: item.w,
        d: ROOM_DEPTH,
        z:
          row.side === "north"
            ? CORRIDOR / 2 + ROOM_DEPTH / 2
            : -(CORRIDOR / 2 + ROOM_DEPTH / 2),
        side: row.side,
      });
    }
  }

  return {
    boxes,
    width,
    depth,
    corridorWidth: CORRIDOR,
    wallHeight: WALL_H,
    core: { x: coreX, z: 0, w: CORE_W, d: CORRIDOR + 1.4 },
  };
}

/** Hex approximations of the CSS system tokens (three.js cannot parse oklch). */
export const SYSTEM_HEX: Record<SystemId, string> = {
  water: "#3cb6e0",
  air: "#7ed4e6",
  power: "#e8ae3f",
  food: "#43cf95",
  medical: "#f2705f",
  comms: "#a58cf0",
  waste: "#8dc16a",
  people: "#ccd4e2",
};

export const PALETTE_3D = {
  background: "#151a20",
  slab: "#39434f",
  slabEdge: "#5a6673",
  wall: "#5b6775",
  wallTop: "#74818f",
  corridor: "#2a323b",
  fixture: "#8a94a3",
  core: "#48525e",
};
