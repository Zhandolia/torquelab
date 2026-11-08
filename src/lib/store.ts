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

interface State {
  progress: Record<string, ProcProgress>
  bookmarks: string[]
  viewer: ViewerPrefs
  unitFtLb: boolean
  toggleStep: (proc: string, step: string) => void
  completeStep: (proc: string, step: string) => void
  answerQuiz: (proc: string, cp: string, idx: number) => void
  finish: (proc: string) => void
  resetProc: (proc: string) => void
  toggleBookmark: (proc: string) => void
  setViewer: (p: Partial<ViewerPrefs>) => void
  setUnit: (ftlb: boolean) => void
}

const blank = (): ProcProgress => ({ steps: [], quiz: {}, startedAt: Date.now() })

export const useStore = create<State>()(
  persist(
    (set) => ({
      progress: {},
      bookmarks: [],
      viewer: { labels: true, ghost: true, autoRotate: false, xray: false, grid: true },
      unitFtLb: true,

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
    }),
    { name: 'torquelab.v1' },
  ),
)
