import type { Procedure } from '../../lib/types'

const RODS_OUT = [
  'bankAPistons',
  'bankARods',
  'bankARodBolts',
  'bankBPistons',
  'bankBRods',
  'bankBRodBolts',
]

export const mustangBottomEnd: Procedure = {
  id: 'mustang-bottom-end',
  title: 'Rotating Assembly Teardown & Measurement',
  subtitle: 'Coyote V8 — crank, rods, pistons and bearing clearance',
  primaryVehicleId: 'mustang-gt-2018',
  system: 'engine',
  location: 'underhood',
  difficulty: 5,
  timeMin: 480,
  assembly: 'rotatingAssembly',
  summary:
    'Engine building is measuring. This module takes a 90° V8 short block apart and teaches the measurements that decide whether it goes back together: bearing clearance, bore condition, ring end gap, and rod side clearance. The 3D model explodes so you can see the main cap register and the shared rod journals that make a V8 a V8.',
  objectives: [
    'Explain why two connecting rods share one crankshaft rod journal in a V configuration',
    'Measure main and rod bearing clearance with Plastigauge and with a micrometer plus bore gauge',
    'Keep caps, rods and bearings in their original positions and explain why that is not optional',
    'Check ring end gap and understand what happens when it is too small',
    'Carry out a torque-plus-angle main cap sequence',
  ],
  tools: [
    { name: 'Engine stand, 450 kg rated', category: 'safety' },
    { name: 'Engine hoist + load leveller', category: 'safety' },
    { name: 'Outside micrometer set, 0–100 mm', detail: 'Journal diameters', category: 'measure' },
    { name: 'Dial bore gauge', detail: 'Bore and bearing ID', category: 'measure' },
    { name: 'Telescoping gauges', category: 'measure' },
    { name: 'Plastigauge, green', detail: '0.025–0.175 mm range', category: 'measure' },
    { name: 'Feeler gauges', detail: 'Rod side clearance and ring end gap', category: 'measure' },
    { name: 'Dial indicator + magnetic base', detail: 'Crank end play, deck height', category: 'measure' },
    { name: 'Torque angle gauge', category: 'specialty' },
    { name: 'Ring compressor + ring filer', category: 'specialty' },
    { name: 'Rod bolt protectors', detail: 'Plastic sleeves — protect the journals', category: 'specialty' },
    { name: 'Piston ring expander', category: 'specialty' },
    { name: 'Assembly lube', category: 'consumable' },
    { name: 'Lint-free wipes + parts organiser trays', category: 'consumable' },
  ],
  parts: [
    { name: 'Main bearing set', qty: '1 set', note: 'Sized to measured clearance, not bought blind' },
    { name: 'Rod bearing set', qty: '1 set' },
    { name: 'Piston ring set', qty: '8', note: 'Gapped individually to its own bore' },
    { name: 'Main cap bolts', qty: '1 set', note: 'Torque-to-yield — single use' },
    { name: 'Rod bolts', qty: '1 set', note: 'Torque-to-yield — single use' },
    { name: 'Rear main seal', qty: '1' },
  ],
  torqueTable: [
    { fastener: 'Main cap bolt — Stage 1', nm: 40, ftlb: 30, pattern: 'Centre main outward', tty: true },
    { fastener: 'Main cap bolt — Stage 2', nm: 0, angle: '+90°', pattern: 'Same sequence', tty: true },
    { fastener: 'Main cap cross bolt', nm: 25, ftlb: 18, note: 'After the vertical bolts are at full torque' },
    { fastener: 'Connecting rod bolt — Stage 1', nm: 30, ftlb: 22, tty: true },
    { fastener: 'Connecting rod bolt — Stage 2', nm: 0, angle: '+90°', tty: true },
    { fastener: 'Crankshaft damper bolt', nm: 100, ftlb: 74, angle: '+90°' },
  ],
  hazards: [
    { kind: 'crush', text: 'A bare Coyote block is about 100 kg. Rated stand, rated hoist, and never under the load.' },
    { kind: 'sharp', text: 'Piston rings are sharp spring steel and they cut. Gloves for ring work.' },
    { kind: 'eye', text: 'Compressed air and solvent cleaning both end up in your eyes without glasses.' },
    { kind: 'chemical', text: 'Solvent and assembly lube on skin all day causes dermatitis. Nitrile gloves.' },
  ],
  steps: [
    {
      id: 'b1',
      title: 'Read the architecture first',
      body:
        'A 90° V8 runs two banks of four at 45° either side of vertical. **Each rod journal on the crankshaft carries two rods — one from each bank.** That shared journal is why V8 crank journals are wider than an inline four, and why rod side clearance is measured as a pair.',
      detail: [
        'Five main bearings support four rod throws',
        'Each throw serves one cylinder per bank',
        'The 90° bank angle plus a cross-plane crank is what produces the V8 exhaust note',
      ],
      camera: { pos: [5.4, 2.9, 6.2], target: [0, 0.2, 0] },
      focus: ['crank', 'bankARods', 'bankBRods'],
      hotspots: [
        { part: 'crank', label: 'Crankshaft — 5 mains, 4 throws' },
        { part: 'bankARods', label: 'Bank A rods' },
        { part: 'bankBRods', label: 'Bank B rods' },
      ],
      explode: 0.5,
      durationMin: 15,
      tip: 'Orbit underneath and explode the assembly. The relationship between the throws and the banks is much easier to see in motion than in a diagram.',
    },
    {
      id: 'b2',
      title: 'Measure crankshaft end play before anything comes apart',
      body:
        'Dial indicator on the crank snout, pry the crank fore and aft, and record end play **before** disassembly. This is your baseline — it tells you whether the thrust bearing was already worn.',
      camera: { pos: [4.4, 1.0, 3.2], target: [1.2, 0, 0] },
      focus: ['crank', 'damper'],
      measure: [
        { name: 'Crankshaft end play', spec: 'Typically 0.15–0.35 mm', tool: 'Dial indicator' },
        { name: 'Rod side clearance (pair)', spec: 'Typically 0.15–0.44 mm', tool: 'Feeler gauge' },
      ],
      explode: 0.1,
      durationMin: 20,
    },
    {
      id: 'b3',
      title: 'Rods out — and mark everything',
      body:
        'Turn the crank to put each pair of rods at the bottom, then remove rod caps **one pair at a time**. Caps are not interchangeable: they were machined with their own rod. Mark the cylinder number and which way round each cap faces before it moves.',
      detail: [
        'Rod bolt protectors on before you push a piston up — a bare rod bolt will gouge a journal',
        'Keep each cap with its own rod, its own bearing shells, in its own numbered tray',
        'Push the piston out from the bottom, by hand, not with a hammer',
      ],
      camera: { pos: [3.6, 1.6, 4.0], target: [0, 0.6, 0] },
      focus: ['bankARods', 'bankARodBolts', 'bankAPistons'],
      hotspots: [
        { part: 'bankARodBolts', label: 'Rod bolt', spec: '30 N·m + 90°' },
        { part: 'bankARods', label: 'Rod + cap — keep as a set' },
      ],
      explode: 0.55,
      torque: [
        { fastener: 'Connecting rod bolt Stage 1', nm: 30, ftlb: 22, tty: true },
        { fastener: 'Connecting rod bolt Stage 2', nm: 0, angle: '+90°', tty: true },
      ],
      durationMin: 70,
      mistake:
        'Mixing up rod caps. A cap on the wrong rod gives the wrong bore shape and the bearing fails within hours of running.',
    },
    {
      id: 'b4',
      title: 'Main caps, centre outward in stages',
      body:
        'Main caps come off in the reverse of the tightening sequence, progressively. On this engine the **cross bolts come out before the vertical bolts** — they clamp the cap into the block skirt sideways, and loosening verticals first loads them in bending.',
      camera: { pos: [2.6, -1.4, 4.0], target: [0, -0.4, 0] },
      focus: ['mainCaps', 'mainBolts'],
      hotspots: [
        { part: 'mainBolts', label: 'Main cap bolt', spec: '40 N·m + 90°' },
        { part: 'mainCaps', label: 'Main cap — numbered, directional' },
      ],
      explode: 0.65,
      torque: [
        { fastener: 'Main cap bolt Stage 1', nm: 40, ftlb: 30, pattern: 'Centre outward', tty: true },
        { fastener: 'Main cap bolt Stage 2', nm: 0, angle: '+90°', tty: true },
      ],
      durationMin: 40,
    },
    {
      id: 'b5',
      title: 'Lift the crank, then read the bearings',
      body:
        'With the crank out, lay every bearing shell out in position order. **Bearing wear is a diagnosis.** Even grey wear is normal service. Copper showing through means the overlay is gone. Scoring across the shell means dirt went through. A polished patch on one edge means the journal is tapered or the bore is misaligned.',
      camera: { pos: [3.0, -0.6, 3.6], target: [0, -0.3, 0] },
      focus: ['mainBearings', 'crank'],
      hotspots: [
        { part: 'mainBearings', label: 'Main shells — read the wear' },
        { part: 'crank', label: 'Crankshaft' },
      ],
      explode: 0.75,
      hazards: ['crush'],
      durationMin: 30,
    },
    {
      id: 'b6',
      title: 'Measure the crankshaft',
      body:
        'Micrometer on every journal, in **two planes 90° apart, at each end of the journal**. Two planes catches out-of-round; two positions catches taper. Record all of it — a journal that is in spec for diameter can still be out of spec for shape.',
      detail: [
        'Main journal diameter, out-of-round and taper',
        'Rod journal diameter, out-of-round and taper',
        'Thrust face condition and width',
        'Typical limits: out-of-round max 0.005 mm, taper max 0.005 mm',
      ],
      camera: { pos: [3.4, 0.6, 3.2], target: [0, 0, 0] },
      focus: ['crank'],
      measure: [
        { name: 'Main journal diameter', spec: 'Compare to published standard size', tool: 'Outside micrometer' },
        { name: 'Journal out-of-round', spec: 'Max ~0.005 mm', tool: 'Micrometer, two planes' },
        { name: 'Journal taper', spec: 'Max ~0.005 mm', tool: 'Micrometer, both ends' },
      ],
      explode: 0.3,
      durationMin: 60,
      tip:
        'Write every number down on a sheet as you go. The pattern across eight journals tells you more than any single reading.',
    },
    {
      id: 'b7',
      title: 'Bearing clearance, two ways',
      body:
        'Bearing clearance is bearing bore ID minus journal OD. Measure it properly with a **micrometer and a dial bore gauge**. Plastigauge is the quick field check: a strip crushed across the journal under a torqued cap reads clearance off the width scale.',
      detail: [
        'Precision method: bore gauge on the assembled, torqued bearing; micrometer on the journal; subtract',
        'Plastigauge: dry journal, strip across it, torque the cap to full spec, do not rotate the crank, then read',
        'Typical main clearance: 0.025–0.055 mm. Rod clearance is usually similar or slightly tighter',
        'Too tight: no oil film, instant failure. Too loose: low oil pressure and a knock',
      ],
      camera: { pos: [2.4, -0.8, 3.4], target: [0, -0.2, 0] },
      focus: ['mainBearings', 'mainCaps', 'crank'],
      hotspots: [
        { part: 'mainBearings', label: 'Clearance target', spec: '0.025–0.055 mm' },
      ],
      measure: [
        { name: 'Main bearing clearance', spec: '0.025–0.055 mm typical', tool: 'Bore gauge + micrometer' },
        { name: 'Rod bearing clearance', spec: '0.025–0.055 mm typical', tool: 'Bore gauge + micrometer' },
      ],
      explode: 0.4,
      durationMin: 80,
      mistake:
        'Rotating the crankshaft with Plastigauge installed. It smears the strip and the reading is meaningless.',
    },
    {
      id: 'b8',
      title: 'Bore and ring gap',
      body:
        'Dial bore gauge at three heights and two planes in every bore: top, middle, bottom. Then gap each ring **in the bore it will actually live in**, squared up with a piston. Too little end gap and the ring butts when hot — that scores the bore and breaks the ring.',
      detail: [
        'Bore taper and out-of-round at three depths, two planes',
        'Plasma-arc-sprayed bores on this engine cannot be honed like a conventional iron liner — specialist work only',
        'Ring end gap measured with a feeler gauge, ring square in its own bore',
        'Top ring gap is typically wider than the second ring',
      ],
      camera: { pos: [3.2, 2.0, 3.6], target: [0, 1.0, 0] },
      focus: ['bankAPistons', 'bankADeck'],
      hotspots: [{ part: 'bankAPistons', label: 'Piston + ring pack', spec: '93.0 mm bore' }],
      measure: [
        { name: 'Bore diameter / taper', spec: 'Taper max ~0.05 mm', tool: 'Dial bore gauge' },
        { name: 'Top ring end gap', spec: 'Per ring manufacturer, in its own bore', tool: 'Feeler gauge' },
        { name: 'Piston-to-wall clearance', spec: 'Per manufacturer', tool: 'Micrometer + bore gauge' },
      ],
      explode: 0.5,
      durationMin: 70,
    },
    {
      id: 'b9',
      title: 'Assemble clean, lubed, and in sequence',
      body:
        'Everything goes back in its own position. Bearing shells dry on their backs and **assembly lube on the running face only** — oil behind a shell stops it transferring heat to the block. Main caps torque centre-outward in both stages, then the cross bolts. Check end play again before the rods go in.',
      detail: [
        'Shell tangs in their notches, backs spotlessly dry',
        'Caps in their own position, facing their original direction',
        'Stage 1: 40 N·m centre outward. Stage 2: +90° in the same order. Then cross bolts to 25 N·m',
        'Turn the crank by hand after every cap — it must stay free. Any binding means stop',
      ],
      camera: { pos: [2.8, -1.0, 3.8], target: [0, -0.3, 0] },
      focus: ['mainCaps', 'mainBolts', 'crank', 'mainBearings'],
      hotspots: [
        { part: 'mainBolts', label: 'Stage 1: 40 N·m', spec: 'then +90°' },
        { part: 'mainCaps', label: 'Centre main first' },
      ],
      explode: 0.15,
      torque: [
        { fastener: 'Main cap bolt Stage 1', nm: 40, ftlb: 30, pattern: 'Centre outward', tty: true },
        { fastener: 'Main cap bolt Stage 2', nm: 0, angle: '+90°', pattern: 'Same sequence', tty: true },
        { fastener: 'Main cap cross bolt', nm: 25, ftlb: 18 },
      ],
      durationMin: 90,
      tip:
        'Turning the crank by hand after each cap is the single most useful habit in engine building. It catches a misplaced shell before it costs you the block.',
    },
  ],
  hiddenByStep: {
    b1: [],
    b2: [],
    b3: [],
    b4: RODS_OUT,
    b5: RODS_OUT,
    b6: [...RODS_OUT, 'mainCaps', 'mainBolts', 'mainBearings', 'damper', 'rearSeal'],
    b7: RODS_OUT,
    b8: ['mainCaps', 'mainBolts', 'mainBearings', 'damper', 'rearSeal', 'crank'],
    b9: RODS_OUT,
  },
  checkpoints: [
    {
      id: 'bc1',
      afterStep: 'b5',
      question:
        'A main bearing shell shows copper across its full width in the middle, with grey overlay still present at both edges. What does that pattern point to?',
      options: [
        {
          text: 'Normal high-load wear in the centre of the shell, worn through the overlay — the bearing has done its service life',
          correct: true,
          why:
            'Load concentrates in the middle of a main shell. Even, central overlay loss across the width is service wear, not a specific fault. What you look for next is whether the journal measures in spec.',
        },
        {
          text: 'Dirt ingestion through the oil system',
          why: 'Debris leaves scratches and embedded particles running across the shell, not even central wear.',
        },
        {
          text: 'The cap was fitted backwards',
          why: 'A reversed cap gives a stepped bore and wear concentrated at one edge or one end.',
        },
        {
          text: 'Oil starvation',
          why:
            'Starvation gives localised seizure, discolouration and material transfer, usually with scoring, not uniform wear.',
        },
      ],
    },
    {
      id: 'bc2',
      afterStep: 'b7',
      question: 'Why does bearing clearance that is too tight fail faster than clearance that is too loose?',
      options: [
        {
          text: 'The oil film needs a minimum gap to form — below it there is metal-to-metal contact and the bearing wipes almost immediately',
          correct: true,
          why:
            'A hydrodynamic bearing floats on a wedge of oil. Too little clearance and the film cannot establish, so you get contact, heat and a wiped bearing in minutes. Too loose gives low oil pressure and a knock, which is slow by comparison.',
        },
        {
          text: 'Tight clearance increases oil pressure past the relief valve setting',
          why: 'Pressure may rise slightly, but the failure is loss of the oil film, not pressure.',
        },
        {
          text: 'Tight clearance makes the crank harder to turn, overloading the starter',
          why: 'Drag goes up, but that is a symptom, not the failure mechanism.',
        },
        {
          text: 'Loose clearance never actually fails',
          why: 'It does — through low pressure, impact loading and knock. It is just slower.',
        },
      ],
    },
  ],
}
