export type SystemId =
  | "water"
  | "air"
  | "power"
  | "food"
  | "medical"
  | "comms"
  | "waste"
  | "people";

export type ScenarioId =
  | "normal"
  | "earthquake"
  | "flood"
  | "wildfire"
  | "storm"
  | "blackout";

export type Status = "ok" | "warn" | "crit";

export type FixtureKind =
  | "beds"
  | "bunks"
  | "tanks"
  | "pumps"
  | "plants"
  | "servers"
  | "medbed"
  | "cabinets"
  | "kitchen"
  | "seats"
  | "desks"
  | "machines"
  | "lockers"
  | "shower"
  | "screens"
  | "park"
  | "gym"
  | "generic";

export interface RoomDef {
  id: string;
  name: string;
  floor: number;
  span: number;
  fixture: FixtureKind;
  systems: SystemId[];
  purpose: string;
  metricLabel: string;
  metricBase: number;
  metricUnit: string;
  why: string;
}

export interface FloorDef {
  id: number;
  code: string;
  name: string;
  short: string;
  tagline: string;
  accent: SystemId;
}

export interface EventEntry {
  id: number;
  time: string;
  text: string;
  level: Status;
}

export interface Resources {
  water: number;
  food: number;
  power: number;
  air: number;
  medical: number;
  structure: number;
  waste: number;
  morale: number;
}

export interface SimState {
  day: number;
  hour: number;
  minute: number;
  scenario: ScenarioId;
  resources: Resources;
  population: number;
  capacity: number;
  events: EventEntry[];
  eventSeq: number;
  selectedFloor: number | null;
  selectedRoom: string | null;
  selectedSystem: SystemId | null;
  presentation: boolean;
  demoStep: number | null;
}
