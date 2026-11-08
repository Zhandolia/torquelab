import type { Procedure } from '../../lib/types'

const HUB_SIDE_OFF = ['axleNut']
const OUT_OF_CAR = [...HUB_SIDE_OFF, 'knuckle', 'hub', 'transCase']

export const civicCvAxle: Procedure = {
  id: 'civic-cv-axle',
  title: 'CV Axle & Boot Replacement',
  subtitle: 'Constant-velocity joints, and why a torn boot is a deadline',
  primaryVehicleId: 'civic-2016',
  alsoApplies: ['camry-2014', 'corolla-2015', 'accord-v6-2009'],
  system: 'driveline',
  location: 'wheel',
  difficulty: 3,
  timeMin: 150,
  assembly: 'cvAxle',
  summary:
    'A front driveshaft has to transmit torque through a joint that is steering and moving up and down at the same time, at constant speed in and out. It does that for 200,000 miles as long as the grease stays in and the dirt stays out. A split boot gives you weeks before the joint is scrap, which makes a torn boot the cheapest repair you will ever be glad you caught.',
  objectives: [
    'Explain what "constant velocity" means and why a universal joint is not good enough here',
    'Distinguish an outer Rzeppa joint from an inner tripod and say what each one does',
    'Diagnose a worn outer joint from the noise it makes and when it makes it',
    'Remove and refit an axle without damaging the transmission seal or the hub bearing',
    'Torque an axle nut correctly and explain why it is a one-time fastener',
  ],
  tools: [
    { name: 'Floor jack + 2 jack stands', category: 'safety' },
    { name: 'Safety glasses', category: 'safety' },
    { name: '32–36 mm axle nut socket', detail: 'Check your size — it is large', category: 'specialty' },
    { name: 'Breaker bar, 600 mm', detail: 'The axle nut is very tight', category: 'hand' },
    { name: 'Torque wrench to 250 N·m', category: 'measure' },
    { name: 'Ball joint separator / pickle fork', category: 'specialty' },
    { name: 'Pry bar, 450 mm', detail: 'To pop the inner joint out of the transmission', category: 'hand' },
    { name: 'Dead-blow hammer', category: 'hand' },
    { name: 'Boot clamp pliers', detail: 'For ear-type or band clamps', category: 'specialty' },
    { name: 'Snap ring pliers', category: 'specialty' },
    { name: 'Drain pan', detail: 'The transmission will lose some fluid', category: 'consumable' },
    { name: 'CV joint grease', detail: 'Comes with the boot kit — use that one only', category: 'consumable' },
  ],
  parts: [
    { name: 'CV axle assembly', qty: '1', note: 'Usually cheaper and faster than rebooting a worn joint' },
    { name: 'CV boot kit', qty: '1', note: 'Only worth it if the boot just split and the joint is still clean' },
    { name: 'Axle nut', qty: '1', note: 'Single use — it is a staked or self-locking fastener' },
    { name: 'Transmission output seal', qty: '1', note: 'Replace while the axle is out if it shows any weep' },
  ],
  fluids: [{ name: 'Transmission fluid', spec: 'Honda CVT Fluid HCF-2', qty: 'Top-up after refitting' }],
  torqueTable: [
    { fastener: 'Axle / hub nut', nm: 245, ftlb: 181, note: 'New nut, then stake it if the design calls for it' },
    { fastener: 'Wheel lug nut', nm: 108, ftlb: 80, pattern: 'Star, two passes' },
    { fastener: 'Lower ball joint nut', nm: 59, ftlb: 44 },
    { fastener: 'Damper fork / strut pinch bolt', nm: 64, ftlb: 47 },
    { fastener: 'Stabilizer link nut', nm: 44, ftlb: 32 },
  ],
  hazards: [
    { kind: 'crush', text: 'Rated stands. The knuckle swings freely once the ball joint is out and it is heavy.' },
    { kind: 'chemical', text: 'CV grease is molybdenum-loaded and gets everywhere. Gloves, and keep it off the brakes.' },
    { kind: 'sharp', text: 'Circlips and snap rings under tension. Glasses on.' },
    { kind: 'pressure', text: 'The transmission will drip when the axle comes out. Have the pan ready before, not after.' },
  ],
  steps: [
    {
      id: 'v1',
      title: 'What "constant velocity" is actually solving',
      body:
        'A plain universal joint running at an angle speeds up and slows down twice per revolution. On a driveshaft that would be a vibration; on a **steered** driveshaft at 40° of lock it would be unusable. A CV joint transmits torque through balls or rollers that stay on the plane bisecting the joint angle, so output speed equals input speed at any angle.',
      detail: [
        'Outer joint (Rzeppa): six balls in a cage, handles large steering angles',
        'Inner joint (tripod): three rollers that also slide, so the shaft can change length as the suspension moves',
        'The shaft has to do both at once, continuously, for the life of the car',
      ],
      camera: { pos: [2.4, 2.9, 7.6], target: [0, 0, 0] },
      hotspots: [
        { part: 'outerJoint', label: 'Outer joint — steering angles' },
        { part: 'innerJoint', label: 'Inner joint — plunges in and out' },
        { part: 'shaft', label: 'Shaft' },
      ],
      explode: 0.3,
      durationMin: 12,
      tip: 'Explode the assembly here. Seeing the tripod rollers and the Rzeppa bell side by side makes the division of labour obvious in a way a cross-section drawing never does.',
    },
    {
      id: 'v2',
      title: 'Diagnose before you order parts',
      body:
        'The classic outer joint symptom is a **rhythmic clicking on full lock at low speed** — reversing in a car park is where everyone first hears it. A worn inner joint gives a shudder under acceleration from a standstill, not a click.',
      detail: [
        'Clicking on lock, speeds up with wheel speed: outer joint',
        'Shudder or vibration accelerating in a straight line: inner joint',
        'Grease flung around the inside of the wheel arch: a boot has been split for a while',
        'Check both axles — the noise side is not always obvious from the driver\'s seat',
      ],
      camera: { pos: [2.6, 1.4, 4.2], target: [1.3, 0, 0] },
      focus: ['outerJoint', 'outerBoot'],
      hotspots: [
        { part: 'outerBoot', label: 'Split boot = clock is ticking' },
        { part: 'outerJoint', label: 'Rzeppa outer joint' },
      ],
      explode: 0.2,
      durationMin: 12,
      mistake:
        'Replacing an axle for a clicking noise that was actually a worn wheel bearing or a loose heat shield. Get the car on a lift and turn the wheel by hand with the engine off before you commit.',
    },
    {
      id: 'v3',
      title: 'Crack the axle nut while the wheel is on the ground',
      body:
        'That nut is at **245 N·m** and the hub will happily spin. Break it loose with the tyre loaded and the brake applied, before you lift. Trying to hold a hub with a screwdriver through the brake rotor is how rotors get bent.',
      detail: [
        'If it is staked, pick the stake out of the groove first or you will damage the shaft threads',
        'Loosen it a turn or two only — do not remove it yet',
        'Then loosen the lug nuts, and only then lift',
      ],
      camera: { pos: [2.8, 1.2, 4.0], target: [1.8, 0, 0] },
      focus: ['axleNut'],
      hotspots: [{ part: 'axleNut', label: 'Axle nut', spec: '245 N·m — single use' }],
      explode: 0.15,
      torque: [{ fastener: 'Axle / hub nut', nm: 245, ftlb: 181 }],
      durationMin: 15,
    },
    {
      id: 'v4',
      title: 'Free the knuckle',
      body:
        'Wheel off, then disconnect the stabilizer link and separate the **lower ball joint** so the knuckle can swing outward. Support the knuckle — do not let it hang on the brake hose or the ABS wire.',
      camera: { pos: [3.0, 0.4, 4.4], target: [2.0, -0.2, 0] },
      focus: ['knuckle', 'hub'],
      hotspots: [{ part: 'knuckle', label: 'Steering knuckle', spec: 'support it' }],
      explode: 0.3,
      hazards: ['crush'],
      torque: [
        { fastener: 'Lower ball joint nut', nm: 59, ftlb: 44 },
        { fastener: 'Stabilizer link nut', nm: 44, ftlb: 32 },
      ],
      durationMin: 25,
    },
    {
      id: 'v5',
      title: 'Push the splined stub out of the hub',
      body:
        'With the nut off, push the stub shaft back through the hub by hand or with a soft-faced drift. **If it is seized, use a puller, not a hammer** — driving on the end of the shaft damages the threads and can brinell the wheel bearing.',
      camera: { pos: [2.6, 0.9, 3.8], target: [1.7, 0, 0] },
      focus: ['outerJoint', 'hub'],
      hotspots: [
        { part: 'outerJoint', label: 'Splined stub through the hub' },
        { part: 'hub', label: 'Wheel bearing — do not shock-load it' },
      ],
      explode: 0.4,
      durationMin: 15,
      mistake:
        'Hammering the shaft out. The impact passes straight through the wheel bearing balls and leaves dents in the races — you fix the axle and create a bearing noise.',
    },
    {
      id: 'v6',
      title: 'Pop the inner joint out of the transmission',
      body:
        'Pan underneath first. Lever the inner joint housing out with a pry bar against the case — **against the housing, never against the boot or the shaft.** An internal circlip lets go with a pop. Expect fluid.',
      detail: [
        'Pry evenly at the joint housing flange, not on the alloy case lip',
        'A firm shock usually works better than steady force',
        'Once free, support the axle — do not let it hang by the inner joint',
        'Plug the opening with a spare joint or a cap so the differential does not drain',
      ],
      camera: { pos: [-2.4, 1.0, 4.0], target: [-1.4, 0, 0] },
      focus: ['innerJoint', 'circlip', 'transCase'],
      hotspots: [
        { part: 'innerJoint', label: 'Tripod housing', spec: 'pry here' },
        { part: 'circlip', label: 'Retaining circlip' },
      ],
      explode: 0.45,
      hazards: ['pressure', 'chemical'],
      durationMin: 20,
    },
    {
      id: 'v7',
      title: 'Boot kit or complete axle?',
      body:
        'If the boot split **recently** and the grease inside is still clean and smooth, a boot kit is a genuine repair. If the grease is gritty, discoloured, or the joint has any play, the abrasive has already been through it — fit a complete axle and stop throwing labour at a worn joint.',
      detail: [
        'Clean grease, no play, boot just split: reboot it',
        'Gritty grease, rust-coloured, or any clicking: replace the axle',
        'New boot kits come with the correct grease — use that, not chassis grease',
        'Always a new clamp set; the old ones do not re-crimp reliably',
      ],
      camera: { pos: [2.2, 1.4, 4.0], target: [1.0, 0, 0] },
      focus: ['outerBoot', 'outerClamps', 'outerJoint'],
      hotspots: [
        { part: 'outerBoot', label: 'Boot', spec: 'check grease condition' },
        { part: 'outerClamps', label: 'New clamps either way' },
      ],
      explode: 0.55,
      durationMin: 25,
    },
    {
      id: 'v8',
      title: 'Fit the new axle — mind the seal',
      body:
        'New circlip on the inner stub. Line the splines up **square** and push straight in until the clip seats with a click. Going in at an angle is how transmission output seals get cut, and that leak shows up a week later looking like a failed repair.',
      detail: [
        'Inspect the output seal while you have access; replace it if it is weeping at all',
        'A light smear of fluid on the stub helps it slide past the seal lip',
        'Pull on the joint afterwards — it should not come back out',
        'Top the transmission up to spec after everything is back together',
      ],
      camera: { pos: [-2.4, 1.0, 4.0], target: [-1.4, 0, 0] },
      focus: ['innerJoint', 'circlip'],
      hotspots: [{ part: 'innerJoint', label: 'Push straight, not angled' }],
      explode: 0.3,
      durationMin: 20,
      mistake:
        'Forcing it in at an angle and nicking the seal lip. The transmission then drips onto the exhaust and everyone blames the new axle.',
    },
    {
      id: 'v9',
      title: 'Axle nut to 245 N·m, and a new one',
      body:
        'The stub goes back through the hub, the knuckle reconnects, and the **new** axle nut torques to 245 N·m with the wheel back on the ground. It sets the preload on the wheel bearing stack — it is not just holding the axle in.',
      detail: [
        'New nut, always. The locking feature is single-use',
        'Torque with the car on its wheels, not hanging in the air',
        'Stake the collar into the shaft groove if that is the original design',
        'Then torque the lug nuts in a star pattern to 108 N·m',
      ],
      camera: { pos: [2.8, 1.2, 4.0], target: [1.8, 0, 0] },
      focus: ['axleNut', 'hub', 'knuckle'],
      hotspots: [{ part: 'axleNut', label: 'New nut', spec: '245 N·m' }],
      explode: 0.1,
      torque: [
        { fastener: 'Axle / hub nut', nm: 245, ftlb: 181, note: 'New nut, car on its wheels' },
        { fastener: 'Wheel lug nut', nm: 108, ftlb: 80, pattern: 'Star, two passes' },
      ],
      durationMin: 20,
      tip:
        'Under-torque this nut and the bearing runs loose and fails. Over-torque it and you crush the bearing preload. It is one of the few fasteners on a car where both directions of error destroy the same part.',
    },
    {
      id: 'v10',
      title: 'Road test on full lock',
      body:
        'Top up the transmission, then drive slow figure-eights on **full lock both ways** in an empty car park. That is the condition a bad outer joint complains in, so it is the condition that proves the new one is quiet. Check underneath for drips afterwards.',
      camera: { pos: [2.2, 2.2, 5.4], target: [0, 0, 0] },
      explode: 0,
      durationMin: 15,
    },
  ],
  hiddenByStep: {
    v1: ['transCase', 'knuckle', 'hub', 'axleNut'],
    v2: ['transCase'],
    v3: [],
    v4: ['axleNut'],
    v5: HUB_SIDE_OFF,
    v6: HUB_SIDE_OFF,
    v7: OUT_OF_CAR,
    v8: HUB_SIDE_OFF,
    v9: [],
    v10: [],
  },
  checkpoints: [
    {
      id: 'vc1',
      afterStep: 'v2',
      question:
        'A car clicks rhythmically on full lock at parking speeds but is quiet in a straight line. What does that point to?',
      options: [
        {
          text: 'A worn outer CV joint — the balls are loose in their tracks and knock as the joint articulates',
          correct: true,
          why:
            'Clicking that appears with steering angle and tracks wheel speed is the textbook outer joint symptom. It almost always follows a boot that split and let the grease out.',
        },
        {
          text: 'A worn inner tripod joint',
          why: 'Inner joints shudder under acceleration in a straight line; they do not click on lock.',
        },
        {
          text: 'A failing wheel bearing',
          why: 'Bearings hum or growl and change with cornering load, but they do not produce a discrete per-revolution click on lock.',
        },
        {
          text: 'A loose brake caliper',
          why: 'That would rattle over bumps and when braking, not with steering angle.',
        },
      ],
    },
    {
      id: 'vc2',
      afterStep: 'v9',
      question: 'Why does the axle nut have both a high torque spec and a strict no-reuse rule?',
      options: [
        {
          text: 'It sets the wheel bearing preload, and its locking feature is deformed on first use — so both under- and over-torque damage the bearing',
          correct: true,
          why:
            'The nut clamps the bearing stack together. Loose, the bearing runs with play and fails; over-tight, the preload crushes it. The locking collar only deforms correctly once.',
        },
        {
          text: 'It only stops the axle sliding out, so the torque is arbitrary as long as it is tight',
          why: 'If that were true, any torque above "tight" would do. It is not — the spec exists because of the bearing.',
        },
        {
          text: 'It is torque-to-yield like a head bolt',
          why: 'It is single-use because of the locking feature, not because it is stretched past yield.',
        },
        {
          text: 'The high torque is needed to seat the CV joint splines',
          why: 'The splines seat with hand pressure; the clamp load is for the bearing.',
        },
      ],
    },
  ],
}
