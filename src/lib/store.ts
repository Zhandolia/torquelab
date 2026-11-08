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

interface State {
  progress: Record<string, ProcProgress>
  bookmarks: string[]
  viewer: ViewerPrefs
  unitFtLb: boolean
  exams: Record<string, ExamResult>
  diagnostics: Record<string, DiagResult>
  learnerName: string
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
  setLearnerName: (name: string) => void
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
      learnerName: '',

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

      setLearnerName: (name) => set({ learnerName: name.slice(0, 60) }),
    }),
    { name: 'torquelab.v1' },
  ),
)
