/**
 * The electrical bench.
 *
 * This platform maps itself onto the ASE certification areas and has always
 * been missing one: A6, electrical and electronic systems. That is the area
 * most modern faults actually live in and the one self-taught mechanics are
 * worst at, because you cannot see electricity and a wiring diagram teaches
 * you nothing about where to put the probes.
 *
 * So: one circuit, solved properly, with faults you can put into it and a
 * meter you can move around. Everything the meter says is computed from the
 * element resistances rather than written down, which means the numbers stay
 * honest when you probe somewhere the author did not think of.
 */

export type ElementKind = 'battery' | 'wire' | 'fuse' | 'switch' | 'load' | 'ground'

export interface CircuitElement {
  id: string
  label: string
  kind: ElementKind
  /** healthy resistance in ohms */
  r: number
}

/**
 * A headlamp-style circuit as a single series loop: battery, feed, fuse,
 * switch, lamp, ground. The order is the order current takes.
 */
export const ELEMENTS: CircuitElement[] = [
  { id: 'feed', label: 'B+ feed cable', kind: 'wire', r: 0.008 },
  { id: 'fuse', label: '15 A fuse', kind: 'fuse', r: 0.004 },
  { id: 'supply', label: 'Supply wire to switch', kind: 'wire', r: 0.01 },
  { id: 'switch', label: 'Switch contacts', kind: 'switch', r: 0.008 },
  { id: 'lampFeed', label: 'Wire to the lamp', kind: 'wire', r: 0.008 },
  { id: 'lamp', label: 'Lamp filament', kind: 'load', r: 2.0 },
  { id: 'groundWire', label: 'Lamp ground wire', kind: 'wire', r: 0.008 },
  { id: 'groundStud', label: 'Ground stud to chassis', kind: 'ground', r: 0.003 },
]

export const EMF = 12.6
export const R_INTERNAL = 0.02

/**
 * Nodes sit between elements. Node 0 is the battery positive post and the last
 * node is chassis, which is the reference for every voltage the meter shows.
 */
export interface TestPoint {
  id: string
  label: string
  node: number
  x: number
  y: number
  /** which way the label hangs off the point */
  anchor?: 'start' | 'middle' | 'end'
  dy?: number
}

/**
 * The labels on either side of the fuse and the switch are only about 60 units
 * apart, which is less than a label is wide, so they are staggered onto two
 * lines rather than fighting over one.
 */
export const TEST_POINTS: TestPoint[] = [
  { id: 'battPos', label: 'Battery +', node: 0, x: 100, y: 80, anchor: 'start', dy: -16 },
  { id: 'fuseIn', label: 'Fuse in', node: 1, x: 190, y: 80, anchor: 'middle', dy: -34 },
  { id: 'fuseOut', label: 'Fuse out', node: 2, x: 252, y: 80, anchor: 'middle', dy: -16 },
  { id: 'switchIn', label: 'Switch in', node: 3, x: 342, y: 80, anchor: 'middle', dy: -34 },
  { id: 'switchOut', label: 'Switch out', node: 4, x: 410, y: 80, anchor: 'middle', dy: -16 },
  { id: 'lampPos', label: 'Lamp feed', node: 5, x: 560, y: 80, anchor: 'end', dy: -16 },
  { id: 'lampNeg', label: 'Lamp ground', node: 6, x: 560, y: 186, anchor: 'end', dy: 22 },
  { id: 'stud', label: 'Ground stud', node: 7, x: 310, y: 232, anchor: 'middle', dy: 24 },
  { id: 'chassis', label: 'Chassis / battery −', node: 8, x: 100, y: 232, anchor: 'start', dy: 24 },
]

export const pointByNode = (n: number) => TEST_POINTS.find((p) => p.node === n)

/* ---------------------------------------------------------------- faults */

export interface Fault {
  id: string
  /** what the customer says */
  complaint: string
  /** what you would see standing in front of the car */
  observed: string
  elementId: string | null
  /** the faulted resistance; Infinity for an open circuit */
  r: number
  name: string
  teaching: string
}

