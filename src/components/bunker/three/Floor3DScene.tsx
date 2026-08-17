import { useEffect, useMemo, useState } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { floorLayout, PALETTE_3D, SYSTEM_HEX } from "@/lib/bunker/layout3d";
import { floorById } from "@/lib/bunker/floors";
import { Room3D, FloorMaterials } from "./Room3D";
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

  const materials: FloorMaterials = useMemo(() => {
    const phys = (color: string, opts: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.8, metalness: 0.1, ...opts });

    return {
      wall: phys(PALETTE_3D.wall, { roughness: 0.9, clearcoat: 0.05 }),
      wallHover: phys(PALETTE_3D.wallTop, {
        emissive: new THREE.Color(accent),
        emissiveIntensity: 0.2,
      }),
      wallDim: phys(PALETTE_3D.wall, { transparent: true, opacity: 0.35, depthWrite: false }),
      wallSelected: phys(PALETTE_3D.wallTop, {
        emissive: new THREE.Color(accent),
        emissiveIntensity: 0.5,
      }),
      tile: phys(PALETTE_3D.slab, { roughness: 0.4, clearcoat: 0.2 }),
      tileSelected: phys(PALETTE_3D.slab, {
        roughness: 0.2,
        clearcoat: 0.5,
        emissive: new THREE.Color(accent),
        emissiveIntensity: 0.3,
      }),
      fixture: phys(PALETTE_3D.fixture, { roughness: 0.6, metalness: 0.4 }),
      fixtureAccent: phys(accent, {
        emissive: new THREE.Color(accent),
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.8,
      }),
      slab: phys(PALETTE_3D.slab, { roughness: 1, metalness: 0 }),
      corridor: phys(PALETTE_3D.corridor, { roughness: 0.5, metalness: 0.2, clearcoat: 0.1 }),
      core: phys(PALETTE_3D.core, { roughness: 0.85 }),
      metalDoor: phys("#8a9ba8", {
        metalness: 0.8,
        roughness: 0.25,
        clearcoat: 0.3,
      }),
      indicator: new THREE.MeshBasicMaterial({ color: accent }),
      railing: phys("#303842", { metalness: 0.7, roughness: 0.2, clearcoat: 1.0 }),
    };
  }, [accent]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  const [hovered, setHovered] = useState<string | null>(null);

  const { width, depth, wallHeight, core, corridorWidth, loopInnerW, loopInnerD } = layout;

  const outerLoopW = loopInnerW + 2 * corridorWidth;
  const outerLoopD = loopInnerD + 2 * corridorWidth;

  const stairW = core.w * 0.48;
  const elevW = core.w * 0.48;

  return (
    <group>
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#a5b9cf", "#10141a", 0.4]} />

      {/* Configured Directional Light for Dynamic Shadows */}
      <directionalLight
        castShadow
        position={[20, 30, 20]}
        intensity={1.2}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-40, 40, 40, -40, 0.5, 100]} />
      </directionalLight>

      <directionalLight position={[-15, 15, -10]} intensity={0.2} color="#8a9ba8" />

      {/* Main Floor Slab */}
      <mesh
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.slab}
        position={[0, -0.2, 0]}
        scale={[width, 0.4, depth]}
        onClick={() => onSelectRoom(null)}
        onPointerOver={() => setHovered(null)}
      />

      {/* Ring Corridor Flooring */}
      <mesh
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.corridor}
        position={[0, 0.02, -loopInnerD / 2 - corridorWidth / 2]}
        scale={[outerLoopW, 0.05, corridorWidth]}
        raycast={() => null}
      />
      <mesh
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.corridor}
        position={[0, 0.02, loopInnerD / 2 + corridorWidth / 2]}
        scale={[outerLoopW, 0.05, corridorWidth]}
        raycast={() => null}
      />
      <mesh
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.corridor}
        position={[loopInnerW / 2 + corridorWidth / 2, 0.02, 0]}
        scale={[corridorWidth, 0.05, loopInnerD]}
        raycast={() => null}
      />
      <mesh
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.corridor}
        position={[-loopInnerW / 2 - corridorWidth / 2, 0.02, 0]}
        scale={[corridorWidth, 0.05, loopInnerD]}
        raycast={() => null}
      />

      {/* Inner Central Core Floor Tile */}
      <mesh
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.corridor}
        position={[0, 0.02, 0]}
        scale={[loopInnerW, 0.05, loopInnerD]}
        raycast={() => null}
      />

      {/* Outer Shell Walls */}
      <mesh
        castShadow
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.core}
        position={[0, wallHeight / 2, -depth / 2 + 0.15]}
        scale={[width, wallHeight, 0.3]}
        raycast={() => null}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.core}
        position={[0, wallHeight / 2, depth / 2 - 0.15]}
        scale={[width, wallHeight, 0.3]}
        raycast={() => null}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.core}
        position={[-width / 2 + 0.15, wallHeight / 2, 0]}
        scale={[0.3, wallHeight, depth]}
        raycast={() => null}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={UNIT_BOX}
        material={materials.core}
        position={[width / 2 - 0.15, wallHeight / 2, 0]}
        scale={[0.3, wallHeight, depth]}
        raycast={() => null}
      />

      {/* ==================== CENTRAL CIRCULATION CORE ==================== */}
      <group position={[0, 0, 0]}>
        {/* --- 1. ELEVATOR SHAFT (Left Side of Core) --- */}
        <group position={[-core.w / 4, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[0, wallHeight / 2, -core.d / 2]}
            scale={[elevW, wallHeight, 0.12]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[-elevW / 2, wallHeight / 2, 0]}
            scale={[0.12, wallHeight, core.d]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[elevW / 2, wallHeight / 2, 0]}
            scale={[0.12, wallHeight, core.d]}
            raycast={() => null}
          />

          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[-elevW / 2 + 0.2, wallHeight / 2, core.d / 2]}
            scale={[0.4, wallHeight, 0.12]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[elevW / 2 - 0.2, wallHeight / 2, core.d / 2]}
            scale={[0.4, wallHeight, 0.12]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[0, wallHeight - 0.3, core.d / 2]}
            scale={[elevW - 0.8, 0.6, 0.12]}
            raycast={() => null}
          />

          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.metalDoor}
            position={[-0.32, (wallHeight - 0.6) / 2, core.d / 2 - 0.02]}
            scale={[(elevW - 0.8) / 2 - 0.02, wallHeight - 0.6, 0.06]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.metalDoor}
            position={[0.32, (wallHeight - 0.6) / 2, core.d / 2 - 0.02]}
            scale={[(elevW - 0.8) / 2 - 0.02, wallHeight - 0.6, 0.06]}
            raycast={() => null}
          />

          <mesh
            geometry={UNIT_BOX}
            material={materials.indicator}
            position={[0, wallHeight - 0.45, core.d / 2 + 0.07]}
            scale={[0.5, 0.12, 0.04]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.metalDoor}
            position={[elevW / 2 - 0.1, 1.2, core.d / 2 + 0.07]}
            scale={[0.1, 0.25, 0.03]}
            raycast={() => null}
          />
          <mesh
            geometry={UNIT_BOX}
            material={materials.indicator}
            position={[elevW / 2 - 0.1, 1.25, core.d / 2 + 0.09]}
            scale={[0.04, 0.04, 0.02]}
            raycast={() => null}
          />

          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[0, wallHeight - 0.05, 0]}
            scale={[elevW, 0.1, core.d]}
            raycast={() => null}
          />
        </group>

        {/* --- 2. OPEN STAIRWELL (Right Side of Core) --- */}
        <group position={[core.w / 4, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[0, 0.45, -core.d / 2]}
            scale={[stairW, 0.9, 0.12]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[stairW / 2, 0.45, 0]}
            scale={[0.12, 0.9, core.d]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.core}
            position={[-stairW / 2, 0.45, -core.d / 4]}
            scale={[0.12, 0.9, core.d / 2]}
            raycast={() => null}
          />

          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              castShadow
              receiveShadow
              geometry={UNIT_BOX}
              material={materials.wall}
              position={[0, 0.12 + i * 0.26, core.d / 2 - 0.3 - i * 0.35]}
              scale={[stairW - 0.3, 0.18, 0.32]}
              raycast={() => null}
            />
          ))}

          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.wall}
            position={[0, 2.1, -core.d / 2 + 0.5]}
            scale={[stairW - 0.3, 0.18, 0.8]}
            raycast={() => null}
          />

          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.railing}
            position={[-stairW / 2 + 0.2, 1.15, 0]}
            scale={[0.04, 0.04, core.d - 0.4]}
            rotation={[0.55, 0, 0]}
            raycast={() => null}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={UNIT_BOX}
            material={materials.railing}
            position={[stairW / 2 - 0.2, 1.15, 0]}
            scale={[0.04, 0.04, core.d - 0.4]}
            rotation={[0.55, 0, 0]}
            raycast={() => null}
          />
        </group>

        {/* Label Overlay */}
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
                background: "rgba(16,20,26,0.8)",
                padding: "2px 8px",
                borderRadius: "3px",
                border: "1px solid #303842",
              }}
            >
              Elevator & Stairwell Core
            </div>
          </Html>
        )}
      </group>

      {/* Render Rooms */}
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
