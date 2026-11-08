import type { Grade } from '../data/fasteners'

const SAFE = 'var(--color-safe)'
const AMBER = 'var(--color-amber-caution)'
const DANGER = 'var(--color-danger)'
const TORQUE = 'var(--color-torque)'
const LINE = 'var(--color-shop-600)'
const DIM = 'var(--color-shop-500)'
const TEXT = 'var(--color-shop-200)'

/* ======================================================= clamp load gauge */

/**
 * Clamp load against the two numbers that matter: the load the bolt is
 * guaranteed to survive without taking a permanent set, and the load at which
 * it starts to. Torque specs normally aim at roughly 75% of proof, which
 * leaves room for exactly the friction scatter this gauge is here to show.
 */
export function ClampLoadGauge({
  load,
  proof,
  yieldLoad,
}: {
  load: number
  proof: number
  yieldLoad: number
}) {
  const max = Math.max(yieldLoad * 1.22, load * 1.06)
  const X0 = 46
  const X1 = 714
  const W = X1 - X0
  const at = (v: number) => X0 + (Math.min(v, max) / max) * W

  const pctProof = (load / proof) * 100
  const colour = load >= yieldLoad ? DANGER : load >= proof ? AMBER : SAFE

  return (
    <svg viewBox="0 0 760 128" className="w-full" role="img" aria-label={`Clamp load ${load.toFixed(1)} kilonewtons`}>
      {/* track */}
      <rect x={X0} y={52} width={W} height={34} rx={5} fill="var(--color-shop-800)" />
      {/* zones behind the bar */}
      <rect x={at(proof)} y={52} width={at(yieldLoad) - at(proof)} height={34} fill={AMBER} opacity={0.1} />
      <rect x={at(yieldLoad)} y={52} width={X1 - at(yieldLoad)} height={34} fill={DANGER} opacity={0.12} />

      {/* achieved load */}
      <rect x={X0} y={52} width={Math.max(2, at(load) - X0)} height={34} rx={5} fill={colour} opacity={0.85} />

      {/* limits */}
      {[
        { v: proof, label: 'proof', c: AMBER },
        { v: yieldLoad, label: 'yield', c: DANGER },
      ].map((m) => (
        <g key={m.label}>
          <line x1={at(m.v)} y1={42} x2={at(m.v)} y2={96} stroke={m.c} strokeWidth={2} strokeDasharray="4 3" />
          <text x={at(m.v)} y={34} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill={m.c}>
            {m.label} {m.v.toFixed(0)} kN
          </text>
        </g>
      ))}

      {/* readout */}
      <text x={X0} y={116} fontSize={15} fontFamily="var(--font-mono)" fill={colour} fontWeight="bold">
        {load.toFixed(1)} kN
      </text>
      <text x={X0 + 84} y={116} fontSize={13} fontFamily="var(--font-mono)" fill={DIM}>
        {pctProof.toFixed(0)}% of proof load
        {load >= yieldLoad ? ' — past yield, the bolt is taking a permanent set' : ''}
      </text>
    </svg>
  )
}

/* ====================================================== torque–angle curve */

const PX0 = 76
const PX1 = 722
const PY0 = 48
const PY1 = 262

/** Bolt tension as a fraction of its maximum, against angle of turn past snug. */
function tensionAt(angle: number) {
  const KNEE = 150
  if (angle <= KNEE) return (angle / KNEE) * 0.72
  return 0.72 + 0.16 * (1 - Math.exp(-(angle - KNEE) / 90))
}

const ax = (a: number) => PX0 + (a / 360) * (PX1 - PX0)
const ay = (t: number) => PY1 - t * (PY1 - PY0)

/**
 * Why angle tightening exists, in one picture.
 *
 * Tension against angle of turn is a property of the bolt and the joint, so
 * there is only one curve. Friction decides *where on it* you are when the
 * wrench clicks, and that is the whole problem: three joints that reach the
 * same torque at three different angles end up at three very different
 * tensions. Turn each of them a further 90° and they land within a few per
 * cent of each other on the plateau.
 */
