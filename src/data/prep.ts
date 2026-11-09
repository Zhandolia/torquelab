/**
 * Job planning data: the four questions a procedure cannot answer from its own
 * step list, and which decide whether somebody working on their own car in
 * their own driveway gets the car back.
 *
 * A shop never has to ask them. A shop has a second bay, a parts runner, a
 * lift the car can sit on for a week and somebody else's car to drive home in.
 * An enthusiast has one car, one Saturday and a driveway, so the questions that
 * matter before the first bolt moves are:
 *
 *   1. From which step can the car no longer move under its own power?
 *   2. Which step is the point of no return — where going back costs more
 *      than going forward?
 *   3. Can I stop halfway and come back tomorrow?
 *   4. What must already be in my hands before I start?
 *
 * Nothing here is derivable from the steps. The step list knows the order; only
 * a person who has done the job knows which step is the one you cannot undo.
 */

export type Resumable = 'yes' | 'risky' | 'no'

export const RESUME_LABEL: Record<Resumable, { label: string; tone: 'safe' | 'amber' | 'danger' }> = {
  yes: { label: 'Safe to leave overnight', tone: 'safe' },
  risky: { label: 'Only with precautions', tone: 'amber' },
  no: { label: 'Finish in one sitting', tone: 'danger' },
}

export interface Prep {
  procId: string
  /**
   * Step id from which the vehicle cannot move under its own power. null means
   * it either never stops being driveable, or was never driveable to begin with
   * because the work happens on a bench.
   */
  immobileFrom: string | null
  immobileNote: string
  /** The step where turning back costs more than finishing. */
  commitStep: string
  commitWhy: string
  resume: Resumable
  resumeWhy: string
  /** In your hands before you pick up a tool, or the job stalls. */
  nightBefore: string[]
  /** The one thing people try to substitute for, and what the substitute costs. */
  cannotImprovise: { tool: string; why: string }
}

