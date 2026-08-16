import { scenarioById } from "./scenarios";
import { ROOMS } from "./rooms";
import type {
  EventEntry,
  Resources,
  ScenarioId,
  SimState,
  Status,
  SystemId,
} from "./types";

export const INITIAL_RESOURCES: Resources = {
  water: 87,
  food: 72,
  power: 84,
  air: 98,
  medical: 91,
  structure: 96,
  waste: 78,
  morale: 89,
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));

export const RESOURCE_META: {
  key: keyof Resources;
  label: string;
  system: SystemId | null;
  invert?: boolean;
}[] = [
  { key: "water", label: "Water", system: "water" },
  { key: "food", label: "Food", system: "food" },
  { key: "power", label: "Power", system: "power" },
  { key: "air", label: "Air Quality", system: "air" },
  { key: "medical", label: "Medical", system: "medical" },
  { key: "structure", label: "Structural Integrity", system: null },
  { key: "waste", label: "Waste Capacity", system: "waste" },
  { key: "morale", label: "Community Well-being", system: "people" },
];

export function statusOf(value: number, invert = false): Status {
  const v = invert ? 100 - value : value;
  if (v >= 65) return "ok";
  if (v >= 35) return "warn";
  return "crit";
}

/** Illustrative sustainability horizon in days. */
export function sustainabilityDays(r: Resources): number {
  const limiting = Math.min(r.water, r.food, r.power, r.air, r.medical);
  const wasteFactor = Math.max(0.4, r.waste / 100 + 0.25);
  return Math.max(0, Math.round(limiting * 0.85 * wasteFactor));
}

/** Cascading dependency rules: a low source resource degrades these systems. */
export const CASCADES: { source: keyof Resources; threshold: number; affects: SystemId[]; label: string }[] = [
  {
    source: "power",
    threshold: 55,
    affects: ["water", "air", "comms", "food", "medical", "waste"],
    label: "Low power",
  },
  { source: "water", threshold: 50, affects: ["food", "medical", "waste"], label: "Low water" },
  { source: "air", threshold: 60, affects: ["medical", "food", "people"], label: "Degraded air" },
  { source: "waste", threshold: 30, affects: ["water", "food", "people"], label: "Waste capacity low" },
  { source: "structure", threshold: 60, affects: ["water", "power", "comms"], label: "Structural damage" },
];

export function activeCascades(r: Resources) {
  return CASCADES.filter((c) => (c.source === "waste" ? r.waste : r[c.source]) < c.threshold);
}

export function stressedSystems(r: Resources): Set<SystemId> {
  const set = new Set<SystemId>();
  for (const c of activeCascades(r)) c.affects.forEach((s) => set.add(s));
  return set;
}

export function systemLevel(system: SystemId, r: Resources): number {
  const map: Partial<Record<SystemId, number>> = {
    water: r.water,
    air: r.air,
    power: r.power,
    food: r.food,
    medical: r.medical,
    waste: r.waste,
    people: r.morale,
    comms: (r.power + r.structure) / 2,
  };
  return map[system] ?? 100;
}

export function roomStatus(roomId: string, state: SimState): Status {
  const room = ROOMS.find((x) => x.id === roomId);
  if (!room) return "ok";
  const stressed = stressedSystems(state.resources);
  let worst: Status = "ok";
  for (const s of room.systems) {
    const st = statusOf(systemLevel(s, state.resources));
    if (st === "crit") worst = "crit";
    else if (st === "warn" && worst === "ok") worst = "warn";
    if (stressed.has(s) && worst === "ok") worst = "warn";
  }
  if (state.scenario === "blackout" && room.systems.includes("power") && worst === "ok") worst = "warn";
  return worst;
}

export type Action =
  | { type: "tick"; minutes: number }
  | { type: "advance"; days: number }
  | { type: "scenario"; id: ScenarioId }
  | { type: "selectFloor"; floor: number | null }
  | { type: "selectRoom"; room: string | null }
  | { type: "selectSystem"; system: SystemId | null }
  | { type: "presentation"; on: boolean }
  | { type: "demoStep"; step: number | null }
  | { type: "log"; text: string; level?: Status }
  | { type: "reset" };

const pad = (n: number) => String(n).padStart(2, "0");

function stamp(s: SimState) {
  return `D${pad(s.day)} ${pad(s.hour)}:${pad(s.minute)}`;
}

function log(state: SimState, text: string, level: Status = "ok"): SimState {
  const entry: EventEntry = { id: state.eventSeq + 1, time: stamp(state), text, level };
  return { ...state, eventSeq: state.eventSeq + 1, events: [entry, ...state.events].slice(0, 120) };
}

