import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Box, Maximize, Minimize, RotateCcw, Tag } from "lucide-react";
import { FLOORS, floorById } from "@/lib/bunker/floors";
import { roomById } from "@/lib/bunker/rooms";
import { systemById } from "@/lib/bunker/systems";
import { assignPeople } from "@/lib/bunker/people";
import type { ScenarioId } from "@/lib/bunker/types";

const Floor3DCanvas = lazy(() => import("./Floor3DCanvas"));

interface Props {
  floorId: number;
  selectedRoom: string | null;
  scenario: ScenarioId;
  population: number;
  onSelectFloor: (id: number) => void;
  onSelectRoom: (id: string | null) => void;
}

export function Floor3DView({
  floorId,
  selectedRoom,
  scenario,
  population,
  onSelectFloor,
  onSelectRoom,
}: Props) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [labels, setLabels] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fsKey, setFsKey] = useState(0);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const h = () => {
      const isFs = Boolean(document.fullscreenElement);
      setFullscreen(isFs);
      setFsKey((k) => k + 1);
    };
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  }, []);

  const assignments = assignPeople(scenario, population);
  const here = assignments.filter((p) => p.floor === floorId).length;
  const elsewhere = assignments.length - here;

  const floor = floorById(floorId);
  const room = selectedRoom ? roomById(selectedRoom) : undefined;
  const roomOnFloor = room && room.floor === floorId ? room : undefined;

  const btn =
    "rounded border border-border bg-card/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground";

  return (
    <div
      ref={wrap}
      className="relative h-full w-full overflow-hidden rounded border border-border bg-background"
    >
      {/* top toolbar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-2 p-2">
        <div className="pointer-events-auto rounded border border-border bg-card/80 px-2 py-1.5 backdrop-blur">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            3D Explore
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
            {floor.code} · {floor.name}
          </p>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            {here} resident{here === 1 ? "" : "s"} here · {elsewhere} elsewhere
          </p>
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-1.5">
          <button className={btn} onClick={() => setResetKey((k) => k + 1)}>
            <RotateCcw className="mr-1 inline h-3 w-3" /> Reset view
          </button>
          <button className={btn} onClick={() => setLabels((l) => !l)}>
            <Tag className="mr-1 inline h-3 w-3" /> {labels ? "Hide labels" : "Show labels"}
          </button>
          <button className={btn} onClick={toggleFullscreen}>
            {fullscreen ? (
              <Minimize className="mr-1 inline h-3 w-3" />
            ) : (
              <Maximize className="mr-1 inline h-3 w-3" />
            )}
            {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* floor selector */}
      <div className="pointer-events-auto absolute bottom-2 left-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap gap-1 rounded border border-border bg-card/80 p-1.5 backdrop-blur">
        {FLOORS.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelectFloor(f.id)}
            aria-current={f.id === floorId}
            className={`rounded border px-1.5 py-1 font-mono text-[10px] tabular-nums tracking-[0.1em] transition-colors ${
              f.id === floorId
                ? "border-primary bg-primary/20 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
            }`}
          >
            {f.code}
          </button>
        ))}
      </div>

      {/* room readout */}
      {roomOnFloor && (
        <div className="pointer-events-auto absolute bottom-2 right-2 z-20 max-w-[min(20rem,calc(100%-1rem))] rounded border border-border bg-card/90 p-2.5 backdrop-blur">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
            {roomOnFloor.name}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {roomOnFloor.purpose}
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground/80">
            {roomOnFloor.why}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {roomOnFloor.systems.map((s) => (
              <span
                key={s}
                className="rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]"
                style={{ borderColor: systemById(s).color, color: systemById(s).color }}
              >
                {systemById(s).label}
              </span>
            ))}
          </div>
        </div>
      )}

      {hydrated ? (
        <Suspense fallback={<Loading />}>
          <Floor3DCanvas
            key={fsKey}
            floorId={floorId}
            selectedRoom={selectedRoom}
            showLabels={labels}
            resetKey={resetKey}
            scenario={scenario}
            population={population}
            onSelectRoom={onSelectRoom}
          />
        </Suspense>
      ) : (
        <Loading />
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <Box className="h-3.5 w-3.5 animate-pulse" aria-hidden /> Building 3D floor…
      </p>
    </div>
  );
}
