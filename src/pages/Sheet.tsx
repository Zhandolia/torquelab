/**
 * The job sheet: one page you take to the car.
 *
 * Everything else in this platform is for learning the job at a desk, where a
 * dark screen and a 3D model are exactly right. This page is for the other
 * half of the problem — standing in a driveway with the bonnet up, sun on the
 * phone, hands too dirty to scrub a model around.
 *
 * Which is why it is light. A dark page on a phone outdoors is a mirror, and on
 * paper it is a cartridge. It prints on one sheet of A4 or Letter per section
 * and it carries both torque units at once, because at the car there is nobody
 * to ask and no toggle worth fumbling for.
 */

import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { procById } from '../data/procedures'
import { vehicleById } from '../data/vehicles'
import { prepFor, RESUME_LABEL } from '../data/prep'
import {
  unitPair,
  durationCoverage,
  sheetHazards,
  sheetMeasure,
  sheetTorque,
  singleUse,
  stepMinutes,
  stepNumber,
} from '../lib/jobsheet'
import { HAZARDS, SYSTEMS, TOOL_CATEGORY, type ToolCategory } from '../lib/types'
import { useStore } from '../lib/store'
import { fmtDuration } from '../components/ui'

/* ------------------------------------------------------------------ atoms */

/**
 * A tick box that survives being printed: a printer drops background colours
 * by default, so the box is drawn with a border and the mark with a stroke
 * rather than as a filled square.
 */
