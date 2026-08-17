import { useMemo } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import type { FixtureKind } from "@/lib/bunker/types";

export const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
export const UNIT_CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);

type Part = {
  /** normalized position inside the room, -0.5..0.5 of width/depth */
  u: number;
  v: number;
  /** size in world units */
  sx: number;
  sy: number;
  sz: number;
  round?: boolean;
  accent?: boolean;
};

function grid(count: number, cols: number, sx: number, sy: number, sz: number, opts?: Partial<Part>): Part[] {
  const rows = Math.ceil(count / cols);
  const parts: Part[] = [];
  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    parts.push({
      u: (c + 0.5) / cols - 0.5,
      v: (r + 0.5) / rows - 0.5,
      sx,
      sy,
      sz,
      ...opts,
    });
  }
  return parts;
}

function partsFor(kind: FixtureKind): Part[] {
  switch (kind) {
    case "bunks":
      return [
        ...grid(2, 2, 0.9, 0.45, 1.9),
        { u: 0.32, v: -0.3, sx: 0.5, sy: 0.7, sz: 0.5 },
      ];
    case "beds":
      return grid(2, 2, 1, 0.4, 2);
    case "tanks":
      return grid(4, 2, 0.9, 1.5, 0.9, { round: true, accent: true });
    case "pumps":
      return [
        ...grid(2, 2, 0.8, 0.7, 0.8, { round: true, accent: true }),
        { u: 0, v: 0.38, sx: 2.4, sy: 0.22, sz: 0.22, round: true },
      ];
    case "plants":
      return grid(6, 3, 0.75, 0.5, 0.75, { accent: true });
    case "servers":
      return grid(4, 4, 0.55, 1.8, 0.9, { accent: true });
    case "medbed":
      return [
        { u: -0.15, v: 0, sx: 1, sy: 0.5, sz: 2 },
        { u: 0.3, v: 0.25, sx: 0.5, sy: 1.1, sz: 0.5, accent: true },
      ];
    case "cabinets":
      return grid(4, 2, 1.1, 1.6, 0.5);
    case "kitchen":
      return [
        { u: 0, v: 0.32, sx: 3.2, sy: 0.9, sz: 0.7 },
        { u: 0, v: -0.15, sx: 2.2, sy: 0.85, sz: 1, accent: true },
      ];
    case "seats":
      return grid(6, 3, 0.6, 0.45, 0.6);
    case "desks":
      return grid(4, 2, 1.4, 0.72, 0.7);
    case "machines":
      return grid(3, 3, 0.9, 1.2, 1, { accent: true });
    case "lockers":
      return grid(6, 3, 0.6, 1.7, 0.5);
    case "shower":
      return [
        ...grid(3, 3, 0.75, 1.9, 0.75),
        { u: 0, v: -0.35, sx: 2.4, sy: 0.15, sz: 0.6, accent: true },
      ];
    case "screens":
      return [
        { u: 0, v: 0.34, sx: 2.8, sy: 1, sz: 0.12, accent: true },
        ...grid(3, 3, 1, 0.72, 0.6),
      ];
    case "park":
      return [
        { u: 0, v: 0, sx: 2.6, sy: 0.14, sz: 2.4, accent: true },
        ...grid(3, 3, 0.5, 1.2, 0.5, { round: true, accent: true }),
      ];
    case "gym":
      return [
        ...grid(3, 3, 0.8, 0.9, 0.8),
        { u: 0, v: -0.34, sx: 2.6, sy: 0.12, sz: 0.8, accent: true },
      ];
    default:
      return grid(2, 2, 1, 0.8, 0.9);
  }
}

interface Props {
  kind: FixtureKind;
  w: number;
  d: number;
  base: THREE.Material;
  accent: THREE.Material;
}

export function Fixtures3D({ kind, w, d, base, accent }: Props) {
  const parts = useMemo(() => partsFor(kind), [kind]);
  const iw = w - 0.7;
  const id = d - 0.7;

  return (
    <group>
      {parts.map((p, i) => {
        const sx = Math.min(p.sx, iw / 2.2);
        const sz = Math.min(p.sz, id / 2.6);
        return (
          <mesh
            key={i}
            geometry={p.round ? UNIT_CYL : UNIT_BOX}
            material={p.accent ? accent : base}
            position={[p.u * iw, p.sy / 2 + 0.06, p.v * id]}
            scale={[sx, p.sy, sz]}
            raycast={() => null}
          />
        );
      })}
    </group>
  );
}
