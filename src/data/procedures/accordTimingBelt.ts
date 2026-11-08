import type { Procedure } from '../../lib/types'

const ACC_OFF = ['accessoryBelt']
const PULLEY_OFF = [...ACC_OFF, 'crankPulley', 'crankBolt']
const COVERS_OFF = [...PULLEY_OFF, 'upperCover', 'lowerCover', 'coverBolts']

export const accordTimingBelt: Procedure = {
  id: 'accord-timing-belt',
  title: 'Timing Belt & Water Pump',
  subtitle: 'J35 V6 — setting valve timing on an interference engine',
  primaryVehicleId: 'accord-v6-2009',
  system: 'timing',
  location: 'underhood',
  difficulty: 5,
  timeMin: 300,
  assembly: 'timingV6',
  summary:
    'The job with the least margin for error that an enthusiast will ever attempt at home. One tooth out and the valves meet the pistons. You will set the engine to top dead centre, read the timing marks, replace the belt and the pump behind it, and verify timing by hand before the starter ever turns.',
  objectives: [
    'Define an interference engine and explain exactly what fails when the belt does',
    'Bring cylinder 1 to TDC on the compression stroke and confirm it three independent ways',
    'Read crankshaft and camshaft timing marks and recognise a one-tooth error',
    'Retract and pin a hydraulic belt tensioner without damaging it',
    'Explain why the water pump gets replaced whether or not it is leaking',
  ],
  tools: [
    { name: 'Engine support bar or second jack', detail: 'The right engine mount comes out', category: 'safety' },
    { name: 'Jack stands + wheel chocks', category: 'safety' },
    { name: 'Crankshaft pulley holder tool', detail: 'Honda 07AAB-001A or equivalent', category: 'specialty' },
    { name: '19 mm impact-grade socket', detail: 'Crank pulley bolt — 245 N·m', category: 'hand' },
    { name: '1/2" breaker bar, 600 mm minimum', category: 'hand' },
    { name: 'Torque wrench to 250 N·m', detail: 'Second, larger wrench for the crank bolt', category: 'measure' },
    { name: 'Torque wrench 10–60 N·m', category: 'measure' },
    { name: 'Allen key set', detail: 'Tensioner retraction', category: 'hand' },
    { name: 'Hex pin or drill bit, 2 mm', detail: 'Pins the tensioner plunger', category: 'specialty' },
    { name: 'Serpentine belt tool', category: 'specialty' },
    { name: 'Coolant drain pan + funnel kit', category: 'specialty' },
    { name: 'Paint pen or tipp-ex', detail: 'Marking belt direction and marks', category: 'consumable' },
    { name: 'Timing belt kit', detail: 'Belt, tensioner, idler, water pump, seals', category: 'consumable' },
  ],
  parts: [
    { name: 'Timing belt', qty: '1', note: 'OE or OE-supplier only. Never a budget belt on an interference engine' },
    { name: 'Hydraulic belt tensioner', qty: '1', note: 'Replace with the belt. Non-negotiable' },
    { name: 'Idler pulley', qty: '1' },
    { name: 'Water pump + O-ring', qty: '1', note: 'Driven by the timing belt — replace while you are in here' },
    { name: 'Serpentine (accessory) belt', qty: '1' },
    { name: 'Camshaft and crankshaft seals', qty: '1 set', note: 'Only if seeping — inspect first' },
    { name: 'Thermostat', qty: '1', note: 'Optional but cheap while the coolant is out' },
  ],
  fluids: [{ name: 'Engine coolant', spec: 'Honda Type 2 blue, pre-mixed', qty: '~6 qt total system' }],
  torqueTable: [
    { fastener: 'Crankshaft pulley bolt', nm: 245, ftlb: 181, note: 'Holder tool required. Lightly oil the threads' },
    { fastener: 'Camshaft sprocket bolt', nm: 83, ftlb: 61 },
    { fastener: 'Idler pulley bolt', nm: 39, ftlb: 29 },
    { fastener: 'Belt tensioner mounting bolt', nm: 29, ftlb: 21 },
    { fastener: 'Water pump bolt', nm: 12, ftlb: 9, pattern: 'Cross pattern, two passes' },
    { fastener: 'Timing cover bolt', nm: 10, ftlb: 7 },
    { fastener: 'Engine mount bracket bolt', nm: 54, ftlb: 40 },
  ],
  hazards: [
    { kind: 'crush', text: 'The engine is partly unsupported once the side mount is out. Support it before, not after.' },
    { kind: 'burn', text: 'Drain coolant cold. Opening a hot system sprays scalding coolant under pressure.' },
    { kind: 'chemical', text: 'Ethylene glycol is sweet, toxic and attractive to animals. Catch all of it and dispose of it properly.' },
    { kind: 'spring', text: 'The hydraulic tensioner holds real force. Retract it in a vice, slowly, and pin it.' },
  ],
  steps: [
    {
      id: 't1',
      title: 'Understand what you are about to risk',
      body:
        'The J35 is an **interference engine**: at some crank angles the valves occupy space the piston will later pass through. The belt is the only thing keeping those two events apart. If it breaks, or if you install it one tooth out, valves bend and the head comes off. This is why the job is done slowly and verified twice.',
      detail: [
        'Belt interval is 105,000 miles or 7 years, whichever comes first — age matters as much as mileage',
        'The water pump is driven by this belt, so a pump failure also takes out valve timing',
        'There is no "limp home" failure mode. It is fine, then it is a cylinder head',
      ],
      camera: { pos: [0.5, 2.0, 6.4], target: [0, 0.6, 0] },
      explode: 0,
      durationMin: 5,
      tip:
        'If the belt has never been changed and the car has 140,000 miles on it, do not start the engine to "move it into the garage". Push it.',
    },
    {
      id: 't2',
      title: 'Drain the coolant and strip the accessory drive',
      body:
        'Cold engine, radiator cap off, drain from the radiator petcock. Then release the serpentine belt tensioner and take the accessory belt off. Pull the right front wheel and the inner splash shield to reach the crank pulley.',
      camera: { pos: [2.6, 1.4, 5.2], target: [0, 0.2, 0] },
      focus: ['accessoryBelt'],
      hotspots: [{ part: 'accessoryBelt', label: 'Serpentine belt', spec: 'replace, do not reuse' }],
      explode: 0.2,
      hazards: ['burn', 'chemical'],
      durationMin: 40,
    },
    {
      id: 't3',
      title: 'Bring cylinder 1 to TDC — and prove it',
      body:
        'Rotate the crank **clockwise only**, by the crank bolt, until the crankshaft pulley mark lines up with the pointer on the lower cover. Then confirm you are at TDC compression, not TDC exhaust: both camshaft marks must also be at their index positions.',
      detail: [
        'Never rotate the engine backwards — it unloads the tensioner and can jump a tooth',
        'Confirmation 1: crank pulley mark at the pointer',
        'Confirmation 2: both cam sprocket marks aligned with their index marks on the back cover',
        'Confirmation 3 (belt removed): the keyway on the crank sprocket points straight up',
      ],
      camera: { pos: [0.2, 1.4, 6.6], target: [0, 0.4, 0] },
      focus: ['crankPulley', 'camFront', 'camRear'],
      hotspots: [
        { part: 'crankPulley', label: 'Crank pulley mark', spec: 'align to pointer' },
        { part: 'camFront', label: 'Front bank cam mark' },
        { part: 'camRear', label: 'Rear bank cam mark' },
      ],
      explode: 0,
      durationMin: 20,
      mistake:
        'Setting TDC off the crank mark alone. The crank reaches TDC twice per cycle; only the cam marks tell you which one you are on.',
    },
    {
      id: 't4',
      title: 'Remove the crankshaft pulley — 245 N·m',
      body:
        'Fit the **crank pulley holder tool** so the crankshaft cannot rotate, then break the bolt loose with a long breaker bar. Do not use the starter motor against a wrench, and do not jam a screwdriver into the flywheel teeth.',
      camera: { pos: [1.0, 0.8, 4.2], target: [0, -0.3, 0.6] },
      focus: ['crankBolt', 'crankPulley'],
      hotspots: [
        { part: 'crankBolt', label: 'Crank pulley bolt', spec: '245 N·m / 181 ft-lb' },
        { part: 'crankPulley', label: 'Harmonic balancer' },
      ],
      explode: 0.4,
      torque: [{ fastener: 'Crankshaft pulley bolt', nm: 245, ftlb: 181, note: 'Holder tool mandatory' }],
      durationMin: 25,
      tip:
        'If the bolt will not move, lengthen the bar rather than shock-loading it. This bolt is the single biggest reason people abandon this job halfway.',
    },
    {
      id: 't5',
      title: 'Off with the timing covers',
      body:
        'Upper and lower plastic covers come off next. Keep the bolts in the order they came out — they are different lengths, and a long bolt in a short hole cracks the cover boss.',
      camera: { pos: [1.8, 1.4, 6.4], target: [0, 0.5, 0.3] },
      focus: ['upperCover', 'lowerCover', 'coverBolts'],
      hotspots: [
        { part: 'upperCover', label: 'Upper timing cover' },
        { part: 'lowerCover', label: 'Lower timing cover' },
        { part: 'coverBolts', label: 'Cover bolts', spec: '10 N·m' },
      ],
      explode: 0.55,
      torque: [{ fastener: 'Timing cover bolt', nm: 10, ftlb: 7 }],
      durationMin: 25,
    },
    {
      id: 't6',
      title: 'Record the timing marks and belt direction',
      body:
        'With the covers off, **mark everything with a paint pen before anything moves**: the alignment of each cam mark against its index, the crank sprocket keyway position, and an arrow on the old belt showing rotation direction. Photograph it. This record is what you check the new belt against.',
      camera: { pos: [0.0, 1.1, 6.3], target: [0, 0.5, 0] },
      focus: ['camFront', 'camRear', 'crankSprocket', 'belt'],
      hotspots: [
        { part: 'camFront', label: 'Front cam — index mark', spec: 'TDC #1' },
        { part: 'camRear', label: 'Rear cam — index mark', spec: 'TDC #1' },
        { part: 'crankSprocket', label: 'Crank sprocket keyway', spec: 'points up at TDC' },
      ],
      explode: 0,
      durationMin: 15,
      tip:
        'The marks are in the model above — orbit around and look at each one from square on. Reading them at an angle is how a one-tooth error gets missed.',
    },
    {
      id: 't7',
      title: 'Retract and pin the tensioner',
      body:
        'Unbolt the hydraulic tensioner, take it to the bench, and compress the plunger **slowly in a vice** until you can pass a 2 mm pin through the retaining hole. Fast compression damages the internal seal. In practice this tensioner is replaced, not reused — but you still pin the new one before fitting it.',
      camera: { pos: [-3.2, 1.0, 3.8], target: [-1.0, 0.2, 0] },
      focus: ['tensioner', 'tensionerBolt'],
      hotspots: [
        { part: 'tensioner', label: 'Hydraulic tensioner', spec: 'pin before fitting' },
        { part: 'tensionerBolt', label: 'Tensioner bolt', spec: '29 N·m' },
      ],
      explode: 0.4,
      hazards: ['spring'],
      torque: [{ fastener: 'Belt tensioner mounting bolt', nm: 29, ftlb: 21 }],
      durationMin: 20,
    },
    {
      id: 't8',
      title: 'Belt off, and do not turn anything',
      body:
        'Slip the old belt off. From this moment until the new belt is on and verified, **the crankshaft and camshafts must not rotate**. A cam can spring a few degrees under valve spring pressure on its own — that is normal and recoverable. A crank rotation with a cam out of position is not.',
      camera: { pos: [0.0, 1.0, 6.5], target: [0, 0.5, 0] },
      focus: ['belt'],
      hotspots: [{ part: 'belt', label: 'Timing belt', spec: '~148 teeth' }],
      explode: 0.45,
      durationMin: 10,
      mistake:
        'Bumping the crank to "get a better angle" with the belt off. If you do it, stop and re-establish TDC on all three sprockets before continuing.',
    },
    {
      id: 't9',
      title: 'Replace the water pump',
      body:
        'The pump is driven by the timing belt and sits behind it. **Replace it on principle** — the labour to reach it is the entire job you just did. New O-ring, clean mating face, and torque the bolts in a cross pattern to 12 N·m in two passes.',
      detail: [
        'Scrape the old O-ring groove clean. Do not gouge the aluminium',
        'Dry-fit the pump and confirm the sprocket lines up in the belt plane',
        'Two passes: half torque all round, then 12 N·m all round',
      ],
      camera: { pos: [-2.8, 0.4, 3.6], target: [-0.55, -0.1, 0] },
      focus: ['waterPump', 'pumpBolts'],
      hotspots: [
        { part: 'waterPump', label: 'Water pump', spec: 'belt-driven' },
        { part: 'pumpBolts', label: 'Pump bolts ×6', spec: '12 N·m' },
      ],
      explode: 0.6,
      torque: [{ fastener: 'Water pump bolt', nm: 12, ftlb: 9, pattern: 'Cross, two passes' }],
      durationMin: 35,
    },
    {
      id: 't10',
      title: 'Idler, then the new belt',
      body:
        'New idler pulley to 39 N·m. Then route the belt: **start at the crankshaft sprocket** and work around, keeping the drive side taut, and finish at the tensioner pulley so all the slack ends up where the tensioner can take it out.',
      detail: [
        'Belt direction arrow faces the same way as rotation',
        'Crank sprocket first — it has the fewest teeth and the least tolerance for slack',
        'Then water pump, rear cam, idler, front cam, tensioner last',
        'Confirm every tooth is fully seated in its groove before you pull the tensioner pin',
      ],
      camera: { pos: [0.3, 1.0, 6.5], target: [0, 0.5, 0] },
      focus: ['belt', 'idler', 'crankSprocket', 'camFront', 'camRear'],
      hotspots: [
        { part: 'idler', label: 'Idler pulley', spec: '39 N·m' },
        { part: 'belt', label: 'New belt — note direction' },
      ],
      explode: 0.2,
      torque: [{ fastener: 'Idler pulley bolt', nm: 39, ftlb: 29 }],
      durationMin: 30,
    },
    {
      id: 't11',
      title: 'Pull the pin and verify by hand, twice',
      body:
        'Pull the tensioner pin so the plunger takes up slack. Then rotate the crankshaft **two full turns clockwise by hand** and come back to TDC. Every mark must line up exactly where your paint marks said it should. If one is off by a tooth, the belt comes off and you start the routing again.',
      detail: [
        'By hand on the crank bolt. If it will not turn, stop — something is interfering',
        'Two revolutions brings every valve past every piston position',
        'Check all three marks square-on, not at an angle',
        'Any resistance that feels like metal contact: stop, do not force it',
      ],
      camera: { pos: [0.0, 1.0, 6.0], target: [0, 0.5, 0] },
      focus: ['crankSprocket', 'camFront', 'camRear', 'belt'],
      hotspots: [
        { part: 'crankSprocket', label: 'Verify: keyway up' },
        { part: 'camFront', label: 'Verify: front cam mark' },
        { part: 'camRear', label: 'Verify: rear cam mark' },
      ],
      explode: 0,
      durationMin: 20,
      mistake:
        'Turning the engine over with the starter to "check" before verifying by hand. If timing is wrong, hand rotation stops; the starter does not.',
    },
    {
      id: 't12',
      title: 'Reassemble, refill, and bleed the cooling system',
      body:
        'Covers, crank pulley to **245 N·m**, accessory belt, mounts, splash shield. Then refill with the correct coolant and bleed it properly — a V6 with an air pocket will overheat on the first drive and you will be blamed for the head gasket.',
      detail: [
        'Crank pulley bolt gets the holder tool again for final torque',
        'Fill through a spill-free funnel, heater on full hot, engine idling until the thermostat opens',
        'Squeeze the upper hose to help air migrate to the filler',
        'Let it cool completely, then re-check the level — expect to add more',
      ],
      camera: { pos: [1.6, 1.8, 5.6], target: [0, 0.4, 0.3] },
      focus: ['crankPulley', 'crankBolt', 'upperCover', 'lowerCover'],
      hotspots: [{ part: 'crankBolt', label: 'Crank bolt', spec: '245 N·m' }],
      explode: 0,
      torque: [
        { fastener: 'Crankshaft pulley bolt', nm: 245, ftlb: 181 },
        { fastener: 'Engine mount bracket bolt', nm: 54, ftlb: 40 },
      ],
      durationMin: 55,
    },
  ],
  hiddenByStep: {
    t1: [],
    t2: [],
    t3: ACC_OFF,
    t4: ACC_OFF,
    t5: PULLEY_OFF,
    t6: COVERS_OFF,
    t7: COVERS_OFF,
    t8: COVERS_OFF,
    t9: [...COVERS_OFF, 'belt', 'tensioner', 'tensionerBolt'],
    t10: COVERS_OFF,
    t11: COVERS_OFF,
    t12: [],
  },
  checkpoints: [
    {
      id: 'tc1',
      afterStep: 't3',
      question:
        'The crankshaft pulley mark is perfectly aligned with the pointer, but the two camshaft marks are 180° away from their index marks. What is actually going on?',
      options: [
        {
          text: 'The crank is at TDC but on the wrong stroke — rotate the crank one more full turn clockwise',
          correct: true,
          why:
            'The crank turns twice for every camshaft revolution. Cylinder 1 is at TDC twice per four-stroke cycle; only one of those is compression. One more crank revolution puts the cams right.',
        },
        {
          text: 'The belt has already jumped two teeth and the engine is damaged',
          why:
            'A 180° cam error is the signature of being on the wrong stroke, not a jumped belt. A jumped belt shows up as a small offset, usually one or two teeth.',
        },
        {
          text: 'The cam sprockets are fitted the wrong way round',
          why: 'They are keyed and cannot be fitted 180° out on their own.',
        },
        {
          text: 'Nothing — cam marks are only relevant with the belt removed',
          why:
            'The cam marks are the only way to tell compression TDC from exhaust TDC. Ignoring them is the single most common way this job goes wrong.',
        },
      ],
    },
    {
      id: 'tc2',
      afterStep: 't9',
      question:
        'The water pump is not leaking and spins freely. Why does the factory procedure still have you replace it?',
      options: [
        {
          text: 'It is driven by the timing belt, so if its bearing seizes it destroys valve timing — and the labour to reach it is this entire job',
          correct: true,
          why:
            'Correct on both counts. On a belt-driven pump the failure mode is shared with the belt, and the access cost is the whole job. Replacing it is risk management, not upselling.',
        },
        {
          text: 'The old pump will contaminate the new coolant',
          why: 'Not the reason. A clean, working pump does not contaminate coolant.',
        },
        {
          text: 'Pump impellers are a wear item that must be replaced on mileage',
          why:
            'Impeller erosion happens, but it is not why the pump is in a timing belt kit. Shared failure mode and access cost are.',
        },
        {
          text: 'The new belt will not tension correctly against an old pump sprocket',
          why: 'Belt tension is set by the tensioner, not by the pump.',
        },
      ],
    },
    {
      id: 'tc3',
      afterStep: 't11',
      question:
        'You have fitted the belt, pulled the pin, and rotated the crank two turns by hand. One cam mark now sits roughly one tooth retarded. What do you do?',
      options: [
        {
          text: 'Return to TDC, release the tensioner, remove the belt and re-route it correctly',
          correct: true,
          why:
            'One tooth is out of spec and there is no adjustment to take it up. The only fix is to re-fit the belt. Tedious, but far cheaper than a bent valve.',
        },
        {
          text: 'Start the engine — one tooth is within tolerance and the VTC actuator will correct it',
          why:
            'One tooth is several degrees of cam timing. Variable cam phasing has a limited range meant for operating adjustment, not for correcting an assembly error.',
        },
        {
          text: 'Slot the cam sprocket bolt holes to bring the mark back',
          why: 'Modifying a timing sprocket is not a repair. The sprocket is keyed for a reason.',
        },
        {
          text: 'Rotate the cam back one tooth and re-tension without removing the belt',
          why:
            'You cannot move one sprocket relative to a tensioned closed loop without pulling the belt. Attempting it usually moves two things at once.',
        },
      ],
    },
  ],
}

