import type { Procedure } from '../../lib/types'

const COVER_OFF = ['engineCover']
const UNPLUGGED = [...COVER_OFF, 'coilConnectors']
const COILS_OFF = [...UNPLUGGED, 'coils', 'coilBolts']
const PLUGS_OFF = [...COILS_OFF, 'plugs']

export const mustangSparkPlugs: Procedure = {
  id: 'mustang-spark-plugs',
  title: 'Spark Plugs & Coil-on-Plug Ignition',
  subtitle: 'Eighteen newton-metres into aluminium',
  primaryVehicleId: 'mustang-gt-2018',
  alsoApplies: ['silverado-2015', 'camry-2014'],
  system: 'maintenance',
  location: 'underhood',
  difficulty: 2,
  timeMin: 90,
  assembly: 'ignition',
  summary:
    'There is no mechanical skill in this job and no shortage of ways to make it expensive. A spark plug threads into aluminium, seals a combustion chamber and conducts heat out of it, all at 18 N·m — about the torque of a firm wrist. You will learn why the engine has to be cold, what the old plugs are telling you before you throw them away, and the honest answer on anti-seize.',
  objectives: [
    'Explain why spark plugs are removed from a cold engine, in terms of aluminium and steel',
    'Remove a coil-on-plug coil without tearing the boot or breaking the connector lock',
    'Read a used plug: electrode wear, insulator colour and what oil in the well means',
    'Check gap on a new plug without bending a fine-wire electrode',
    'Torque a plug to spec and say what the specification is protecting',
  ],
  tools: [
    { name: 'Safety glasses', category: 'safety' },
    { name: 'Nitrile gloves', category: 'safety' },
    { name: '5/8" spark plug socket with a rubber retainer', detail: 'Magnetic is fine, rubber is better', category: 'hand' },
    { name: '3/8" drive ratchet + 150 mm extension + swivel', category: 'hand' },
    { name: '7 mm or 8 mm socket', detail: 'Coil bolts', category: 'hand' },
    { name: 'Click torque wrench, 5–40 N·m', detail: 'The 1/2" drive wrench is useless at 18 N·m', category: 'measure' },
    { name: 'In-lb torque wrench or small 3/8" click wrench', detail: 'Coil bolts at 7 N·m', category: 'measure' },
    { name: 'Wire-loop or feeler gap gauge', detail: 'Never a coin-type gauge on a fine-wire plug', category: 'measure' },
    { name: 'Compressed air or a shop vacuum', detail: 'Clearing the plug wells', category: 'power' },
    { name: 'Torque extension / spark plug thread chaser', detail: 'Only if a thread is in doubt', category: 'specialty' },
    { name: 'Dielectric grease', detail: 'Inside the boots', category: 'consumable' },
    { name: 'Nickel anti-seize', detail: 'Read step 10 before you open it', category: 'consumable' },
    { name: 'Clean rag and a parts tray', category: 'consumable' },
  ],
  parts: [
    { name: 'Spark plugs', qty: '8', note: 'Correct part number and heat range — not a cross-reference guess' },
    { name: 'Coil boots', qty: 'As needed', note: 'Replace any with tracking marks' },
    { name: 'Cam cover gasket', qty: 'Only if the wells are oily', note: 'A separate job that this one reveals' },
  ],
  torqueTable: [
    { fastener: 'Spark plug', nm: 18, ftlb: 13, note: 'Cold engine. New plug with its own washer' },
    { fastener: 'Ignition coil bolt', nm: 7, inlb: 62, note: 'Into an aluminium cover boss' },
    { fastener: 'Camshaft cover bolt', nm: 10, ftlb: 7, pattern: 'Centre outward', note: 'Only if the cover is disturbed' },
  ],
  hazards: [
    {
      kind: 'burn',
      text: 'A hot exhaust manifold sits inches from the plugs on this engine. Cold engine means cold, not "it has been off a while".',
    },
    {
      kind: 'electrical',
      text: 'Ignition coils produce tens of kilovolts. Battery negative disconnected before you start, and never crank with a coil out of its well.',
    },
    { kind: 'eye', text: 'Blowing a plug well out puts whatever was in it straight back at your face. Glasses on.' },
    {
      kind: 'sharp',
      text: 'A dropped plug is a cracked insulator even when it looks fine. Fit it and you own an ignition misfire you cannot find.',
    },
  ],
  steps: [
    {
      id: 's1',
      title: 'Cold engine, battery disconnected',
      body:
        'Aluminium expands about twice as much as the steel plug shell. On a hot head the aluminium has grown around the steel threads and tightened its grip, so **pulling plugs hot is how threads come out with them**. Overnight cold, bonnet open. Then disconnect the battery negative.',
      detail: [
        'Engine stone cold — overnight, not twenty minutes',
        'Battery negative terminal off and tucked aside',
        'Clear the working area and set out a tray so plugs stay in cylinder order',
      ],
      camera: { pos: [2.8, 3.2, 6.8], target: [0, 0.2, 0.2] },
      explode: 0,
      hazards: ['burn', 'electrical'],
      durationMin: 5,
      tip:
        'Keeping the old plugs in cylinder order costs nothing and turns step 8 from a guess into a diagnosis.',
    },
    {
      id: 's2',
      title: 'Engine cover off — it pushes, it does not unbolt',
      body:
        'The appearance cover sits on **rubber grommets**. Pull it straight up with even hands at both ends. There are no bolts under it to find, and prying at one corner is what cracks the mounting bosses.',
      camera: { pos: [2.4, 3.4, 6.0], target: [0, 0.8, 0.2] },
      focus: ['engineCover'],
      hotspots: [{ part: 'engineCover', label: 'Appearance cover', spec: 'push-fit on grommets' }],
      explode: 0.3,
      durationMin: 4,
    },
    {
      id: 's3',
      title: 'Clean the wells before you open anything',
      body:
        'Every plug well is a funnel pointing at an open combustion chamber. **Blow or vacuum the wells out now**, with the plugs still in them, so grit and leaf litter cannot drop into a cylinder later. Sand in a bore is an engine, not an inconvenience.',
      detail: [
        'Air or vacuum into each well with the plug still sealing the bottom',
        'Wipe the sealing area around the top of each well',
        'Look into each well while you are there — oil or coolant is a finding, see step 6',
      ],
      camera: { pos: [1.5, 2.9, 5.2], target: [0, 0.05, 0] },
      focus: ['camCover'],
      hotspots: [{ part: 'camCover', label: 'Plug wells', spec: 'clear before removal' }],
      explode: 0.15,
      hazards: ['eye'],
      durationMin: 8,
      mistake:
        'Pulling the plugs first and then cleaning. Now the debris has eight open holes to fall into and you will not know whether it did.',
    },
    {
      id: 's4',
      title: 'Unplug the coils — release the tab, do not pull the wire',
      body:
        'Each connector has a **locking tab**. Press or lift it, then pull on the connector body. Pulling on the harness stretches terminals out of their sockets, and an intermittent ignition connector is one of the worst faults to chase.',
      camera: { pos: [1.0, 3.2, 5.2], target: [0, 0.5, -0.3] },
      focus: ['coilConnectors'],
      hotspots: [{ part: 'coilConnectors', label: 'Coil connector ×8', spec: 'release lock tab first' }],
      explode: 0.4,
      hazards: ['electrical'],
      durationMin: 8,
      tip:
        'If a lock tab is already broken, note the cylinder. A connector that is not latched works perfectly until the engine moves on its mounts.',
    },
    {
      id: 's5',
      title: 'Coil bolts out, coils out with a twist',
      body:
        'One bolt per coil, **7 N·m** into an aluminium boss. Then twist the coil a quarter turn before lifting, to break the boot free of the insulator. Lifting a stuck boot straight up is how it tears off and stays in the well.',
      camera: { pos: [1.9, 3.2, 5.4], target: [0, 0.7, 0] },
      focus: ['coils', 'coilBolts'],
      hotspots: [
        { part: 'coilBolts', label: 'Coil bolt', spec: '7 N·m' },
        { part: 'coils', label: 'Ignition coil ×8' },
      ],
      explode: 0.5,
      torque: [{ fastener: 'Ignition coil bolt', nm: 7, inlb: 62 }],
      durationMin: 10,
    },
    {
      id: 's6',
      title: 'Look at the boots and the wells',
      body:
        'Now you can see what the ignition system has been living in. **Oil in a plug well is a cam cover gasket, not an ignition fault** — it softens the boot, lets the spark track to the side of the well, and causes a misfire that new plugs will not fix.',
      detail: [
        'Grey or white tracking lines up the inside of a boot: that cylinder has been arcing to ground',
        'Oil in the well: the cover gasket well seals have gone. Fix that or the new boot goes the same way',
        'A swollen or soft boot gets replaced regardless of mileage',
        'Rust-coloured dust at the bottom of a well is usually water that has been getting in past the cover',
      ],
      camera: { pos: [1.7, 2.9, 5.0], target: [0, 0.4, 0] },
      focus: ['camCover', 'coverGasket'],
      hotspots: [
        { part: 'coverGasket', label: 'Cover gasket well seals' },
        { part: 'camCover', label: 'Plug well' },
      ],
      explode: 0.55,
      durationMin: 8,
    },
    {
      id: 's7',
      title: 'Plugs out — crack, back off, then break them loose again',
      body:
        'Set the wrench to break the plug loose about a quarter turn, then **stop and tighten it back a little, then loosen further**. Working it back and forth lets carbon on the threads clear instead of being dragged out through the aluminium. If one goes tight on the way out, stop and work it rather than pulling harder.',
      detail: [
        'Socket square on the hex, extension straight — a cocked socket cracks the insulator',
        'Loosen a quarter turn, tighten an eighth, loosen a half, repeat out of the thread',
        'If any plug goes suddenly tight, it is picking up thread. Back off and work it again',
        'Keep each plug in cylinder order in the tray',
      ],
      camera: { pos: [2.0, 2.8, 5.2], target: [0, 0.55, 0] },
      focus: ['plugs'],
      hotspots: [{ part: 'plugs', label: 'Spark plug ×8', spec: '5/8" hex, 18 N·m' }],
      explode: 0.45,
      durationMin: 15,
      mistake:
        'Leaning on a breaker bar because a plug feels tight. Carbon-locked threads will pull an aluminium insert out of the head, and that repair costs more than the car is worth to most owners.',
    },
    {
      id: 's8',
      title: 'Read the old plugs before you bin them',
      body:
        'Eight plugs laid out in cylinder order are a free diagnostic report. **Light tan on the insulator nose is a healthy cylinder.** Anything that stands out from its seven neighbours is worth understanding before the new plugs go in.',
      detail: [
        'Light tan or grey insulator nose: normal combustion',
        'Black and dry, sooty: rich mixture or weak ignition on that cylinder',
        'Black and wet with oil: oil control — rings, guides or that cover gasket',
        'White, blistered, or a melted electrode: detonation or a lean cylinder. Find the cause',
        'Rounded electrode edges and a wide gap: simply worn out, which is the answer you want',
      ],
      camera: { pos: [1.7, 2.6, 4.6], target: [0, 0.6, 0] },
      focus: ['plugs'],
      hotspots: [{ part: 'plugs', label: 'Used plugs', spec: 'insulator colour + gap' }],
      measure: [
        { name: 'Used plug gap', spec: 'Typically 0.1–0.2 mm wider than new after a service life', tool: 'Wire gap gauge' },
      ],
      explode: 0.7,
      durationMin: 10,
      tip:
        'One plug different from the other seven is information. Eight plugs all the same, whatever they look like, is a fuel or ignition condition affecting the whole engine.',
    },
    {
      id: 's9',
      title: 'Check the new plugs, gently',
      body:
        'New plugs are supposed to be pre-gapped and usually are, but boxes get dropped. **Check the gap with a wire-loop gauge, never a coin-type gauge** — a fine-wire iridium or platinum electrode will snap or bend, and you cannot re-gap one by levering on the tip.',
      detail: [
        'Compare the part number on every plug against the one you ordered, one at a time',
        'Wire-loop gauge through the gap: it should pass with light drag',
        'If a gap needs adjusting, move the ground strap only, in small amounts, never the centre electrode',
        'Any plug that has been dropped gets set aside, however fine it looks',
      ],
      camera: { pos: [1.6, 2.5, 4.4], target: [0, 0.55, 0] },
      focus: ['plugs'],
      hotspots: [{ part: 'plugs', label: 'New plug', spec: 'gap 1.3 mm nominal' }],
      measure: [{ name: 'New plug gap', spec: '1.3 mm (verify against the plug specification)', tool: 'Wire-loop gauge' }],
      explode: 0.6,
      durationMin: 10,
    },
    {
      id: 's10',
      title: 'Anti-seize: the honest answer',
      body:
        'Most plug manufacturers say **do not** use it — modern plugs have a plated shell designed to go in dry, and anti-seize acts as a lubricant that makes a given torque produce much more clamp load, so you over-tighten while the wrench says 18. Some shops still use a trace on aluminium heads with a long service interval. If you use it, keep it off the first few threads and off the electrode, and reduce torque accordingly.',
      detail: [
        'Dry is the default. Follow the plug maker’s instruction, which is printed on the box',
        'If the application genuinely calls for it: a thin film on the middle threads only',
        'Never on the sealing washer face, never near the electrode',
        'Never on a tapered-seat plug — the seat does the sealing and it must not be lubricated',
      ],
      camera: { pos: [1.8, 2.4, 4.6], target: [0, 0.3, 0] },
      focus: ['plugs', 'head'],
      hotspots: [{ part: 'head', label: 'Aluminium plug threads', spec: 'what the torque spec protects' }],
      explode: 0.5,
      durationMin: 5,
      mistake:
        'Lubricating the threads and then torquing to the dry figure. The lubricant removes most of the thread friction, so far more of your 18 N·m turns into stretch — which is how a plug that was "torqued to spec" strips the head.',
    },
    {
      id: 's11',
      title: 'Start every plug by hand, then 18 N·m',
      body:
        'Drop each plug down its well in a length of hose or a rubber-lined socket and **turn it in by hand until it seats**. If it will not start by hand, it is cross-threaded — stop. Then torque to **18 N·m** with a small click wrench, in one smooth pull.',
      detail: [
        'A 300 mm length of fuel hose on the insulator makes a perfect starting tool and cannot cross-thread',
        'Hand-tight until the washer touches, then the wrench',
        '18 N·m is about the torque of a firm wrist on a 3/8" ratchet. The 1/2" wrench has no useful resolution here',
        'One pull to the click. No extra "just to be sure" nudge',
      ],
      camera: { pos: [1.7, 2.3, 4.4], target: [0, 0.1, 0] },
      focus: ['plugs'],
      hotspots: [{ part: 'plugs', label: 'Spark plug', spec: '18 N·m' }],
      explode: 0.2,
      torque: [{ fastener: 'Spark plug', nm: 18, ftlb: 13, note: 'Cold engine, dry threads' }],
      durationMin: 15,
      mistake:
        'Running a plug down with a ratchet from the top of the well. You cannot feel a cross-thread through an extension, and by the time you can, the aluminium is already cut.',
    },
    {
      id: 's12',
      title: 'Dielectric grease inside the boots, coils down',
      body:
        'A thin smear of **dielectric grease inside each boot** — it keeps moisture out and lets the boot release next time. It is an insulator, so it goes on the inside of the rubber and not on the spring contact or the plug terminal.',
      camera: { pos: [1.8, 3.0, 5.0], target: [0, 0.6, 0] },
      focus: ['coils'],
      hotspots: [{ part: 'coils', label: 'Boot interior', spec: 'thin film of dielectric grease' }],
      explode: 0.3,
      durationMin: 6,
    },
    {
      id: 's13',
      title: 'Coils seated, bolts to 7 N·m',
      body:
        'Push each coil down until you feel the boot click onto the plug terminal, then **7 N·m** on the bolt. That is 62 in-lb — a small wrench. This boss is aluminium and a half-inch ratchet will pull the thread straight out of it.',
      camera: { pos: [1.4, 3.0, 4.4], target: [0, 0.3, 0] },
      focus: ['coils', 'coilBolts'],
      hotspots: [{ part: 'coilBolts', label: 'Coil bolt', spec: '7 N·m / 62 in-lb' }],
      explode: 0.12,
      torque: [{ fastener: 'Ignition coil bolt', nm: 7, inlb: 62 }],
      durationMin: 8,
      tip: 'If a coil will not seat, the plug is not fully in or the boot is folded. Do not use the bolt to pull it down.',
    },
    {
      id: 's14',
      title: 'Connectors on — listen for the click',
      body:
        'Push each connector until the lock tab **clicks**, then tug the body lightly to confirm it is latched. Route the harness back into its clips so nothing rests on the exhaust side of the cover.',
      camera: { pos: [1.0, 3.0, 5.0], target: [0, 0.4, -0.2] },
      focus: ['coilConnectors'],
      hotspots: [{ part: 'coilConnectors', label: 'Connector', spec: 'latched + tug tested' }],
      explode: 0.1,
      durationMin: 6,
      mistake:
        'A connector pushed on but not latched. It runs perfectly on the test drive and drops a cylinder on the motorway three weeks later.',
    },
    {
      id: 's15',
      title: 'Cover on, battery on, run it and confirm',
      body:
        'Cover back onto its grommets, battery negative back on, then start it and let it idle. **A fresh misfire after a plug change is almost always a connector or a boot**, not a faulty new plug — and a scan tool will tell you which cylinder in seconds.',
      detail: [
        'Listen for a smooth idle, no rhythmic stumble',
        'Scan for stored codes: P0301 through P0308 name the cylinder directly',
        'A short road test under light load, then re-scan',
        'Reset any learned idle values the manufacturer calls for after a battery disconnect',
      ],
      camera: { pos: [2.8, 3.2, 6.8], target: [0, 0.2, 0.2] },
      explode: 0,
      durationMin: 10,
    },
  ],
  hiddenByStep: {
    s1: [],
    s2: [],
    s3: COVER_OFF,
    s4: COVER_OFF,
    s5: UNPLUGGED,
    s6: COILS_OFF,
    s7: COILS_OFF,
    s8: PLUGS_OFF,
    s9: PLUGS_OFF,
    s10: PLUGS_OFF,
    s11: COILS_OFF,
    s12: UNPLUGGED,
    s13: UNPLUGGED,
    s14: COVER_OFF,
    s15: [],
  },
  checkpoints: [
    {
      id: 'cp1',
      afterStep: 's1',
      question: 'Why are spark plugs removed from a cold engine rather than a warm one?',
      options: [
        {
          text: 'Aluminium expands roughly twice as much as the steel plug shell, so a hot head grips the threads harder and is far more likely to pull them out',
          correct: true,
          why:
            'That difference in thermal expansion is the whole reason. Cold, the aluminium has shrunk back off the steel and the plug comes out against carbon alone rather than against a thread clamped onto it.',
        },
        {
          text: 'Hot plugs read differently, so the diagnosis would be wrong',
          why: 'Deposits do not change in the few minutes after shutdown. Thread damage is the risk, not misreading.',
        },
        {
          text: 'A warm engine holds pressure in the cylinder which can eject the plug',
          why: 'There is no residual pressure in a stationary engine.',
        },
        {
          text: 'Cold threads take anti-seize better',
          why: 'Most plugs should go in dry, and surface temperature is not what makes a thread grip.',
        },
      ],
    },
    {
      id: 'cp2',
      afterStep: 's6',
      question:
        'One plug well is full of oil and the boot from that cylinder is soft and has grey tracking lines up the inside. What is the repair?',
      options: [
        {
          text: 'Replace the cam cover gasket and that boot — the oil leak is the cause and the misfire is the symptom',
          correct: true,
          why:
            'Oil gets into the well past the cover gasket’s well seals, softens the boot and gives the spark a path to the side of the well. New plugs alone will misfire again within weeks.',
        },
        {
          text: 'Fit a new coil for that cylinder and move on',
          why: 'The coil may well be damaged, but if the well keeps filling with oil the new one goes the same way.',
        },
        {
          text: 'Use a hotter heat range plug in that cylinder to burn the oil off',
          why: 'Mixing heat ranges between cylinders is a route to detonation, and the oil is outside the chamber anyway.',
        },
        {
          text: 'Nothing — oil in the well is normal on a high-mileage engine',
          why: 'Common is not normal. The well is sealed by design, and oil in it means that seal has failed.',
        },
      ],
    },
    {
      id: 'cp3',
      afterStep: 's11',
      question:
        'A technician coats the plug threads with anti-seize and then torques to the specified 18 N·m. What has actually happened to the plug?',
      options: [
        {
          text: 'It is over-tightened — the lubricant cut thread friction, so much more of the 18 N·m became stretch and clamp load',
          correct: true,
          why:
            'Torque is mostly spent overcoming friction. Lubricate the threads and the same reading delivers substantially more clamp load, which is how a plug "torqued to spec" strips an aluminium head.',
        },
        {
          text: 'It is under-tightened, because the lubricant lets it turn back out',
          why: 'Nothing about a lubricated thread causes it to back out under a static clamp load.',
        },
        {
          text: 'It is correct — the torque figure already assumes anti-seize',
          why: 'Published plug torques assume the plating the plug came with and no added lubricant. The box says so.',
        },
        {
          text: 'The clamp load is unchanged, only the removal torque next time',
          why: 'Removal is easier, but the installation clamp load changed the moment friction dropped.',
        },
      ],
    },
  ],
}
