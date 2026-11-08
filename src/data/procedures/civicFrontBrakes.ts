import type { Procedure } from '../../lib/types'

const WHEEL_OFF = ['wheel', 'lugNuts']
const CALIPER_OFF = [...WHEEL_OFF, 'caliper', 'guidePins']
const PADS_OFF = [...CALIPER_OFF, 'padInner', 'padOuter', 'shims']
const BRACKET_OFF = [...PADS_OFF, 'bracket', 'bracketBolts']

export const civicFrontBrakes: Procedure = {
  id: 'civic-front-brakes',
  title: 'Front Disc Brake Service',
  subtitle: 'Pads, rotors and caliper hardware',
  primaryVehicleId: 'civic-2016',
  alsoApplies: ['accord-v6-2009', 'camry-2014'],
  system: 'brakes',
  location: 'wheel',
  difficulty: 2,
  timeMin: 75,
  assembly: 'brakeFront',
  summary:
    'The job every mechanic does in their first week, and the one most enthusiasts get half-right. You will take a front corner apart in the correct order, learn what to measure before you decide anything needs replacing, and torque it back together to spec instead of to feel.',
  objectives: [
    'Identify every component in a single-piston sliding-caliper corner and say what it does',
    'Measure pad thickness, rotor thickness and lateral runout, and compare against discard specs',
    'Explain why the caliper bracket bolts and the guide pin bolts have wildly different torques',
    'Compress a caliper piston without damaging the dust boot or contaminating the fluid',
    'Torque lug nuts in a star pattern and explain what happens when you do not',
  ],
  tools: [
    { name: 'Floor jack + 2 jack stands', detail: 'Rated above vehicle weight', category: 'safety' },
    { name: 'Wheel chocks', category: 'safety' },
    { name: 'Safety glasses', detail: 'Brake dust and spring clips', category: 'safety' },
    { name: '19 mm socket + breaker bar', detail: 'Lug nuts', category: 'hand' },
    { name: '12 mm socket', detail: 'Caliper guide pin bolts', category: 'hand' },
    { name: '17 mm socket', detail: 'Caliper bracket bolts', category: 'hand' },
    { name: 'Click torque wrench, 20–150 N·m', detail: 'Calibrated within 12 months', category: 'measure' },
    { name: 'Outside micrometer, 0–25 mm', detail: 'Rotor thickness', category: 'measure' },
    { name: 'Dial indicator + magnetic base', detail: 'Lateral runout', category: 'measure' },
    { name: 'Caliper piston compressor or large C-clamp', category: 'specialty' },
    { name: 'Wire brush + brake hub cleaning disc', category: 'specialty' },
    { name: 'Bungee cord or mechanics wire', detail: 'To hang the caliper', category: 'hand' },
    { name: 'Brake cleaner', detail: 'Non-chlorinated', category: 'consumable' },
    { name: 'High-temp synthetic caliper grease', detail: 'Never use chassis grease', category: 'consumable' },
    { name: 'Nitrile gloves', category: 'safety' },
  ],
  parts: [
    { name: 'Front brake pad set', qty: '1 set (4 pads)', note: 'Includes shims and wear sensors' },
    { name: 'Front brake rotor', qty: '2', note: 'Replace in pairs, never one side only' },
    { name: 'Caliper hardware kit', qty: '1', note: 'Guide pin boots, clips, retainers' },
  ],
  fluids: [{ name: 'Brake fluid', spec: 'DOT 3', qty: 'Top-up only' }],
  torqueTable: [
    { fastener: 'Wheel lug nut', nm: 108, ftlb: 80, pattern: 'Star / criss-cross, two passes' },
    { fastener: 'Caliper guide pin bolt', nm: 32, ftlb: 24, note: 'Caliper body to bracket' },
    { fastener: 'Caliper bracket bolt', nm: 136, ftlb: 100, note: 'Bracket to steering knuckle' },
    { fastener: 'Brake hose banjo bolt', nm: 34, ftlb: 25, note: 'New sealing washers both sides' },
    { fastener: 'Rotor retaining screw', nm: 10, ftlb: 7, note: 'Locating screw only, not a clamp' },
    { fastener: 'Bleeder screw', nm: 8, ftlb: 6 },
  ],
  hazards: [
    { kind: 'crush', text: 'A vehicle on a jack alone can drop. Jack stands on the factory lift points, every time.' },
    { kind: 'eye', text: 'Pad retaining clips are spring steel under tension and they do launch. Glasses on.' },
    { kind: 'chemical', text: 'Brake fluid strips paint and irritates skin. Brake dust should never be blown with air — wipe it.' },
    { kind: 'burn', text: 'Rotors stay hot long after a drive. Touch the wheel first, not the rotor.' },
  ],
  steps: [
    {
      id: 's1',
      title: 'Set the vehicle up before you lift it',
      body:
        'Park on level ground, chock the rear wheels, then **crack the lug nuts loose while the tyre is still on the ground**. A wheel that can spin cannot be loosened, and standing on a breaker bar at full lift height is how people pull cars off stands.',
      detail: [
        'Transmission in Park (or in gear for the manual), parking brake set',
        'Break each lug nut about a quarter turn — loose, not off',
        'Lift at the pinch-weld jack point, then place stands at the rated points',
        'Shake the car. If it moves on the stands, start again',
      ],
      camera: { pos: [4.6, 2.6, 5.2], target: [0, 0, 0] },
      explode: 0,
      hazards: ['crush'],
      durationMin: 8,
      tip: 'Loosen, lift, remove. Install, lower, torque. The nuts only get their final torque with the tyre loaded.',
    },
    {
      id: 's2',
      title: 'Remove the wheel',
      body:
        'Take the lug nuts the rest of the way off and lift the wheel straight off the studs. Lay it face-up under the sill — if the car ever comes off the stands, the wheel is what stops it reaching the ground.',
      camera: { pos: [3.4, 1.4, 4.4], target: [0, 0, 0.3] },
      focus: ['lugNuts', 'wheel'],
      hotspots: [
        { part: 'lugNuts', label: 'Lug nut ×5', spec: '108 N·m' },
        { part: 'wheel', label: 'Road wheel' },
      ],
      explode: 0.25,
      torque: [{ fastener: 'Wheel lug nut', nm: 108, ftlb: 80, pattern: 'Star pattern on reassembly' }],
      durationMin: 4,
      mistake:
        'Running the lugs off with an impact and letting the wheel drop onto the studs. That bends studs and chews the seats.',
    },
    {
      id: 's3',
      title: 'Inspect before you decide anything',
      body:
        'Now the corner is open, measure. A brake job you talked yourself into is still a brake job you did not need. **Pad friction material below 1.6 mm, or a rotor under its discard thickness, is the only thing that makes this job necessary.**',
      detail: [
        'Pad friction thickness, measured at the thinnest point, not the middle',
        'Rotor thickness with a micrometer at four points around the disc',
        'Look at the wear pattern — tapered pads mean a sticking slide pin, not worn pads',
        'Check the inner pad as well. It is the one that wears first on a sliding caliper',
      ],
      camera: { pos: [-2.6, 0.9, 2.8], target: [-0.6, 0, 0] },
      focus: ['padOuter', 'padInner', 'rotor'],
      hotspots: [
        { part: 'padOuter', label: 'Outer pad', spec: 'min 1.6 mm' },
        { part: 'rotor', label: 'Rotor', spec: 'new 23 mm / discard 21 mm' },
      ],
      measure: [
        { name: 'Pad friction thickness', spec: 'Replace below 1.6 mm', tool: 'Vernier or pad gauge' },
        { name: 'Rotor thickness', spec: 'New 23.0 mm, discard 21.0 mm', tool: 'Outside micrometer' },
        { name: 'Rotor lateral runout', spec: 'Max 0.04 mm', tool: 'Dial indicator on hub' },
        { name: 'Thickness variation', spec: 'Max 0.015 mm', tool: 'Micrometer, 8 points' },
      ],
      explode: 0.15,
      durationMin: 10,
      tip:
        'Uneven pad wear side to side is a diagnosis, not an inconvenience. Find out why before you bolt new parts to a broken caliper.',
    },
    {
      id: 's4',
      title: 'Unbolt the caliper from its bracket',
      body:
        'The two **guide pin bolts** hold the caliper body to the bracket. They are 12 mm head and only 32 N·m — they are not what holds the brake to the car. Hold the slide pin with a wrench if it tries to turn with the bolt.',
      camera: { pos: [-2.4, 0.6, 2.2], target: [-0.7, 0, 0] },
      focus: ['guidePins', 'caliper'],
      hotspots: [
        { part: 'guidePins', label: 'Guide pin bolt ×2', spec: '32 N·m' },
        { part: 'caliper', label: 'Caliper body' },
      ],
      explode: 0.3,
      torque: [{ fastener: 'Caliper guide pin bolt', nm: 32, ftlb: 24 }],
      durationMin: 6,
    },
    {
      id: 's5',
      title: 'Support the caliper — never by the hose',
      body:
        'Lift the caliper off and hang it from the spring or control arm with a bungee. **The flexible hose is not a strap.** Hanging a caliper by its hose tears the inner liner, and the failure shows up as a dragging brake six months later.',
      camera: { pos: [-2.8, 1.6, 2.6], target: [-0.7, 0.5, 0] },
      focus: ['caliper', 'hose'],
      hotspots: [{ part: 'hose', label: 'Flexible brake hose', spec: 'Do not load' }],
      explode: 0.45,
      hazards: ['chemical'],
      durationMin: 3,
      mistake:
        'Letting the caliper dangle. Also: cracking the banjo bolt "just to get some slack" — now you own a bleed job you did not plan for.',
    },
    {
      id: 's6',
      title: 'Pull the pads, shims and clips',
      body:
        'Note how everything came out before it comes out. The shims stack in a specific order, the wear-sensor pad goes on a specific side, and the retaining clips are handed. Lay them on the bench in the orientation they were fitted.',
      camera: { pos: [-2.2, 0.4, 2.6], target: [-0.66, 0, 0] },
      focus: ['padInner', 'padOuter', 'shims'],
      hotspots: [
        { part: 'padInner', label: 'Inner pad' },
        { part: 'padOuter', label: 'Outer pad' },
        { part: 'shims', label: 'Anti-squeal shims' },
      ],
      explode: 0.55,
      durationMin: 5,
      tip: 'Photograph it on your phone before disassembly. Every experienced tech does this and nobody admits it.',
    },
    {
      id: 's7',
      title: 'Remove the caliper bracket',
      body:
        'Two 17 mm bolts into the steering knuckle, and these are the ones that matter — **136 N·m**. They are often seized with corrosion. Use a six-point socket and a breaker bar, not a ratchet, and never an extension on a torque wrench to crack them loose.',
      camera: { pos: [-3.0, 0.8, 1.6], target: [-0.9, 0, -0.2] },
      focus: ['bracket', 'bracketBolts'],
      hotspots: [
        { part: 'bracketBolts', label: 'Bracket bolt ×2', spec: '136 N·m' },
        { part: 'bracket', label: 'Caliper bracket' },
      ],
      explode: 0.6,
      torque: [{ fastener: 'Caliper bracket bolt', nm: 136, ftlb: 100 }],
      durationMin: 6,
    },
    {
      id: 's8',
      title: 'Get the rotor off',
      body:
        'Back out the small retaining screw, then pull the rotor. If rust has welded the hat to the hub, thread two bolts into the **service holes** in the rotor face and tighten them evenly to press it off. Hitting a rotor you intend to reuse with a hammer is how you create runout.',
      detail: [
        'Remove the Phillips or Torx locating screw first — it shears easily if you pull against it',
        'Use the two threaded service holes with 8 mm bolts, alternating a half turn at a time',
        'If you must strike it, strike the hat between the studs with a dead-blow, never the friction surface',
      ],
      camera: { pos: [2.2, 1.0, 3.4], target: [0, 0, 0.2] },
      focus: ['rotor'],
      hotspots: [{ part: 'rotor', label: 'Rotor', spec: '282 mm vented' }],
      explode: 0.7,
      durationMin: 8,
    },
    {
      id: 's9',
      title: 'Clean the hub mounting face',
      body:
        'This is the step that separates a brake job from a brake job that comes back. **Every bit of rust scale on the hub face becomes runout in the new rotor**, and runout becomes a pulsating pedal in 5,000 miles. Clean it to bare metal.',
      detail: [
        'Hub cleaning disc on a die grinder, or a wire brush and patience',
        'Check the face with a straight edge once it is clean',
        'With the new rotor mounted and a lug nut pattern snugged, confirm runout under 0.04 mm',
      ],
      camera: { pos: [1.6, 0.8, 2.6], target: [0, 0, -0.2] },
      focus: ['hub'],
      hotspots: [{ part: 'hub', label: 'Hub / bearing flange', spec: 'runout < 0.04 mm' }],
      measure: [{ name: 'Assembled lateral runout', spec: 'Max 0.04 mm', tool: 'Dial indicator' }],
      explode: 0.75,
      durationMin: 10,
      tip:
        'If runout is still out of spec on a clean hub, index the rotor one stud position at a time. You can often dial out 0.02 mm for free.',
    },
    {
      id: 's10',
      title: 'Service the slide pins',
      body:
        'Pull each slide pin, wipe the bore, inspect the rubber boots for splits, and re-lube with **high-temperature synthetic caliper grease**. A seized pin is the single most common cause of one-side-only pad wear.',
      camera: { pos: [-2.4, 0.5, 2.2], target: [-0.7, 0, 0] },
      focus: ['guidePins', 'bracket'],
      hotspots: [{ part: 'guidePins', label: 'Slide pin + boot', spec: 'must move freely by hand' }],
      explode: 0.5,
      durationMin: 8,
      mistake:
        'Packing the pin bore with ordinary chassis grease. It swells the rubber boots and the pin locks solid.',
    },
    {
      id: 's11',
      title: 'Compress the piston',
      body:
        'Push the piston back into its bore slowly and squarely. **Open the master cylinder reservoir cap** first so fluid has somewhere to go, and check the level afterwards — pushing four pistons back will raise it.',
      detail: [
        'Press on the piston face through an old pad, never directly on the dust boot',
        'Go slowly. Fast compression forces debris back through the ABS unit',
        'If the piston will not move, the caliper is the problem, not the pads',
      ],
      camera: { pos: [-2.6, 0.3, 1.8], target: [-0.7, 0, -0.1] },
      focus: ['caliper'],
      hotspots: [{ part: 'caliper', label: 'Piston + dust boot', spec: 'bore 54 mm' }],
      explode: 0.4,
      hazards: ['chemical', 'pressure'],
      durationMin: 5,
      mistake:
        'Cracking the bleeder to let fluid out instead. Some shops do it; it also lets air in and commits you to a full bleed.',
    },
    {
      id: 's12',
      title: 'Mount the new rotor',
      body:
        'Clean the protective oil film off the friction surfaces with brake cleaner — it is there to stop corrosion in the box, and it will contaminate new pads. Fit the rotor and snug the locating screw.',
      camera: { pos: [2.4, 1.0, 3.2], target: [0, 0, 0.1] },
      focus: ['rotor', 'hub'],
      hotspots: [{ part: 'rotor', label: 'New rotor', spec: 'degrease both faces' }],
      explode: 0.2,
      torque: [{ fastener: 'Rotor retaining screw', nm: 10, ftlb: 7 }],
      durationMin: 5,
    },
    {
      id: 's13',
      title: 'Bracket back on, to full torque',
      body:
        'Start both bolts by hand, then torque to **136 N·m**. Use a calibrated click wrench and pull smoothly to the click — a jerk past the setting is an over-torque you cannot see.',
      camera: { pos: [-2.8, 0.8, 1.8], target: [-0.9, 0, -0.2] },
      focus: ['bracket', 'bracketBolts'],
      hotspots: [{ part: 'bracketBolts', label: 'Bracket bolt', spec: '136 N·m' }],
      explode: 0.12,
      torque: [{ fastener: 'Caliper bracket bolt', nm: 136, ftlb: 100 }],
      durationMin: 5,
    },
    {
      id: 's14',
      title: 'Fit pads, shims and hardware',
      body:
        'Shims stack in the order they came off. A thin film of caliper grease goes on the **pad backing plate contact points and the ears**, never on the friction surface and never on the rotor.',
      detail: [
        'New clips and retainers from the hardware kit, not the old ones',
        'Wear-sensor pad on the side the old one came from',
        'Pads should drop into the bracket and still slide by hand',
      ],
      camera: { pos: [-2.2, 0.4, 2.4], target: [-0.66, 0, 0] },
      focus: ['padInner', 'padOuter', 'shims'],
      hotspots: [
        { part: 'padInner', label: 'Inner pad' },
        { part: 'shims', label: 'Shim stack' },
      ],
      explode: 0.3,
      durationMin: 8,
    },
    {
      id: 's15',
      title: 'Caliper on, guide pin bolts to spec',
      body:
        'Lower the caliper over the pads, start both guide pin bolts, and torque to **32 N·m**. This is the torque people get wrong in the other direction — they put 100 N·m into a 32 N·m bolt and strip the slide pin.',
      camera: { pos: [-2.4, 0.6, 2.2], target: [-0.7, 0, 0] },
      focus: ['caliper', 'guidePins'],
      hotspots: [{ part: 'guidePins', label: 'Guide pin bolt', spec: '32 N·m' }],
      explode: 0.1,
      torque: [{ fastener: 'Caliper guide pin bolt', nm: 32, ftlb: 24 }],
      durationMin: 5,
    },
    {
      id: 's16',
      title: 'Wheel on, torque in a star pattern',
      body:
        'Hand-start every nut before any of them get tightened. Snug in a **star pattern**, lower the car so the tyre is loaded, then torque to **108 N·m** in the same pattern. Re-check after 50 miles.',
      detail: [
        'Never use an impact gun for final torque, even with torque sticks',
        'Two passes: about half torque all round, then full torque all round',
        'Dry threads. Oil on a lug stud changes the clamp load for a given torque',
      ],
      camera: { pos: [3.4, 1.4, 4.4], target: [0, 0, 0.3] },
      focus: ['wheel', 'lugNuts'],
      hotspots: [{ part: 'lugNuts', label: 'Lug nut', spec: '108 N·m, star pattern' }],
      explode: 0,
      torque: [{ fastener: 'Wheel lug nut', nm: 108, ftlb: 80, pattern: 'Star, two passes' }],
      durationMin: 6,
      mistake:
        'Tightening nuts in a circle. It pulls the wheel off-centre against the hub and is a classic cause of a warped-feeling rotor.',
    },
    {
      id: 's17',
      title: 'Pump the pedal, then bed the brakes',
      body:
        'Before the car moves: **pump the pedal until it is firm**. The pistons are retracted and the first pedal application will go to the floor. Then bed the pads with a series of moderate stops so the friction material transfers an even layer onto the rotor.',
      detail: [
        'Pump to a firm pedal, confirm fluid level, refit the reservoir cap',
        'Roll forward at walking pace and confirm the brakes stop the car at all',
        'Bedding: 6–8 stops from roughly 50 to 15 km/h, firm but not an emergency stop',
        'Then drive several minutes without using the brakes to let them cool evenly',
      ],
      camera: { pos: [4.4, 2.4, 5.0], target: [0, 0, 0] },
      explode: 0,
      durationMin: 10,
      tip:
        'Do not come to a complete stop and hold the pedal while the rotors are glowing. That prints pad material onto one spot and makes a judder you will be blamed for.',
    },
  ],
  hiddenByStep: {
    s1: [],
    s2: [],
    s3: WHEEL_OFF,
    s4: WHEEL_OFF,
    s5: WHEEL_OFF,
    s6: [...WHEEL_OFF, 'caliper', 'guidePins'],
    s7: PADS_OFF,
    s8: BRACKET_OFF,
    s9: [...BRACKET_OFF, 'rotor'],
    s10: [...WHEEL_OFF, 'rotor', 'caliper', 'padInner', 'padOuter', 'shims'],
    s11: [...WHEEL_OFF, 'rotor', 'bracket', 'bracketBolts', 'padInner', 'padOuter', 'shims'],
    s12: PADS_OFF,
    s13: [...WHEEL_OFF, 'caliper', 'guidePins', 'padInner', 'padOuter', 'shims'],
    s14: CALIPER_OFF,
    s15: WHEEL_OFF,
    s16: [],
    s17: [],
  },
  checkpoints: [
    {
      id: 'cp1',
      afterStep: 's3',
      question:
        'The outer pad measures 7 mm of friction material and the inner pad measures 2 mm on the same corner. What does that tell you?',
      options: [
        {
          text: 'A slide pin or the piston is sticking — diagnose the caliper before fitting pads',
          correct: true,
          why:
            'Unequal wear across one caliper means the caliper is not releasing or sliding evenly. New pads on a sticking caliper will wear the same way within months.',
        },
        {
          text: 'Normal wear — the inner pad always wears faster',
          why:
            'The inner pad does often wear slightly faster on a sliding caliper, but a 5 mm difference is a fault, not a tendency.',
        },
        {
          text: 'The rotor is warped',
          why:
            'Rotor thickness variation causes a pulsating pedal, not a side-to-side difference in pad thickness on one caliper.',
        },
        {
          text: 'The pads were fitted in the wrong positions',
          why: 'Position affects the wear sensor, not the rate of wear between inner and outer.',
        },
      ],
    },
    {
      id: 'cp2',
      afterStep: 's9',
      question: 'Why does rust on the hub mounting face cause a pulsating brake pedal?',
      options: [
        {
          text: 'It holds the rotor at a slight angle, so the disc wobbles and the pads wear it unevenly into thick and thin spots',
          correct: true,
          why:
            'Exactly. Debris creates lateral runout; the high spot rubs each revolution and becomes thickness variation. That variation is what you feel in the pedal.',
        },
        {
          text: 'The rust transfers onto the pads and makes them grab',
          why: 'Contamination causes noise and poor bite, not a rhythmic pulsation tied to wheel speed.',
        },
        {
          text: 'It insulates the rotor so it cannot shed heat',
          why: 'Heat passes mostly through the friction surfaces and the vanes, not the mounting face.',
        },
        {
          text: 'It makes the lug nuts lose torque',
          why:
            'Corrosion on the face can cause a small loss of clamp load, but the pulsation comes from the geometry, not the fastener.',
        },
      ],
    },
    {
      id: 'cp3',
      afterStep: 's15',
      question:
        'The caliper bracket bolt is 136 N·m and the guide pin bolt is 32 N·m. Why the four-fold difference between two bolts on the same caliper?',
      options: [
        {
          text: 'The bracket bolts carry the whole braking torque into the knuckle; the guide pin bolts only locate the caliper body on its pins',
          correct: true,
          why:
            'Right. Load path decides torque. The bracket is structural, so it needs high clamp load. The guide pins just let the caliper float, and over-torquing them strips the pin or binds the slide.',
        },
        {
          text: 'The guide pin bolts are a smaller diameter, so the number is smaller',
          why:
            'Diameter is part of it, but the real reason is what each fastener is being asked to resist. A fastener spec follows its job.',
        },
        {
          text: 'The guide pin bolts get thread locker, which reduces the required torque',
          why: 'Thread locker is about retention, not a substitute for clamp load.',
        },
        {
          text: 'The bracket bolts are reused and the guide pin bolts are new',
          why: 'Neither is torque-to-yield here, and reuse does not drive this difference.',
        },
      ],
    },
  ],
}
