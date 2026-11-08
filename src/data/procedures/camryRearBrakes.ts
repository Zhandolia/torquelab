import type { Procedure } from '../../lib/types'

const WHEEL_OFF = ['wheel', 'lugNuts']
const CABLE_OFF = [...WHEEL_OFF, 'pbCable']
const CALIPER_OFF = [...CABLE_OFF, 'caliper', 'guidePins', 'piston', 'pbLever']
const PADS_OFF = [...CALIPER_OFF, 'padInner', 'padOuter', 'shims']
const BRACKET_OFF = [...PADS_OFF, 'bracket', 'bracketBolts']

export const camryRearBrakes: Procedure = {
  id: 'camry-rear-brakes',
  title: 'Rear Disc Brake Service',
  subtitle: 'Screw-in piston and an integrated parking brake',
  primaryVehicleId: 'camry-2014',
  alsoApplies: ['corolla-2015', 'accord-v6-2009'],
  system: 'brakes',
  location: 'wheel',
  difficulty: 3,
  timeMin: 85,
  assembly: 'brakeRear',
  summary:
    'A rear corner looks like a front corner until you reach for the C-clamp. The piston on this caliper rides on a ballscrew that the parking brake turns, so it has to be wound in, not pressed — and pressing it is the single most common way an enthusiast turns a two-hour job into a new caliper. You will also learn why the rear rotor is solid, why the pads are smaller, and what a parking brake lever that will not return to its stop is telling you.',
  objectives: [
    'Explain how one caliper does both hydraulic service braking and mechanical parking braking',
    'Wind a screw-in piston back without damaging the adjuster or the dust boot',
    'Say why a rear rotor is solid and a front rotor is vented, in terms of energy rather than cost',
    'Disconnect and refit a parking brake cable and verify the lever returns to its stop',
    'Set the parking brake self-adjuster correctly after a pad change, without touching the hand lever adjustment',
  ],
  tools: [
    { name: 'Floor jack + 2 jack stands', detail: 'Rated above vehicle weight', category: 'safety' },
    { name: 'Wheel chocks', detail: 'Front wheels — the parking brake is coming off', category: 'safety' },
    { name: 'Safety glasses', category: 'safety' },
    { name: 'Nitrile gloves', category: 'safety' },
    { name: '21 mm socket + breaker bar', detail: 'Lug nuts', category: 'hand' },
    { name: '14 mm socket', detail: 'Caliper guide pin bolts', category: 'hand' },
    { name: '17 mm socket', detail: 'Caliper bracket bolts', category: 'hand' },
    { name: 'Click torque wrench, 20–150 N·m', category: 'measure' },
    { name: 'Outside micrometer, 0–25 mm', detail: 'Rotor thickness', category: 'measure' },
    { name: 'Dial indicator + magnetic base', detail: 'Lateral runout', category: 'measure' },
    {
      name: 'Rear caliper piston wind-back tool',
      detail: 'Cube tool or a ratcheting wind-back kit. A C-clamp will not do this job',
      category: 'specialty',
    },
    { name: 'Needle-nose pliers', detail: 'Cable end at the lever', category: 'hand' },
    { name: 'Wire brush + hub cleaning disc', category: 'specialty' },
    { name: 'Bungee cord', detail: 'To hang the caliper', category: 'hand' },
    { name: 'Brake cleaner', detail: 'Non-chlorinated', category: 'consumable' },
    { name: 'High-temp synthetic caliper grease', category: 'consumable' },
  ],
  parts: [
    { name: 'Rear brake pad set', qty: '1 set (4 pads)', note: 'Rear-specific — smaller than the fronts' },
    { name: 'Rear brake rotor', qty: '2', note: 'Solid, replace in pairs' },
    { name: 'Caliper hardware kit', qty: '1', note: 'Guide pin boots, clips, pad retainers' },
  ],
  fluids: [{ name: 'Brake fluid', spec: 'DOT 3', qty: 'Top-up only' }],
  torqueTable: [
    { fastener: 'Wheel lug nut', nm: 103, ftlb: 76, pattern: 'Star / criss-cross, two passes' },
    { fastener: 'Caliper guide pin bolt', nm: 34, ftlb: 25, note: 'Caliper body to bracket' },
    { fastener: 'Caliper bracket bolt', nm: 88, ftlb: 65, note: 'Bracket to rear axle carrier' },
    { fastener: 'Brake hose banjo bolt', nm: 30, ftlb: 22, note: 'New sealing washers both sides' },
    { fastener: 'Bleeder screw', nm: 8, ftlb: 6 },
  ],
  hazards: [
    {
      kind: 'crush',
      text: 'You are about to release the parking brake on a car you have jacked up. Chock the front wheels before you touch the cable, not after.',
    },
    { kind: 'eye', text: 'Pad retainers and cable clips are spring steel and they launch. Glasses on.' },
    {
      kind: 'chemical',
      text: 'Brake fluid strips paint. Never blow brake dust with compressed air — wipe it down wet.',
    },
    { kind: 'burn', text: 'Rear rotors stay hot after a drive, even though they do less work than the fronts.' },
  ],
  steps: [
    {
      id: 's1',
      title: 'Chock the front, then release the parking brake',
      body:
        'Crack the lug nuts loose on the ground. Then **chock both front wheels and release the parking brake** — you cannot disconnect the cable with the brake applied, and you are about to remove the only thing holding a rear wheel. Transmission in Park is not a substitute for chocks at the other end of the car.',
      detail: [
        'Level ground, engine off, Park selected',
        'Chocks in front of and behind a front wheel',
        'Break each lug nut about a quarter turn while the tyre is loaded',
        'Release the parking brake fully and confirm the lever drops to its rest position',
      ],
      camera: { pos: [4.8, 2.8, 5.4], target: [0, 0.3, 0] },
      explode: 0,
      hazards: ['crush'],
      durationMin: 8,
      tip: 'If the parking brake will not release, stop. A seized cable is the job, and you will find out now rather than halfway through.',
    },
    {
      id: 's2',
      title: 'Remove the wheel',
      body:
        'Lug nuts off, wheel straight off the studs. Lay it face-up under the sill. Rear lug torque on this car is **103 N·m**, lower than the front on many platforms — check the figure rather than assuming all four corners match.',
      camera: { pos: [3.6, 1.5, 4.6], target: [0, 0, 0.3] },
      focus: ['lugNuts', 'wheel'],
      hotspots: [
        { part: 'lugNuts', label: 'Lug nut ×5', spec: '103 N·m' },
        { part: 'wheel', label: 'Road wheel' },
      ],
      explode: 0.25,
      torque: [{ fastener: 'Wheel lug nut', nm: 103, ftlb: 76, pattern: 'Star pattern on reassembly' }],
      durationMin: 4,
    },
    {
      id: 's3',
      title: 'Measure, and notice what the rear corner is not',
      body:
        'The rotor is **solid, not vented**, and the pads are smaller than the fronts. That is not cost-cutting: weight transfers forward under braking, so the rear axle does roughly a quarter to a third of the work and has far less heat to get rid of. Measure before you decide anything.',
      detail: [
        'Pad friction thickness at the thinnest point — rear minimum is typically 1.0 mm',
        'Rotor thickness at four points: new 10.0 mm, discard 8.5 mm on this platform',
        'Look for the rust lip at the outer edge — common on rears, because light duty never cleans them',
        'Compare left to right. A rear that is worn much harder than the other side is usually a seized cable or lever',
      ],
      camera: { pos: [-2.8, 1.0, 3.0], target: [-0.6, 0, 0] },
      focus: ['padOuter', 'padInner', 'rotor'],
      hotspots: [
        { part: 'padOuter', label: 'Outer pad', spec: 'min 1.0 mm' },
        { part: 'rotor', label: 'Solid rotor', spec: 'new 10 mm / discard 8.5 mm' },
      ],
      measure: [
        { name: 'Pad friction thickness', spec: 'Replace below 1.0 mm', tool: 'Vernier or pad gauge' },
        { name: 'Rotor thickness', spec: 'New 10.0 mm, discard 8.5 mm', tool: 'Outside micrometer' },
        { name: 'Rotor lateral runout', spec: 'Max 0.05 mm', tool: 'Dial indicator on hub' },
      ],
      explode: 0.15,
      durationMin: 10,
      tip:
        'A rear rotor at 8.6 mm measures fine and is still finished — there is no useful life between that and the discard figure. Replace it.',
    },
    {
      id: 's4',
      title: 'Disconnect the parking brake cable',
      body:
        'Pull the cable end out of the **lever clevis**, then squeeze the conduit end fitting out of its bracket. Do it in that order: with the inner cable still loaded you cannot get slack, and levering on the conduit while it is tensioned bends the bracket.',
      detail: [
        'Push the lever forward by hand to create slack in the inner cable',
        'Slip the cable nipple out of the clevis slot with needle-nose pliers',
        'Compress the conduit retaining tangs and push the fitting out of the bracket',
        'Check the lever snaps back to its stop once the cable is off — this is your free diagnosis',
      ],
      camera: { pos: [-3.9, 2.3, 3.6], target: [-1.3, 0.7, -0.4] },
      focus: ['pbCable', 'pbLever'],
      hotspots: [
        { part: 'pbCable', label: 'Cable + conduit end' },
        { part: 'pbLever', label: 'Parking brake lever', spec: 'must return to its stop' },
      ],
      explode: 0.35,
      durationMin: 8,
      mistake:
        'Cutting the cable or forcing the clevis because the brake is still applied. Release the brake first; the slack is free.',
    },
    {
      id: 's5',
      title: 'Guide pin bolts out, caliper off',
      body:
        'Two 14 mm bolts, **34 N·m** — the caliper body floats on its pins, exactly like the front. Hold the slide pin with a wrench if it turns with the bolt. These are not the bolts that hold the brake to the car.',
      camera: { pos: [-2.6, 0.7, 2.4], target: [-0.7, 0, 0] },
      focus: ['guidePins', 'caliper'],
      hotspots: [
        { part: 'guidePins', label: 'Guide pin bolt ×2', spec: '34 N·m' },
        { part: 'caliper', label: 'Caliper body' },
      ],
      explode: 0.4,
      torque: [{ fastener: 'Caliper guide pin bolt', nm: 34, ftlb: 25 }],
      durationMin: 6,
    },
    {
      id: 's6',
      title: 'Hang the caliper — never on the hose',
      body:
        'Bungee it to a suspension link. **The flexible hose is not a strap**, and it is a shorter, stiffer hose at the rear than at the front, so there is even less slack to abuse.',
      camera: { pos: [-3.0, -1.2, 2.8], target: [-0.7, -0.6, 0] },
      focus: ['caliper', 'hose'],
      hotspots: [{ part: 'hose', label: 'Flexible brake hose', spec: 'Do not load' }],
      explode: 0.5,
      hazards: ['chemical'],
      durationMin: 3,
    },
    {
      id: 's7',
      title: 'Pads, shims and retainers out',
      body:
        'Note the order and the handedness as they come out. Rear pads often have a different friction compound front to back of the pair, and the retainer clips are shaped so they only fit one way.',
      camera: { pos: [-2.4, 0.5, 2.8], target: [-0.64, 0, 0] },
      focus: ['padInner', 'padOuter', 'shims'],
      hotspots: [
        { part: 'padInner', label: 'Inner pad' },
        { part: 'shims', label: 'Shim stack' },
      ],
      explode: 0.6,
      durationMin: 5,
      tip: 'Photograph it before it comes apart. The clip orientation is the thing nobody remembers an hour later.',
    },
    {
      id: 's8',
      title: 'Wind the piston in — do not press it',
      body:
        'This is the step the whole procedure exists for. The piston rides on a **ballscrew driven by the parking brake lever**, and that screw is also the self-adjuster that takes up pad wear. It only retracts by being rotated. Press it with a C-clamp and you drive the screw back through its own thread, which wrecks the adjuster, the seal, or both.',
      detail: [
        'Open the master cylinder reservoir cap so displaced fluid has somewhere to go',
        'Engage the cube tool or wind-back kit in the two slots in the piston face',
        'Rotate — clockwise on most applications, and the piston should walk in as it turns',
        'Keep light axial pressure on while rotating; the tool does both at once by design',
        'Leave the slots roughly vertical so the pad locating tabs line up on reassembly',
      ],
      camera: { pos: [-3.0, 0.9, 2.7], target: [-0.6, 0, 0] },
      /* only the piston is highlighted, so the caliper ghosts and you can
         actually see the thing the step is about */
      focus: ['piston'],
      hotspots: [
        { part: 'piston', label: 'Screw-in piston', spec: 'rotate, bore 38 mm' },
        { part: 'pbLever', label: 'Lever turns this screw' },
      ],
      explode: 0.45,
      hazards: ['chemical', 'pressure'],
      durationMin: 10,
      mistake:
        'Using a C-clamp because it worked on the front. The front piston is a plain hydraulic piston; this one is on a thread. The symptom is a rear brake that drags and a parking brake that never holds again.',
    },
    {
      id: 's9',
      title: 'Bracket off, 17 mm and 88 N·m',
      body:
        'Two bolts into the rear axle carrier. **88 N·m** — lower than the front bracket because the rear corner sees less braking torque, but still the structural fastener of this corner. Six-point socket, breaker bar to crack them.',
      camera: { pos: [-3.2, 0.9, 1.8], target: [-0.9, 0, -0.2] },
      focus: ['bracket', 'bracketBolts'],
      hotspots: [
        { part: 'bracketBolts', label: 'Bracket bolt ×2', spec: '88 N·m' },
        { part: 'bracket', label: 'Caliper bracket' },
      ],
      explode: 0.65,
      torque: [{ fastener: 'Caliper bracket bolt', nm: 88, ftlb: 65 }],
      durationMin: 6,
    },
    {
      id: 's10',
      title: 'Rotor off, hub face to bare metal',
      body:
        'Back out the locating screw and pull the rotor. Then clean the hub face properly. **Rust scale on the hub becomes runout, and runout becomes thickness variation** — the physics is identical at the rear, and a rear rotor doing light duty never wears its own high spot away.',
      detail: [
        'Two 8 mm bolts into the service holes if corrosion has it stuck, a half turn at a time',
        'Hub cleaning disc or wire brush until the face is bright all the way round',
        'Check the face with a straight edge before the new rotor goes near it',
      ],
      camera: { pos: [2.4, 1.1, 3.4], target: [0, 0, 0.1] },
      focus: ['rotor', 'hub'],
      hotspots: [{ part: 'hub', label: 'Hub flange', spec: 'runout < 0.05 mm' }],
      measure: [{ name: 'Assembled lateral runout', spec: 'Max 0.05 mm', tool: 'Dial indicator' }],
      explode: 0.72,
      durationMin: 12,
    },
    {
      id: 's11',
      title: 'Service the slide pins and pad abutments',
      body:
        'Pull each pin, wipe the bore, check the boots, re-lube with **high-temperature synthetic caliper grease**. Then file and grease the pad abutment surfaces in the bracket. Rear brackets corrode harder than fronts because they spend their lives cooler and wetter.',
      camera: { pos: [-2.6, 0.5, 2.2], target: [-0.7, 0, 0] },
      focus: ['guidePins', 'bracket'],
      hotspots: [{ part: 'guidePins', label: 'Slide pin + boot', spec: 'free by hand' }],
      explode: 0.5,
      durationMin: 10,
      mistake: 'Chassis grease in the pin bores. It swells the boots and the pin seizes.',
    },
    {
      id: 's12',
      title: 'New rotor and bracket on',
      body:
        'Degrease both faces of the new rotor, fit it, snug the locating screw, then torque both bracket bolts to **88 N·m**. Confirm assembled runout with the dial indicator before anything else goes on.',
      camera: { pos: [-3.0, 0.9, 2.2], target: [-0.7, 0, -0.1] },
      focus: ['rotor', 'bracket', 'bracketBolts'],
      hotspots: [{ part: 'bracketBolts', label: 'Bracket bolt', spec: '88 N·m' }],
      explode: 0.15,
      torque: [{ fastener: 'Caliper bracket bolt', nm: 88, ftlb: 65 }],
      durationMin: 8,
    },
    {
      id: 's13',
      title: 'Pads in, caliper on, 34 N·m',
      body:
        'Shims in the order they came off, grease on the backing plate ears only. Lower the caliper over the pads — if it will not go on, the piston is not wound in far enough, so wind it further rather than forcing the bolts. Then **34 N·m** on both guide pin bolts.',
      detail: [
        'New clips and retainers from the hardware kit',
        'Check the piston slots line up with the inner pad tabs where the design uses them',
        'Pads should still slide by hand once the caliper is on',
      ],
      camera: { pos: [-2.6, 0.6, 2.4], target: [-0.7, 0, 0] },
      focus: ['caliper', 'guidePins', 'padInner', 'padOuter'],
      hotspots: [{ part: 'guidePins', label: 'Guide pin bolt', spec: '34 N·m' }],
      explode: 0.12,
      torque: [{ fastener: 'Caliper guide pin bolt', nm: 34, ftlb: 25 }],
      durationMin: 8,
      mistake:
        'Pulling the caliper down onto thick new pads with the bolts. That is how a guide pin thread strips, and the caliper was never going to seat anyway.',
    },
    {
      id: 's14',
      title: 'Cable back on, lever back to its stop',
      body:
        'Conduit fitting into its bracket first until the tangs click, then the cable nipple into the clevis. Now push the lever by hand and **watch it return to its stop by itself**. If it does not, the cable is binding or the lever pivot is seized — and you will never get a parking brake that holds.',
      camera: { pos: [-3.6, 2.0, 3.4], target: [-1.1, 0.5, -0.3] },
      focus: ['pbCable', 'pbLever'],
      hotspots: [
        { part: 'pbLever', label: 'Lever', spec: 'returns to stop unaided' },
        { part: 'pbCable', label: 'Conduit seated in bracket' },
      ],
      explode: 0.2,
      durationMin: 7,
      tip:
        'A lever resting a few millimetres off its stop holds the pads lightly against the rotor all the time. That is the cause of a hot rear wheel and a rear rotor that bluing has turned purple.',
    },
    {
      id: 's15',
      title: 'Wheel on, torque in a star pattern',
      body:
        'Hand-start every nut, snug in a star pattern, lower the car so the tyre is loaded, then torque to **103 N·m** in the same pattern. Re-check after 50 miles.',
      camera: { pos: [3.6, 1.5, 4.6], target: [0, 0, 0.3] },
      focus: ['wheel', 'lugNuts'],
      hotspots: [{ part: 'lugNuts', label: 'Lug nut', spec: '103 N·m, star pattern' }],
      explode: 0,
      torque: [{ fastener: 'Wheel lug nut', nm: 103, ftlb: 76, pattern: 'Star, two passes' }],
      durationMin: 6,
    },
    {
      id: 's16',
      title: 'Pump the pedal, then cycle the parking brake',
      body:
        'Pump to a firm pedal first — the pistons are fully retracted. Then **apply and release the parking brake several times** with the pedal pumped firm in between. That is what runs the ballscrew out to its new working position. The self-adjuster does this, not the hand lever adjustment under the console.',
      detail: [
        'Pump the brake pedal to a firm feel, check the fluid level, refit the cap',
        'Apply the parking brake fully and release it, 5 to 8 times',
        'Re-check the pedal, then confirm the parking brake holds the car on a slope',
        'Bed the pads: 6–8 moderate stops from about 50 to 15 km/h, then drive without braking to cool',
      ],
      camera: { pos: [4.8, 2.8, 5.4], target: [0, 0.3, 0] },
      explode: 0,
      durationMin: 12,
      mistake:
        'Reaching for the cable adjuster because the parking brake feels long on the first pull. Cycle the brake first — nine times out of ten the adjuster has simply not run out yet, and tightening the cable now leaves the brakes dragging for good.',
    },
  ],
  hiddenByStep: {
    s1: [],
    s2: [],
    s3: WHEEL_OFF,
    s4: WHEEL_OFF,
    s5: CABLE_OFF,
    s6: CABLE_OFF,
    s7: [...CABLE_OFF, 'caliper', 'guidePins'],
    s8: [...CABLE_OFF, 'padInner', 'padOuter', 'shims'],
    s9: PADS_OFF,
    s10: BRACKET_OFF,
    s11: [...CABLE_OFF, 'rotor', 'caliper', 'padInner', 'padOuter', 'shims'],
    s12: [...CABLE_OFF, 'caliper', 'guidePins', 'piston', 'pbLever', 'padInner', 'padOuter', 'shims'],
    s13: CABLE_OFF,
    s14: WHEEL_OFF,
    s15: [],
    s16: [],
  },
  checkpoints: [
    {
      id: 'cp1',
      afterStep: 's8',
      question:
        'Why can a rear caliper piston of this design not simply be pressed back with a C-clamp, the way a front one is?',
      options: [
        {
          text: 'It sits on a threaded adjuster screw turned by the parking brake lever, so it only retracts by rotating',
          correct: true,
          why:
            'Right. The screw does two jobs — it applies the parking brake and it self-adjusts for pad wear. Pressing axially drives the piston against its own thread and damages the adjuster or the seal.',
        },
        {
          text: 'The bore is too small for a clamp to reach',
          why: 'Access is not the issue. A clamp fits perfectly well; it is the mechanism behind the piston that cannot take the load.',
        },
        {
          text: 'The rear circuit holds more pressure, so the fluid cannot be displaced',
          why: 'Rear circuit pressure is lower, not higher, and the reservoir takes the displaced fluid either way.',
        },
        {
          text: 'Pressing it would let air into the caliper through the bleeder',
          why: 'Nothing about compressing a piston admits air unless you deliberately open the bleeder.',
        },
      ],
    },
    {
      id: 'cp2',
      afterStep: 's3',
      question:
        'The rear rotor on this car is solid while the front is internally vented. What is the engineering reason?',
      options: [
        {
          text: 'Weight transfers forward under braking, so the rear axle converts far less energy into heat and needs much less cooling capacity',
          correct: true,
          why:
            'Exactly. The front does roughly two thirds to three quarters of the work, so it needs the internal vanes to pump air through the disc. A solid rear is sized to its actual thermal load.',
        },
        {
          text: 'The rear rotor spins slower, so it cannot pump air through vanes',
          why: 'Both rotors turn at the same wheel speed on any car not in a corner.',
        },
        {
          text: 'A vented rear rotor would make the parking brake ineffective',
          why: 'Plenty of cars have vented rear rotors with the same style of parking brake. Thermal load is what decides it.',
        },
        {
          text: 'Solid rotors resist corrosion better, which matters more at the rear',
          why: 'Rear rotors do corrode more, but that is a consequence of light duty, not a reason to choose solid over vented.',
        },
      ],
    },
    {
      id: 'cp3',
      afterStep: 's14',
      question:
        'After the job, the parking brake lever at the caliper rests about 3 mm away from its stop instead of against it. What happens if you leave it?',
      options: [
        {
          text: 'The pads stay lightly loaded against the rotor all the time, so that corner runs hot and wears fast',
          correct: true,
          why:
            'A lever off its stop means the ballscrew is partly applied. The result is a dragging rear brake: a hot wheel, blued rotor, fast pad wear and a measurable fuel economy loss.',
        },
        {
          text: 'Nothing — the hydraulic piston will still retract normally',
          why: 'The hydraulic side releases, but the mechanical screw is holding the piston out. That position is the piston’s new rest point.',
        },
        {
          text: 'The parking brake will be too strong and lock the rear wheels',
          why: 'It applies earlier, but the problem is what happens when it is released, not when it is applied.',
        },
        {
          text: 'The pedal will go soft because the piston is further out',
          why: 'A piston closer to the pads gives a firmer pedal, not a softer one. Drag is the real consequence.',
        },
      ],
    },
  ],
}
