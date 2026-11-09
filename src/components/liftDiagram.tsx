import { LIFT_POINTS, type LiftVerdict } from '../data/safety'

const BODY = 'var(--color-shop-700)'
/** thin pressed sheet — the things that fold */
const UNDER = 'var(--color-shop-850)'
/** fabricated structure — the things that hold. Visibly heavier on purpose:
 *  telling structure from sheet metal by looking is part of the skill. */
const STRUCT = 'var(--color-shop-400)'
const EDGE = 'var(--color-shop-600)'
const GLASS = 'var(--color-shop-850)'
const TYRE = '#101215'
const RIM = 'var(--color-shop-500)'
const SAFE = 'var(--color-safe)'
const AMBER = 'var(--color-amber-caution)'
const DANGER = 'var(--color-danger)'
const DIM = 'var(--color-shop-500)'

const VERDICT_COLOUR: Record<LiftVerdict, string> = {
  rated: SAFE,
  jack: AMBER,
  never: DANGER,
}

export type DiagramMode = 'explore' | 'drill'

/**
 * Side view of a unibody car with the points people actually put jacks and
 * stands on, right ones and wrong ones together.
 *
 * It is schematic. The underbody is drawn as a readable band rather than to
 * scale, because the thing being taught is which structure takes load and
 * which does not — and that does not survive being drawn at true proportions
 * on a 760-unit canvas. The real lift points for any given car are in its
 * handbook, and the page says so.
 */
export function LiftDiagram({
  mode,
  selected,
  revealed,
  focus,
  onPick,
}: {
  mode: DiagramMode
  selected: string[]
  revealed: boolean
  focus: string | null
  onPick: (id: string) => void
}) {
  return (
    <svg viewBox="0 0 760 352" className="w-full" role="img" aria-label="Vehicle lifting and support points">
      {/* ground */}
      <line x1={20} y1={318} x2={740} y2={318} stroke={EDGE} strokeWidth={2} />
      {Array.from({ length: 36 }, (_, i) => (
        <line key={i} x1={20 + i * 20} y1={318} x2={10 + i * 20} y2={330} stroke={EDGE} strokeWidth={1} opacity={0.5} />
      ))}

      {/* underbody band, drawn first so the body sits on it */}
      <rect x={58} y={232} width={648} height={16} fill={UNDER} />
      {/* engine oil pan */}
      <rect x={104} y={238} width={92} height={32} rx={3} fill={UNDER} stroke={EDGE} strokeWidth={1} />
      {/* front subframe */}
      <rect x={200} y={236} width={116} height={28} rx={3} fill={STRUCT} />
      {/* sill / rocker, reinforced only where it is marked */}
      <rect x={300} y={232} width={220} height={14} fill={STRUCT} />
      {/* floor pan — deliberately drawn thin */}
      <rect x={300} y={248} width={220} height={7} fill={UNDER} stroke={EDGE} strokeWidth={0.6} />
      {/* rear beam */}
      <rect x={520} y={238} width={100} height={26} rx={3} fill={STRUCT} />
      {/* spare well */}
      <path d="M 618 236 L 700 236 L 694 262 L 624 262 Z" fill={UNDER} stroke={EDGE} strokeWidth={1} />
      {/* lower control arm */}
      <path d="M 196 278 L 300 286 L 300 298 L 196 292 Z" fill={STRUCT} />

      {/* body shell */}
      <path
        d="M 58 232 L 58 212 C 62 198 86 192 112 188 L 248 180 L 316 124 L 452 120 L 524 176 L 672 182 C 698 186 704 198 706 212 L 706 232 Z"
        fill={BODY}
        stroke={EDGE}
        strokeWidth={1.5}
      />
      <polygon points="332,134 384,132 384,176 288,178" fill={GLASS} />
      <polygon points="396,132 446,130 494,176 396,176" fill={GLASS} />
      {/* bumper beam behind the front valance — strong, and designed to crumple */}
      <rect x={58} y={214} width={26} height={18} rx={2} fill={EDGE} />

      {/* No labels on the structures themselves: every clear space down here is
          already taken by a point marker or a wheel, and the numbered list
          beside the diagram names all ten without crowding the drawing. */}

      {/* wheels, over everything structural */}
      {[
        [196, 272],
        [604, 272],
      ].map(([cx, cy]) => (
        <g key={cx}>
          <circle cx={cx} cy={cy} r={46} fill={TYRE} />
          <circle cx={cx} cy={cy} r={26} fill={RIM} />
          <circle cx={cx} cy={cy} r={7} fill={TYRE} />
        </g>
      ))}

      {/* Candidate points.
       *
       * Once the drill is checked these go back to being coloured by what the
       * point actually is, not by whether the learner got it right. Scoring
       * colour would paint an untouched bumper beam green for "correctly left
       * alone", and on a safety diagram green reads as "safe to use". What the
       * learner chose is shown as a ring instead. */}
      {LIFT_POINTS.map((p, i) => {
        const picked = selected.includes(p.id)
        const truth = VERDICT_COLOUR[p.verdict]
        const scored = mode === 'explore' || revealed

        const fill = scored ? truth : picked ? AMBER : 'var(--color-shop-900)'
        const stroke = scored ? truth : picked ? AMBER : 'var(--color-shop-400)'
        const highlighted = focus === p.id || (mode === 'drill' && !revealed && picked)

        return (
          <g
            key={p.id}
            onClick={() => onPick(p.id)}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label={p.label}
          >
            {highlighted && <circle cx={p.x} cy={p.y} r={19} fill={stroke} opacity={0.22} />}
            {revealed && picked && (
              <circle
                cx={p.x}
                cy={p.y}
                r={19}
                fill="none"
                stroke="var(--color-shop-100)"
                strokeWidth={2}
                strokeDasharray="3 3"
              />
            )}
            <circle cx={p.x} cy={p.y} r={13} fill={fill} stroke={stroke} strokeWidth={2} fillOpacity={0.85} />
            <text
              x={p.x}
              y={p.y + 4.5}
              textAnchor="middle"
              fontSize={12}
              fontFamily="var(--font-mono)"
              fontWeight="bold"
              fill="var(--color-shop-950)"
            >
              {i + 1}
            </text>
          </g>
        )
      })}

      <text x={20} y={346} fontSize={11.5} fontFamily="var(--font-mono)" fill={DIM}>
        schematic — the lift points for any particular car are in its handbook
      </text>
    </svg>
  )
}
