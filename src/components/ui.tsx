import type { ReactNode } from 'react'
import { DIFFICULTY, HAZARDS, type Hazard, type TorqueSpec } from '../lib/types'
import { useStore } from '../lib/store'

/* ------------------------------------------------------------------ atoms */

export function Chip({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode
  tone?: 'neutral' | 'amber' | 'torque' | 'danger' | 'safe'
  className?: string
}) {
  const tones = {
    neutral: 'border-shop-600 bg-shop-800/70 text-shop-300',
    amber: 'border-amber-caution/40 bg-amber-caution/10 text-amber-caution',
    torque: 'border-torque/40 bg-torque/10 text-torque',
    danger: 'border-danger/40 bg-danger/10 text-danger',
    safe: 'border-safe/40 bg-safe/10 text-safe',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10.5px] font-medium tracking-wide uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-mono text-[11px] font-semibold tracking-[0.18em] text-amber-caution uppercase">
        {children}
      </h2>
      {sub && <p className="mt-1 text-sm text-shop-400">{sub}</p>}
    </div>
  )
}

export function Difficulty({ level }: { level: number }) {
  const d = DIFFICULTY[level]
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex gap-[2px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-3 w-[3px] rounded-full ${i <= level ? 'bg-current' : 'bg-shop-700'} ${
              i <= level ? d.color : ''
            }`}
          />
        ))}
      </span>
      <span className={`text-[11px] font-medium ${d.color}`}>{d.label}</span>
    </span>
  )
}

export function ProgressRing({ pct, size = 38 }: { pct: number; size?: number }) {
  const r = size / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#252a32" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={pct >= 100 ? '#4ade80' : '#ffb000'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        className="transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  )
}

/* ---------------------------------------------------------------- hazards */

export function HazardRow({ kind, text }: { kind: Hazard; text: string }) {
  const h = HAZARDS[kind]
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 shrink-0 text-sm" aria-hidden>
        {h.icon}
      </span>
      <span className="text-[13px] leading-relaxed text-shop-300">
        <span className="font-semibold text-shop-100">{h.label}.</span> {text}
      </span>
    </li>
  )
}

export function HazardStrip({ kinds }: { kinds: Hazard[] }) {
  if (!kinds.length) return null
  return (
    <div className="hatch flex flex-wrap items-center gap-2 rounded border border-amber-caution/30 px-3 py-2">
      <span className="font-mono text-[10px] font-bold tracking-widest text-amber-caution uppercase">
        Hazard
      </span>
      {kinds.map((k) => (
        <span key={k} className="rounded bg-shop-950/80 px-1.5 py-0.5 text-[11px] text-shop-200">
          {HAZARDS[k].icon} {HAZARDS[k].label}
        </span>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- torque */

function fmt(t: TorqueSpec, ftlb: boolean) {
  if (t.nm === 0 && t.angle) return t.angle
  if (ftlb) {
    if (t.inlb) return `${t.inlb} in-lb`
    if (t.ftlb) return `${t.ftlb} ft-lb`
    return `${Math.round(t.nm * 0.7376)} ft-lb`
  }
  return `${t.nm} N·m`
}

export function TorqueRows({ specs, compact }: { specs: TorqueSpec[]; compact?: boolean }) {
  const ftlb = useStore((s) => s.unitFtLb)
  if (!specs.length) return null
  return (
    <div className="overflow-hidden rounded border border-shop-700">
      <table className="w-full border-collapse text-left">
        <tbody>
          {specs.map((t, i) => (
            <tr key={i} className="border-b border-shop-800 last:border-0">
              <td className="px-3 py-2 align-top text-[13px] text-shop-200">
                <div className="flex flex-wrap items-center gap-1.5">
                  {t.fastener}
                  {t.tty && <Chip tone="danger">TTY · single use</Chip>}
                </div>
                {!compact && t.note && <div className="mt-0.5 text-[11.5px] text-shop-400">{t.note}</div>}
                {!compact && t.pattern && (
                  <div className="mt-0.5 text-[11.5px] text-torque/80">↻ {t.pattern}</div>
                )}
              </td>
              <td className="tnum w-28 px-3 py-2 text-right align-top font-mono text-[13px] font-semibold whitespace-nowrap text-torque">
                {fmt(t, ftlb)}
                {t.angle && t.nm > 0 && <span className="block text-[11px] text-amber-caution">then {t.angle}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function UnitToggle() {
  const ftlb = useStore((s) => s.unitFtLb)
  const setUnit = useStore((s) => s.setUnit)
  return (
    <div className="flex overflow-hidden rounded border border-shop-700 font-mono text-[10px]">
      {[
        { l: 'N·m', v: false },
        { l: 'ft-lb', v: true },
      ].map((o) => (
        <button
          key={o.l}
          onClick={() => setUnit(o.v)}
          className={`px-2 py-1 transition-colors ${
            ftlb === o.v ? 'bg-amber-caution text-black' : 'text-shop-400 hover:text-shop-100'
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------- notices */

export function SpecNotice({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded border border-amber-caution/30 bg-amber-caution/[0.06] p-3 text-[12px] leading-relaxed text-shop-300 ${className}`}
    >
      <span className="font-semibold text-amber-caution">Training reference values.</span> Every torque figure,
      clearance and discard spec in this platform is here to teach you the <em>shape</em> of the job — which
      fasteners matter, what order they go in, and what you measure. Before you put a wrench on a real vehicle,
      verify the numbers against the factory service manual for that exact year, engine and market. Specs change
      mid-model-year and we are not your service information provider.
    </div>
  )
}

export function Callout({
  kind,
  children,
}: {
  kind: 'tip' | 'mistake' | 'note'
  children: ReactNode
}) {
  const map = {
    tip: { label: 'Shop tip', cls: 'border-torque/35 bg-torque/[0.06]', text: 'text-torque' },
    mistake: { label: 'Common mistake', cls: 'border-danger/35 bg-danger/[0.06]', text: 'text-danger' },
    note: { label: 'Note', cls: 'border-shop-600 bg-shop-800/50', text: 'text-shop-300' },
  }[kind]
  return (
    <div className={`rounded border p-3 ${map.cls}`}>
      <div className={`mb-1 font-mono text-[10px] font-bold tracking-widest uppercase ${map.text}`}>
        {map.label}
      </div>
      <div className="text-[13px] leading-relaxed text-shop-200">{children}</div>
    </div>
  )
}

/** Minimal inline markdown: **bold** and *em*. */
export function RichText({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**'))
          return (
            <strong key={i} className="font-semibold text-shop-100">
              {p.slice(2, -2)}
            </strong>
          )
        if (p.startsWith('*') && p.endsWith('*'))
          return (
            <em key={i} className="text-shop-200 italic">
              {p.slice(1, -1)}
            </em>
          )
        return <span key={i}>{p}</span>
      })}
    </span>
  )
}

/** 40 → "40m", 75 → "1h 15m", 300 → "5h". */
export function fmtDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function Spinner({ label = 'Building assembly' }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-shop-500">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-shop-700 border-t-amber-caution" />
      <span className="font-mono text-[11px] tracking-widest uppercase">{label}</span>
    </div>
  )
}
