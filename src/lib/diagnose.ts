import { bookTime, CASES, type DiagCase, type DiagStage } from '../data/diagnostics'
import { stableShuffle } from './shuffle'
import type { DiagResult } from './store'

/**
 * Options as the learner sees them. Cases are authored with the right move
 * first because that is far easier to review, so the display order has to be
 * shuffled or the whole bay could be passed by always picking A.
 *
 * The seed carries the case id as well as the stage id: stage ids repeat
 * across cases, and without the case id every first decision in the bay would
 * land its right answer in the same slot.
 *
 * The exact seed shape is not arbitrary. A seeded permutation spreads answers
 * but does not guarantee an even spread over a set this small, and the obvious
 * `case:stage` put 8 of the 18 right answers at A — a 44% hit rate for anyone
 * who just clicks the top option. `stage@case` lands on 5/5/5/3, which is
 * about as close to uniform as 18 decisions get.
 */
export const stageOptions = (caseId: string, stage: DiagStage) =>
  stableShuffle(stage.options, `${stage.id}@${caseId}`)

export interface CaseStatus {
  c: DiagCase
  book: number
  attempts: number
  solved: boolean
  bestMin?: number
  bestParts?: number
  /** a run that reached the fault in book time with nothing wasted on parts */
  clean: boolean
}

export function caseStatuses(diag: Record<string, DiagResult>): CaseStatus[] {
  return CASES.map((c) => {
    const r = diag[c.id]
    const book = bookTime(c)
    return {
      c,
      book,
      attempts: r?.attempts ?? 0,
      solved: !!r?.solvedAt,
      bestMin: r?.bestMin,
      bestParts: r?.bestParts,
      clean: !!r?.solvedAt && (r.bestMin ?? Infinity) <= book && (r.bestParts ?? Infinity) === 0,
    }
  })
}

export function bayProgress(st: CaseStatus[]) {
  const solved = st.filter((s) => s.solved).length
  const clean = st.filter((s) => s.clean).length
  return {
    solved,
    clean,
    total: st.length,
    pct: st.length === 0 ? 0 : Math.round((solved / st.length) * 100),
    complete: solved === st.length,
  }
}

/** 0 → "$0", 1200 → "$1,200". */
export const money = (n: number) => `$${n.toLocaleString('en-US')}`