export const PREP: Prep[] = [
  {
    procId: 'oil-and-filter',
    immobileFrom: 'o3',
    immobileNote:
      'From the moment the plug comes out the engine has no oil in it. The car can be pushed; it must not be started, not even for a second to move it.',
    commitStep: 'o3',
    commitWhy:
      'There is no putting the old oil back. Everything before this is inspection you can walk away from; after it, the car is going nowhere until you have the right oil, the right filter and a new crush washer in your hand.',
    resume: 'risky',
    resumeWhy:
      'A drained engine sits quite happily overnight. The danger is entirely human: somebody starts it. Put the keys in your pocket and a note on the wheel.',
    nightBefore: [
      'Check the filter part number against your engine, not just your model — the same car year often takes two different filters with different thread pitches',
      'Buy the crush washer with the filter. It is a 40-cent part and it is the only thing sealing the plug',
      'Have the full capacity of the correct grade on the shelf before you open the drain plug',
    ],
    cannotImprovise: {
      tool: 'A torque wrench that reads down to 39 N·m',
      why: 'The drain plug threads into an aluminium pan. At roughly twice spec the thread pulls out, and the repair is a new oil pan or a thread insert fitted with the pan still on the car. "Good and tight" is how that happens.',
    },
  },
  {
    procId: 'silverado-serpentine-belt',
    immobileFrom: 'b4',
    immobileNote:
      'With the belt off nothing drives the alternator, the water pump or the power steering pump. The engine will start and will overheat and lose charge within minutes.',
    commitStep: 'b4',
    commitWhy:
      'Releasing the tensioner and slipping the belt off is the whole commitment: the routing is now only in your photograph, and an old belt that has been off and flexed backwards should not go back on.',
    resume: 'yes',
    resumeWhy:
      'Nothing is draining, nothing is under tension and nothing is exposed. A truck with no belt can sit for a week as long as nobody starts it.',
    nightBefore: [
      'Photograph the routing from two angles and find the under-hood routing decal — most trucks have one, and it is the only diagram that is definitely right for your engine',
      'Compare the new belt to the old one on the ground: rib count and length, side by side, before the old one comes off',
      'Decide about the tensioner now. It comes off anyway in step 6 and it rarely outlasts two belts',
    ],
    cannotImprovise: {
      tool: 'A long serpentine belt tool or a breaker bar with the right drive',
      why: 'The tensioner needs real leverage at an awkward angle. With a short ratchet you cannot hold it open and route the belt at the same time, and a tensioner that snaps back onto your fingers is a genuine injury, not a pinch.',
    },
  },
  {
    procId: 'civic-door-panel',
    immobileFrom: null,
    immobileNote: 'The car drives throughout. Nothing you touch here affects whether it moves or stops.',
    commitStep: 'd3',
    commitWhy:
      'Releasing the perimeter clips is where things break. On a car more than about five years old a fair share of them snap, and a broken clip is a rattle and a panel edge that lifts — unfixable until the right replacement arrives.',
    resume: 'risky',
    resumeWhy:
      'You can stop, but not with the weather sheet peeled back. That sheet is what keeps rain out of the cabin, and without it the first shower puts water on the carpet and into the door speaker.',
    nightBefore: [
      'Buy a pack of the correct door clips before you start. Expect to break several, and the job cannot finish without them',
      'Have a roll of butyl or the correct sealant for the weather sheet — the old bead almost never reseals',
      'Clear somewhere clean and flat to lay the panel face-down; a driveway scratches it instantly',
    ],
    cannotImprovise: {
      tool: 'Nylon trim tools',
      why: 'A screwdriver dents the panel edge and marks the painted door frame behind it. Those marks are permanent and visible every time the door opens, which is the one place on a car you look at most.',
    },
  },
  {
    procId: 'civic-bumper-cover',
    immobileFrom: null,
    immobileNote:
      'The car stays driveable, but with the cover off the lights are unsupported and the crash structure is exposed. Treat it as off the road.',
    commitStep: 'x5',
    commitWhy:
      'The side tabs release in one direction only. Pulled the wrong way they snap, and a snapped tab leaves the cover sitting proud of the wing forever — the one defect everybody notices and nobody can hide.',
    resume: 'risky',
    resumeWhy:
      'The cover itself can sit for days. What cannot wait is the fastener inventory: thirty assorted screws, clips and bolts stop meaning anything if you leave them loose in a tray overnight.',
    nightBefore: [
      'Tape a piece of card to the bench and write the fastener positions on it as they come out — three different types look alike and only one is right in each hole',
      'Buy a clip assortment. Push-pin retainers in the arch liners are brittle and already broken on half of these cars',
      'Arrange a second pair of hands for the lift-off in step 6',
    ],
    cannotImprovise: {
      tool: 'A second person for the lift-off',
      why: 'The cover is light but long. Bending it to clear the arches single-handed cracks the paint along the wheel arch edge, which is exactly where everybody looks for accident damage.',
    },
  },
  {
    procId: 'mustang-spark-plugs',
    immobileFrom: 's7',
    immobileNote:
      'Plugs out means the engine cannot run, and each empty plug hole is an open path into a combustion chamber.',
    commitStep: 's7',
    commitWhy:
      'Removing the plugs is the irreversible step for a reason nobody expects: a plug that comes out with aluminium thread wrapped around it has turned a 90-minute service into a cylinder head thread repair with the head still on the car.',
    resume: 'no',
    resumeWhy:
      'Never leave a plug hole open. Anything that falls in lands on a piston crown or a valve, and moisture gets to work on a bare cylinder wall overnight. Do one bank, finish it, then start the other.',
    nightBefore: [
      'Buy the exact plug the engine calls for, pre-gapped. The wrong heat range runs beautifully for a week and then fouls or detonates',
      'Have a thread chaser and a spare coil boot. The boot that tears is always discovered with the engine half apart',
      'Let the engine go genuinely cold — overnight, not an hour. Pulling plugs from a warm aluminium head is how threads come with them',
    ],
    cannotImprovise: {
      tool: 'A torque wrench that reads accurately at 18 N·m',
      why: 'Eighteen newton-metres is barely more than firm finger pressure on a long bar. Most people land near 40 and pull the threads straight out of the aluminium head. A thread insert fitted in situ is the best case from there.',
    },
  },
  {
    procId: 'civic-front-brakes',
    immobileFrom: 's4',
    immobileNote:
      'With the caliper off that corner has no brake at all. The car must not be lowered onto its wheels, moved, or rolled out of the way until the brake is complete.',
    commitStep: 's8',
    commitWhy:
      'Getting the rotor off is where the job reveals its real size. A rotor rusted to the hub, a snapped retaining screw or a hub face that needs an hour of cleaning all show up here, and all of them have to be finished before the wheel goes back on.',
    resume: 'risky',
    resumeWhy:
      'On properly rated stands, with the caliper hung from a suspension link and never from its hose, this can sit overnight. What it must not do is touch the ground.',
    nightBefore: [
      'Soak the caliper bracket bolts and the rotor retaining screw with penetrating oil the day before. These are the fasteners that round off or snap',
      'Confirm the pad set matches your caliper, not just your model year — the same car ran two different caliper suppliers and the pads are not interchangeable',
      'Have the hardware kit. The clips and pin boots are consumables and the old ones are why brakes squeal',
    ],
    cannotImprovise: {
      tool: 'Two load-rated jack stands',
      why: 'A jack is a lifting device, not a holding device — a single seal is all that holds it up. You are about to pull hard on a breaker bar under that corner, sideways, with your arms under the car.',
    },
  },
  {
    procId: 'corolla-drum-brakes',
    immobileFrom: 'r2',
    immobileNote:
      'Drum off means no service brake and no parking brake at that wheel. On a rear drum car the parking brake lives inside the drum you just removed.',
    commitStep: 'r5',
    commitWhy:
      'Once the return springs are off, the shoes, struts and self-adjuster stop holding each other in any recognisable relationship. From that moment the only reliable guide back together is the other side of the car, still assembled.',
    resume: 'risky',
    resumeWhy:
      'This is exactly why step 1 insists on one side at a time. You may stop — but only with the opposite drum still intact, because it is your reference photograph.',
    nightBefore: [
      'Photograph the other side before you touch this one, or find the factory diagram. Springs go back in an order that is not guessable',
      'Buy the hardware kit. Return springs lose tension with heat and the hold-down pins wear; the kit costs less than a second attempt',
      'Have brake cleaner and a way to catch it. Drum dust is not to be blown out with air',
    ],
    cannotImprovise: {
      tool: 'Brake spring pliers',
      why: 'The upper return springs cannot be stretched by hand, and a screwdriver used as a lever lets go sideways. A loaded brake spring leaving a drum at eye height is why safety glasses are on the tool list.',
    },
  },
  {
    procId: 'camry-rear-brakes',
    immobileFrom: 's5',
    immobileNote:
      'The parking brake came off in step 4 and the service brake in step 5, so that corner has neither. The front wheels stay chocked for as long as that is true.',
    commitStep: 's8',
    commitWhy:
      'Winding the piston in is the step that decides whether this is a two-hour job or a new caliper. Press it with a clamp instead of rotating it and you drive the adjuster screw back through its own thread — and nothing goes back together until a caliper arrives.',
    resume: 'risky',
    resumeWhy:
      'It can sit on stands, but the chocks stay in. A car with the parking brake disconnected at one rear wheel and the other wheel off the ground has very little holding it.',
    nightBefore: [
      'Confirm you actually have a wind-back tool, not a C-clamp. This is the single most common way this job goes wrong',
      'Order rear-specific pads — they are smaller than the fronts and the front set will not fit',
      'Soak the 17 mm bracket bolts. They thread into the rear axle carrier and they corrode',
    ],
    cannotImprovise: {
      tool: 'A rear caliper piston wind-back tool',
      why: 'The piston rides on a ballscrew that the parking brake turns. It retracts by rotating and by nothing else. The C-clamp that worked on the front wrecks the adjuster, the seal, or both, and the symptom afterwards is a parking brake that never holds again.',
    },
  },
  {
    procId: 'camry-cooling-system',
    immobileFrom: 'c2',
    immobileNote:
      'An engine with no coolant in it must not be started. Not to move it, not to check something — a few minutes at idle with a dry block is enough to warp a head.',
    commitStep: 'c2',
    commitWhy:
      'Draining is the commitment. From there the car cannot run until the system is refilled and genuinely bled, and bleeding is step 7 for a reason: it is the hard part, not the afterthought.',
    resume: 'yes',
    resumeWhy:
      'A drained cooling system sits fine. Keep the cap off and a note on the wheel so nobody turns the key, and leave the drain open so the next person can see it is empty.',
    nightBefore: [
      'Buy the correct coolant type and enough of it — mixing chemistries turns coolant to sludge, and "universal" is not a specification',
      'If you bought concentrate, buy distilled water too. Tap water puts scale into a system you just cleaned',
      'Have the new thermostat gasket or O-ring in hand. The old one has taken a set and will not seal twice',
    ],
    cannotImprovise: {
      tool: 'A spill-free bleed funnel',
      why: 'This engine traps air at the highest point in the system, above the level of the filler. Squeezing hoses and revving it does not move that air out, and the trapped pocket is why people do this job twice.',
    },
  },
  {
    procId: 'silverado-trans-service',
    immobileFrom: 'a3',
    immobileNote:
      'With the pan down the transmission has no fluid. Starting the engine with a dry transmission destroys the pump and the clutches in seconds.',
    commitStep: 'a3',
    commitWhy:
      'Dropping the pan commits you to the whole level-setting procedure in step 8, because there is no dipstick on this transmission. The level is only correct inside a fluid temperature window, and you cannot shortcut your way back to it.',
    resume: 'yes',
    resumeWhy:
      'It can sit drained. But plan step 8 deliberately: it needs an uninterrupted idle, a way to read fluid temperature, and somewhere safe to run the engine.',
    nightBefore: [
      'Buy more fluid than the pan holds, in the exact specification. This transmission is damaged by the wrong friction modifier, and the wrong fluid is not a performance question',
      'Confirm you can read transmission fluid temperature — a scan tool that shows live data, or a gauge. Without it you cannot set the level at all',
      'Have the pan gasket and the filter together, and check whether yours uses a reusable pan gasket',
    ],
    cannotImprovise: {
      tool: 'A way to read transmission fluid temperature',
      why: 'There is no dipstick. The level is only meaningful inside a temperature window, so without a live reading you are guessing — and these transmissions are routinely overfilled to death by people who guessed.',
    },
  },
  {
    procId: 'civic-cv-axle',
    immobileFrom: 'v5',
    immobileNote:
      'Once the splined stub is out of the hub, that wheel has no drive. From step 6 the differential is also open and losing fluid.',
    commitStep: 'v6',
    commitWhy:
      'Popping the inner joint out of the transmission brings fluid with it and destroys the single-use retaining clip. The differential is now open to the shop, and the car is not going back together without a new clip and a fluid top-up.',
    resume: 'risky',
    resumeWhy:
      'Plug the open differential with the old axle stub or a proper cap — not a rag, which wicks dirt inwards and leaves fibres behind. Then it can wait.',
    nightBefore: [
      'Decide boot kit or complete axle before you start, not in step 7 with the axle in your hands. A boot kit is cheaper and takes three times as long',
      'Buy the new axle nut. It is a single-use staked or crimped nut and the old one does not hold 245 N·m twice',
      'Have transmission fluid to top up what comes out with the inner joint',
    ],
    cannotImprovise: {
      tool: 'The right axle nut socket and a long breaker bar',
      why: 'The nut went on at 245 N·m and comes off at more, with the wheel on the ground so the hub cannot turn. An undersized socket rounds a nut you then cannot remove at all, with the car already jacked up.',
    },
  },
  {
    procId: 'silverado-hub-bearing',
    immobileFrom: 's7',
    immobileNote:
      'With the axle shaft back out of the splines and the caliper off, that corner has neither drive nor brake.',
    commitStep: 's9',
    commitWhy:
      'Freeing the hub from its bore is the real test. The bore is now exposed, and how well you clean it in step 10 decides whether the new hub seats square or sits cocked and fails inside a year.',
    resume: 'risky',
    resumeWhy:
      'An open 4WD hub bore rusts fast, and rust in the bore is the thing you just spent an hour removing. Bag it and tape it if you have to stop.',
    nightBefore: [
      'Soak the three hub bolts from behind the knuckle with penetrating oil for a day or two. These are the bolts that shear off, and a sheared hub bolt is a drilling job on your back',
      'Buy the new axle nut, and check whether your hub comes with an integrated ABS sensor or takes a separate one',
      'Expect this to take far longer than the headline time. Every figure in this job assumes the bolts come out',
    ],
    cannotImprovise: {
      tool: 'Penetrating oil, time, and a long half-inch breaker bar',
      why: 'The three hub bolts seize into the knuckle. A short bar does not develop enough torque to break the corrosion, so it twists the bolt until it snaps instead — and drilling a sheared bolt out of a knuckle is a different job entirely.',
    },
  },
  {
    procId: 'civic-front-strut',
    immobileFrom: 'u4',
    immobileNote:
      'Separating the strut from the knuckle removes that corner’s suspension. The car is on stands until the assembly is rebuilt and back in.',
    commitStep: 'u6',
    commitWhy:
      'Compressing the spring is the point of no return in the most literal sense in this platform. From there the assembly holds enough stored energy to kill somebody, and it cannot be put down, parked or postponed in that state.',
    resume: 'no',
    resumeWhy:
      'Never leave a spring compressed in a clamp overnight. Clamps slip, threads gall and nobody remembers how far it was wound. Either finish the spring work in one sitting or back the compressor off completely first.',
    nightBefore: [
      'Hire or buy a proper spring compressor and inspect its threads and hooks before you trust it with your face',
      'Book the alignment for after the job. Step 10 is not optional — you have disturbed camber',
      'Loosen the top mount nuts in step 2 before you lift the car, while the suspension is still loaded',
    ],
    cannotImprovise: {
      tool: 'A proper spring compressor',
      why: 'A compressed coil spring stores several thousand joules. The two-hook parts-store clamps are the ones that let go, usually because the hooks walk round the coil as it shortens. There is no safe improvisation here and no second attempt.',
    },
  },
  {
    procId: 'camry-cylinder-head',
    immobileFrom: 'h2',
    immobileNote: 'Stripping to the head takes the intake and exhaust off. The engine is open from here.',
    commitStep: 'h3',
    commitWhy:
      'Head bolts on this engine are torque-to-yield: they are stretched past their yield point on purpose and they are single-use. Loosening them consumes them, so from this step the job needs a new bolt set before it can ever be finished.',
    resume: 'risky',
    resumeWhy:
      'An open engine must be covered — a bare deck rusts overnight and that rust ends up in the bearings. Oil the deck lightly, cover the bores, and keep the whole thing out of the weather.',
    nightBefore: [
      'Order the head bolt set with the gasket and confirm both are for your exact engine. The old bolts are scrap the moment they move',
      'Find a machine shop and its lead time before you start, in case step 6 condemns the head for flatness',
      'Have a proper straight edge and feeler gauges. You cannot judge a deck by eye and you cannot borrow this measurement from anyone',
    ],
    cannotImprovise: {
      tool: 'An angle gauge or a torque-angle wrench',
      why: 'Step 9 is 49 N·m, then 90 degrees, then 90 degrees again. Ninety degrees cannot be eyeballed on a bolt being deliberately stretched past yield — too little and the gasket leaks, too much and the bolt snaps in the block.',
    },
  },
  {
    procId: 'accord-timing-belt',
    immobileFrom: 't2',
    immobileNote:
      'The coolant is out and the accessory drive is off. On an interference engine the car is also one careless turn away from being a much bigger job.',
    commitStep: 't8',
    commitWhy:
      'With the belt off, the camshafts and the crankshaft are free to move independently of each other. This is an interference engine: a quarter turn of either one puts a valve into a piston, and the recovery for that is the cylinder head job two procedures down the list.',
    resume: 'risky',
    resumeWhy:
      'You may stop, with everything left at TDC and absolutely nothing turned. Tape a note across the steering wheel. The failure mode is somebody rotating the crank by hand to make room for a tool.',
    nightBefore: [
      'Buy the kit, not the belt. The water pump, tensioner and idler all come out anyway and none of them reliably outlasts a second belt interval',
      'Have the crankshaft pulley holding tool before you start. Step 4 is 245 N·m and it is step 4, not step 10',
      'Mark your own timing reference marks in step 6 with paint, in addition to the factory ones. Factory marks are easy to misread and paint is unambiguous',
    ],
    cannotImprovise: {
      tool: 'A crankshaft pulley holding tool',
      why: 'The crank bolt is at 245 N·m and the crank must be held against it. Bumping the starter to shock it loose and jamming a screwdriver in the flywheel teeth are the two popular methods; the first moves the engine out of time, the second breaks teeth off the flywheel.',
    },
  },
  {
    procId: 'mustang-bottom-end',
    immobileFrom: null,
    immobileNote:
      'Bench work. The engine is already out of the car, so there is no driveability to lose — which is exactly why this is the job to learn measurement on.',
    commitStep: 'b3',
    commitWhy:
      'From the moment the rods come out, every cap, rod, shell and piston only means something if your marks are right. Caps are machined in place and are not interchangeable between journals, and an unmarked pile of them cannot be sorted out later by inspection.',
    resume: 'yes',
    resumeWhy:
      'The one procedure here that genuinely waits for you — as long as everything stays bagged, labelled and oiled, and the block stays covered.',
    nightBefore: [
      'Get the bearing clearance specification for your exact journal size, including whether the crank has already been ground undersize',
      'Have both plastigauge and a bore gauge. Step 7 measures clearance two ways on purpose, because the two methods disagree in a way that teaches you something',
      'Clear and clean real bench space. This job is eighty per cent cleanliness and a dirty bench is the actual failure mode',
    ],
    cannotImprovise: {
      tool: 'A micrometer and a dial bore gauge',
      why: 'Here the measurement is the job. Plastigauge gives you a clearance but cannot tell you whether the journal is round, tapered or already undersize — and a crank that is out of round still shows a perfect clearance at the one spot you squashed the strip.',
    },
  },
]

