import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  INSTRUMENTS,
  randomReading,
  type Instrument,
  type InstrumentId,
} from '../data/instruments'
import { procById } from '../data/procedures'
import { useStore } from '../lib/store'
import { DialIndicator, Micrometer, VernierCaliper } from '../components/instruments'
import { Callout, Chip, RichText, SectionTitle, SpecNotice } from '../components/ui'

/**
 * The instrument is the content, so it is never allowed to shrink below the
 * width where its smallest graduation is still readable. On a phone the two
 * long scales scroll sideways inside their panel instead of squeezing down to
 * three-pixel divisions.
 */
function Scale({ id, value, hint }: { id: InstrumentId; value: number; hint?: boolean }) {
  const body =
    id === 'micrometer' ? (
      <Micrometer value={value} />
    ) : id === 'caliper' ? (
      <VernierCaliper value={value} hint={hint} />
    ) : (
      <DialIndicator value={value} />
    )

  if (id === 'dial') return body
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[680px]">{body}</div>
      <p className="mt-1 text-[11px] text-shop-600 sm:hidden">swipe the scale sideways to read it</p>
    </div>
  )
}

/** Parse a typed reading: accepts "21.37", "21,37" and " 21.37 mm ". */
function parseReading(s: string): number | null {
  const cleaned = s.replace(/,/g, '.').replace(/mm/gi, '').trim()
  if (!cleaned) return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

/* ==================================================================== page */

export function Measure() {
  const [id, setId] = useState<InstrumentId>('micrometer')
  const inst = INSTRUMENTS.find((i) => i.id === id)!
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <SectionTitle sub="Sixteen procedures here tell you to measure something and compare it against a limit. None of them teaches you to read the instrument, because trade school does that in week one and everyone else is assumed to know it already.">
        The measurement bench
      </SectionTitle>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {INSTRUMENTS.map((i) => (
          <button
            key={i.id}
            onClick={() => setId(i.id)}
            className={`rounded border px-3 py-2 text-left transition-colors ${
              i.id === id
                ? 'border-amber-caution/50 bg-amber-caution/10'
                : 'border-shop-800 bg-shop-900/40 hover:border-shop-600 hover:bg-shop-850'
            }`}
          >
            <div className={`text-[13.5px] font-semibold ${i.id === id ? 'text-amber-caution' : 'text-shop-200'}`}>
              {i.name}
            </div>
            <div className="font-mono text-[10.5px] text-shop-500">{i.subtitle}</div>
          </button>
        ))}
      </div>

      <Instrument_ key={id} inst={inst} />

      <div className="mt-8">
        <SpecNotice />
      </div>
    </div>
  )
}

/* ============================================================== one tool */

type Mode = 'explore' | 'drill'

