/**
 * The tool kit.
 *
 * The first real barrier to working on your own car is not skill, it is not
 * knowing what to buy. Read these sixteen procedures end to end and the tool
 * lists come to 187 entries written 153 different ways, which looks like a
 * trade career's worth of equipment and is actually 93 things — of which 66
 * are kit, and only 57 can ever stop you starting a job.
 *
 * So this page answers one question honestly: given that you will buy these
 * one at a time, which one next opens up the most work. Everything on it is
 * computed from the procedures' own tool lists. There are no prices, because
 * prices vary by country, brand and year far too much to publish and a made-up
 * price is worse than none.
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PROCEDURES, procById } from '../data/procedures'
import { prepFor } from '../data/prep'
import { CANON, KIT_KIND, TOOL_LIST_NOTE, canonById, isGating, type CanonTool, type KitKind } from '../data/toolkit'
import {
  FLOOR,
  GATING_TOOLS,
  KIT_TOOLS,
  LADDER,
  SINGLE_JOB,
  jobsUnlocked,
  missingFor,
  purchasesFor,
  toolsOf,
  usedBy,
} from '../lib/kit'
import { TOOL_CATEGORY, type ToolCategory } from '../lib/types'
import { useStore } from '../lib/store'
import { Chip, SectionTitle, SpecNotice } from '../components/ui'

/* ------------------------------------------------------------------ atoms */

