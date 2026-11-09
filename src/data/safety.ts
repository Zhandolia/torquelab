import type { Hazard } from '../lib/types'

/**
 * The safety brief.
 *
 * Every procedure in this platform carries a hazard strip, and the strip has
 * always been the one piece of content that only tells you the conclusion. It
 * says "crush / falling load" and moves on. That is the right thing for a
 * procedure to do and the wrong thing for the platform to leave at that,
 * because the audience this was built for is somebody on their own, on a
 * driveway, with a trolley jack and no lift and nobody to find them.
 *
 * Trade school teaches this on day one, before anyone touches a car. So does
 * this, now.
 *
 * None of it replaces the lift-point diagram in the vehicle's own handbook.
 * Jacking points are model-specific and the page says so where it matters.
 */

/* --------------------------------------------------------- lift points */

export type LiftVerdict = 'rated' | 'jack' | 'never'

export interface LiftPoint {
  id: string
  label: string
  /** position in the diagram's 760 × 360 coordinate space */
  x: number
  y: number
  verdict: LiftVerdict
  why: string
}

export const LIFT_VERDICTS: Record<LiftVerdict, { label: string; tone: string; blurb: string }> = {
  rated: {
    label: 'Stands',
    tone: 'safe',
    blurb: 'A rated support point. The car can stay here while you work under it.',
  },
  jack: {
    label: 'Jack only',
    tone: 'amber',
    blurb: 'Fine to lift from on many cars, and not somewhere to leave the weight. It moves, or it was never meant to hold still.',
  },
  never: {
    label: 'Never',
    tone: 'danger',
    blurb: 'Not a lifting or support point. It will deform, crack or let go, and some of these do it without warning.',
  },
}

export const LIFT_POINTS: LiftPoint[] = [
  {
    id: 'bumperBeam',
    label: 'Bumper reinforcement beam',
    x: 72,
    y: 222,
    verdict: 'never',
    why: 'Designed to absorb a crash by crumpling. Putting a static load into a structure whose whole job is to collapse progressively is exactly backwards.',
  },
  {
    id: 'oilPan',
    label: 'Engine oil pan',
    x: 126,
    y: 256,
    verdict: 'never',
    why: 'Thin cast aluminium with a sealing flange. It cracks, and you find out when it drops the car and the sump at the same time.',
  },
  {
    id: 'subframeFront',
    label: 'Front subframe crossmember',
    x: 256,
    y: 242,
    verdict: 'rated',
    why: 'Heavy fabricated steel bolted straight to the body structure, and on most unibody cars a rated lift point. Check the handbook: a few makers specify the pinch welds only.',
  },
  {
    id: 'controlArm',
    label: 'Lower control arm',
    x: 288,
    y: 292,
    verdict: 'jack',
    why: 'Acceptable to lift from at the ball joint end on many cars, and never a place to leave the weight. The arm swings as the suspension droops, so the stand ends up loaded at an angle it cannot hold.',
  },
  {
    id: 'pinchFront',
    label: 'Front pinch weld jacking point',
    x: 336,
    y: 234,
    verdict: 'rated',
    why: 'The factory point, usually marked with a notch or an arrow in the sill trim. Use a slotted jack pad — a flat saddle folds the seam over and then there is no point left to use.',
  },
  {
    id: 'sillCentre',
    label: 'Middle of the sill, between the marked points',
    x: 410,
    y: 234,
    verdict: 'never',
    why: 'The seam is only reinforced where it is marked. Anywhere else it is a folded edge of sheet steel, and it crushes flat under a jack saddle.',
  },
  {
    id: 'floorPan',
    label: 'Floor pan',
    x: 412,
    y: 264,
    verdict: 'never',
    why: 'Less than a millimetre of sheet steel with sound deadening on the other side. A stand punches straight through it.',
  },
  {
    id: 'pinchRear',
    label: 'Rear pinch weld jacking point',
    x: 490,
    y: 234,
    verdict: 'rated',
    why: 'The rear half of the same system, just ahead of the rear wheel. Same slotted pad, same rule about only using the marked spot.',
  },
  {
    id: 'rearBeam',
    label: 'Rear axle beam or differential',
    x: 552,
    y: 252,
    verdict: 'jack',
    why: 'Strong enough to lift from on plenty of cars, and it is suspension — it moves relative to the body. The stands still go under the body once it is up.',
  },
  {
    id: 'spareWell',
    label: 'Spare wheel well',
    x: 664,
    y: 242,
    verdict: 'never',
    why: 'A pressed sheet-metal tub, often with a drain plug in the lowest point. It dents, then folds, then drops.',
  },
]

