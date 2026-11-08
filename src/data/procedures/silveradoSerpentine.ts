import type { Procedure } from '../../lib/types'

export const silveradoSerpentine: Procedure = {
  id: 'silverado-serpentine-belt',
  title: 'Serpentine Belt & Tensioner',
  subtitle: 'The 30-minute job that strands people on the hard shoulder',
  primaryVehicleId: 'silverado-2015',
  alsoApplies: ['mustang-gt-2018', 'camry-2014', 'civic-2016'],
  system: 'maintenance',
  location: 'underhood',
  difficulty: 2,
  timeMin: 50,
  assembly: 'serpentineDrive',
  summary:
    'One belt drives the alternator, the water pump, the power steering and the air conditioning. When it goes, you lose charging and cooling at the same moment, and the engine overheats within a couple of miles. It is a half-hour job with one hand tool — and the only genuinely hard part is getting the routing right.',
  objectives: [
    'Identify every accessory on the drive and say what losing the belt costs you',
    'Release a spring-loaded automatic tensioner safely',
    'Read a belt for rib cracking, glazing, misalignment and material loss',
    'Route a belt from the diagram and verify every pulley is seated before releasing tension',
    'Diagnose tensioner and idler bearing wear by feel and sound',
  ],
  tools: [
    { name: 'Safety glasses', category: 'safety' },
    { name: 'Serpentine belt tool or long 1/2" breaker bar', detail: 'Reaches the tensioner square drive', category: 'specialty' },
    { name: 'Socket set, 13–18 mm', category: 'hand' },
    { name: 'Belt wear gauge', detail: 'Measures rib depth loss on EPDM belts', category: 'measure' },
    { name: 'Straight edge or belt alignment tool', detail: 'Checks pulley coplanarity', category: 'measure' },
    { name: 'Torque wrench 20–80 N·m', category: 'measure' },
    { name: 'Mechanics mirror + torch', detail: 'For the pulleys you cannot see', category: 'hand' },
    { name: 'Phone camera', detail: 'Photograph the routing before anything moves', category: 'consumable' },
  ],
  parts: [
    { name: 'Serpentine belt', qty: '1', note: 'Match the exact length — options differ by accessory fitment' },
    { name: 'Automatic belt tensioner', qty: '1', note: 'Replace with the belt past ~100k miles; the damper wears out' },
    { name: 'Idler pulley', qty: '1', note: 'If the bearing is rough or noisy' },
  ],
  torqueTable: [
    { fastener: 'Tensioner assembly bolt', nm: 50, ftlb: 37 },
    { fastener: 'Idler pulley bolt', nm: 50, ftlb: 37 },
    { fastener: 'Alternator mounting bolt', nm: 50, ftlb: 37 },
    { fastener: 'A/C compressor bolt', nm: 50, ftlb: 37 },
    { fastener: 'Crankshaft balancer bolt', nm: 50, ftlb: 37, angle: '+140°', tty: true, note: 'Only if the balancer comes off' },
  ],
  hazards: [
    {
      kind: 'crush',
      text:
        'Engine off, key out. A belt drive that starts turning with your hand in it will take fingers — this is the most common serious injury in the whole workshop.',
    },
    { kind: 'burn', text: 'Exhaust manifolds and the upper radiator hose stay hot for a long time.' },
    { kind: 'spring', text: 'The tensioner arm is spring-loaded and snaps back hard if the tool slips. Keep a firm grip and your face clear.' },
    { kind: 'sharp', text: 'Fan blades and shroud edges.' },
  ],
  steps: [
    {
      id: 'b1',
      title: 'Know what the belt is carrying',
      body:
        'One belt, four jobs. **Lose it and you lose charging, coolant circulation, power steering assist and air conditioning simultaneously.** The water pump is the one that matters — you have a couple of miles before the temperature gauge makes the decision for you.',
      detail: [
        'Alternator: charging. The battery light comes on first',
        'Water pump: coolant circulation. This is why you stop, not limp home',
        'Power steering: the wheel goes heavy but still steers',
        'A/C compressor: comfort only, and it can often be bypassed with a shorter belt in an emergency',
      ],
      camera: { pos: [1.8, 1.1, 7.0], target: [0, 0.1, 0] },
      hotspots: [
        { part: 'alternator', label: 'Alternator' },
        { part: 'waterPump', label: 'Water pump' },
        { part: 'powerSteering', label: 'Power steering' },
        { part: 'acCompressor', label: 'A/C compressor' },
      ],
      explode: 0.25,
      durationMin: 8,
    },
    {
      id: 'b2',
      title: 'Photograph the routing before anything moves',
      body:
        'There is a routing diagram on the fan shroud or the underside of the hood. **Find it and photograph it, then photograph the actual belt too.** A serpentine belt can be threaded several plausible wrong ways, and a wrong route means an accessory spinning backwards.',
      detail: [
        'Note which pulleys the ribbed side touches and which the smooth back touches',
        'Backside idlers are the ones people get wrong — the belt wraps them the other way',
        'If the decal is missing, the diagram is in the service information, not in your memory',
      ],
      camera: { pos: [1.4, 1.6, 6.4], target: [-0.3, 0.6, 0] },
      focus: ['routingDecal', 'belt'],
      hotspots: [
        { part: 'routingDecal', label: 'Routing diagram', spec: 'the authority' },
        { part: 'belt', label: 'Existing belt' },
      ],
      explode: 0.1,
      durationMin: 6,
      tip:
        'The model here wraps every pulley on the outside, which keeps the geometry readable. Real layouts usually include at least one backside idler — so trust the decal on the truck, not this diagram.',
    },
    {
      id: 'b3',
      title: 'Read the old belt before you bin it',
      body:
        'Modern EPDM belts do not crack the way old neoprene ones did — they wear away gradually and lose rib depth, so **"it looks fine" is not an inspection.** Use a wear gauge in the rib groove. Four or more cracks per inch on any one rib condemns an older belt outright.',
      detail: [
        'Rib material loss: use the gauge, it drops into a worn groove',
        'Glazed, shiny rib flanks: the belt has been slipping',
        'Chunks missing from a rib: something is misaligned — find out what',
        'Fraying at one edge: a pulley is not coplanar with the others',
      ],
      camera: { pos: [1.2, 0.6, 5.4], target: [0, 0, 0] },
      focus: ['belt'],
      hotspots: [{ part: 'belt', label: 'Rib wear', spec: 'use a wear gauge' }],
      measure: [
        { name: 'Rib depth loss', spec: 'Replace at gauge flush', tool: 'Belt wear gauge' },
        { name: 'Cracks per rib', spec: '4+ per inch condemns', tool: 'Visual, belt flexed' },
        { name: 'Pulley alignment', spec: 'All coplanar within ~1 mm', tool: 'Straight edge' },
      ],
      explode: 0.15,
      durationMin: 10,
    },
    {
      id: 'b4',
      title: 'Release the tensioner and slip the belt off',
      body:
        'Put the belt tool or breaker bar on the **tensioner square drive** and rotate it against its spring. Hold it there, slide the belt off the easiest smooth pulley, then let the tensioner down slowly — do not let it snap back.',
      detail: [
        'Note which way the arm moves; most release in one direction only',
        'Slip the belt off an accessory you can reach, not off the crank',
        'Ease the tensioner back to its stop under control',
        'Keep your fingers out of the pinch point between belt and pulley',
      ],
      camera: { pos: [-2.6, 0.6, 4.6], target: [-1.1, -0.2, 0] },
      focus: ['tensioner', 'belt'],
      hotspots: [
        { part: 'tensioner', label: 'Square drive', spec: 'rotate against spring' },
        { part: 'belt', label: 'Slip off a smooth pulley' },
      ],
      explode: 0.3,
      hazards: ['spring'],
      durationMin: 8,
    },
    {
      id: 'b5',
      title: 'Spin every pulley by hand',
      body:
        'With the belt off, this is free diagnosis and almost nobody does it. **Spin each pulley and feel for roughness; rock it for play.** A rough idler bearing is what ate the last belt, and it will eat the new one too.',
      detail: [
        'Smooth and silent: fine. Gritty, notchy or noisy: replace',
        'Any wobble or rock means the bearing is finished',
        'Check the tensioner arm damping: it should move smoothly, not freely and not stiffly',
        'A tensioner that flutters at idle with the belt on is worn out internally',
      ],
      camera: { pos: [1.6, 1.2, 5.6], target: [0, 0.2, 0] },
      focus: ['tensioner', 'alternator', 'acCompressor', 'powerSteering', 'waterPump'],
      hotspots: [{ part: 'tensioner', label: 'Check damping and bearing' }],
      explode: 0.2,
      durationMin: 10,
      mistake:
        'Fitting a new belt onto a worn tensioner. The new belt squeals in three weeks and the customer assumes you sold them a bad belt.',
    },
    {
      id: 'b6',
      title: 'Replace the tensioner if it is due',
      body:
        'The tensioner is a spring and a damper, and the damper wears out silently. Past roughly 100,000 miles it goes on with the belt. One bolt, **50 N·m**, and make sure the locating dowel on the back drops into its hole before you torque it.',
      camera: { pos: [-2.8, 0.5, 4.4], target: [-1.1, -0.2, 0] },
      focus: ['tensioner', 'tensionerBolt'],
      hotspots: [{ part: 'tensionerBolt', label: 'Tensioner bolt', spec: '50 N·m' }],
      explode: 0.5,
      torque: [{ fastener: 'Tensioner assembly bolt', nm: 50, ftlb: 37 }],
      durationMin: 12,
    },
    {
      id: 'b7',
      title: 'Route the new belt — tensioner last',
      body:
        'Work the belt around every pulley from the diagram, leaving the **tensioner for last** so all the slack ends up where the tensioner can take it out. Then release the tensioner onto the belt.',
      detail: [
        'Ribbed side into the grooved pulleys, smooth back against any flat idler',
        'Get the hard-to-reach pulleys first while there is slack to play with',
        'Tensioner is the final wrap — that is what lets you fit it at all',
      ],
      camera: { pos: [1.4, 0.8, 6.2], target: [0, 0.1, 0] },
      focus: ['belt', 'tensioner'],
      hotspots: [{ part: 'belt', label: 'New belt', spec: 'tensioner wraps last' }],
      explode: 0.12,
      durationMin: 12,
    },
    {
      id: 'b8',
      title: 'Verify every groove before you start it',
      body:
        'Walk right around the drive with a torch and a mirror. **Every rib must sit in a groove on every pulley.** A belt sitting one rib off the edge looks almost right and will shred within a minute of running — usually taking the new tensioner with it.',
      detail: [
        'Check the pulleys you cannot see directly with a mirror',
        'Count ribs on the pulley against ribs on the belt at each one',
        'Confirm the tensioner is sitting within its operating range marks, not at either stop',
        'Start the engine and watch for 30 seconds: the belt should track steady with no edge walk',
      ],
      camera: { pos: [1.8, 1.0, 6.0], target: [0, 0.1, 0] },
      focus: ['belt', 'crankPulley', 'alternator', 'waterPump'],
      hotspots: [
        { part: 'crankPulley', label: 'Check every groove' },
        { part: 'belt', label: 'No rib hanging off an edge' },
      ],
      explode: 0,
      hazards: ['crush'],
      durationMin: 10,
      mistake:
        'Starting the engine without the final walk-around. One rib off the edge of the crank pulley destroys a new belt in under a minute, and the noise it makes convinces people the tensioner is faulty.',
    },
  ],
  hiddenByStep: {
    b1: ['routingDecal'],
    b2: [],
    b3: [],
    b4: [],
    b5: ['belt'],
    b6: ['belt'],
    b7: [],
    b8: [],
  },
  checkpoints: [
    {
      id: 'sbc1',
      afterStep: 'b1',
      question:
        'A serpentine belt snaps on the motorway. Which failure makes stopping urgent rather than inconvenient?',
      options: [
        {
          text: 'The water pump stops turning, so the engine has no coolant circulation and will overheat within a couple of miles',
          correct: true,
          why:
            'Charging loss gives you 20-odd minutes of battery. Loss of coolant circulation gives you a warped head. On engines where the belt drives the pump, a snapped belt means pull over now.',
        },
        {
          text: 'Loss of power steering makes the car undriveable',
          why: 'The steering goes heavy but the car still steers — unpleasant, not an emergency.',
        },
        {
          text: 'The alternator stops charging and the engine cuts out immediately',
          why: 'The battery will run the engine for a while. It is a problem, but not the urgent one.',
        },
        {
          text: 'The A/C compressor seizes',
          why: 'Without a belt the compressor simply stops being driven.',
        },
      ],
    },
    {
      id: 'sbc2',
      afterStep: 'b3',
      question:
        'An EPDM serpentine belt has no visible cracks but the truck has 95,000 miles on it. How do you decide whether to replace it?',
      options: [
        {
          text: 'Use a rib wear gauge — EPDM belts lose rib material gradually rather than cracking, so depth loss is the real measurement',
          correct: true,
          why:
            'Modern belt compounds changed the failure mode. A gauge that drops flush into the groove means the ribs have worn down and the belt is slipping even though it looks healthy.',
        },
        {
          text: 'No cracks means it is serviceable; leave it',
          why: 'That rule belongs to the older neoprene belts. Applying it to EPDM misses worn-out belts entirely.',
        },
        {
          text: 'Replace on mileage alone regardless of condition',
          why: 'Mileage is a prompt to measure, not a measurement.',
        },
        {
          text: 'Check belt tension with a gauge',
          why: 'Tension is set by the automatic tensioner, so it tells you about the tensioner, not the belt.',
        },
      ],
    },
  ],
}
