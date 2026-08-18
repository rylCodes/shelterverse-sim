import type { RoomDef, SystemId } from "./types";
import { roomsByFloor } from "./rooms";

export interface RoomBox {
  room: RoomDef;
  x: number;
  z: number;
  w: number;
  d: number;
  side: "north" | "south" | "east" | "west";
  doorOffset?: number;
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
  blocks: { x: number; z: number; w: number; d: number }[];
  surfacePaths: { x: number; z: number; w: number; d: number; side: "east" | "west" }[];
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
  /** Floor 1 only: outer band holding the Main Entrance in front of decontamination. */
  const westOuter: Row = { side: "west", items: [], total: 0 };

  // Distribute rooms cleanly across rows
  for (const room of rooms) {
    let w = Math.max(2.2, room.span * 2.9); // Note: changed 'const w' to 'let w'

    if (floorId === 1 && /entrance|main door/i.test(room.name)) {
      w = Math.max(7.5, w); // Force Main Entrance to be massive
      westOuter.items.push({ room, w });
      continue;
    }
    // Decontamination A & B sit between the entrance and the main corridor
    if (floorId === 1 && /decontamination/i.test(room.name)) {
      west.items.push({ room, w: Math.max(4.2, w) });
      continue;
    }
    // Check-in belongs to the entry sequence, right beside the decon bays
    if (floorId === 1 && /reception|check-in/i.test(room.name)) {
      west.items.push({ room, w: Math.max(4.2, w) });
      continue;
    }
    // Move equipment storage explicitly to the south row for Floor 1
    if (floorId === 1 && /emergency equipment/i.test(room.name)) {
      south.items.push({ room, w });
      south.total += w + GAP;
      continue;
    }
    // Strictly isolate the emergency exit to the east
    if (floorId === 1 && /emergency exit|exit access/i.test(room.name)) {
      w = Math.max(4.5, w); // Force Emergency Exit to be larger, but smaller than main entrance
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

  // Skip expanding East on Floor 1 so it stays centered as a solitary room
  if (floorId === 1) {
    expandRow(north, outerLoopW);
    expandRow(south, outerLoopW);
    // West holds the decontamination band, which fills the whole side
    expandRow(west, targetSideSpan);
  } else {
    expandRow(north, outerLoopW);
    expandRow(south, outerLoopW);
    expandRow(east, targetSideSpan);
    expandRow(west, targetSideSpan);
  }

  const entryBand = westOuter.items.length > 0 ? ROOM_DEPTH + GAP : 0;
  // Keep the slab symmetric around the origin even with the extra entry band
  const width = outerLoopW + 2 * ROOM_DEPTH + 2 * entryBand;
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

  // Floor 1: Main Entrance sits in an outer band, in front of the decon bays
  const westOuterX = -outerLoopW / 2 - ROOM_DEPTH / 2 - entryBand;
  const entrance = westOuter.items[0];
  if (entrance) {
    const deconBoxes = boxes.filter(
      (b) => b.side === "west" && /decontamination/i.test(b.room.name),
    );
    // Aim the entrance door at the seam between Decon A and Decon B
    const targetZ =
      deconBoxes.length > 0
        ? deconBoxes.reduce((sum, b) => sum + b.z, 0) / deconBoxes.length
        : 0;
    boxes.push({
      room: entrance.room,
      x: westOuterX,
      z: targetZ,
      w: entrance.w,
      d: ROOM_DEPTH,
      side: "west",
      doorOffset: 0,
    });
  }

  // Generate Solid Blocks & Surface Paths for Floor 1 East/West gaps
  const blocks: { x: number; z: number; w: number; d: number }[] = [];
  const surfacePaths: { x: number; z: number; w: number; d: number; side: "east" | "west" }[] = [];

  if (floorId === 1) {
    const item = east.items[0];
    if (east.items.length === 1 && item) {
      const roomW = item.w;
      const blockL = (targetSideSpan - roomW) / 2;
      const blockZ1 = -targetSideSpan / 2 + blockL / 2;
      const blockZ2 = targetSideSpan / 2 - blockL / 2;
      const x = outerLoopW / 2 + ROOM_DEPTH / 2;

      blocks.push({ x, z: blockZ1, w: ROOM_DEPTH, d: blockL });
      blocks.push({ x, z: blockZ2, w: ROOM_DEPTH, d: blockL });
      surfacePaths.push({ x, z: 0, w: ROOM_DEPTH, d: roomW, side: "east" });
    }

    if (entrance) {
      const roomW = entrance.w;
      const entranceZ = boxes.find((b) => b.room.id === entrance.room.id)?.z ?? 0;
      const topEnd = -targetSideSpan / 2;
      const botEnd = targetSideSpan / 2;
      const upperL = entranceZ - roomW / 2 - topEnd;
      const lowerL = botEnd - (entranceZ + roomW / 2);
      if (upperL > 0.2)
        blocks.push({
          x: westOuterX,
          z: topEnd + upperL / 2,
          w: ROOM_DEPTH,
          d: upperL,
        });
      if (lowerL > 0.2)
        blocks.push({
          x: westOuterX,
          z: botEnd - lowerL / 2,
          w: ROOM_DEPTH,
          d: lowerL,
        });
      surfacePaths.push({
        x: westOuterX,
        z: entranceZ,
        w: ROOM_DEPTH,
        d: roomW,
        side: "west",
      });
    }
  }



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
    blocks,
    surfacePaths,
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
