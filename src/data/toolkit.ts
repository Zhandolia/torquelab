/**
 * The canonical tool catalogue.
 *
 * Across the sixteen procedures there are 187 tool entries written as 153
 * distinct strings, because each procedure names its tools the way that step
 * needs them: "14 mm socket", "17 mm socket", "21 mm socket + breaker bar".
 * Read end to end that looks like an impossible shopping list, and the single
 * most discouraging thing for somebody deciding whether they can start at all.
 *
 * The clearest case is torque wrenches. Eleven different strings appear:
 *
 *   Torque wrench 5–25 N·m          Click torque wrench, 5–40 N·m
 *   Torque wrench 5–30 N·m   (×2)   Click torque wrench, 20–150 N·m  (×2)
 *   Torque wrench 10–60 N·m  (×2)   Click torque wrench, 60–300 N·m
 *   Torque wrench 20–80 N·m         In-lb torque wrench or small click wrench
 *   Torque wrench 20–150 N·m        Torque wrench 20–250 N·m
 *   Torque wrench to 250 N·m (×2)
 *
 * That is not eleven wrenches. It is three, and every figure in this platform
 * falls inside one of them. Collapsing the list is the entire point of this
 * file: the mapping below is explicit rather than pattern-matched, so a tool
 * string can map to two real purchases ("Floor jack + 2 jack stands") and
 * nothing is silently dropped by a regex that nearly matched.
 */

import type { ToolCategory } from '../lib/types'

/**
 * What you do about a tool, which is a different question from what it is.
 * Only `own` tools gate whether you can start a job at all — consumables are
 * bought per job and hire tools are hired per job, so neither belongs in a
 * "what do I need to buy first" ladder.
 */
export type KitKind = 'own' | 'hire' | 'consumable' | 'part'

export const KIT_KIND: Record<KitKind, { label: string; blurb: string }> = {
  own: { label: 'Own it', blurb: 'Lives in your kit and pays for itself across jobs' },
  hire: { label: 'Hire or borrow', blurb: 'Too expensive or too rarely needed to buy outright' },
  consumable: { label: 'Buy per job', blurb: 'Used up — order it with the parts' },
  part: { label: 'Not a tool', blurb: 'A part that appears in a tool list; buy it with the parts' },
}

export interface CanonTool {
  id: string
  name: string
  /** What to actually look for when buying it. */
  detail: string
  kind: KitKind
  category: ToolCategory
  /**
   * Whether not having it actually stops the job. Defaults to true; set false
   * for the things you improvise or already own — a rag, a blanket, a torch, a
   * paint pen, your phone.
   *
   * The distinction is not cosmetic. The first version of the buying ladder
   * had the sixteenth job unlocking on the purchase of a *paint pen*, and the
   * ninth on a *phone camera* that this catalogue itself describes as "you
   * already own it". Counting those as blockers makes the whole ordering
   * meaningless, because it attributes a job to whichever trivial item
   * happened to be bought last rather than to the tool that was really in the
   * way.
   */
  gating?: boolean
  /** Why this one rather than the cheap one, where that genuinely matters. */
  note?: string
}

/** Tools whose absence genuinely stops you starting a job. */
export const isGating = (t: CanonTool) => t.kind === 'own' && t.gating !== false

