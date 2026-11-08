import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROCEDURES } from '../data/procedures'
import { VEHICLES, vehicleById } from '../data/vehicles'
import { SYSTEMS, type SystemId } from '../lib/types'
import { useStore } from '../lib/store'
import { checkpointOptions, levelStatuses, programProgress } from '../lib/path'
import { bayProgress, caseStatuses, money } from '../lib/diagnose'
import { Chip, Difficulty, fmtDuration, ProgressRing, SectionTitle, SpecNotice } from '../components/ui'

type Sort = 'suggested' | 'easiest' | 'hardest' | 'shortest'

export function Library() {
  const [system, setSystem] = useState<SystemId | 'all'>('all')
  const [vehicle, setVehicle] = useState<string>('all')
  const [sort, setSort] = useState<Sort>('suggested')
  const [q, setQ] = useState('')
  const progress = useStore((s) => s.progress)

  const systems = [...new Set(PROCEDURES.map((p) => p.system))] as SystemId[]

  const list = useMemo(() => {
    let out = PROCEDURES.filter((p) => {
      if (system !== 'all' && p.system !== system) return false
      if (vehicle !== 'all' && p.primaryVehicleId !== vehicle && !p.alsoApplies?.includes(vehicle)) return false
      if (q) {
        const hay = `${p.title} ${p.subtitle} ${p.summary} ${p.objectives.join(' ')}`.toLowerCase()
        if (!hay.includes(q.toLowerCase())) return false
      }
      return true
    })
    if (sort === 'easiest') out = [...out].sort((a, b) => a.difficulty - b.difficulty)
    if (sort === 'hardest') out = [...out].sort((a, b) => b.difficulty - a.difficulty)
    if (sort === 'shortest') out = [...out].sort((a, b) => a.timeMin - b.timeMin)
    return out
  }, [system, vehicle, sort, q])

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8">
      <SectionTitle sub="Every procedure runs the same way: a 3D assembly you control, steps that isolate the parts they touch, and specs where you need them.">
        Procedure library
      </SectionTitle>

      {/* --------------------------------------------------------------- filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search procedures…"
          className="w-[200px] rounded border border-shop-700 bg-shop-900 px-3 py-1.5 text-[13px] text-shop-100 outline-none placeholder:text-shop-600 focus:border-amber-caution/60"
        />

        <select
          value={system}
          onChange={(e) => setSystem(e.target.value as SystemId | 'all')}
          className="rounded border border-shop-700 bg-shop-900 px-2.5 py-1.5 text-[13px] text-shop-200 outline-none focus:border-amber-caution/60"
        >
          <option value="all">All systems</option>
          {systems.map((s) => (
            <option key={s} value={s}>
              {SYSTEMS[s].label}
            </option>
          ))}
        </select>

        <select
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          className="rounded border border-shop-700 bg-shop-900 px-2.5 py-1.5 text-[13px] text-shop-200 outline-none focus:border-amber-caution/60"
        >
          <option value="all">All vehicles</option>
          {VEHICLES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.year} {v.make} {v.model}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded border border-shop-700 bg-shop-900 px-2.5 py-1.5 text-[13px] text-shop-200 outline-none focus:border-amber-caution/60"
        >
          <option value="suggested">Suggested order</option>
          <option value="easiest">Easiest first</option>
          <option value="hardest">Hardest first</option>
          <option value="shortest">Shortest first</option>
        </select>

        <span className="ml-auto font-mono text-[11px] text-shop-500">{list.length} results</span>
      </div>

      {/* ----------------------------------------------------------------- cards */}
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const v = vehicleById(p.primaryVehicleId)!
          const pr = progress[p.id]
          const pct = pr ? Math.round((pr.steps.length / p.steps.length) * 100) : 0
          return (
            <Link
              key={p.id}
              to={`/procedure/${p.id}`}
              className="group flex flex-col rounded-xl border border-shop-800 bg-shop-900/30 p-4 transition-colors hover:border-amber-caution/40 hover:bg-shop-850/60"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] tracking-widest text-amber-caution uppercase">
                    {SYSTEMS[p.system].label}
                  </div>
                  <h3 className="mt-0.5 text-[15px] leading-snug font-semibold text-shop-100">{p.title}</h3>
                  <p className="text-[12px] text-shop-500">{p.subtitle}</p>
                </div>
                {pct > 0 && (
                  <div className="relative shrink-0">
                    <ProgressRing pct={pct} size={36} />
                    <span className="tnum absolute inset-0 grid place-items-center font-mono text-[9px] text-shop-300">
                      {pct}
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-3 line-clamp-3 flex-1 text-[12.5px] leading-relaxed text-shop-400">{p.summary}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-shop-800 pt-3">
                <Chip>{v.year} {v.make} {v.model}</Chip>
                <Difficulty level={p.difficulty} />
                <span className="ml-auto font-mono text-[11px] text-shop-500">
                  {p.steps.length} steps · {fmtDuration(p.timeMin)}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {list.length === 0 && (
        <div className="rounded-lg border border-dashed border-shop-700 py-14 text-center text-[13px] text-shop-500">
          Nothing matches that. Try clearing a filter.
        </div>
      )}

      <div className="mt-8">
        <SpecNotice />
      </div>
    </div>
  )
}

export function Bench() {
  const progress = useStore((s) => s.progress)
  const bookmarks = useStore((s) => s.bookmarks)
  const exams = useStore((s) => s.exams)
  const diagnostics = useStore((s) => s.diagnostics)
  const statuses = levelStatuses(progress, exams)
  const prog = programProgress(statuses)
  const cases = caseStatuses(diagnostics)
  const bay = bayProgress(cases)

  const started = PROCEDURES.filter((p) => progress[p.id] && !progress[p.id].completedAt)
  const done = PROCEDURES.filter((p) => progress[p.id]?.completedAt)
  const saved = PROCEDURES.filter((p) => bookmarks.includes(p.id))

  const quizTotal = PROCEDURES.reduce((n, p) => n + p.checkpoints.length, 0)
  const quizRight = PROCEDURES.reduce((n, p) => {
    const q = progress[p.id]?.quiz ?? {}
    return (
      n +
      p.checkpoints.filter((c) => {
        const picked = q[c.id]
        return picked !== undefined && checkpointOptions(c)[picked]?.correct
      }).length
    )
  }, 0)

  const Row = ({ ids, empty }: { ids: typeof PROCEDURES; empty: string }) =>
    ids.length === 0 ? (
      <div className="rounded-lg border border-dashed border-shop-800 px-4 py-8 text-center text-[12.5px] text-shop-600">
        {empty}
      </div>
    ) : (
      <div className="divide-y divide-shop-800 overflow-hidden rounded-lg border border-shop-800">
        {ids.map((p) => {
          const pr = progress[p.id]
          const pct = pr ? Math.round((pr.steps.length / p.steps.length) * 100) : 0
          return (
            <Link
              key={p.id}
              to={`/procedure/${p.id}`}
              className="flex items-center gap-4 bg-shop-900/20 px-4 py-3 transition-colors hover:bg-shop-850"
            >
              <ProgressRing pct={pct} size={30} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-shop-100">{p.title}</div>
                <div className="text-[11.5px] text-shop-500">
                  {pr ? `${pr.steps.length}/${p.steps.length} steps` : `${p.steps.length} steps`} ·{' '}
                  {SYSTEMS[p.system].label}
                </div>
              </div>
              <span className="text-shop-600">→</span>
            </Link>
          )
        })}
      </div>
    )

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8">
      <SectionTitle sub="Progress is kept in this browser only — nothing leaves your machine.">
        My bench
      </SectionTitle>

      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { n: String(done.length), l: 'Procedures finished' },
          { n: String(started.length), l: 'In progress' },
          { n: `${quizRight}/${quizTotal}`, l: 'Checkpoints correct' },
          { n: `${prog.examsPassed}/${prog.examTotal}`, l: 'Level exams passed' },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-shop-800 bg-shop-900/40 px-4 py-3">
            <div className="tnum font-mono text-[20px] leading-none font-bold text-amber-caution">{s.n}</div>
            <div className="mt-1 text-[11.5px] text-shop-400">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------ level standing */}
      <Link
        to="/path"
        className="mb-8 block rounded-lg border border-shop-800 bg-shop-900/30 p-4 transition-colors hover:border-shop-600 hover:bg-shop-850/50"
      >
        <div className="mb-3 flex items-center gap-3">
          <ProgressRing pct={prog.pct} size={34} />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-medium text-shop-100">
              {prog.complete ? 'Learning path complete' : 'Learning path'}
            </div>
            <div className="text-[11.5px] text-shop-500">
              {prog.pct}% overall · {prog.procDoneCount}/{prog.procTotal} procedures,{' '}
              {prog.examsPassed}/{prog.examTotal} exams
            </div>
          </div>
          <span className="text-[12px] text-amber-caution">Open →</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          {statuses.map((s) => (
            <div key={s.level.id} className="rounded border border-shop-800 bg-shop-950/40 px-2.5 py-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full border font-mono text-[9px] ${
                    s.passed ? 'border-safe text-safe' : 'border-shop-600 text-shop-500'
                  }`}
                >
                  {s.passed ? '✓' : s.level.index}
                </span>
                <span className="truncate text-[11.5px] text-shop-300">{s.level.title}</span>
              </div>
              <div className="mt-1 text-[10.5px] text-shop-500">
                {s.done}/{s.total} done
                {s.attempts > 0 && <span className="tnum"> · best {s.best}%</span>}
              </div>
            </div>
          ))}
        </div>
      </Link>

      {/* --------------------------------------------------- diagnostic bay */}
      <Link
        to="/diagnose"
        className="mb-8 block rounded-lg border border-shop-800 bg-shop-900/30 p-4 transition-colors hover:border-shop-600 hover:bg-shop-850/50"
      >
        <div className="mb-3 flex items-center gap-3">
          <ProgressRing pct={bay.pct} size={34} />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-medium text-shop-100">
              {bay.complete ? 'Diagnostic bay cleared' : 'Diagnostic bay'}
            </div>
            <div className="text-[11.5px] text-shop-500">
              {bay.solved}/{bay.total} cases solved · {bay.clean} of them clean
            </div>
          </div>
          <span className="text-[12px] text-amber-caution">Open →</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {cases.map((s) => (
            <div key={s.c.id} className="rounded border border-shop-800 bg-shop-950/40 px-2.5 py-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full border font-mono text-[9px] ${
                    s.clean
                      ? 'border-safe text-safe'
                      : s.solved
                        ? 'border-torque text-torque'
                        : 'border-shop-600 text-shop-500'
                  }`}
                >
                  {s.solved ? '✓' : '?'}
                </span>
                <span className="truncate text-[11.5px] text-shop-300">{s.c.title}</span>
              </div>
              <div className="mt-1 text-[10.5px] text-shop-500">
                {s.solved && s.bestMin !== undefined ? (
                  <span className="tnum">
                    best {fmtDuration(s.bestMin)} · {money(s.bestParts ?? 0)} wasted
                  </span>
                ) : (
                  <span className="tnum">book {fmtDuration(s.book)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Link>

      <div className="space-y-8">
        <div>
          <SectionTitle>In progress</SectionTitle>
          <Row ids={started} empty="Nothing on the bench. Pick a procedure and it will show up here." />
        </div>
        <div>
          <SectionTitle>Saved for later</SectionTitle>
          <Row ids={saved} empty="Star a procedure while you are in it to save it here." />
        </div>
        <div>
          <SectionTitle>Finished</SectionTitle>
          <Row ids={done} empty="Nothing finished yet." />
        </div>
      </div>
    </div>
  )
}
