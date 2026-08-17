import { useMemo } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import type { RoomBox } from "@/lib/bunker/layout3d";
import { PALETTE_3D } from "@/lib/bunker/layout3d";
import { Fixtures3D, UNIT_BOX } from "./Fixtures3D";

interface Props {
  box: RoomBox;
  height: number;
  accentHex: string;
  selected: boolean;
  dimmed: boolean;
  hovered: boolean;
  showLabel: boolean;
  onHover: (id: string | null) => void;
  materials: {
    wall: THREE.Material;
    wallHover: THREE.Material;
    wallDim: THREE.Material;
    wallSelected: THREE.Material;
    tile: THREE.Material;
    tileSelected: THREE.Material;
    fixture: THREE.Material;
    fixtureAccent: THREE.Material;
  };
  onSelect: (id: string) => void;
}

const T = 0.14; // wall thickness

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
  const { w, d, doorOffset = 0 } = box;
  const wallMat = selected
    ? materials.wallSelected
    : hovered
      ? materials.wallHover
      : dimmed
        ? materials.wallDim
        : materials.wall;

  const doorW = Math.min(1.3, w * 0.4);

  // Safely clamp the offset so there's always at least a little bit of wall structure remaining
  const maxOffset = w / 2 - doorW / 2 - 0.1;
  const safeOffset = Math.max(-maxOffset, Math.min(maxOffset, doorOffset));

  const leftW = w / 2 + safeOffset - doorW / 2;
  const rightW = w / 2 - safeOffset - doorW / 2;

  const leftCenter = -w / 2 + leftW / 2;
  const rightCenter = w / 2 - rightW / 2;

  // Door faces local -Z by default. We rotate the room so local -Z faces the central ring corridor.
  const rotationY =
    box.side === "north"
      ? Math.PI
      : box.side === "south"
        ? 0
        : box.side === "east"
          ? Math.PI / 2
          : -Math.PI / 2;

  const walls = useMemo(() => {
    return [
      // Outer back wall
      { pos: [0, height / 2, d / 2], scale: [w, height, T] },
      // Side walls
      { pos: [-w / 2, height / 2, 0], scale: [T, height, d] },
      { pos: [w / 2, height / 2, 0], scale: [T, height, d] },
      // Corridor-facing front wall split by offset door
      { pos: [leftCenter, height / 2, -d / 2], scale: [leftW, height, T] },
      { pos: [rightCenter, height / 2, -d / 2], scale: [rightW, height, T] },
      // Lintel over door
      { pos: [safeOffset, height - 0.25, -d / 2], scale: [doorW, 0.5, T] },
    ] as const;
  }, [w, d, height, leftCenter, leftW, rightCenter, rightW, safeOffset, doorW]);

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
        geometry={UNIT_BOX}
        material={selected ? materials.tileSelected : materials.tile}
        position={[0, 0.02, 0]}
        scale={[w - 0.04, 0.06, d - 0.04]}
      />

      {/* Room Walls */}
      {walls.map((s, i) => (
        <mesh
          key={i}
          geometry={UNIT_BOX}
          material={wallMat}
          position={s.pos as [number, number, number]}
          scale={s.scale as [number, number, number]}
          raycast={() => null}
        />
      ))}

      {/* Corridor Accent Threshold Strip aligned perfectly under the door */}
      <mesh
        geometry={UNIT_BOX}
        position={[safeOffset, 0.09, -d / 2 + 0.09]}
        scale={[doorW, 0.05, 0.1]}
        raycast={() => null}
      >
        <meshBasicMaterial color={accentHex} transparent opacity={selected ? 0.95 : 0.4} />
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
          position={[0, height + 0.35, 0]}
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
              padding: "2px 6px",
              borderRadius: 3,
              border: `1px solid ${selected || hovered ? accentHex : PALETTE_3D.slabEdge}`,
              background: "rgba(16,20,26,0.82)",
              color: selected || hovered ? accentHex : "#c8d2df",
              opacity: dimmed && !hovered ? 0.5 : 1,
            }}
          >
            {box.room.name}
          </div>
        </Html>
      )}
    </group>
  );
}
