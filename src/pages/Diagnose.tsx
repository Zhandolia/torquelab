import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bookTime, caseById } from '../data/diagnostics'
import { procById } from '../data/procedures'
import { vehicleById, vehicleName } from '../data/vehicles'
import { SYSTEMS } from '../lib/types'
import { useStore } from '../lib/store'
import { bayProgress, caseStatuses, money, stageOptions } from '../lib/diagnose'
import { Viewer } from '../three/Viewer'
import { ViewerToolbar } from '../components/ViewerToolbar'
import { PartInspector } from '../components/PartInspector'
import { partsFor } from '../data/partsMeta'
import {
  Callout,
  Chip,
  Difficulty,
  fmtDuration,
  ProgressRing,
  RichText,
  SectionTitle,
  SpecNotice,
} from '../components/ui'

/* ====================================================================== bay */

export function DiagnosticBay() {
  const diagnostics = useStore((s) => s.diagnostics)
  const statuses = caseStatuses(diagnostics)
  const prog = bayProgress(statuses)

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <SectionTitle sub="Every procedure in this platform answers “how do I do this job”. None of them answers the harder question, which is “is this the job”.">
        The diagnostic bay
      </SectionTitle>

      <div className="mb-8 rounded-xl border border-shop-800 bg-shop-900/30 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <ProgressRing pct={prog.pct} size={44} />
          <div className="min-w-0 flex-1">
            <div className="text-[14.5px] font-semibold text-shop-100">
              {prog.complete ? 'Every case solved' : `${prog.solved} of ${prog.total} cases solved`}
            </div>
            <div className="text-[12px] text-shop-500">
              {prog.clean} solved cleanly — reached the fault in book time with nothing spent on parts that were
              not at fault
            </div>
          </div>
        </div>
        <p className="mt-4 max-w-[80ch] text-[13px] leading-relaxed text-shop-300">
          A case starts the way a job starts: with a customer describing a symptom and guessing at a cause. Each
          decision you make costs time, and some of them cost money for parts that turn out to be innocent. You can
          always reach the answer — what gets scored is what you spent getting there. The benchmark is the sum of
          the right moves, so a clean run is always possible.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {statuses.map((st) => {
          const c = st.c
          const v = vehicleById(c.vehicleId)!
          return (
            <Link
              key={c.id}
              to={`/diagnose/${c.id}`}
              className="group flex flex-col rounded-xl border border-shop-800 bg-shop-900/30 p-4 transition-colors hover:border-amber-caution/40 hover:bg-shop-850/60"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-bold ${
                    st.clean
                      ? 'border-safe bg-safe/15 text-safe'
                      : st.solved
                        ? 'border-torque text-torque'
                        : 'border-shop-600 text-shop-500'
                  }`}
                >
                  {st.solved ? '✓' : '?'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] tracking-widest text-amber-caution uppercase">
                    {SYSTEMS[c.system].label}
                  </div>
                  <h3 className="mt-0.5 text-[15px] leading-snug font-semibold text-shop-100">{c.title}</h3>
                </div>
              </div>

              <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-shop-400 italic">{c.complaint}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-shop-800 pt-3">
                <Chip>
                  {v.year} {v.make} {v.model}
                </Chip>
                <Difficulty level={c.difficulty} />
                <span className="ml-auto font-mono text-[11px] text-shop-500">
                  {st.solved && st.bestMin !== undefined ? (
                    <>
                      best {fmtDuration(st.bestMin)} · {money(st.bestParts ?? 0)} wasted
                    </>
                  ) : (
                    <>
                      {c.stages.length} decisions · book {fmtDuration(st.book)}
                    </>
                  )}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8">
        <SpecNotice />
      </div>
    </div>
  )
}

/* =================================================================== runner */

type Phase = 'brief' | 'working' | 'result'

export function DiagnosticCase() {
  const { id = '' } = useParams()
  const c = caseById(id)

  const [phase, setPhase] = useState<Phase>('brief')
  const [stageIdx, setStageIdx] = useState(0)
  /** option indices already tried at the current stage, in display order */
  const [tried, setTried] = useState<number[]>([])
  const [solvedStage, setSolvedStage] = useState(false)
  const [spentMin, setSpentMin] = useState(0)
  const [spentParts, setSpentParts] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [explodeOverride, setExplodeOverride] = useState<number | null>(null)
  const [camNonce, setCamNonce] = useState(0)

  const viewer = useStore((s) => s.viewer)
  const record = useStore((s) => s.recordDiagnosis)

  const stage = c?.stages[stageIdx]
  const options = useMemo(
    () => (c && stage ? stageOptions(c.id, stage) : []),
    [c, stage],
  )

  if (!c || !stage) {
    return (
      <div className="p-10 text-center text-shop-400">
        Case not found.{' '}
        <Link to="/diagnose" className="text-amber-caution underline">
          Back to the diagnostic bay
        </Link>
      </div>
    )
  }

  const vehicle = vehicleById(c.vehicleId)!
  const book = bookTime(c)
  const parts = partsFor(c.assembly)
  const explode = explodeOverride ?? (phase === 'working' ? (stage.explode ?? 0) : 0)
  const focus = phase === 'working' ? (stage.focus ?? []) : []
  const hidden = phase === 'working' ? (stage.hidden ?? []) : []
  const isLastStage = stageIdx === c.stages.length - 1

  const pick = (i: number) => {
    if (tried.includes(i) || solvedStage) return
    const o = options[i]
    setTried([...tried, i])
    setSpentMin((m) => m + o.costMin)
    setSpentParts((p) => p + (o.costParts ?? 0))
    if (o.correct) setSolvedStage(true)
  }

  const next = () => {
    setExplodeOverride(null)
    setSelected(null)
    if (isLastStage) {
      record(c.id, spentMin, spentParts)
      setPhase('result')
    } else {
      setStageIdx(stageIdx + 1)
      setTried([])
      setSolvedStage(false)
    }
  }

  const restart = () => {
    setPhase('brief')
    setStageIdx(0)
    setTried([])
    setSolvedStage(false)
    setSpentMin(0)
    setSpentParts(0)
    setExplodeOverride(null)
    setSelected(null)
  }

  const over = spentMin - book
  const proc = procById(c.verdict.procedureId)

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      {/* ---------------------------------------------------------- viewer */}
      <div className="relative min-h-[40vh] flex-1 lg:min-h-0">
        <Viewer
          assembly={c.assembly}
          focus={focus}
          hidden={hidden}
          explode={explode}
          camNonce={camNonce}
          labels={viewer.labels}
          ghost={viewer.ghost}
          xray={viewer.xray}
          grid={viewer.grid}
          autoRotate={phase === 'brief'}
          selected={selected}
          onSelect={setSelected}
          className="absolute inset-0"
        />
        <div className="pointer-events-none absolute inset-0">
          <PartInspector assembly={c.assembly} selected={selected} onClose={() => setSelected(null)} />
          <ViewerToolbar
            explode={explode}
            onExplode={setExplodeOverride}
            onReset={() => {
              setExplodeOverride(null)
              setCamNonce((n) => n + 1)
            }}
            partCount={parts.length}
          />
          {!selected && (
            <div className="absolute top-3 right-3 rounded border border-shop-700 bg-shop-950/80 px-2.5 py-1.5 font-mono text-[10px] text-shop-500 backdrop-blur-sm">
              the car is on the lift · orbit it while you think
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------- panel */}
      <section className="flex w-full shrink-0 flex-col overflow-hidden border-t border-shop-800 lg:w-[452px] lg:border-t-0 lg:border-l">
        {/* ------------------------------------------------------- header */}
        <div className="border-b border-shop-800 bg-shop-900/40 px-4 pt-3 pb-3">
          <Link to="/diagnose" className="text-[11px] text-shop-500 transition-colors hover:text-amber-caution">
            ← Diagnostic bay
          </Link>
          <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] tracking-widest text-amber-caution uppercase">
            {SYSTEMS[c.system].label}
            <span className="text-shop-600">·</span>
            <span className="text-shop-500">{vehicleName(vehicle)}</span>
          </div>
          <h1 className="mt-0.5 text-[16px] font-semibold text-shop-100">{c.title}</h1>

          {phase !== 'brief' && (
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                { n: fmtDuration(spentMin), l: 'time spent', tone: spentMin > book ? 'text-danger' : 'text-safe' },
                { n: fmtDuration(book), l: 'book time', tone: 'text-shop-300' },
                {
                  n: money(spentParts),
                  l: 'parts wasted',
                  tone: spentParts > 0 ? 'text-danger' : 'text-safe',
                },
              ].map((s) => (
                <div key={s.l} className="rounded border border-shop-800 bg-shop-950/50 px-2 py-1.5">
                  <div className={`tnum font-mono text-[13px] leading-none font-bold ${s.tone}`}>{s.n}</div>
                  <div className="mt-1 text-[10px] text-shop-500">{s.l}</div>
                </div>
              ))}
            </div>
          )}

          {phase === 'working' && (
            <div className="mt-2.5 flex gap-1">
              {c.stages.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1 flex-1 rounded-full ${
                    i < stageIdx || (i === stageIdx && solvedStage)
                      ? 'bg-safe'
                      : i === stageIdx
                        ? 'bg-amber-caution'
                        : 'bg-shop-800'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* -------------------------------------------------------- body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* ------------------------------------------------------ brief */}
          {phase === 'brief' && (
            <div className="space-y-4 fade-up">
              <div className="rounded-lg border border-shop-700 bg-shop-900/60 p-4">
                <div className="mb-2 font-mono text-[10px] font-bold tracking-widest text-amber-caution uppercase">
                  The complaint
                </div>
                <p className="text-[13.5px] leading-relaxed text-shop-200 italic">{c.complaint}</p>
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                  What you can see before touching anything
                </div>
                <ul className="space-y-1.5">
                  {c.observations.map((o, i) => (
                    <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-shop-300">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-caution" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Difficulty level={c.difficulty} />
                <Chip>{c.stages.length} decisions</Chip>
                <Chip tone="torque">book time {fmtDuration(book)}</Chip>
              </div>

              <Callout kind="note">
                Every decision costs time whether it was the right one or not, and a few of them put parts on the
                car that were never at fault. Nothing is hidden from you and you cannot get stuck — the only thing
                being measured is what the diagnosis costs.
              </Callout>
            </div>
          )}

          {/* ---------------------------------------------------- working */}
          {phase === 'working' && (
            <div className="space-y-4 fade-up" key={stage.id}>
              <div>
                <div className="mb-1 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                  Decision {stageIdx + 1} of {c.stages.length}
                </div>
                <p className="text-[13px] leading-relaxed text-shop-400">{stage.context}</p>
                <h2 className="mt-2.5 text-[16px] leading-snug font-semibold text-shop-100">{stage.prompt}</h2>
              </div>

              <div className="space-y-1.5">
                {options.map((o, i) => {
                  const picked = tried.includes(i)
                  const right = picked && o.correct
                  const wrong = picked && !o.correct
                  const cls = right
                    ? 'border-safe/50 bg-safe/[0.08] text-shop-100'
                    : wrong
                      ? 'border-danger/50 bg-danger/[0.08] text-shop-100'
                      : solvedStage
                        ? 'border-shop-800 bg-shop-900/40 text-shop-500'
                        : 'border-shop-700 bg-shop-850 text-shop-200 hover:border-shop-500 hover:bg-shop-800'
                  return (
                    <div key={i}>
                      <button
                        disabled={picked || solvedStage}
                        onClick={() => pick(i)}
                        className={`flex w-full items-start gap-2.5 rounded border px-3 py-2.5 text-left text-[13px] transition-colors ${cls} ${
                          picked || solvedStage ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <span className="mt-[2px] font-mono text-[10px] text-shop-500">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 leading-snug">{o.text}</span>
                        {picked && (
                          <span className="tnum shrink-0 font-mono text-[10px] whitespace-nowrap text-shop-400">
                            {o.costMin}m{o.costParts ? ` · ${money(o.costParts)}` : ''}
                          </span>
                        )}
                      </button>
                      {picked && (
                        <p
                          className={`mt-1 ml-7 border-l-2 pl-2.5 text-[12.5px] leading-relaxed ${
                            o.correct ? 'border-safe/40 text-shop-300' : 'border-danger/40 text-shop-400'
                          }`}
                        >
                          {o.why}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              {solvedStage && (
                <div className="rounded-lg border border-torque/40 bg-torque/[0.07] p-4">
                  <div className="mb-1.5 font-mono text-[10px] font-bold tracking-widest text-torque uppercase">
                    What you found
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-shop-200">{stage.finding}</p>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------- result */}
          {phase === 'result' && (
            <div className="space-y-4 fade-up">
              <div
                className={`rounded-lg border p-4 text-center ${
                  over <= 0 && spentParts === 0
                    ? 'border-safe/45 bg-safe/[0.07]'
                    : 'border-amber-caution/40 bg-amber-caution/[0.06]'
                }`}
              >
                <div
                  className={`font-mono text-[11px] font-bold tracking-widest uppercase ${
                    over <= 0 && spentParts === 0 ? 'text-safe' : 'text-amber-caution'
                  }`}
                >
                  {over <= 0 && spentParts === 0 ? 'Clean diagnosis' : 'Fault found'}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-shop-200">
                  You reached it in <span className="font-mono font-semibold">{fmtDuration(spentMin)}</span> against
                  a book time of <span className="font-mono font-semibold">{fmtDuration(book)}</span>
                  {over > 0 ? (
                    <>
                      {' '}
                      — <span className="text-danger">{fmtDuration(over)} over</span>
                    </>
                  ) : (
                    <>
                      {' '}
                      — <span className="text-safe">on the number</span>
                    </>
                  )}
                  , and spent{' '}
                  <span className={`font-mono font-semibold ${spentParts > 0 ? 'text-danger' : 'text-safe'}`}>
                    {money(spentParts)}
                  </span>{' '}
                  on parts that were not the fault.
                </p>
              </div>

              <div className="rounded-lg border border-shop-700 bg-shop-900/60 p-4">
                <div className="mb-1.5 font-mono text-[10px] font-bold tracking-widest text-amber-caution uppercase">
                  The fault
                </div>
                <p className="text-[14px] leading-snug font-semibold text-shop-100">{c.verdict.fault}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-shop-300">{c.verdict.explain}</p>
              </div>

              <Callout kind="tip">
                <RichText text={c.lesson} />
              </Callout>

              {proc && (
                <Link
                  to={`/procedure/${proc.id}`}
                  className="block rounded-lg border border-shop-700 bg-shop-900/40 p-4 transition-colors hover:border-amber-caution/40 hover:bg-shop-850"
                >
                  <div className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                    The repair, step by step
                  </div>
                  <div className="mt-1 text-[14px] font-semibold text-shop-100">{proc.title}</div>
                  <div className="mt-0.5 text-[12px] text-shop-500">
                    {proc.steps.length} steps · {fmtDuration(proc.timeMin)} · open in the 3D runner →
                  </div>
                </Link>
              )}

              <div className="rounded-lg border border-shop-800 bg-shop-900/30 p-4">
                <div className="mb-2 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                  Every decision in this case
                </div>
                <ol className="space-y-2.5">
                  {c.stages.map((s, i) => {
                    const o = stageOptions(c.id, s).find((x) => x.correct)!
                    return (
                      <li key={s.id} className="flex gap-2.5">
                        <span className="mt-[1px] font-mono text-[11px] text-torque">{i + 1}</span>
                        <div className="min-w-0">
                          <div className="text-[12.5px] leading-snug text-shop-200">{o.text}</div>
                          <div className="mt-0.5 text-[11.5px] text-shop-500">{s.finding}</div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------- footer */}
        <div className="sticky bottom-0 z-20 flex items-center gap-2 border-t border-shop-800 bg-shop-950/95 px-4 py-3 backdrop-blur-md lg:static lg:bg-shop-900/60">
          {phase === 'brief' && (
            <button
              onClick={() => setPhase('working')}
              className="ml-auto rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
            >
              Take the job →
            </button>
          )}

          {phase === 'working' && (
            <>
              <span className="text-[11.5px] text-shop-500">
                {solvedStage ? 'Right move.' : 'Pick a move. Wrong ones still cost you.'}
              </span>
              <button
                onClick={next}
                disabled={!solvedStage}
                className="ml-auto rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85 disabled:bg-shop-800 disabled:text-shop-500"
              >
                {isLastStage ? 'Call the fault' : 'Next decision →'}
              </button>
            </>
          )}

          {phase === 'result' && (
            <>
              <button
                onClick={restart}
                className="rounded border border-shop-700 px-3 py-2 text-[12.5px] text-shop-300 transition-colors hover:bg-shop-800"
              >
                Run it again
              </button>
              <Link
                to="/diagnose"
                className="ml-auto rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
              >
                Next case →
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
