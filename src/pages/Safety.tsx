import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HAZARD_DETAIL,
  LIFT_POINTS,
  LIFT_RULES,
  LIFT_VERDICTS,
  RATED_IDS,
  STORED_ENERGY,
} from '../data/safety'
import { PROCEDURES, procById } from '../data/procedures'
import { HAZARDS } from '../lib/types'
import { LiftDiagram, type DiagramMode } from '../components/liftDiagram'
import { Callout, SectionTitle } from '../components/ui'

const TONE: Record<string, string> = {
  safe: 'border-safe/50 bg-safe/10 text-safe',
  amber: 'border-amber-caution/50 bg-amber-caution/10 text-amber-caution',
  danger: 'border-danger/50 bg-danger/10 text-danger',
}

export function Safety() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <SectionTitle sub="Every procedure here carries a hazard strip, and a strip only ever tells you the conclusion. It says “crush / falling load” and moves on. That is the right thing for a procedure to do and the wrong thing to leave it at.">
        The safety brief
      </SectionTitle>

      <Callout kind="mistake">
        This platform was built for somebody working alone, on a driveway, with a trolley jack and no lift and
        nobody to find them. Trade school teaches this part on day one, before anyone touches a car. Read it
        before the procedures, not after.
      </Callout>

      <LiftSection />
      <StoredEnergySection />
      <HazardSection />
    </div>
  )
}

/* =========================================================== lift points */

