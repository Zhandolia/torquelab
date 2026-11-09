import { ELEMENTS, EMF, R_INTERNAL, faultById } from '../data/circuits'

/**
 * A single series loop, solved from the element resistances every time
 * anything changes. Nothing the meter displays is written down anywhere — it
 * all comes out of here, which is what keeps the numbers honest when somebody
 * probes a pair of points the author never thought about.
 */

export interface Solution {
  /** element resistances with the fault and the switch position applied */
  resistances: number[]
  current: number
  /** potential at each node relative to chassis; one more entry than elements */
  nodes: number[]
  /** index of the open element, or -1 */
  openAt: number
}

export function solve(faultId: string, keyOn: boolean): Solution {
  const fault = faultById(faultId)

  const resistances = ELEMENTS.map((e) => {
    if (!keyOn && e.kind === 'switch') return Infinity
    if (fault.elementId === e.id) return fault.r
    return e.r
  })

  const openAt = resistances.findIndex((r) => !Number.isFinite(r))

  const nodes = new Array<number>(ELEMENTS.length + 1).fill(0)

  if (openAt >= 0) {
    // No current anywhere, so nothing drops anywhere. Every node on the source
    // side of the break sits at full source voltage and everything beyond it
    // sits at chassis. That step is the fault, and it is the whole reason
    // walking a circuit with a voltmeter works.
    for (let i = 0; i <= openAt; i++) nodes[i] = EMF
    for (let i = openAt + 1; i < nodes.length; i++) nodes[i] = 0
    return { resistances, current: 0, nodes, openAt }
  }

  const total = R_INTERNAL + resistances.reduce((a, b) => a + b, 0)
  const current = EMF / total

  nodes[0] = EMF - current * R_INTERNAL
  for (let i = 0; i < resistances.length; i++) {
    nodes[i + 1] = nodes[i] - current * resistances[i]
  }
  return { resistances, current, nodes, openAt }
}

/** Resistance along the chain between two nodes, battery out of circuit. */
export function resistanceBetween(s: Solution, a: number, b: number) {
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  let sum = 0
  for (let i = lo; i < hi; i++) {
    if (!Number.isFinite(s.resistances[i])) return Infinity
    sum += s.resistances[i]
  }
  return sum
}

export type MeterMode = 'vdc' | 'ohm' | 'cont' | 'amp'

export const MODES: { id: MeterMode; label: string; unit: string; hint: string }[] = [
  { id: 'vdc', label: 'V⎓', unit: 'V', hint: 'Voltage between the two probes. The only test that works with the circuit live.' },
  { id: 'ohm', label: 'Ω', unit: 'Ω', hint: 'Resistance between the two probes, battery disconnected. A few milliamps, not the circuit’s own current.' },
  { id: 'cont', label: '•))', unit: 'Ω', hint: 'Continuity. Beeps below about fifty ohms, which is a very low bar.' },
  { id: 'amp', label: 'A clamp', unit: 'A', hint: 'Current through the loop, read with a clamp so nothing has to be unplugged.' },
]

/** Beep threshold used by most hand-held meters. */
export const CONTINUITY_BEEPS_BELOW = 50

export interface Reading {
  /** what the display shows, already formatted */
  text: string
  unit: string
  /** continuity only */
  beeping?: boolean
  /** shown under the display */
  note?: string
}

export function read(s: Solution, mode: MeterMode, red: number, black: number): Reading {
  if (mode === 'amp') {
    return {
      text: s.current.toFixed(2),
      unit: 'A',
      note: s.current < 0.01 ? 'nothing is flowing' : undefined,
    }
  }

  if (mode === 'vdc') {
    const v = s.nodes[red] - s.nodes[black]
    return { text: v.toFixed(2), unit: 'V' }
  }

  const r = resistanceBetween(s, red, black)
  if (!Number.isFinite(r)) {
    return {
      text: 'OL',
      unit: mode === 'cont' ? '' : 'Ω',
      beeping: false,
      note: 'open circuit — no path between the probes',
    }
  }
  if (mode === 'cont') {
    return {
      text: r.toFixed(2),
      unit: 'Ω',
      beeping: r < CONTINUITY_BEEPS_BELOW,
      note: r < CONTINUITY_BEEPS_BELOW ? 'beeping' : 'no beep',
    }
  }
  return { text: r.toFixed(3), unit: 'Ω' }
}

/** Supply-side and ground-side drop, the two numbers a drop test is for. */
export function drops(s: Solution) {
  const lampPos = 5
  const lampNeg = 6
  const chassis = ELEMENTS.length
  return {
    supply: s.nodes[0] - s.nodes[lampPos],
    load: s.nodes[lampPos] - s.nodes[lampNeg],
    ground: s.nodes[lampNeg] - s.nodes[chassis],
  }
}