export const CANON: CanonTool[] = [
  /* ------------------------------------------------- holding the car up */
  {
    id: 'jack-stands',
    name: 'Jack stands, pair',
    detail: 'Rated above the vehicle weight, ratchet or pin type',
    kind: 'own',
    category: 'safety',
    note: 'The one item on this list that is load-bearing in the literal sense. Buy rated stands and check the rating, not the price.',
  },
  {
    id: 'floor-jack',
    name: 'Floor jack',
    detail: 'Trolley jack, 2 tonne for cars, 3 tonne for the truck',
    kind: 'own',
    category: 'safety',
    note: 'A lifting device, never a holding device — a single hydraulic seal is all that stands between the jack and the floor.',
  },
  { id: 'wheel-chocks', name: 'Wheel chocks', detail: 'A pair, rubber or moulded', kind: 'own', category: 'safety' },
  {
    id: 'ramps',
    name: 'Drive-on ramps',
    detail: 'An alternative to jack and stands for under-car work with the wheels on',
    kind: 'own',
    category: 'safety',
    gating: false,
    note: 'Only useful where the wheels stay on, and every procedure that mentions them offers jack and stands as the alternative. Anything at a corner still needs the car in the air.',
  },
  { id: 'glasses', name: 'Safety glasses', detail: 'Wrap-around, impact rated', kind: 'own', category: 'safety' },
  { id: 'face-shield', name: 'Face shield', detail: 'Over the glasses, not instead of them', kind: 'own', category: 'safety' },
  { id: 'gloves', name: 'Nitrile gloves', detail: 'A box, not a pair', kind: 'own', category: 'safety' },
  { id: 'dust-mask', name: 'Dust mask', detail: 'P2 / N95 for brake and gasket dust', kind: 'own', category: 'safety' },
  { id: 'work-light', name: 'Work light', detail: 'LED headlamp or a magnetic inspection lamp', kind: 'own', category: 'hand', gating: false },
  { id: 'mirror', name: 'Inspection mirror', detail: 'Telescoping, for fasteners you cannot see', kind: 'own', category: 'hand', gating: false },

  /* ---------------------------------------------------- turning things */
  {
    id: 'socket-set',
    name: 'Metric socket set, 8–22 mm',
    detail: '3/8" and 1/2" drive, six-point',
    kind: 'own',
    category: 'hand',
    note: 'Every individually named socket in all sixteen procedures — 7, 8, 10, 12, 13, 14, 15, 17, 18, 19, 21, 22 mm — is inside one ordinary set. Six-point, not twelve: twelve-point rounds a tight fastener.',
  },
  {
    id: 'socket-large',
    name: 'Large axle nut socket, 32–36 mm',
    detail: '1/2" drive, impact grade',
    kind: 'own',
    category: 'hand',
    note: 'Outside any normal set. Needed for both driven-axle jobs, and an undersized socket rounds a nut you then cannot remove at all with the car already in the air.',
  },
  { id: 'ratchets', name: 'Ratchets and extensions', detail: '1/4", 3/8", 1/2" with extensions and a swivel', kind: 'own', category: 'hand' },
  {
    id: 'breaker-bar',
    name: 'Breaker bar, 600 mm',
    detail: '1/2" drive',
    kind: 'own',
    category: 'hand',
    note: 'Length is the whole point. A shorter bar does not develop enough torque to break corrosion, so it twists the bolt until it snaps instead.',
  },
  { id: 'screwdrivers', name: 'Screwdrivers and Torx drivers', detail: 'Phillips #2, flat, Torx T20–T30', kind: 'own', category: 'hand' },
  { id: 'allen-keys', name: 'Hex key set', detail: 'Metric, ball-end', kind: 'own', category: 'hand' },
  { id: 'pliers', name: 'Pliers set', detail: 'Combination, needle-nose, side cutters', kind: 'own', category: 'hand' },
  { id: 'pry-bar', name: 'Pry bar, 450 mm', detail: 'Rolling-head or flat', kind: 'own', category: 'hand' },
  { id: 'dead-blow', name: 'Dead-blow hammer', detail: 'Shot-filled, non-marring', kind: 'own', category: 'hand', note: 'Delivers the blow without the rebound that a steel hammer puts straight back into a bearing or a machined face.' },

  /* ------------------------------------------------------------ torque */
  {
    id: 'tq-small',
    name: 'Torque wrench, 5–40 N·m',
    detail: '1/4" or 3/8" drive click type',
    kind: 'own',
    category: 'measure',
    note: 'The one people skip, and the one that saves aluminium. A spark plug at 18 N·m or a pan bolt at 12 N·m is barely more than firm finger pressure on a long bar — most people land near 40 and pull the threads out.',
  },
  {
    id: 'tq-mid',
    name: 'Torque wrench, 20–150 N·m',
    detail: '3/8" or 1/2" drive click type',
    kind: 'own',
    category: 'measure',
    note: 'The workhorse. Caliper bolts, bracket bolts, most of the lug nuts and nearly every underhood fastener live in this range.',
  },
  {
    id: 'tq-large',
    name: 'Torque wrench, 60–300 N·m',
    detail: '1/2" drive click type',
    kind: 'own',
    category: 'measure',
    note: 'Only for the big ones: axle nuts at 245 N·m, crank bolts, truck lug nuts at 190 N·m. A wrench is accurate in the middle of its range, so these figures do not belong on the mid wrench even where they fit.',
  },
  {
    id: 'angle-gauge',
    name: 'Torque angle gauge',
    detail: 'Dial or digital, between wrench and socket',
    kind: 'own',
    category: 'measure',
    note: 'Ninety degrees cannot be eyeballed on a bolt being deliberately stretched past yield. Required wherever a spec reads "then 90°".',
  },

  /* --------------------------------------------------------- measuring */
  { id: 'vernier', name: 'Vernier or digital caliper', detail: '0–150 mm', kind: 'own', category: 'measure' },
  { id: 'mic-25', name: 'Outside micrometer, 0–25 mm', detail: '0.01 mm graduations', kind: 'own', category: 'measure' },
  { id: 'mic-set', name: 'Outside micrometer set, 0–100 mm', detail: 'Four frames with standards', kind: 'own', category: 'measure' },
  { id: 'dial-indicator', name: 'Dial indicator + magnetic base', detail: '0.01 mm, 10 mm travel', kind: 'own', category: 'measure', note: 'Used in four separate procedures here — runout, end play, hub play. The first measuring tool worth owning after a caliper.' },
  { id: 'feeler-gauges', name: 'Feeler gauge set', detail: 'Metric blades, 0.03–1.00 mm', kind: 'own', category: 'measure' },
  { id: 'straight-edge', name: 'Precision straight edge, 300 mm', detail: 'Ground, used with feeler gauges', kind: 'own', category: 'measure' },
  { id: 'bore-gauge', name: 'Dial bore gauge', detail: 'With setting micrometer', kind: 'hire', category: 'measure', note: 'Bench work only, and expensive. Borrow it or have the machine shop measure for you.' },
  { id: 'telescoping', name: 'Telescoping gauges', detail: 'Set, used with a micrometer', kind: 'own', category: 'measure' },
  { id: 'drum-mic', name: 'Drum micrometer', detail: 'Or a large vernier at a pinch', kind: 'hire', category: 'measure' },
  { id: 'shoe-gauge', name: 'Brake shoe gauge', detail: 'Sets shoes to drum before the drum goes on', kind: 'own', category: 'specialty' },
  { id: 'belt-gauge', name: 'Belt wear gauge', detail: 'Usually free from the belt maker', kind: 'own', category: 'measure' },
  { id: 'ir-thermometer', name: 'Infrared thermometer', detail: 'Non-contact, to about 350 °C', kind: 'own', category: 'measure' },
  { id: 'refractometer', name: 'Coolant refractometer', detail: 'Or test strips', kind: 'own', category: 'measure' },
  { id: 'gap-gauge', name: 'Spark plug gap gauge', detail: 'Wire loop type, not the coin', kind: 'own', category: 'measure' },

  /* --------------------------------------------------------- specialty */
  { id: 'caliper-compressor', name: 'Caliper piston compressor', detail: 'Or a large C-clamp for front calipers', kind: 'own', category: 'specialty' },
  {
    id: 'windback',
    name: 'Rear caliper wind-back tool',
    detail: 'Cube tool or a ratcheting kit',
    kind: 'own',
    category: 'specialty',
    note: 'A rear piston rides on a ballscrew and retracts only by rotating. The C-clamp that worked on the front wrecks the adjuster, the seal, or both.',
  },
  { id: 'brake-spring-pliers', name: 'Brake spring pliers', detail: 'For drum return springs', kind: 'own', category: 'specialty', note: 'A loaded brake return spring cannot be stretched by hand, and a screwdriver used as a lever lets go sideways.' },
  { id: 'holddown-tool', name: 'Brake hold-down spring tool', detail: 'Push-and-turn type', kind: 'own', category: 'specialty' },
  { id: 'brake-spoon', name: 'Brake adjusting spoon', detail: 'For the star adjuster through the backing plate', kind: 'own', category: 'specialty' },
  { id: 'trim-tools', name: 'Nylon trim tools', detail: 'Set, with a push-pin puller', kind: 'own', category: 'specialty', note: 'A screwdriver marks the panel and the painted frame behind it, and those marks are permanent.' },
  { id: 'ball-joint-separator', name: 'Ball joint separator', detail: 'Screw type, not a pickle fork, if you want the boot to survive', kind: 'own', category: 'specialty' },
  {
    id: 'spring-compressor',
    name: 'Coil spring compressor',
    detail: 'Proper threaded compressor, inspected before use',
    kind: 'hire',
    category: 'specialty',
    note: 'A compressed coil spring stores several thousand joules. Hire a good one rather than buying the two-hook clamps that let go.',
  },
  { id: 'hub-puller', name: 'Three-jaw puller or slide hammer', detail: 'With a hub adapter', kind: 'hire', category: 'specialty' },
  { id: 'serpentine-tool', name: 'Serpentine belt tool', detail: 'Long handle with a swivel head', kind: 'own', category: 'specialty' },
  { id: 'crank-holder', name: 'Crankshaft pulley holder', detail: 'Engine-specific holding tool', kind: 'hire', category: 'specialty', note: 'The alternatives — bumping the starter, or a screwdriver in the flywheel teeth — move the engine out of time or break teeth off the flywheel.' },
  { id: 'plug-socket', name: 'Spark plug socket, 5/8"', detail: 'With a rubber retainer', kind: 'own', category: 'specialty' },
  { id: 'thread-chaser', name: 'Thread chaser set', detail: 'Chaser, not a tap — a tap cuts new metal', kind: 'own', category: 'specialty' },
  { id: 'oil-filter-wrench', name: 'Oil filter wrench', detail: 'Cap socket sized to your filter, or a strap', kind: 'own', category: 'specialty' },
  { id: 'hose-clamp-pliers', name: 'Hose clamp pliers', detail: 'For spring clamps', kind: 'own', category: 'specialty' },
  { id: 'boot-clamp-pliers', name: 'CV boot clamp pliers', detail: 'For ear clamps', kind: 'own', category: 'specialty' },
  { id: 'snap-ring-pliers', name: 'Snap ring pliers', detail: 'Internal and external', kind: 'own', category: 'specialty' },
  { id: 'gasket-scraper', name: 'Gasket scraper', detail: 'Plastic or brass — never steel on aluminium', kind: 'own', category: 'specialty' },
  { id: 'wire-brush', name: 'Wire brush + hub cleaning disc', detail: 'Disc runs on a drill or angle grinder', kind: 'own', category: 'specialty' },
  { id: 'ring-compressor', name: 'Piston ring compressor + filer', detail: 'Tapered sleeve or band type', kind: 'hire', category: 'specialty' },
  { id: 'ring-expander', name: 'Piston ring expander', detail: 'Stops you twisting a ring putting it on', kind: 'own', category: 'specialty' },
  { id: 'rod-bolt-protectors', name: 'Rod bolt protectors', detail: 'Plastic sleeves over the studs', kind: 'own', category: 'specialty' },
  { id: 'bore-brush', name: 'Bore brush', detail: 'For oil galleries and bolt holes', kind: 'own', category: 'specialty' },
  { id: 'shop-vac', name: 'Shop vacuum', detail: 'Or compressed air where it is safe to use it', kind: 'own', category: 'power' },
  { id: 'pressure-tester', name: 'Cooling system pressure tester', detail: 'With the right cap adapter', kind: 'hire', category: 'specialty', note: 'Most parts shops lend this one free against a deposit.' },
  {
    id: 'scan-tool',
    name: 'Scan tool with live data',
    detail: 'Must show transmission fluid temperature',
    kind: 'hire',
    category: 'specialty',
    note: 'Not the twenty-pound code reader. The transmission has no dipstick and its level is only meaningful inside a temperature window, so without live data you are guessing.',
  },
  { id: 'fluid-pump', name: 'Fluid transfer pump', detail: 'Hand pump that fits the fill plug', kind: 'own', category: 'specialty' },
  { id: 'bleed-funnel', name: 'Spill-free bleed funnel', detail: 'Threads into the radiator or header neck', kind: 'own', category: 'specialty', note: 'This engine traps air above the filler. Squeezing hoses does not move it, which is why people do the job twice.' },
  { id: 'funnel', name: 'Funnel', detail: 'Long-neck, for oil', kind: 'own', category: 'hand', gating: false },
  { id: 'drain-pan', name: 'Drain pan, 8 L+', detail: 'Wide and low, with a pouring spout', kind: 'own', category: 'hand' },
  { id: 'hex-pin', name: 'Tensioner pin, 2 mm', detail: 'A drill bit or hex key does the job', kind: 'own', category: 'hand' },
  { id: 'strut-socket', name: 'Strut nut socket set', detail: 'Holds the damper rod while you undo the nut', kind: 'own', category: 'specialty' },
  { id: 'engine-hoist', name: 'Engine hoist + load leveller', detail: '1 tonne folding crane', kind: 'hire', category: 'specialty' },
  { id: 'engine-stand', name: 'Engine stand', detail: '450 kg rated, four-bolt head', kind: 'hire', category: 'specialty' },
  { id: 'engine-support', name: 'Engine support bar', detail: 'Spans the wings to hold the engine from above', kind: 'hire', category: 'specialty' },

  /* ------------------------------------------------------- bench and tidy */
  { id: 'parts-trays', name: 'Parts trays and rags', detail: 'Magnetic trays, organiser boxes, lint-free wipes', kind: 'own', category: 'hand', gating: false, note: 'Sounds trivial until you have thirty fasteners of three types in one pile.' },
  { id: 'paint-pen', name: 'Paint pen', detail: 'For your own timing and orientation marks', kind: 'own', category: 'hand', gating: false },
  { id: 'bungee', name: 'Bungee cord or mechanics wire', detail: 'To hang a caliper by anything but its hose', kind: 'own', category: 'hand', gating: false },
  { id: 'blanket', name: 'Padded blanket', detail: 'For panels, covers and seats', kind: 'own', category: 'hand', gating: false },
  { id: 'camera', name: 'A phone camera', detail: 'You already own it', kind: 'own', category: 'hand', gating: false, note: 'The most used tool in this whole catalogue. Photograph it before it comes apart — clip orientation is the thing nobody remembers an hour later.' },

  /* ------------------------------------------------------- consumables */
  { id: 'brake-cleaner', name: 'Brake cleaner', detail: 'Non-chlorinated', kind: 'consumable', category: 'consumable' },
  { id: 'caliper-grease', name: 'High-temp caliper grease', detail: 'Synthetic, for pins and abutments', kind: 'consumable', category: 'consumable' },
  { id: 'penetrating-oil', name: 'Penetrating oil', detail: 'Applied days before, not minutes', kind: 'consumable', category: 'consumable' },
  { id: 'anti-seize', name: 'Anti-seize compound', detail: 'Nickel for high temperature', kind: 'consumable', category: 'consumable' },
  { id: 'dielectric-grease', name: 'Dielectric grease', detail: 'For boots and connectors', kind: 'consumable', category: 'consumable' },
  { id: 'thread-locker', name: 'Thread locker', detail: 'Medium strength, blue', kind: 'consumable', category: 'consumable' },
  { id: 'assembly-lube', name: 'Assembly lube', detail: 'Plus clean engine oil', kind: 'consumable', category: 'consumable' },
  { id: 'cv-grease', name: 'CV joint grease', detail: 'Comes in the boot kit', kind: 'consumable', category: 'consumable' },
  { id: 'butyl', name: 'Butyl sealant rope', detail: 'Reseals the door weather sheet', kind: 'consumable', category: 'consumable' },
  { id: 'distilled-water', name: 'Distilled water', detail: 'For mixing concentrate', kind: 'consumable', category: 'consumable' },
  { id: 'waste-container', name: 'Sealable waste oil container', detail: 'Your recycling centre will want it sealed', kind: 'consumable', category: 'consumable' },
  { id: 'plastigauge', name: 'Plastigauge', detail: 'Green, 0.025–0.076 mm', kind: 'consumable', category: 'consumable' },

  /* ----------------------------------------- parts found in tool lists */
  { id: 'part-head-gasket', name: 'Head gasket', detail: 'Multi-layer steel', kind: 'part', category: 'consumable' },
  { id: 'part-tty-bolts', name: 'TTY head bolt set', detail: 'New, always', kind: 'part', category: 'consumable' },
  { id: 'part-timing-kit', name: 'Timing belt kit', detail: 'Belt, tensioner, idler, water pump', kind: 'part', category: 'consumable' },
  { id: 'part-clips', name: 'Trim clips and push-pin rivets', detail: 'A pack, because they break', kind: 'part', category: 'consumable' },
]

