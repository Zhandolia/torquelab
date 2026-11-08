import type { Procedure } from '../../lib/types'

const WHEEL_OFF = ['wheel', 'lugNuts']
const SENSOR_OFF = [...WHEEL_OFF, 'absSensor', 'absBolt']
const CALIPER_OFF = [...SENSOR_OFF, 'caliper', 'caliperBolts', 'pads']
const ROTOR_OFF = [...CALIPER_OFF, 'rotor']
const NUT_OFF = [...ROTOR_OFF, 'axleNut']
const HUB_OFF = [...NUT_OFF, 'hubUnit', 'hubBolts', 'shield']

export const silveradoHubBearing: Procedure = {
  id: 'silverado-hub-bearing',
  title: 'Front Hub Bearing Replacement',
  subtitle: 'A sealed bearing unit, a half-shaft and 180 N·m of corrosion',
  primaryVehicleId: 'silverado-2015',
  alsoApplies: ['civic-2016'],
  system: 'suspension',
  location: 'wheel',
  difficulty: 3,
  timeMin: 120,
  assembly: 'hubUnit',
  summary:
    'A growling wheel bearing is one of the few faults an enthusiast can diagnose by ear and still get wrong, because tyre noise sounds identical at 40 mph. You will confirm the diagnosis with a dial indicator before touching a bolt, then work through a stack that only comes apart in one order — and learn why the ABS sensor comes out first and why the hub never gets hammered.',
  objectives: [
    'Confirm a bearing fault by measured play and a load test rather than by noise alone',
    'Explain why a sealed hub unit is replaced rather than repacked or adjusted',
    'Remove the ABS speed sensor before it becomes part of the problem',
    'Free a hub that is corroded into its knuckle bore without impacting the bearing',
    'Torque the hub bolts and axle nut to spec, and say what each one is actually clamping',
  ],
  tools: [
    { name: 'Floor jack + 2 jack stands', detail: 'Truck-rated, 3 tonne minimum', category: 'safety' },
    { name: 'Wheel chocks', category: 'safety' },
    { name: 'Safety glasses', category: 'safety' },
    { name: '22 mm socket + breaker bar', detail: 'Lug nuts', category: 'hand' },
    { name: '36 mm socket, 1/2" drive', detail: 'Axle nut', category: 'hand' },
    { name: '21 mm socket', detail: 'Hub mounting bolts and caliper bolts', category: 'hand' },
    { name: '10 mm socket', detail: 'ABS sensor bolt', category: 'hand' },
    { name: 'Click torque wrench, 60–300 N·m', category: 'measure' },
    { name: 'Dial indicator + magnetic base', detail: 'Bearing play at the flange', category: 'measure' },
    { name: 'Pry bar, 450 mm', detail: 'Load test at the tyre', category: 'hand' },
    { name: 'Three-jaw hub puller or slide hammer with hub adapter', category: 'specialty' },
    { name: 'Dead-blow hammer', detail: 'For the half-shaft stub, never the bearing', category: 'hand' },
    { name: 'Wire brush + rotary wire wheel', detail: 'Knuckle bore', category: 'specialty' },
    { name: 'Anti-seize compound', detail: 'Knuckle bore only, thin film', category: 'consumable' },
    { name: 'Penetrating oil', category: 'consumable' },
    { name: 'Brake cleaner', category: 'consumable' },
  ],
  parts: [
    { name: 'Front hub bearing assembly', qty: '1', note: 'Sealed unit with the ABS ring built into the seal' },
    { name: 'Axle nut', qty: '1', note: 'Single use on most applications — the locking feature is deformed' },
    { name: 'Hub mounting bolts', qty: '3', note: 'Replace if corroded or if the spec calls them single use' },
  ],
  torqueTable: [
    { fastener: 'Wheel lug nut', nm: 190, ftlb: 140, pattern: 'Star / criss-cross, two passes' },
    { fastener: 'Hub mounting bolt', nm: 180, ftlb: 133, note: 'Three bolts, from behind the knuckle' },
    { fastener: 'Axle nut', nm: 245, ftlb: 181, note: 'New nut. Wheel on the ground for final torque' },
    { fastener: 'Caliper bolt', nm: 150, ftlb: 111 },
    { fastener: 'ABS sensor bolt', nm: 18, ftlb: 13 },
  ],
  hazards: [
    {
      kind: 'crush',
      text: 'A half-tonne corner on stands, and you will be pulling hard on a breaker bar against it. Stands on the frame rails, chocks at the other axle, and never a jack alone.',
    },
    {
      kind: 'sharp',
      text: 'A corroded hub flange and a wire wheel throw rust and wire. Glasses and gloves, both.',
    },
    { kind: 'eye', text: 'Penetrating oil, rust scale and wire brush bristles all end up at eye height.' },
    {
      kind: 'electrical',
      text: 'The ABS sensor harness is a signal circuit. A pinched or stretched one sets a fault that will cost you a second diagnosis.',
    },
  ],
  steps: [
    {
      id: 's1',
      title: 'Crack the axle nut while the wheel is on the ground',
      body:
        'The axle nut is **245 N·m** and it is on a shaft that can spin. Break it loose with the wheel loaded, through the hole in the wheel face if your wheels allow it, before the truck goes up. Crack the lug nuts in the same pass.',
      detail: [
        'Chock the rear wheels, Park selected, parking brake set',
        'Reach the axle nut through the wheel centre with a 36 mm socket and breaker bar',
        'Crack the lug nuts a quarter turn while the tyre is still loaded',
        'Only then lift at the frame rail and set the stands',
      ],
      camera: { pos: [5.4, 2.6, 6.0], target: [0, 0, 0] },
      explode: 0,
      hazards: ['crush'],
      durationMin: 10,
      tip:
        'If the wheel centre has no access hole, the alternative is a helper on the brake pedal once the wheel is off. Standing on a bar against a free-spinning hub achieves nothing but a slipped socket.',
    },
    {
      id: 's2',
      title: 'Wheel off',
      body:
        'Six lug nuts at **190 N·m** — a truck hub, truck loads. Lay the wheel flat under the sill. From here everything happens in one order and nothing skips ahead.',
      camera: { pos: [4.2, 1.8, 5.2], target: [0, 0, 0.3] },
      focus: ['wheel', 'lugNuts'],
      hotspots: [
        { part: 'lugNuts', label: 'Lug nut ×6', spec: '190 N·m' },
        { part: 'wheel', label: 'Road wheel' },
      ],
      explode: 0.25,
      torque: [{ fastener: 'Wheel lug nut', nm: 190, ftlb: 140, pattern: 'Star pattern on reassembly' }],
      durationMin: 5,
    },
    {
      id: 's3',
      title: 'Confirm the diagnosis before you buy a part',
      body:
        'Noise is not a diagnosis. **Measure the play at the hub flange with a dial indicator** and load the tyre with a pry bar top and bottom. A bearing that measures within spec and a growl that changes with steering input point at tyres, not bearings — and tyre noise is the single most common misdiagnosis here.',
      detail: [
        'Dial indicator on the knuckle, tip on the hub flange face, rock the flange: maximum 0.13 mm',
        'Pry bar under the tyre at 6 o’clock, lift, and watch for movement at the flange not the ball joints',
        'Spin the hub by hand and listen at the knuckle with a stethoscope or a long screwdriver',
        'Road-test note: bearing growl changes with cornering load; tyre roar changes with road surface',
      ],
      camera: { pos: [3.0, 1.4, 4.0], target: [0, 0, 0] },
      focus: ['hubUnit'],
      hotspots: [{ part: 'hubUnit', label: 'Hub bearing assembly', spec: 'play max 0.13 mm' }],
      measure: [
        { name: 'Hub flange axial play', spec: 'Max 0.13 mm', tool: 'Dial indicator on the knuckle' },
        { name: 'Roughness when spun', spec: 'Smooth, no notchiness', tool: 'By hand, brake released' },
      ],
      explode: 0.1,
      durationMin: 15,
      mistake:
        'Replacing a hub because the truck is noisy at 60 km/h. Measure first. A set of cupped tyres makes exactly that noise and costs nothing to rule out.',
    },
    {
      id: 's4',
      title: 'ABS sensor out first — and this really is first',
      body:
        'Unplug the connector, take out the single **18 N·m** bolt, and lift the sensor out of its bore before anything else moves. It is corroded into an aluminium bore, it costs more than the bolt holding it, and if you leave it in place the rotor or the hub will snap it off for you.',
      detail: [
        'Release the connector lock tab — do not pull on the wire',
        '10 mm bolt out, then twist the sensor gently to break the corrosion before lifting',
        'If it will not come, penetrating oil and patience. Levering snaps the body off in the bore',
        'Lay it where nothing will stand on the pickup face',
      ],
      camera: { pos: [2.4, 2.4, 3.6], target: [0.4, 0.6, -0.2] },
      focus: ['absSensor', 'absBolt'],
      hotspots: [
        { part: 'absSensor', label: 'ABS wheel speed sensor', spec: 'bolt 18 N·m' },
        { part: 'absBolt', label: 'Sensor bolt' },
      ],
      explode: 0.3,
      torque: [{ fastener: 'ABS sensor bolt', nm: 18, ftlb: 13 }],
      hazards: ['electrical'],
      durationMin: 10,
      tip:
        'On this hub the magnetic ABS ring is moulded into the bearing seal and is not a separate part. Damage the ring and you buy a hub, which is another reason the sensor leaves the area early.',
    },
    {
      id: 's5',
      title: 'Caliper off and supported',
      body:
        'Two **150 N·m** bolts into the cast ears on the knuckle. Lift the caliper off with the pads still in it and hang it from a suspension link. The hose is not a strap here either.',
      camera: { pos: [-4.4, 1.6, 4.0], target: [-0.5, 0, 0] },
      focus: ['caliper', 'caliperBolts', 'pads'],
      hotspots: [
        { part: 'caliperBolts', label: 'Caliper bolt ×2', spec: '150 N·m' },
        { part: 'caliper', label: 'Caliper, pads in place' },
      ],
      explode: 0.4,
      torque: [{ fastener: 'Caliper bolt', nm: 150, ftlb: 111 }],
      durationMin: 8,
    },
    {
      id: 's6',
      title: 'Rotor off',
      body:
        'Straight off the studs on this design. If rust has it stuck, two bolts in the service holes, a half turn at a time. Measure it while it is in your hands — you have the corner open, and a rotor below discard thickness now is cheaper than a second strip-down later.',
      camera: { pos: [3.0, 1.2, 4.0], target: [0, 0, 0.2] },
      focus: ['rotor'],
      hotspots: [{ part: 'rotor', label: 'Front rotor, vented' }],
      explode: 0.5,
      durationMin: 8,
    },
    {
      id: 's7',
      title: 'Axle nut off, shaft back out of the splines',
      body:
        'The nut you already cracked comes off now. Then push the **half-shaft stub back out of the hub splines** by hand, or tap the end of the shaft with a dead-blow if corrosion has it stuck. Hit the shaft, never the hub flange.',
      detail: [
        'Nut and washer off, keep the washer — the new nut usually does not come with one',
        'Push the shaft inboard by hand first. Most of them move',
        'If it is seized, strike the end of the shaft squarely with a dead-blow, protecting the threads',
        'Support the shaft once it is free. Letting it hang loads the inner joint at full angle',
      ],
      camera: { pos: [3.4, 1.2, 4.4], target: [0, 0, 0.1] },
      focus: ['axleNut', 'axleShaft'],
      hotspots: [
        { part: 'axleNut', label: 'Axle nut', spec: '245 N·m — new nut' },
        { part: 'axleShaft', label: 'Front half-shaft' },
      ],
      explode: 0.6,
      torque: [{ fastener: 'Axle nut', nm: 245, ftlb: 181 }],
      durationMin: 12,
      mistake:
        'Driving the shaft through with an air hammer on the hub face. Any impact through a bearing brinells the races — you can destroy the new hub installing it exactly the same way.',
    },
    {
      id: 's8',
      title: 'Three bolts, from behind the knuckle',
      body:
        'The hub is clamped to the **back** of the knuckle by three bolts at **180 N·m**. This is why the whole job is done from the inboard side once the rotor is off, and why a long extension and a swivel earn their place in the box. Expect them to be seized.',
      detail: [
        'Penetrating oil on all three, and give it time while you do something else',
        'Six-point socket and a breaker bar — a ratchet will round them',
        'If one shears, you are into drilling and tapping. Heat and patience beat force here',
      ],
      camera: { pos: [2.8, 2.0, -5.4], target: [0, 0, -0.9] },
      focus: ['hubBolts', 'knuckle'],
      hotspots: [
        { part: 'hubBolts', label: 'Hub bolt ×3', spec: '180 N·m' },
        { part: 'knuckle', label: 'Steering knuckle' },
      ],
      explode: 0.32,
      torque: [{ fastener: 'Hub mounting bolt', nm: 180, ftlb: 133 }],
      durationMin: 20,
    },
    {
      id: 's9',
      title: 'Free the hub from its bore',
      body:
        'The bearing barrel is a close fit in the knuckle and ten winters of road salt have made it closer. Use a **three-jaw puller on the flange** or a slide hammer with a hub adapter. Pull it; do not beat it out from behind.',
      detail: [
        'Puller jaws on the flange, centre screw on the shaft centre or a protector',
        'Work it evenly. A hub coming out cocked galls the bore',
        'The dust shield is usually captured behind it and comes away with the hub',
      ],
      camera: { pos: [3.2, 1.4, 4.2], target: [0, 0, -0.2] },
      focus: ['hubUnit', 'shield'],
      hotspots: [
        { part: 'hubUnit', label: 'Hub bearing assembly' },
        { part: 'shield', label: 'Dust shield, captured behind the hub' },
      ],
      explode: 0.75,
      durationMin: 20,
      hazards: ['sharp'],
    },
    {
      id: 's10',
      title: 'Clean the bore — this decides whether the new one fits',
      body:
        'Wire-wheel the knuckle bore and the mating face until they are bright. **Scale left in the bore holds the new hub crooked**, which pre-loads a bearing designed to run square and gives you a fresh noise in 10,000 miles. A thin film of anti-seize on the bore, not on the flange face.',
      detail: [
        'Rotary wire wheel in the bore, then wipe with brake cleaner',
        'Check the bolt holes are clean and the threads are sound',
        'Thin anti-seize on the bore only — the flange face must stay dry and clean',
        'Fit the new dust shield now if it is a separate part',
      ],
      camera: { pos: [3.0, 1.7, 4.4], target: [0, 0, -0.3] },
      focus: ['knuckle'],
      hotspots: [{ part: 'knuckle', label: 'Knuckle bore', spec: 'bright metal, no scale' }],
      explode: 0.8,
      durationMin: 20,
      tip:
        'This is the step that gets skipped and the step that brings the truck back. Twenty minutes with a wire wheel is the difference between a repair and a rerun.',
    },
    {
      id: 's11',
      title: 'New hub in, shaft through the splines',
      body:
        'Line the three bolt holes up and push the hub home by hand. Then feed the **half-shaft splines through the hub** and start the new axle nut by hand. If the hub will not seat by hand, the bore is not clean enough — go back a step rather than pulling it in with the bolts.',
      camera: { pos: [3.4, 1.3, 4.4], target: [0, 0, 0] },
      focus: ['hubUnit', 'axleShaft'],
      hotspots: [
        { part: 'hubUnit', label: 'New hub assembly' },
        { part: 'axleShaft', label: 'Splines — align, do not force' },
      ],
      explode: 0.3,
      durationMin: 12,
      mistake:
        'Using the three bolts to drag a tight hub into a dirty bore. The bolts will do it, and the hub will sit cocked in the bore for the rest of its short life.',
    },
    {
      id: 's12',
      title: 'Hub bolts to 180 N·m',
      body:
        'All three started by hand, then **180 N·m** in a criss-cross sequence rather than one after the other round the circle. Same reason as any three-bolt flange: you want the clamp to arrive evenly.',
      camera: { pos: [2.8, 2.0, -5.4], target: [0, 0, -0.9] },
      focus: ['hubBolts'],
      hotspots: [{ part: 'hubBolts', label: 'Hub bolt', spec: '180 N·m' }],
      explode: 0.12,
      torque: [{ fastener: 'Hub mounting bolt', nm: 180, ftlb: 133, pattern: 'Criss-cross, two passes' }],
      durationMin: 8,
    },
    {
      id: 's13',
      title: 'Sensor, rotor and caliper back on',
      body:
        'Sensor into its clean bore with a smear of silicone grease on the body — not on the pickup face — and **18 N·m** on its bolt. Then rotor, then caliper at **150 N·m**, then the connector clicked home.',
      detail: [
        'Sensor bore cleaned before the sensor goes near it',
        'Rotor degreased on both faces',
        'Caliper bolts to full torque, and route the harness clear of the rotor',
      ],
      camera: { pos: [-3.0, 1.4, 3.4], target: [-0.4, 0.2, 0] },
      focus: ['absSensor', 'rotor', 'caliper', 'caliperBolts'],
      hotspots: [
        { part: 'absSensor', label: 'Sensor', spec: '18 N·m' },
        { part: 'caliperBolts', label: 'Caliper bolt', spec: '150 N·m' },
      ],
      explode: 0.15,
      torque: [
        { fastener: 'ABS sensor bolt', nm: 18, ftlb: 13 },
        { fastener: 'Caliper bolt', nm: 150, ftlb: 111 },
      ],
      durationMin: 12,
    },
    {
      id: 's14',
      title: 'Axle nut to 245 N·m, wheel to 190 N·m',
      body:
        'Fit the wheel, snug the lugs in a star pattern, lower the truck, then set the **axle nut to 245 N·m** and the **lug nuts to 190 N·m** with the tyre loaded. The axle nut is what clamps the bearing stack together, which is why its figure is exact and why it is a new nut.',
      detail: [
        'Use a new axle nut — the old locking collar is already deformed',
        'Final torque on the ground, in a star pattern, two passes',
        'Re-check lug torque after 50 miles. Alloy wheels on a truck do settle',
      ],
      camera: { pos: [4.2, 1.8, 5.2], target: [0, 0, 0.3] },
      focus: ['axleNut', 'wheel', 'lugNuts'],
      hotspots: [
        { part: 'axleNut', label: 'Axle nut', spec: '245 N·m' },
        { part: 'lugNuts', label: 'Lug nut', spec: '190 N·m' },
      ],
      explode: 0,
      torque: [
        { fastener: 'Axle nut', nm: 245, ftlb: 181, note: 'New nut, vehicle on the ground' },
        { fastener: 'Wheel lug nut', nm: 190, ftlb: 140, pattern: 'Star, two passes' },
      ],
      durationMin: 10,
    },
    {
      id: 's15',
      title: 'Clear the codes, then road test',
      body:
        'Unplugging a wheel speed sensor sets a fault, so the ABS and traction lights will be on. **Clear the codes with a scan tool and road test** — if the light comes back, the sensor or its air gap is the problem, not the bearing. Then listen for the original noise at the speed it used to appear.',
      detail: [
        'Clear stored ABS codes and confirm all four wheel speed signals read together on a rolling road test',
        'Listen at the original fault speed, and with gentle left and right cornering load',
        'Check the hub flange temperature by hand after the test — a hub much hotter than the other side is a preload problem',
      ],
      camera: { pos: [5.4, 2.6, 6.0], target: [0, 0, 0] },
      explode: 0,
      durationMin: 15,
      tip:
        'Watch the live wheel speed data rather than just the warning lamp. A sensor with a marginal air gap reads fine at walking pace and drops out at 70.',
    },
  ],
  hiddenByStep: {
    s1: [],
    s2: [],
    s3: WHEEL_OFF,
    s4: WHEEL_OFF,
    s5: SENSOR_OFF,
    s6: CALIPER_OFF,
    s7: ROTOR_OFF,
    s8: NUT_OFF,
    s9: NUT_OFF,
    s10: HUB_OFF,
    s11: NUT_OFF,
    s12: ROTOR_OFF,
    s13: SENSOR_OFF,
    s14: [],
    s15: [],
  },
  checkpoints: [
    {
      id: 'cp1',
      afterStep: 's4',
      question: 'Why does the ABS wheel speed sensor come out before the rotor and the hub?',
      options: [
        {
          text: 'It is corroded into an aluminium bore and will be snapped off by whatever moves past it if it is left in',
          correct: true,
          why:
            'It takes patience to remove intact and no force at all to break. Removing it first means a stuck sensor is a ten-minute problem rather than a new sensor plus drilling a broken body out of the knuckle.',
        },
        {
          text: 'Its signal has to be read before the hub is disturbed',
          why: 'You read the signal on a road test, with the wheel on. Nothing about the removal order is about measurement.',
        },
        {
          text: 'The sensor holds the hub into the knuckle',
          why: 'The three hub bolts do that. The sensor only reads the ring in the bearing seal.',
        },
        {
          text: 'Leaving it connected would discharge the battery through the ABS module',
          why: 'It is a passive signal circuit. Nothing is being drained.',
        },
      ],
    },
    {
      id: 'cp2',
      afterStep: 's10',
      question:
        'The new hub needs a hard push and a bit of persuasion from the three bolts to pull it into the knuckle bore. What is the likely outcome?',
      options: [
        {
          text: 'Scale left in the bore is holding it slightly out of square, which pre-loads the bearing and will fail it early',
          correct: true,
          why:
            'A bearing designed to run square does not tolerate being clamped at an angle. The symptom is the original noise returning within a few thousand miles, on a part that was perfectly good.',
        },
        {
          text: 'Nothing, as long as the bolts reach full torque',
          why: 'The bolts will reach torque. Reaching torque on a crooked hub is exactly how the failure is created.',
        },
        {
          text: 'The hub will be too tight to turn and the ABS will fault',
          why: 'The wheel bearing still spins. The damage is to its internal preload, not to free rotation.',
        },
        {
          text: 'The axle splines will not line up',
          why: 'Spline alignment is independent of how tightly the barrel fits the bore.',
        },
      ],
    },
    {
      id: 'cp3',
      afterStep: 's14',
      question: 'What is the axle nut actually doing at 245 N·m, as distinct from the three hub bolts at 180 N·m?',
      options: [
        {
          text: 'It clamps the half-shaft and the bearing stack together through the hub; the three bolts clamp the whole unit to the knuckle',
          correct: true,
          why:
            'Two different load paths. The axle nut sets the stack-up through the bearing — which is why its figure is exact and the nut is single use. The bolts just hold the assembly to the knuckle.',
        },
        {
          text: 'It adjusts the bearing preload, which you can set by feel',
          why: 'That is a tapered, adjustable bearing — not this. A sealed unit is preloaded at the factory; the nut brings the stack to a fixed clamp, not an adjustment.',
        },
        {
          text: 'It stops the wheel coming off, which the lug nuts also do',
          why: 'The lug nuts hold the wheel to the flange. The axle nut is on the half-shaft, inboard of all of that.',
        },
        {
          text: 'It is purely a locking device and the torque figure is nominal',
          why: 'There is a locking feature, but the torque is carrying real clamp load through the bearing stack.',
        },
      ],
    },
  ],
}
