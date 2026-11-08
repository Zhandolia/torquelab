import { Link } from 'react-router-dom'
import { procById } from '../data/procedures'
import { vehicleById } from '../data/vehicles'
import { useStore } from '../lib/store'
import { levelStatuses, programProgress, isProcedureDone, type LevelStatus } from '../lib/path'
import { Chip, Difficulty, ProgressRing, SectionTitle, SpecNotice, fmtDuration } from '../components/ui'

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-shop-800">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

function ExamState({ s }: { s: LevelStatus }) {
  if (s.passed) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded border border-safe/40 bg-safe/[0.07] px-3 py-2">
        <span className="font-mono text-[10px] font-bold tracking-widest text-safe uppercase">✓ Passed</span>
        <span className="tnum font-mono text-[12px] text-shop-200">Best {s.best}%</span>
        <span className="text-[11.5px] text-shop-500">
          {s.attempts} attempt{s.attempts === 1 ? '' : 's'}
        </span>
        <Link
          to={`/path/${s.level.id}/exam`}
          className="ml-auto text-[12px] text-shop-400 underline-offset-2 hover:text-amber-caution hover:underline"
        >
          Review / retake
        </Link>
      </div>
    )
  }

  if (!s.previousPassed) {
    return (
      <div className="rounded border border-shop-700 bg-shop-900/50 px-3 py-2 text-[12.5px] text-shop-500">
        🔒 Pass the Level {s.level.index - 1} exam to unlock this assessment. The procedures themselves stay open —
        you can read ahead any time.
      </div>
    )
  }

  if (!s.proceduresComplete) {
    return (
      <div className="rounded border border-shop-700 bg-shop-900/50 px-3 py-2 text-[12.5px] text-shop-400">
        Finish {s.total - s.done} more procedure{s.total - s.done === 1 ? '' : 's'} in this level to unlock the exam.
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded border border-amber-caution/40 bg-amber-caution/[0.07] px-3 py-2">
      <div className="text-[12.5px] text-shop-200">
        {s.attempts > 0 ? (
          <>
            Not passed yet — best <span className="tnum font-mono text-amber-caution">{s.best}%</span>, needs{' '}
            {s.level.passMark}%
          </>
        ) : (
          <>
            {s.level.questions.length} questions · pass mark {s.level.passMark}%
          </>
        )}
      </div>
      <Link
        to={`/path/${s.level.id}/exam`}
        className="ml-auto rounded bg-amber-caution px-3 py-1.5 text-[12.5px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
      >
        {s.attempts > 0 ? 'Retake exam →' : 'Sit the exam →'}
      </Link>
    </div>
  )
}

