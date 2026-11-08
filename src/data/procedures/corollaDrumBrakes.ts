import type { Procedure } from '../../lib/types'

const DRUM_OFF = ['drum', 'lugNuts']
const SHOES_OFF = [
  ...DRUM_OFF,
  'shoeLeading',
  'shoeTrailing',
  'returnSprings',
  'adjusterSpring',
  'adjuster',
  'adjusterLever',
  'holdDowns',
  'strut',
  'parkingLever',
]

export const corollaDrumBrakes: Procedure = {
  id: 'corolla-drum-brakes',
  title: 'Rear Drum Brake Service',
  subtitle: 'Shoes, springs and the self-adjuster',
  primaryVehicleId: 'corolla-2015',
  system: 'brakes',
  location: 'wheel',
  difficulty: 3,
  timeMin: 120,
  assembly: 'drumBrake',
  summary:
    'Drums look archaic until you take one apart and realise it is a mechanism, not a clamp. Shoes that wedge themselves into the drum, a star wheel that takes up its own wear, and six springs that only go back one way. Do one side at a time and keep the other assembled as your reference — that single habit is what separates a 90-minute job from a ruined afternoon.',
  objectives: [
    'Name every component in a leading/trailing drum brake and describe its job',
    'Explain self-energising action and why drums make a good parking brake',
    'Measure drum inside diameter and lining thickness against discard specs',
    'Remove and refit return springs, hold-downs and the star adjuster in the correct order',
    'Adjust the shoes to the drum and explain why an unadjusted drum gives a low pedal',
  ],
  tools: [
    { name: 'Floor jack + 2 jack stands', category: 'safety' },
    { name: 'Wheel chocks on the front wheels', category: 'safety' },
    { name: 'Safety glasses', detail: 'Springs under tension', category: 'safety' },
    { name: 'Brake spring pliers', detail: 'The job is miserable without them', category: 'specialty' },
    { name: 'Hold-down spring tool', category: 'specialty' },
    { name: 'Drum micrometer or large vernier', detail: 'Inside diameter', category: 'measure' },
    { name: 'Brake shoe gauge', detail: 'Sets shoe spread to drum ID', category: 'measure' },
    { name: '21 mm socket + breaker bar', detail: 'Lug nuts', category: 'hand' },
    { name: 'Brake adjusting spoon', category: 'specialty' },
    { name: 'Brake parts cleaner + catch tray', detail: 'Never blow dust with air', category: 'consumable' },
    { name: 'High-temp brake grease', detail: 'For backing plate pads only', category: 'consumable' },
    { name: 'Nitrile gloves + dust mask', category: 'safety' },
  ],
  parts: [
    { name: 'Rear brake shoe set', qty: '1 axle set', note: 'Always both sides' },
    { name: 'Drum brake hardware kit', qty: '1 per side', note: 'Springs, hold-downs, clips — fit new, they lose tension' },
    { name: 'Brake drum', qty: '2', note: 'Only if under discard diameter or scored' },
    { name: 'Wheel cylinder', qty: '2', note: 'Replace if weeping; inspect under the boots' },
  ],
  fluids: [{ name: 'Brake fluid', spec: 'DOT 3', qty: 'Top-up / bleed only' }],
  torqueTable: [
    { fastener: 'Wheel lug nut', nm: 103, ftlb: 76, pattern: 'Star, two passes' },
    { fastener: 'Wheel cylinder mounting bolt', nm: 10, ftlb: 7 },
    { fastener: 'Brake line union at wheel cylinder', nm: 15, ftlb: 11, note: 'Flare nut wrench only' },
    { fastener: 'Backing plate bolt', nm: 65, ftlb: 48 },
    { fastener: 'Bleeder screw', nm: 8, ftlb: 6 },
  ],
  hazards: [
    { kind: 'crush', text: 'Chock the front wheels and use stands. The parking brake works on these wheels, so it is not holding the car while you are in here.' },
    { kind: 'eye', text: 'Return springs are the highest-energy thing on a small car corner. Glasses on, and keep the spring pointed away from your face.' },
    { kind: 'chemical', text: 'Brake dust is not to be blown with compressed air. Wet it with cleaner and catch it in a tray.' },
    { kind: 'sharp', text: 'Backing plate edges and spring hooks.' },
  ],
  steps: [
    {
      id: 'r1',
      title: 'One side at a time, always',
      body:
        'Before anything comes apart: **do one side completely, then the other.** The assembled side is your reference photograph, your spring diagram and your sanity. Every experienced tech works this way, and every student who ignores it ends up on a forum at midnight.',
      detail: [
        'Chock the front wheels — the parking brake acts on this axle',
        'Release the parking brake fully before you start',
        'Photograph the assembled side anyway, from three angles',
      ],
      camera: { pos: [3.6, 1.7, 4.4], target: [0, 0, 0] },
      explode: 0,
      hazards: ['crush'],
      durationMin: 10,
      tip: 'If both sides somehow end up apart, the parts catalogue exploded view is the next best reference. Do not guess at spring positions — they are not interchangeable.',
    },
    {
      id: 'r2',
      title: 'Wheel off, drum off',
      body:
        'The drum often slides straight off. When rust or a wear lip holds it, back the adjuster off through the slot in the backing plate first, then use the **two threaded jacking holes** in the drum face. Never hammer a drum you intend to reuse.',
      detail: [
        'Make sure the parking brake is fully released',
        'Back the star wheel off through the access slot to retract the shoes',
        'Thread two bolts evenly into the drum\'s jacking holes to press it off',
        'If it still will not move, penetrating oil on the hub spigot and patience',
      ],
      camera: { pos: [3.2, 1.2, 4.0], target: [0, 0, 0.3] },
      focus: ['drum', 'lugNuts'],
      hotspots: [
        { part: 'drum', label: 'Brake drum', spec: '200 mm nominal' },
        { part: 'lugNuts', label: 'Lug nut ×4', spec: '103 N·m' },
      ],
      explode: 0.3,
      torque: [{ fastener: 'Wheel lug nut', nm: 103, ftlb: 76 }],
      durationMin: 15,
    },
    {
      id: 'r3',
      title: 'Learn the mechanism before you dismantle it',
      body:
        'Rotate the model and look at what you have. The shoes pivot at the bottom and are pushed apart at the top by the **wheel cylinder**. Under braking, drum rotation drags the leading shoe harder into the drum — **self-energising action** — which is why a drum can out-grip a disc of the same size, and why it makes an excellent parking brake.',
      detail: [
        'Wheel cylinder at the top: hydraulic input, pushes both shoes outward',
        'Star adjuster at the bottom: sets how far the shoes sit from the drum',
        'Upper return springs: pull the shoes back off the drum when you release',
        'Hold-down pins: clamp each shoe flat to the backing plate while letting it slide',
        'Parking lever and strut: apply the shoes mechanically, no hydraulics involved',
      ],
      camera: { pos: [0.9, 0.5, 4.8], target: [0, 0, 0] },
      hotspots: [
        { part: 'wheelCylinder', label: 'Wheel cylinder', spec: 'hydraulic' },
        { part: 'adjuster', label: 'Star adjuster' },
        { part: 'returnSprings', label: 'Return springs' },
        { part: 'parkingLever', label: 'Parking brake lever' },
      ],
      explode: 0.2,
      durationMin: 15,
    },
    {
      id: 'r4',
      title: 'Measure before you condemn anything',
      body:
        'Drum inside diameter with a drum micrometer, lining thickness at the thinnest point. **A drum wears outward**, so it fails on maximum diameter, not minimum thickness — the opposite of a rotor. The limit is cast into the drum itself.',
      camera: { pos: [2.5, 0.9, 4.3], target: [0, 0, 0.2] },
      focus: ['drum', 'shoeLeading', 'shoeTrailing'],
      hotspots: [
        { part: 'drum', label: 'Drum ID', spec: 'discard 201 mm' },
        { part: 'shoeLeading', label: 'Lining', spec: 'min 1.0 mm' },
      ],
      measure: [
        { name: 'Drum inside diameter', spec: 'Nominal 200 mm, discard 201 mm', tool: 'Drum micrometer' },
        { name: 'Drum out-of-round', spec: 'Max 0.05 mm', tool: 'Drum micrometer, several positions' },
        { name: 'Lining thickness', spec: 'Replace below 1.0 mm', tool: 'Vernier' },
        { name: 'Wheel cylinder', spec: 'No fluid behind the boots', tool: 'Peel a boot back and look' },
      ],
      explode: 0.25,
      durationMin: 20,
      mistake:
        'Skipping the peel-back of the wheel cylinder boots. Fluid behind a boot means the cylinder is on its way out, and finding that after you have fitted new shoes means doing the job twice.',
    },
    {
      id: 'r5',
      title: 'Springs off: upper returns first',
      body:
        'Order matters. **Upper return springs first**, with spring pliers, which takes the tension out of the whole assembly. Everything after that comes off easily. Go the other way round and you will be fighting loaded springs with a screwdriver.',
      camera: { pos: [0.5, 1.5, 4.2], target: [0, 0.4, 0] },
      focus: ['returnSprings', 'wheelCylinder'],
      hotspots: [{ part: 'returnSprings', label: 'Upper return springs', spec: 'remove first' }],
      explode: 0.45,
      hazards: ['eye'],
      durationMin: 12,
    },
    {
      id: 'r6',
      title: 'Hold-downs, strut, then the shoes',
      body:
        'Press and quarter-turn each **hold-down pin** to release its cup and spring. Lift the parking brake strut out, unhook the parking lever from the trailing shoe, and the shoes come away with the adjuster still between them.',
      detail: [
        'Hold-down tool: push in, rotate 90°, release — the pin head passes through the slot',
        'Note which way the parking lever faces before unhooking it',
        'Keep the adjuster assembled between the shoes until it is on the bench',
      ],
      camera: { pos: [1.4, 0.3, 4.5], target: [0, 0, 0] },
      focus: ['holdDowns', 'shoeLeading', 'shoeTrailing', 'strut', 'parkingLever'],
      hotspots: [
        { part: 'holdDowns', label: 'Hold-down pin + cup' },
        { part: 'strut', label: 'Parking brake strut' },
        { part: 'parkingLever', label: 'Parking lever — note orientation' },
      ],
      explode: 0.6,
      durationMin: 18,
    },
    {
      id: 'r7',
      title: 'Clean and free the star adjuster',
      body:
        'Take the adjuster apart, wire-brush the threads, and **grease them lightly**. A seized adjuster is why drums go out of adjustment and give a long pedal — the self-adjusting mechanism stops working and nobody notices for 30,000 miles.',
      detail: [
        'Threads must turn freely by finger on the star wheel',
        'A trace of high-temp grease on the threads, nothing on the friction surfaces',
        'Left and right adjusters are handed — they are threaded opposite ways',
      ],
      camera: { pos: [0.7, -1.2, 4.0], target: [0, -0.45, 0] },
      focus: ['adjuster', 'adjusterLever'],
      hotspots: [
        { part: 'adjuster', label: 'Star adjuster', spec: 'must turn freely' },
        { part: 'adjusterLever', label: 'Adjuster lever' },
      ],
      explode: 0.55,
      durationMin: 15,
      mistake:
        'Swapping left and right adjusters. They are opposite-hand threads, and a swapped pair self-adjusts in the wrong direction — the brakes get looser every time you reverse.',
    },
    {
      id: 'r8',
      title: 'Grease the six contact pads, nothing else',
      body:
        'The backing plate has raised pads the shoe edges slide across. A smear of high-temp brake grease on **those pads only**. Grease anywhere near the lining or the drum and you have just bought a new set of shoes.',
      camera: { pos: [1.1, 0.4, 4.3], target: [0, 0, -0.2] },
      focus: ['backingPlate'],
      hotspots: [{ part: 'backingPlate', label: 'Shoe contact pads', spec: 'thin smear only' }],
      explode: 0.4,
      durationMin: 10,
    },
    {
      id: 'r9',
      title: 'Reassemble: shoes and adjuster, then hold-downs, then springs',
      body:
        'Exactly the reverse of removal. Hook the parking lever on, set the shoes against the backing plate with the adjuster between them, fit the **hold-downs to hold everything still**, then stretch the upper return springs on last. Springs last, always — they are what loads the assembly.',
      detail: [
        'New hardware kit, not the old springs — they lose tension with heat cycles',
        'Shoes are handed: the one with the shorter lining usually goes forward (check the kit instructions)',
        'Hold-downs before springs, or nothing stays where you put it',
        'Spring pliers for the last spring; do not lever it on with a screwdriver',
      ],
      camera: { pos: [0.9, 0.6, 4.5], target: [0, 0.1, 0] },
      focus: ['shoeLeading', 'shoeTrailing', 'holdDowns', 'returnSprings', 'adjusterSpring'],
      hotspots: [
        { part: 'holdDowns', label: '2nd: hold-downs' },
        { part: 'returnSprings', label: '3rd: return springs' },
        { part: 'adjusterSpring', label: 'Adjuster spring' },
      ],
      explode: 0.2,
      hazards: ['eye'],
      durationMin: 25,
    },
    {
      id: 'r10',
      title: 'Adjust the shoes to the drum',
      body:
        'Set the shoe spread with a **brake shoe gauge** taken off the drum\'s actual inside diameter, or expand the star wheel until the drum just drags slightly as you turn it, then back it off a few clicks. An unadjusted drum gives a long, low pedal that no amount of bleeding will fix.',
      detail: [
        'Gauge method: measure the drum ID, set the gauge, match the shoes to it',
        'Drag method: expand until the drum turns with light drag, back off 3–5 clicks',
        'Do both sides the same way so the car brakes evenly',
        'Then apply the parking brake several times to let the self-adjuster settle',
      ],
      camera: { pos: [2.6, 1.0, 4.5], target: [0, 0, 0.2] },
      focus: ['adjuster', 'drum'],
      hotspots: [{ part: 'adjuster', label: 'Star wheel', spec: 'set drag, then back off' }],
      explode: 0.15,
      durationMin: 20,
    },
    {
      id: 'r11',
      title: 'Drum on, wheel on, pedal and parking brake check',
      body:
        'Refit the drum, torque the wheel to **103 N·m** in a star pattern, then pump the pedal to a firm height before the car moves. Check the parking brake holds on an incline, and bed the new linings with gentle stops.',
      detail: [
        'Pump to a firm pedal and confirm the fluid level',
        'Parking brake should hold the car with 5–8 clicks of travel',
        'Reverse the car and brake moderately several times — that is what cycles the self-adjuster',
        'Bed in with gentle stops; drums glaze easily if you cook them early',
      ],
      camera: { pos: [3.4, 1.4, 4.2], target: [0, 0, 0.3] },
      focus: ['drum', 'lugNuts'],
      explode: 0,
      torque: [{ fastener: 'Wheel lug nut', nm: 103, ftlb: 76, pattern: 'Star, two passes' }],
      durationMin: 15,
      tip:
        'Driving in reverse and braking is not superstition — on most designs the self-adjuster only ratchets when the shoes move in the reverse direction. That is how the brakes take up their own wear.',
    },
  ],
  hiddenByStep: {
    r1: [],
    r2: [],
    r3: DRUM_OFF,
    r4: [],
    r5: DRUM_OFF,
    r6: [...DRUM_OFF, 'returnSprings'],
    r7: [...DRUM_OFF, 'returnSprings', 'holdDowns', 'strut', 'parkingLever'],
    r8: SHOES_OFF,
    r9: DRUM_OFF,
    r10: DRUM_OFF,
    r11: [],
  },
  checkpoints: [
    {
      id: 'rc1',
      afterStep: 'r3',
      question:
        'Why does a drum brake of a given size produce more braking force than a disc of the same size, and why does that matter for the parking brake?',
      options: [
        {
          text: 'Self-energising action — drum rotation drags the leading shoe harder into the drum, multiplying the force you applied',
          correct: true,
          why:
            'The shoe wedges itself in. That mechanical advantage means a modest cable pull holds the car, which is why drums survive at the back of cheap cars long after discs took over the front.',
        },
        {
          text: 'The lining area is larger, so there is more friction',
          why:
            'Drum linings are larger, but friction force does not depend on contact area. The wedging action is the mechanism.',
        },
        {
          text: 'Drums run cooler, so the friction coefficient stays higher',
          why: 'Drums run hotter than discs and fade sooner — that is their main weakness, not a strength.',
        },
        {
          text: 'The hydraulic cylinder has a larger bore',
          why: 'Bore size varies by design and is not what gives a drum its self-energising character.',
        },
      ],
    },
    {
      id: 'rc2',
      afterStep: 'r4',
      question:
        'A rotor is condemned on minimum thickness. What is a drum condemned on, and why is it the other way round?',
      options: [
        {
          text: 'Maximum inside diameter — the friction surface is on the inside, so wear makes the drum bigger, not thinner',
          correct: true,
          why:
            'Exactly. The shoes rub outward against the inner wall, so material loss opens the bore. Past the cast-in limit the drum is too thin to take the heat and too wide for the shoes to reach properly.',
        },
        {
          text: 'Minimum wall thickness, measured with a micrometer on the outer face',
          why: 'Wall thickness is the underlying concern, but the published and measurable spec is inside diameter.',
        },
        {
          text: 'Maximum weight loss compared to a new drum',
          why: 'Nobody weighs brake drums.',
        },
        {
          text: 'The same way as a rotor — minimum thickness',
          why: 'That would require measuring a surface you cannot easily reach, and it is not how the spec is published.',
        },
      ],
    },
    {
      id: 'rc3',
      afterStep: 'r9',
      question: 'Why are the upper return springs the last thing fitted and the first thing removed?',
      options: [
        {
          text: 'They are what loads the whole assembly — with them off, nothing is under tension and every other part comes off by hand',
          correct: true,
          why:
            'Taking the energy out first makes the rest trivial, and putting it back last means you are stretching springs onto parts that are already located and held.',
        },
        {
          text: 'They are the most likely to break, so they get handled least',
          why: 'Handling frequency is not the reason; load sequence is.',
        },
        {
          text: 'They have to be heated before fitting',
          why: 'Heating a spring ruins its temper. Never do this.',
        },
        {
          text: 'The order does not actually matter as long as everything ends up on',
          why:
            'It matters a great deal. Fitting springs before hold-downs means the shoes move every time you touch them, and removing them last means fighting a loaded assembly.',
        },
      ],
    },
  ],
}
