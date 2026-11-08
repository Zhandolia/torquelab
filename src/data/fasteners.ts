/**
 * The fastener bench.
 *
 * Every procedure in this platform quotes torque figures, and several of them
 * stop to explain why one bolt on a caliper is 136 N·m and the one next to it
 * is 32. What none of them says out loud is the thing underneath all of it:
 * torque is not the point. Clamp load is the point, and torque is a cheap,
 * noisy way of guessing at it.
 *
 * This file carries the model that makes that visible.
 *
 *   T = K · D · F
 *
 * T is torque in newton-metres, D the nominal diameter in metres, F the clamp
 * load in newtons, and K the nut factor — an empirical lump that stands in for
 * every friction effect in the joint at once. K is not a physical constant.
 * It is measured, it scatters by a quarter either way even on a controlled
 * test bench, and it is why roughly 90% of the torque you apply is spent on
 * friction rather than on stretching the bolt. That is the whole reason
 * lubricating a thread and then torquing to the dry figure destroys joints.
 */

export interface Grade {
  id: string
  label: string
  system: 'metric' | 'sae'
  /** stress at which permanent set begins to be guaranteed against, MPa */
  proofMPa: number
  yieldMPa: number
  tensileMPa: number
  marking: string
  note: string
}

export const GRADES: Grade[] = [
  {
    id: '8.8',
    label: '8.8',
    system: 'metric',
    proofMPa: 580,
    yieldMPa: 640,
    tensileMPa: 800,
    marking: '8.8 stamped on the head',
    note: 'The general-purpose structural grade. Most chassis and bracket bolts on a passenger car.',
  },
  {
    id: '10.9',
    label: '10.9',
    system: 'metric',
    proofMPa: 830,
    yieldMPa: 940,
    tensileMPa: 1040,
    marking: '10.9 stamped on the head',
    note: 'Where the load path really matters: caliper brackets, hub carriers, suspension pivots.',
  },
  {
    id: '12.9',
    label: '12.9',
    system: 'metric',
    proofMPa: 970,
    yieldMPa: 1100,
    tensileMPa: 1220,
    marking: '12.9 stamped on the head',
    note: 'Very high strength and correspondingly brittle. Rare on a car outside the engine.',
  },
  {
    id: 'sae5',
    label: 'SAE Grade 5',
    system: 'sae',
    proofMPa: 586,
    yieldMPa: 634,
    tensileMPa: 827,
    marking: 'three radial lines on the head',
    note: 'The imperial near-equivalent of 8.8. Still everywhere on American trucks.',
  },
  {
    id: 'sae8',
    label: 'SAE Grade 8',
    system: 'sae',
    proofMPa: 827,
    yieldMPa: 896,
    tensileMPa: 1034,
    marking: 'six radial lines on the head',
    note: 'The imperial near-equivalent of 10.9.',
  },
]

export const gradeById = (id: string) => GRADES.find((g) => g.id === id)!

/* --------------------------------------------------------- nut factors */

export interface ThreadCondition {
  id: string
  label: string
  /** nut factor K */
  k: number
  tone: 'safe' | 'amber' | 'danger'
  note: string
}

export const CONDITIONS: ThreadCondition[] = [
  {
    id: 'dry',
    label: 'Clean and dry, as received',
    k: 0.2,
    tone: 'safe',
    note: 'Plated, dry, free of oil and grit. This is the condition a published torque figure assumes unless it says otherwise.',
  },
  {
    id: 'oiled',
    label: 'Light film of engine oil',
    k: 0.15,
    tone: 'amber',
    note: 'A wipe of oil, or a bolt that came out of an oily hole and went back in without being cleaned. Friction drops by about a quarter.',
  },
  {
    id: 'antiseize',
    label: 'Nickel or copper anti-seize',
    k: 0.11,
    tone: 'danger',
    note: 'Anti-seize is a lubricant. It roughly halves thread friction, so the same wrench reading delivers far more stretch than the spec intended.',
  },
  {
    id: 'rusty',
    label: 'Corroded, dirty, galled',
    k: 0.28,
    tone: 'amber',
    note: 'More of your torque is eaten by friction, so the joint ends up loose. A seized bolt can also read full torque while turning nothing useful at all.',
  },
]