function LiftSection() {
  const [mode, setMode] = useState<DiagramMode>('explore')
  const [focus, setFocus] = useState<string | null>('pinchFront')
  const [selected, setSelected] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)

  const pick = (id: string) => {
    if (mode === 'explore') {
      setFocus(id)
      return
    }
    if (revealed) return
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const switchMode = (m: DiagramMode) => {
    setMode(m)
    setSelected([])
    setRevealed(false)
    setFocus(m === 'explore' ? 'pinchFront' : null)
  }

  const reset = () => {
    setSelected([])
    setRevealed(false)
  }

  const rightPicks = selected.filter((id) => RATED_IDS.includes(id))
  const wrongPicks = selected.filter((id) => !RATED_IDS.includes(id))
  const missed = RATED_IDS.filter((id) => !selected.includes(id))
  const perfect = wrongPicks.length === 0 && missed.length === 0

  const focused = LIFT_POINTS.find((p) => p.id === focus)

  return (
    <div className="mt-6 rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
          Getting it up, and keeping it up
        </h3>
        <div className="ml-auto flex overflow-hidden rounded border border-shop-700">
          {(
            [
              ['explore', 'Explore'],
              ['drill', 'Drill'],
            ] as [DiagramMode, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => switchMode(k)}
              className={`px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                mode === k ? 'bg-amber-caution text-black' : 'text-shop-400 hover:bg-shop-850 hover:text-shop-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'drill' && (
        <p className="mb-3 text-[13.5px] text-shop-200">
          <span className="font-semibold">Pick every point you would put a jack stand under.</span> There are
          three, and seven that will hurt you.
        </p>
      )}

      <div className="rounded-lg border border-shop-800 bg-shop-950 px-2 py-3 sm:px-4">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <LiftDiagram mode={mode} selected={selected} revealed={revealed} focus={focus} onPick={pick} />
          </div>
          <p className="mt-1 text-[11px] text-shop-600 sm:hidden">swipe the diagram sideways</p>
        </div>
      </div>

      {/* ---------------------------------------------------------- explore */}
      {mode === 'explore' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {Object.entries(LIFT_VERDICTS).map(([k, v]) => (
                <span
                  key={k}
                  className={`inline-flex items-center rounded border px-2 py-0.5 text-[10.5px] font-medium tracking-wide uppercase ${TONE[v.tone]}`}
                >
                  {v.label}
                </span>
              ))}
            </div>
            <div className="max-h-[320px] overflow-y-auto rounded border border-shop-800">
              {LIFT_POINTS.map((p, i) => {
                const v = LIFT_VERDICTS[p.verdict]
                const on = focus === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setFocus(p.id)}
                    className={`flex w-full items-center gap-2.5 border-b border-shop-800 px-3 py-2 text-left transition-colors last:border-0 ${
                      on ? 'bg-shop-850' : 'hover:bg-shop-850/60'
                    }`}
                  >
                    <span className="w-4 shrink-0 font-mono text-[11px] text-shop-500">{i + 1}</span>
                    <span className={`flex-1 text-[12.5px] ${on ? 'text-shop-100' : 'text-shop-300'}`}>
                      {p.label}
                    </span>
                    <span
                      className={`shrink-0 rounded border px-1.5 py-0.5 text-[9.5px] tracking-wide uppercase ${TONE[v.tone]}`}
                    >
                      {v.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            {focused && (
              <div
                className={`rounded-lg border p-4 ${
                  focused.verdict === 'rated'
                    ? 'border-safe/40 bg-safe/[0.06]'
                    : focused.verdict === 'jack'
                      ? 'border-amber-caution/40 bg-amber-caution/[0.06]'
                      : 'border-danger/40 bg-danger/[0.06]'
                }`}
              >
                <div className="font-mono text-[10px] font-bold tracking-widest uppercase">
                  <span
                    className={
                      focused.verdict === 'rated'
                        ? 'text-safe'
                        : focused.verdict === 'jack'
                          ? 'text-amber-caution'
                          : 'text-danger'
                    }
                  >
                    {LIFT_VERDICTS[focused.verdict].label}
                  </span>
                </div>
                <h4 className="mt-1 text-[15px] font-semibold text-shop-100">{focused.label}</h4>
                <p className="mt-2 text-[13px] leading-relaxed text-shop-300">{focused.why}</p>
              </div>
            )}

            <div className="mt-4">
              <div className="mb-2 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                The rules that do not change between cars
              </div>
              <ul className="space-y-2">
                {LIFT_RULES.map((r) => (
                  <li key={r.rule} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-caution" />
                    <span>
                      <span className="text-[13px] text-shop-100">{r.rule}</span>
                      <span className="block text-[12.5px] leading-relaxed text-shop-400">{r.why}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ drill */}
      {mode === 'drill' && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] text-shop-500">
              {selected.length} selected
            </span>
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                disabled={selected.length === 0}
                className="ml-auto rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85 disabled:bg-shop-800 disabled:text-shop-500"
              >
                Check
              </button>
            ) : (
              <button
                onClick={reset}
                className="ml-auto rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
              >
                Try again
              </button>
            )}
          </div>

          {revealed && (
            <div className="mt-3 space-y-3 fade-up">
              <div
                className={`rounded-lg border p-4 ${
                  perfect ? 'border-safe/45 bg-safe/[0.07]' : 'border-danger/45 bg-danger/[0.07]'
                }`}
              >
                <div
                  className={`font-mono text-[10px] font-bold tracking-widest uppercase ${
                    perfect ? 'text-safe' : 'text-danger'
                  }`}
                >
                  {perfect ? 'All three, and nothing else' : 'Not yet'}
                </div>
                <p className="mt-1.5 text-[13.5px] text-shop-200">
                  {rightPicks.length} of 3 rated points
                  {wrongPicks.length > 0 && (
                    <>
                      , and {wrongPicks.length} {wrongPicks.length === 1 ? 'point' : 'points'} that would have
                      failed under you
                    </>
                  )}
                  {missed.length > 0 && wrongPicks.length === 0 && <> — {missed.length} still to find</>}.
                </p>
                <p className="mt-2 text-[12px] text-shop-400">
                  The diagram is now coloured by what each point actually is — green for stands, amber for jack
                  only, red for never. The dashed rings are the ones you chose.
                </p>
              </div>

              <div className="divide-y divide-shop-800 rounded border border-shop-800">
                {LIFT_POINTS.filter((p) => selected.includes(p.id) || p.verdict === 'rated').map((p) => {
                  const picked = selected.includes(p.id)
                  const ok = picked === (p.verdict === 'rated')
                  return (
                    <div key={p.id} className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[12px] ${ok ? 'text-safe' : 'text-danger'}`}>
                          {ok ? '✓' : '✕'}
                        </span>
                        <span className="text-[13px] text-shop-100">{p.label}</span>
                        <span className="ml-auto shrink-0 font-mono text-[10.5px] tracking-wide text-shop-500 uppercase">
                          {picked ? 'you chose it' : 'you missed it'}
                        </span>
                      </div>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-shop-400">{p.why}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ========================================================= stored energy */

function StoredEnergySection() {
  return (
    <div className="mt-6 rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
      <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
        Things holding energy that do not look like it
      </h3>
      <p className="mt-2 max-w-[82ch] text-[13px] leading-relaxed text-shop-300">
        A car on stands at least looks heavy. These do not look like anything at all, which is why they are the
        ones that catch experienced people.
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {STORED_ENERGY.map((s) => {
          const proc = s.procedureId ? procById(s.procedureId) : undefined
          return (
            <div key={s.id} className="rounded-lg border border-shop-800 bg-shop-950/40 p-4">
              <h4 className="text-[14.5px] font-semibold text-shop-100">{s.title}</h4>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-shop-400">{s.what}</p>
              <div className="mt-3">
                <div className="font-mono text-[10px] tracking-widest text-danger uppercase">How much</div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-shop-300">{s.howMuch}</p>
              </div>
              <div className="mt-2.5">
                <div className="font-mono text-[10px] tracking-widest text-safe uppercase">Releasing it</div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-shop-300">{s.release}</p>
              </div>
              {proc && (
                <Link
                  to={`/procedure/${proc.id}`}
                  className="mt-3 inline-block text-[12px] text-amber-caution hover:underline"
                >
                  {proc.title} →
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ======================================================= hazard reference */

function HazardSection() {
  /** which procedures actually declare each hazard, straight out of their data */
  const usage = useMemo(() => {
    const map = new Map<string, { id: string; title: string }[]>()
    for (const p of PROCEDURES) {
      for (const h of p.hazards) {
        const list = map.get(h.kind) ?? []
        if (!list.some((x) => x.id === p.id)) list.push({ id: p.id, title: p.title })
        map.set(h.kind, list)
      }
    }
    return map
  }, [])

  return (
    <div className="mt-6 rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
      <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
        What the hazard strips mean
      </h3>
      <p className="mt-2 max-w-[82ch] text-[13px] leading-relaxed text-shop-300">
        Every one of these appears at the top of a step somewhere in the library. This is the long version, with
        the procedures that raise each one.
      </p>

      <div className="mt-4 divide-y divide-shop-800">
        {HAZARD_DETAIL.map((h) => {
          const meta = HAZARDS[h.kind]
          const procs = usage.get(h.kind) ?? []
          return (
            <div key={h.kind} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[16px]" aria-hidden>
                  {meta.icon}
                </span>
                <h4 className="text-[14.5px] font-semibold text-shop-100">{meta.label}</h4>
              </div>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <p className="text-[12.5px] leading-relaxed text-shop-400">{h.what}</p>
                <p className="text-[12.5px] leading-relaxed text-shop-300">
                  <span className="font-semibold text-safe">Control. </span>
                  {h.control}
                </p>
              </div>
              {procs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {procs.map((p) => (
                    <Link
                      key={p.id}
                      to={`/procedure/${p.id}`}
                      className="rounded border border-shop-800 bg-shop-950/50 px-2 py-0.5 text-[11px] text-shop-400 transition-colors hover:border-amber-caution/40 hover:text-amber-caution"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
