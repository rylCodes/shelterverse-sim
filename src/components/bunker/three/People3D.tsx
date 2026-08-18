import { useMemo } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import { assignPeople } from "@/lib/bunker/people";
import type { FloorLayout } from "@/lib/bunker/layout3d";
import { SYSTEM_HEX } from "@/lib/bunker/layout3d";
import type { ScenarioId } from "@/lib/bunker/types";

/** Shared, disposed-with-the-scene primitives so hundreds of figures stay cheap. */
const BODY = new THREE.CapsuleGeometry(0.19, 0.52, 4, 10);
const HEAD = new THREE.SphereGeometry(0.17, 12, 10);

interface Props {
  layout: FloorLayout;
  floorId: number;
  scenario: ScenarioId;
  population: number;
}

export function People3D({ layout, floorId, scenario, population }: Props) {
  const materials = useMemo(() => {
    const base = new THREE.MeshStandardMaterial({
      color: SYSTEM_HEX.people,
      roughness: 0.45,
      metalness: 0.05,
      emissive: new THREE.Color(SYSTEM_HEX.people),
      emissiveIntensity: 0.55,
    });
    const child = base.clone();
    child.color = new THREE.Color("#9fb6d6");
    return { base, child };
  }, []);

  const figures = useMemo(() => {
    const byRoom = new Map(layout.boxes.map((b) => [b.room.id, b]));
    return assignPeople(scenario, population)
      .filter((p) => p.floor === floorId && byRoom.has(p.roomId))
      .map((p) => {
        const box = byRoom.get(p.roomId)!;
        const rotationY =
          box.side === "north"
            ? Math.PI
            : box.side === "south"
              ? 0
              : box.side === "east"
                ? Math.PI / 2
                : -Math.PI / 2;
        // local room space: x across width, z across depth
        const lx = (p.spread.u - 0.5) * (box.w - 1.1);
        const lz = (p.spread.v - 0.5) * (box.d - 1.4);
        const cos = Math.cos(rotationY);
        const sin = Math.sin(rotationY);
        return {
          id: p.id,
          child: p.child,
          x: box.x + lx * cos + lz * sin,
          z: box.z - lx * sin + lz * cos,
          heading: rotationY + (p.spread.u - 0.5) * 1.6,
          scale: p.child ? 0.72 : 1,
        };
      });
  }, [layout, floorId, scenario, population]);

  return (
    <group>
      {figures.map((f) => (
        <group
          key={f.id}
          position={[f.x, 0, f.z]}
          rotation={[0, f.heading, 0]}
          scale={f.scale}
          raycast={() => null}
        >
          <mesh
            geometry={BODY}
            material={f.child ? materials.child : materials.base}
            position={[0, 0.42, 0]}
            raycast={() => null}
          />
          <mesh
            geometry={HEAD}
            material={f.child ? materials.child : materials.base}
            position={[0, 0.87, 0]}
            raycast={() => null}
          />
        </group>
      ))}
    </group>
  );
}