export function initialState(): SimState {
  const base: SimState = {
    day: 1,
    hour: 14,
    minute: 0,
    scenario: "normal",
    resources: { ...INITIAL_RESOURCES },
    population: 24,
    capacity: 30,
    events: [],
    eventSeq: 0,
    selectedFloor: null,
    selectedRoom: null,
    selectedSystem: null,
    presentation: false,
    demoStep: null,
  };
  let s = log(base, "Simulation initialized");
  s = { ...s, minute: 1 };
  s = log(s, "24 residents accounted for");
  s = { ...s, minute: 2 };
  s = log(s, "Essential systems online");
  s = { ...s, minute: 4 };
  s = log(s, "Surface conditions nominal");
  return s;
}

function advanceDays(state: SimState, days: number): SimState {
  const sc = scenarioById(state.scenario);
  const r = { ...state.resources };
  for (let d = 0; d < days; d++) {
    const powerFactor = r.power < 45 ? 0.5 : 1;
    // consumption
    r.water = clamp(r.water - 2.4 - (sc.drain.water ? 0 : 0));
    r.food = clamp(r.food - 2.1 - (sc.drain.food ?? 0));
    r.medical = clamp(r.medical - 0.7);
    r.waste = clamp(r.waste - 1.6 - (sc.drain.waste ?? 0));
    r.power = clamp(r.power - 1.4 - (sc.drain.power ?? 0));
    r.air = clamp(r.air - 0.5 + (sc.drain.air ?? 0));
    r.structure = clamp(r.structure + (sc.drain.structure ?? 0));
    // production / recovery
    r.food = clamp(r.food + 1.9 * powerFactor * (r.water > 30 ? 1 : 0.3));
    r.water = clamp(r.water + (state.scenario === "storm" ? 3.2 : 1.6) * (r.power > 30 ? 1 : 0.4));
    r.power = clamp(r.power + (state.scenario === "storm" ? 0.6 : state.scenario === "blackout" ? 0.9 : 2.2));
    r.air = clamp(r.air + 0.9 * powerFactor);
    r.waste = clamp(r.waste + 1.1 * powerFactor);
    const comfort = (r.food + r.water + r.air + r.medical) / 4;
    r.morale = clamp(r.morale + (comfort > 65 ? 0.4 : comfort > 45 ? -0.8 : -2.2));
  }
  const totalMin = state.hour * 60 + state.minute + 6;
  let s: SimState = {
    ...state,
    resources: r,
    day: state.day + days + Math.floor(totalMin / 1440),
    hour: Math.floor((totalMin % 1440) / 60),
    minute: totalMin % 60,
  };
  s = log(s, `Advanced ${days} day${days > 1 ? "s" : ""} — resources recalculated`);
  const casc = activeCascades(r);
  for (const c of casc) {
    s = log(s, `${c.label}: ${c.affects.join(", ")} degraded`, r[c.source] < 20 ? "crit" : "warn");
  }
  return s;
}

export function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case "tick": {
      const totalMin = state.hour * 60 + state.minute + action.minutes;
      return {
        ...state,
        day: state.day + Math.floor(totalMin / 1440),
        hour: Math.floor((totalMin % 1440) / 60),
        minute: totalMin % 60,
      };
    }
    case "advance":
      return advanceDays(state, action.days);
    case "scenario": {
      if (action.id === state.scenario) return state;
      const sc = scenarioById(action.id);
      const r = { ...state.resources };
      if (action.id === "normal") {
        Object.assign(r, {
          water: Math.max(r.water, INITIAL_RESOURCES.water * 0.9),
          air: Math.max(r.air, 92),
        });
      }
      for (const [k, v] of Object.entries(sc.impact)) {
        r[k as keyof Resources] = clamp(r[k as keyof Resources] + (v as number));
      }
      let s: SimState = { ...state, scenario: action.id, resources: r };
      if (action.id === "normal") {
        s = log(s, "Conditions returned to normal — systems stabilising");
      } else {
        s = log(s, `${sc.label} detected`, "crit");
        s = log(s, "Emergency systems activated", "warn");
        s = log(s, `Residents moving to safe areas (F${sc.safeFloors.join(", F")})`, "warn");
        if (action.id === "blackout") s = log(s, "Backup power activated", "warn");
        if (action.id === "wildfire") s = log(s, "External air intake sealed", "warn");
        if (action.id === "flood") s = log(s, "Drainage and pumping at maximum", "warn");
      }
      return s;
    }
    case "selectFloor":
      return { ...state, selectedFloor: action.floor, selectedRoom: null };
    case "selectRoom":
      return {
        ...state,
        selectedRoom: action.room,
        selectedFloor: action.room
          ? (ROOMS.find((r) => r.id === action.room)?.floor ?? state.selectedFloor)
          : state.selectedFloor,
      };
    case "selectSystem":
      return { ...state, selectedSystem: action.system };
    case "presentation":
      return { ...state, presentation: action.on };
    case "demoStep":
      return { ...state, demoStep: action.step };
    case "log":
      return log(state, action.text, action.level ?? "ok");
    case "reset":
      return initialState();
    default:
      return state;
  }
}
