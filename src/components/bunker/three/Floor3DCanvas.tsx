import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { floorLayout, PALETTE_3D } from "@/lib/bunker/layout3d";
import { Floor3DScene } from "./Floor3DScene";

interface Props {
  floorId: number;
  selectedRoom: string | null;
  showLabels: boolean;
  resetKey: number;
  onSelectRoom: (id: string | null) => void;
}

function camFor(floorId: number, aspect = 1.6): [number, number, number] {
  const { width } = floorLayout(floorId);
  const k = Math.max(0.9, width / 26) * Math.max(1, 1.3 / Math.max(aspect, 0.4));
  return [18 * k, 15 * k, 22 * k];
}

/** Frames the floor whenever it changes, on reset, and on resize. */
function FitCamera({ floorId, resetKey }: { floorId: number; resetKey: number }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    camera.position.set(...camFor(floorId, aspect));
    camera.lookAt(0, 1, 0);
    if (controls) {
      controls.target.set(0, 1, 0);
      controls.update();
    }
    invalidate();
  }, [floorId, resetKey, size.width, size.height, camera, controls, invalidate]);

  return null;
}
export default function Floor3DCanvas({
  floorId,
  selectedRoom,
  showLabels,
  resetKey,
  onSelectRoom,
}: Props) {
  return (

    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: camFor(floorId), fov: 42, near: 0.5, far: 300 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "none", background: PALETTE_3D.background }}
    >
      <color attach="background" args={[PALETTE_3D.background]} />
      <fog attach="fog" args={[PALETTE_3D.background, 45, 130]} />
      <FitCamera floorId={floorId} resetKey={resetKey} />





      <Grid
        args={[120, 120]}
        cellSize={2}
        cellColor="#232b34"
        sectionSize={10}
        sectionColor="#2f3a46"
        position={[0, -0.42, 0]}
        infiniteGrid
        fadeDistance={90}
        fadeStrength={2}
      />

      <Floor3DScene
        key={floorId}
        floorId={floorId}
        selectedRoom={selectedRoom}
        showLabels={showLabels}
        onSelectRoom={onSelectRoom}
      />

      <OrbitControls
        makeDefault

        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={120}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}
