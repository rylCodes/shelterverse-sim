import { scenarioById } from "./scenarios";
import { roomsByFloor } from "./rooms";
import { floorY, roomRect, FLOOR_H } from "./flows";
import type { ScenarioId } from "./types";

export interface Person {
  id: number;
  x: number;
  y: number;
  floor: number;
  delay: number;
  child: boolean;
}

/** Coordinate-free assignment shared by the 2D section and the 3D explore mode. */
export interface PersonAssignment {
  id: number;
  floor: number;
  roomId: string;
  child: boolean;
  delay: number;
  /** Seeded 0..1 offsets used to spread people inside their room. */
  spread: { u: number; v: number };
}

const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/**
 * Assign each resident to a floor and room using the active scenario's safe floors.
 * Pure and deterministic — the same input always yields the same placement.
 */
export function assignPeople(scenario: ScenarioId, population: number): PersonAssignment[] {
  const sc = scenarioById(scenario);
  const floors = sc.safeFloors;
  const out: PersonAssignment[] = [];
  for (let i = 0; i < population; i++) {
    const floor = floors[i % floors.length]!;
    const rooms = roomsByFloor(floor);
    let room = rooms[Math.floor(rand(i * 3 + floor) * rooms.length)]!;

    // Reposition anyone assigned to Emergency Exit on Floor 1 to Reception/Check-in
    if (room.id === "f1-exit") {
      room = rooms.find((r) => r.id === "f1-reception") || rooms[0]!;
    }

    out.push({
      id: i,
      floor,
      roomId: room.id,
      child: i % 5 === 3,
      delay: Math.round(rand(i * 11) * 400) / 100,
      spread: { u: rand(i * 7 + floor), v: rand(i * 13 + floor) },
    });
  }
  return out;
}

/** Distribute residents across the floors that are active for this scenario (2D coordinates). */
export function peopleFor(scenario: ScenarioId, population: number): Person[] {
  return assignPeople(scenario, population).map((p) => {
    const rect = roomRect(p.roomId);
    const x = rect.x + 8 + p.spread.u * Math.max(6, rect.w - 16);
    return {
      id: p.id,
      x: Math.round(x * 100) / 100,
      y: floorY(p.floor) + FLOOR_H - 16,
      floor: p.floor,
      delay: p.delay,
      child: p.child,
    };
  });
}
