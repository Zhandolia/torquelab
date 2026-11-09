/**
 * Everything a job sheet needs, derived from the procedure rather than written
 * a second time.
 *
 * The procedure pages teach. This file answers the different question you have
 * once you are already at the car with the bonnet up: what do I need in my
 * hand, what is every number I will have to hit, and how long is this actually
 * going to take me.
 *
 * All of it is computed. A second hand-written copy of the torque figures would
 * drift out of step with the procedure within a week, and a torque figure that
 * disagrees with itself in two places on the same platform is worse than none.
 */

import type { Procedure, TorqueSpec, Hazard } from './types'

/** Fastener names are prose, so compare them on letters and digits alone. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

export interface SheetTorque extends TorqueSpec {
  /** 1-based step numbers where this fastener is tightened. */
  steps: number[]
  /** true when the step list calls for it but the procedure's own table does not. */
  extra: boolean
}

/**
 * The torque table is the reference; the steps say where each figure is needed.
 * Anything a step asks for that the table omits is still listed, flagged, so a
 * gap in the data shows up on the sheet instead of hiding there.
 */
export function sheetTorque(p: Procedure): SheetTorque[] {
  const stepsFor = new Map<string, number[]>()
  p.steps.forEach((st, i) => {
    for (const t of st.torque ?? []) {
      const k = norm(t.fastener)
      stepsFor.set(k, [...(stepsFor.get(k) ?? []), i + 1])
    }
  })

  const rows: SheetTorque[] = p.torqueTable.map((t) => ({
    ...t,
    steps: stepsFor.get(norm(t.fastener)) ?? [],
    extra: false,
  }))

  const known = new Set(p.torqueTable.map((t) => norm(t.fastener)))
  for (const st of p.steps) {
    for (const t of st.torque ?? []) {
      const k = norm(t.fastener)
      if (known.has(k)) continue
      known.add(k)
      rows.push({ ...t, steps: stepsFor.get(k) ?? [], extra: true })
    }
  }
  return rows
}

export interface SheetMeasure {
  name: string
  spec: string
  tool: string
  step: number
}

/** Every measurement the procedure asks for, with the step that asks for it. */
export function sheetMeasure(p: Procedure): SheetMeasure[] {
  const out: SheetMeasure[] = []
  p.steps.forEach((st, i) => {
    for (const m of st.measure ?? []) out.push({ ...m, step: i + 1 })
  })
  return out
}

/** Which steps raise each hazard the procedure declares up front. */
export function sheetHazards(p: Procedure): { kind: Hazard; text: string; steps: number[] }[] {
  return p.hazards.map((h) => ({
    ...h,
    steps: p.steps.flatMap((st, i) => (st.hazards?.includes(h.kind) ? [i + 1] : [])),
  }))
}

/**
 * The sum of the procedure's own step durations.
 *
 * This is deliberately not `p.timeMin`. The two disagree on fourteen of the
 * sixteen procedures here, and they disagree because they are answers to
 * different questions: `timeMin` is the flat-rate figure a shop would quote for
 * somebody who has done the job before and is not stopping to learn anything,
 * while the step durations include reading the step, looking at the model,
 * taking the measurement and answering the checkpoint.
 *
 * On the Silverado hub bearing that gap is 120 minutes against 185 — more than
 * half again. Printing only the smaller number is how somebody starts a
 * safety-critical job at four in the afternoon and finishes it in the dark, so
 * the sheet prints both and says which is which.
 */
export function stepMinutes(p: Procedure): number {
  return p.steps.reduce((n, s) => n + (s.durationMin ?? 0), 0)
}

/** How many steps have no duration, so the figure above can be trusted or not. */
export function durationCoverage(p: Procedure) {
  const withDur = p.steps.filter((s) => s.durationMin != null).length
  return { withDur, total: p.steps.length, complete: withDur === p.steps.length }
}

/**
 * Fasteners that are consumed by being used: torque-to-yield bolts, and
 * anything whose note says it is single-use. These are the parts that turn a
 * postponed job into a stalled one, so the sheet calls them out separately
 * from the torque table.
 */
export function singleUse(p: Procedure): SheetTorque[] {
  return sheetTorque(p).filter((t) => t.tty || /single[- ]use|new (nut|bolt|washer)|replace/i.test(t.note ?? ''))
}

export interface SheetIndex {
  tools: number
  parts: number
  torque: number
  measures: number
  steps: number
  /** step numbers that carry a torque figure */
  torqueSteps: number[]
}

export function sheetIndex(p: Procedure): SheetIndex {
  return {
    tools: p.tools.length,
    parts: p.parts.length + (p.fluids?.length ?? 0),
    torque: sheetTorque(p).length,
    measures: sheetMeasure(p).length,
    steps: p.steps.length,
    torqueSteps: p.steps.flatMap((s, i) => (s.torque?.length ? [i + 1] : [])),
  }
}

/** 1-based position of a step id, or 0 when the id is not in this procedure. */
export const stepNumber = (p: Procedure, id: string) => p.steps.findIndex((s) => s.id === id) + 1

/**
 * Both units, always — at the car there is nobody to ask and nothing to toggle.
 *
 * Returned as a pair rather than one string so the sheet can stack them. On a
 * 375 px phone a single nowrap line of "245 N·m / 181 ft-lb" claims 160 px of
 * a 311 px table and crushes the fastener name into four wrapped lines, which
 * is the opposite of what a reference table is for.
 */
export function unitPair(t: TorqueSpec): { primary: string; secondary?: string } {
  if (t.nm === 0 && t.angle) return { primary: t.angle }
  if (t.inlb) return { primary: `${t.nm} N·m`, secondary: `${t.inlb} in-lb` }
  return { primary: `${t.nm} N·m`, secondary: `${t.ftlb ?? Math.round(t.nm * 0.7376)} ft-lb` }
}
