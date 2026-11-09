import { ELEMENTS, EMF, TEST_POINTS } from '../data/circuits'
import type { Solution } from '../lib/circuit'

const LIVE = 'var(--color-amber-caution)'
const DEAD = 'var(--color-shop-600)'
const INK = 'var(--color-shop-300)'
const DIM = 'var(--color-shop-500)'
const RED = 'var(--color-danger)'
const BLACK = 'var(--color-shop-100)'
const FAULT = 'var(--color-danger)'

/** A node is "live" if there is meaningful voltage on it. */
const live = (v: number) => v > 1

/**
 * The circuit as a single loop, drawn the way a wiring diagram draws it and
 * coloured the way a meter sees it: amber where there is voltage, grey where
 * there is not. With an open anywhere, the colour change lands exactly on the
 * fault, which is the thing the page is trying to teach.
 */
export function CircuitDiagram({
  solution,
  redNode,
  blackNode,
  faultElementId,
  onPick,
}: {
  solution: Solution
  redNode: number
  blackNode: number
  /** set once the fault is revealed; null hides it */
  faultElementId: string | null
  onPick: (node: number) => void
}) {
  const n = solution.nodes
  const idx = (id: string) => ELEMENTS.findIndex((e) => e.id === id)
  const colourAfter = (elementId: string) => (live(n[idx(elementId)]) ? LIVE : DEAD)
  const faulty = (id: string) => faultElementId === id

  const openSwitch = !Number.isFinite(solution.resistances[idx('switch')])
  const openFuse = !Number.isFinite(solution.resistances[idx('fuse')])

  return (
    <svg viewBox="0 0 700 300" className="w-full" role="img" aria-label="Lamp circuit schematic">
      {/* ------------------------------------------------------- top rail */}
      {/* B+ feed */}
      <line x1={100} y1={80} x2={190} y2={80} stroke={colourAfter('feed')} strokeWidth={3} />
      {/* fuse */}
      <g>
        <rect
          x={190}
          y={66}
          width={62}
          height={28}
          rx={5}
          fill="var(--color-shop-900)"
          stroke={faulty('fuse') ? FAULT : INK}
          strokeWidth={faulty('fuse') ? 2.5 : 1.5}
        />
        {openFuse ? (
          <>
            <line x1={196} y1={80} x2={214} y2={80} stroke={INK} strokeWidth={2} />
            <line x1={228} y1={80} x2={246} y2={80} stroke={INK} strokeWidth={2} />
            <line x1={214} y1={72} x2={228} y2={88} stroke={FAULT} strokeWidth={2.5} />
          </>
        ) : (
          <path d="M 196 80 L 206 80 L 212 72 L 224 88 L 230 80 L 246 80" fill="none" stroke={INK} strokeWidth={2} />
        )}
      </g>
      {/* supply wire */}
      <line
        x1={252}
        y1={80}
        x2={342}
        y2={80}
        stroke={colourAfter('supply')}
        strokeWidth={faulty('supply') ? 5 : 3}
        strokeDasharray={faulty('supply') ? '6 4' : undefined}
      />
      {faulty('supply') && <circle cx={297} cy={80} r={9} fill="none" stroke={FAULT} strokeWidth={2.5} />}
      {/* switch */}
      <g>
        <circle cx={342} cy={80} r={4} fill={INK} />
        <circle cx={410} cy={80} r={4} fill={INK} />
        <line
          x1={342}
          y1={80}
          x2={openSwitch ? 402 : 410}
          y2={openSwitch ? 58 : 80}
          stroke={faulty('switch') ? FAULT : INK}
          strokeWidth={2.6}
        />
      </g>
      {/* wire to the lamp */}
      <line x1={410} y1={80} x2={560} y2={80} stroke={colourAfter('lampFeed')} strokeWidth={3} />

      {/* ----------------------------------------------------------- lamp */}
      <line x1={560} y1={80} x2={560} y2={107} stroke={colourAfter('lampFeed')} strokeWidth={3} />
      <circle
        cx={560}
        cy={133}
        r={26}
        fill="var(--color-shop-900)"
        stroke={live(n[5]) && solution.current > 0.2 ? LIVE : INK}
        strokeWidth={2}
      />
      <line x1={542} y1={115} x2={578} y2={151} stroke={INK} strokeWidth={1.8} />
      <line x1={578} y1={115} x2={542} y2={151} stroke={INK} strokeWidth={1.8} />
      {solution.current > 0.2 && (
        <circle cx={560} cy={133} r={34} fill={LIVE} opacity={Math.min(0.3, solution.current / 24)} />
      )}
      <line x1={560} y1={159} x2={560} y2={232} stroke={live(n[6]) ? LIVE : DEAD} strokeWidth={3} />

      {/* ---------------------------------------------------- bottom rail */}
      <line
        x1={560}
        y1={232}
        x2={310}
        y2={232}
        stroke={live(n[7]) ? LIVE : DEAD}
        strokeWidth={faulty('groundWire') ? 5 : 3}
      />
      {/* ground stud */}
      <g>
        <rect
          x={300}
          y={224}
          width={20}
          height={16}
          rx={2}
          fill="var(--color-shop-900)"
          stroke={faulty('groundStud') ? FAULT : INK}
          strokeWidth={faulty('groundStud') ? 2.5 : 1.5}
        />
        {faulty('groundStud') && <circle cx={310} cy={232} r={14} fill="none" stroke={FAULT} strokeWidth={2.5} />}
      </g>
      <line x1={300} y1={232} x2={100} y2={232} stroke={live(n[8]) ? LIVE : DEAD} strokeWidth={3} />

      {/* -------------------------------------------------------- battery */}
      <line x1={100} y1={80} x2={100} y2={128} stroke={colourAfter('feed')} strokeWidth={3} />
      <line x1={86} y1={128} x2={114} y2={128} stroke={INK} strokeWidth={3} />
      <line x1={93} y1={140} x2={107} y2={140} stroke={INK} strokeWidth={3} />
      <line x1={86} y1={152} x2={114} y2={152} stroke={INK} strokeWidth={3} />
      <line x1={93} y1={164} x2={107} y2={164} stroke={INK} strokeWidth={3} />
      <line x1={100} y1={164} x2={100} y2={232} stroke={DEAD} strokeWidth={3} />
      <text x={72} y={112} fontSize={12} fontFamily="var(--font-mono)" fill={DIM}>
        {EMF.toFixed(1)} V
      </text>

      {/* chassis symbol */}
      <line x1={100} y1={232} x2={100} y2={252} stroke={DEAD} strokeWidth={3} />
      <line x1={84} y1={252} x2={116} y2={252} stroke={DIM} strokeWidth={3} />
      <line x1={90} y1={259} x2={110} y2={259} stroke={DIM} strokeWidth={2.4} />
      <line x1={95} y1={266} x2={105} y2={266} stroke={DIM} strokeWidth={2} />

      {/* ---------------------------------------------------- test points */}
      {TEST_POINTS.map((p) => {
        const isRed = p.node === redNode
        const isBlack = p.node === blackNode
        return (
          <g key={p.id} onClick={() => onPick(p.node)} style={{ cursor: 'pointer' }} role="button" aria-label={p.label}>
            {(isRed || isBlack) && (
              <circle cx={p.x} cy={p.y} r={14} fill={isRed ? RED : BLACK} opacity={0.22} />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={7}
              fill={isRed ? RED : isBlack ? BLACK : 'var(--color-shop-950)'}
              stroke={isRed ? RED : isBlack ? BLACK : INK}
              strokeWidth={2}
            />
            <text
              x={p.x}
              y={p.y + (p.dy ?? -16)}
              textAnchor={p.anchor ?? 'middle'}
              fontSize={11}
              fontFamily="var(--font-mono)"
              fill={isRed ? RED : isBlack ? BLACK : DIM}
            >
              {p.label}
            </text>
          </g>
        )
      })}

      <text x={14} y={290} fontSize={11} fontFamily="var(--font-mono)" fill={DIM}>
        amber = voltage present · grey = nothing there · click a point to move the probe
      </text>
    </svg>
  )
}
