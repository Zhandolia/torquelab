import { useMemo, useState } from 'react'
import {
  DROP_LIMITS,
  FAULTS,
  METER_LESSONS,
  TEST_POINTS,
  faultById,
  pointByNode,
} from '../data/circuits'
import { MODES, drops, read, solve, type MeterMode } from '../lib/circuit'
import { CircuitDiagram } from '../components/circuitDiagram'
import { Callout, Chip, SectionTitle, SpecNotice } from '../components/ui'

type Mode = 'explore' | 'diagnose'

const randomFault = () => {
  const real = FAULTS.filter((f) => f.id !== 'none')
  return real[Math.floor(Math.random() * real.length)].id
}

export function Electrical() {
  const [mode, setMode] = useState<Mode>('explore')
  const [faultId, setFaultId] = useState('none')
  const [hidden, setHidden] = useState(randomFault)
  const [guess, setGuess] = useState<string | null>(null)
  const [keyOn, setKeyOn] = useState(true)
  const [meterMode, setMeterMode] = useState<MeterMode>('vdc')
  const [redNode, setRedNode] = useState(0)
  const [blackNode, setBlackNode] = useState(8)
  const [placing, setPlacing] = useState<'red' | 'black'>('red')

  const active = mode === 'explore' ? faultId : hidden
  const solution = useMemo(() => solve(active, keyOn), [active, keyOn])
  const reading = read(solution, meterMode, redNode, blackNode)
  const d = drops(solution)
  const fault = faultById(active)
  const revealed = mode === 'explore' || guess !== null

  const pick = (node: number) => {
    if (placing === 'red') {
      setRedNode(node)
      setPlacing('black')
    } else {
      setBlackNode(node)
      setPlacing('red')
    }
  }

  const newCase = () => {
    setHidden(randomFault())
    setGuess(null)
    setKeyOn(true)
    setMeterMode('vdc')
    setRedNode(0)
    setBlackNode(8)
    setPlacing('red')
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setGuess(null)
    if (m === 'diagnose') newCase()
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <SectionTitle sub="The platform maps onto the ASE areas and has always been missing one: electrical. It is where most modern faults live and the area self-taught mechanics are worst at, because a wiring diagram tells you nothing about where to put the probes.">
        The electrical bench
      </SectionTitle>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded border border-shop-700">
          {(
            [
              ['explore', 'Explore'],
              ['diagnose', 'Diagnose'],
            ] as [Mode, string][]
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

        {mode === 'explore' ? (
          <select
            value={faultId}
            onChange={(e) => setFaultId(e.target.value)}
            className="rounded border border-shop-700 bg-shop-900 px-2.5 py-1.5 text-[13px] text-shop-200 outline-none focus:border-amber-caution/60"
          >
            {FAULTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        ) : (
          <button
            onClick={newCase}
            className="rounded border border-shop-700 px-3 py-1.5 text-[12.5px] text-shop-300 transition-colors hover:bg-shop-800"
          >
            New fault
          </button>
        )}

        <button
          onClick={() => setKeyOn(!keyOn)}
          className={`ml-auto rounded border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
            keyOn
              ? 'border-safe/50 bg-safe/10 text-safe'
              : 'border-shop-700 bg-shop-900 text-shop-400 hover:text-shop-200'
          }`}
        >
          Switch {keyOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {mode === 'diagnose' && (
        <div className="mb-4 rounded-lg border border-shop-700 bg-shop-900/60 p-4">
          <div className="font-mono text-[10px] font-bold tracking-widest text-amber-caution uppercase">
            The complaint
          </div>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-shop-200 italic">{fault.complaint}</p>
          <p className="mt-1 text-[12.5px] text-shop-400">{fault.observed}</p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* ------------------------------------------------------ schematic */}
        <div className="min-w-0 rounded-xl border border-shop-800 bg-shop-900/30 p-3 sm:p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
              Placing the {placing} probe
            </span>
            <div className="ml-auto flex gap-1">
              {(['red', 'black'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlacing(p)}
                  className={`rounded border px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                    placing === p
                      ? p === 'red'
                        ? 'border-danger bg-danger/15 text-danger'
                        : 'border-shop-300 bg-shop-100/10 text-shop-100'
                      : 'border-shop-700 text-shop-500 hover:text-shop-300'
                  }`}
                >
                  {p === 'red' ? 'Red' : 'Black'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-shop-800 bg-shop-950 px-2 py-2">
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <CircuitDiagram
                  solution={solution}
                  redNode={redNode}
                  blackNode={blackNode}
                  faultElementId={revealed && fault.elementId ? fault.elementId : null}
                  onPick={pick}
                />
              </div>
              <p className="mt-1 text-[11px] text-shop-600 sm:hidden">swipe the schematic sideways</p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {TEST_POINTS.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p.node)}
                className={`rounded border px-2 py-1 text-[11px] transition-colors ${
                  p.node === redNode
                    ? 'border-danger bg-danger/15 text-danger'
                    : p.node === blackNode
                      ? 'border-shop-300 bg-shop-100/10 text-shop-100'
                      : 'border-shop-800 text-shop-400 hover:border-shop-600 hover:text-shop-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------- meter */}
        <div className="min-w-0">
          <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-4">
            <div className="rounded-lg border-2 border-shop-700 bg-[#121b14] px-4 py-5">
              <div className="flex items-baseline justify-end gap-2">
                <span className="tnum font-mono text-[38px] leading-none font-bold text-[#7dffb0]">
                  {reading.text}
                </span>
                <span className="font-mono text-[16px] text-[#7dffb0]/70">{reading.unit}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-[#7dffb0]/50 uppercase">
                  {reading.beeping ? '•)) beeping' : (reading.note ?? ' ')}
                </span>
                <span className="font-mono text-[10px] text-[#7dffb0]/50">
                  {pointByNode(redNode)?.label} → {pointByNode(blackNode)?.label}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMeterMode(m.id)}
                  className={`rounded border px-2 py-2 font-mono text-[12px] transition-colors ${
                    meterMode === m.id
                      ? 'border-amber-caution bg-amber-caution text-black'
                      : 'border-shop-700 text-shop-300 hover:bg-shop-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-shop-400">
              {MODES.find((m) => m.id === meterMode)!.hint}
            </p>
          </div>

          {/* --------------------------------------------- live drop summary */}
          <div className="mt-3 rounded-xl border border-shop-800 bg-shop-900/30 p-4">
            <div className="mb-2 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
              Where the source voltage is going
            </div>
            {[
              { l: 'Supply side', v: d.supply, limit: 0.5 },
              { l: 'The lamp itself', v: d.load, limit: Infinity },
              { l: 'Ground side', v: d.ground, limit: 0.2 },
            ].map((row) => {
              const over = row.v > row.limit
              const pct = Math.min(100, (row.v / 12.6) * 100)
              return (
                <div key={row.l} className="mb-2 last:mb-0">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[12.5px] text-shop-300">{row.l}</span>
                    <span className={`tnum font-mono text-[13px] ${over ? 'text-danger' : 'text-torque'}`}>
                      {row.v.toFixed(2)} V
                      {Number.isFinite(row.limit) && (
                        <span className="text-shop-500"> / {row.limit.toFixed(1)} max</span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-shop-800">
                    <div
                      className={`h-full rounded-full ${over ? 'bg-danger' : 'bg-torque'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
            <div className="mt-3 flex items-center justify-between border-t border-shop-800 pt-2">
              <span className="text-[12.5px] text-shop-400">Circuit current</span>
              <span className="tnum font-mono text-[13px] text-amber-caution">
                {solution.current.toFixed(2)} A
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- verdict */}
      {mode === 'explore' ? (
        <div className="mt-4">
          <Callout kind="tip">
            <span className="font-semibold text-shop-100">{fault.name}. </span>
            {fault.teaching}
          </Callout>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-shop-800 bg-shop-900/30 p-4">
          <div className="mb-2 font-mono text-[10px] tracking-widest text-amber-caution uppercase">
            {guess === null ? 'Name the fault' : 'Result'}
          </div>
          {guess === null ? (
            <div className="grid gap-1.5 sm:grid-cols-2">
              {FAULTS.filter((f) => f.id !== 'none').map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGuess(f.id)}
                  className="rounded border border-shop-700 bg-shop-850 px-3 py-2 text-left text-[13px] text-shop-200 transition-colors hover:border-amber-caution/50 hover:bg-shop-800"
                >
                  {f.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="fade-up">
              <div
                className={`rounded-lg border p-3 ${
                  guess === hidden ? 'border-safe/45 bg-safe/[0.07]' : 'border-danger/45 bg-danger/[0.07]'
                }`}
              >
                <div
                  className={`font-mono text-[10px] font-bold tracking-widest uppercase ${
                    guess === hidden ? 'text-safe' : 'text-danger'
                  }`}
                >
                  {guess === hidden ? '✓ that is the one' : '✕ not that one'}
                </div>
                <p className="mt-1 text-[13.5px] text-shop-200">
                  It was <span className="font-semibold">{fault.name}</span>
                  {guess !== hidden && <> — you called it {faultById(guess).name}</>}.
                </p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-shop-300">{fault.teaching}</p>
              <button
                onClick={newCase}
                className="mt-3 rounded bg-amber-caution px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
              >
                Next fault →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------- reference */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-5">
          <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
            Voltage drop limits
          </h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-shop-400">
            Measured with the circuit switched on and carrying its normal current. Anything above these and the
            joint is eating energy the load was supposed to get.
          </p>
          <div className="mt-3 divide-y divide-shop-800">
            {DROP_LIMITS.map((l) => (
              <div key={l.what} className="flex items-baseline justify-between gap-3 py-2">
                <span className="text-[12.5px] text-shop-300">{l.what}</span>
                <span className="tnum shrink-0 font-mono text-[13px] font-semibold text-torque">{l.limit}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Chip tone="torque">source {12.6} V</Chip>
            <Chip>lamp ≈ 2 Ω</Chip>
            <Chip>≈ 6 A</Chip>
          </div>
        </div>

        <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-5">
          <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
            Five things about the meter
          </h3>
          <div className="mt-3 space-y-3">
            {METER_LESSONS.map((l) => (
              <div key={l.title}>
                <div className="text-[13px] font-semibold text-shop-100">{l.title}</div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-shop-400">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <SpecNotice />
      </div>
    </div>
  )
}