export const prepFor = (procId: string) => PREP.find((p) => p.procId === procId)

/**
 * Three of these procedure ids were wrong when this file was first written,
 * because they were typed from memory rather than read from the procedure. A
 * wrong id fails silently: the sheet just renders without a planning panel and
 * nobody notices the most important section is missing.
 *
 * So the ids check themselves in development. `commitStep` and `immobileFrom`
 * point at step ids too, and those rot the same way whenever a procedure gains
 * or loses a step.
 */
if (import.meta.env.DEV) {
  // Imported lazily rather than at the top: a static import would make this
  // module depend on every procedure, and the procedures must not depend on
  // this one. The .then keeps the module synchronous.
  void import('./procedures').then(({ PROCEDURES }) => {
    const problems: string[] = []

    for (const prep of PREP) {
      const proc = PROCEDURES.find((p) => p.id === prep.procId)
      if (!proc) {
        problems.push(`PREP references unknown procedure "${prep.procId}"`)
        continue
      }
      const ids = new Set(proc.steps.map((s) => s.id))
      if (!ids.has(prep.commitStep))
        problems.push(`${prep.procId}: commitStep "${prep.commitStep}" is not one of its steps`)
      if (prep.immobileFrom && !ids.has(prep.immobileFrom))
        problems.push(`${prep.procId}: immobileFrom "${prep.immobileFrom}" is not one of its steps`)
    }

    for (const proc of PROCEDURES) {
      if (!PREP.some((p) => p.procId === proc.id))
        problems.push(`${proc.id}: no PREP entry, so its job sheet has no plan`)
    }

    if (problems.length) console.error(`[prep] ${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
    else console.info(`[prep] ${PREP.length} job plans check out against ${PROCEDURES.length} procedures`)
  })
}
