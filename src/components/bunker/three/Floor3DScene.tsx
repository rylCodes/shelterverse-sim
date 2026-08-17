import { useEffect, useMemo, useState } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { floorLayout, PALETTE_3D, SYSTEM_HEX } from "@/lib/bunker/layout3d";
import { floorById } from "@/lib/bunker/floors";
import { Room3D } from "./Room3D";
import { UNIT_BOX } from "./Fixtures3D";

interface Props {
  floorId: number;
  selectedRoom: string | null;
  showLabels: boolean;
  onSelectRoom: (id: string | null) => void;
}

export function Floor3DScene({ floorId, selectedRoom, showLabels, onSelectRoom }: Props) {
  const layout = useMemo(() => floorLayout(floorId), [floorId]);
  const floor = floorById(floorId);
  const accent = SYSTEM_HEX[floor.accent];

  const materials = useMemo(() => {
    const std = (color: string, opts: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, ...opts });
    return {
      wall: std(PALETTE_3D.wall),
      wallHover: std(PALETTE_3D.wallTop, { emissive: new THREE.Color(accent), emissiveIntensity: 0.12 }),
      wallDim: std(PALETTE_3D.wall, { transparent: true, opacity: 0.35 }),
      wallSelected: std(PALETTE_3D.wallTop, { emissive: new THREE.Color(accent), emissiveIntensity: 0.28 }),
      tile: std(PALETTE_3D.slab),
      tileSelected: std(PALETTE_3D.slab, { emissive: new THREE.Color(accent), emissiveIntensity: 0.45 }),
      fixture: std(PALETTE_3D.fixture),
      fixtureAccent: std(accent, { emissive: new THREE.Color(accent), emissiveIntensity: 0.18 }),
      slab: std(PALETTE_3D.slab, { roughness: 1 }),
      corridor: std(PALETTE_3D.corridor, { roughness: 1 }),
      core: std(PALETTE_3D.core),
    };
  }, [accent]);

  // dispose per-floor materials when the floor changes / view unmounts
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  const [hovered, setHovered] = useState<string | null>(null);
  const { width, depth, wallHeight, core, corridorWidth } = layout;

  return (
    <group>
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#93a7bd", "#10141a", 0.7]} />
      <directionalLight position={[14, 20, 10]} intensity={0.95} />
      <directionalLight position={[-12, 10, -8]} intensity={0.3} />

      {/* floor slab */}
      <mesh
        geometry={UNIT_BOX}
        material={materials.slab}
        position={[0, -0.2, 0]}
        scale={[width, 0.4, depth]}
        onClick={() => onSelectRoom(null)}
        onPointerOver={() => setHovered(null)}
      />
      {/* corridor inlay */}
      <mesh
        geometry={UNIT_BOX}
        material={materials.corridor}
        position={[0, 0.03, 0]}
        scale={[width - 0.6, 0.07, corridorWidth]}
        raycast={() => null}
      />

      {/* exterior shell: back + two ends (front left open for the cutaway) */}
      <mesh
        geometry={UNIT_BOX}
        material={materials.core}
        position={[0, wallHeight / 2, -depth / 2]}
        scale={[width, wallHeight, 0.3]}
        raycast={() => null}
      />
      <mesh
        geometry={UNIT_BOX}
        material={materials.core}
        position={[-width / 2, wallHeight / 2, 0]}
        scale={[0.3, wallHeight, depth]}
        raycast={() => null}
      />
      <mesh
        geometry={UNIT_BOX}
        material={materials.core}
        position={[width / 2, wallHeight / 2, 0]}
        scale={[0.3, wallHeight, depth]}
        raycast={() => null}
      />

      {/* circulation core: elevator shaft + stair flight */}
      <group position={[core.x, 0, core.z]}>
        <mesh
          geometry={UNIT_BOX}
          material={materials.core}
          position={[-core.w / 4, wallHeight / 2, 0]}
          scale={[core.w / 2 - 0.15, wallHeight, core.d]}
          raycast={() => null}
        />
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh
            key={i}
            geometry={UNIT_BOX}
            material={materials.wall}
            position={[core.w / 4, 0.18 + i * 0.3, core.d / 2 - 0.35 - i * 0.38]}
            scale={[core.w / 2 - 0.2, 0.28, 0.36]}
            raycast={() => null}
          />
        ))}
        {showLabels && (
          <Html position={[0, wallHeight + 0.4, 0]} center distanceFactor={24} pointerEvents="none">
            <div
              style={{
                whiteSpace: "nowrap",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8a97a8",
              }}
            >
              Stairs / Elevator
            </div>
          </Html>
        )}
      </group>

      {layout.boxes.map((box) => (
        <Room3D
          key={box.room.id}
          box={box}
          height={wallHeight}
          accentHex={SYSTEM_HEX[box.room.systems[0] ?? floor.accent]}
          selected={selectedRoom === box.room.id}
          dimmed={selectedRoom !== null && selectedRoom !== box.room.id}
          hovered={hovered === box.room.id}
          showLabel={showLabels}
          materials={materials}
          onSelect={onSelectRoom}
          onHover={setHovered}
        />
      ))}
    </group>
  );
}