function TickBox({ procId, k }: { procId: string; k: string }) {
  // Selects a boolean, not `s.sheet[procId] ?? []`. That default builds a new
  // array on every call, so zustand sees a changed snapshot every render and
  // React spins until it gives up with "maximum update depth exceeded".
  const ticked = useStore((s) => s.sheet[procId]?.includes(k) ?? false)
  const toggle = useStore((s) => s.toggleTick)
  return (
    <button
      onClick={() => toggle(procId, k)}
      aria-pressed={ticked}
      className={`mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[3px] border-2 transition-colors print:border-neutral-500 print:bg-transparent print:text-neutral-900 ${
        ticked ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-400 bg-white hover:border-neutral-700'
      }`}
    >
      {ticked && (
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
          <path d="M1.5 6.5 4.5 9.5 10.5 2.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      )}
    </button>
  )
}

function Tick({ procId, k, children }: { procId: string; k: string; children: React.ReactNode }) {
  const ticked = useStore((s) => s.sheet[procId]?.includes(k) ?? false)
  return (
    <li className="flex items-start gap-2.5 py-[5px]">
      <TickBox procId={procId} k={k} />
      <span className={`text-[14px] leading-snug ${ticked ? 'text-neutral-400 line-through' : 'text-neutral-800'}`}>
        {children}
      </span>
    </li>
  )
}

function Block({
  title,
  note,
  children,
  tight,
}: {
  title: string
  note?: string
  children: React.ReactNode
  tight?: boolean
}) {
  return (
    <section data-sheet-section className={tight ? 'mt-6' : 'mt-8'}>
      <h2 className="border-b-2 border-neutral-900 pb-1 font-mono text-[12px] font-bold tracking-[0.16em] text-neutral-900 uppercase">
        {title}
      </h2>
      {note && <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-500">{note}</p>}
      <div className="mt-2.5">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------- commitment bar */

/**
 * How much of the job you can still walk away from.
 *
 * The segments are steps, left to right. Grey means you could still put the
 * tools down and drive the car; amber means you are finishing it. The colours
 * say one thing each and the legend states both, because a bar that just fades
 * from nice to nasty would be decoration.
 */
function CommitBar({
  total,
  commitAt,
  immobileAt,
}: {
  total: number
  commitAt: number
  immobileAt: number
}) {
  return (
    <div>
      <div className="flex gap-[2px]">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1
          const committed = n >= commitAt
          const immobile = immobileAt > 0 && n >= immobileAt
          return (
            <div key={n} className="relative flex-1" title={`Step ${n}`}>
              <div
                className={`h-7 rounded-[2px] ${committed ? 'bg-amber-500' : 'bg-neutral-300'}`}
                style={
                  immobile && !committed
                    ? { backgroundImage: 'repeating-linear-gradient(45deg,#d4d4d4 0 3px,#a3a3a3 3px 6px)' }
                    : immobile
                      ? { backgroundImage: 'repeating-linear-gradient(45deg,#f59e0b 0 3px,#b45309 3px 6px)' }
                      : undefined
                }
              />
              <div className="mt-0.5 text-center font-mono text-[8.5px] text-neutral-400">
                {total <= 12 || n === 1 || n % 3 === 0 ? n : ''}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[11.5px] text-neutral-600">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-4 rounded-[2px] bg-neutral-300" /> can still stop and drive it
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-4 rounded-[2px] bg-amber-500" /> committed — finish it
        </span>
        {immobileAt > 0 && (
          /* Hatching is an overlay on either colour, not a third state — a car
             can be immobile while you could still bolt it back together. The
             swatch is deliberately colourless so it does not read as one. */
          <span className="flex items-center gap-1.5">
            <span
              className="h-3 w-4 rounded-[2px] border border-neutral-400"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0 3px,#a3a3a3 3px 6px)' }}
            />{' '}
            hatched: car cannot move under its own power
          </span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ page */

export function Sheet() {
  const { id = '' } = useParams()
  const proc = procById(id)
  const prep = proc ? prepFor(proc.id) : undefined
  const done = useStore((s) => s.sheet[id]?.length ?? 0)
  const clearTicks = useStore((s) => s.clearTicks)

  const derived = useMemo(() => {
    if (!proc) return null
    return {
      torque: sheetTorque(proc),
      measures: sheetMeasure(proc),
      hazards: sheetHazards(proc),
      consumed: singleUse(proc),
      minutes: stepMinutes(proc),
      coverage: durationCoverage(proc),
    }
  }, [proc])

  if (!proc || !derived) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center text-shop-400">
        <p>No procedure with that id.</p>
        <Link to="/library" className="mt-3 inline-block text-amber-caution underline">
          Back to the procedure library
        </Link>
      </div>
    )
  }

  const v = vehicleById(proc.primaryVehicleId)
  const { torque, measures, hazards, consumed, minutes, coverage } = derived
  const commitAt = prep ? stepNumber(proc, prep.commitStep) : 0
  const immobileAt = prep?.immobileFrom ? stepNumber(proc, prep.immobileFrom) : 0
  const gap = minutes - proc.timeMin

  const byCat = (Object.keys(TOOL_CATEGORY) as ToolCategory[])
    .map((c) => ({ cat: c, tools: proc.tools.filter((t) => t.category === c) }))
    .filter((g) => g.tools.length > 0)

  const tickable =
    proc.tools.length +
    proc.parts.length +
    (proc.fluids?.length ?? 0) +
    (prep?.nightBefore.length ?? 0) +
    proc.steps.length

  return (
    <div className="bg-shop-950 px-3 py-6 sm:px-5 sm:py-8 print:bg-white print:p-0">
      {/* screen-only breadcrumb back into the dark app */}
      <div data-print-hide className="mx-auto mb-4 flex max-w-[62rem] flex-wrap items-center gap-3">
        <Link to={`/procedure/${proc.id}`} className="text-[13px] text-amber-caution hover:underline">
          ← Back to the guided procedure
        </Link>
        <span className="text-[13px] text-shop-600">·</span>
        <Link to="/library" className="text-[13px] text-shop-400 hover:text-shop-200">
          All procedures
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {done > 0 && (
            <button
              onClick={() => clearTicks(proc.id)}
              className="rounded border border-shop-700 px-2.5 py-1.5 text-[12px] text-shop-400 hover:text-shop-100"
            >
              Clear {done} tick{done === 1 ? '' : 's'}
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="rounded bg-amber-caution px-3 py-1.5 text-[12.5px] font-semibold text-black hover:bg-amber-400"
          >
            Print / save as PDF
          </button>
        </div>
      </div>

      <article
        data-sheet
        className="mx-auto max-w-[62rem] rounded-lg bg-white px-5 py-6 text-neutral-900 shadow-2xl sm:px-9 sm:py-8 print:rounded-none print:px-0 print:py-0 print:shadow-none"
      >
        {/* ------------------------------------------------------- header */}
        <header className="border-b-[3px] border-neutral-900 pb-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[10.5px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
              TorqueLab · job sheet
            </p>
            <p className="font-mono text-[10.5px] tracking-wide text-neutral-400">{proc.id}</p>
          </div>
          <h1 className="mt-1.5 text-[26px] leading-tight font-bold tracking-tight sm:text-[32px]">{proc.title}</h1>
          <p className="mt-1 text-[14.5px] text-neutral-600">{proc.subtitle}</p>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px]">
            {v && (
              <span>
                <span className="text-neutral-500">Vehicle</span>{' '}
                <strong className="font-semibold">
                  {v.year} {v.make} {v.model}
                </strong>{' '}
                <span className="text-neutral-500">
                  · {v.engine.code} {v.engine.displacement} · {v.drivetrain}
                </span>
              </span>
            )}
            <span>
              <span className="text-neutral-500">System</span>{' '}
              <strong className="font-semibold">{SYSTEMS[proc.system].label}</strong>{' '}
              <span className="text-neutral-500">· {SYSTEMS[proc.system].ase}</span>
            </span>
            <span>
              <span className="text-neutral-500">Difficulty</span>{' '}
              <strong className="font-semibold">{proc.difficulty} of 5</strong>
            </span>
          </div>
        </header>

        {/* --------------------------------------------------------- time */}
        <section data-sheet-section className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_1.5fr]">
          <div className="rounded border border-neutral-300 px-3 py-2.5">
            <p className="font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
              Shop flat rate
            </p>
            <p className="mt-0.5 text-[22px] font-bold tabular-nums">{fmtDuration(proc.timeMin)}</p>
            <p className="text-[11.5px] text-neutral-500">someone who has done it before</p>
          </div>
          <div className="rounded border-2 border-neutral-900 px-3 py-2.5">
            <p className="font-mono text-[10px] font-bold tracking-widest text-neutral-700 uppercase">
              Your first time
            </p>
            <p className="mt-0.5 text-[22px] font-bold tabular-nums">{fmtDuration(minutes)}</p>
            <p className="text-[11.5px] text-neutral-600">
              {coverage.complete
                ? `all ${coverage.total} steps added up`
                : `${coverage.withDur} of ${coverage.total} steps timed`}
            </p>
          </div>
          <div className="rounded bg-neutral-100 px-3 py-2.5 text-[12.5px] leading-relaxed text-neutral-700">
            {gap > 0 ? (
              <>
                Budget the <strong>larger</strong> figure. Following this procedure properly — reading each step,
                taking the measurements, answering the checkpoints — takes{' '}
                <strong>{Math.round((gap / proc.timeMin) * 100)}% longer</strong> than the flat rate, and the flat
                rate assumes nothing is seized.
              </>
            ) : (
              <>
                The two figures agree here, which is unusual. Treat it as the best case anyway: the flat rate assumes
                every fastener comes out the first time.
              </>
            )}
          </div>
        </section>

        {/* --------------------------------------------------------- plan */}
        {prep && (
          <Block
            title="Before you commit"
            note="The four questions a step list cannot answer, and the ones that decide whether you get the car back."
          >
            <CommitBar total={proc.steps.length} commitAt={commitAt} immobileAt={immobileAt} />

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded border-l-[3px] border-amber-500 bg-amber-50 px-3 py-2.5">
                <dt className="font-mono text-[10px] font-bold tracking-widest text-amber-800 uppercase">
                  Point of no return · step {commitAt} of {proc.steps.length}
                </dt>
                <dd className="mt-1 text-[13.5px] leading-relaxed text-neutral-800">
                  <strong className="font-semibold">{proc.steps[commitAt - 1]?.title}.</strong> {prep.commitWhy}
                </dd>
              </div>

              <div className="rounded border-l-[3px] border-neutral-900 bg-neutral-50 px-3 py-2.5">
                <dt className="font-mono text-[10px] font-bold tracking-widest text-neutral-700 uppercase">
                  {immobileAt > 0
                    ? `Car is immobile from step ${immobileAt}`
                    : proc.location === 'underhood' || !v
                      ? 'Driveability'
                      : 'Car stays driveable'}
                </dt>
                <dd className="mt-1 text-[13.5px] leading-relaxed text-neutral-800">
                  {immobileAt > 0 && (
                    <strong className="font-semibold">{proc.steps[immobileAt - 1]?.title}. </strong>
                  )}
                  {prep.immobileNote}
                </dd>
              </div>

              <div
                className={`rounded border-l-[3px] px-3 py-2.5 ${
                  prep.resume === 'no'
                    ? 'border-red-600 bg-red-50'
                    : prep.resume === 'risky'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-emerald-600 bg-emerald-50'
                }`}
              >
                <dt
                  className={`font-mono text-[10px] font-bold tracking-widest uppercase ${
                    prep.resume === 'no'
                      ? 'text-red-800'
                      : prep.resume === 'risky'
                        ? 'text-amber-800'
                        : 'text-emerald-800'
                  }`}
                >
                  Stopping halfway · {RESUME_LABEL[prep.resume].label}
                </dt>
                <dd className="mt-1 text-[13.5px] leading-relaxed text-neutral-800">{prep.resumeWhy}</dd>
              </div>

              <div className="rounded border-l-[3px] border-red-600 bg-red-50 px-3 py-2.5">
                <dt className="font-mono text-[10px] font-bold tracking-widest text-red-800 uppercase">
                  Do not improvise
                </dt>
                <dd className="mt-1 text-[13.5px] leading-relaxed text-neutral-800">
                  <strong className="font-semibold">{prep.cannotImprovise.tool}.</strong>{' '}
                  {prep.cannotImprovise.why}
                </dd>
              </div>
            </dl>
          </Block>
        )}

        {/* ------------------------------------------------- night before */}
        {prep && (
          <Block title="In your hands before you start" note="Each of these stops the job dead if you discover it late.">
            <ul>
              {prep.nightBefore.map((n, i) => (
                <Tick key={i} procId={proc.id} k={`prep:${i}`}>
                  {n}
                </Tick>
              ))}
            </ul>
          </Block>
        )}

        {/* ------------------------------------------------- consumables */}
        {consumed.length > 0 && (
          <Block
            title="Fasteners you cannot reuse"
            note="Used once by design. Have them before you loosen anything, because loosening them is what consumes them."
            tight
          >
            <ul className="flex flex-wrap gap-2">
              {consumed.map((t, i) => (
                <li
                  key={i}
                  className="rounded border border-red-300 bg-red-50 px-2.5 py-1.5 text-[12.5px] text-neutral-800"
                >
                  <strong className="font-semibold">{t.fastener}</strong>
                  {t.tty && <span className="ml-1.5 font-mono text-[10px] text-red-700">TTY</span>}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {/* ------------------------------------------------------- tools */}
        <Block title={`Tools · ${proc.tools.length}`}>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {byCat.map((g) => (
              <div key={g.cat} className="break-inside-avoid">
                <p className="mt-2 mb-0.5 font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  {TOOL_CATEGORY[g.cat].label}
                </p>
                <ul>
                  {g.tools.map((t) => (
                    <Tick key={t.name} procId={proc.id} k={`tool:${t.name}`}>
                      {t.name}
                      {t.detail && <span className="text-neutral-500"> — {t.detail}</span>}
                    </Tick>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        {/* ------------------------------------------------------- parts */}
        <Block title={`Parts & fluids · ${proc.parts.length + (proc.fluids?.length ?? 0)}`}>
          <ul>
            {proc.parts.map((p) => (
              <Tick key={p.name} procId={proc.id} k={`part:${p.name}`}>
                <strong className="font-semibold">{p.qty}</strong> — {p.name}
                {p.note && <span className="text-neutral-500"> ({p.note})</span>}
              </Tick>
            ))}
            {proc.fluids?.map((f) => (
              <Tick key={f.name} procId={proc.id} k={`fluid:${f.name}`}>
                <strong className="font-semibold">{f.qty}</strong> — {f.name}{' '}
                <span className="font-mono text-[12px] text-neutral-600">[{f.spec}]</span>
              </Tick>
            ))}
          </ul>
        </Block>

        {/* ------------------------------------------------------ torque */}
        <Block
          title={`Every torque figure · ${torque.length}`}
          note="Both units on every line. At the car there is no toggle worth fumbling for and nobody to check your arithmetic."
        >
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-neutral-400">
                <th className="py-1.5 pr-3 font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  Fastener
                </th>
                <th className="py-1.5 pr-3 font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  Spec
                </th>
                <th className="w-12 py-1.5 font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  Step
                </th>
              </tr>
            </thead>
            <tbody>
              {torque.map((t, i) => (
                <tr key={i} className="break-inside-avoid border-b border-neutral-200 align-top">
                  <td className="py-1.5 pr-3">
                    <span className="font-medium">{t.fastener}</span>
                    {t.tty && (
                      <span className="ml-1.5 rounded bg-red-100 px-1 py-px font-mono text-[9.5px] font-bold text-red-800">
                        TTY · SINGLE USE
                      </span>
                    )}
                    {t.extra && (
                      <span className="ml-1.5 rounded bg-neutral-100 px-1 py-px font-mono text-[9.5px] text-neutral-500">
                        step only
                      </span>
                    )}
                    {t.pattern && <div className="text-[11.5px] text-neutral-600">↻ {t.pattern}</div>}
                    {t.note && <div className="text-[11.5px] text-neutral-500">{t.note}</div>}
                  </td>
                  <td className="py-1.5 pr-3 font-mono font-semibold tabular-nums">
                    {(() => {
                      const u = unitPair(t)
                      return (
                        <>
                          <span className="block whitespace-nowrap">{u.primary}</span>
                          {u.secondary && (
                            <span className="block whitespace-nowrap text-neutral-600">{u.secondary}</span>
                          )}
                        </>
                      )
                    })()}
                    {t.angle && t.nm > 0 && (
                      <span className="block text-[11.5px] font-bold text-amber-700">then {t.angle}</span>
                    )}
                  </td>
                  <td className="w-12 py-1.5 font-mono text-[12px] text-neutral-500 tabular-nums">
                    {t.steps.length ? t.steps.join(', ') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>

        {/* ------------------------------------------------- measurements */}
        {measures.length > 0 && (
          <Block
            title={`Measurements & limits · ${measures.length}`}
            note="Write your readings in the margin. A measurement you did not record is one you will re-take."
          >
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-neutral-400">
                  <th className="py-1.5 pr-3 font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    What
                  </th>
                  <th className="py-1.5 pr-3 font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    Limit
                  </th>
                  <th className="py-1.5 pr-3 font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    Tool
                  </th>
                  <th className="w-24 py-1.5 font-mono text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    Reading
                  </th>
                </tr>
              </thead>
              <tbody>
                {measures.map((m, i) => (
                  <tr key={i} className="break-inside-avoid border-b border-neutral-200 align-top">
                    <td className="py-2 pr-3 font-medium">
                      {m.name} <span className="font-mono text-[11px] text-neutral-400">s{m.step}</span>
                    </td>
                    <td className="py-2 pr-3 font-mono tabular-nums">{m.spec}</td>
                    <td className="py-2 pr-3 text-[12px] text-neutral-600">{m.tool}</td>
                    <td className="py-2">
                      <span className="block h-5 border-b border-dotted border-neutral-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Block>
        )}

        {/* ----------------------------------------------------- hazards */}
        <Block title="Hazards" note="The step numbers are where each one is live.">
          <ul className="grid gap-2">
            {hazards.map((h, i) => (
              <li
                key={i}
                className="break-inside-avoid rounded border-l-[3px] border-neutral-900 bg-neutral-50 px-3 py-2 text-[13px] leading-relaxed"
              >
                <strong className="font-semibold">
                  {HAZARDS[h.kind].icon} {HAZARDS[h.kind].label}
                  {h.steps.length > 0 && (
                    <span className="ml-1 font-mono text-[11px] font-normal text-neutral-500">
                      steps {h.steps.join(', ')}
                    </span>
                  )}
                  .
                </strong>{' '}
                {h.text}
              </li>
            ))}
          </ul>
        </Block>

        {/* ------------------------------------------------------- steps */}
        <Block
          title={`Running order · ${proc.steps.length} steps`}
          note="Tick as you go. The full explanation for each one lives in the guided procedure."
        >
          <ol className="text-[13.5px]">
            {proc.steps.map((s, i) => {
              const n = i + 1
              const past = commitAt > 0 && n >= commitAt
              return (
                <li
                  key={s.id}
                  className={`break-inside-avoid border-b border-neutral-200 py-1 ${
                    n === commitAt ? 'border-t-2 border-t-amber-500' : ''
                  }`}
                >
                  {n === commitAt && (
                    <p className="pt-1 font-mono text-[10px] font-bold tracking-widest text-amber-700 uppercase">
                      ▼ point of no return
                    </p>
                  )}
                  <div className="flex items-start gap-2.5">
                    <TickBox procId={proc.id} k={`step:${s.id}`} />
                    <span className="mt-[1px] w-6 shrink-0 font-mono text-[12px] font-bold text-neutral-400 tabular-nums">
                      {n}
                    </span>
                    <span className="flex-1">
                      <span className={past ? 'font-medium' : ''}>{s.title}</span>
                      <span className="ml-2 inline-flex flex-wrap gap-1.5 align-middle">
                        {s.torque?.length ? (
                          <span className="rounded bg-neutral-900 px-1 py-px font-mono text-[9.5px] font-bold text-white">
                            TORQUE
                          </span>
                        ) : null}
                        {s.measure?.length ? (
                          <span className="rounded bg-neutral-200 px-1 py-px font-mono text-[9.5px] font-bold text-neutral-700">
                            MEASURE
                          </span>
                        ) : null}
                        {s.hazards?.length ? (
                          <span className="rounded bg-amber-200 px-1 py-px font-mono text-[9.5px] font-bold text-amber-900">
                            HAZARD
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[11.5px] text-neutral-400 tabular-nums">
                      {s.durationMin ? fmtDuration(s.durationMin) : ''}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </Block>

        {/* ------------------------------------------------------ footer */}
        <footer data-sheet-section className="mt-8 border-t-2 border-neutral-900 pt-3">
          <p className="text-[11.5px] leading-relaxed text-neutral-600">
            <strong className="text-neutral-900">Training reference values.</strong> Every torque figure, clearance
            and discard spec on this sheet is here to teach the shape of the job. Verify each number against the
            factory service manual for your exact year, engine and market before you put a wrench on a real
            vehicle — specs change mid-model-year. TorqueLab is not a service information provider.
          </p>
          <p className="mt-2 font-mono text-[10.5px] tracking-wide text-neutral-400">
            {done}/{tickable} ticked · torquelab · {proc.id}
          </p>
        </footer>
      </article>
    </div>
  )
}

