import type { Procedure } from '../../lib/types'

export const civicBumperCover: Procedure = {
  id: 'civic-bumper-cover',
  title: 'Front Bumper Cover Removal',
  subtitle: 'Exterior body work — fastener maps and release order',
  primaryVehicleId: 'civic-2016',
  alsoApplies: ['camry-2014'],
  system: 'exterior',
  location: 'exterior',
  difficulty: 2,
  timeMin: 60,
  assembly: 'bumperCover',
  summary:
    'Headlights, radiators, condensers, horns, intercoolers, crash bars — the bumper cover comes off for all of them. It is held on by about twenty fasteners of five different types, in three different places, and the order you release them in decides whether the mounting ears survive.',
  objectives: [
    'Build a complete fastener map for a bumper cover before removing anything',
    'Identify push-pin rivets, screw rivets, bolts and integral tabs by sight',
    'Release side mounting tabs in the correct direction so the ears do not snap',
    'Handle a painted cover without scratching it',
    'Reassemble with correct panel gaps on both sides',
  ],
  tools: [
    { name: 'Nylon trim tools + push-pin puller', category: 'specialty' },
    { name: 'Torx T25 and Phillips #2 drivers', category: 'hand' },
    { name: '10 mm and 12 mm sockets + 150 mm extension', category: 'hand' },
    { name: 'Low-profile ratchet or stubby driver', detail: 'For the fasteners behind the liner', category: 'hand' },
    { name: 'Jack + stands, or ramps', detail: 'Lower fasteners face down', category: 'safety' },
    { name: 'Padded blanket or two stands', detail: 'Somewhere to put a painted panel', category: 'consumable' },
    { name: 'Magnetic parts tray', category: 'consumable' },
    { name: 'Replacement push-pin rivets', detail: 'They do not survive removal', category: 'consumable' },
  ],
  parts: [
    { name: 'Push-pin rivet set', qty: '1 pack', note: 'Assume every one you remove is scrap' },
    { name: 'Fender liner screw rivets', qty: '6' },
  ],
  torqueTable: [
    { fastener: 'Bumper cover screw / rivet', nm: 2, inlb: 18, note: 'Into plastic — hand-tight' },
    { fastener: 'Fender liner screw', nm: 2, inlb: 18 },
    { fastener: 'Reinforcement bar bolt', nm: 74, ftlb: 55, note: 'Structural — this one is real torque' },
    { fastener: 'Headlamp mounting bolt', nm: 9, ftlb: 7 },
  ],
  hazards: [
    { kind: 'crush', text: 'Rated stands if the car is lifted. You will be lying under the nose.' },
    { kind: 'sharp', text: 'The back of a bumper cover and the edge of a reinforcement bar are both sharp.' },
    { kind: 'eye', text: 'Debris falls out of the wheel liner straight into your face. Glasses.' },
  ],
  steps: [
    {
      id: 'x1',
      title: 'Map the fasteners first',
      body:
        'Before you touch a tool, walk the panel and find everything. A bumper cover is held in **three zones**: along the top under the hood, inside both wheel arches, and along the bottom edge. Plus two integral side tabs that are not fasteners at all.',
      detail: [
        'Top: screws and push-pin rivets along the upper edge, visible with the hood open',
        'Wheel arches: screws into the fender liner, two or three each side',
        'Bottom: screws or rivets facing straight down into the lower valance',
        'Sides: moulded tabs that slide into the fender — these release by direction, not by unscrewing',
      ],
      camera: { pos: [2.8, 2.8, 7.6], target: [0, 0.1, 0] },
      hotspots: [
        { part: 'topClips', label: 'Top push-pins ×7' },
        { part: 'linerScrews', label: 'Liner screws ×6' },
        { part: 'lowerScrews', label: 'Lower screws ×5' },
        { part: 'cover', label: 'Bumper cover' },
      ],
      explode: 0.3,
      durationMin: 10,
      tip:
        'Take a photo and mark each fastener on it with your finger as you remove it. Twenty fasteners is more than you can keep in your head.',
    },
    {
      id: 'x2',
      title: 'Top edge: open the hood and work along it',
      body:
        'Pop the push-pin rivets with a proper puller — levering them with a screwdriver breaks the head off and leaves the barrel in the hole. The two outer fasteners are usually screws rather than rivets.',
      camera: { pos: [0.4, 3.0, 4.6], target: [0, 0.7, 0] },
      focus: ['topClips', 'topScrews'],
      hotspots: [{ part: 'topClips', label: 'Push-pin rivet', spec: 'use a puller' }],
      explode: 0.5,
      durationMin: 10,
    },
    {
      id: 'x3',
      title: 'Wheel arches: peel the liner back',
      body:
        'Turn the steering to full lock for access, then pull the fender liner screws where it overlaps the bumper. The liner only needs to peel back enough to reach the bumper-to-fender fasteners behind it.',
      camera: { pos: [3.6, 0.4, 3.4], target: [1.6, -0.3, 0] },
      focus: ['linerScrews', 'linerRight', 'linerLeft'],
      hotspots: [
        { part: 'linerRight', label: 'Fender liner' },
        { part: 'linerScrews', label: 'Liner screws', spec: 'hand-tight on reassembly' },
      ],
      explode: 0.45,
      hazards: ['eye'],
      durationMin: 12,
    },
    {
      id: 'x4',
      title: 'Bottom edge, from underneath',
      body:
        'The lower fasteners face straight down into the valance. On a car this low you need ramps or stands. These are the ones that are always rusted, missing, or replaced with the wrong screw by a previous owner.',
      camera: { pos: [1.2, -1.6, 4.4], target: [0, -0.7, 0] },
      focus: ['lowerScrews'],
      hotspots: [{ part: 'lowerScrews', label: 'Lower valance screws' }],
      explode: 0.5,
      hazards: ['crush'],
      durationMin: 10,
    },
    {
      id: 'x5',
      title: 'Release the side tabs — direction matters',
      body:
        'This is the step that breaks covers. Each side of the cover has a moulded tab that slides into a slot in the fender. **Pull the side of the cover straight outward, away from the car, before pulling it forward.** Pull forward first and the tab snaps off.',
      detail: [
        'Start at the wheel arch, one hand flat on the fender, one gripping the cover edge',
        'Outward first to clear the slot, then forward',
        'Work both sides a little at a time rather than freeing one side completely',
      ],
      camera: { pos: [4.2, 0.8, 3.6], target: [1.9, 0.1, 0] },
      focus: ['cover'],
      hotspots: [{ part: 'cover', label: 'Side tab', spec: 'outward, then forward' }],
      explode: 0.3,
      durationMin: 8,
      mistake:
        'Yanking the cover forward with the tabs still engaged. The ear breaks off inside the fender and from then on that corner of the bumper sits proud forever.',
    },
    {
      id: 'x6',
      title: 'Lift the cover off and support it properly',
      body:
        'With everything released, lift the cover away squarely and set it **face-up on a blanket** or across two padded stands. Never lean a painted cover against a wall — it will slide, and the fix for a scratched bumper is a paint job.',
      camera: { pos: [2.4, 1.4, 6.0], target: [0, 0.2, 0.8] },
      focus: ['cover', 'grille'],
      hotspots: [
        { part: 'cover', label: 'Bumper cover — painted' },
        { part: 'grille', label: 'Grille (comes with the cover)' },
      ],
      explode: 0.7,
      durationMin: 5,
    },
    {
      id: 'x7',
      title: 'What is behind it, and what is structural',
      body:
        'Behind the cover: an **energy absorber** in foam, and behind that the **reinforcement bar** bolted to the frame rails. The cover and the foam are cosmetic and sacrificial. The bar is structural, and its bolts are the only real torque on this job at **74 N·m**.',
      camera: { pos: [2.0, 1.0, 4.8], target: [0, 0, -0.4] },
      focus: ['absorber', 'reinfBar', 'barBolts'],
      hotspots: [
        { part: 'absorber', label: 'Energy absorber', spec: 'sacrificial foam' },
        { part: 'reinfBar', label: 'Reinforcement bar', spec: 'structural' },
        { part: 'barBolts', label: 'Bar bolts', spec: '74 N·m' },
      ],
      explode: 0.6,
      torque: [{ fastener: 'Reinforcement bar bolt', nm: 74, ftlb: 55 }],
      durationMin: 8,
      tip:
        'If the foam absorber is crushed or the bar is bent, the car has had a front impact. Worth knowing before you quote a job on the rest of the nose.',
    },
    {
      id: 'x8',
      title: 'Refit: tabs first, then gaps, then fasteners',
      body:
        'Reverse the order: **engage the side tabs first**, then settle the top edge, then start fasteners loosely. Check the panel gap along both headlights and the hood line **before** tightening anything, and adjust by shifting the cover while the fasteners are loose.',
      detail: [
        'All fasteners loose until the gaps look even on both sides',
        'Gap at the headlight edge should match left to right',
        'New push-pin rivets — the old ones are scrap',
        'Then snug everything by hand. These are 2 N·m fasteners into plastic',
      ],
      camera: { pos: [1.0, 2.0, 6.2], target: [0, 0.2, 0.3] },
      focus: ['cover', 'topClips', 'linerScrews', 'lowerScrews'],
      explode: 0.08,
      torque: [{ fastener: 'Bumper cover screw / rivet', nm: 2, inlb: 18, note: 'Hand-tight into plastic' }],
      durationMin: 15,
    },
  ],
  hiddenByStep: {
    x1: ['absorber', 'reinfBar', 'barBolts'],
    x2: ['absorber', 'reinfBar', 'barBolts'],
    x3: ['absorber', 'reinfBar', 'barBolts'],
    x4: ['absorber', 'reinfBar', 'barBolts'],
    x5: ['absorber', 'reinfBar', 'barBolts'],
    x6: ['topClips', 'topScrews', 'lowerScrews', 'linerScrews'],
    x7: ['cover', 'grille', 'topClips', 'topScrews', 'lowerScrews', 'linerScrews'],
    x8: [],
  },
  checkpoints: [
    {
      id: 'xc1',
      afterStep: 'x5',
      question: 'Why do the side tabs have to be released outward before the cover is pulled forward?',
      options: [
        {
          text: 'The tab sits in a slot in the fender — pulling forward loads it against the slot and shears it off',
          correct: true,
          why:
            'The tab is a hook, not a clip. It has to come out of its slot sideways first. Pulling forward against a captive hook breaks the plastic every time.',
        },
        {
          text: 'To avoid scratching the paint on the fender edge',
          why: 'Worth avoiding, but the tab geometry is the real reason.',
        },
        {
          text: 'So the headlight connectors do not get stretched',
          why: 'Headlamps mount to the body and stay put; they are not held by the cover.',
        },
        {
          text: 'It is interchangeable — either direction works',
          why: 'It is not. The order is what keeps the mounting ears intact.',
        },
      ],
    },
    {
      id: 'xc2',
      afterStep: 'x7',
      question:
        'The bumper cover screws are 2 N·m but the reinforcement bar bolts are 74 N·m. What explains the difference?',
      options: [
        {
          text: 'The cover is cosmetic plastic and strips easily; the bar is a structural member bolted to the frame rails and carries crash loads',
          correct: true,
          why:
            'Function sets the spec. A cosmetic panel only needs to be held in place. A structural member needs clamp load it can rely on in a collision.',
        },
        {
          text: 'The bar bolts are longer, so they need more torque',
          why: 'Length follows from the joint design, not the other way around.',
        },
        {
          text: 'The cover screws are self-tapping so torque does not apply',
          why: 'They still have a spec — a low one, because the material is plastic.',
        },
        {
          text: 'The bar bolts are torque-to-yield',
          why: 'They are conventional fasteners here. The difference is the load they carry.',
        },
      ],
    },
  ],
}
