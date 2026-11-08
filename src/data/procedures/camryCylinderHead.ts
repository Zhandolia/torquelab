import type { Procedure } from '../../lib/types'

const BOLTS = Array.from({ length: 10 }, (_, i) => `bolt${i + 1}`)
const TOP_OFF = ['camCover', 'intake', 'exhaust']
const BOLTS_OUT = [...TOP_OFF, ...BOLTS]

export const camryCylinderHead: Procedure = {
  id: 'camry-cylinder-head',
  title: 'Cylinder Head Removal & Torque Sequence',
  subtitle: '2AR-FE — torque-to-yield bolts and why pattern matters',
  primaryVehicleId: 'camry-2014',
  alsoApplies: ['civic-2016'],
  system: 'engine',
  location: 'underhood',
  difficulty: 5,
  timeMin: 420,
  assembly: 'cylinderHead',
  summary:
    'Head gasket work is where measuring replaces guessing. This procedure covers removal in the correct loosening order, how to check a head for warpage, and the one concept that decides whether the gasket seals: clamp load applied evenly, in sequence, with torque-to-yield bolts that can only be used once.',
  objectives: [
    'Explain what a torque-to-yield bolt is and why it cannot be reused',
    'Describe why head bolts are loosened and tightened from the centre outward',
    'Measure head and deck flatness and interpret the result against the warpage limit',
    'Carry out a torque-plus-angle sequence correctly',
    'List the clean-up steps that decide whether a new gasket seals',
  ],
  tools: [
    { name: 'Engine hoist or support bar', category: 'safety' },
    { name: 'Safety glasses', category: 'safety' },
    { name: 'Torque wrench 20–150 N·m', detail: 'For the initial 49 N·m pass', category: 'measure' },
    { name: 'Torque angle gauge', detail: 'For the two 90° passes — mandatory, not optional', category: 'specialty' },
    { name: 'Precision straight edge, 300 mm', detail: 'Head and deck flatness', category: 'measure' },
    { name: 'Feeler gauge set', detail: '0.03–0.10 mm blades', category: 'measure' },
    { name: 'Torque wrench 5–25 N·m', detail: 'Cam cover and small fasteners', category: 'measure' },
    { name: 'Gasket scraper, plastic or brass', detail: 'Never steel on an aluminium deck', category: 'specialty' },
    { name: 'Bore brush + shop vac', category: 'specialty' },
    { name: 'Thread chaser set', detail: 'Chaser, not a tap — a tap cuts new metal', category: 'specialty' },
    { name: 'New TTY head bolt set', detail: 'One-time use', category: 'consumable' },
    { name: 'Multi-layer steel head gasket', category: 'consumable' },
    { name: 'Assembly lube + clean engine oil', category: 'consumable' },
  ],
  parts: [
    { name: 'Head gasket (MLS)', qty: '1', note: 'Multi-layer steel — never a composite substitute' },
    { name: 'Head bolt set', qty: '1 set (10)', note: 'Torque-to-yield. New bolts every time, no exceptions' },
    { name: 'Cam cover gasket + spark plug tube seals', qty: '1 set' },
    { name: 'Intake and exhaust manifold gaskets', qty: '1 set' },
    { name: 'Exhaust manifold nuts', qty: '1 set', note: 'They never come off reusable' },
  ],
  fluids: [
    { name: 'Engine coolant', spec: 'Toyota SLLC pink', qty: 'Full system refill' },
    { name: 'Engine oil', spec: '0W-20 full synthetic', qty: '4.6 qt — change it, it is contaminated' },
  ],
  torqueTable: [
    {
      fastener: 'Cylinder head bolt — Stage 1',
      nm: 49,
      ftlb: 36,
      pattern: 'Factory sequence, centre outward',
      tty: true,
    },
    { fastener: 'Cylinder head bolt — Stage 2', nm: 0, angle: '+90°', pattern: 'Same sequence', tty: true },
    { fastener: 'Cylinder head bolt — Stage 3', nm: 0, angle: '+90°', pattern: 'Same sequence', tty: true },
    { fastener: 'Camshaft bearing cap bolt', nm: 22, ftlb: 16, pattern: 'Several passes, centre outward' },
    { fastener: 'Cam cover bolt', nm: 11, inlb: 97, pattern: 'Spiral from centre' },
    { fastener: 'Intake manifold bolt', nm: 28, ftlb: 21 },
    { fastener: 'Exhaust manifold nut', nm: 37, ftlb: 27 },
  ],
  hazards: [
    { kind: 'burn', text: 'Cold engine only. The exhaust manifold holds heat for hours.' },
    { kind: 'chemical', text: 'Coolant mixed with oil is a disposal problem, not a drain problem.' },
    { kind: 'crush', text: 'A bare aluminium head is around 20 kg and has nothing good to grip. Two people or a lift.' },
    { kind: 'sharp', text: 'Gasket edges and head bolt holes. Gloves.' },
  ],
  steps: [
    {
      id: 'h1',
      title: 'What a torque-to-yield bolt actually is',
      body:
        'A TTY head bolt is designed to be **stretched past its elastic limit** on installation. That permanent stretch is what makes its clamp load consistent across all ten bolts regardless of thread friction. It also means the bolt is a one-time part: it has already given up its spring.',
      detail: [
        'Stage 1 (a torque value) seats the bolt and takes up the joint',
        'Stages 2 and 3 (angles) stretch it into yield — angle, not torque, controls the stretch',
        'A reused TTY bolt has less stretch left, so it reaches a lower clamp load, or snaps',
        'This is why an angle gauge is required equipment, not a nicety',
      ],
      camera: { pos: [3.4, 2.8, 4.2], target: [0, 0.2, 0] },
      focus: ['bolt1', 'bolt2', 'bolt3', 'bolt4', 'bolt5'],
      explode: 0.4,
      durationMin: 10,
    },
    {
      id: 'h2',
      title: 'Strip to the head: intake, exhaust, cam cover',
      body:
        'Drain the coolant and the oil, disconnect the battery, and work your way in: intake manifold, exhaust manifold, cam cover. Label every connector and vacuum line as it comes off — a head job has a hundred of them and no one remembers them all three days later.',
      camera: { pos: [3.8, 2.0, 4.6], target: [0, 0.3, 0] },
      focus: ['camCover', 'intake', 'exhaust'],
      hotspots: [
        { part: 'camCover', label: 'Cam cover', spec: '11 N·m' },
        { part: 'intake', label: 'Intake manifold', spec: '28 N·m' },
        { part: 'exhaust', label: 'Exhaust manifold', spec: '37 N·m' },
      ],
      explode: 0.5,
      durationMin: 120,
      tip: 'Bag and label fasteners by the assembly they came from. Masking tape and a marker beat memory every time.',
    },
    {
      id: 'h3',
      title: 'Loosen the head bolts — reverse of the tightening order',
      body:
        'Head bolts come loose from the **outside inward**, which is the reverse of the tightening sequence, in several passes of a quarter turn each. Undoing a loaded joint from the middle out puts a bending load across the head and can crack it.',
      detail: [
        'Several progressive passes, never one bolt fully loose at a time',
        'Outside pair first, working toward the centre',
        'Expect the head to be stuck to the block even with every bolt out',
      ],
      camera: { pos: [0.4, 3.6, 3.0], target: [0, 0.4, 0] },
      focus: [
        'bolt10', 'bolt9', 'bolt8', 'bolt7', 'bolt6',
        'bolt5', 'bolt4', 'bolt3', 'bolt2', 'bolt1',
      ],
      hotspots: [
        { part: 'bolt10', label: 'Loosen 1st' },
        { part: 'bolt9', label: '2nd' },
        { part: 'bolt1', label: 'Loosen last' },
      ],
      explode: 0.55,
      durationMin: 30,
      mistake:
        'Cracking the centre bolts loose first. It is the fastest way to warp or crack an aluminium head that was otherwise fine.',
    },
    {
      id: 'h4',
      title: 'Lift the head off',
      body:
        'Break it free by rocking it gently, never by prying between the machined faces. Lift it straight up and set it on a clean bench on wooden blocks — never face-down on bare metal.',
      camera: { pos: [3.0, 2.2, 4.0], target: [0, 0.5, 0] },
      focus: ['head', 'gasket'],
      hotspots: [
        { part: 'head', label: 'Cylinder head', spec: '~20 kg' },
        { part: 'gasket', label: 'Old head gasket' },
      ],
      explode: 0.7,
      hazards: ['crush'],
      durationMin: 25,
    },
    {
      id: 'h5',
      title: 'Read the old gasket like a report',
      body:
        'Before you throw it away, look at it. **The old gasket tells you why it failed.** A dark washed-out section between two cylinders is a hot-gas path. An eroded bead near a coolant port is electrolysis or a cracked deck. Uniform wear means it simply did its time.',
      camera: { pos: [2.0, 1.6, 3.2], target: [0, 0.1, 0] },
      focus: ['gasket'],
      hotspots: [{ part: 'gasket', label: 'Failure evidence lives here' }],
      explode: 0.6,
      durationMin: 15,
    },
    {
      id: 'h6',
      title: 'Measure flatness — both faces',
      body:
        'Straight edge across the head in **six orientations**: lengthwise, crosswise, and both diagonals. Slide a feeler gauge underneath at each position. Anything over the warpage limit means the head goes to a machine shop, not back on the engine.',
      detail: [
        'Warpage limit: 0.05 mm across the gasket face',
        'Check the deck the same way — blocks warp too',
        'Also check the head for cracks between the valve seats',
        'A head that needs more than light skimming may be past the minimum height spec',
      ],
      camera: { pos: [2.6, 2.4, 3.4], target: [0, 0.6, 0] },
      focus: ['head'],
      measure: [
        { name: 'Head gasket face warpage', spec: 'Max 0.05 mm', tool: 'Straight edge + feelers' },
        { name: 'Block deck warpage', spec: 'Max 0.05 mm', tool: 'Straight edge + feelers' },
        { name: 'Deck surface finish', spec: '~0.5–1.5 µm Ra for MLS', tool: 'Comparator gauge' },
      ],
      explode: 0.45,
      durationMin: 40,
      tip:
        'A multi-layer steel gasket needs a smoother surface finish than the old composite gaskets did. Resurfacing with the wrong finish will leak even though everything measures flat.',
    },
    {
      id: 'h7',
      title: 'Clean like it matters, because it does',
      body:
        'Plastic or brass scraper only — a steel blade gouges aluminium and every gouge is a leak path. Chase the bolt threads with a **thread chaser**, not a tap. Then vacuum the bores and blow out each bolt hole: a few drops of coolant in a blind hole changes the torque reading.',
      detail: [
        'Stuff clean rags in the bores while scraping so debris does not fall in',
        'Thread chaser cleans existing threads; a tap cuts new ones and changes the fit',
        'Every bolt hole dry and oil-free before assembly',
        'Deck and head face degreased with brake cleaner and a lint-free wipe',
      ],
      camera: { pos: [2.2, 1.8, 3.6], target: [0, -0.2, 0] },
      focus: ['block'],
      explode: 0.3,
      durationMin: 60,
      mistake:
        'Leaving oil or coolant in the bolt holes. The hydraulic effect gives you a false torque reading and the bolt never reaches its intended stretch.',
    },
    {
      id: 'h8',
      title: 'New gasket, dry, correct side up',
      body:
        'MLS gaskets go on **dry** — no sealant unless the manufacturer specifically calls for it. Locate it on the dowels and check the TOP or FRONT marking is facing the right way. Then set the head down squarely without sliding it.',
      camera: { pos: [2.4, 1.6, 3.2], target: [0, 0.0, 0] },
      focus: ['gasket', 'block'],
      hotspots: [{ part: 'gasket', label: 'New MLS gasket', spec: 'fit dry, note TOP mark' }],
      explode: 0.35,
      durationMin: 20,
    },
    {
      id: 'h9',
      title: 'The torque sequence: 49 N·m, then 90°, then 90°',
      body:
        'New bolts, threads lightly oiled with clean engine oil unless the instructions say dry. Then three passes in the **factory sequence from the centre of the head outward** — never bolt-by-bolt to final spec.',
      detail: [
        'Stage 1: 49 N·m in sequence',
        'Stage 2: +90° in the same sequence, using an angle gauge',
        'Stage 3: +90° again in the same sequence',
        'Mark each bolt head with a paint pen as you complete it — losing your place is the real risk',
      ],
      camera: { pos: [0.2, 3.4, 2.8], target: [0, 0.4, 0] },
      focus: [
        'bolt1', 'bolt2', 'bolt3', 'bolt4', 'bolt5',
        'bolt6', 'bolt7', 'bolt8', 'bolt9', 'bolt10',
      ],
      hotspots: [
        { part: 'bolt1', label: '1', spec: '49 N·m' },
        { part: 'bolt2', label: '2' },
        { part: 'bolt3', label: '3' },
        { part: 'bolt4', label: '4' },
        { part: 'bolt5', label: '5' },
        { part: 'bolt6', label: '6' },
        { part: 'bolt7', label: '7' },
        { part: 'bolt8', label: '8' },
        { part: 'bolt9', label: '9' },
        { part: 'bolt10', label: '10' },
      ],
      explode: 0,
      torque: [
        { fastener: 'Head bolt Stage 1', nm: 49, ftlb: 36, pattern: 'Sequence 1→10', tty: true },
        { fastener: 'Head bolt Stage 2', nm: 0, angle: '+90°', pattern: 'Sequence 1→10', tty: true },
        { fastener: 'Head bolt Stage 3', nm: 0, angle: '+90°', pattern: 'Sequence 1→10', tty: true },
      ],
      durationMin: 45,
      tip:
        'The numbered callouts above are the tightening order. Centre pair first, then alternate outward — it spreads the gasket crush evenly instead of squeezing it out from one end.',
    },
    {
      id: 'h10',
      title: 'Reassemble, prime, and find your leaks on purpose',
      body:
        'Cam cover, manifolds, everything you labelled. Fill with fresh oil and the correct coolant, then **crank the engine with the plugs out or the fuel disabled** to build oil pressure before it fires. Bleed the cooling system fully and watch it through two heat cycles.',
      detail: [
        'Change the oil — it is contaminated with coolant whatever it looks like',
        'Prime oil pressure before the first start',
        'First start: watch for coolant in the oil, oil in the coolant, and bubbles in the expansion tank',
        'Re-check coolant level cold after the first full heat cycle',
      ],
      camera: { pos: [3.6, 2.2, 4.4], target: [0, 0.3, 0] },
      explode: 0,
      durationMin: 90,
    },
  ],
  hiddenByStep: {
    h1: TOP_OFF,
    h2: [],
    h3: TOP_OFF,
    h4: BOLTS_OUT,
    h5: [...BOLTS_OUT, 'head'],
    h6: [...BOLTS_OUT, 'gasket'],
    h7: [...BOLTS_OUT, 'head', 'gasket'],
    h8: BOLTS_OUT,
    h9: TOP_OFF,
    h10: [],
  },
  checkpoints: [
    {
      id: 'hc1',
      afterStep: 'h1',
      question: 'Why can a torque-to-yield head bolt not be reused, even if it looks perfect?',
      options: [
        {
          text: 'It was deliberately stretched past its elastic limit, so the stretch that produces clamp load has already been used up',
          correct: true,
          why:
            'Right. The design relies on permanent deformation for consistent clamp load. A second use starts from a yielded bolt, so it reaches lower clamp load or fails outright.',
        },
        {
          text: 'The threads work-harden and will gall the block',
          why: 'Thread condition is a side issue. The reason is the bolt body, not the threads.',
        },
        {
          text: 'The coating that sets the friction coefficient wears off',
          why:
            'Coating does affect the stage-1 torque reading, but the angle stages are what set clamp load, and the bolt has already yielded.',
        },
        {
          text: 'They are only single-use on diesel engines',
          why: 'TTY fasteners are single-use wherever they are used, petrol or diesel.',
        },
      ],
    },
    {
      id: 'hc2',
      afterStep: 'h9',
      question: 'Why does the head bolt sequence start at the centre of the head and spiral outward?',
      options: [
        {
          text: 'It squeezes the gasket progressively from the middle out, so the crush is even and nothing gets trapped or pinched',
          correct: true,
          why:
            'Correct. Starting at one end rolls the gasket and the head, leaving uneven crush and a leak path. Centre-outward lets the clamp load spread uniformly.',
        },
        {
          text: 'The centre bolts are longer so they need torque first',
          why: 'Bolt length is not what drives the sequence.',
        },
        {
          text: 'It keeps the camshafts from binding in their journals',
          why: 'Cam bearing caps have their own sequence for that reason; this is about the gasket joint.',
        },
        {
          text: 'The sequence only matters on the final pass',
          why: 'Every pass follows the sequence. The first pass is where the gasket crush is established.',
        },
      ],
    },
    {
      id: 'hc3',
      afterStep: 'h7',
      question: 'A little coolant is sitting in two head bolt holes. Why does that matter?',
      options: [
        {
          text: 'Trapped liquid cannot compress, so the bolt reads full torque before it has actually stretched properly',
          correct: true,
          why:
            'The hydraulic effect gives a false torque reading and can also crack the boss. Bolt holes get vacuumed and blown out dry before assembly.',
        },
        {
          text: 'The coolant will boil and blow the gasket on the first start',
          why: 'A small amount of coolant does not blow a gasket. The problem is the torque reading.',
        },
        {
          text: 'Coolant corrodes the bolt threads over time',
          why: 'Long-term corrosion is real but is not the immediate assembly problem.',
        },
        {
          text: 'It dilutes the thread locker',
          why: 'Head bolts are not installed with thread locker.',
        },
      ],
    },
  ],
}
