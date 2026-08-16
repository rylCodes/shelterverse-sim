import { SURFACE_H, VIEW_W } from "@/lib/bunker/flows";
import type { ScenarioId } from "@/lib/bunker/types";

export function Surface({ scenario }: { scenario: ScenarioId }) {
  const ground = SURFACE_H - 42;
  const dark = scenario === "storm" || scenario === "blackout" || scenario === "wildfire";

  return (
    <g>
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? "oklch(0.22 0.03 260)" : "oklch(0.4 0.05 245)"} />
          <stop offset="100%" stopColor="oklch(0.26 0.02 250)" />
        </linearGradient>
        <linearGradient id="earth-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.29 0.03 70)" />
          <stop offset="100%" stopColor="oklch(0.2 0.015 60)" />
        </linearGradient>
        <linearGradient id="flood-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sys-water)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--sys-water)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <rect x={0} y={0} width={VIEW_W} height={ground} fill="url(#sky-grad)" />
      <rect x={0} y={ground} width={VIEW_W} height={SURFACE_H - ground} fill="url(#earth-grad)" />
      <path
        d={`M 0 ${ground} Q 150 ${ground - 14} 300 ${ground - 4} T 640 ${ground - 8} T 980 ${ground - 2} T ${VIEW_W} ${ground - 6} L ${VIEW_W} ${ground + 6} L 0 ${ground + 6} Z`}
        fill="oklch(0.32 0.035 100)"
        opacity={0.8}
      />

      {/* trees */}
      {[90, 160, 240, 900, 1010, 1120].map((x, i) => (
        <g key={x} opacity={scenario === "wildfire" ? 0.5 : 0.95}>
          <rect x={x - 1.5} y={ground - 20} width={3} height={20} fill="oklch(0.3 0.03 60)" />
          <circle cx={x} cy={ground - 26} r={11 + (i % 3) * 2} fill="var(--sys-food)" opacity={0.45} />
          <circle cx={x - 5} cy={ground - 20} r={8} fill="var(--sys-food)" opacity={0.32} />
        </g>
      ))}

      {/* solar array */}
      <g opacity={scenario === "storm" || scenario === "blackout" ? 0.35 : 1}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${380 + i * 54} ${ground - 34})`}>
            <rect x={0} y={0} width={44} height={22} rx={2} fill="var(--sys-power)" opacity={0.28} transform="skewX(-18)" />
            <rect x={0} y={0} width={44} height={22} rx={2} fill="none" stroke="var(--sys-power)" strokeWidth={0.8} transform="skewX(-18)" />
            <line x1={14} y1={22} x2={18} y2={34} stroke="var(--concrete-light)" strokeWidth={2} />
          </g>
        ))}
        <text x={380} y={ground - 42} fill="var(--sys-power)" fontSize={10} letterSpacing={1.4} opacity={0.85}>
          SOLAR ARRAY
        </text>
      </g>

      {/* rainwater collection */}
      <g>
        <path d={`M 660 ${ground - 30} l 34 -14 l 34 14 z`} fill="none" stroke="var(--sys-water)" strokeWidth={1.2} opacity={0.8} />
        <rect x={684} y={ground - 30} width={20} height={30} rx={2} fill="var(--concrete)" stroke="var(--sys-water)" strokeWidth={0.9} />
        <text x={648} y={ground - 48} fill="var(--sys-water)" fontSize={10} letterSpacing={1.4} opacity={0.85}>
          RAINWATER COLLECTION
        </text>
      </g>

      {/* main entrance head-house */}
      <g>
        <rect x={ROOM_ENTRY_X} y={ground - 46} width={90} height={46} rx={3} fill="var(--concrete)" stroke="var(--concrete-light)" strokeWidth={1.4} />
        <rect x={ROOM_ENTRY_X + 34} y={ground - 26} width={22} height={26} rx={2} fill="var(--concrete-dark)" stroke="var(--sys-people)" strokeWidth={0.8} />
        <text x={ROOM_ENTRY_X} y={ground - 54} fill="var(--sys-people)" fontSize={10} letterSpacing={1.4} opacity={0.85}>
          MAIN ENTRANCE
        </text>
      </g>

      {/* emergency access */}
      <g>
        <rect x={1040} y={ground - 28} width={40} height={28} rx={3} fill="var(--concrete)" stroke="var(--status-warn)" strokeWidth={1} opacity={0.9} />
        <text x={1000} y={ground - 36} fill="var(--status-warn)" fontSize={9} letterSpacing={1.2} opacity={0.8}>
          EMERGENCY ACCESS
        </text>
      </g>

      {scenario === "flood" && (
        <>
          <rect x={0} y={ground - 46} width={VIEW_W} height={SURFACE_H - ground + 46} fill="url(#flood-grad)" />
          <path
            d={`M 0 ${ground - 46} q 60 -8 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`}
            stroke="var(--sys-water)"
            strokeWidth={2}
            fill="none"
            opacity={0.8}
            className="bsb-pulse"
          />
        </>
      )}

      {scenario === "wildfire" && (
        <g className="bsb-pulse">
          {[120, 340, 560, 780, 1000].map((x, i) => (
            <circle key={x} cx={x} cy={ground - 60 - (i % 3) * 18} r={70} fill="oklch(0.55 0.08 60)" opacity={0.16} />
          ))}
          <rect x={0} y={0} width={VIEW_W} height={ground} fill="oklch(0.6 0.1 65)" opacity={0.12} />
        </g>
      )}

      {scenario === "storm" && (
        <g>
          {Array.from({ length: 46 }).map((_, i) => (
            <line
              key={i}
              x1={(i * 27) % VIEW_W}
              y1={((i * 37) % ground) - 20}
              x2={((i * 27) % VIEW_W) - 6}
              y2={((i * 37) % ground) + 8}
              stroke="var(--sys-water)"
              strokeWidth={1}
              opacity={0.45}
              className="bsb-rain"
              style={{ animationDelay: `${(i % 7) * 0.1}s` }}
            />
          ))}
          <path d="M 300 20 l -14 46 l 16 0 l -10 40 l 34 -56 l -18 0 l 14 -30 z" fill="var(--sys-power)" opacity={0.75} className="bsb-flicker" />
        </g>
      )}

      {scenario === "earthquake" && (
        <g opacity={0.5}>
          {[200, 500, 820].map((x) => (
            <circle key={x} cx={x} cy={ground - 8} r={26} fill="oklch(0.6 0.03 70)" opacity={0.18} className="bsb-pulse" />
          ))}
        </g>
      )}
    </g>
  );
}

const ROOM_ENTRY_X = 150;
