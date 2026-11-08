import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { procById } from '../data/procedures'
import { vehicleById, vehicleName } from '../data/vehicles'
import { partsFor } from '../data/partsMeta'
import { SYSTEMS } from '../lib/types'
import { useStore } from '../lib/store'
import { Viewer } from '../three/Viewer'
import { ViewerToolbar } from '../components/ViewerToolbar'
import { PartInspector, PartTree } from '../components/PartInspector'
import { Quiz } from '../components/Quiz'
import {
  Callout,
  Chip,
  Difficulty,
  fmtDuration,
  HazardRow,
  HazardStrip,
  ProgressRing,
  RichText,
  SpecNotice,
  TorqueRows,
} from '../components/ui'

type Tab = 'step' | 'parts' | 'specs' | 'brief'

const EMPTY: string[] = []

export function Runner() {
  const { id = '' } = useParams()
  const proc = procById(id)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [explodeOverride, setExplodeOverride] = useState<number | null>(null)
  const [camNonce, setCamNonce] = useState(0)
  const [tab, setTab] = useState<Tab>('step')

  const viewer = useStore((s) => s.viewer)
  const progressEntry = useStore((s) => (proc ? s.progress[proc.id] : undefined))
  const completed = progressEntry?.steps ?? EMPTY
  const completeStep = useStore((s) => s.completeStep)
  const toggleStep = useStore((s) => s.toggleStep)
  const finish = useStore((s) => s.finish)
  const resetProc = useStore((s) => s.resetProc)
  const bookmarks = useStore((s) => s.bookmarks)
  const toggleBookmark = useStore((s) => s.toggleBookmark)

  const step = proc?.steps[idx]

  useEffect(() => {
    setExplodeOverride(null)
    setSelected(null)
    setTab('step')
  }, [idx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(i + 1, (proc?.steps.length ?? 1) - 1))
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [proc])

  if (!proc || !step) {
    return (
      <div className="p-10 text-center text-shop-400">
        Procedure not found.{' '}
        <Link to="/library" className="text-amber-caution underline">
          Back to the library
        </Link>
      </div>
    )
  }

  const vehicle = vehicleById(proc.primaryVehicleId)!
  const explode = explodeOverride ?? step.explode ?? 0
  const pct = Math.round((completed.length / proc.steps.length) * 100)
  const isLast = idx === proc.steps.length - 1
  const cp = proc.checkpoints.find((c) => c.afterStep === step.id)
  const parts = partsFor(proc.assembly)
  const marked = bookmarks.includes(proc.id)

  const advance = () => {
    completeStep(proc.id, step.id)
    if (isLast) finish(proc.id)
    else setIdx(idx + 1)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      {/* ------------------------------------------------------------ step rail */}
      <aside className="hidden w-[212px] shrink-0 flex-col overflow-y-auto border-r border-shop-800 bg-shop-900/40 lg:flex">
        <div className="border-b border-shop-800 p-3">
          <Link to="/library" className="text-[11px] text-shop-500 transition-colors hover:text-amber-caution">
            ← All procedures
          </Link>
          <div className="mt-2 flex items-center gap-2.5">
            <ProgressRing pct={pct} size={34} />
            <div className="min-w-0">
              <div className="tnum font-mono text-[13px] font-bold text-shop-100">{pct}%</div>
              <div className="text-[10.5px] text-shop-500">
                {completed.length}/{proc.steps.length} steps
              </div>
            </div>
          </div>
        </div>

        <ol className="flex-1 p-2">
          {proc.steps.map((s, i) => {
            const done = completed.includes(s.id)
            const active = i === idx
            return (
              <li key={s.id}>
                <button
                  onClick={() => setIdx(i)}
                  className={`group flex w-full items-start gap-2 rounded px-2 py-1.5 text-left transition-colors ${
                    active ? 'bg-amber-caution/12' : 'hover:bg-shop-850'
                  }`}
                >
                  <span
                    className={`mt-[1px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border font-mono text-[9.5px] font-bold ${
                      done
                        ? 'border-safe bg-safe/20 text-safe'
                        : active
                          ? 'border-amber-caution bg-amber-caution text-black'
                          : 'border-shop-600 text-shop-500'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <span
                    className={`text-[12px] leading-snug ${
                      active ? 'font-medium text-shop-100' : 'text-shop-400 group-hover:text-shop-200'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="border-t border-shop-800 p-3">
          <button
            onClick={() => {
              resetProc(proc.id)
              setIdx(0)
            }}
            className="w-full rounded border border-shop-700 px-2 py-1.5 font-mono text-[10px] tracking-wider text-shop-500 uppercase transition-colors hover:border-danger/50 hover:text-danger"
          >
            Reset progress
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- viewer */}
      <div className="relative min-h-[46vh] flex-1 lg:min-h-0">
        <Viewer
          assembly={proc.assembly}
          focus={step.focus ?? []}
          hidden={step.hide ?? proc.hiddenByStep?.[step.id] ?? []}
          explode={explode}
          cam={step.camera}
          camNonce={camNonce}
          hotspots={viewer.labels ? (step.hotspots ?? []) : []}
          labels={viewer.labels}
          ghost={viewer.ghost}
          xray={viewer.xray}
          grid={viewer.grid}
          autoRotate={viewer.autoRotate}
          selected={selected}
          onSelect={setSelected}
          className="absolute inset-0"
        />

        <div className="pointer-events-none absolute inset-0">
          <PartInspector assembly={proc.assembly} selected={selected} onClose={() => setSelected(null)} />
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
              drag to orbit · scroll to zoom · click a part
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------- detail panel */}
      <section className="flex w-full shrink-0 flex-col overflow-hidden border-t border-shop-800 lg:w-[428px] lg:border-t-0 lg:border-l">
        <div className="border-b border-shop-800 bg-shop-900/40 px-4 pt-3 pb-2">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-amber-caution uppercase">
                {SYSTEMS[proc.system].label}
                <span className="text-shop-600">·</span>
                <span className="text-shop-500">{SYSTEMS[proc.system].ase}</span>
              </div>
              <h1 className="mt-0.5 truncate text-[16px] font-semibold text-shop-100">{proc.title}</h1>
              <Link
                to={`/vehicle/${vehicle.id}`}
                className="text-[11.5px] text-shop-400 transition-colors hover:text-amber-caution"
              >
                {vehicleName(vehicle)} · {vehicle.engine.code}
              </Link>
            </div>
            <button
              onClick={() => toggleBookmark(proc.id)}
              title={marked ? 'Remove from My Bench' : 'Save to My Bench'}
              className={`rounded border px-2 py-1 text-[13px] transition-colors ${
                marked
                  ? 'border-amber-caution/50 bg-amber-caution/10 text-amber-caution'
                  : 'border-shop-700 text-shop-500 hover:text-shop-200'
              }`}
            >
              ★
            </button>
          </div>

          <div className="mt-2.5 flex gap-1">
            {(
              [
                ['step', `Step ${idx + 1}`],
                ['parts', 'Parts'],
                ['specs', 'Specs'],
                ['brief', 'Brief'],
              ] as [Tab, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`rounded px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                  tab === k ? 'bg-shop-800 text-shop-100' : 'text-shop-500 hover:bg-shop-850 hover:text-shop-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {tab === 'step' && (
            <div className="space-y-4 fade-up" key={step.id}>
              <div>
                <div className="mb-1 flex items-center gap-2 font-mono text-[10px] text-shop-500">
                  <span className="tracking-widest uppercase">
                    Step {idx + 1} of {proc.steps.length}
                  </span>
                  {step.durationMin && <span>· ~{step.durationMin} min</span>}
                </div>
                <h2 className="text-[17px] leading-snug font-semibold text-shop-100">{step.title}</h2>
              </div>

              {step.hazards && <HazardStrip kinds={step.hazards} />}

              <p className="text-[13.5px] leading-relaxed text-shop-300">
                <RichText text={step.body} />
              </p>

              {step.detail && (
                <ul className="space-y-1.5">
                  {step.detail.map((d, i) => (
                    <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-shop-300">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-caution" />
                      <RichText text={d} />
                    </li>
                  ))}
                </ul>
              )}

              {step.torque && step.torque.length > 0 && (
                <div>
                  <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                    Torque for this step
                  </div>
                  <TorqueRows specs={step.torque} />
                </div>
              )}

              {step.measure && step.measure.length > 0 && (
                <div>
                  <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                    Measure
                  </div>
                  <div className="overflow-hidden rounded border border-shop-700">
                    {step.measure.map((m, i) => (
                      <div key={i} className="border-b border-shop-800 px-3 py-2 last:border-0">
                        <div className="text-[13px] text-shop-200">{m.name}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span className="font-mono text-[12px] font-semibold text-torque">{m.spec}</span>
                          <span className="text-[11.5px] text-shop-500">{m.tool}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step.tip && <Callout kind="tip">{step.tip}</Callout>}
              {step.mistake && <Callout kind="mistake">{step.mistake}</Callout>}

              {cp && <Quiz cp={cp} procId={proc.id} />}

              {isLast && completed.includes(step.id) && (
                <div className="rounded-lg border border-safe/40 bg-safe/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] font-bold tracking-widest text-safe uppercase">
                    Procedure complete
                  </div>
                  <p className="mt-1.5 text-[13px] text-shop-300">
                    You have walked the whole job. Run it again with the step rail hidden and see how much you can
                    narrate yourself.
                  </p>
                  <Link
                    to="/library"
                    className="mt-3 inline-block rounded bg-shop-800 px-3 py-1.5 text-[12.5px] font-medium text-shop-100 transition-colors hover:bg-shop-700"
                  >
                    Pick the next procedure →
                  </Link>
                </div>
              )}
            </div>
          )}

          {tab === 'parts' && (
            <div className="fade-up">
              <p className="mb-3 text-[12.5px] text-shop-400">
                Every part in this assembly. Click one to inspect it in 3D — amber means it belongs to the step you
                are on.
              </p>
              <PartTree
                assembly={proc.assembly}
                focus={step.focus ?? []}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          )}

          {tab === 'specs' && (
            <div className="space-y-4 fade-up">
              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                  Full torque table
                </div>
                <TorqueRows specs={proc.torqueTable} />
              </div>

              {proc.fluids && proc.fluids.length > 0 && (
                <div>
                  <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                    Fluids
                  </div>
                  <div className="overflow-hidden rounded border border-shop-700">
                    {proc.fluids.map((f, i) => (
                      <div key={i} className="border-b border-shop-800 px-3 py-2 last:border-0">
                        <div className="text-[13px] text-shop-200">{f.name}</div>
                        <div className="font-mono text-[12px] text-torque">{f.spec}</div>
                        <div className="text-[11.5px] text-shop-500">{f.qty}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                  Vehicle quick specs
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {vehicle.quickSpecs.map((s) => (
                    <div key={s.label} className="rounded border border-shop-800 bg-shop-900/40 px-2.5 py-1.5">
                      <div className="text-[10.5px] text-shop-500">{s.label}</div>
                      <div className="font-mono text-[12px] text-shop-200">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <SpecNotice />
            </div>
          )}

          {tab === 'brief' && (
            <div className="space-y-4 fade-up">
              <div className="flex flex-wrap items-center gap-2">
                <Difficulty level={proc.difficulty} />
                <Chip>{fmtDuration(proc.timeMin)}</Chip>
                <Chip>{proc.location}</Chip>
              </div>

              <p className="text-[13.5px] leading-relaxed text-shop-300">{proc.summary}</p>

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                  By the end you can
                </div>
                <ul className="space-y-1.5">
                  {proc.objectives.map((o, i) => (
                    <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-shop-300">
                      <span className="mt-[1px] font-mono text-[11px] text-torque">{i + 1}</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-widest text-danger uppercase">
                  Before you start
                </div>
                <ul className="space-y-2 rounded border border-danger/25 bg-danger/[0.05] p-3">
                  {proc.hazards.map((h, i) => (
                    <HazardRow key={i} kind={h.kind} text={h.text} />
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                  Tools ({proc.tools.length})
                </div>
                <ul className="space-y-1">
                  {proc.tools.map((t, i) => (
                    <li key={i} className="flex gap-2 text-[12.5px]">
                      <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-shop-600" />
                      <span>
                        <span className="text-shop-200">{t.name}</span>
                        {t.detail && <span className="text-shop-500"> — {t.detail}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">Parts</div>
                <ul className="space-y-1">
                  {proc.parts.map((p, i) => (
                    <li key={i} className="text-[12.5px]">
                      <span className="text-shop-200">{p.name}</span>
                      <span className="font-mono text-shop-500"> ×{p.qty}</span>
                      {p.note && <div className="text-[11.5px] text-shop-500">{p.note}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- footer */}
        <div className="sticky bottom-0 z-20 flex items-center gap-2 border-t border-shop-800 bg-shop-950/95 px-4 py-3 backdrop-blur-md lg:static lg:bg-shop-900/60">
          <button
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
            className="rounded border border-shop-700 px-3 py-2 text-[12.5px] text-shop-300 transition-colors hover:bg-shop-800 disabled:opacity-35 disabled:hover:bg-transparent"
          >
            ← Back
          </button>
          <button
            onClick={() => toggleStep(proc.id, step.id)}
            className={`rounded border px-3 py-2 text-[12.5px] transition-colors ${
              completed.includes(step.id)
                ? 'border-safe/50 bg-safe/10 text-safe'
                : 'border-shop-700 text-shop-400 hover:bg-shop-800'
            }`}
          >
            {completed.includes(step.id) ? '✓ Done' : 'Mark done'}
          </button>
          <button
            onClick={advance}
            className="ml-auto rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
          >
            {isLast ? 'Finish procedure' : 'Next step →'}
          </button>
        </div>
      </section>
    </div>
  )
}
