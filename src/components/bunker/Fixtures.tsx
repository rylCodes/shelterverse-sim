import type { FixtureKind } from "@/lib/bunker/types";
import type { Rect } from "@/lib/bunker/flows";

interface Props {
  kind: FixtureKind;
  rect: Rect;
  accent: string;
}

/** Small schematic furniture / equipment drawn inside a room rect. */
export function Fixtures({ kind, rect, accent }: Props) {
  const { x, y, w, h } = rect;
  const base = y + h - 6;
  const items: React.ReactNode[] = [];
  const count = Math.max(1, Math.min(5, Math.floor(w / 22)));
  const step = w / (count + 1);

  const push = (n: React.ReactNode) => items.push(n);

  for (let i = 0; i < count; i++) {
    const cx = x + step * (i + 1);
    const k = `${kind}-${i}`;
    switch (kind) {
      case "beds":
      case "bunks":
        push(
          <g key={k}>
            <rect x={cx - 9} y={base - 8} width={18} height={8} rx={1.5} fill="var(--concrete-light)" stroke={accent} strokeWidth={0.6} />
            <rect x={cx - 9} y={base - 11} width={6} height={3} rx={1} fill={accent} opacity={0.7} />
            {kind === "bunks" && (
              <rect x={cx - 9} y={base - 18} width={18} height={5} rx={1.5} fill="var(--concrete-light)" stroke={accent} strokeWidth={0.5} opacity={0.8} />
            )}
          </g>,
        );
        break;
      case "tanks":
        push(
          <g key={k}>
            <rect x={cx - 8} y={base - 26} width={16} height={26} rx={4} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.8} />
            <rect x={cx - 6} y={base - 14} width={12} height={12} rx={2} fill={accent} opacity={0.35} className="bsb-pulse" />
          </g>,
        );
        break;
      case "pumps":
        push(
          <g key={k}>
            <circle cx={cx} cy={base - 9} r={7} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.9} />
            <circle cx={cx} cy={base - 9} r={2.6} fill={accent} className="bsb-pulse" />
            <rect x={cx - 10} y={base - 2} width={20} height={3} rx={1} fill="var(--concrete-light)" />
          </g>,
        );
        break;
      case "plants":
        push(
          <g key={k}>
            <rect x={cx - 10} y={base - 6} width={20} height={6} rx={1} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.5} />
            <rect x={cx - 10} y={base - 17} width={20} height={5} rx={1} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.5} />
            <path d={`M ${cx - 6} ${base - 6} q 2 -5 4 -1 q 2 -5 4 1`} stroke={accent} strokeWidth={1} fill="none" />
            <path d={`M ${cx - 6} ${base - 17} q 2 -4 4 -1 q 2 -4 4 1`} stroke={accent} strokeWidth={1} fill="none" opacity={0.8} />
          </g>,
        );
        break;
      case "servers":
        push(
          <g key={k}>
            <rect x={cx - 7} y={base - 26} width={14} height={26} rx={1.5} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.7} />
            {[0, 1, 2, 3].map((r) => (
              <line key={r} x1={cx - 4} y1={base - 22 + r * 6} x2={cx + 4} y2={base - 22 + r * 6} stroke={accent} strokeWidth={1} opacity={0.3 + r * 0.15} className={r === 1 ? "bsb-pulse" : undefined} />
            ))}
          </g>,
        );
        break;
      case "medbed":
        push(
          <g key={k}>
            <rect x={cx - 11} y={base - 7} width={22} height={7} rx={1.5} fill="var(--concrete-light)" stroke={accent} strokeWidth={0.7} />
            <rect x={cx + 6} y={base - 20} width={6} height={13} rx={1} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.6} />
            <path d={`M ${cx + 6.5} ${base - 14} l 1.5 -2 l 1.5 4 l 1.5 -3`} stroke={accent} strokeWidth={0.8} fill="none" className="bsb-pulse" />
          </g>,
        );
        break;
      case "cabinets":
      case "lockers":
        push(
          <g key={k}>
            <rect x={cx - 8} y={base - 24} width={16} height={24} rx={1} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.6} />
            <line x1={cx} y1={base - 24} x2={cx} y2={base} stroke={accent} strokeWidth={0.5} opacity={0.6} />
            <line x1={cx - 8} y1={base - 12} x2={cx + 8} y2={base - 12} stroke={accent} strokeWidth={0.5} opacity={0.4} />
          </g>,
        );
        break;
      case "kitchen":
        push(
          <g key={k}>
            <rect x={cx - 10} y={base - 10} width={20} height={10} rx={1} fill="var(--concrete-light)" stroke={accent} strokeWidth={0.7} />
            <circle cx={cx - 4} cy={base - 6} r={2} fill={accent} opacity={0.7} />
            <circle cx={cx + 4} cy={base - 6} r={2} fill={accent} opacity={0.5} />
            <rect x={cx - 8} y={base - 22} width={16} height={7} rx={1} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.5} />
          </g>,
        );
        break;
      case "seats":
        push(
          <g key={k}>
            <rect x={cx - 8} y={base - 6} width={16} height={6} rx={2} fill="var(--concrete-light)" stroke={accent} strokeWidth={0.6} />
            <rect x={cx - 8} y={base - 13} width={4} height={8} rx={1.5} fill="var(--concrete-light)" stroke={accent} strokeWidth={0.5} />
          </g>,
        );
        break;
      case "desks":
        push(
          <g key={k}>
            <rect x={cx - 9} y={base - 9} width={18} height={3} rx={1} fill="var(--concrete-light)" stroke={accent} strokeWidth={0.6} />
            <line x1={cx - 7} y1={base - 6} x2={cx - 7} y2={base} stroke={accent} strokeWidth={0.8} />
            <line x1={cx + 7} y1={base - 6} x2={cx + 7} y2={base} stroke={accent} strokeWidth={0.8} />
            <rect x={cx - 3} y={base - 16} width={8} height={6} rx={1} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.5} />
          </g>,
        );
        break;
      case "machines":
        push(
          <g key={k}>
            <rect x={cx - 9} y={base - 22} width={18} height={22} rx={2} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.8} />
            <circle cx={cx} cy={base - 13} r={5} fill="none" stroke={accent} strokeWidth={1} className="bsb-pulse" />
            <line x1={cx - 6} y1={base - 4} x2={cx + 6} y2={base - 4} stroke={accent} strokeWidth={0.8} opacity={0.6} />
          </g>,
        );
        break;
      case "shower":
        push(
          <g key={k}>
            <rect x={cx - 8} y={base - 20} width={16} height={20} rx={1.5} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.6} />
            <line x1={cx} y1={base - 18} x2={cx} y2={base - 13} stroke={accent} strokeWidth={0.8} />
            {[-3, 0, 3].map((d) => (
              <line key={d} x1={cx + d} y1={base - 12} x2={cx + d} y2={base - 5} stroke={accent} strokeWidth={0.7} opacity={0.6} className="bsb-pulse" />
            ))}
          </g>,
        );
        break;
      case "screens":
        push(
          <g key={k}>
            <rect x={cx - 10} y={base - 20} width={20} height={12} rx={1.5} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.8} />
            <rect x={cx - 7} y={base - 17} width={14} height={6} fill={accent} opacity={0.3} className="bsb-pulse" />
            <rect x={cx - 9} y={base - 6} width={18} height={3} rx={1} fill="var(--concrete-light)" />
          </g>,
        );
        break;
      case "park":
        push(
          <g key={k}>
            <circle cx={cx} cy={base - 16} r={7} fill={accent} opacity={0.3} />
            <circle cx={cx - 4} cy={base - 12} r={5} fill={accent} opacity={0.25} />
            <rect x={cx - 1} y={base - 10} width={2} height={10} fill="var(--concrete-light)" />
            <rect x={cx - 12} y={base - 2} width={24} height={2} rx={1} fill={accent} opacity={0.4} />
          </g>,
        );
        break;
      case "gym":
        push(
          <g key={k}>
            <rect x={cx - 10} y={base - 5} width={20} height={5} rx={2} fill="var(--concrete-light)" stroke={accent} strokeWidth={0.6} />
            <line x1={cx - 8} y1={base - 14} x2={cx + 8} y2={base - 14} stroke={accent} strokeWidth={1.2} />
            <circle cx={cx - 8} cy={base - 14} r={2.5} fill={accent} opacity={0.7} />
            <circle cx={cx + 8} cy={base - 14} r={2.5} fill={accent} opacity={0.7} />
          </g>,
        );
        break;
      default:
        push(
          <g key={k}>
            <rect x={cx - 8} y={base - 12} width={16} height={12} rx={1.5} fill="var(--concrete-dark)" stroke={accent} strokeWidth={0.6} />
            <line x1={cx - 5} y1={base - 8} x2={cx + 5} y2={base - 8} stroke={accent} strokeWidth={0.6} opacity={0.6} />
          </g>,
        );
    }
  }
  return <g>{items}</g>;
}
