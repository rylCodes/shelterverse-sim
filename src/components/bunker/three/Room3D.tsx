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
  const { w, d } = box;
  const wallMat = selected
    ? materials.wallSelected
    : hovered
      ? materials.wallHover
      : dimmed
        ? materials.wallDim
        : materials.wall;

  // corridor-facing side (door gap) is -z for north rooms, +z for south rooms
  const doorSign = box.side === "north" ? -1 : 1;
  const doorW = Math.min(1.3, w * 0.4);
  const sideW = (w - doorW) / 2;

  const walls = useMemo(() => {
    const list: { pos: [number, number, number]; scale: [number, number, number] }[] = [
      // back wall (away from corridor)
      { pos: [0, height / 2, -doorSign * (d / 2)], scale: [w, height, T] },
      // left / right walls
      { pos: [-w / 2, height / 2, 0], scale: [T, height, d] },
      { pos: [w / 2, height / 2, 0], scale: [T, height, d] },
      // corridor wall split by a door opening
      { pos: [-(doorW / 2 + sideW / 2), height / 2, doorSign * (d / 2)], scale: [sideW, height, T] },
      { pos: [doorW / 2 + sideW / 2, height / 2, doorSign * (d / 2)], scale: [sideW, height, T] },
      // lintel over the door
      {
        pos: [0, height - 0.25, doorSign * (d / 2)],
        scale: [doorW, 0.5, T],
      },
    ];
    return list;
  }, [w, d, height, doorSign, doorW, sideW]);

  return (
    <group
      position={[box.x, 0, box.z]}
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
      {/* floor tile — also the click target */}
      <mesh
        geometry={UNIT_BOX}
        material={selected ? materials.tileSelected : materials.tile}
        position={[0, 0.02, 0]}
        scale={[w - 0.04, 0.06, d - 0.04]}
      />

      {walls.map((s, i) => (
        <mesh key={i} geometry={UNIT_BOX} material={wallMat} position={s.pos} scale={s.scale} raycast={() => null} />
      ))}

      {/* accent strip along the corridor face */}
      <mesh
        geometry={UNIT_BOX}
        position={[0, 0.09, doorSign * (d / 2 - 0.09)]}
        scale={[w - 0.3, 0.05, 0.1]}
        raycast={() => null}
      >
        <meshBasicMaterial color={accentHex} transparent opacity={selected ? 0.95 : 0.4} />
      </mesh>

      <Fixtures3D
        kind={box.room.fixture}
        w={w}
        d={d}
        base={materials.fixture}
        accent={materials.fixtureAccent}
      />

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
