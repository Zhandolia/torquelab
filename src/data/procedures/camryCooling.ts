import type { Procedure } from '../../lib/types'

const DRAINED = ['fan', 'fanShroud']
const HOSES_OFF = [...DRAINED, 'upperHose']

export const camryCooling: Procedure = {
  id: 'camry-cooling-system',
  title: 'Thermostat & Cooling System Service',
  subtitle: 'Draining, replacing and — the part everyone botches — bleeding',
  primaryVehicleId: 'camry-2014',
  alsoApplies: ['civic-2016', 'corolla-2015', 'silverado-2015'],
  system: 'cooling',
  location: 'underhood',
  difficulty: 3,
  timeMin: 150,
  assembly: 'coolingSystem',
  summary:
    'Cooling work is easy to do and easy to do badly. The mechanical part — drain, swap a thermostat, refill — takes an hour. The part that decides whether the engine survives is getting the air out afterwards, because an air pocket sitting against the temperature sensor will read cold while the cylinder head cooks.',
  objectives: [
    'Trace the coolant path and explain what the thermostat does at each stage of warm-up',
    'Explain why a pressurised system raises the boiling point and why the cap is a safety device',
    'Replace a thermostat with the correct orientation and jiggle-pin position',
    'Bleed a cooling system properly and recognise the symptoms of trapped air',
    'Explain why coolant type is not interchangeable',
  ],
  tools: [
    { name: 'Jack stands or ramps', category: 'safety' },
    { name: 'Safety glasses + gloves', detail: 'Coolant is an eye irritant', category: 'safety' },
    { name: 'Drain pan, 8 L', category: 'specialty' },
    { name: 'Spill-free funnel kit', detail: 'The single most useful tool for this job', category: 'specialty' },
    { name: 'Cooling system pressure tester', detail: 'Tests the system and the cap', category: 'measure' },
    { name: 'Infrared thermometer', detail: 'Confirms the thermostat opened', category: 'measure' },
    { name: 'Hose clamp pliers', category: 'specialty' },
    { name: '10 mm socket + 1/4" ratchet', category: 'hand' },
    { name: 'Torque wrench 5–30 N·m', category: 'measure' },
    { name: 'Refractometer or test strips', detail: 'Checks freeze point and pH', category: 'measure' },
    { name: 'Distilled water', detail: 'Never tap water — minerals scale the system', category: 'consumable' },
  ],
  parts: [
    { name: 'Thermostat + gasket/O-ring', qty: '1', note: 'Buy the housing assembly if the gasket is integral' },
    { name: 'Radiator cap', qty: '1', note: 'Cheap, and a weak cap causes overheating nobody can diagnose' },
    { name: 'Upper and lower radiator hoses', qty: '1 each', note: 'Replace if soft, swollen or crunchy' },
    { name: 'Hose clamps', qty: '4' },
  ],
  fluids: [
    { name: 'Engine coolant', spec: 'Toyota SLLC pink — do not substitute', qty: '6.4 qt total system' },
    { name: 'Distilled water', spec: 'For a pre-mix or flush only', qty: 'As needed' },
  ],
  torqueTable: [
    { fastener: 'Thermostat housing bolt', nm: 9, inlb: 80, pattern: 'Alternating, two passes' },
    { fastener: 'Water outlet bolt', nm: 9, inlb: 80 },
    { fastener: 'Radiator drain petcock', nm: 2, inlb: 18, note: 'Plastic — finger tight plus a nudge' },
    { fastener: 'Bleeder screw', nm: 3, inlb: 27 },
    { fastener: 'Fan shroud bolt', nm: 8, ftlb: 6 },
  ],
  hazards: [
    {
      kind: 'burn',
      text:
        'A hot cooling system is pressurised to around 1.1 bar, which puts the boiling point near 125 °C. Opening the cap hot releases that pressure and the coolant flashes to steam in your face. Cold engine only.',
    },
    { kind: 'chemical', text: 'Ethylene glycol is sweet-tasting and lethal to pets and children. Catch every drop and seal the container.' },
    { kind: 'pressure', text: 'The system stays pressurised while hot even with the engine off. Squeeze the upper hose — if it is firm, it is still pressurised.' },
    { kind: 'crush', text: 'Rated stands if you are under the car at the drain.' },
  ],
  steps: [
    {
      id: 'c1',
      title: 'Follow the coolant around the loop',
      body:
        'Rotate the model and trace it. Pump pushes coolant through the block and head, out the **upper hose** to the radiator, down through the core, back through the **lower hose** to the pump. The thermostat sits in that loop as a gate: closed when cold so the engine warms fast, open when hot so the radiator does its job.',
      detail: [
        'Cold: thermostat shut, coolant bypasses the radiator and circulates in the engine only',
        'At rated temperature: wax element expands, valve lifts, radiator joins the circuit',
        'The cap holds pressure, which raises the boiling point — that is why it is a safety device, not a lid',
        'The expansion tank catches what the system pushes out hot and draws it back as it cools',
      ],
      camera: { pos: [3.6, 1.9, 5.8], target: [0, 0.1, 0.3] },
      hotspots: [
        { part: 'radiator', label: 'Radiator' },
        { part: 'thermostat', label: 'Thermostat', spec: 'opens ~82 °C' },
        { part: 'waterPump', label: 'Water pump' },
        { part: 'overflow', label: 'Expansion tank' },
      ],
      explode: 0.2,
      durationMin: 15,
    },
    {
      id: 'c2',
      title: 'Cold engine, then drain it',
      body:
        'Squeeze the upper hose first — **firm means still pressurised, and the cap stays on.** Once genuinely cold, open the cap to vent, then open the radiator petcock and let it drain into the pan. Expect to recover only about 60% of total capacity; the rest sits in the block.',
      detail: [
        'Cap off first, then petcock — otherwise it drains slowly against a vacuum',
        'A block drain plug, if fitted, gets the rest out for a full flush',
        'Seal and label the waste coolant. It is not drain-safe',
      ],
      camera: { pos: [3.2, 0.8, 5.2], target: [0, -0.4, 0.5] },
      focus: ['radiator', 'radCap'],
      hotspots: [
        { part: 'radCap', label: 'Radiator cap', spec: 'cold only' },
        { part: 'radiator', label: 'Drain petcock at the base' },
      ],
      explode: 0.25,
      hazards: ['burn', 'chemical', 'pressure'],
      durationMin: 30,
      mistake:
        'Cracking the cap on a warm engine "just a little to let it out". The pressure drop makes superheated coolant boil instantly and it comes out as steam.',
    },
    {
      id: 'c3',
      title: 'Off with the upper hose and housing',
      body:
        'Slide the clamps back, twist the hose to break the seal rather than levering it off a plastic neck — **plastic outlet necks snap, and then you are replacing a housing you did not plan to buy.** Then unbolt the thermostat housing.',
      camera: { pos: [2.6, 1.6, 4.4], target: [0.4, 0.7, 0.3] },
      focus: ['upperHose', 'tstatHousing'],
      hotspots: [
        { part: 'upperHose', label: 'Upper hose' },
        { part: 'tstatHousing', label: 'Thermostat housing', spec: '9 N·m' },
      ],
      explode: 0.45,
      torque: [{ fastener: 'Thermostat housing bolt', nm: 9, inlb: 80 }],
      durationMin: 25,
    },
    {
      id: 'c4',
      title: 'The thermostat, and which way up it goes',
      body:
        'Note the orientation before the old one comes out. The **wax element faces the engine** — it has to sit in the hot coolant it is meant to sense. Fitted backwards, it sees radiator-temperature coolant and never opens properly.',
      detail: [
        'Wax element (the fat end) toward the engine, always',
        'The small jiggle pin or bleed notch goes at the 12 o\'clock position so air can escape past it',
        'New gasket or O-ring every time, fitted dry unless the instructions say otherwise',
        'Check the stamped opening temperature matches the original',
      ],
      camera: { pos: [2.4, 1.6, 3.8], target: [0.7, 0.7, 0] },
      focus: ['thermostat', 'tstatGasket'],
      hotspots: [
        { part: 'thermostat', label: 'Wax element faces the engine' },
        { part: 'tstatGasket', label: 'New gasket, fitted dry' },
      ],
      explode: 0.55,
      durationMin: 20,
      mistake:
        'Fitting it backwards, or leaving out the thermostat entirely "to run cooler". No thermostat means the engine never reaches operating temperature, which washes the bores with fuel and wrecks economy and emissions.',
    },
    {
      id: 'c5',
      title: 'Inspect the hoses while they are off',
      body:
        'Squeeze every hose along its length. **Soft and mushy means it is degrading from the inside; hard and crunchy means it has cooked.** Either way it fails on the motorway, not in your driveway. They are cheap and the labour is already done.',
      camera: { pos: [3.0, 0.4, 5.0], target: [0, -0.3, 0.5] },
      focus: ['upperHose', 'lowerHose'],
      hotspots: [
        { part: 'lowerHose', label: 'Lower hose', spec: 'check for collapse' },
        { part: 'upperHose', label: 'Upper hose' },
      ],
      explode: 0.4,
      durationMin: 15,
      tip:
        'The lower hose usually has a wire spring inside it. That is there to stop the pump sucking it flat at high rpm — if you fit one without the spring, you get overheating only at speed, which is a miserable thing to chase.',
    },
    {
      id: 'c6',
      title: 'Reassemble and pressure test before you fire it',
      body:
        'Housing bolts to **9 N·m in two alternating passes** — these thread into aluminium and strip easily. Then fill, fit a pressure tester and pump it to the cap rating. Finding a leak with a hand pump is far better than finding it with a hot engine.',
      detail: [
        'Two passes, alternating, 9 N·m. That is 80 inch-pounds — very little',
        'Pressure test to the cap rating and watch for 10 minutes',
        'Test the cap itself on the tester too; a weak cap lets the system boil early',
      ],
      camera: { pos: [2.6, 1.4, 4.2], target: [0.4, 0.5, 0.2] },
      focus: ['tstatHousing', 'upperHose', 'lowerHose'],
      explode: 0.15,
      torque: [
        { fastener: 'Thermostat housing bolt', nm: 9, inlb: 80, pattern: 'Alternating, two passes' },
        { fastener: 'Radiator drain petcock', nm: 2, inlb: 18 },
      ],
      durationMin: 25,
    },
    {
      id: 'c7',
      title: 'Bleed it properly — this is the whole job',
      body:
        'Fill through a **spill-free funnel** with the bleeder open, heater on full hot, and idle until the thermostat opens and the upper hose goes hot. Air migrates up into the funnel instead of staying trapped in the head. Squeeze the upper hose periodically to burp it.',
      detail: [
        'Spill-free funnel on the filler neck, kept topped up — it gives the air somewhere to go',
        'Heater on maximum so the heater core fills too, or you get a pocket in there',
        'Idle until the cooling fans cycle at least twice',
        'Watch the gauge the whole time; shut it down if it climbs past normal',
        'Let it cool completely, then re-check the level. Expect to add more',
      ],
      camera: { pos: [2.8, 2.0, 4.6], target: [-0.3, 0.8, 0.6] },
      focus: ['bleeder', 'overflow', 'radCap'],
      hotspots: [
        { part: 'bleeder', label: 'Bleed screw', spec: 'open while filling' },
        { part: 'overflow', label: 'Expansion tank', spec: 'fill to COLD line' },
      ],
      explode: 0.2,
      hazards: ['burn'],
      torque: [{ fastener: 'Bleeder screw', nm: 3, inlb: 27 }],
      durationMin: 35,
      mistake:
        'Calling it done when the funnel stops bubbling after two minutes. Air hides in the heater core and the back of the head, and it takes several heat cycles to work out. Re-check the level cold the next morning — if it dropped, there was still air in it.',
    },
    {
      id: 'c8',
      title: 'Confirm the thermostat actually opened',
      body:
        'Point an infrared thermometer at the upper hose as it warms. It should stay relatively cool, then **climb sharply** when the thermostat opens — that step change is your proof. A hose that warms gradually and evenly means the thermostat is stuck open; one that never gets hot while the gauge climbs means stuck shut.',
      detail: [
        'Cool hose + rising gauge = stuck closed. Shut it down, you are about to overheat it',
        'Gradual even warming with a slow-to-warm cabin = stuck open',
        'Sharp transition at the rated temperature = working correctly',
        'Check for leaks once more after a full heat cycle and overnight cool',
      ],
      camera: { pos: [2.8, 1.5, 4.6], target: [0.2, 0.6, 0.4] },
      focus: ['upperHose', 'thermostat', 'fan'],
      hotspots: [{ part: 'upperHose', label: 'Watch for the step change' }],
      explode: 0.1,
      measure: [
        { name: 'Upper hose temperature at opening', spec: 'Sharp rise near 82 °C', tool: 'Infrared thermometer' },
        { name: 'System pressure hold', spec: 'Holds cap rating 10 min', tool: 'Pressure tester' },
        { name: 'Coolant freeze point', spec: 'Per climate, typically −37 °C', tool: 'Refractometer' },
      ],
      durationMin: 20,
    },
  ],
  hiddenByStep: {
    c1: [],
    c2: [],
    c3: DRAINED,
    c4: HOSES_OFF,
    c5: DRAINED,
    c6: DRAINED,
    c7: [],
    c8: [],
  },
  checkpoints: [
    {
      id: 'cc1',
      afterStep: 'c1',
      question: 'What does the pressure cap actually do for the engine?',
      options: [
        {
          text: 'It raises the system pressure, which raises the coolant\'s boiling point well above 100 °C',
          correct: true,
          why:
            'About 1.1 bar of pressure pushes the boiling point near 125 °C. That margin is what stops localised boiling against the hottest parts of the head. A weak cap causes overheating that looks like a thermostat fault.',
        },
        {
          text: 'It stops coolant splashing out over bumps',
          why: 'It does seal the system, but the functional purpose is pressure and therefore boiling point.',
        },
        {
          text: 'It regulates flow between the radiator and the engine',
          why: 'That is the thermostat\'s job.',
        },
        {
          text: 'It filters debris out of the coolant',
          why: 'There is no filter in a cooling system.',
        },
      ],
    },
    {
      id: 'cc2',
      afterStep: 'c7',
      question:
        'A car is refilled and bled, then overheats on the first drive — but the upper hose is cool and the temperature gauge is climbing fast. What is the most likely cause?',
      options: [
        {
          text: 'An air pocket or a stuck-closed thermostat is stopping flow to the radiator — shut it down immediately',
          correct: true,
          why:
            'A cool upper hose with a rising gauge means coolant is not reaching the radiator. Keep driving and you will warp the head. Shut off, let it cool completely, and re-bleed.',
        },
        {
          text: 'The radiator is blocked internally',
          why: 'A blocked radiator usually still gives a hot upper hose, because coolant reaches it and then cannot get through.',
        },
        {
          text: 'The coolant mix is too strong',
          why: 'An over-strong glycol mix reduces heat transfer slightly but does not stop flow.',
        },
        {
          text: 'The cooling fans are not running',
          why: 'Fan failure causes overheating in traffic, but the upper hose would be hot because coolant is still circulating.',
        },
      ],
    },
    {
      id: 'cc3',
      afterStep: 'c4',
      question: 'Why does the thermostat\'s wax element have to face the engine rather than the radiator?',
      options: [
        {
          text: 'It has to sense the temperature of coolant leaving the engine, which is what it is regulating',
          correct: true,
          why:
            'Turned around, it sits in the cooler radiator-side coolant and responds late or not at all — so the engine overheats while the thermostat thinks everything is fine.',
        },
        {
          text: 'The spring only works in that orientation',
          why: 'The spring returns the valve either way. The sensing position is what matters.',
        },
        {
          text: 'So the jiggle pin points downward to drain',
          why: 'The jiggle pin goes up, to let air escape — and it is a separate consideration from the element.',
        },
        {
          text: 'It does not matter; thermostats are symmetrical',
          why: 'They are not, and fitting one backwards is a genuinely common cause of unexplained overheating.',
        },
      ],
    },
  ],
}