export const RATED_IDS = LIFT_POINTS.filter((p) => p.verdict === 'rated').map((p) => p.id)

export const LIFT_RULES: { rule: string; why: string }[] = [
  {
    rule: 'Level, solid ground. Never grass, gravel or a sloped driveway.',
    why: 'A stand only has to sink or slide a few millimetres on one side for the car to walk off the top of it.',
  },
  {
    rule: 'Chock the wheels that stay on the ground, both sides of the tyre.',
    why: 'A car on stands at one end can roll at the other, and a rolling car takes the stands out from under itself.',
  },
  {
    rule: 'Stands in pairs, at the same height, on matching points.',
    why: 'Mismatched heights put the load into one stand at an angle, which is how a stand tips rather than crushes.',
  },
  {
    rule: 'Lower onto the stands and let the jack take some of the load.',
    why: 'The jack stays as a backup rather than being wound right out of the way. It costs nothing and it has saved people.',
  },
  {
    rule: 'Shake the car hard before any part of you goes under it.',
    why: 'If it moves on the stands you have found out now, standing up, instead of later, lying down.',
  },
  {
    rule: 'Put the wheel you removed under the sill.',
    why: 'If the worst happens the car lands on the wheel and not on you. It is the cheapest insurance in the job.',
  },
  {
    rule: 'Never go under a car held up by a jack alone, not even for a second.',
    why: 'A hydraulic jack fails by sinking, and it does it quietly. The ones that kill people were "only going to be a minute".',
  },
]

/* ------------------------------------------------------- stored energy */

export interface StoredEnergy {
  id: string
  title: string
  what: string
  howMuch: string
  release: string
  procedureId?: string
}

export const STORED_ENERGY: StoredEnergy[] = [
  {
    id: 'spring',
    title: 'A compressed coil spring',
    what: 'The suspension spring on a strut assembly, held compressed by the damper rod nut even with the strut off the car.',
    howMuch:
      'Enough to put a spring seat through a workshop ceiling. A front coil on a mid-size car stores several kilojoules at ride height, and it releases all of it in a few hundredths of a second.',
    release:
      'Compress it with a proper cradle-type compressor or a wall-mounted unit, engaged on at least three coils per side, and never undo the damper rod nut until the spring is visibly loose in its seats. Hook-type compressors on two coils are the ones that let go.',
    procedureId: 'civic-front-strut',
  },
  {
    id: 'fuel',
    title: 'Fuel system pressure',
    what: 'A direct-injection rail holds pressure long after the engine stops, and a port-injection rail holds enough to spray.',
    howMuch:
      'Port injection sits at a few bar. The high-pressure side of a direct-injection system runs into the hundreds of bar, and a jet at that pressure goes through skin without being felt as a cut.',
    release:
      'Relieve the system through the service procedure for that engine, not by cracking a union. Cold engine, no ignition sources, and treat a high-pressure line as live until it has been proven otherwise.',
  },
  {
    id: 'cooling',
    title: 'A hot cooling system',
    what: 'A pressurised circuit at well over 100 °C, held liquid only by the pressure the cap maintains.',
    howMuch:
      'Taking the cap off a hot system drops the pressure instantly, and the coolant flashes to steam in the time it takes to lift the cap clear.',
    release:
      'Let it cool until the upper hose is cool enough to squeeze comfortably. If you must open it warm, a rag over the cap and a slow quarter turn to the first stop, then wait.',
    procedureId: 'camry-cooling-system',
  },
  {
    id: 'refrigerant',
    title: 'Air conditioning refrigerant',
    what: 'A liquefied gas under pressure through the whole system, whether the engine has run or not.',
    howMuch:
      'It boils at around −26 °C at atmospheric pressure, so a release onto skin is a cryogenic burn, and into eyes it is permanent.',
    release:
      'Recovered by someone with the equipment and the licence to do it. Venting it is illegal in most places and is not a thing to attempt in a driveway.',
  },
  {
    id: 'airbag',
    title: 'Airbag and pretensioner modules',
    what: 'A pyrotechnic charge with its own igniter, in the steering wheel, the dash, the seats and the seatbelt buckles.',
    howMuch:
      'It is designed to inflate a bag in about 30 milliseconds. A module that fires on a bench travels, and a pretensioner will take a finger.',
    release:
      'Battery disconnected and left for the manufacturer’s stated wait time before any trim comes off near one. Carry a live module with the cover facing away from you and never put a meter across the connector.',
    procedureId: 'civic-door-panel',
  },
  {
    id: 'brakedust',
    title: 'Brake dust and used fluids',
    what: 'Friction dust, used engine oil, and coolant — none of which announce themselves as hazards.',
    howMuch:
      'Older friction material can contain asbestos and newer material is still not something to breathe. Used engine oil is a confirmed carcinogen on repeated skin contact. Ethylene glycol coolant is sweet, lethal in small quantities, and kills pets that find the puddle.',
    release:
      'Never blow brake dust with an airline — wipe it down wet. Nitrile gloves for anything that has been through an engine, and clean up coolant spills immediately rather than at the end of the job.',
    procedureId: 'oil-and-filter',
  },
]

