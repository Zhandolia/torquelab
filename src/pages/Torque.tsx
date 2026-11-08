import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  clampLoadKn,
  conditionById,
  CONDITIONS,
  correctedTorque,
  GRADES,
  gradeById,
  proofLoadKn,
  REUSE_RULES,
  SPECIMENS,
  TTY_POINTS,
  yieldLoadKn,
} from '../data/fasteners'
import { PROCEDURES, procById } from '../data/procedures'
import { useStore } from '../lib/store'
import { BoltHead, ClampLoadGauge, TorqueAngleCurve } from '../components/fastenerViz'
import { Callout, Chip, SectionTitle, SpecNotice } from '../components/ui'

export function Torque() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <SectionTitle sub="Torque is not the point. Clamp load is the point, and torque is a cheap, noisy way of guessing at it — which is why every one of these procedures cares how you got there, not just what the wrench read.">
        Fasteners & torque
      </SectionTitle>

      <Simulator />
      <AngleSection />
      <GradeSection />
      <ReuseSection />
      <TorqueIndex />

      <div className="mt-8">
        <SpecNotice />
      </div>
    </div>
  )
}

/* ============================================================== simulator */

function Simulator() {
  const [specId, setSpecId] = useState(SPECIMENS[0].id)
  const [condId, setCondId] = useState(CONDITIONS[0].id)
  const spec = SPECIMENS.find((s) => s.id === specId)!
  const cond = conditionById(condId)
  const [torque, setTorque] = useState(spec.specNm)

  /** keep the slider meaningful when the specimen changes */
  const onSpec = (id: string) => {
    const s = SPECIMENS.find((x) => x.id === id)!
    setSpecId(id)
    setTorque(s.specNm)
  }

  const grade = gradeById(spec.gradeId)
  const proof = proofLoadKn(spec)
  const yieldL = yieldLoadKn(spec)
  const load = clampLoadKn(torque, spec.dia, cond.k)
  /** what the published figure was written to deliver, on clean dry threads */
  const intended = clampLoadKn(spec.specNm, spec.dia, CONDITIONS[0].k)
  /** what it actually delivers with the threads in the chosen condition */
  const atSpec = clampLoadKn(spec.specNm, spec.dia, cond.k)
  const corrected = correctedTorque(spec, cond.k)
  const delta = ((atSpec - intended) / intended) * 100

  return (
    <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
          What the wrench actually buys you
        </h3>
        <span className="font-mono text-[12px] text-shop-500">T = K · D · F</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* -------------------------------------------------------- picker */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-shop-500 uppercase">
              Fastener
            </label>
            <select
              value={specId}
              onChange={(e) => onSpec(e.target.value)}
              className="w-full rounded border border-shop-700 bg-shop-900 px-2.5 py-2 text-[13px] text-shop-200 outline-none focus:border-amber-caution/60"
            >
              {SPECIMENS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.specNm} N·m
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip>{spec.thread}</Chip>
              <Chip tone="torque">{grade.label}</Chip>
              <Chip>{spec.areaMm2} mm²</Chip>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-shop-500 uppercase">
              Thread condition
            </label>
            <select
              value={condId}
              onChange={(e) => setCondId(e.target.value)}
              className="w-full rounded border border-shop-700 bg-shop-900 px-2.5 py-2 text-[13px] text-shop-200 outline-none focus:border-amber-caution/60"
            >
              {CONDITIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} — K {c.k.toFixed(2)}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[12px] leading-relaxed text-shop-400">{cond.note}</p>
          </div>

          <p className="text-[12.5px] leading-relaxed text-shop-400">{spec.job}</p>
          <Link
            to={`/procedure/${spec.procedureId}`}
            className="inline-block text-[12px] text-amber-caution hover:underline"
          >
            {procById(spec.procedureId)?.title} →
          </Link>
        </div>

        {/* --------------------------------------------------------- gauge */}
        {/* min-w-0 or the grid item grows to the 620px scroller inside it and
            takes the whole page sideways with it on a phone */}
        <div className="min-w-0">
          <div className="rounded-lg border border-shop-800 bg-shop-950 px-2 py-3 sm:px-4">
            <div className="overflow-x-auto">
              <div className="min-w-[620px]">
                <ClampLoadGauge load={load} proof={proof} yieldLoad={yieldL} />
              </div>
              <p className="mt-1 text-[11px] text-shop-600 sm:hidden">swipe the gauge sideways</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="range"
              min={0}
              max={Math.round(spec.specNm * 2)}
              step={1}
              value={torque}
              onChange={(e) => setTorque(Number(e.target.value))}
              className="min-w-[180px] flex-1"
              aria-label="applied torque"
            />
            <div className="tnum rounded border border-amber-caution/40 bg-amber-caution/10 px-3 py-1.5 font-mono text-[17px] font-bold text-amber-caution">
              {torque} <span className="text-[12px] text-amber-caution/70">N·m</span>
            </div>
            <button
              onClick={() => setTorque(spec.specNm)}
              className="rounded border border-shop-700 px-3 py-2 text-[12px] text-shop-400 transition-colors hover:bg-shop-800"
            >
              Back to spec
            </button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded border border-shop-800 bg-shop-950/50 px-3 py-2.5">
              <div className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                At the published {spec.specNm} N·m
              </div>
              <div className="tnum mt-1 font-mono text-[15px] text-shop-100">{atSpec.toFixed(1)} kN</div>
              <div className="text-[11.5px] text-shop-500">
                {condId === 'dry' ? (
                  'the clamp load the figure was written for'
                ) : (
                  <span className={delta > 0 ? 'text-danger' : 'text-amber-caution'}>
                    {delta > 0 ? '+' : ''}
                    {delta.toFixed(0)}% against clean dry threads
                  </span>
                )}
              </div>
            </div>
            <div className="rounded border border-shop-800 bg-shop-950/50 px-3 py-2.5">
              <div className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                To reach the intended clamp load
              </div>
              <div className="tnum mt-1 font-mono text-[15px] text-torque">{corrected.toFixed(0)} N·m</div>
              <div className="text-[11.5px] text-shop-500">
                {condId === 'dry' ? 'the published figure, unchanged' : 'with the threads in this condition'}
              </div>
            </div>
          </div>

          {spec.limit && (
            <div className="mt-3">
              <Callout kind="note">
                <span className="font-semibold text-amber-caution">The bolt is not the weak point here.</span>{' '}
                {spec.limit}
              </Callout>
            </div>
          )}

          <p className="mt-3 text-[12px] leading-relaxed text-shop-500">
            K is not a physical constant. It is an empirical lump standing in for every friction effect in the
            joint at once, it scatters by roughly a quarter either way even on a controlled test bench, and the
            numbers above are a teaching model rather than an engineering calculation. What survives the error
            bars is the shape: lubricate a thread, keep the same wrench reading, and you have quietly moved the
            joint a long way up this gauge.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ========================================================= angle section */

function AngleSection() {
  return (
    <div className="mt-6 rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
      <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
        Why “49 N·m then 90° then 90°” exists
      </h3>
      <div className="mt-4 grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <div className="min-w-0 rounded-lg border border-shop-800 bg-shop-950 px-2 py-3 sm:px-4">
          <div className="overflow-x-auto">
            <div className="min-w-[660px]">
              <TorqueAngleCurve />
            </div>
            <p className="mt-1 text-[11px] text-shop-600 sm:hidden">swipe the chart sideways</p>
          </div>
        </div>
        <div className="space-y-3">
          {TTY_POINTS.map((p) => (
            <div key={p.label}>
              <div className="text-[13px] font-semibold text-shop-100">{p.label}</div>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-shop-400">{p.body}</p>
            </div>
          ))}
          <Link
            to="/procedure/camry-cylinder-head"
            className="inline-block text-[12.5px] text-amber-caution hover:underline"
          >
            See it on a head bolt sequence →
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ========================================================= grade section */

function GradeSection() {
  return (
    <div className="mt-6 rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
      <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
        Reading the head
      </h3>
      <p className="mt-2 max-w-[80ch] text-[13px] leading-relaxed text-shop-300">
        The grade is stamped where you can see it with the bolt in your hand. It is the first thing to check
        before you put a hardware-store bolt into a suspension joint — the thread will fit perfectly and the bolt
        will be half the strength the joint was designed around.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GRADES.map((g) => (
          <div key={g.id} className="flex gap-3 rounded-lg border border-shop-800 bg-shop-950/40 p-3">
            <BoltHead grade={g} size={76} />
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-shop-100">{g.label}</div>
              <div className="tnum font-mono text-[11px] text-torque">
                proof {g.proofMPa} · yield {g.yieldMPa} · tensile {g.tensileMPa} MPa
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-shop-400">{g.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========================================================= reuse section */

const VERDICT = {
  never: { label: 'Single use', cls: 'border-danger/50 bg-danger/10 text-danger' },
  inspect: { label: 'Inspect', cls: 'border-amber-caution/50 bg-amber-caution/10 text-amber-caution' },
  reuse: { label: 'Reusable', cls: 'border-safe/50 bg-safe/10 text-safe' },
}

function ReuseSection() {
  return (
    <div className="mt-6 rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
      <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
        What goes back in, and what does not
      </h3>
      <div className="mt-3 divide-y divide-shop-800">
        {REUSE_RULES.map((r) => {
          const v = VERDICT[r.verdict]
          return (
            <div key={r.item} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
              <span
                className={`inline-flex h-fit shrink-0 items-center rounded border px-2 py-0.5 text-[10.5px] font-medium tracking-wide uppercase sm:w-[96px] ${v.cls}`}
              >
                {v.label}
              </span>
              <div className="min-w-0">
                <div className="text-[13px] text-shop-100">{r.item}</div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-shop-400">{r.why}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* =========================================================== torque index */

interface IndexRow {
  fastener: string
  nm: number
  ftlb?: number
  inlb?: number
  angle?: string
  tty?: boolean
  note?: string
  procId: string
  procTitle: string
}

function TorqueIndex() {
  const [q, setQ] = useState('')
  const ftlb = useStore((s) => s.unitFtLb)

  const rows = useMemo(() => {
    const out: IndexRow[] = []
    for (const p of PROCEDURES) {
      for (const t of p.torqueTable) {
        out.push({
          fastener: t.fastener,
          nm: t.nm,
          ftlb: t.ftlb,
          inlb: t.inlb,
          angle: t.angle,
          tty: t.tty,
          note: t.note,
          procId: p.id,
          procTitle: p.title,
        })
      }
    }
    return out.sort((a, b) => b.nm - a.nm)
  }, [])

  const shown = useMemo(() => {
    if (!q.trim()) return rows
    const needle = q.toLowerCase()
    return rows.filter((r) => `${r.fastener} ${r.procTitle} ${r.note ?? ''}`.toLowerCase().includes(needle))
  }, [rows, q])

  const fmt = (r: IndexRow) => {
    if (r.nm === 0 && r.angle) return r.angle
    if (ftlb) {
      if (r.inlb) return `${r.inlb} in-lb`
      if (r.ftlb) return `${r.ftlb} ft-lb`
      return `${Math.round(r.nm * 0.7376)} ft-lb`
    }
    return `${r.nm} N·m`
  }

  return (
    <div className="mt-6 rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
          Every torque figure in the platform
        </h3>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search fastener or procedure…"
          className="w-[220px] rounded border border-shop-700 bg-shop-900 px-3 py-1.5 text-[13px] text-shop-100 outline-none placeholder:text-shop-600 focus:border-amber-caution/60"
        />
        <span className="ml-auto font-mono text-[11px] text-shop-500">
          {shown.length} of {rows.length}
        </span>
      </div>

      <p className="mt-2 text-[12.5px] text-shop-500">
        Sorted by how hard the joint is clamped, which is roughly how much it matters. Switch units with the
        toggle in the header.
      </p>

      <div className="mt-3 max-h-[520px] overflow-y-auto rounded border border-shop-800">
        <table className="w-full border-collapse text-left">
          <tbody>
            {shown.map((r, i) => (
              <tr key={i} className="border-b border-shop-800 last:border-0 hover:bg-shop-850/60">
                <td className="px-3 py-2 align-top">
                  <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-shop-200">
                    {r.fastener}
                    {r.tty && (
                      <span className="rounded border border-danger/40 bg-danger/10 px-1.5 py-0.5 text-[10px] tracking-wide text-danger uppercase">
                        TTY · single use
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/procedure/${r.procId}`}
                    className="text-[11.5px] text-shop-500 transition-colors hover:text-amber-caution"
                  >
                    {r.procTitle}
                  </Link>
                </td>
                <td className="tnum w-32 px-3 py-2 text-right align-top font-mono text-[13px] font-semibold whitespace-nowrap text-torque">
                  {fmt(r)}
                  {r.angle && r.nm > 0 && (
                    <span className="block text-[11px] text-amber-caution">then {r.angle}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && (
          <div className="py-10 text-center text-[13px] text-shop-500">Nothing matches that.</div>
        )}
      </div>
    </div>
  )
}
