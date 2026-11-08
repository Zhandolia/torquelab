import { LEVELS, type ExamQuestion, type Level } from '../data/curriculum'
import { procById } from '../data/procedures'
import type { Checkpoint } from './types'
import { stableShuffle } from './shuffle'
import type { ExamResult, ProcProgress } from './store'

export interface LevelStatus {
  level: Level
  /** procedures in this level that are fully finished */
  done: number
  total: number
  procPct: number
  /** every procedure finished — the gate on sitting the exam */
  proceduresComplete: boolean
  /** the previous level's exam has been passed */
  previousPassed: boolean
  examUnlocked: boolean
  passed: boolean
  best: number
  attempts: number
  result?: ExamResult
}

const procDone = (progress: Record<string, ProcProgress>, id: string) => {
  const p = progress[id]
  if (!p) return false
  if (p.completedAt) return true
  // a procedure also counts as done once every step is ticked
  const proc = procById(id)
  return !!proc && p.steps.length >= proc.steps.length
}

export function levelStatuses(
  progress: Record<string, ProcProgress>,
  exams: Record<string, ExamResult>,
): LevelStatus[] {
  const out: LevelStatus[] = []

  for (const level of LEVELS) {
    const done = level.procedureIds.filter((id) => procDone(progress, id)).length
    const total = level.procedureIds.length
    const result = exams[level.id]
    const passed = !!result?.passedAt
    const prev = out[out.length - 1]
    const previousPassed = prev ? prev.passed : true
    const proceduresComplete = done === total

    out.push({
      level,
      done,
      total,
      procPct: total === 0 ? 0 : Math.round((done / total) * 100),
      proceduresComplete,
      previousPassed,
      examUnlocked: proceduresComplete && previousPassed,
      passed,
      best: result?.best ?? 0,
      attempts: result?.attempts ?? 0,
      result,
    })
  }

  return out
}

export const isProcedureDone = procDone

/** Overall path completion: procedures and exams weighted evenly. */
export function programProgress(statuses: LevelStatus[]) {
  const procTotal = statuses.reduce((n, s) => n + s.total, 0)
  const procDoneCount = statuses.reduce((n, s) => n + s.done, 0)
  const examsPassed = statuses.filter((s) => s.passed).length
  const halves = procTotal === 0 ? 0 : (procDoneCount / procTotal) * 50 + (examsPassed / statuses.length) * 50
  return {
    pct: Math.round(halves),
    procDoneCount,
    procTotal,
    examsPassed,
    examTotal: statuses.length,
    complete: examsPassed === statuses.length,
  }
}

/** Options as the learner sees them — authored order is never shown directly. */
export const examOptions = (q: ExamQuestion) => stableShuffle(q.options, q.id)

/** Same treatment for the checkpoints embedded in each procedure. */
export const checkpointOptions = (cp: Checkpoint) => stableShuffle(cp.options, cp.id)

export function scoreExam(level: Level, answers: Record<string, number>) {
  const correct = level.questions.filter((q) => {
    const picked = answers[q.id]
    return picked !== undefined && examOptions(q)[picked]?.correct
  }).length
  return {
    correct,
    total: level.questions.length,
    score: Math.round((correct / level.questions.length) * 100),
  }
}