/* --------------------------------------------------- hazard reference */

export interface HazardDetail {
  kind: Hazard
  what: string
  control: string
}

export const HAZARD_DETAIL: HazardDetail[] = [
  {
    kind: 'crush',
    what: 'A vehicle supported by anything that can fail, sink or slide, and anything heavy enough to break what it lands on.',
    control: 'Rated stands on rated points, chocks on the other axle, the jack left in reserve, and the wheel under the sill.',
  },
  {
    kind: 'spring',
    what: 'Suspension springs, valve springs, and the tension springs in a drum brake. All of them hold energy with no warning that they do.',
    control: 'The correct compressor, engaged properly, and your body out of the line the part would travel in if it let go.',
  },
  {
    kind: 'pressure',
    what: 'Fuel rails, cooling systems, air conditioning, charged accumulators and tyres.',
    control: 'Depressurise through the service procedure. Assume a line is live until you have proved otherwise, and face shields where a jet is possible.',
  },
  {
    kind: 'burn',
    what: 'Exhaust components, turbochargers, coolant and engine oil. Exhaust manifolds hold useful heat for a surprisingly long time.',
    control: 'Let it cool. Where that is not possible, gloves rated for it and a deliberate plan for where your forearms go.',
  },
  {
    kind: 'chemical',
    what: 'Brake fluid, coolant, used oil, solvents, battery acid and friction dust.',
    control: 'Nitrile gloves, eye protection, ventilation, and no compressed air anywhere near dust you do not want to inhale.',
  },
  {
    kind: 'fire',
    what: 'Fuel vapour, brake cleaner near a hot surface, and a battery that is being charged.',
    control: 'An extinguisher within reach, no ignition sources, and no grinding or welding in the same space as an open fuel system.',
  },
  {
    kind: 'electrical',
    what: 'Starter and battery cables that can weld a spanner, airbag circuits, and the orange cabling on a hybrid or electric vehicle.',
    control: 'Negative terminal off first and back on last. Orange cable is high voltage and is not a DIY system — leave it to someone trained and equipped.',
  },
  {
    kind: 'eye',
    what: 'Spring clips, brake dust, penetrating oil, rust scale and wire-wheel bristles. Almost always from above.',
    control: 'Glasses on before you go under, not when you remember. A wire wheel throws bristles at eye height all day.',
  },
  {
    kind: 'sharp',
    what: 'Corroded panel edges, broken wire wheels, swarf and the underside of almost any car over ten years old.',
    control: 'Gloves, long sleeves, and a light so you can see what you are reaching past.',
  },
]
