/**
 * The measurement bench.
 *
 * Sixteen procedures in this platform tell you to measure something and
 * compare it against a limit — rotor thickness, lateral runout, pad material,
 * bearing play. Not one of them teaches you to read the instrument, because
 * trade school teaches that in week one and everyone else is assumed to know
 * it. Most self-taught mechanics have never read a vernier scale in their
 * lives, and a measurement you cannot take is a specification you cannot use.
 *
 * So: three instruments, the scales drawn to scale against each other, and a
 * drill that generates readings until you can take them.
 */

export type InstrumentId = 'micrometer' | 'caliper' | 'dial'

export interface Instrument {
  id: InstrumentId
  name: string
  subtitle: string
  range: string
  /** smallest division, in millimetres */
  resolution: number
  accent: string
  blurb: string
  /** how the scale is read, in the order you read it */
  howTo: string[]
  /** a reading broken down, shown against the instrument */
  worked: { value: number; parts: string[] }
  /** the specs in this platform that need this instrument */
  usedFor: { spec: string; where: string; procedureId: string }[]
  /** technique that changes the number you get */
  technique: string[]
  mistake: string
  /** the range the drill generates from */
  drill: { min: number; max: number }
}

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'micrometer',
    name: 'Outside micrometer',
    subtitle: '0–25 mm, reading to 0.01 mm',
    range: '0–25 mm',
    resolution: 0.01,
    accent: '#ffb000',
    blurb:
      'The instrument every brake job in this platform assumes you own. A micrometer is a precision screw: the thimble advances the spindle 0.5 mm per revolution, and the fifty divisions around it split that revolution into hundredths of a millimetre.',
    howTo: [
      'Read the **whole millimetres** from the marks above the datum line on the sleeve',
      'Look below the line. If a **half-millimetre** mark is uncovered, add 0.5 mm',
      'Read the **thimble division** that lines up with the datum line and add it as hundredths',
      'Add the three together — that is the measurement, and there is nothing to estimate',
    ],
    worked: {
      value: 21.37,
      parts: [
        '21 whole millimetres are showing above the line',
        'the 21.5 mark below the line is still covered, so no half millimetre',
        'the thimble reads 37, which is 0.37 mm',
        '21 + 0.37 = 21.37 mm — on a Civic front rotor that is 0.37 mm above the discard limit',
      ],
    },
    usedFor: [
      { spec: 'Front rotor thickness — new 23.0 mm, discard 21.0 mm', where: 'Front Disc Brake Service', procedureId: 'civic-front-brakes' },
      { spec: 'Rear rotor thickness — new 10.0 mm, discard 8.5 mm', where: 'Rear Disc Brake Service', procedureId: 'camry-rear-brakes' },
      { spec: 'Thickness variation — max 0.015 mm across eight points', where: 'Front Disc Brake Service', procedureId: 'civic-front-brakes' },
    ],
    technique: [
      'Wipe both measuring faces and check the zero before you trust a single reading',
      'Close it with the **ratchet or friction stop**, never the thimble — that is what makes two people get the same number',
      'Measure a rotor at four points around the disc and at the same radius each time',
      'Hold the frame as briefly as you can. Body heat expands steel and 0.01 mm is not much steel',
    ],
    mistake:
      'Winding it down on the thimble because it feels more controlled. Hand pressure varies by 0.01–0.03 mm between readings and between people, which is the entire tolerance you are trying to measure.',
    drill: { min: 0.3, max: 24.8 },
  },

  {
    id: 'caliper',
    name: 'Vernier caliper',
    subtitle: 'Reading to 0.05 mm',
    range: '0–150 mm',
    resolution: 0.05,
    accent: '#35e0c8',
    blurb:
      'Twenty divisions on the sliding scale span thirty-nine millimetres of the main scale, so each one falls 0.05 mm short of two millimetres. That deliberate mismatch is the whole trick: exactly one pair of lines can be in line at a time, and which pair it is gives you the fraction.',
    howTo: [
      'Find the **vernier zero** and read the last whole millimetre mark at or before it',
      'Run along the vernier until you find the division that **lines up exactly** with a main-scale line',
      'Multiply that division number by 0.05 — the labels on this scale are already in hundredths',
      'Add it to the whole millimetres',
    ],
    worked: {
      value: 23.45,
      parts: [
        'the vernier zero has passed 23 but not 24, so 23 whole millimetres',
        'division 9 on the vernier is the one that lines up — every other pair is offset',
        '9 × 0.05 = 0.45 mm',
        '23 + 0.45 = 23.45 mm',
      ],
    },
    usedFor: [
      { spec: 'Pad friction thickness — replace below 1.6 mm front', where: 'Front Disc Brake Service', procedureId: 'civic-front-brakes' },
      { spec: 'Pad friction thickness — replace below 1.0 mm rear', where: 'Rear Disc Brake Service', procedureId: 'camry-rear-brakes' },
      { spec: 'Brake shoe lining and drum diameter', where: 'Rear Drum Brake Service', procedureId: 'corolla-drum-brakes' },
    ],
    technique: [
      'Close the jaws and check the zeros line up before every session',
      'Use the **outside jaws square to the work** — a caliper held at an angle always reads large',
      'Light contact. The jaws are long levers and they flex, so squeezing reads small',
      'Only one vernier line genuinely coincides. If two look close, your eye is off square to the scale',
    ],
    mistake:
      'Picking the vernier line that looks nearest rather than the one that actually coincides. Two divisions either side will look almost right from an angle, and that is a 0.1 mm error on a 0.05 mm instrument.',
    drill: { min: 0.5, max: 24.95 },
  },

  {
    id: 'dial',
    name: 'Dial indicator',
    subtitle: 'One revolution per millimetre, 0.01 mm per division',
    range: '0–10 mm travel',
    resolution: 0.01,
    accent: '#ff4d4d',
    blurb:
      'A micrometer tells you how thick something is. A dial indicator tells you how much something moves, which is a different question and the one that decides whether a brake job comes back. Runout and bearing play are both movement, and both have limits measured in hundredths.',
    howTo: [
      'Read the **small counter** for whole millimetres of plunger travel',
      'Read the **big needle** for hundredths — one full revolution is 1.00 mm',
      'Add them together',
      'For runout and play the number that matters is the **difference** between the highest and lowest reading through a full rotation, not either reading on its own',
    ],
    worked: {
      value: 1.12,
      parts: [
        'the counter has moved past 1, so 1 whole millimetre of travel',
        'the needle sits on 12, which is 0.12 mm',
        '1 + 0.12 = 1.12 mm',
        'as a hub play figure that is more than eight times the 0.13 mm limit — the bearing is finished',
      ],
    },
    usedFor: [
      { spec: 'Rotor lateral runout — max 0.04 mm assembled', where: 'Front Disc Brake Service', procedureId: 'civic-front-brakes' },
      { spec: 'Hub flange play — max 0.13 mm', where: 'Front Hub Bearing Replacement', procedureId: 'silverado-hub-bearing' },
      { spec: 'Rear rotor runout — max 0.05 mm', where: 'Rear Disc Brake Service', procedureId: 'camry-rear-brakes' },
    ],
    technique: [
      'Base the magnet on something **rigid** — the knuckle or the strut body, never a hose bracket or the spring',
      'Set the stem **perpendicular** to the surface. At 30° off square you read about 13% low, and nothing warns you',
      'Preload the plunger roughly half a revolution so it can read in both directions, then zero the bezel',
      'Turn the rotor slowly by hand through a full revolution and watch for the highest and lowest points',
    ],
    mistake:
      'Clamping the magnetic base to the coil spring or the brake hose bracket. Everything you then measure includes the base flexing, and the reading changes depending on how hard you lean on the car.',
    drill: { min: 0.05, max: 2.5 },
  },
]

export const instrumentById = (id: string) => INSTRUMENTS.find((i) => i.id === id)

/**
 * A drill reading, rounded onto the instrument's own resolution so the answer
 * is always exactly readable off the scale rather than between two divisions.
 */
export function randomReading(inst: Instrument) {
  const steps = Math.round((inst.drill.max - inst.drill.min) / inst.resolution)
  const n = Math.floor(Math.random() * (steps + 1))
  return Math.round((inst.drill.min + n * inst.resolution) / inst.resolution) * inst.resolution
}
