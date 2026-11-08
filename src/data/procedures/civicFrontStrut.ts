import type { Procedure } from '../../lib/types'

const ON_BENCH = ['tower', 'upperNuts', 'knuckle', 'ballJoint', 'controlArm', 'swayLink', 'swayBar', 'strutBolts']

export const civicFrontStrut: Procedure = {
  id: 'civic-front-strut',
  title: 'Front Strut & Spring Replacement',
  subtitle: 'MacPherson strut assembly — the stored-energy job',
  primaryVehicleId: 'civic-2016',
  alsoApplies: ['camry-2014', 'accord-v6-2009'],
  system: 'suspension',
  location: 'wheel',
  difficulty: 4,
  timeMin: 180,
  assembly: 'strutFront',
  summary:
    'A compressed coil spring holds enough energy to kill someone. This procedure covers the whole MacPherson corner — what each piece does, how the assembly comes apart safely, and why the car needs an alignment afterwards whether or not anything looks moved.',
  objectives: [
    'Name every component of a MacPherson strut assembly and describe its function',
    'Use a spring compressor correctly and recognise an unsafe setup',
    'Explain why the upper mount and bearing are replaced with the strut',
    'Identify which fasteners must be torqued at ride height and why',
    'Explain why strut replacement always requires a four-wheel alignment',
  ],
  tools: [
    { name: 'Floor jack + 2 jack stands', category: 'safety' },
    { name: 'Safety glasses + face shield', detail: 'Non-negotiable for spring work', category: 'safety' },
    { name: 'Coil spring compressor', detail: 'Clamshell wall-mount preferred over hook-type', category: 'specialty' },
    { name: 'Strut nut socket set', detail: 'Holds the rod while the nut turns', category: 'specialty' },
    { name: 'Ball joint separator', category: 'specialty' },
    { name: '17 / 19 / 21 mm sockets + wrenches', category: 'hand' },
    { name: 'Torque wrench 20–250 N·m', category: 'measure' },
    { name: 'Second floor jack', detail: 'To load the suspension to ride height', category: 'hand' },
    { name: 'Penetrating oil', category: 'consumable' },
    { name: 'Thread locker, medium strength', category: 'consumable' },
  ],
  parts: [
    { name: 'Strut assembly (complete)', qty: '2', note: 'A pre-assembled unit avoids spring compressor work entirely' },
    { name: 'Upper strut mount', qty: '2', note: 'Replace with the strut — it is a wear item' },
    { name: 'Thrust bearing', qty: '2', note: 'Causes the clicking-while-turning complaint when worn' },
    { name: 'Bump stop + dust boot', qty: '2' },
    { name: 'Stabilizer link', qty: '2', note: 'Usually seized and destroyed on removal' },
  ],
  torqueTable: [
    { fastener: 'Damper-to-knuckle flange bolt', nm: 157, ftlb: 116, note: 'Replace fastener if it is a stretch bolt' },
    { fastener: 'Upper mount nut (×3)', nm: 29, ftlb: 21, pattern: 'Alternating' },
    { fastener: 'Damper shaft centre nut', nm: 29, ftlb: 21, note: 'Self-locking — use a new nut' },
    { fastener: 'Lower arm ball joint nut', nm: 59, ftlb: 44 },
    { fastener: 'Stabilizer link nut', nm: 44, ftlb: 32 },
    { fastener: 'Lower arm to subframe', nm: 103, ftlb: 76, note: 'Torque at ride height' },
    { fastener: 'Wheel lug nut', nm: 108, ftlb: 80, pattern: 'Star, two passes' },
  ],
  hazards: [
    {
      kind: 'spring',
      text:
        'A compressed front coil stores roughly the energy of a brick dropped from a second-floor window. It releases all of it in one direction, instantly, if a compressor slips.',
    },
    { kind: 'crush', text: 'The knuckle swings freely once the strut is out. It is heavy and it will find your fingers.' },
    { kind: 'eye', text: 'Face shield for spring work, not just glasses.' },
    { kind: 'sharp', text: 'Rusty spring seats and torn boots have edges.' },
  ],
  steps: [
    {
      id: 'u1',
      title: 'Learn the assembly before you touch it',
      body:
        'A MacPherson strut does three jobs at once: it damps, it carries the spring, and it is a **structural suspension link** that locates the top of the knuckle. That third job is why replacing one changes your alignment.',
      detail: [
        'Damper: converts suspension movement into heat',
        'Coil spring: carries the corner weight',
        'Upper mount + bearing: the pivot the whole assembly steers around',
        'Bump stop: the last line of defence before metal-to-metal',
      ],
      camera: { pos: [4.2, 1.6, 4.6], target: [0, 0.2, 0] },
      explode: 0.35,
      hotspots: [
        { part: 'strut', label: 'Damper' },
        { part: 'spring', label: 'Coil spring' },
        { part: 'upperMount', label: 'Upper mount' },
        { part: 'knuckle', label: 'Steering knuckle' },
      ],
      durationMin: 10,
      tip: 'Drag the explode slider through its full range here. The stacking order of the top hat is the part people reassemble wrong.',
    },
    {
      id: 'u2',
      title: 'Loosen the top nuts before you lift',
      body:
        'The three upper mount nuts live in the engine bay. **Loosen them — do not remove them — with the suspension still loaded.** Once the wheel is off the ground the strut can rotate, and you will be fighting it.',
      camera: { pos: [1.2, 3.2, 3.0], target: [0, 1.3, 0] },
      focus: ['upperNuts', 'tower'],
      hotspots: [{ part: 'upperNuts', label: 'Upper mount nut ×3', spec: '29 N·m' }],
      explode: 0.1,
      durationMin: 10,
    },
    {
      id: 'u3',
      title: 'Disconnect the stabilizer link',
      body:
        'The sway bar link bolts to the strut body. Expect the stud to spin in its socket — hold it with a hex key or grip the stud with vice grips. These links are usually destroyed on removal, which is why new ones are on the parts list.',
      camera: { pos: [3.0, 0.6, 2.6], target: [0.5, -0.3, 0] },
      focus: ['swayLink', 'swayBar'],
      hotspots: [{ part: 'swayLink', label: 'Stabilizer link', spec: '44 N·m' }],
      explode: 0.3,
      torque: [{ fastener: 'Stabilizer link nut', nm: 44, ftlb: 32 }],
      durationMin: 15,
    },
    {
      id: 'u4',
      title: 'Separate the strut from the knuckle',
      body:
        'Two large bolts clamp the damper into the knuckle at **157 N·m**. Support the knuckle before the second one comes out — the moment it does, the whole hub assembly hangs on the lower ball joint and the brake hose.',
      detail: [
        'Soak the bolts in penetrating oil first; they corrode in place',
        'Mark the bolt positions if the holes are slotted for camber adjustment',
        'Support the knuckle on a jack stand or hang it with wire',
      ],
      camera: { pos: [2.4, -0.4, 3.4], target: [0, -0.7, 0] },
      focus: ['strutBolts', 'knuckle'],
      hotspots: [
        { part: 'strutBolts', label: 'Flange bolt ×2', spec: '157 N·m' },
        { part: 'knuckle', label: 'Steering knuckle' },
      ],
      explode: 0.4,
      hazards: ['crush'],
      torque: [{ fastener: 'Damper-to-knuckle flange bolt', nm: 157, ftlb: 116 }],
      durationMin: 25,
      mistake:
        'Letting the knuckle drop and hang on the brake hose or the CV joint. The hose tears internally and the inner CV boot can be pulled off its race.',
    },
    {
      id: 'u5',
      title: 'Remove the assembly from the car',
      body:
        'Take the three upper nuts off and lower the assembly out through the wheel well. It is heavier than it looks. Get both hands on it.',
      camera: { pos: [3.4, 1.4, 3.8], target: [0, 0.4, 0] },
      focus: ['upperNuts', 'upperMount', 'strut', 'spring'],
      explode: 0.2,
      durationMin: 10,
    },
    {
      id: 'u6',
      title: 'Compress the spring — the dangerous part',
      body:
        'Fit the compressor on **opposing sides of the coil, gripping at least four coils each, seated squarely in the coil pitch**. Tighten both sides alternately and evenly, a few turns at a time. Stand to one side. Never put your head over the assembly.',
      detail: [
        'Clamshell or wall-mounted compressors are far safer than hook-type bolt compressors',
        'If a hook slips off a coil even once, stop and start over — do not "just hold it"',
        'Compress only until the spring is free of its seats, not as far as the tool will go',
        'If you are at all unsure: buy a pre-assembled strut and skip this step entirely',
      ],
      camera: { pos: [2.8, 1.0, 3.0], target: [0, 0.4, 0] },
      focus: ['spring', 'upperSeat', 'lowerSeat'],
      hotspots: [
        { part: 'spring', label: 'Coil spring', spec: 'stored energy' },
        { part: 'upperSeat', label: 'Upper seat' },
      ],
      explode: 0.25,
      hazards: ['spring', 'eye'],
      durationMin: 30,
      mistake:
        'Using the hook-type compressor that came free with a loaner tool set, on four unevenly spaced coils, with your face directly above it. This is how people lose eyes.',
    },
    {
      id: 'u7',
      title: 'Undo the centre nut and strip the top hat',
      body:
        'With the spring compressed and off its seats, hold the damper rod and take off the centre nut. Lay the parts out in order: **nut, mount, bearing, upper seat, bump stop, boot**. That order is the step most people get wrong on reassembly.',
      camera: { pos: [2.0, 2.2, 2.6], target: [0, 1.0, 0] },
      focus: ['centreNut', 'upperMount', 'bearing', 'upperSeat', 'bumpStop', 'dustBoot'],
      hotspots: [
        { part: 'centreNut', label: 'Centre nut', spec: '29 N·m, new nut' },
        { part: 'bearing', label: 'Thrust bearing' },
        { part: 'bumpStop', label: 'Bump stop' },
      ],
      explode: 0.8,
      torque: [{ fastener: 'Damper shaft centre nut', nm: 29, ftlb: 21 }],
      durationMin: 20,
      tip:
        'A notchy, clicking feel when you turn the steering wheel at a standstill is almost always this thrust bearing. It is cheap. Replace it while it is in your hand.',
    },
    {
      id: 'u8',
      title: 'Rebuild, respecting the spring seats',
      body:
        'New strut, new mount, new bearing. The **spring end must sit in the step moulded into the lower seat** — if it is not indexed correctly the spring will sit crooked and the ride height will be wrong on that corner. Torque the centre nut, then release the compressor slowly.',
      camera: { pos: [2.6, 1.2, 3.0], target: [0, 0.4, 0] },
      focus: ['spring', 'lowerSeat', 'upperSeat', 'upperMount', 'centreNut'],
      hotspots: [
        { part: 'lowerSeat', label: 'Lower seat — index the coil end' },
        { part: 'upperMount', label: 'New upper mount' },
      ],
      explode: 0.3,
      hazards: ['spring'],
      durationMin: 25,
    },
    {
      id: 'u9',
      title: 'Install, then torque at ride height',
      body:
        'Fit the assembly, start the upper nuts, then reconnect the knuckle. **Bushing fasteners get their final torque with the suspension loaded**, not hanging. Jack the lower arm until the car is at normal ride height, then torque.',
      detail: [
        'Rubber bushings set their neutral position at whatever angle you torque them',
        'Torque a bushing bolt with the arm hanging and the bushing is pre-twisted for life',
        'Use the second jack under the lower arm to simulate ride height',
      ],
      camera: { pos: [3.0, 0.2, 3.6], target: [0, -0.8, 0] },
      focus: ['controlArm', 'strutBolts', 'ballJoint'],
      hotspots: [
        { part: 'controlArm', label: 'Lower arm — torque at ride height', spec: '103 N·m' },
        { part: 'ballJoint', label: 'Ball joint nut', spec: '59 N·m' },
      ],
      explode: 0.1,
      torque: [
        { fastener: 'Damper-to-knuckle flange bolt', nm: 157, ftlb: 116 },
        { fastener: 'Upper mount nut (×3)', nm: 29, ftlb: 21 },
        { fastener: 'Lower arm to subframe', nm: 103, ftlb: 76, note: 'At ride height' },
      ],
      durationMin: 30,
    },
    {
      id: 'u10',
      title: 'Book the alignment',
      body:
        'The strut locates the top of the knuckle, so replacing it has changed camber and quite possibly caster. **A four-wheel alignment is part of this job, not an optional extra.** Skipping it costs a set of tyres.',
      camera: { pos: [4.4, 1.6, 4.8], target: [0, 0, 0] },
      explode: 0,
      durationMin: 5,
      tip:
        'Bounce the car several times and roll it a few metres before measuring anything. Suspension needs to settle before the numbers mean anything.',
    },
  ],
  hiddenByStep: {
    u1: [],
    u2: [],
    u3: [],
    u4: ['swayLink'],
    u5: ['swayLink', 'strutBolts'],
    u6: ON_BENCH,
    u7: ON_BENCH,
    u8: ON_BENCH,
    u9: [],
    u10: [],
  },
  checkpoints: [
    {
      id: 'uc1',
      afterStep: 'u6',
      question:
        'You have a hook-type spring compressor with the hooks engaged on two coils on each side. The spring is nearly free of its seat. What is the problem?',
      options: [
        {
          text: 'Two coils per side is not enough engagement — the hooks can roll off under load and release the spring',
          correct: true,
          why:
            'More engaged coils spread the load and keep the hooks from tipping out of the coil pitch. Minimum four coils per side, seated square, is the rule. A clamshell compressor removes the problem entirely.',
        },
        {
          text: 'Nothing — two coils is standard for a front strut',
          why: 'It is common practice and it is also how most spring compressor injuries happen.',
        },
        {
          text: 'The compressor should be on three sides, not two',
          why: 'Opposing pairs are correct geometry. The issue is how many coils each side grips.',
        },
        {
          text: 'The spring should be compressed fully before removing the nut',
          why:
            'Over-compressing adds stored energy for no benefit. You compress only until the spring is off its seats.',
        },
      ],
    },
    {
      id: 'uc2',
      afterStep: 'u9',
      question: 'Why do rubber-bushed suspension fasteners get torqued with the suspension at ride height?',
      options: [
        {
          text: 'The rubber bonds to both sleeves, so whatever angle you torque it at becomes its zero-stress position',
          correct: true,
          why:
            'Exactly. Torque it hanging and the bushing sits permanently pre-twisted at ride height, which shortens its life and subtly changes how the suspension moves.',
        },
        {
          text: 'The bolt will not reach full torque with the suspension unloaded',
          why: 'The fastener reaches torque either way. It is the rubber that remembers the angle.',
        },
        {
          text: 'So the alignment is correct before the wheels touch the ground',
          why: 'Alignment is set separately and is not what this rule protects.',
        },
        {
          text: 'To avoid cross-threading the bolt into the subframe',
          why: 'Thread engagement does not depend on suspension position.',
        },
      ],
    },
  ],
}