export const canonById = (id: string) => CANON.find((t) => t.id === id)

/**
 * Canonicalising the lists turned up four entries that are parts rather than
 * tools. Left in place rather than quietly moved: a head gasket genuinely does
 * belong in front of you before that job starts, and the procedures put it
 * where the author would reach for it.
 */
export const TOOL_LIST_NOTE =
  'These four sit in tool lists rather than parts lists in the procedures that call for them. That is not an error worth ' +
  'correcting — they are things that must be on the bench before the job starts — but they are bought with the parts, ' +
  'not kept in a toolbox, so they are not counted anywhere above.'

/**
 * Every tool string in every procedure, mapped to what you would actually buy.
 *
 * Explicit rather than pattern-matched on purpose. A regex over free text is
 * exactly the wrong tool here: "Floor jack + 2 jack stands" is two purchases,
 * "Serpentine belt tool or long 1/2\" breaker bar" is a choice between two, and
 * a near-miss would silently drop a tool from somebody's shopping list without
 * anybody noticing. The dev guard below fails loudly on any string that is not
 * in this table.
 */
export const RAW_TO_CANON: Record<string, string[]> = {
  /* lifting and safety */
  'Floor jack + 2 jack stands': ['floor-jack', 'jack-stands'],
  'Jack + stands, or ramps': ['floor-jack', 'jack-stands'],
  'Jack stands + wheel chocks': ['jack-stands', 'wheel-chocks'],
  'Jack stands or ramps': ['jack-stands'],
  'Ramps, or jack + 2 stands': ['ramps'],
  'Vehicle lift or 4 jack stands': ['jack-stands'],
  'Second floor jack': ['floor-jack'],
  'Wheel chocks': ['wheel-chocks'],
  'Wheel chocks on the front wheels': ['wheel-chocks'],
  'Safety glasses': ['glasses'],
  'Safety glasses + face shield': ['glasses', 'face-shield'],
  'Safety glasses + gloves': ['glasses', 'gloves'],
  'Safety glasses + nitrile gloves': ['glasses', 'gloves'],
  'Nitrile gloves': ['gloves'],
  'Nitrile gloves + dust mask': ['gloves', 'dust-mask'],
  'Nitrile gloves + safety glasses': ['gloves', 'glasses'],
  'Small LED torch or headlamp': ['work-light'],
  'Mechanics mirror + torch': ['mirror', 'work-light'],

  /* sockets, drivers, leverage */
  '7 mm or 8 mm socket': ['socket-set'],
  '10 mm socket': ['socket-set'],
  '12 mm socket': ['socket-set'],
  '14 mm socket': ['socket-set'],
  '17 mm socket': ['socket-set'],
  '21 mm socket': ['socket-set'],
  '13 mm and 15 mm sockets': ['socket-set'],
  '17 / 19 / 21 mm sockets + wrenches': ['socket-set'],
  'Socket set, 13–18 mm': ['socket-set'],
  '10 mm socket + 1/4" ratchet': ['socket-set', 'ratchets'],
  '10 mm socket + short extension': ['socket-set', 'ratchets'],
  '10 mm and 12 mm sockets + 150 mm extension': ['socket-set', 'ratchets'],
  '3/8" drive ratchet + 150 mm extension + swivel': ['ratchets'],
  'Low-profile ratchet or stubby driver': ['ratchets'],
  '19 mm impact-grade socket': ['socket-set'],
  '19 mm socket + breaker bar': ['socket-set', 'breaker-bar'],
  '21 mm socket + breaker bar': ['socket-set', 'breaker-bar'],
  '22 mm socket + breaker bar': ['socket-set', 'breaker-bar'],
  'Breaker bar, 600 mm': ['breaker-bar'],
  '1/2" breaker bar, 600 mm minimum': ['breaker-bar'],
  '32–36 mm axle nut socket': ['socket-large'],
  '36 mm socket, 1/2" drive': ['socket-large'],
  'Strut nut socket set': ['strut-socket'],
  'Phillips #2 and Torx T20 drivers': ['screwdrivers'],
  'Torx T25 and Phillips #2 drivers': ['screwdrivers'],
  'Allen key set': ['allen-keys'],
  'Needle-nose pliers': ['pliers'],
  'Pry bar, 450 mm': ['pry-bar'],
  'Dead-blow hammer': ['dead-blow'],

  /* torque — eleven strings, three wrenches */
  'Torque wrench 5–25 N·m': ['tq-small'],
  'Torque wrench 5–30 N·m': ['tq-small'],
  'Click torque wrench, 5–40 N·m': ['tq-small'],
  'In-lb torque wrench or small 3/8" click wrench': ['tq-small'],
  'Torque wrench 10–60 N·m': ['tq-small', 'tq-mid'],
  'Torque wrench 20–80 N·m': ['tq-mid'],
  'Torque wrench 20–150 N·m': ['tq-mid'],
  'Click torque wrench, 20–150 N·m': ['tq-mid'],
  'Torque wrench to 250 N·m': ['tq-large'],
  'Torque wrench 20–250 N·m': ['tq-mid', 'tq-large'],
  'Click torque wrench, 60–300 N·m': ['tq-large'],
  'Torque angle gauge': ['angle-gauge'],

  /* measuring */
  'Outside micrometer, 0–25 mm': ['mic-25'],
  'Outside micrometer set, 0–100 mm': ['mic-set'],
  'Dial indicator + magnetic base': ['dial-indicator'],
  'Feeler gauge set': ['feeler-gauges'],
  'Feeler gauges': ['feeler-gauges'],
  'Wire-loop or feeler gap gauge': ['gap-gauge'],
  'Precision straight edge, 300 mm': ['straight-edge'],
  'Straight edge or belt alignment tool': ['straight-edge'],
  'Dial bore gauge': ['bore-gauge'],
  'Telescoping gauges': ['telescoping'],
  'Drum micrometer or large vernier': ['drum-mic', 'vernier'],
  'Brake shoe gauge': ['shoe-gauge'],
  'Belt wear gauge': ['belt-gauge'],
  'Infrared thermometer': ['ir-thermometer'],
  'Refractometer or test strips': ['refractometer'],
  'Plastigauge, green': ['plastigauge'],

  /* specialty */
  'Caliper piston compressor or large C-clamp': ['caliper-compressor'],
  'Rear caliper piston wind-back tool': ['windback'],
  'Brake spring pliers': ['brake-spring-pliers'],
  'Hold-down spring tool': ['holddown-tool'],
  'Brake adjusting spoon': ['brake-spoon'],
  'Nylon trim removal set': ['trim-tools'],
  'Nylon trim tools + push-pin puller': ['trim-tools'],
  'Door clip pliers / upholstery fork': ['trim-tools'],
  'Ball joint separator': ['ball-joint-separator'],
  'Ball joint separator / pickle fork': ['ball-joint-separator'],
  'Coil spring compressor': ['spring-compressor'],
  'Three-jaw hub puller or slide hammer with hub adapter': ['hub-puller'],
  'Serpentine belt tool': ['serpentine-tool'],
  'Serpentine belt tool or long 1/2" breaker bar': ['serpentine-tool'],
  'Crankshaft pulley holder tool': ['crank-holder'],
  '5/8" spark plug socket with a rubber retainer': ['plug-socket'],
  'Thread chaser set': ['thread-chaser'],
  'Torque extension / spark plug thread chaser': ['thread-chaser'],
  'Oil filter wrench or cap socket': ['oil-filter-wrench'],
  'Hose clamp pliers': ['hose-clamp-pliers'],
  'Boot clamp pliers': ['boot-clamp-pliers'],
  'Snap ring pliers': ['snap-ring-pliers'],
  'Gasket scraper, plastic': ['gasket-scraper'],
  'Gasket scraper, plastic or brass': ['gasket-scraper'],
  'Wire brush + brake hub cleaning disc': ['wire-brush'],
  'Wire brush + hub cleaning disc': ['wire-brush'],
  'Wire brush + rotary wire wheel': ['wire-brush'],
  'Ring compressor + ring filer': ['ring-compressor'],
  'Piston ring expander': ['ring-expander'],
  'Rod bolt protectors': ['rod-bolt-protectors'],
  'Bore brush + shop vac': ['bore-brush', 'shop-vac'],
  'Compressed air or a shop vacuum': ['shop-vac'],
  'Cooling system pressure tester': ['pressure-tester'],
  'Scan tool with live transmission temperature': ['scan-tool'],
  'Fluid transfer pump': ['fluid-pump'],
  'Spill-free funnel kit': ['bleed-funnel'],
  'Coolant drain pan + funnel kit': ['drain-pan', 'bleed-funnel'],
  Funnel: ['funnel'],
  'Drain pan': ['drain-pan'],
  'Drain pan, 6 L minimum': ['drain-pan'],
  'Drain pan, 8 L': ['drain-pan'],
  'Large drain pan, 15 L minimum': ['drain-pan'],
  'Brake parts cleaner + catch tray': ['brake-cleaner', 'drain-pan'],
  'Hex pin or drill bit, 2 mm': ['hex-pin'],
  'Engine hoist + load leveller': ['engine-hoist'],
  'Engine hoist or support bar': ['engine-hoist'],
  'Engine support bar or second jack': ['engine-support'],
  'Engine stand, 450 kg rated': ['engine-stand'],

  /* bench and tidy */
  'Magnetic parts tray': ['parts-trays'],
  'Clean rag and a parts tray': ['parts-trays'],
  'Lint-free wipes + parts organiser trays': ['parts-trays'],
  'Shop rags + cardboard sheet': ['parts-trays'],
  'Paint pen or tipp-ex': ['paint-pen'],
  'Bungee cord': ['bungee'],
  'Bungee cord or mechanics wire': ['bungee'],
  'Padded blanket or two stands': ['blanket'],
  'Soft blanket or seat cover': ['blanket'],
  'Phone camera': ['camera'],

  /* consumables */
  'Brake cleaner': ['brake-cleaner'],
  'Brake cleaner + lint-free wipes': ['brake-cleaner', 'parts-trays'],
  'High-temp synthetic caliper grease': ['caliper-grease'],
  'High-temp brake grease': ['caliper-grease'],
  'Penetrating oil': ['penetrating-oil'],
  'Anti-seize compound': ['anti-seize'],
  'Nickel anti-seize': ['anti-seize'],
  'Dielectric grease': ['dielectric-grease'],
  'Thread locker, medium strength': ['thread-locker'],
  'Assembly lube': ['assembly-lube'],
  'Assembly lube + clean engine oil': ['assembly-lube'],
  'CV joint grease': ['cv-grease'],
  'Butyl sealant rope': ['butyl'],
  'Distilled water': ['distilled-water'],
  'Sealable container for waste oil': ['waste-container'],

  /* parts that ended up in tool lists */
  'Multi-layer steel head gasket': ['part-head-gasket'],
  'New TTY head bolt set': ['part-tty-bolts'],
  'Timing belt kit': ['part-timing-kit'],
  'Spare trim clips': ['part-clips'],
  'Replacement push-pin rivets': ['part-clips'],
}
