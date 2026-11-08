/**
 * Measuring instruments, drawn as SVG and driven by a value in millimetres.
 *
 * These are reading surfaces, not scale models. The sleeve and thimble of the
 * micrometer are drawn to scale against each other, because that is the whole
 * point — the reading has to come out of the geometry rather than out of a
 * label. The frame around them is schematic, since a 25 mm gap at the scale
 * the barrel needs would be wider than the screen.
 */

const STEEL = 'var(--color-shop-600)'
const STEEL_DARK = 'var(--color-shop-700)'
const FACE = 'var(--color-shop-200)'
const INK = 'var(--color-shop-950)'
const ACCENT = 'var(--color-amber-caution)'
const TORQUE = 'var(--color-torque)'

/* ============================================================ micrometer */

const MIC_PPM = 14 // px per mm along the sleeve
const MIC_X0 = 150 // sleeve zero
const MIC_DY = 128 // datum line
const MIC_TP = 8 // px between thimble graduations

/** Outside micrometer, 0–25 mm, reading to 0.01 mm. */
export function Micrometer({ value }: { value: number }) {
  const hundredths = Math.round(value * 100)
  const tx = MIC_X0 + value * MIC_PPM
  const datum = ((hundredths % 50) + 50) % 50

  const mmTicks = []
  for (let mm = 0; mm <= 25; mm++) {
    const x = MIC_X0 + mm * MIC_PPM
    const major = mm % 5 === 0
    mmTicks.push(
      <line key={`u${mm}`} x1={x} y1={MIC_DY} x2={x} y2={MIC_DY - (major ? 24 : 16)} stroke={INK} strokeWidth={major ? 2.4 : 1.4} />,
    )
    if (major) {
      mmTicks.push(
        <text key={`n${mm}`} x={x} y={MIC_DY - 30} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill={INK}>
          {mm}
        </text>,
      )
    }
    if (mm < 25) {
      const hx = x + MIC_PPM / 2
      mmTicks.push(<line key={`h${mm}`} x1={hx} y1={MIC_DY} x2={hx} y2={MIC_DY + 16} stroke={INK} strokeWidth={1.4} />)
    }
  }

  const thimbleTicks = []
  for (let n = -8; n <= 8; n++) {
    const num = (((datum + n) % 50) + 50) % 50
    const y = MIC_DY + n * MIC_TP
    const major = num % 5 === 0
    thimbleTicks.push(
      <line key={`t${n}`} x1={tx + 8} y1={y} x2={tx + (major ? 44 : 30)} y2={y} stroke={INK} strokeWidth={major ? 2.2 : 1.3} />,
    )
    if (major) {
      thimbleTicks.push(
        <text key={`tn${n}`} x={tx + 52} y={y + 4.8} fontSize={14} fontFamily="var(--font-mono)" fill={INK}>
          {num}
        </text>,
      )
    }
  }

  return (
    <svg viewBox="0 0 760 252" className="w-full" role="img" aria-label={`Micrometer reading ${value.toFixed(2)} millimetres`}>
      {/* schematic frame and anvil, not to scale */}
      <path
        d="M 150 94 L 96 94 Q 44 94 44 128 Q 44 162 96 162 L 150 162"
        fill="none"
        stroke={STEEL_DARK}
        strokeWidth={22}
        strokeLinecap="round"
      />
      <rect x={92} y={114} width={14} height={28} rx={2} fill={FACE} />
      <rect x={118} y={118} width={34} height={20} rx={2} fill={FACE} />

      {/* sleeve */}
      <rect x={MIC_X0 - 20} y={MIC_DY - 46} width={25 * MIC_PPM + 46} height={72} rx={6} fill={FACE} />
      <line x1={MIC_X0 - 14} y1={MIC_DY} x2={MIC_X0 + 25 * MIC_PPM + 20} y2={MIC_DY} stroke={INK} strokeWidth={2} />
      {mmTicks}

      {/* thimble, drawn over the sleeve so it hides the graduations it covers */}
      <g>
        <rect x={tx} y={MIC_DY - 72} width={198} height={144} rx={10} fill={STEEL} />
        <rect x={tx} y={MIC_DY - 72} width={92} height={144} fill={FACE} />
        <rect x={tx + 90} y={MIC_DY - 72} width={6} height={144} fill={STEEL_DARK} opacity={0.45} />
        {thimbleTicks}
        {/* ratchet stop */}
        <rect x={tx + 198} y={MIC_DY - 28} width={30} height={56} rx={8} fill={STEEL_DARK} />
      </g>

      {/* the datum line continued across the thimble bevel */}
      <line x1={tx} y1={MIC_DY} x2={tx + 92} y2={MIC_DY} stroke={ACCENT} strokeWidth={2.4} />

      <text x={MIC_X0 - 20} y={240} fontSize={12} fontFamily="var(--font-mono)" fill="var(--color-shop-500)">
        sleeve: whole mm above the line, half mm below · thimble: hundredths
      </text>
    </svg>
  )
}

