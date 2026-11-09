import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProcProgress {
  steps: string[]
  quiz: Record<string, number>
  completedAt?: number
  startedAt: number
}

interface ViewerPrefs {
  labels: boolean
  ghost: boolean
  autoRotate: boolean
  xray: boolean
  grid: boolean
}

export interface ExamResult {
  /** best score as a whole percentage */
  best: number
  attempts: number
  passedAt?: number
  /** the most recent attempt, kept so results can be reviewed */
  lastAnswers: Record<string, number>
  lastScore: number
  lastAt: number
}

export interface DiagResult {
  attempts: number
  solvedAt?: number
  /** fewest minutes any attempt took to reach the fault */
  bestMin?: number
  /** least money any attempt spent on parts that were not the fault */
  bestParts?: number
}

export interface DrillResult {
  attempts: number
  correct: number
  bestStreak: number
}

interface State {
  progress: Record<string, ProcProgress>
  bookmarks: string[]
  viewer: ViewerPrefs
  unitFtLb: boolean
  exams: Record<string, ExamResult>
  diagnostics: Record<string, DiagResult>
  drills: Record<string, DrillResult>
  learnerName: string
  /**
   * Job sheet tick boxes, per procedure: tools collected, parts bought, steps
   * done at the car. Kept apart from `progress`, which records what you have
   * *learned*. Ticking a tool off a shopping list is not the same claim as
   * having worked through the step in the viewer, and merging the two would let
   * a shopping trip mark a procedure complete.
   */
  sheet: Record<string, string[]>
  /** Canonical tool ids the learner says they already own. */
  ownedTools: string[]
  toggleStep: (proc: string, step: string) => void
  completeStep: (proc: string, step: string) => void
  answerQuiz: (proc: string, cp: string, idx: number) => void
  finish: (proc: string) => void
  resetProc: (proc: string) => void
  toggleBookmark: (proc: string) => void
  setViewer: (p: Partial<ViewerPrefs>) => void
  setUnit: (ftlb: boolean) => void
  submitExam: (level: string, answers: Record<string, number>, score: number, passMark: number) => void
  clearExam: (level: string) => void
  recordDiagnosis: (caseId: string, min: number, parts: number) => void
  clearDiagnosis: (caseId: string) => void
  recordReading: (instrument: string, right: boolean, streak: number) => void
  setLearnerName: (name: string) => void
  toggleTick: (proc: string, key: string) => void
  clearTicks: (proc: string) => void
  toggleTool: (id: string) => void
  setOwnedTools: (ids: string[]) => void
}

const blank = (): ProcProgress => ({ steps: [], quiz: {}, startedAt: Date.now() })

export const useStore = create<State>()(
  persist(
    (set) => ({
      progress: {},
      bookmarks: [],
      viewer: { labels: true, ghost: true, autoRotate: false, xray: false, grid: true },
      unitFtLb: true,
      exams: {},
      diagnostics: {},
      drills: {},
      learnerName: '',
      sheet: {},
      ownedTools: [],

      toggleStep: (proc, step) =>
        set((s) => {
          const p = s.progress[proc] ?? blank()
          const steps = p.steps.includes(step) ? p.steps.filter((x) => x !== step) : [...p.steps, step]
          return { progress: { ...s.progress, [proc]: { ...p, steps } } }
        }),

      completeStep: (proc, step) =>
        set((s) => {
          const p = s.progress[proc] ?? blank()
          if (p.steps.includes(step)) return s
          return { progress: { ...s.progress, [proc]: { ...p, steps: [...p.steps, step] } } }
        }),

      answerQuiz: (proc, cp, idx) =>
        set((s) => {
          const p = s.progress[proc] ?? blank()
          return { progress: { ...s.progress, [proc]: { ...p, quiz: { ...p.quiz, [cp]: idx } } } }
        }),

      finish: (proc) =>
        set((s) => {
          const p = s.progress[proc] ?? blank()
          return { progress: { ...s.progress, [proc]: { ...p, completedAt: Date.now() } } }
        }),

      resetProc: (proc) =>
        set((s) => {
          const next = { ...s.progress }
          delete next[proc]
          return { progress: next }
        }),

      toggleBookmark: (proc) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(proc) ? s.bookmarks.filter((x) => x !== proc) : [...s.bookmarks, proc],
        })),

      setViewer: (p) => set((s) => ({ viewer: { ...s.viewer, ...p } })),
      setUnit: (ftlb) => set({ unitFtLb: ftlb }),

      submitExam: (level, answers, score, passMark) =>
        set((s) => {
          const prev = s.exams[level]
          const now = Date.now()
          return {
            exams: {
              ...s.exams,
              [level]: {
                best: Math.max(prev?.best ?? 0, score),
                attempts: (prev?.attempts ?? 0) + 1,
                // the first pass is the one that counts, so never overwrite it
                passedAt: prev?.passedAt ?? (score >= passMark ? now : undefined),
                lastAnswers: answers,
                lastScore: score,
                lastAt: now,
              },
            },
          }
        }),

      clearExam: (level) =>
        set((s) => {
          const next = { ...s.exams }
          delete next[level]
          return { exams: next }
        }),

      recordDiagnosis: (caseId, min, parts) =>
        set((s) => {
          const prev = s.diagnostics[caseId]
          return {
            diagnostics: {
              ...s.diagnostics,
              [caseId]: {
                attempts: (prev?.attempts ?? 0) + 1,
                solvedAt: prev?.solvedAt ?? Date.now(),
                bestMin: Math.min(prev?.bestMin ?? Infinity, min),
                bestParts: Math.min(prev?.bestParts ?? Infinity, parts),
              },
            },
          }
        }),

      clearDiagnosis: (caseId) =>
        set((s) => {
          const next = { ...s.diagnostics }
          delete next[caseId]
          return { diagnostics: next }
        }),

      recordReading: (instrument, right, streak) =>
        set((s) => {
          const prev = s.drills[instrument]
          return {
            drills: {
              ...s.drills,
              [instrument]: {
                attempts: (prev?.attempts ?? 0) + 1,
                correct: (prev?.correct ?? 0) + (right ? 1 : 0),
                bestStreak: Math.max(prev?.bestStreak ?? 0, streak),
              },
            },
          }
        }),

      setLearnerName: (name) => set({ learnerName: name.slice(0, 60) }),

      toggleTick: (proc, key) =>
        set((s) => {
          const cur = s.sheet[proc] ?? []
          return {
            sheet: {
              ...s.sheet,
              [proc]: cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key],
            },
          }
        }),

      clearTicks: (proc) =>
        set((s) => {
          const next = { ...s.sheet }
          delete next[proc]
          return { sheet: next }
        }),

      toggleTool: (id) =>
        set((s) => ({
          ownedTools: s.ownedTools.includes(id)
            ? s.ownedTools.filter((t) => t !== id)
            : [...s.ownedTools, id],
        })),

      setOwnedTools: (ids) => set({ ownedTools: [...new Set(ids)] }),
    }),
    { name: 'torquelab.v1' },
  ),
)
