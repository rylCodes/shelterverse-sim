import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { SimState } from "@/lib/bunker/types";
import type { Action as SimAction } from "@/lib/bunker/simulation";

export interface DemoStep {
  title: string;
  body: string;
  apply: (dispatch: (a: SimAction) => void) => void;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    title: "The complete shelter",
    body: "BSB — Beyond Safe Boundaries is a conceptual ten-floor underground community for 20–30 people during prolonged emergencies.",
    apply: (d) => {
      d({ type: "selectFloor", floor: null });
      d({ type: "selectSystem", system: null });
      d({ type: "scenario", id: "normal" });
    },
  },
  {
    title: "Floor 1 — Entry & decontamination",
    body: "Everything enters through one controlled threshold: check-in, safety gear, two decontamination bays and the primary generators.",
    apply: (d) => d({ type: "selectFloor", floor: 1 }),
  },
  {
    title: "Floor 3 — Life support",
    body: "Water treatment, air filtration, HVAC, fire pumps and the server room. This floor keeps every other floor alive.",
    apply: (d) => d({ type: "selectFloor", floor: 3 }),
  },
  {
    title: "Floor 4 — Medical",
    body: "Treatment, isolation, pharmacy and counselling — the most power- and air-dependent floor in the shelter.",
    apply: (d) => {
      d({ type: "selectFloor", floor: 4 });
      d({ type: "selectSystem", system: "medical" });
    },
  },
  {
    title: "Floor 5 — Food production",
    body: "Aquaponics, hydroponics and poultry turn treated water and light into food, then pass organic waste down to Floor 10.",
    apply: (d) => {
      d({ type: "selectFloor", floor: 5 });
      d({ type: "selectSystem", system: "food" });
    },
  },
  {
    title: "Floors 6–9 — Living, community, learning",
    body: "Sixteen bedrooms, a kitchen and dining hall, gym, theatre, indoor park, library and classrooms: the part that makes it a community.",
    apply: (d) => {
      d({ type: "selectFloor", floor: 8 });
      d({ type: "selectSystem", system: "people" });
    },
  },
  {
    title: "Simulating an earthquake",
    body: "Structural integrity and power drop, emergency lighting activates and residents relocate to predefined safe areas.",
    apply: (d) => {
      d({ type: "selectFloor", floor: null });
      d({ type: "selectSystem", system: null });
      d({ type: "scenario", id: "earthquake" });
    },
  },
  {
    title: "Cascading effects",
    body: "Low power immediately warns water treatment, air filtration, communications, food production and medical equipment.",
    apply: (d) => d({ type: "selectSystem", system: "power" }),
  },
  {
    title: "Seven days later",
    body: "Resources are recalculated: consumption, production, waste and well-being all move together.",
    apply: (d) => {
      d({ type: "selectSystem", system: null });
      d({ type: "advance", days: 7 });
    },
  },
  {
    title: "The goal",
    body: "“The goal is not simply to survive the disaster. It is to maintain a functioning community after the disaster.”",
    apply: (d) => d({ type: "selectFloor", floor: null }),
  },
];

interface Props {
  step: number;
  state: SimState;
  dispatch: (a: SimAction) => void;
  onExit: () => void;
  onStep: (n: number) => void;
}

export function GuidedDemo({ step, dispatch, onExit, onStep }: Props) {
  const current = DEMO_STEPS[step]!;

  useEffect(() => {
    current.apply(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
      if (e.key === "ArrowRight" && step < DEMO_STEPS.length - 1) onStep(step + 1);
      if (e.key === "ArrowLeft" && step > 0) onStep(step - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [step, onExit, onStep]);

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 flex justify-center p-4">
      <div className="w-full max-w-3xl rounded-lg border border-primary/50 bg-card/95 p-4 shadow-lg backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              Guided demo · {step + 1} / {DEMO_STEPS.length}
            </p>
            <h3 className="mt-0.5 font-mono text-sm uppercase tracking-[0.1em] text-foreground">{current.title}</h3>
          </div>
          <button onClick={onExit} aria-label="Exit guided demo" className="rounded border border-border p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.body}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="mr-1 inline h-3 w-3" /> Back
          </button>
          {step < DEMO_STEPS.length - 1 ? (
            <button
              onClick={() => onStep(step + 1)}
              className="rounded border border-primary bg-primary/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
            >
              Next <ChevronRight className="ml-1 inline h-3 w-3" />
            </button>
          ) : (
            <button
              onClick={onExit}
              className="rounded border border-primary bg-primary/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
            >
              Finish
            </button>
          )}
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            ESC to exit
          </span>
        </div>
      </div>
    </div>
  );
}