function Certificate({ statuses }: { statuses: LevelStatus[] }) {
  const name = useStore((st) => st.learnerName)
  const setName = useStore((st) => st.setLearnerName)
  const finished = Math.max(...statuses.map((s) => s.result?.passedAt ?? 0))

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-safe/40 bg-gradient-to-br from-safe/[0.1] to-transparent">
      <div className="p-6">
        <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-safe uppercase">
          Program complete
        </div>
        <h2 className="mt-2 text-[clamp(22px,3vw,30px)] leading-tight font-bold">
          All four levels passed
        </h2>
        <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-shop-300">
          You have walked every procedure in the library and passed every assessment. This is a record of study on
          a training platform, not a trade qualification — but the reasoning behind it is the same reasoning an
          ASE area exam is testing.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-[12px] text-shop-400" htmlFor="learner">
            Name on the record
          </label>
          <input
            id="learner"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-[220px] rounded border border-shop-700 bg-shop-900 px-3 py-1.5 text-[13px] text-shop-100 outline-none placeholder:text-shop-600 focus:border-safe/60"
          />
          <button
            onClick={() => window.print()}
            className="rounded border border-shop-600 px-3 py-1.5 text-[12.5px] text-shop-200 transition-colors hover:bg-shop-850"
          >
            Print record
          </button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {statuses.map((s) => (
            <div key={s.level.id} className="rounded border border-shop-800 bg-shop-950/50 px-3 py-2">
              <div className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                Level {s.level.index} · {s.level.ase}
              </div>
              <div className="text-[13px] text-shop-100">{s.level.title}</div>
              <div className="tnum font-mono text-[13px] font-bold text-safe">{s.best}%</div>
            </div>
          ))}
        </div>

        {finished > 0 && (
          <div className="mt-3 font-mono text-[11px] text-shop-500">
            Completed {new Date(finished).toLocaleDateString()}
            {name ? ` · ${name}` : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export function Path() {
  const progress = useStore((s) => s.progress)
  const exams = useStore((s) => s.exams)
  const statuses = levelStatuses(progress, exams)
  const prog = programProgress(statuses)

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8">
      <SectionTitle sub="Four levels, ordered by consequence rather than by system. You start where a mistake costs an afternoon and finish where a mistake costs a cylinder head.">
        The learning path
      </SectionTitle>

      {/* ------------------------------------------------------------ summary */}
      <div className="mb-8 flex flex-wrap items-center gap-5 rounded-xl border border-shop-800 bg-shop-900/30 p-5">
        <div className="relative">
          <ProgressRing pct={prog.pct} size={64} />
          <span className="tnum absolute inset-0 grid place-items-center font-mono text-[13px] font-bold">
            {prog.pct}%
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-shop-100">
            {prog.complete ? 'Program complete' : `Level ${statuses.find((s) => !s.passed)?.level.index ?? 4} in progress`}
          </div>
          <div className="mt-0.5 text-[12.5px] text-shop-400">
            {prog.procDoneCount} of {prog.procTotal} procedures finished · {prog.examsPassed} of {prog.examTotal}{' '}
            exams passed
          </div>
        </div>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <div
              key={s.level.id}
              title={`Level ${s.level.index}: ${s.level.title}`}
              className={`grid h-8 w-8 place-items-center rounded-full border font-mono text-[12px] font-bold ${
                s.passed
                  ? 'border-safe bg-safe/20 text-safe'
                  : s.examUnlocked
                    ? 'border-amber-caution text-amber-caution'
                    : 'border-shop-700 text-shop-600'
              }`}
            >
              {s.passed ? '✓' : s.level.index}
            </div>
          ))}
        </div>
      </div>

      {prog.complete && <Certificate statuses={statuses} />}

      {/* ------------------------------------------------------------- levels */}
      <div className="relative space-y-4">
        {/* connector spine */}
        <div className="absolute top-6 bottom-6 left-[19px] hidden w-px bg-shop-800 sm:block" aria-hidden />

        {statuses.map((s) => {
          const locked = !s.previousPassed
          return (
            <section
              key={s.level.id}
              className={`relative rounded-xl border bg-shop-900/30 transition-colors ${
                s.passed
                  ? 'border-safe/35'
                  : locked
                    ? 'border-shop-800/70'
                    : 'border-shop-700'
              }`}
            >
              <div className="flex items-start gap-4 p-5">
                <div
                  className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 font-mono text-[15px] font-bold"
                  style={{
                    borderColor: s.passed ? '#4ade80' : locked ? '#252a32' : s.level.accent,
                    color: s.passed ? '#4ade80' : locked ? '#4b545f' : s.level.accent,
                    background: '#0d0f12',
                  }}
                >
                  {s.passed ? '✓' : s.level.index}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className={`text-[17px] font-semibold ${locked ? 'text-shop-400' : 'text-shop-100'}`}>
                      {s.level.title}
                    </h2>
                    <span className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                      {s.level.ase}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-shop-500">{s.level.subtitle}</p>

                  <p className="mt-3 max-w-[70ch] text-[13px] leading-relaxed text-shop-300">
                    <span className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                      By the end:{' '}
                    </span>
                    {s.level.outcome}
                  </p>

                  {/* procedures */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                        {s.done}/{s.total} procedures
                      </span>
                      <div className="max-w-[220px] flex-1">
                        <Bar pct={s.procPct} color={s.passed ? '#4ade80' : s.level.accent} />
                      </div>
                    </div>

                    <ul className="divide-y divide-shop-800 overflow-hidden rounded-lg border border-shop-800">
                      {s.level.procedureIds.map((pid) => {
                        const proc = procById(pid)
                        if (!proc) return null
                        const v = vehicleById(proc.primaryVehicleId)
                        const done = isProcedureDone(progress, pid)
                        const started = !!progress[pid]
                        return (
                          <li key={pid}>
                            <Link
                              to={`/procedure/${pid}`}
                              className="flex items-center gap-3 bg-shop-900/20 px-3 py-2.5 transition-colors hover:bg-shop-850"
                            >
                              <span
                                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] ${
                                  done
                                    ? 'border-safe bg-safe/20 text-safe'
                                    : started
                                      ? 'border-amber-caution text-amber-caution'
                                      : 'border-shop-600 text-shop-600'
                                }`}
                              >
                                {done ? '✓' : started ? '•' : ''}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-[13.5px] text-shop-100">{proc.title}</div>
                                <div className="truncate text-[11.5px] text-shop-500">
                                  {v ? `${v.year} ${v.make} ${v.model}` : ''} · {proc.steps.length} steps ·{' '}
                                  {fmtDuration(proc.timeMin)}
                                </div>
                              </div>
                              <div className="hidden shrink-0 sm:block">
                                <Difficulty level={proc.difficulty} />
                              </div>
                              <span className="shrink-0 text-shop-600">→</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                        Level assessment
                      </span>
                      <Chip>{s.level.questions.length} questions</Chip>
                      <Chip>pass {s.level.passMark}%</Chip>
                    </div>
                    <ExamState s={s} />
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-8">
        <SpecNotice />
      </div>
    </div>
  )
}