export const FAULTS: Fault[] = [
  {
    id: 'none',
    complaint: 'Nothing wrong with it — this is the known-good circuit.',
    observed: 'Lamp lights normally.',
    elementId: null,
    r: 0,
    name: 'No fault',
    teaching:
      'Learn what right looks like before you go looking for wrong. Note how little voltage the whole supply side drops, and how close the lamp ground sits to zero.',
  },
  {
    id: 'fuse',
    complaint: '"The light just stopped working."',
    observed: 'Lamp dead. Nothing audible, nothing warm.',
    elementId: 'fuse',
    r: Infinity,
    name: 'Open fuse',
    teaching:
      'An open is the easy case: full source voltage on one side of it and nothing on the other. Walk along the circuit and the voltage falls off a cliff exactly at the fault. Then ask why the fuse went, because fuses do not fail of old age.',
  },
  {
    id: 'switch',
    complaint: '"It works if I wiggle the switch."',
    observed: 'Lamp dead with the switch on.',
    elementId: 'switch',
    r: Infinity,
    name: 'Open switch contacts',
    teaching:
      'Identical signature to the open fuse and in a completely different place, which is the whole reason you probe rather than guess. Voltage present at the switch input and absent at its output means the fault is between those two probes and nowhere else.',
  },
  {
    id: 'ground',
    complaint: '"It’s gone really dim."',
    observed: 'Lamp lit but visibly weak.',
    elementId: 'groundStud',
    r: 2.2,
    name: 'Corroded ground stud',
    teaching:
      'The one that catches people. A continuity test across this stud beeps — there is a path, so the meter is happy. But under load it drops more voltage than the lamp does, and the lamp gets what is left. Continuity proves a path exists, not that it can carry current.',
  },
  {
    id: 'connector',
    complaint: '"It’s dim and it got worse over the winter."',
    observed: 'Lamp lit but weak, connector green inside.',
    elementId: 'supply',
    r: 1.5,
    name: 'High resistance in the supply connector',
    teaching:
      'Same symptom as the bad ground and the opposite half of the circuit. Which side is eating the voltage tells you which side to fix, and a voltage drop test answers it in two probe placements.',
  },
]

export const faultById = (id: string) => FAULTS.find((f) => f.id === id)!

/* --------------------------------------------------------------- content */

export const DROP_LIMITS = [
  { what: 'Whole supply side, battery positive to the load', limit: '0.5 V' },
  { what: 'Whole ground side, load to battery negative', limit: '0.2 V' },
  { what: 'Any single connector or splice', limit: '0.1 V' },
  { what: 'A switch or relay contact set', limit: '0.3 V' },
]

export const METER_LESSONS: { title: string; body: string }[] = [
  {
    title: 'Voltage drop beats resistance, every time',
    body:
      'An ohmmeter tests a dead circuit with a few milliamps. A voltage drop test uses the circuit’s own current, which is the condition the fault actually appears in. A joint that reads 0.4 Ω on the bench can drop six volts under load.',
  },
  {
    title: 'Continuity is a path, not a capacity',
    body:
      'Most meters beep below about fifty ohms. Two ohms in a ground strap beeps cheerfully and will still leave a headlamp brown. If the test told you nothing could be wrong, the test was the wrong one.',
  },
  {
    title: 'The black probe decides what the number means',
    body:
      'Red on a point and black on chassis measures what is there. Red and black either side of one component measures what that component is taking. Those are different questions and people answer the wrong one constantly.',
  },
  {
    title: 'An open shows you exactly where it is',
    body:
      'With no current flowing there is no drop anywhere, so every point upstream of an open sits at source voltage and everything downstream sits at zero. The step between two adjacent probes is the fault.',
  },
  {
    title: 'Measure it loaded, or you have not measured it',
    body:
      'Switch on, lamp drawing current, then probe. A circuit at rest tells you almost nothing — which is why the meter on this bench has a key switch and why the readings change when you use it.',
  },
]