function ToolTick({ id }: { id: string }) {
  // A boolean selector: `s.ownedTools.filter(...)` would hand zustand a new
  // array every render and spin React until it gave up.
  const owned = useStore((s) => s.ownedTools.includes(id))
  const toggle = useStore((s) => s.toggleTool)
  const t = canonById(id)!
  const n = usedBy(id).length

  return (
    <button
      onClick={() => toggle(id)}
      aria-pressed={owned}
      className={`flex w-full items-start gap-2.5 rounded border px-2.5 py-2 text-left transition-colors ${
        owned
          ? 'border-safe/45 bg-safe/[0.07]'
          : 'border-shop-800 bg-shop-900/40 hover:border-shop-600 hover:bg-shop-850'
      }`}
    >
      <span
        className={`mt-[2px] grid h-[17px] w-[17px] shrink-0 place-items-center rounded-[3px] border-2 ${
          owned ? 'border-safe bg-safe text-shop-950' : 'border-shop-600'
        }`}
      >
        {owned && (
          <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
            <path d="M1.5 6.5 4.5 9.5 10.5 2.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[13px] leading-snug ${owned ? 'text-shop-200' : 'text-shop-100'}`}>
          {t.name}
          {!isGating(t) && (
            <span className="ml-1.5 font-mono text-[9.5px] tracking-wider text-shop-600 uppercase">improvise</span>
          )}
        </span>
        <span className="block text-[11.5px] leading-snug text-shop-500">{t.detail}</span>
      </span>
      <span className="tnum shrink-0 font-mono text-[11px] text-shop-500">{n}</span>
    </button>
  )
}

/** Cumulative jobs against purchases — the shape of building a kit. */
function LadderCurve({ owned }: { owned: number }) {
  const W = 640
  const H = 150
  const PAD = 30
  const n = LADDER.length
  const x = (i: number) => PAD + ((W - PAD - 8) * i) / n
  const y = (j: number) => H - 22 - ((H - 42) * j) / PROCEDURES.length

  // A step path, because a job becomes possible on one specific purchase and
  // not gradually across the two either side of it.
  let d = `M ${x(0)} ${y(0)}`
  for (const s of LADDER) d += ` L ${x(s.index - 1)} ${y(s.cumulative)} L ${x(s.index)} ${y(s.cumulative)}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Jobs unlocked against tools bought">
      {[0, 4, 8, 12, 16].map((j) => (
        <g key={j}>
          <line x1={PAD} y1={y(j)} x2={W - 8} y2={y(j)} stroke="#252a32" strokeWidth="1" />
          <text x={PAD - 6} y={y(j) + 3.5} textAnchor="end" fill="#4b545f" fontSize="9" fontFamily="monospace">
            {j}
          </text>
        </g>
      ))}
      <path d={d} fill="none" stroke="#ffb000" strokeWidth="2" strokeLinejoin="round" />
      {LADDER.filter((s) => s.unlocks.length > 0).map((s) => (
        <circle key={s.index} cx={x(s.index)} cy={y(s.cumulative)} r="3" fill="#ffb000" />
      ))}
      {owned > 0 && (
        <line x1={x(owned)} y1={14} x2={x(owned)} y2={H - 22} stroke="#35e0c8" strokeWidth="1.5" strokeDasharray="3 3" />
      )}
      <text x={PAD} y={H - 6} fill="#4b545f" fontSize="9" fontFamily="monospace">
        tools bought →
      </text>
      <text x={W - 8} y={H - 6} textAnchor="end" fill="#4b545f" fontSize="9" fontFamily="monospace">
        {n}
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------- page */

export function Kit() {
  const ownedTools = useStore((s) => s.ownedTools)
  const setOwnedTools = useStore((s) => s.setOwnedTools)

  const owned = useMemo(() => new Set(ownedTools), [ownedTools])
  const ready = useMemo(() => new Set(jobsUnlocked(owned)), [owned])

  const byCat = useMemo(() => {
    const cats = [...new Set(KIT_TOOLS.map((t) => t.category))] as ToolCategory[]
    return cats.map((c) => ({ cat: c, tools: KIT_TOOLS.filter((t) => t.category === c) }))
  }, [])

  const ownedKitCount = KIT_TOOLS.filter((t) => owned.has(t.id)).length
  const firstEight = purchasesFor(8)
  const firstFour = purchasesFor(4)

  /* Jobs sorted by how close you are to being able to do them. */
  const jobs = useMemo(
    () =>
      PROCEDURES.map((p) => ({ p, missing: missingFor(p.id, owned) })).sort(
        (a, b) => a.missing.length - b.missing.length || a.p.difficulty - b.p.difficulty,
      ),
    [owned],
  )

  const kinds: KitKind[] = ['hire', 'consumable', 'part']

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-5">
      <div className="max-w-[78ch]">
        <h1 className="text-[26px] font-bold tracking-tight sm:text-[30px]">The tool kit</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-shop-300">
          The first barrier to working on your own car is not skill. It is not knowing what to buy, and being
          quietly certain it is more than you can afford. Read the sixteen procedures here end to end and their
          tool lists come to <strong className="text-shop-100">187 entries written 153 different ways</strong> —
          which looks like a trade career's worth of equipment.
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-shop-300">
          It is {CANON.length} things, {KIT_TOOLS.length} of which are the ones you keep, and only{' '}
          {GATING_TOOLS.length} of those can ever stop you starting a job. The clearest case is torque wrenches:
          eleven different strings appear across these procedures, from{' '}
          <span className="font-mono text-[13px] text-shop-200">5–25 N·m</span> to{' '}
          <span className="font-mono text-[13px] text-shop-200">60–300 N·m</span>. That is not eleven wrenches.{' '}
          <strong className="text-shop-100">It is three</strong>, and every torque figure in this platform falls
          inside one of them.
        </p>
      </div>

      {/* The number nothing else on the platform tells you. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { n: FLOOR, label: 'purchases before the first job is possible', tone: 'text-amber-caution' },
          { n: purchasesFor(8), label: `purchases to reach eight of the ${PROCEDURES.length}`, tone: 'text-torque' },
          { n: purchasesFor(PROCEDURES.length), label: 'purchases to reach all sixteen', tone: 'text-shop-100' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-shop-800 bg-shop-900/40 px-4 py-3">
            <div className={`tnum font-mono text-[30px] leading-none font-bold ${s.tone}`}>{s.n}</div>
            <div className="mt-1.5 text-[12.5px] leading-snug text-shop-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* --------------------------------------------------- buying order */}
      <div className="mt-10">
        <SectionTitle sub="Greedy ordering: buy next whatever finishes the most jobs, and while nothing finishes a job yet, whatever the most jobs are waiting on. The jumps are where a job becomes possible.">
          What to buy first
        </SectionTitle>

        <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <div className="min-w-0 rounded-xl border border-shop-800 bg-shop-900/30 p-4">
            <LadderCurve owned={ownedKitCount} />
            <p className="mt-1 text-[12px] leading-relaxed text-shop-400">
              The curve is flat for the first {FLOOR - 1} purchases because you cannot half-do a job — an oil
              change needs everything an oil change needs. <strong className="text-shop-200">That floor is the
              real entry cost of working on your own car</strong>, and it is higher than it feels standing in a
              shop holding one socket set. After it, jobs arrive quickly: {firstFour} purchases reach four,{' '}
              {firstEight} reach eight, and the last {LADDER.length - purchasesFor(PROCEDURES.length)} things on
              the list block nothing at all.
            </p>
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-shop-800">
            <div className="max-h-[320px] overflow-y-auto">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {LADDER.map((s) => {
                    const isOwned = owned.has(s.tool.id)
                    return (
                      <tr
                        key={s.tool.id}
                        className={`border-b border-shop-850 last:border-0 ${
                          s.unlocks.length > 0 ? 'bg-amber-caution/[0.06]' : ''
                        }`}
                      >
                        <td className="tnum w-8 px-2 py-1.5 align-top font-mono text-[11px] text-shop-600">
                          {s.index}
                        </td>
                        <td className="px-1 py-1.5 align-top">
                          <span className={`text-[12.5px] ${isOwned ? 'text-safe' : 'text-shop-200'}`}>
                            {isOwned && '✓ '}
                            {s.tool.name}
                          </span>
                          {s.unlocks.length > 0 && (
                            <span className="block text-[11px] text-amber-caution">
                              unlocks {s.unlocks.map((id) => procById(id)?.title).join(', ')}
                            </span>
                          )}
                        </td>
                        <td className="tnum w-12 px-2 py-1.5 text-right align-top font-mono text-[11.5px] text-shop-500">
                          {s.cumulative}/16
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- what you own */}
      <div className="mt-12">
        <SectionTitle sub="Tick what is already in your garage. The number beside each tool is how many of the sixteen procedures call for it.">
          What you already have
        </SectionTitle>

        <div className="mb-4 flex flex-wrap items-center gap-2.5 rounded-lg border border-shop-800 bg-shop-900/40 px-4 py-3">
          <span className="text-[14px] text-shop-200">
            <strong className="font-mono text-[18px] text-amber-caution">{ready.size}</strong> of{' '}
            {PROCEDURES.length} jobs you can start today
          </span>
          <span className="text-[12.5px] text-shop-500">
            · {ownedKitCount}/{KIT_TOOLS.length} kit tools ticked
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            {[10, 20, 30].map((n) => (
              <button
                key={n}
                onClick={() => setOwnedTools(LADDER.slice(0, n).map((s) => s.tool.id))}
                className="rounded border border-shop-700 px-2.5 py-1 font-mono text-[10.5px] tracking-wider text-shop-400 uppercase transition-colors hover:border-amber-caution/50 hover:text-amber-caution"
              >
                first {n}
              </button>
            ))}
            <button
              onClick={() => setOwnedTools([])}
              className="rounded border border-shop-700 px-2.5 py-1 font-mono text-[10.5px] tracking-wider text-shop-500 uppercase transition-colors hover:border-danger/50 hover:text-danger"
            >
              clear
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {byCat.map((g) => (
            <div key={g.cat} className="min-w-0">
              <p className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                {TOOL_CATEGORY[g.cat].label}
              </p>
              <div className="space-y-1.5">
                {g.tools.map((t) => (
                  <ToolTick key={t.id} id={t.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- the jobs */}
      <div className="mt-12">
        <SectionTitle sub="Sorted by how close you are. Hire tools and consumables are not counted here — you get those per job, not up front.">
          What that lets you do
        </SectionTitle>
        <div className="grid gap-2.5 lg:grid-cols-2">
          {jobs.map(({ p, missing }) => {
            const prep = prepFor(p.id)
            return (
              <div
                key={p.id}
                className={`rounded-lg border p-3.5 ${
                  missing.length === 0 ? 'border-safe/40 bg-safe/[0.05]' : 'border-shop-800 bg-shop-900/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/procedure/${p.id}`}
                      className="text-[14px] font-semibold text-shop-100 hover:text-amber-caution"
                    >
                      {p.title}
                    </Link>
                    <p className="text-[11.5px] text-shop-500">{p.subtitle}</p>
                  </div>
                  {missing.length === 0 ? (
                    <Chip tone="safe">ready</Chip>
                  ) : (
                    <Chip tone="amber">
                      {missing.length} short
                    </Chip>
                  )}
                </div>

                {missing.length > 0 && (
                  <p className="mt-2 text-[12px] leading-relaxed text-shop-400">
                    Still needs{' '}
                    {missing.map((m, i) => (
                      <span key={m.id}>
                        <span className="text-shop-200">{m.name}</span>
                        {i < missing.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    .
                  </p>
                )}

                {prep && (
                  <p className="mt-2 border-t border-shop-800 pt-2 text-[11.5px] leading-relaxed text-shop-500">
                    <span className="font-mono text-[10px] tracking-widest text-danger uppercase">
                      no substitute
                    </span>{' '}
                    {prep.cannotImprovise.tool}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {toolsOf(p, 'hire').map((t) => (
                    <span
                      key={t.id}
                      className="rounded border border-shop-700 bg-shop-950/60 px-1.5 py-0.5 text-[10.5px] text-shop-400"
                    >
                      hire: {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ---------------------------------------------- the other three kinds */}
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {kinds.map((k) => {
          const list = CANON.filter((t) => t.kind === k && usedBy(t.id).length > 0)
          return (
            <div key={k} className="min-w-0 rounded-xl border border-shop-800 bg-shop-900/30 p-4">
              <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
                {KIT_KIND[k].label} · {list.length}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-shop-400">{KIT_KIND[k].blurb}</p>
              <ul className="mt-3 space-y-1.5">
                {list.map((t) => (
                  <li key={t.id} className="text-[12.5px] leading-snug text-shop-200">
                    {t.name}
                    <span className="text-shop-500"> · {usedBy(t.id).length} job{usedBy(t.id).length === 1 ? '' : 's'}</span>
                    {t.note && <span className="block text-[11.5px] text-shop-500">{t.note}</span>}
                  </li>
                ))}
              </ul>
              {k === 'part' && (
                <p className="mt-3 border-t border-shop-800 pt-2 text-[11.5px] leading-relaxed text-shop-500">
                  {TOOL_LIST_NOTE}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* ------------------------------------------------------- one-job tools */}
      <div className="mt-12">
        <SectionTitle sub="Only one procedure here calls for each of these. That is the shape of a specialty tool: indispensable once, idle for years. Hire where you can and buy where hiring costs more than owning.">
          Used by exactly one job
        </SectionTitle>
        <div className="flex flex-wrap gap-2">
          {SINGLE_JOB.map((t) => {
            const p = procById(usedBy(t.id)[0])
            return (
              <SingleJobChip key={t.id} tool={t} procTitle={p?.title ?? ''} procId={p?.id ?? ''} />
            )
          })}
        </div>
      </div>

      <div className="mt-10 rounded border border-shop-700 bg-shop-900/40 p-4 text-[12.5px] leading-relaxed text-shop-400">
        <strong className="text-shop-200">No prices here, on purpose.</strong> What a socket set costs depends on
        the country you are in, the brand you trust and the year you are reading this, and a number invented to
        fill the column would be worse than no number at all. What the data can answer honestly is the ordering —
        which purchase next opens up the most work — and that answer does not go stale.
      </div>

      <div className="mt-6">
        <SpecNotice />
      </div>
    </div>
  )
}

function SingleJobChip({ tool, procTitle, procId }: { tool: CanonTool; procTitle: string; procId: string }) {
  const owned = useStore((s) => s.ownedTools.includes(tool.id))
  return (
    <Link
      to={`/procedure/${procId}`}
      className={`rounded border px-2.5 py-1.5 text-[12px] transition-colors ${
        owned
          ? 'border-safe/40 bg-safe/[0.06] text-shop-300'
          : 'border-shop-800 bg-shop-900/40 text-shop-300 hover:border-amber-caution/40'
      }`}
    >
      <span className="text-shop-100">{tool.name}</span>
      <span className="ml-1.5 text-shop-500">
        {KIT_KIND[tool.kind].label.toLowerCase()} · {procTitle}
      </span>
    </Link>
  )
}
