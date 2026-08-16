import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useReducer, useState } from "react";
import { Maximize2, Play, ShieldAlert } from "lucide-react";
import { BunkerVisualization } from "@/components/bunker/BunkerVisualization";
import { FloorNavigator } from "@/components/bunker/FloorNavigator";
import { SystemsView } from "@/components/bunker/SystemsView";
import { SurvivalDashboard } from "@/components/bunker/SurvivalDashboard";
import { DisasterControls } from "@/components/bunker/DisasterControls";
import { TimeControls } from "@/components/bunker/TimeControls";
import { EventLog } from "@/components/bunker/EventLog";
import { RoomInfoPanel } from "@/components/bunker/RoomInfoPanel";
import { GuidedDemo, DEMO_STEPS } from "@/components/bunker/GuidedDemo";
import { initialState, reducer } from "@/lib/bunker/simulation";

const TITLE = "BSB — Beyond Safe Boundaries | 10-Floor Shelter Simulator";
const DESC =
  "Explore an interactive 10-floor underground emergency community: systems, dependencies, disaster scenarios and resource simulation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => dispatch({ type: "advance", days: 1 }), 4000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.presentation) dispatch({ type: "presentation", on: false });
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [state.presentation]);

  const presenting = state.presentation;
  const demo = state.demoStep;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-3 mr-auto">
            <img className="w-12 h-auto" src="/bnb-logo.png" alt="" />
            <div className="mr-auto">
              <h1
                className={`font-mono uppercase tracking-[0.28em] text-foreground ${presenting ? "text-xl" : "text-base"}`}
              >
                BSB <span className="text-primary">— Beyond Safe Boundaries</span>
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Interactive 10-floor underground emergency community
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: "demoStep", step: demo === null ? 0 : null })}
            className="rounded border border-primary bg-primary/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
          >
            <Play className="mr-1 inline h-3 w-3" />
            {demo === null ? "Start guided demo" : "Exit demo"}
          </button>
          <button
            onClick={() => dispatch({ type: "presentation", on: !presenting })}
            className="rounded border border-border bg-card/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
          >
            <Maximize2 className="mr-1 inline h-3 w-3" />
            {presenting ? "Exit presentation (ESC)" : "Presentation mode"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] px-4 py-4">
        <div
          className={`grid gap-4 ${presenting ? "lg:grid-cols-[110px_1fr_260px]" : "lg:grid-cols-[190px_1fr_330px]"}`}
        >
          <div className="order-2 lg:order-1">
            <FloorNavigator
              selected={state.selectedFloor}
              onSelect={(floor) => dispatch({ type: "selectFloor", floor })}
              compact={presenting}
            />
          </div>

          <div className="order-1 flex flex-col gap-3 lg:order-2">
            <div className={presenting ? "h-[80vh]" : "h-[70vh] min-h-125"}>
              <BunkerVisualization
                state={state}
                onSelectRoom={(room) => dispatch({ type: "selectRoom", room })}
                onSelectFloor={(floor) => dispatch({ type: "selectFloor", floor })}
              />
            </div>
            <TimeControls
              day={state.day}
              hour={state.hour}
              minute={state.minute}
              running={running}
              onToggleRun={() => setRunning((r) => !r)}
              onAdvance={(days) => dispatch({ type: "advance", days })}
              onReset={() => {
                setRunning(false);
                dispatch({ type: "reset" });
              }}
            />
            {!presenting && (
              <div className="grid gap-3 md:grid-cols-2">
                <DisasterControls
                  scenario={state.scenario}
                  onSelect={(id) => dispatch({ type: "scenario", id })}
                />
                <SystemsView
                  selected={state.selectedSystem}
                  onSelect={(system) => dispatch({ type: "selectSystem", system })}
                  resources={state.resources}
                />
              </div>
            )}
            {presenting && (
              <DisasterControls
                scenario={state.scenario}
                onSelect={(id) => dispatch({ type: "scenario", id })}
              />
            )}
          </div>

          <div className="order-3 flex flex-col gap-3">
            <SurvivalDashboard state={state} large={presenting} />
            {!presenting && (
              <RoomInfoPanel
                state={state}
                onClose={() => dispatch({ type: "selectRoom", room: null })}
              />
            )}
            {!presenting && <EventLog events={state.events} className="max-h-72" />}
          </div>
        </div>

        {!presenting && (
          <section className="mt-6 grid gap-3 rounded border border-border bg-card/50 p-4 md:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-primary">
                <ShieldAlert className="h-4 w-4" aria-hidden /> Why it matters
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A resilient emergency shelter is an interconnected system. Water, energy, air, food,
                healthcare, sanitation, communication and community life all depend on one another.
                Weakening one of them weakens all of the others — which is why BSB is modelled as a
                single living system rather than ten separate floors.
              </p>
            </div>
            <div>
              <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Educational framing
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Conceptual educational model. Simulation values and facility layouts are
                illustrative and are not engineering, medical, architectural, security, or
                construction guidance.
              </p>
            </div>
          </section>
        )}
      </main>

      {demo !== null && (
        <GuidedDemo
          step={Math.min(demo, DEMO_STEPS.length - 1)}
          state={state}
          dispatch={dispatch}
          onExit={() => dispatch({ type: "demoStep", step: null })}
          onStep={(n) => dispatch({ type: "demoStep", step: n })}
        />
      )}
    </div>
  );
}