function Instrument_({ inst }: { inst: Instrument }) {
  const [mode, setMode] = useState<Mode>('explore')
  const [value, setValue] = useState(inst.worked.value)

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded border border-shop-700">
            {(
              [
                ['explore', 'Explore'],
                ['drill', 'Drill'],
              ] as [Mode, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setMode(k)}
                className={`px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  mode === k ? 'bg-amber-caution text-black' : 'text-shop-400 hover:bg-shop-850 hover:text-shop-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Chip tone="torque">{inst.range}</Chip>
          <Chip>reads to {inst.resolution.toFixed(2)} mm</Chip>
        </div>

        {mode === 'explore' ? (
          <Explore inst={inst} value={value} setValue={setValue} />
        ) : (
          <Drill inst={inst} />
        )}
      </div>

      {/* ------------------------------------------------------- reference */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-5">
            <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
              How the scale works
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-shop-300">{inst.blurb}</p>
            <ol className="mt-3 space-y-2">
              {inst.howTo.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-shop-300">
                  <span className="mt-[1px] font-mono text-[11px] text-torque">{i + 1}</span>
                  <RichText text={h} />
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-torque/35 bg-torque/[0.05] p-5">
            <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-torque uppercase">
              Worked example · {inst.worked.value.toFixed(2)} mm
            </h3>
            <ul className="mt-2 space-y-1.5">
              {inst.worked.parts.map((p, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-shop-300">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-torque" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-5">
            <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
              Technique that changes the number
            </h3>
            <ul className="mt-2 space-y-2">
              {inst.technique.map((t, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-shop-300">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-caution" />
                  <RichText text={t} />
                </li>
              ))}
            </ul>
          </div>

          <Callout kind="mistake">{inst.mistake}</Callout>

          <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-5">
            <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
              What it measures here
            </h3>
            <div className="mt-2 divide-y divide-shop-800">
              {inst.usedFor.map((u, i) => {
                const proc = procById(u.procedureId)
                return (
                  <Link
                    key={i}
                    to={`/procedure/${u.procedureId}`}
                    className="group block py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="text-[13px] text-shop-200 group-hover:text-amber-caution">{u.spec}</div>
                    <div className="text-[11.5px] text-shop-500">
                      {proc ? proc.title : u.where} →
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================ explore */

function Explore({
  inst,
  value,
  setValue,
}: {
  inst: Instrument
  value: number
  setValue: (v: number) => void
}) {
  const max = inst.id === 'dial' ? 3 : 25
  const snap = (v: number) => Math.round(v / inst.resolution) * inst.resolution
  const nudge = (d: number) => setValue(Math.min(max, Math.max(0, snap(value + d * inst.resolution))))

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-shop-800 bg-shop-950 px-2 py-3 sm:px-4">
        <Scale id={inst.id} value={value} hint />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => nudge(-1)}
            className="h-8 w-8 rounded border border-shop-700 font-mono text-[14px] text-shop-300 transition-colors hover:bg-shop-800"
            aria-label="down one division"
          >
            −
          </button>
          <button
            onClick={() => nudge(1)}
            className="h-8 w-8 rounded border border-shop-700 font-mono text-[14px] text-shop-300 transition-colors hover:bg-shop-800"
            aria-label="up one division"
          >
            +
          </button>
        </div>

        <input
          type="range"
          min={0}
          max={max}
          step={inst.resolution}
          value={value}
          onChange={(e) => setValue(snap(Number(e.target.value)))}
          className="min-w-[180px] flex-1"
          aria-label="measurement"
        />

        <div className="tnum rounded border border-amber-caution/40 bg-amber-caution/10 px-3 py-1.5 font-mono text-[18px] font-bold text-amber-caution">
          {value.toFixed(2)} <span className="text-[12px] text-amber-caution/70">mm</span>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] text-shop-500">
        Move it and watch which part of the reading changes. The scales are drawn to scale against each other, so
        the number above comes out of the geometry rather than being printed next to it.
      </p>
    </div>
  )
}

/* ================================================================== drill */

function Drill({ inst }: { inst: Instrument }) {
  const [target, setTarget] = useState(() => randomReading(inst))
  const [entry, setEntry] = useState('')
  const [verdict, setVerdict] = useState<'none' | 'right' | 'wrong'>('none')
  const [streak, setStreak] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const record = useStore((s) => s.recordReading)
  const stats = useStore((s) => s.drills[inst.id])
  const pct = stats && stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0

  useEffect(() => {
    inputRef.current?.focus()
  }, [target])

  const check = () => {
    if (verdict !== 'none') return
    const n = parseReading(entry)
    if (n === null) return
    const ok = Math.abs(n - target) < inst.resolution / 2
    const nextStreak = ok ? streak + 1 : 0
    setStreak(nextStreak)
    setVerdict(ok ? 'right' : 'wrong')
    record(inst.id, ok, nextStreak)
  }

  const nextOne = () => {
    setTarget(randomReading(inst))
    setEntry('')
    setVerdict('none')
  }

  const breakdown = useMemo(() => {
    const h = Math.round(target * 100)
    if (inst.id === 'micrometer') {
      const whole = Math.floor(h / 100)
      const half = h % 100 >= 50 ? 0.5 : 0
      const thimble = h % 50
      return `${whole} mm above the line${half ? ' + 0.5 mm below it' : ''} + ${thimble} on the thimble`
    }
    if (inst.id === 'caliper') {
      const whole = Math.floor(h / 100)
      const div = (h % 100) / 5
      return `${whole} whole mm at the vernier zero + division ${div} × 0.05 mm`
    }
    const revs = Math.floor(h / 100)
    return `${revs} mm on the counter + ${h % 100} on the needle`
  }, [target, inst.id])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">Read the instrument</span>
        <span className="ml-auto flex items-center gap-3 font-mono text-[11px] text-shop-500">
          <span className="tnum">
            streak <span className={streak > 0 ? 'text-safe' : 'text-shop-400'}>{streak}</span>
          </span>
          {stats && stats.attempts > 0 && (
            <span className="tnum">
              {stats.correct}/{stats.attempts} · {pct}% · best {stats.bestStreak}
            </span>
          )}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-shop-800 bg-shop-950 px-2 py-3 sm:px-4">
        <Scale id={inst.id} value={target} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            if (verdict === 'none') check()
            else nextOne()
          }}
          inputMode="decimal"
          placeholder={`e.g. ${inst.worked.value.toFixed(2)}`}
          disabled={verdict !== 'none'}
          className="tnum w-[150px] rounded border border-shop-700 bg-shop-950 px-3 py-2 font-mono text-[16px] text-shop-100 outline-none placeholder:text-shop-600 focus:border-amber-caution/60 disabled:opacity-60"
        />
        <span className="font-mono text-[13px] text-shop-500">mm</span>

        {verdict === 'none' ? (
          <button
            onClick={check}
            disabled={parseReading(entry) === null}
            className="rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85 disabled:bg-shop-800 disabled:text-shop-500"
          >
            Check
          </button>
        ) : (
          <button
            onClick={nextOne}
            className="rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
          >
            Next reading →
          </button>
        )}

        <button
          onClick={nextOne}
          className="rounded border border-shop-700 px-3 py-2 text-[12.5px] text-shop-400 transition-colors hover:bg-shop-800"
        >
          Skip
        </button>
      </div>

      {verdict !== 'none' && (
        <div
          className={`mt-3 rounded-lg border p-3 fade-up ${
            verdict === 'right' ? 'border-safe/45 bg-safe/[0.07]' : 'border-danger/45 bg-danger/[0.07]'
          }`}
        >
          <div
            className={`font-mono text-[10px] font-bold tracking-widest uppercase ${
              verdict === 'right' ? 'text-safe' : 'text-danger'
            }`}
          >
            {verdict === 'right' ? '✓ correct' : '✕ not quite'}
          </div>
          <p className="mt-1 text-[13.5px] text-shop-200">
            It reads <span className="tnum font-mono font-semibold">{target.toFixed(2)} mm</span> — {breakdown}.
          </p>
        </div>
      )}
    </div>
  )
}
