import type { RoomDef, SystemId } from "./types";
import { roomsByFloor } from "./rooms";

export interface RoomBox {
  room: RoomDef;
  x: number;
  z: number;
  w: number;
  d: number;
  side: "north" | "south" | "east" | "west";
  doorOffset?: number; // Added dynamic door positioning
}

export interface FloorLayout {
  boxes: RoomBox[];
  width: number;
  depth: number;
  corridorWidth: number;
  wallHeight: number;
  roomDepth: number;
  core: { w: number; d: number };
  loopInnerW: number;
  loopInnerD: number;
}

interface Row {
  side: "north" | "south" | "east" | "west";
  items: { room: RoomDef; w: number }[];
  total: number;
}

const CORRIDOR = 1.2;
const ROOM_DEPTH = 3.8;
const WALL_H = 2.7;
const GAP = 0.08;
const CORE_W = 4.4;
const CORE_D = 3.6;

export function floorLayout(floorId: number): FloorLayout {
  const rooms = roomsByFloor(floorId);

  const north: Row = { side: "north", items: [], total: 0 };
  const south: Row = { side: "south", items: [], total: 0 };
  const east: Row = { side: "east", items: [], total: 0 };
  const west: Row = { side: "west", items: [], total: 0 };

  // Distribute rooms cleanly across rows
  for (const room of rooms) {
    const w = Math.max(2.2, room.span * 2.9);

    if (floorId === 1 && /entrance|main door/i.test(room.name)) {
      west.items.push({ room, w });
      continue;
    }
    if (floorId === 1 && /exit|emergency/i.test(room.name)) {
      east.items.push({ room, w });
      continue;
    }

    if (floorId === 1) {
      const row = north.total <= south.total ? north : south;
      row.items.push({ room, w });
      row.total += w + GAP;
      continue;
    }

    const sorted = [north, south, east, west].sort((a, b) => a.total - b.total);
    sorted[0]?.items.push({ room, w });
    sorted[0] && (sorted[0].total += w + GAP);
  }

  // Recalculate true totals
  for (const row of [north, south, east, west]) {
    row.total =
      row.items.reduce((sum, item) => sum + item.w, 0) + Math.max(0, row.items.length - 1) * GAP;
  }

  // Set inner loop dimensions driven by room totals and core size
  const loopInnerW = Math.max(CORE_W + 10, north.total, south.total);
  const loopInnerD = Math.max(CORE_D + 1.2, east.total, west.total);

  const outerLoopW = loopInnerW + 2 * CORRIDOR;
  const outerLoopD = loopInnerD + 2 * CORRIDOR;

  const totalOuterD = outerLoopD + 2 * ROOM_DEPTH;
  const targetSideSpan = totalOuterD;

  const expandRow = (row: Row, target: number) => {
    if (row.items.length === 0) return;
    const diff = target - row.total;
    if (diff > 0) {
      const add = diff / row.items.length;
      row.items.forEach((item) => {
        item.w += add;
      });
      row.total = target;
    }
  };

  expandRow(north, outerLoopW);
  expandRow(south, outerLoopW);
  expandRow(east, targetSideSpan);
  expandRow(west, targetSideSpan);

  const width = outerLoopW + 2 * ROOM_DEPTH;
  const depth = outerLoopD + 2 * ROOM_DEPTH;

  const boxes: RoomBox[] = [];

  const processRow = (row: Row) => {
    let cursor = -row.total / 2;
    for (const item of row.items) {
      const w = item.w;
      const center = cursor + w / 2;
      cursor += w + GAP;

      let x = 0;
      let z = 0;
      let doorOffset = 0;

      // Ensure the door strictly opens onto the ring corridor bounds
      const doorW = Math.min(1.3, w * 0.4);
      const safeMargin = doorW / 2 + 0.2;

      if (row.side === "north") {
        x = center;
        z = -outerLoopD / 2 - ROOM_DEPTH / 2;
        const max = outerLoopW / 2 - safeMargin;
        const min = -outerLoopW / 2 + safeMargin;
        const clamped = Math.max(min, Math.min(max, center));
        doorOffset = -(clamped - center);
      } else if (row.side === "south") {
        x = center;
        z = outerLoopD / 2 + ROOM_DEPTH / 2;
        const max = outerLoopW / 2 - safeMargin;
        const min = -outerLoopW / 2 + safeMargin;
        const clamped = Math.max(min, Math.min(max, center));
        doorOffset = clamped - center;
      } else if (row.side === "east") {
        z = center;
        x = outerLoopW / 2 + ROOM_DEPTH / 2;
        const max = outerLoopD / 2 - safeMargin;
        const min = -outerLoopD / 2 + safeMargin;
        const clamped = Math.max(min, Math.min(max, center));
        doorOffset = -(clamped - center);
      } else if (row.side === "west") {
        z = center;
        x = -outerLoopW / 2 - ROOM_DEPTH / 2;
        const max = outerLoopD / 2 - safeMargin;
        const min = -outerLoopD / 2 + safeMargin;
        const clamped = Math.max(min, Math.min(max, center));
        doorOffset = clamped - center;
      }

      boxes.push({ room: item.room, x, z, w, d: ROOM_DEPTH, side: row.side, doorOffset });
    }
  };

  processRow(north);
  processRow(south);
  processRow(east);
  processRow(west);

  return {
    boxes,
    width,
    depth,
    corridorWidth: CORRIDOR,
    wallHeight: WALL_H,
    roomDepth: ROOM_DEPTH,
    core: { w: CORE_W, d: CORE_D },
    loopInnerW,
    loopInnerD,
  };
}

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
