import type { Procedure } from '../../lib/types'

export const oilService: Procedure = {
  id: 'oil-and-filter',
  title: 'Oil & Filter Change',
  subtitle: 'The first job — and the one with the most expensive mistakes',
  primaryVehicleId: 'civic-2016',
  alsoApplies: ['camry-2014', 'accord-v6-2009', 'mustang-gt-2018', 'silverado-2015'],
  system: 'maintenance',
  location: 'underbody',
  difficulty: 1,
  timeMin: 40,
  assembly: 'oilService',
  summary:
    'Everyone thinks they know this one. The mistakes that destroy engines are all in the details: the old filter gasket left stuck to the mount, a reused crush washer, an over-torqued drain plug in an aluminium pan, and starting the engine before you checked the level.',
  objectives: [
    'Select the correct oil grade and specification for a given engine',
    'Explain what a crush washer does and why it is single-use',
    'Fit a spin-on filter to the correct tightness without a wrench',
    'Verify the old filter gasket came off with the old filter',
    'Carry out the post-start checks in the right order',
  ],
  tools: [
    { name: 'Ramps, or jack + 2 stands', category: 'safety' },
    { name: 'Nitrile gloves + safety glasses', category: 'safety' },
    { name: 'Drain pan, 6 L minimum', category: 'specialty' },
    { name: '17 mm socket', detail: 'Drain plug — check yours', category: 'hand' },
    { name: 'Oil filter wrench or cap socket', detail: 'For removal only', category: 'specialty' },
    { name: 'Torque wrench 10–60 N·m', category: 'measure' },
    { name: 'Funnel', category: 'hand' },
    { name: 'Shop rags + cardboard sheet', category: 'consumable' },
    { name: 'Sealable container for waste oil', category: 'consumable' },
  ],
  parts: [
    { name: 'Oil filter', qty: '1', note: 'Correct part number — bypass valve specs differ between engines' },
    { name: 'Drain plug crush washer', qty: '1', note: 'New one every time. They cost pennies' },
  ],
  fluids: [
    { name: 'Engine oil', spec: '0W-20 full synthetic, API SN or later', qty: '3.9 qt with filter (Civic 1.8L)' },
  ],
  torqueTable: [
    { fastener: 'Oil drain plug', nm: 39, ftlb: 29, note: 'New crush washer. Aluminium pan — do not guess' },
    { fastener: 'Spin-on oil filter', nm: 26, ftlb: 19, note: 'Or 3/4 turn past gasket contact, by hand' },
    { fastener: 'Cartridge filter housing cap', nm: 25, ftlb: 18, note: 'Where fitted — new O-ring' },
  ],
  hazards: [
    { kind: 'burn', text: 'Warm oil, not hot. Drain at around 50 °C, not straight off a motorway run.' },
    { kind: 'chemical', text: 'Used engine oil is a confirmed skin carcinogen with repeated exposure. Gloves, every time.' },
    { kind: 'crush', text: 'Ramps or rated stands. Never a bumper jack, never bricks.' },
  ],
  steps: [
    {
      id: 'o1',
      title: 'Get the specification right first',
      body:
        'Oil grade is **not a preference**. Modern engines have tight hydraulic clearances in their variable valve timing and chain tensioners that are designed around a specific viscosity. Putting 10W-40 in an engine that calls for 0W-20 causes real problems, not just worse economy.',
      detail: [
        'Viscosity grade from the owner\'s manual or the oil filler cap',
        'Specification matters too — API SN/SP, or an OEM spec like dexos1 or Honda HTO-06',
        'Capacity "with filter" is the number you want, and it is never a round figure',
        'Direct-injection and turbo engines are more sensitive, not less',
      ],
      camera: { pos: [3.4, 1.9, 5.0], target: [0, 0.75, 0] },
      focus: ['fillCap', 'dipstick'],
      hotspots: [
        { part: 'fillCap', label: 'Filler cap', spec: 'grade is often moulded here' },
        { part: 'dipstick', label: 'Dipstick' },
      ],
      explode: 0.18,
      durationMin: 5,
    },
    {
      id: 'o2',
      title: 'Warm it, lift it, position the pan',
      body:
        'Run the engine 3–5 minutes so the oil is warm and carries contaminants with it, then shut it off. Lift the car level, slide cardboard down, and position the drain pan **offset toward where the stream will actually land** — oil leaves the plug at an angle, not straight down.',
      camera: { pos: [2.4, -1.0, 4.0], target: [0, -1.0, 0.2] },
      focus: ['drainPan', 'oilPan', 'drainPlug'],
      hotspots: [
        { part: 'drainPlug', label: 'Drain plug', spec: '39 N·m' },
        { part: 'drainPan', label: 'Catch pan — offset for the stream' },
      ],
      explode: 0.2,
      hazards: ['burn', 'crush'],
      durationMin: 10,
      tip: 'Crack the filler cap loose before you pull the plug. The oil drains faster and more completely with the crankcase vented.',
    },
    {
      id: 'o3',
      title: 'Pull the plug — and expect to lose it',
      body:
        'Loosen the plug with a socket, then **take the last few turns by hand with a rag** so you can feel it come free. The plug will end up in the drain pan at least once in your career. Fish it out before the oil cools.',
      camera: { pos: [1.6, -1.2, 3.4], target: [0.1, -0.9, 0.3] },
      focus: ['drainPlug', 'stream', 'drainPan'],
      hotspots: [
        { part: 'drainPlug', label: 'Drain plug' },
        { part: 'stream', label: 'Oil leaves at an angle' },
      ],
      explode: 0.3,
      hazards: ['burn', 'chemical'],
      durationMin: 10,
    },
    {
      id: 'o4',
      title: 'New crush washer — every single time',
      body:
        'The soft aluminium or copper washer on the drain plug is a **single-use sealing element**. It deforms to fill the imperfections between plug and pan. A reused one has already deformed and will seep — and the usual response, tightening harder, is what strips an aluminium oil pan.',
      camera: { pos: [1.8, -0.8, 3.0], target: [0.4, -0.7, 0.4] },
      focus: ['crushWasher', 'drainPlug'],
      hotspots: [{ part: 'crushWasher', label: 'Crush washer', spec: 'single use' }],
      explode: 0.55,
      durationMin: 4,
      mistake:
        'Reusing the washer, finding a seep, and reaching for a longer bar. Stripped drain plug threads mean a new oil pan or a repair insert.',
    },
    {
      id: 'o5',
      title: 'Drain plug to 39 N·m — with a torque wrench',
      body:
        'This is the fastener people most often over-tighten, in the softest material on the car. **39 N·m is not tight by hand standards.** Use a torque wrench, even though nobody else does.',
      camera: { pos: [1.6, -1.0, 3.2], target: [0.1, -0.8, 0.3] },
      focus: ['drainPlug', 'oilPan'],
      hotspots: [{ part: 'drainPlug', label: 'Drain plug', spec: '39 N·m / 29 ft-lb' }],
      explode: 0.1,
      torque: [{ fastener: 'Oil drain plug', nm: 39, ftlb: 29, note: 'New crush washer fitted' }],
      durationMin: 4,
    },
    {
      id: 'o6',
      title: 'Old filter off — then check the mount',
      body:
        'Spin the old filter off with the pan underneath; it is full of oil. Then do the step people skip: **wipe the mounting face and confirm the old rubber gasket came off with the filter**. A gasket left behind means two gaskets stacked, which blows out under pressure and empties the sump in seconds.',
      detail: [
        'Puncture-type filter wrenches are a last resort — they make a mess',
        'Wipe the mounting face clean and run a finger round it',
        'If the old gasket is stuck to the mount, peel it off completely',
        'Compare the old and new filters side by side before fitting',
      ],
      camera: { pos: [3.8, 1.3, 3.8], target: [1.2, 0.8, 0.4] },
      focus: ['filter', 'filterGasket', 'filterMount'],
      hotspots: [
        { part: 'filterGasket', label: 'Gasket', spec: 'must come off with the filter' },
        { part: 'filterMount', label: 'Filter mount', spec: 'wipe and inspect' },
      ],
      explode: 0.5,
      hazards: ['chemical'],
      durationMin: 8,
      mistake:
        'The double-gasket failure. It is the single most expensive mistake on the easiest job in the workshop, and it is entirely avoidable by running a finger round the mount.',
    },
    {
      id: 'o7',
      title: 'New filter: lube the gasket, hand-tight only',
      body:
        'Smear clean oil on the new filter\'s rubber gasket so it slides rather than grabs and rolls. Spin it on until the gasket contacts the mount, then **about three-quarters of a turn more, by hand**. No wrench on installation.',
      detail: [
        'A dry gasket can roll out of its groove as it tightens and will leak',
        'Pre-filling the filter is optional and only works on upright mountings',
        '3/4 turn past contact, or the printed spec on the filter body',
        'If you cannot get it off by hand next time, it was too tight this time',
      ],
      camera: { pos: [3.0, 0.4, 3.0], target: [0.9, 0.3, 0.4] },
      focus: ['filter', 'filterGasket'],
      hotspots: [{ part: 'filter', label: 'New filter', spec: '3/4 turn past contact' }],
      explode: 0.25,
      torque: [{ fastener: 'Spin-on oil filter', nm: 26, ftlb: 19, note: 'Or 3/4 turn past contact by hand' }],
      durationMin: 5,
    },
    {
      id: 'o8',
      title: 'Fill short, start, check, top up',
      body:
        'Add about **half a quart less than capacity**, then start the engine and watch the oil pressure light go out within a couple of seconds. Shut it off, wait five minutes for oil to drain back, then check the dipstick and bring it to the upper mark. Overfilling is as harmful as underfilling.',
      detail: [
        'Deliberately fill short — the last half quart goes in by dipstick',
        'Watch the pressure light. If it stays on, shut off immediately and find out why',
        'Look under the car for drips at the plug and the filter while it idles',
        'Wait 5 minutes before reading the dipstick, car level',
        'Reset the oil life monitor, and log the mileage',
      ],
      camera: { pos: [2.8, 2.2, 4.4], target: [0, 0.6, 0] },
      focus: ['fillCap', 'dipstick', 'drainPlug', 'filter'],
      hotspots: [
        { part: 'fillCap', label: 'Fill short, then top up' },
        { part: 'dipstick', label: 'Check after 5 min' },
      ],
      explode: 0.15,
      durationMin: 12,
      mistake:
        'Pouring in the full capacity from the bottle and walking away. Residual oil in the engine means the stated capacity usually overfills it.',
    },
  ],
  hiddenByStep: {
    o1: ['stream', 'drainPan'],
    o2: ['stream'],
    o3: [],
    o4: ['stream'],
    o5: ['stream'],
    o6: ['stream'],
    o7: ['stream'],
    o8: ['stream', 'drainPan'],
  },
  checkpoints: [
    {
      id: 'oc1',
      afterStep: 'o6',
      question:
        'An engine is refilled after an oil change, started, and dumps its entire sump onto the floor within thirty seconds. What happened?',
      options: [
        {
          text: 'The old filter gasket stayed stuck on the mount, so the new filter sealed against two gaskets and blew out under pressure',
          correct: true,
          why:
            'The double-gasket failure. Two stacked gaskets cannot seat, so oil pressure forces the joint open. This is why wiping and inspecting the mounting face is a required step, not a nicety.',
        },
        {
          text: 'The drain plug was not tightened',
          why: 'That leaks, but usually as a steady drip or stream, and it would be visible before starting.',
        },
        {
          text: 'The engine was overfilled',
          why: 'Overfilling causes aeration and seal problems, not a sudden total loss.',
        },
        {
          text: 'Wrong oil viscosity',
          why: 'Viscosity does not cause a joint to blow out.',
        },
      ],
    },
    {
      id: 'oc2',
      afterStep: 'o5',
      question: 'Why does a drain plug get a brand new crush washer rather than a reused one?',
      options: [
        {
          text: 'It seals by permanently deforming into the gap between plug and pan, so once crushed it cannot do that again',
          correct: true,
          why:
            'Exactly. The washer is a sacrificial sealing element. Reusing one leads to a seep, and the instinctive fix — more torque — strips the threads in a soft aluminium pan.',
        },
        {
          text: 'The old washer will have work-hardened and will crack',
          why: 'Cracking is possible but the real issue is that it has already given up its deformation.',
        },
        {
          text: 'It is only needed on steel pans',
          why: 'It is needed wherever the design specifies it, and matters most on aluminium.',
        },
        {
          text: 'Manufacturers require it for warranty reasons only',
          why: 'It is a functional requirement, not paperwork.',
        },
      ],
    },
  ],
}
