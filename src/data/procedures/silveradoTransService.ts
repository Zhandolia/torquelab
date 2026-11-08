import type { Procedure } from '../../lib/types'

export const silveradoTransService: Procedure = {
  id: 'silverado-trans-service',
  title: 'Automatic Transmission Fluid & Filter',
  subtitle: '6L80 — pan, filter and the no-dipstick level procedure',
  primaryVehicleId: 'silverado-2015',
  system: 'driveline',
  location: 'underbody',
  difficulty: 3,
  timeMin: 150,
  assembly: 'transService',
  summary:
    'Modern automatics have no dipstick, which turns a simple fluid change into a procedure with a temperature window and a level plug. Get it wrong and you either starve the pump or aerate the fluid. This module covers the pan drop, the filter, and how to actually set the level correctly.',
  objectives: [
    'Drop a transmission pan without making a mess or bending the flange',
    'Read the debris in the pan and on the magnets as a diagnostic',
    'Explain why a filter change only replaces part of the total fluid capacity',
    'Set fluid level using the level-check plug within the specified temperature window',
    'Explain why the specified fluid type is not interchangeable',
  ],
  tools: [
    { name: 'Vehicle lift or 4 jack stands', detail: 'The truck must be level for the level check', category: 'safety' },
    { name: 'Safety glasses + nitrile gloves', category: 'safety' },
    { name: 'Large drain pan, 15 L minimum', category: 'specialty' },
    { name: '13 mm and 15 mm sockets', category: 'hand' },
    { name: 'Torque wrench 5–30 N·m', detail: 'Pan bolts are only 12 N·m', category: 'measure' },
    { name: 'Scan tool with live transmission temperature', detail: 'Required — the level spec is a temperature window', category: 'specialty' },
    { name: 'Fluid transfer pump', detail: 'Fills through the level-check port', category: 'specialty' },
    { name: 'Gasket scraper, plastic', category: 'specialty' },
    { name: 'Brake cleaner + lint-free wipes', category: 'consumable' },
  ],
  parts: [
    { name: 'Transmission filter + seal', qty: '1' },
    { name: 'Pan gasket', qty: '1', note: 'Reusable moulded gasket on some years — inspect, do not assume' },
  ],
  fluids: [
    { name: 'Automatic transmission fluid', spec: 'DEXRON-VI (do not substitute)', qty: '~7.4 qt for a pan drop' },
  ],
  torqueTable: [
    { fastener: 'Transmission pan bolt', nm: 12, inlb: 106, pattern: 'Criss-cross from the centre, two passes' },
    { fastener: 'Level-check plug', nm: 12, inlb: 106 },
    { fastener: 'Filter retaining bolt', nm: 12, inlb: 106 },
  ],
  hazards: [
    { kind: 'burn', text: 'Transmission fluid runs at 80–110 °C. Let it cool, and wear long sleeves.' },
    { kind: 'chemical', text: 'ATF is a skin irritant and a disposal item. Catch all of it.' },
    { kind: 'crush', text: 'All four corners on rated stands, level. A level check on a tilted truck is a wrong level.' },
  ],
  steps: [
    {
      id: 'a1',
      title: 'Why there is no dipstick',
      body:
        'The 6L80 sets its level by a **standpipe and a level-check plug**, checked while the fluid is between 35 and 45 °C with the engine running. Fluid expands significantly over its operating range, so a cold level and a hot level are different volumes of the same correct fill.',
      detail: [
        'Too low: the pump cavitates and the clutches slip',
        'Too high: the rotating parts whip the fluid into foam, which does not transmit pressure',
        'You need a scan tool to see the actual fluid temperature — guessing defeats the procedure',
      ],
      camera: { pos: [3.6, 1.6, 4.4], target: [0, -0.2, 0] },
      explode: 0,
      durationMin: 10,
    },
    {
      id: 'a2',
      title: 'Level the truck and warm it, then let it cool',
      body:
        'Drive it briefly so the fluid is warm and the debris is in suspension, then put all four corners on rated stands with the truck level. Drop the drain plug and let it drain before you touch a single pan bolt.',
      camera: { pos: [3.4, 0.6, 4.0], target: [0, -0.8, 0] },
      focus: ['pan'],
      hotspots: [{ part: 'pan', label: 'Pan drain plug', spec: 'drain first' }],
      explode: 0.2,
      hazards: ['burn', 'crush'],
      durationMin: 25,
      tip:
        'Not every pan has a drain plug. If yours does not, loosen the bolts at one end only and let it tip and drain before removing the pan entirely.',
    },
    {
      id: 'a3',
      title: 'Drop the pan — bolts in a pattern',
      body:
        'Remove the pan bolts leaving the four corners for last, then break the seal and lower it level. **Do not pry on the flange.** A bent pan flange will never seal again, and that is a new pan.',
      camera: { pos: [2.8, -0.6, 3.8], target: [0, -0.7, 0] },
      focus: ['pan', 'panBolts', 'gasket'],
      hotspots: [
        { part: 'panBolts', label: 'Pan bolt ×22', spec: '12 N·m' },
        { part: 'gasket', label: 'Pan gasket' },
      ],
      explode: 0.55,
      torque: [{ fastener: 'Transmission pan bolt', nm: 12, inlb: 106 }],
      durationMin: 25,
    },
    {
      id: 'a4',
      title: 'Read the pan and the magnets',
      body:
        'This is free diagnostic information. **Fine grey paste on the magnets is normal.** Glittering metal flakes are gear or bearing wear. Black fibrous material is clutch friction coming apart. Brass or bronze particles point at a bushing or thrust washer.',
      camera: { pos: [2.2, -1.4, 3.2], target: [0, -1.0, 0] },
      focus: ['magnets', 'pan'],
      hotspots: [
        { part: 'magnets', label: 'Magnets — grey paste is normal' },
        { part: 'pan', label: 'Pan — look for friction material' },
      ],
      explode: 0.6,
      durationMin: 15,
      tip:
        'If you find clutch material or hard metal, stop and discuss it with the owner before refilling. A fluid service will not fix a failing transmission, and sometimes it makes the slip worse.',
    },
    {
      id: 'a5',
      title: 'Filter out, filter in',
      body:
        'The filter pulls straight down out of the pump bore; its neck seal usually stays behind in the case. **Make sure the old seal came out** — a second seal stacked behind a new one will not seal, and the pump will suck air.',
      camera: { pos: [2.4, -0.2, 3.4], target: [0, -0.4, 0] },
      focus: ['filter', 'valveBody'],
      hotspots: [
        { part: 'filter', label: 'Filter + neck seal', spec: 'confirm old seal removed' },
        { part: 'valveBody', label: 'Valve body' },
      ],
      explode: 0.45,
      durationMin: 20,
      mistake:
        'Leaving the old neck seal in the bore. It is the number one cause of a transmission that works fine cold and slips once hot after a service.',
    },
    {
      id: 'a6',
      title: 'Clean the pan and fit the gasket dry',
      body:
        'Wash the pan in solvent, clean the magnets, and scrape both sealing faces with a plastic scraper. The moulded gasket goes on **dry — no RTV**. Silicone on a transmission pan ends up as a lump of rubber inside the valve body.',
      camera: { pos: [2.6, -1.0, 3.4], target: [0, -0.8, 0] },
      focus: ['gasket', 'pan'],
      explode: 0.4,
      durationMin: 25,
      mistake: 'Adding RTV "for insurance". Pieces of it block a valve and you get a transmission with no third gear.',
    },
    {
      id: 'a7',
      title: 'Pan on — 12 N·m, and that is all',
      body:
        'Start every bolt by hand, snug in a criss-cross pattern from the centre, then torque to **12 N·m — about 106 inch-pounds**. That is a very low number. People reach for a 3/8" ratchet and crush the gasket into the flange.',
      camera: { pos: [2.8, -0.6, 3.8], target: [0, -0.7, 0] },
      focus: ['pan', 'panBolts'],
      hotspots: [{ part: 'panBolts', label: 'Pan bolt', spec: '12 N·m / 106 in-lb' }],
      explode: 0.12,
      torque: [{ fastener: 'Transmission pan bolt', nm: 12, inlb: 106, pattern: 'Criss-cross, two passes' }],
      durationMin: 20,
      tip: 'Use an inch-pound torque wrench if you have one. 106 in-lb is at the very bottom of most foot-pound wrenches, where they are least accurate.',
    },
    {
      id: 'a8',
      title: 'Fill, then set the level in the temperature window',
      body:
        'Pump fluid in through the level-check port until it runs back out. Refit the plug, start the engine, and watch the fluid temperature on the scan tool. **Between 35 and 45 °C, with the engine idling, crack the plug: a thin steady stream means correct, a dribble means add.** Then torque the plug.',
      detail: [
        'Add roughly the pan capacity first, then set the level properly',
        'Engine running, transmission in Park, truck level',
        'Temperature window matters — checking at 20 °C will leave it overfilled',
        'A pan drop replaces only part of total capacity. The torque converter keeps the rest',
      ],
      camera: { pos: [3.2, 0.2, 4.0], target: [0, -0.5, 0] },
      focus: ['pan'],
      hotspots: [{ part: 'pan', label: 'Level-check plug', spec: '35–45 °C, engine idling' }],
      explode: 0,
      hazards: ['burn'],
      torque: [{ fastener: 'Level-check plug', nm: 12, inlb: 106 }],
      durationMin: 35,
    },
  ],
  hiddenByStep: {
    a1: ['catchPan'],
    a2: [],
    a3: [],
    a4: ['gasket'],
    a5: ['pan', 'panBolts', 'magnets', 'gasket', 'catchPan'],
    a6: ['valveBody', 'filter', 'catchPan'],
    a7: ['catchPan'],
    a8: ['catchPan'],
  },
  checkpoints: [
    {
      id: 'ac1',
      afterStep: 'a1',
      question: 'Why is the fluid level specified at 35–45 °C instead of just "when cold"?',
      options: [
        {
          text: 'Fluid volume changes significantly with temperature, so a level is only meaningful at a stated temperature',
          correct: true,
          why:
            'Correct. The standpipe height is designed around a specific fluid temperature. Set the level cold and the same quantity of fluid will be overfull once hot.',
        },
        {
          text: 'The fluid has to be hot enough to flow through the filter',
          why: 'ATF flows fine cold. The issue is thermal expansion.',
        },
        {
          text: 'So the torque converter has time to fill',
          why: 'Converter fill matters for the procedure but is not why the temperature window exists.',
        },
        {
          text: 'Because the scan tool will not report a level below 35 °C',
          why: 'The scan tool reports temperature; it does not measure level at all.',
        },
      ],
    },
    {
      id: 'ac2',
      afterStep: 'a5',
      question:
        'After a filter change the transmission shifts normally when cold but slips badly once warm. What is the first thing to suspect?',
      options: [
        {
          text: 'The old filter neck seal was left in the case, so the new filter is not sealing and the pump is drawing air',
          correct: true,
          why:
            'Classic. Two stacked seals cannot seal, so the pump aerates — and the problem shows up hot, when the fluid is thinner and air entrains more easily.',
        },
        {
          text: 'Wrong fluid type was used',
          why: 'Possible in general, but the cold-good/hot-bad pattern right after a filter change points squarely at the seal.',
        },
        {
          text: 'Pan bolts were over-torqued',
          why: 'That causes a leak at the gasket, not a slip.',
        },
        {
          text: 'The transmission needs a relearn procedure',
          why: 'Adaptive relearn changes shift feel, not hydraulic capacity.',
        },
      ],
    },
  ],
}
