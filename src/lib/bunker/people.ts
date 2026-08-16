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

const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/** Distribute residents across the floors that are active for this scenario. */
export function peopleFor(scenario: ScenarioId, population: number): Person[] {
  const sc = scenarioById(scenario);
  const floors = sc.safeFloors;
  const people: Person[] = [];
  for (let i = 0; i < population; i++) {
    const floor = floors[i % floors.length]!;
    const rooms = roomsByFloor(floor);
    const room = rooms[Math.floor(rand(i * 3 + floor) * rooms.length)]!;

    const rect = roomRect(room.id);
    const x = rect.x + 8 + rand(i * 7 + floor) * Math.max(6, rect.w - 16);
    people.push({
      id: i,
      x: Math.round(x * 100) / 100,
      y: floorY(floor) + FLOOR_H - 16,
      floor,
      delay: Math.round(rand(i * 11) * 400) / 100,
      child: i % 5 === 3,
    });
  }
  return people;
}