export const conditionById = (id: string) => CONDITIONS.find((c) => c.id === id)!

/* ------------------------------------------------------------ specimens */

export interface Specimen {
  id: string
  name: string
  thread: string
  /** nominal diameter, mm */
  dia: number
  /** tensile stress area, mm² */
  areaMm2: number
  gradeId: string
  specNm: number
  procedureId: string
  job: string
  /**
   * Set when the bolt is not the weakest thing in the joint. These are the
   * joints where the published torque is protecting something else entirely.
   */
  limit?: string
}

export const SPECIMENS: Specimen[] = [
  {
    id: 'bracket',
    name: 'Caliper bracket bolt',
    thread: 'M12 × 1.25',
    dia: 12,
    areaMm2: 92.1,
    gradeId: '10.9',
    specNm: 136,
    procedureId: 'civic-front-brakes',
    job: 'Clamps the caliper bracket to the steering knuckle. The entire braking torque of that corner passes through this joint.',
  },
  {
    id: 'guidepin',
    name: 'Caliper guide pin bolt',
    thread: 'M8 × 1.25',
    dia: 8,
    areaMm2: 36.6,
    gradeId: '8.8',
    specNm: 32,
    procedureId: 'civic-front-brakes',
    job: 'Holds the caliper body on its slide pins. It locates a floating part and carries no braking load at all.',
  },
  {
    id: 'lug',
    name: 'Wheel lug nut',
    thread: 'M12 × 1.5',
    dia: 12,
    areaMm2: 88.1,
    gradeId: '10.9',
    specNm: 108,
    procedureId: 'civic-front-brakes',
    job: 'Clamps the wheel and rotor against the hub face. Friction from that clamp carries the load, not the studs in shear.',
  },
  {
    id: 'hubbolt',
    name: 'Hub carrier bolt',
    thread: 'M14 × 1.5',
    dia: 14,
    areaMm2: 125,
    gradeId: '10.9',
    specNm: 180,
    procedureId: 'silverado-hub-bearing',
    job: 'Clamps a sealed hub bearing unit to the back of a truck knuckle, through vertical, lateral and braking loads.',
  },
  {
    id: 'sparkplug',
    name: 'Spark plug',
    thread: 'M14 × 1.25',
    dia: 14,
    areaMm2: 125,
    gradeId: '8.8',
    specNm: 18,
    procedureId: 'mustang-spark-plugs',
    job: 'Seals a combustion chamber and conducts heat out of it into the head.',
    limit:
      'The aluminium threads in the cylinder head, not the plug. The spec is sized for what the head can take, which is why lubricating the threads and keeping the same wrench reading strips heads.',
  },
  {
    id: 'drainplug',
    name: 'Oil drain plug',
    thread: 'M14 × 1.5',
    dia: 14,
    areaMm2: 125,
    gradeId: '8.8',
    specNm: 39,
    procedureId: 'oil-and-filter',
    job: 'Compresses a crush washer against an aluminium sump pan.',
    limit:
      'The aluminium pan. The plug itself is barely stressed — the figure exists to stop you pulling the threads out of a casting that costs more than the car is worth to replace.',
  },
  {
    id: 'coilbolt',
    name: 'Ignition coil bolt',
    thread: 'M6 × 1.0',
    dia: 6,
    areaMm2: 20.1,
    gradeId: '8.8',
    specNm: 7,
    procedureId: 'mustang-spark-plugs',
    job: 'Holds a coil down onto a camshaft cover.',
    limit:
      'The aluminium boss in the cover. Seven newton-metres is about the torque of a firm wrist on a quarter-inch ratchet, and a half-inch bar will pull the thread straight out.',
  },
]

