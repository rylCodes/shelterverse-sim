import { useMemo } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import type { RoomBox } from "@/lib/bunker/layout3d";
import { PALETTE_3D } from "@/lib/bunker/layout3d";
import { Fixtures3D, UNIT_BOX } from "./Fixtures3D";

export interface FloorMaterials {
  wall: THREE.MeshPhysicalMaterial;
  wallHover: THREE.MeshPhysicalMaterial;
  wallDim: THREE.MeshPhysicalMaterial;
  wallSelected: THREE.MeshPhysicalMaterial;
  tile: THREE.MeshPhysicalMaterial;
  tileSelected: THREE.MeshPhysicalMaterial;
  fixture: THREE.MeshPhysicalMaterial;
  fixtureAccent: THREE.MeshPhysicalMaterial;
  slab: THREE.MeshPhysicalMaterial;
  corridor: THREE.MeshPhysicalMaterial;
  core: THREE.MeshPhysicalMaterial;
  metalDoor: THREE.MeshPhysicalMaterial;
  indicator: THREE.MeshBasicMaterial;
  railing: THREE.MeshPhysicalMaterial;
}

interface Props {
  box: RoomBox;
  height: number;
  accentHex: string;
  selected: boolean;
  dimmed: boolean;
  hovered: boolean;
  showLabel: boolean;
  onHover: (id: string | null) => void;
  materials: FloorMaterials;
  onSelect: (id: string) => void;
}

const T = 0.14; // wall thickness
const TRIM_T = 0.18; // baseboard thickness

export function Room3D({
  box,
  height,
  accentHex,
  selected,
  dimmed,
  hovered,
  showLabel,
  materials,
  onSelect,
  onHover,
}: Props) {
  const { w, d, doorOffset = 0, wideEntrance = false, openBack = false } = box;

  const wallMat = selected
    ? materials.wallSelected
    : hovered
      ? materials.wallHover
      : dimmed
        ? materials.wallDim
        : materials.wall;

  const doorW = wideEntrance
    ? Math.min(w - 0.3, w * 0.4) // 40%-wide opening
    : Math.min(1.3, w * 0.4);
  const maxOffset = w / 2 - doorW / 2 - 0.1;
  const safeOffset = Math.max(-maxOffset, Math.min(maxOffset, doorOffset));

  const leftW = w / 2 + safeOffset - doorW / 2;
  const rightW = w / 2 - safeOffset - doorW / 2;
  const leftCenter = -w / 2 + leftW / 2;
  const rightCenter = w / 2 - rightW / 2;

  const rotationY =
    box.side === "north"
      ? Math.PI
      : box.side === "south"
        ? 0
        : box.side === "east"
          ? Math.PI / 2
          : -Math.PI / 2;

  const walls = useMemo(() => {
    const result: { pos: [number, number, number]; scale: [number, number, number] }[] = [
      // front wall with door gap (corridor side)
      { pos: [leftCenter, height / 2, -d / 2], scale: [leftW, height, T] },
      { pos: [rightCenter, height / 2, -d / 2], scale: [rightW, height, T] },
      { pos: [safeOffset, height - 0.25, -d / 2], scale: [doorW, 0.5, T] },
      // side walls
      { pos: [-w / 2, height / 2, 0], scale: [T, height, d] },
      { pos: [w / 2, height / 2, 0], scale: [T, height, d] },
    ];

    if (!openBack) {
      // normal solid back wall
      result.push({ pos: [0, height / 2, d / 2], scale: [w, height, T] });
    }
    // openBack = no wall pushed → open passage to adjacent room

    return result;
  }, [w, d, height, leftCenter, leftW, rightCenter, rightW, safeOffset, doorW, openBack]);

  // Adding architectural trims for realistic AO catching
  const trims = useMemo(() => {
    return [
      { pos: [0, 0.08, d / 2 - 0.02], scale: [w - T, 0.12, TRIM_T] }, // Back baseboard
      { pos: [-w / 2 + 0.02, 0.08, 0], scale: [TRIM_T, 0.12, d - T] }, // Left baseboard
      { pos: [w / 2 - 0.02, 0.08, 0], scale: [TRIM_T, 0.12, d - T] }, // Right baseboard
    ] as const;
  }, [w, d]);

  return (
    <group
      position={[box.x, 0, box.z]}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(box.room.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover(box.room.id);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
        onHover(null);
      }}
    >
      {/* Floor Tile */}
      <mesh
        receiveShadow
        geometry={UNIT_BOX}
        material={selected ? materials.tileSelected : materials.tile}
        position={[0, 0.02, 0]}
        scale={[w - 0.04, 0.06, d - 0.04]}
      />

      {/* Baseboards (Adds depth for AO) */}
      {trims.map((s, i) => (
        <mesh
          key={`trim-${i}`}
          castShadow
          receiveShadow
          geometry={UNIT_BOX}
          material={materials.metalDoor} // Dark metallic trims look industrial
          position={s.pos as [number, number, number]}
          scale={s.scale as [number, number, number]}
          raycast={() => null}
        />
      ))}

      {/* Room Walls */}
      {walls.map((s, i) => (
        <mesh
          key={`wall-${i}`}
          castShadow
          receiveShadow
          geometry={UNIT_BOX}
          material={wallMat}
          position={s.pos as [number, number, number]}
          scale={s.scale as [number, number, number]}
          raycast={() => null}
        />
      ))}

      {/* Corridor Accent Threshold Strip */}
      <mesh
        receiveShadow
        geometry={UNIT_BOX}
        position={[safeOffset, 0.05, -d / 2 + 0.09]}
        scale={[doorW, 0.1, 0.14]}
        raycast={() => null}
      >
        <meshStandardMaterial
          color={accentHex}
          emissive={accentHex}
          emissiveIntensity={selected || hovered ? 2 : 0.5}
          transparent
          opacity={selected ? 1 : 0.7}
        />
      </mesh>

      {/* Internal Furniture / Fixtures */}
      <Fixtures3D
        kind={box.room.fixture}
        w={w}
        d={d}
        base={materials.fixture}
        accent={materials.fixtureAccent}
      />

      {/* Label Tag */}
      {(showLabel || hovered || selected) && (
        <Html
          position={[0, height + 0.4, 0]}
          center
          distanceFactor={22}
          zIndexRange={[10, 0]}
          pointerEvents="none"
        >
          <div
            style={{
              whiteSpace: "nowrap",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "4px 8px",
              borderRadius: 4,
              border: `1px solid ${selected || hovered ? accentHex : PALETTE_3D.slabEdge}`,
              background: "rgba(10,14,20,0.85)",
              color: selected || hovered ? accentHex : "#c8d2df",
              opacity: dimmed && !hovered ? 0.4 : 1,
              backdropFilter: "blur(4px)",
              transition: "all 0.2s ease-in-out",
              boxShadow: selected || hovered ? `0 0 10px ${accentHex}40` : "none",
            }}
          >
            {box.room.name}
          </div>
        </Html>
      )}
    </group>
  );
}