export function TorqueAngleCurve() {
  const pts: string[] = []
  for (let a = 0; a <= 360; a += 4) pts.push(`${ax(a).toFixed(1)},${ay(tensionAt(a)).toFixed(1)}`)

  /** where three different friction conditions reach the same wrench reading */
  const snug = [95, 125, 150]
  const plus90 = snug.map((a) => a + 90)

  const tSnug = snug.map(tensionAt)
  const tPlus = plus90.map(tensionAt)
  /** the spread of tensions those points represent, drawn on the axis */
  const bracket = (vals: number[], x: number, colour: string) => {
    const hi = ay(Math.max(...vals))
    const lo = ay(Math.min(...vals))
    return (
      <g>
        <line x1={x} y1={hi} x2={x} y2={lo} stroke={colour} strokeWidth={3} />
        <line x1={x - 6} y1={hi} x2={x + 6} y2={hi} stroke={colour} strokeWidth={2} />
        <line x1={x - 6} y1={lo} x2={x + 6} y2={lo} stroke={colour} strokeWidth={2} />
      </g>
    )
  }

  return (
    <svg viewBox="0 0 760 346" className="w-full" role="img" aria-label="Bolt tension against angle of turn">
      {/* plot frame */}
      <line x1={PX0} y1={PY0 - 8} x2={PX0} y2={PY1} stroke={LINE} strokeWidth={1.4} />
      <line x1={PX0} y1={PY1} x2={PX1} y2={PY1} stroke={LINE} strokeWidth={1.4} />

      {/* elastic / plastic shading */}
      <rect x={PX0} y={PY0} width={ax(150) - PX0} height={PY1 - PY0} fill={TORQUE} opacity={0.05} />
      <rect x={ax(150)} y={PY0} width={PX1 - ax(150)} height={PY1 - PY0} fill={AMBER} opacity={0.05} />
      <text x={(PX0 + ax(150)) / 2} y={PY0 + 14} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill={TORQUE}>
        elastic
      </text>
      <text x={(ax(150) + PX1) / 2} y={PY0 + 14} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill={AMBER}>
        plastic — the bolt is yielding
      </text>

      {/* the curve */}
      <polyline points={pts.join(' ')} fill="none" stroke={TEXT} strokeWidth={2.6} />
      <line x1={ax(150)} y1={PY0} x2={ax(150)} y2={PY1} stroke={AMBER} strokeWidth={1.4} strokeDasharray="4 4" />
      <text x={ax(150) + 6} y={PY1 - 6} fontSize={11} fontFamily="var(--font-mono)" fill={AMBER}>
        yield knee
      </text>

      {/* where three friction conditions land at the same wrench reading */}
      {snug.map((a, i) => (
        <g key={`s${a}`}>
          <circle cx={ax(a)} cy={ay(tSnug[i])} r={5} fill={DANGER} />
          <line x1={ax(a)} y1={ay(tSnug[i])} x2={PX0} y2={ay(tSnug[i])} stroke={DANGER} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
        </g>
      ))}
      {bracket(tSnug, PX0 - 10, DANGER)}

      {/* and where the same three land after a further 90° */}
      {plus90.map((a, i) => (
        <g key={`p${a}`}>
          <circle cx={ax(a)} cy={ay(tPlus[i])} r={5} fill={SAFE} />
          <line x1={ax(a)} y1={ay(tPlus[i])} x2={PX1} y2={ay(tPlus[i])} stroke={SAFE} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
        </g>
      ))}
      {bracket(tPlus, PX1 + 8, SAFE)}

      {/* axes */}
      <text x={(PX0 + PX1) / 2} y={PY1 + 22} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill={DIM}>
        angle of turn past snug →
      </text>
      <text
        x={18}
        y={(PY0 + PY1) / 2}
        textAnchor="middle"
        fontSize={12}
        fontFamily="var(--font-mono)"
        fill={DIM}
        transform={`rotate(-90 18 ${(PY0 + PY1) / 2})`}
      >
        bolt tension →
      </text>

      {/* legend — stacked, because the two labels will not sit side by side */}
      <g>
        <circle cx={PX0 + 10} cy={306} r={5} fill={DANGER} />
        <text x={PX0 + 22} y={310} fontSize={12.5} fill={DIM}>
          three joints at the same wrench reading, with different thread friction
        </text>
        <circle cx={PX0 + 10} cy={328} r={5} fill={SAFE} />
        <text x={PX0 + 22} y={332} fontSize={12.5} fill={DIM}>
          the same three joints, each turned a further 90°
        </text>
      </g>
    </svg>
  )
}

/* ============================================================== bolt head */

/** Hex head with its grade marking, drawn the way you would read it in a tray. */
export function BoltHead({ grade, size = 92 }: { grade: Grade; size?: number }) {
  const r = 46
  const c = 56
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((30 + i * 60) * Math.PI) / 180
    return `${(c + Math.cos(a) * r).toFixed(1)},${(c + Math.sin(a) * r).toFixed(1)}`
  }).join(' ')

  return (
    <svg viewBox="0 0 112 112" width={size} height={size} role="img" aria-label={`${grade.label} head marking`}>
      <polygon points={pts} fill="var(--color-shop-600)" stroke="var(--color-shop-500)" strokeWidth={1.5} />
      <circle cx={c} cy={c} r={r * 0.78} fill="none" stroke="var(--color-shop-500)" strokeWidth={1} opacity={0.5} />
      {grade.system === 'metric' ? (
        <text
          x={c}
          y={c + 7}
          textAnchor="middle"
          fontSize={21}
          fontFamily="var(--font-mono)"
          fontWeight="bold"
          fill="var(--color-shop-200)"
        >
          {grade.label}
        </text>
      ) : (
        Array.from({ length: grade.id === 'sae5' ? 3 : 6 }, (_, i) => {
          const n = grade.id === 'sae5' ? 3 : 6
          const a = ((i * 360) / n / 180) * Math.PI
          return (
            <line
              key={i}
              x1={c + Math.cos(a) * 14}
              y1={c + Math.sin(a) * 14}
              x2={c + Math.cos(a) * 34}
              y2={c + Math.sin(a) * 34}
              stroke="var(--color-shop-200)"
              strokeWidth={3.4}
              strokeLinecap="round"
            />
          )
        })
      )}
    </svg>
  )
}
