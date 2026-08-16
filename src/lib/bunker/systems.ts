import type { SystemId } from "./types";

export interface SystemDef {
  id: SystemId;
  label: string;
  color: string;
  resource: keyof import("./types").Resources | null;
  description: string;
  chain: string;
}

export const SYSTEMS: SystemDef[] = [
  {
    id: "water",
    label: "Water",
    color: "var(--sys-water)",
    resource: "water",
    description:
      "Treatment and storage on Floor 3 feed medical care, food production, residential floors and community life, then return to Floor 10 for treatment.",
    chain: "F03 → F04 → F05 → F06/F07 → F08 → F10",
  },
  {
    id: "air",
    label: "Air",
    color: "var(--sys-air)",
    resource: "air",
    description:
      "Filtration and HVAC on Floor 3 condition and circulate air to every occupied floor, with intake isolation when the surface air is hazardous.",
    chain: "F03 → F04 – F09",
  },
  {
    id: "power",
    label: "Power",
    color: "var(--sys-power)",
    resource: "power",
    description:
      "Surface solar plus Floor 1 generators supply life support, medical equipment, food production and the kitchen, with Floor 10 backup generators behind them.",
    chain: "F01 + F10 → F03 → F04 → F05 → F08",
  },
  {
    id: "food",
    label: "Food",
    color: "var(--sys-food)",
    resource: "food",
    description:
      "Aquaponics, hydroponics and poultry on Floor 5 stock the pantry, supply the Floor 8 kitchen and dining hall, and send organic waste down to Floor 10.",
    chain: "F05 → F08 → residents → F10",
  },
  {
    id: "medical",
    label: "Medical",
    color: "var(--sys-medical)",
    resource: "medical",
    description:
      "Floor 4 depends on stable power, clean air and clean water, and supports every other floor through the first-aid room on Floor 10.",
    chain: "F03 → F04 → all floors",
  },
  {
    id: "comms",
    label: "Communications",
    color: "var(--sys-comms)",
    resource: null,
    description:
      "The Floor 2 control room and the Floor 3 server room form the information spine linking every floor, alarm and camera.",
    chain: "F02 ↔ F03 ↔ all floors",
  },
  {
    id: "waste",
    label: "Waste",
    color: "var(--sys-waste)",
    resource: "waste",
    description:
      "Organic and water waste from Floors 5 to 9 is segregated, digested and treated on Floor 10, conceptually returning energy and water to the community.",
    chain: "F05 – F09 → F10",
  },
  {
    id: "people",
    label: "People",
    color: "var(--sys-people)",
    resource: "morale",
    description:
      "24 residents move between quarters, work areas, community spaces and, during emergencies, predefined safe areas.",
    chain: "F01 → F06/F07 → F08 → F09",
  },
];

export const systemById = (id: SystemId) => SYSTEMS.find((s) => s.id === id)!;

export const POPULATION_BREAKDOWN = [
  { label: "Adults", count: 12 },
  { label: "Children", count: 5 },
  { label: "Medical staff", count: 3 },
  { label: "Maintenance staff", count: 2 },
  { label: "Education & community staff", count: 2 },
];