/* ========================================================= vernier caliper */

const CAL_PPM = 9.6
const CAL_X0 = 44
const CAL_DY = 100
const CAL_SPAN = 70 // mm of main scale drawn
/** 20 vernier divisions spanning 39 mm, so each is 1.95 mm and the scale reads to 0.05 mm. */
const VERN_DIV = 20
const VERN_STEP = 1.95

/**
 * Vernier caliper reading to 0.05 mm.
 *
 * `hint` marks the division that coincides with a main-scale line. Finding it
 * is the actual skill, so the hint belongs in explore mode and must be off in
 * the drill — otherwise the instrument answers its own question.
 */
export function VernierCaliper({ value, hint = false }: { value: number; hint?: boolean }) {
  const jawX = CAL_X0 + value * CAL_PPM
  /**
   * The vernier division that lines up with a main-scale line. Rounding to
   * hundredths first keeps 23.45 from arriving as 23.449999 and reading a
   * division short.
   */
  const coincide = (Math.round(value * 100) % 100) / 5

  const main = []
  for (let mm = 0; mm <= CAL_SPAN; mm++) {
    const x = CAL_X0 + mm * CAL_PPM
    main.push(
      <line key={`m${mm}`} x1={x} y1={CAL_DY} x2={x} y2={CAL_DY - (mm % 10 === 0 ? 22 : mm % 5 === 0 ? 16 : 10)} stroke={INK} strokeWidth={mm % 10 === 0 ? 2.2 : 1.2} />,
    )
    if (mm % 10 === 0) {
      main.push(
        <text key={`ml${mm}`} x={x} y={CAL_DY - 28} textAnchor="middle" fontSize={13} fontFamily="var(--font-mono)" fill={INK}>
          {mm / 10}
        </text>,
      )
    }
  }

  const vern = []
  for (let i = 0; i <= VERN_DIV; i++) {
    const x = jawX + i * VERN_STEP * CAL_PPM
    const major = i % 5 === 0
    const hit = hint && i === coincide
    vern.push(
      <line
        key={`v${i}`}
        x1={x}
        y1={CAL_DY}
        x2={x}
        y2={CAL_DY + (major ? 22 : 14)}
        stroke={hit ? ACCENT : INK}
        strokeWidth={hit ? 3 : major ? 2.2 : 1.2}
      />,
    )
    if (major) {
      vern.push(
        <text key={`vl${i}`} x={x} y={CAL_DY + 38} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill={hit ? ACCENT : INK}>
          {i * 5}
        </text>,
      )
    }
  }

  return (
    <svg viewBox="0 0 760 244" className="w-full" role="img" aria-label={`Caliper reading ${value.toFixed(2)} millimetres`}>
      {/* beam */}
      <rect x={CAL_X0 - 36} y={CAL_DY - 46} width={CAL_SPAN * CAL_PPM + 90} height={46} rx={4} fill={FACE} />
      <line x1={CAL_X0 - 30} y1={CAL_DY} x2={CAL_X0 + CAL_SPAN * CAL_PPM + 48} y2={CAL_DY} stroke={INK} strokeWidth={1.6} />
      {main}

      {/* vernier plate — nothing may cover this, the zero is the first thing read */}
      <rect x={jawX - 12} y={CAL_DY} width={VERN_DIV * VERN_STEP * CAL_PPM + 34} height={48} rx={4} fill={FACE} />
      {vern}

      {/* jaws hang below the scales, the way they do on the real thing */}
      <rect x={CAL_X0 - 26} y={148} width={26} height={62} rx={2} fill={STEEL} />
      <line x1={CAL_X0} y1={148} x2={CAL_X0} y2={210} stroke={FACE} strokeWidth={2.5} />
      <rect x={jawX} y={148} width={26} height={62} rx={2} fill={STEEL} />
      <line x1={jawX} y1={148} x2={jawX} y2={210} stroke={FACE} strokeWidth={2.5} />
      {/* the stems that tie each jaw to its scale */}
      <rect x={CAL_X0 - 20} y={CAL_DY - 46} width={14} height={102} fill={STEEL} opacity={0.65} />
      <rect x={jawX + 4} y={CAL_DY + 44} width={14} height={8} fill={STEEL} opacity={0.65} />

      {/* what is between the jaws */}
      {value > 0.5 && (
        <>
          <rect x={CAL_X0} y={164} width={value * CAL_PPM} height={28} fill={TORQUE} opacity={0.2} />
          <text
            x={CAL_X0 + (value * CAL_PPM) / 2}
            y={230}
            textAnchor="middle"
            fontSize={12}
            fontFamily="var(--font-mono)"
            fill="var(--color-shop-500)"
          >
            jaw opening
          </text>
        </>
      )}
    </svg>
  )
}

