import type { Checkpoint } from '../lib/types'
import { useStore } from '../lib/store'

export function Quiz({ cp, procId }: { cp: Checkpoint; procId: string }) {
  const answered = useStore((s) => s.progress[procId]?.quiz?.[cp.id])
  const answer = useStore((s) => s.answerQuiz)
  const picked = answered ?? null
  const correctIdx = cp.options.findIndex((o) => o.correct)
  const gotIt = picked !== null && picked === correctIdx

  return (
    <div className="rounded-lg border border-shop-700 bg-shop-900/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] font-bold tracking-widest text-amber-caution uppercase">
          Checkpoint
        </span>
        {picked !== null && (
          <span
            className={`font-mono text-[10px] font-bold tracking-widest uppercase ${
              gotIt ? 'text-safe' : 'text-danger'
            }`}
          >
            {gotIt ? '✓ correct' : '✕ not quite'}
          </span>
        )}
      </div>

      <p className="mb-3 text-[13.5px] leading-relaxed font-medium text-shop-100">{cp.question}</p>

      <div className="space-y-1.5">
        {cp.options.map((o, i) => {
          const isPicked = picked === i
          const reveal = picked !== null
          const state = !reveal
            ? 'idle'
            : o.correct
              ? 'right'
              : isPicked
                ? 'wrong'
                : 'muted'

          const cls = {
            idle: 'border-shop-700 bg-shop-850 hover:border-shop-500 hover:bg-shop-800 text-shop-200',
            right: 'border-safe/50 bg-safe/[0.08] text-shop-100',
            wrong: 'border-danger/50 bg-danger/[0.08] text-shop-100',
            muted: 'border-shop-800 bg-shop-900/40 text-shop-500',
          }[state]

          return (
            <div key={i}>
              <button
                disabled={reveal}
                onClick={() => answer(procId, cp.id, i)}
                className={`flex w-full items-start gap-2.5 rounded border px-3 py-2 text-left text-[13px] transition-colors ${cls} ${
                  reveal ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className="mt-[2px] font-mono text-[10px] text-shop-500">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{o.text}</span>
                {reveal && o.correct && <span className="text-safe">✓</span>}
                {reveal && isPicked && !o.correct && <span className="text-danger">✕</span>}
              </button>
              {reveal && (isPicked || o.correct) && (
                <p
                  className={`mt-1 ml-7 border-l-2 pl-2.5 text-[12px] leading-relaxed ${
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
    </div>
  )
}