/* --------------------------------------------------------------- model */

/** Clamp load in kN for a given torque, diameter and nut factor. */
export function clampLoadKn(torqueNm: number, diaMm: number, k: number) {
  return torqueNm / (k * (diaMm / 1000)) / 1000
}

/** The load at which the bolt is guaranteed not to take a permanent set. */
export const proofLoadKn = (s: Specimen) => (gradeById(s.gradeId).proofMPa * s.areaMm2) / 1000

export const yieldLoadKn = (s: Specimen) => (gradeById(s.gradeId).yieldMPa * s.areaMm2) / 1000

/**
 * The torque that reaches the same clamp load the published figure was written
 * for, once the threads are no longer in the condition it assumed.
 */
export function correctedTorque(s: Specimen, k: number) {
  const asReceived = CONDITIONS[0].k
  return (s.specNm * k) / asReceived
}

/* -------------------------------------------------------------- content */

export const TTY_POINTS: { label: string; body: string }[] = [
  {
    label: 'Torque control alone is a poor way to set tension',
    body:
      'Around 90% of the torque you apply goes into friction under the head and in the threads. Only the remainder stretches the bolt, so a 25% swing in friction — which is ordinary — swings the clamp load by about as much.',
  },
  {
    label: 'Angle control sidesteps friction entirely',
    body:
      'Once a bolt is snug, a further turn stretches it by a known amount: the thread pitch times the fraction of a turn. That is geometry, and geometry does not care how oily the threads are.',
  },
  {
    label: 'Torque-to-yield goes deliberately past the knee',
    body:
      'A TTY bolt is tightened into the flat part of its stretch curve, where a large change in angle produces only a small change in tension. Every bolt in the pattern ends up at nearly the same tension even though they all started slightly differently.',
  },
  {
    label: 'Which is exactly why it cannot be reused',
    body:
      'The bolt is already stretched permanently and it is thinner than it was. Run it up again and it is further along a curve it only has one trip through. Measure a used head bolt against a new one and you can usually see the difference.',
  },
]

export const REUSE_RULES: { item: string; verdict: 'never' | 'inspect' | 'reuse'; why: string }[] = [
  {
    item: 'Torque-to-yield bolt — head bolts, many rod bolts, some suspension pivots',
    verdict: 'never',
    why: 'Already stretched past yield by design. A second use starts further along a curve it has only one trip through.',
  },
  {
    item: 'Crush washer on a drain plug',
    verdict: 'never',
    why: 'It seals by deforming permanently into the gap. Once crushed it cannot do that again, and the usual response — more torque — strips the pan.',
  },
  {
    item: 'Axle nut with a staked or deformed locking collar',
    verdict: 'never',
    why: 'The locking feature works once. A reused one can back off, and it sets bearing stack-up while it does so.',
  },
  {
    item: 'Nylon insert lock nut',
    verdict: 'never',
    why: 'The nylon takes a thread impression on first use and will not grip the same way twice.',
  },
  {
    item: 'Caliper bracket bolt, hub bolt, ordinary graded bolt',
    verdict: 'inspect',
    why: 'Reusable if the threads are clean and undamaged and it has not been over-torqued. Run a die down it, look for necking, and replace anything in doubt.',
  },
  {
    item: 'Wheel lug nut',
    verdict: 'inspect',
    why: 'Reusable unless the hex is rounded, the seat is damaged or a swollen chrome cap is lying to your socket.',
  },
  {
    item: 'Prevailing-torque all-metal lock nut',
    verdict: 'inspect',
    why: 'Reusable a limited number of times. If it spins freely down the thread by hand, its locking feature is gone.',
  },
  {
    item: 'Worm-drive hose clamp, plain washer, split pin seat',
    verdict: 'reuse',
    why: 'Reusable while the band, screw and threads are sound. Split pins themselves are single use.',
  },
]
