import { FLOWS, flowPath, floorMid, ROOM_X0 } from "@/lib/bunker/flows";
import { systemById } from "@/lib/bunker/systems";
import type { SystemId } from "@/lib/bunker/types";

interface Props {
  active: SystemId | null;
  stressed: Set<SystemId>;
}

export function SystemFlow({ active, stressed }: Props) {
  return (
    <g style={{ pointerEvents: "none" }}>
      {FLOWS.map((flow) => {
        const isActive = active === flow.system;
        const sys = systemById(flow.system);
        const degraded = stressed.has(flow.system);
        return (
          <g
            key={flow.system}
            opacity={active ? (isActive ? 1 : 0.05) : 0.28}
            style={{ transition: "opacity 400ms ease" }}
          >
            <path
              d={flowPath(flow)}
              stroke={degraded ? "var(--status-crit)" : sys.color}
              strokeWidth={isActive ? 2.4 : 1.4}
              fill="none"
              strokeLinecap="round"
              opacity={0.55}
            />
            {isActive && (
              <path
                d={flowPath(flow)}
                stroke={degraded ? "var(--status-crit)" : sys.color}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                className="bsb-dash"
              />
            )}
            {isActive &&
              flow.branches.map((b) => (
                <circle key={b} cx={ROOM_X0 - 10} cy={floorMid(b)} r={3} fill={sys.color} className="bsb-pulse" />
              ))}
          </g>
        );
      })}
    </g>
  );
}