/* ========================================================= dial indicator */

/** Dial test indicator: one revolution is 1 mm, each division 0.01 mm. */
export function DialIndicator({ value }: { value: number }) {
  const hundredths = Math.round(value * 100)
  const revs = Math.floor(hundredths / 100)
  const needle = hundredths % 100
  const angle = -90 + needle * 3.6
  const revAngle = -90 + (revs % 10) * 36

  const cx = 190
  const cy = 190
  const r = 150

  const ticks = []
  for (let i = 0; i < 100; i++) {
    const a = ((-90 + i * 3.6) * Math.PI) / 180
    const major = i % 10 === 0
    const mid = i % 5 === 0
    const len = major ? 20 : mid ? 13 : 8
    ticks.push(
      <line
        key={i}
        x1={cx + Math.cos(a) * (r - 8)}
        y1={cy + Math.sin(a) * (r - 8)}
        x2={cx + Math.cos(a) * (r - 8 - len)}
        y2={cy + Math.sin(a) * (r - 8 - len)}
        stroke={INK}
        strokeWidth={major ? 2.6 : mid ? 1.6 : 1}
      />,
    )
    if (major) {
      ticks.push(
        <text
          key={`l${i}`}
          x={cx + Math.cos(a) * (r - 44)}
          y={cy + Math.sin(a) * (r - 44) + 5}
          textAnchor="middle"
          fontSize={17}
          fontFamily="var(--font-mono)"
          fill={INK}
        >
          {i}
        </text>,
      )
    }
  }

  return (
    <svg viewBox="0 0 380 420" className="mx-auto w-full max-w-[410px]" role="img" aria-label={`Dial indicator reading ${value.toFixed(2)} millimetres`}>
      {/* stem and contact point */}
      <rect x={cx - 11} y={cy + r - 14} width={22} height={74} rx={3} fill={STEEL_DARK} />
      <rect x={cx - 7} y={cy + r + 56} width={14} height={34} rx={3} fill={STEEL} />
      <circle cx={cx} cy={cy + r + 94} r={9} fill={FACE} />

      {/* bezel and face */}
      <circle cx={cx} cy={cy} r={r + 12} fill={STEEL_DARK} />
      <circle cx={cx} cy={cy} r={r} fill={FACE} />
      {ticks}

      {/* revolution counter — clear of the 0 at the top of the main dial */}
      <circle cx={cx} cy={cy - 58} r={30} fill="var(--color-shop-300)" />
      <circle cx={cx} cy={cy - 58} r={30} fill="none" stroke={INK} strokeWidth={1.2} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = ((-90 + i * 36) * Math.PI) / 180
        return (
          <text
            key={i}
            x={cx + Math.cos(a) * 21}
            y={cy - 58 + Math.sin(a) * 21 + 3.5}
            textAnchor="middle"
            fontSize={10}
            fontFamily="var(--font-mono)"
            fill={INK}
          >
            {i}
          </text>
        )
      })}
      <line
        x1={cx}
        y1={cy - 58}
        x2={cx + Math.cos((revAngle * Math.PI) / 180) * 19}
        y2={cy - 58 + Math.sin((revAngle * Math.PI) / 180) * 19}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <text x={cx} y={cy - 18} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-shop-500)">
        mm
      </text>

      {/* needle */}
      <line
        x1={cx - Math.cos((angle * Math.PI) / 180) * 26}
        y1={cy - Math.sin((angle * Math.PI) / 180) * 26}
        x2={cx + Math.cos((angle * Math.PI) / 180) * (r - 30)}
        y2={cy + Math.sin((angle * Math.PI) / 180) * (r - 30)}
        stroke="var(--color-danger)"
        strokeWidth={3.4}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={11} fill={STEEL_DARK} />
      <circle cx={cx} cy={cy} r={4} fill={FACE} />
    </svg>
  )
}
