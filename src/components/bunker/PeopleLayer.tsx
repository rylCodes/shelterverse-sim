import { peopleFor } from "@/lib/bunker/people";
import type { ScenarioId } from "@/lib/bunker/types";

interface Props {
  scenario: ScenarioId;
  population: number;
  highlight: boolean;
  dimFloors: number[] | null;
}

export function PeopleLayer({ scenario, population, highlight, dimFloors }: Props) {
  const people = peopleFor(scenario, population);
  return (
    <g style={{ pointerEvents: "none" }}>
      {people.map((p) => {
        const dim = dimFloors ? !dimFloors.includes(p.floor) : false;
        const scale = p.child ? 0.72 : 1;
        return (
          <g
            key={p.id}
            transform={`translate(${p.x} ${p.y}) scale(${scale})`}
            opacity={dim ? 0.15 : highlight ? 1 : 0.85}
            style={{ transition: "opacity 400ms ease" }}
          >
            <g className="bsb-bob" style={{ animationDelay: `${p.delay}s` }}>
              <circle cx={0} cy={-13} r={2.6} fill={highlight ? "var(--sys-people)" : "var(--foreground)"} opacity={0.95} />
              <path
                d="M 0 -10 L 0 -4 M 0 -8.5 L -3.2 -5.5 M 0 -8.5 L 3.2 -5.5 M 0 -4 L -2.6 0 M 0 -4 L 2.6 0"
                stroke={highlight ? "var(--sys-people)" : "var(--foreground)"}
                strokeWidth={1.3}
                strokeLinecap="round"
                fill="none"
                opacity={0.9}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}
