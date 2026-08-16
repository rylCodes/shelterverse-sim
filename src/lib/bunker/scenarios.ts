import type { Resources, ScenarioId } from "./types";

export interface ScenarioDef {
  id: ScenarioId;
  label: string;
  icon: string;
  summary: string;
  /** Immediate one-off change applied when activated. */
  impact: Partial<Resources>;
  /** Extra per-day drain (positive = extra consumption). */
  drain: Partial<Resources>;
  effects: string[];
  /** Floors residents relocate to. */
  safeFloors: number[];
  emergencyLighting: boolean;
  surfaceAccess: "open" | "restricted" | "sealed";
}

export const SCENARIOS: ScenarioDef[] = [
  {
    id: "normal",
    label: "Normal",
    icon: "sun",
    summary: "Stable conditions. All systems nominal and surface access open.",
    impact: {},
    drain: {},
    effects: [
      "Solar collection and generators share the load",
      "Residents distributed across work, living and community floors",
      "Routine maintenance and education schedule running",
    ],
    safeFloors: [1, 3, 4, 5, 6, 7, 8, 9],
    emergencyLighting: false,
    surfaceAccess: "open",
  },
  {
    id: "earthquake",
    label: "Earthquake",
    icon: "activity",
    summary: "Seismic event. Structure stressed, some systems degraded.",
    impact: { structure: -14, power: -12, water: -6, morale: -8 },
    drain: { structure: -0.4, power: 1.5 },
    effects: [
      "Structural integrity decreases and is monitored continuously",
      "Emergency lighting activates on all floors",
      "Some water and power distribution degrades",
      "Residents move to reinforced safe areas",
    ],
    safeFloors: [6, 7, 8],
    emergencyLighting: true,
    surfaceAccess: "restricted",
  },
  {
    id: "flood",
    label: "Flood",
    icon: "waves",
    summary: "Surface water rising. Main access restricted, drainage active.",
    impact: { water: 6, structure: -6, power: -5, morale: -6 },
    drain: { power: 1.2, waste: 1.4 },
    effects: [
      "Water rises around the surface structures",
      "Main entrance access becomes restricted",
      "Drainage and pumping on Floor 10 run continuously",
      "Residents move toward safer upper floors",
    ],
    safeFloors: [6, 7, 8, 9],
    emergencyLighting: false,
    surfaceAccess: "sealed",
  },
  {
    id: "wildfire",
    label: "Wildfire / Hazardous Air",
    icon: "flame",
    summary: "External air hazardous. Intake closed, filtration at maximum.",
    impact: { air: -10, power: -6, morale: -5 },
    drain: { air: -0.6, power: 2.2 },
    effects: [
      "External air intake closes and the shelter runs on recirculation",
      "Air filtration operates at maximum, consuming more power",
      "Filter life shortens noticeably",
      "All residents remain indoors",
    ],
    safeFloors: [4, 5, 6, 7, 8, 9],
    emergencyLighting: false,
    surfaceAccess: "sealed",
  },
  {
    id: "storm",
    label: "Extreme Storm",
    icon: "cloud-lightning",
    summary: "Wind, rain and lightning. Less solar, more rainwater.",
    impact: { power: -9, water: 8, morale: -3 },
    drain: { power: 0.9, water: 0.6 },
    effects: [
      "Solar generation drops sharply",
      "Rainwater collection increases the water reserve",
      "Surface access is restricted for safety",
      "Communications may be intermittent",
    ],
    safeFloors: [3, 4, 5, 6, 7, 8, 9],
    emergencyLighting: false,
    surfaceAccess: "restricted",
  },
  {
    id: "blackout",
    label: "Power Failure",
    icon: "power-off",
    summary: "Main power unavailable. Backup generators carry critical loads.",
    impact: { power: -34, air: -6, medical: -5, morale: -9 },
    drain: { power: 1.8, food: 0.5 },
    effects: [
      "Main power supply is unavailable",
      "Floor 10 backup generators activate for critical systems",
      "Emergency lighting activates throughout the shelter",
      "Non-essential systems reduce consumption",
      "Power-dependent systems degrade progressively",
    ],
    safeFloors: [1, 6, 7, 8],
    emergencyLighting: true,
    surfaceAccess: "restricted",
  },
];

export const scenarioById = (id: ScenarioId) => SCENARIOS.find((s) => s.id === id)!;
