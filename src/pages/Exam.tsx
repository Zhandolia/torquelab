import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { levelById } from '../data/curriculum'
import { procById } from '../data/procedures'
import { useStore } from '../lib/store'
import { examOptions, levelStatuses, scoreExam } from '../lib/path'
import { Chip, ProgressRing, SpecNotice } from '../components/ui'

type Phase = 'intro' | 'sitting' | 'results'

export function Exam() {
  const { levelId = '' } = useParams()
  const level = levelById(levelId)

  const progress = useStore((s) => s.progress)
  const exams = useStore((s) => s.exams)
  const submitExam = useStore((s) => s.submitExam)

  const [phase, setPhase] = useState<Phase>('intro')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [idx, setIdx] = useState(0)

  const status = useMemo(
    () => levelStatuses(progress, exams).find((s) => s.level.id === levelId),
    [progress, exams, levelId],
  )

  useEffect(() => {
    setPhase('intro')
    setAnswers({})
    setIdx(0)
  }, [levelId])

  if (!level || !status) {
    return (
      <div className="p-10 text-center text-shop-400">
        Unknown level.{' '}
        <Link to="/path" className="text-amber-caution underline">
          Back to the learning path
        </Link>
      </div>
    )
  }

  const q = level.questions[idx]
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === level.questions.length
  const result = scoreExam(level, answers)
  const prior = exams[level.id]

  /* ------------------------------------------------------------- gate */
  if (!status.examUnlocked && phase === 'intro' && !status.passed) {
    return (
      <div className="mx-auto max-w-[760px] px-5 py-10">
        <Link to="/path" className="text-[12px] text-shop-500 transition-colors hover:text-amber-caution">
          ← Learning path
        </Link>
        <div className="mt-4 rounded-xl border border-shop-700 bg-shop-900/40 p-6">
          <div className="font-mono text-[11px] tracking-widest text-shop-500 uppercase">
            Level {level.index} · {level.ase}
          </div>
          <h1 className="mt-1 text-[22px] font-bold">{level.title} — assessment locked</h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-shop-300">
            {!status.previousPassed
              ? `Pass the Level ${level.index - 1} exam first. The path is ordered deliberately — this assessment assumes you already have what the earlier levels teach.`
              : `Finish all ${status.total} procedures in this level first. You have completed ${status.done}.`}
          </p>
          <Link
            to="/path"
            className="mt-4 inline-block rounded bg-shop-800 px-4 py-2 text-[13px] font-medium text-shop-100 transition-colors hover:bg-shop-700"
          >
            Back to the path
          </Link>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------ intro */
  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-[760px] px-5 py-10">
        <Link to="/path" className="text-[12px] text-shop-500 transition-colors hover:text-amber-caution">
          ← Learning path
        </Link>

        <div className="mt-4 rounded-xl border border-shop-700 bg-shop-900/40 p-6">
          <div className="font-mono text-[11px] tracking-widest uppercase" style={{ color: level.accent }}>
            Level {level.index} assessment · {level.ase}
          </div>
          <h1 className="mt-1 text-[clamp(22px,3vw,30px)] font-bold">{level.title}</h1>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>{level.questions.length} questions</Chip>
            <Chip tone="amber">pass mark {level.passMark}%</Chip>
            <Chip>unlimited retakes</Chip>
            <Chip>no time limit</Chip>
          </div>

          <p className="mt-4 text-[13.5px] leading-relaxed text-shop-300">
            Questions draw across every procedure in this level and test the reasoning rather than the numbers —
            why a fastener has the spec it has, what a symptom points at, what order things come apart in. You get
            a full explanation for every option after you submit, including the ones you did not pick.
          </p>

          {prior && (
            <div className="mt-4 rounded border border-shop-700 bg-shop-950/50 px-3 py-2 text-[12.5px] text-shop-300">
              Previous attempts: <span className="tnum font-mono">{prior.attempts}</span> · best{' '}
              <span className="tnum font-mono text-amber-caution">{prior.best}%</span>
              {prior.passedAt && (
                <span className="text-safe"> · passed {new Date(prior.passedAt).toLocaleDateString()}</span>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setPhase('sitting')}
              className="rounded-md bg-amber-caution px-5 py-2.5 text-[14px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
            >
              Begin assessment →
            </button>
            <Link
              to="/path"
              className="rounded-md border border-shop-600 px-5 py-2.5 text-[14px] font-medium text-shop-200 transition-colors hover:bg-shop-850"
            >
              Not yet
            </Link>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
            Drawn from
          </div>
          <ul className="divide-y divide-shop-800 overflow-hidden rounded-lg border border-shop-800">
            {level.procedureIds.map((pid) => {
              const p = procById(pid)
              return p ? (
                <li key={pid} className="bg-shop-900/20 px-3 py-2 text-[13px] text-shop-300">
                  {p.title}
                </li>
              ) : null
            })}
          </ul>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------- results */
  if (phase === 'results') {
    const passed = result.score >= level.passMark
    return (
      <div className="mx-auto max-w-[820px] px-5 py-10">
        <div
          className={`rounded-xl border p-6 ${
            passed ? 'border-safe/45 bg-safe/[0.07]' : 'border-danger/45 bg-danger/[0.06]'
          }`}
        >
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative">
              <ProgressRing pct={result.score} size={72} />
              <span className="tnum absolute inset-0 grid place-items-center font-mono text-[15px] font-bold">
                {result.score}%
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={`font-mono text-[11px] font-bold tracking-widest uppercase ${
                  passed ? 'text-safe' : 'text-danger'
                }`}
              >
                {passed ? '✓ Passed' : 'Not passed'}
              </div>
              <h1 className="mt-1 text-[20px] font-bold">
                Level {level.index} — {level.title}
              </h1>
              <p className="mt-1 text-[13px] text-shop-300">
                {result.correct} of {result.total} correct. Pass mark is {level.passMark}%.
                {!passed && ' Read the explanations below, then retake it — there is no penalty.'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/path"
              className="rounded bg-shop-800 px-4 py-2 text-[13px] font-medium text-shop-100 transition-colors hover:bg-shop-700"
            >
              Back to the path
            </Link>
            <button
              onClick={() => {
                setAnswers({})
                setIdx(0)
                setPhase('sitting')
              }}
              className="rounded border border-shop-600 px-4 py-2 text-[13px] text-shop-200 transition-colors hover:bg-shop-850"
            >
              Retake now
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {level.questions.map((qq, i) => {
            const picked = answers[qq.id]
            const opts = examOptions(qq)
            const correctIdx = opts.findIndex((o) => o.correct)
            const right = picked === correctIdx
            return (
              <div
                key={qq.id}
                className={`rounded-lg border p-4 ${right ? 'border-shop-700 bg-shop-900/30' : 'border-danger/35 bg-danger/[0.04]'}`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-shop-500">Q{i + 1}</span>
                  <span
                    className={`font-mono text-[10px] font-bold tracking-widest uppercase ${
                      right ? 'text-safe' : 'text-danger'
                    }`}
                  >
                    {right ? 'correct' : 'incorrect'}
                  </span>
                  <span className="ml-auto text-[11px] text-shop-500">{qq.draws}</span>
                </div>
                <p className="text-[13.5px] font-medium text-shop-100">{qq.prompt}</p>

                <div className="mt-2 space-y-1.5">
                  {opts.map((o, oi) => {
                    const isPicked = picked === oi
                    if (!o.correct && !isPicked) return null
                    return (
                      <div
                        key={oi}
                        className={`rounded border px-3 py-2 text-[12.5px] ${
                          o.correct
                            ? 'border-safe/40 bg-safe/[0.06]'
                            : 'border-danger/40 bg-danger/[0.06]'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={o.correct ? 'text-safe' : 'text-danger'}>{o.correct ? '✓' : '✕'}</span>
                          <div>
                            <div className="text-shop-100">
                              {o.text}
                              {isPicked && <span className="ml-2 text-[11px] text-shop-500">your answer</span>}
                            </div>
                            <div className="mt-0.5 text-shop-400">{o.why}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6">
          <SpecNotice />
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------- sitting */
  return (
    <div className="mx-auto max-w-[820px] px-5 py-8">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link to="/path" className="text-[12px] text-shop-500 transition-colors hover:text-amber-caution">
          ← Leave
        </Link>
        <span className="font-mono text-[11px] tracking-widest text-shop-500 uppercase">
          Level {level.index} · {level.title}
        </span>
        <span className="ml-auto tnum font-mono text-[12px] text-shop-400">
          {answeredCount}/{level.questions.length} answered
        </span>
      </div>

      {/* question dots */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {level.questions.map((qq, i) => (
          <button
            key={qq.id}
            onClick={() => setIdx(i)}
            title={`Question ${i + 1}`}
            className={`h-7 w-7 rounded font-mono text-[11px] transition-colors ${
              i === idx
                ? 'bg-amber-caution text-black'
                : answers[qq.id] !== undefined
                  ? 'bg-shop-700 text-shop-100'
                  : 'bg-shop-850 text-shop-500 hover:bg-shop-800'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-shop-700 bg-shop-900/40 p-5 fade-up" key={q.id}>
        <div className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">
          Question {idx + 1} of {level.questions.length}
        </div>
        <p className="mt-2 text-[15px] leading-relaxed font-medium text-shop-100">{q.prompt}</p>

        <div className="mt-4 space-y-2">
          {examOptions(q).map((o, oi) => {
            const picked = answers[q.id] === oi
            return (
              <button
                key={oi}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-[13.5px] transition-colors ${
                  picked
                    ? 'border-amber-caution bg-amber-caution/10 text-shop-100'
                    : 'border-shop-700 bg-shop-850 text-shop-200 hover:border-shop-500 hover:bg-shop-800'
                }`}
              >
                <span
                  className={`mt-[2px] grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[10px] ${
                    picked ? 'border-amber-caution bg-amber-caution text-black' : 'border-shop-600 text-shop-500'
                  }`}
                >
                  {String.fromCharCode(65 + oi)}
                </span>
                <span>{o.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="rounded border border-shop-700 px-4 py-2 text-[13px] text-shop-300 transition-colors hover:bg-shop-800 disabled:opacity-35 disabled:hover:bg-transparent"
        >
          ← Previous
        </button>

        {idx < level.questions.length - 1 ? (
          <button
            onClick={() => setIdx(idx + 1)}
            className="rounded bg-shop-800 px-4 py-2 text-[13px] font-medium text-shop-100 transition-colors hover:bg-shop-700"
          >
            Next →
          </button>
        ) : null}

        <button
          onClick={() => {
            submitExam(level.id, answers, result.score, level.passMark)
            setPhase('results')
            window.scrollTo(0, 0)
          }}
          disabled={!allAnswered}
          title={allAnswered ? undefined : 'Answer every question first'}
          className="ml-auto rounded bg-amber-caution px-5 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-amber-caution/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit {allAnswered ? '' : `(${level.questions.length - answeredCount} left)`}
        </button>
      </div>
    </div>
  )
}
