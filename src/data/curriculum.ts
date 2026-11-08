/**
 * The learning path.
 *
 * Four levels, ordered by consequence rather than by system: you start on jobs
 * where a mistake costs you an afternoon and finish on jobs where a mistake
 * costs a cylinder head. Each level ends in an exam that draws across its
 * procedures, because knowing a torque figure is not the same as knowing why
 * that fastener has that figure.
 */

export interface ExamOption {
  text: string
  correct?: boolean
  why: string
}

export interface ExamQuestion {
  id: string
  prompt: string
  /** which procedure this draws on, shown in the results breakdown */
  draws: string
  options: ExamOption[]
}

export interface Level {
  id: string
  index: number
  title: string
  subtitle: string
  ase: string
  accent: string
  outcome: string
  procedureIds: string[]
  passMark: number
  questions: ExamQuestion[]
}

export const LEVELS: Level[] = [
  /* ------------------------------------------------------------- level 1 */
  {
    id: 'foundations',
    index: 1,
    title: 'Shop Foundations',
    subtitle: 'Lifting, fasteners, fluids and the habits that keep you employed',
    ase: 'Pre-ASE / Shop readiness',
    accent: '#4ade80',
    outcome:
      'You can lift a car safely, tell a single-use fastener from a reusable one, read a torque spec and understand why it is that number, and take plastic trim off without breaking it.',
    procedureIds: ['oil-and-filter', 'silverado-serpentine-belt', 'civic-door-panel', 'civic-bumper-cover'],
    passMark: 75,
    questions: [
      {
        id: 'f1',
        draws: 'Front Disc Brake Service / Oil & Filter',
        prompt: 'When do wheel lug nuts get their final torque?',
        options: [
          {
            text: 'After the car is lowered and the tyre is carrying the vehicle weight',
            correct: true,
            why:
              'Loosen on the ground, lift, remove. Install, lower, torque. Torquing a wheel in the air lets the hub rotate and can pull the wheel off-centre against the hub face.',
          },
          {
            text: 'While the wheel is still off the ground, so nothing binds',
            why: 'The hub spins, so you cannot reach a true torque, and the wheel can seat crooked.',
          },
          {
            text: 'Before lifting, while the wheel is still on the ground',
            why: 'That is when you crack them loose, not when you set final torque.',
          },
          {
            text: 'It makes no difference as long as the pattern is correct',
            why: 'Pattern and load both matter. The pattern centres the wheel; the load lets you actually reach the spec.',
          },
        ],
      },
      {
        id: 'f2',
        draws: 'Oil & Filter Change',
        prompt:
          'An engine is refilled after an oil change, started, and dumps its entire sump on the floor in under a minute. What was almost certainly missed?',
        options: [
          {
            text: 'The old filter gasket stayed stuck to the mounting face, so the new filter sealed against two gaskets',
            correct: true,
            why:
              'The double-gasket failure. Two stacked gaskets cannot seat, and oil pressure forces the joint open. Running a finger round the mounting face takes three seconds and prevents it.',
          },
          {
            text: 'The drain plug was left loose',
            why: 'That leaks steadily and would be visible before starting, not a sudden total loss under pressure.',
          },
          {
            text: 'The wrong oil viscosity was used',
            why: 'Viscosity does not cause a joint to blow out.',
          },
          {
            text: 'The engine was overfilled',
            why: 'Overfilling aerates the oil and can push past seals, but it does not empty a sump in a minute.',
          },
        ],
      },
      {
        id: 'f3',
        draws: 'Oil & Filter Change',
        prompt: 'Which of these is a single-use part, every time, without exception?',
        options: [
          {
            text: 'The drain plug crush washer',
            correct: true,
            why:
              'It seals by permanently deforming into the gap. Once crushed it cannot do that again, and the usual response to the resulting seep — more torque — strips an aluminium pan.',
          },
          {
            text: 'A wheel lug nut',
            why: 'Reusable unless damaged or stretched. Inspect, do not automatically replace.',
          },
          {
            text: 'A worm-drive hose clamp',
            why: 'Reusable if the band and screw are sound.',
          },
          {
            text: 'A caliper guide pin bolt',
            why: 'Reusable on most designs. It is not a torque-to-yield or deforming fastener.',
          },
        ],
      },
      {
        id: 'f4',
        draws: 'Oil & Filter Change',
        prompt: 'Why use a torque wrench on a drain plug when it is "obviously" just a plug?',
        options: [
          {
            text: 'It threads into a soft aluminium pan, and over-torquing strips threads that cost a new pan or a repair insert',
            correct: true,
            why:
              'It is the single most over-tightened fastener on the car, in the softest material. 39 N·m is far less than it feels like it should be.',
          },
          {
            text: 'Because the plug itself will snap',
            why: 'The steel plug survives. The aluminium threads do not.',
          },
          {
            text: 'To stop the magnetic tip breaking off',
            why: 'Not a real failure mode.',
          },
          {
            text: 'Only needed if you reuse the crush washer',
            why: 'A new washer does not excuse guessing at the torque.',
          },
        ],
      },
      {
        id: 'f5',
        draws: 'Serpentine Belt & Tensioner',
        prompt:
          'A modern EPDM serpentine belt at 95,000 miles shows no visible cracks. How do you decide whether it is worn out?',
        options: [
          {
            text: 'Measure rib depth with a belt wear gauge — EPDM wears away gradually instead of cracking',
            correct: true,
            why:
              'The compound changed, so the old "four cracks per inch" rule misses worn-out belts entirely. A gauge that drops flush into the groove means the ribs are gone and the belt is slipping.',
          },
          {
            text: 'No cracks means serviceable — leave it',
            why: 'That rule belongs to older neoprene belts and does not transfer.',
          },
          {
            text: 'Check belt tension with a tension gauge',
            why: 'Tension is set by the automatic tensioner, so that tells you about the tensioner, not the belt.',
          },
          {
            text: 'Replace on mileage regardless of condition',
            why: 'Mileage is a prompt to measure, not a measurement.',
          },
        ],
      },
      {
        id: 'f6',
        draws: 'Serpentine Belt & Tensioner',
        prompt: 'A serpentine belt snaps on the motorway. What makes stopping urgent rather than merely inconvenient?',
        options: [
          {
            text: 'The water pump stops turning, so there is no coolant circulation and the engine overheats within a couple of miles',
            correct: true,
            why:
              'The battery will run the engine for a while and the steering just goes heavy. Loss of coolant circulation is what turns a breakdown into a cylinder head.',
          },
          {
            text: 'The alternator stops charging and the engine cuts out immediately',
            why: 'There is usually 20 minutes or more of battery. A problem, but not the urgent one.',
          },
          {
            text: 'Power steering loss makes the car undriveable',
            why: 'Heavy, not undriveable.',
          },
          {
            text: 'The A/C compressor seizes without belt tension',
            why: 'Without a belt the compressor simply stops being driven.',
          },
        ],
      },
      {
        id: 'f7',
        draws: 'Door Trim Panel Removal',
        prompt:
          'A trim clip along the bottom of a door panel will not release no matter how hard you lever. What is the right move?',
        options: [
          {
            text: 'Stop and find the fastener you missed — a screw still holding the panel will not let the clips release',
            correct: true,
            why:
              'Clips release with moderate force. Resistance that does not give means something threaded is still holding, usually in the grab pocket or under a trim plug.',
          },
          {
            text: 'Apply more force — clips are consumable and meant to break',
            why: 'The clip is replaceable; the panel boss it anchors to is not, and that is what breaks.',
          },
          {
            text: 'Switch to a flat-blade screwdriver for leverage',
            why: 'Gouges the trim, marks the paint, and still does not address the real cause.',
          },
          {
            text: 'Warm the panel with a heat gun to soften the clip',
            why: 'Heat deforms the trim surface. It is not a fastener-removal technique.',
          },
        ],
      },
      {
        id: 'f8',
        draws: 'Front Bumper Cover Removal',
        prompt:
          'Bumper cover screws are 2 N·m and the reinforcement bar bolts behind them are 74 N·m. What explains the gap?',
        options: [
          {
            text: 'The cover is cosmetic plastic that strips easily; the bar is a structural member bolted to the frame rails that carries crash loads',
            correct: true,
            why:
              'Load path sets the spec. A fastener\'s torque follows the job it is being asked to do — that principle is the whole point of this level.',
          },
          {
            text: 'The bar bolts are longer, so they need more torque',
            why: 'Length follows from the joint design rather than driving the spec.',
          },
          {
            text: 'The cover screws are self-tapping, so torque does not apply to them',
            why: 'They still have a spec — a low one, because the material is plastic.',
          },
          {
            text: 'The bar bolts are torque-to-yield',
            why: 'They are conventional fasteners. The difference is the load they carry.',
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------- level 2 */
  {
    id: 'brakes',
    index: 2,
    title: 'Brake Systems',
    subtitle: 'Friction, hydraulics, measurement and the two very different mechanisms',
    ase: 'ASE A5',
    accent: '#ffb000',
    outcome:
      'You can service a disc corner and a drum corner, measure everything that decides whether parts get replaced, and explain why a pulsating pedal is almost never "warped rotors".',
    procedureIds: ['civic-front-brakes', 'corolla-drum-brakes'],
    passMark: 75,
    questions: [
      {
        id: 'b1',
        draws: 'Front Disc Brake Service',
        prompt: 'Why does rust left on the hub mounting face cause a pulsating brake pedal a few thousand miles later?',
        options: [
          {
            text: 'It holds the rotor at a slight angle, so the disc wobbles and the pads wear it into thick and thin spots',
            correct: true,
            why:
              'Debris creates lateral runout; the high spot rubs each revolution and becomes thickness variation. That variation is what you feel. Nothing was ever "warped".',
          },
          {
            text: 'The rust transfers onto the pads and makes them grab unevenly',
            why: 'Contamination causes noise and poor bite, not a rhythmic pulsation tied to wheel speed.',
          },
          {
            text: 'It insulates the rotor so it cannot shed heat',
            why: 'Heat leaves through the friction faces and vanes, not the mounting face.',
          },
          {
            text: 'It causes the lug nuts to lose clamp load over time',
            why: 'Corrosion can cost some clamp load, but the pulsation comes from the geometry.',
          },
        ],
      },
      {
        id: 'b2',
        draws: 'Front Disc Brake Service',
        prompt:
          'On one caliper, the outer pad has 7 mm of friction material and the inner pad has 2 mm. What does that tell you?',
        options: [
          {
            text: 'The caliper is not sliding or releasing properly — diagnose it before fitting pads',
            correct: true,
            why:
              'Unequal wear across one caliper is a fault, not a tendency. New pads on a sticking caliper wear the same way within months.',
          },
          {
            text: 'Normal wear — the inner pad always wears faster on a sliding caliper',
            why: 'It does wear slightly faster, but a 5 mm difference is a seized slide pin or piston.',
          },
          {
            text: 'The rotor has excessive runout',
            why: 'Runout gives pedal pulsation, not a side-to-side thickness difference on one caliper.',
          },
          {
            text: 'The pads were installed in the wrong positions',
            why: 'Position affects the wear sensor, not the rate of wear.',
          },
        ],
      },
      {
        id: 'b3',
        draws: 'Front Disc Brake Service',
        prompt:
          'The caliper bracket bolts are 136 N·m and the guide pin bolts are 32 N·m on the same caliper. Why?',
        options: [
          {
            text: 'The bracket carries all the braking torque into the knuckle; the guide pins only let the caliper float on its pins',
            correct: true,
            why:
              'Load path again. Over-torquing a guide pin strips the pin or binds the slide, which causes exactly the uneven pad wear in the previous question.',
          },
          {
            text: 'The guide pin bolts are smaller in diameter, so the number is smaller',
            why: 'Diameter follows from the job. The job is what sets the spec.',
          },
          {
            text: 'Guide pin bolts get thread locker, which lowers the required torque',
            why: 'Thread locker is about retention, not a substitute for clamp load.',
          },
          {
            text: 'Bracket bolts are reused and guide pins are replaced',
            why: 'Neither is torque-to-yield here.',
          },
        ],
      },
      {
        id: 'b4',
        draws: 'Front Disc Brake Service',
        prompt: 'What is the correct way to retract a caliper piston before fitting new pads?',
        options: [
          {
            text: 'Open the master cylinder reservoir, then press the piston back slowly and squarely through an old pad',
            correct: true,
            why:
              'The fluid needs somewhere to go, pressing through a pad spreads the load off the dust boot, and going slowly avoids forcing debris back through the ABS unit.',
          },
          {
            text: 'Crack the bleeder screw and push the piston back so old fluid is expelled',
            why:
              'Some shops do it, but it lets air in and commits you to a full bleed. It is not the taught method.',
          },
          {
            text: 'Press directly on the dust boot with a C-clamp to spread the load',
            why: 'That tears the boot, which lets water into the bore and seizes the piston.',
          },
          {
            text: 'Push it back quickly so the seal does not have time to grip',
            why: 'Fast compression is exactly what forces contaminated fluid back toward the ABS modulator.',
          },
        ],
      },
      {
        id: 'b5',
        draws: 'Rear Drum Brake Service',
        prompt: 'A brake rotor is condemned on minimum thickness. What is a drum condemned on?',
        options: [
          {
            text: 'Maximum inside diameter — the friction surface is internal, so wear opens the bore rather than thinning a face',
            correct: true,
            why:
              'The shoes rub outward against the inner wall. Past the cast-in limit the drum is too thin to absorb heat and the shoes sit too far out to work properly.',
          },
          {
            text: 'Minimum wall thickness measured on the outside',
            why: 'Wall thickness is the underlying concern, but the published, measurable spec is inside diameter.',
          },
          {
            text: 'The same as a rotor — minimum thickness',
            why: 'That would mean measuring a surface you cannot reach, and it is not how the spec is given.',
          },
          {
            text: 'Maximum weight loss against a new drum',
            why: 'Nobody weighs brake drums.',
          },
        ],
      },
      {
        id: 'b6',
        draws: 'Rear Drum Brake Service',
        prompt:
          'Why does a drum brake of a given size out-grip a disc of the same size, and why does that matter for the parking brake?',
        options: [
          {
            text: 'Self-energising action — drum rotation drags the leading shoe harder into the drum, multiplying the applied force',
            correct: true,
            why:
              'The shoe wedges itself in. That mechanical advantage means a modest cable pull holds the car, which is why drums survive at the rear of economy cars.',
          },
          {
            text: 'The lining area is larger, so there is more friction',
            why: 'Friction force does not depend on contact area. The wedging action is the mechanism.',
          },
          {
            text: 'Drums run cooler, keeping the friction coefficient higher',
            why: 'Drums run hotter and fade sooner. That is their main weakness.',
          },
          {
            text: 'The wheel cylinder has a larger bore than a caliper piston',
            why: 'Bore size varies by design and is not what gives a drum its character.',
          },
        ],
      },
      {
        id: 'b7',
        draws: 'Rear Drum Brake Service',
        prompt: 'In what order do you remove drum brake components, and why does the order matter?',
        options: [
          {
            text: 'Upper return springs first — they load the whole assembly, and with them off everything else comes apart by hand',
            correct: true,
            why:
              'Taking the energy out first makes the rest trivial. Go the other way round and you are fighting loaded springs with a screwdriver, which is how people get hurt.',
          },
          {
            text: 'Hold-down pins first, so the shoes are free to move',
            why: 'Then the shoes flop about while still under full spring tension — harder and less safe.',
          },
          {
            text: 'The star adjuster first, to relieve shoe tension',
            why: 'Backing the adjuster off helps get the drum off, but it does not unload the return springs.',
          },
          {
            text: 'Order does not matter as long as everything comes off',
            why: 'It matters a great deal, for both speed and safety.',
          },
        ],
      },
      {
        id: 'b8',
        draws: 'Both brake procedures',
        prompt:
          'You have finished a brake job on all four corners. What must happen before the car is driven at all?',
        options: [
          {
            text: 'Pump the pedal until it is firm, then confirm fluid level and that the car actually stops at walking pace',
            correct: true,
            why:
              'Pistons are retracted and shoes are adjusted out; the first pedal application goes to the floor. This is the step that gets forgotten and causes a low-speed collision in the car park.',
          },
          {
            text: 'Bed the pads in with repeated hard stops from high speed',
            why: 'Bedding comes after you have confirmed the brakes work, and moderate stops, not hard ones.',
          },
          {
            text: 'Bleed the entire system as a matter of course',
            why: 'Only if the hydraulic system was opened.',
          },
          {
            text: 'Nothing — the brakes work as soon as the wheels are torqued',
            why: 'They do not. The pedal has to be pumped to take up the retracted clearance.',
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------- level 3 */
  {
    id: 'chassis',
    index: 3,
    title: 'Chassis & Driveline',
    subtitle: 'Stored energy, bearing preload and procedures with temperature windows',
    ase: 'ASE A2 / A3 / A4',
    accent: '#35e0c8',
    outcome:
      'You can handle a compressed coil spring without being injured by it, torque suspension fasteners so the bushings survive, diagnose a CV joint by its noise, and follow a fluid procedure that has a temperature spec rather than a dipstick.',
    procedureIds: ['civic-front-strut', 'civic-cv-axle', 'silverado-trans-service'],
    passMark: 75,
    questions: [
      {
        id: 'c1',
        draws: 'Front Strut & Spring Replacement',
        prompt:
          'A hook-type spring compressor is engaged on two coils per side and the spring is nearly free of its seat. What is wrong?',
        options: [
          {
            text: 'Two coils per side is not enough engagement — the hooks can roll out of the coil pitch and release the spring',
            correct: true,
            why:
              'More engaged coils spread the load and keep the hooks seated. Minimum four per side, square, or better still use a clamshell compressor and remove the problem.',
          },
          {
            text: 'Nothing — two coils is standard practice for a front strut',
            why: 'It is common practice and it is also how most spring compressor injuries happen.',
          },
          {
            text: 'The compressor should grip three points, not two',
            why: 'Opposing pairs are correct geometry. Coil engagement is the issue.',
          },
          {
            text: 'The spring should be compressed fully before the nut comes off',
            why: 'Over-compressing stores more energy for no benefit. Compress only until the spring is off its seats.',
          },
        ],
      },
      {
        id: 'c2',
        draws: 'Front Strut & Spring Replacement',
        prompt: 'Why are rubber-bushed suspension fasteners torqued with the suspension at ride height?',
        options: [
          {
            text: 'The rubber bonds to both sleeves, so whatever angle you torque it at becomes its zero-stress position',
            correct: true,
            why:
              'Torque it hanging and the bushing sits permanently pre-twisted at ride height. It wears out early and subtly changes how the suspension moves.',
          },
          {
            text: 'The bolt cannot reach full torque with the suspension unloaded',
            why: 'The fastener reaches torque either way. It is the rubber that remembers.',
          },
          {
            text: 'So that the wheel alignment is already correct before the car touches the ground',
            why: 'Alignment is set separately and is not what this rule protects.',
          },
          {
            text: 'To avoid cross-threading into the subframe',
            why: 'Thread engagement does not depend on suspension position.',
          },
        ],
      },
      {
        id: 'c3',
        draws: 'Front Strut & Spring Replacement',
        prompt: 'Why does replacing a front strut require a four-wheel alignment afterwards?',
        options: [
          {
            text: 'The strut is a structural suspension link that locates the top of the knuckle, so replacing it changes camber and often caster',
            correct: true,
            why:
              'A MacPherson strut is not just a damper. Skipping the alignment costs a set of tyres, which is far more than the alignment.',
          },
          {
            text: 'Because the spring will have settled to a different height',
            why: 'A new spring can change ride height slightly, but the geometry change comes from the strut itself.',
          },
          {
            text: 'Only if the camber bolts were slotted and moved',
            why: 'Even with fixed holes, disturbing the joint moves the geometry enough to matter.',
          },
          {
            text: 'It does not — alignment is only needed after steering work',
            why: 'Suspension geometry and steering geometry are the same geometry.',
          },
        ],
      },
      {
        id: 'c4',
        draws: 'CV Axle & Boot Replacement',
        prompt: 'A car clicks rhythmically on full lock at parking speeds but is silent in a straight line. Diagnosis?',
        options: [
          {
            text: 'A worn outer CV joint — the balls are loose in their tracks and knock as the joint articulates',
            correct: true,
            why:
              'Noise that appears with steering angle and tracks wheel speed is the textbook outer joint symptom, and it almost always follows a boot that split and lost its grease.',
          },
          {
            text: 'A worn inner tripod joint',
            why: 'Inner joints shudder under acceleration in a straight line; they do not click on lock.',
          },
          {
            text: 'A failing wheel bearing',
            why: 'Bearings hum or growl and change with cornering load; they do not give a discrete per-revolution click.',
          },
          {
            text: 'A loose brake caliper or heat shield',
            why: 'Those rattle over bumps or when braking, not with steering angle.',
          },
        ],
      },
      {
        id: 'c5',
        draws: 'CV Axle & Boot Replacement',
        prompt: 'Why is the axle nut both tightly specified and strictly single-use?',
        options: [
          {
            text: 'It sets wheel bearing preload and its locking collar deforms on first use, so both over- and under-torque destroy the bearing',
            correct: true,
            why:
              'One of the few fasteners where erring in either direction kills the same part. Loose, the bearing runs with play; over-tight, the preload crushes it.',
          },
          {
            text: 'It only stops the axle sliding out, so any torque above "tight" works',
            why: 'If that were true there would be no published spec.',
          },
          {
            text: 'It is torque-to-yield like a head bolt',
            why: 'It is single-use because of the locking feature, not because it is stretched past yield.',
          },
          {
            text: 'The high torque is needed to seat the splines',
            why: 'Splines seat with hand pressure. The clamp load is for the bearing.',
          },
        ],
      },
      {
        id: 'c6',
        draws: 'CV Axle & Boot Replacement',
        prompt: 'The splined stub is seized in the hub. What do you do?',
        options: [
          {
            text: 'Use a puller — hammering drives shock through the wheel bearing and brinells the races',
            correct: true,
            why:
              'You fix the axle and create a bearing noise that the customer brings back next month. The impact passes straight through the balls into the races.',
          },
          {
            text: 'Strike the end of the shaft with a steel hammer until it moves',
            why: 'Damages the threads and the bearing in one go.',
          },
          {
            text: 'Heat the hub with a torch until it releases',
            why: 'Destroys the bearing grease and seals, and risks the ABS tone ring.',
          },
          {
            text: 'Lever against the CV boot with a pry bar',
            why: 'That tears the boot you may have been trying to save and achieves nothing.',
          },
        ],
      },
      {
        id: 'c7',
        draws: 'Automatic Transmission Fluid & Filter',
        prompt:
          'After a filter change the transmission shifts normally cold but slips badly once warm. First thing to suspect?',
        options: [
          {
            text: 'The old filter neck seal was left in the case, so the new filter is not sealing and the pump is drawing air',
            correct: true,
            why:
              'Two stacked seals cannot seal. It shows up hot because the fluid is thinner and entrains air more readily — the classic signature of this mistake.',
          },
          {
            text: 'Wrong fluid type',
            why: 'Possible in general, but the cold-good / hot-bad pattern straight after a filter change points at the seal.',
          },
          {
            text: 'Pan bolts over-torqued',
            why: 'That causes a leak at the gasket, not a slip.',
          },
          {
            text: 'The transmission needs an adaptive relearn',
            why: 'Relearn changes shift feel, not hydraulic capacity.',
          },
        ],
      },
      {
        id: 'c8',
        draws: 'Automatic Transmission Fluid & Filter',
        prompt: 'Why is the fluid level on a modern automatic specified within a temperature window?',
        options: [
          {
            text: 'Fluid volume changes significantly with temperature, so a level is only meaningful at a stated temperature',
            correct: true,
            why:
              'The standpipe height is designed around a specific fluid temperature. Set it cold and the same quantity is overfull once hot, which whips the fluid into foam.',
          },
          {
            text: 'The fluid must be hot enough to flow through the filter',
            why: 'ATF flows fine cold. The issue is thermal expansion.',
          },
          {
            text: 'So the torque converter has time to fill completely',
            why: 'Converter fill matters to the procedure but is not why the window exists.',
          },
          {
            text: 'Because the scan tool cannot read level below 35 °C',
            why: 'The scan tool reports temperature; it does not measure level at all.',
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------- level 4 */
  {
    id: 'engine',
    index: 4,
    title: 'Engine Mechanical',
    subtitle: 'Torque-to-yield, valve timing, clearance measurement and zero margin for error',
    ase: 'ASE A1',
    accent: '#ff4d4d',
    outcome:
      'You can set valve timing on an interference engine and verify it by hand, carry out a torque-plus-angle sequence with the right fasteners in the right order, measure bearing clearance two ways, and bleed a cooling system so the engine survives the first drive.',
    procedureIds: [
      'camry-cooling-system',
      'accord-timing-belt',
      'camry-cylinder-head',
      'mustang-bottom-end',
    ],
    passMark: 80,
    questions: [
      {
        id: 'e1',
        draws: 'Cylinder Head Removal & Torque Sequence',
        prompt: 'Why can a torque-to-yield head bolt never be reused, even if it looks perfect?',
        options: [
          {
            text: 'It was deliberately stretched past its elastic limit, so the stretch that produces clamp load has already been used',
            correct: true,
            why:
              'The design relies on permanent deformation for consistent clamp load across every bolt. A second use starts from a yielded bolt, so it reaches lower clamp load or snaps.',
          },
          {
            text: 'The threads work-harden and will gall the block',
            why: 'Thread condition is a side issue. The reason is the bolt body.',
          },
          {
            text: 'The friction coating wears off, changing the torque reading',
            why: 'Coating affects the stage-one reading, but the angle stages set clamp load, and the bolt has already yielded.',
          },
          {
            text: 'They are only single-use on diesel engines',
            why: 'TTY fasteners are single-use wherever they are used.',
          },
        ],
      },
      {
        id: 'e2',
        draws: 'Cylinder Head Removal & Torque Sequence',
        prompt: 'Why does the head bolt tightening sequence start at the centre and spiral outward?',
        options: [
          {
            text: 'It crushes the gasket progressively from the middle out, so the crush is even and nothing is pinched or squeezed out',
            correct: true,
            why:
              'Starting at one end rolls the gasket and the head, leaving uneven crush and a leak path. The loosening sequence is the reverse for the same reason.',
          },
          {
            text: 'The centre bolts are longer and need torque first',
            why: 'Bolt length does not drive the sequence.',
          },
          {
            text: 'It keeps the camshafts from binding in their journals',
            why: 'Cam bearing caps have their own sequence for that reason. This is about the gasket joint.',
          },
          {
            text: 'The sequence only matters on the final pass',
            why: 'Every pass follows the sequence; the first is where crush is established.',
          },
        ],
      },
      {
        id: 'e3',
        draws: 'Cylinder Head Removal & Torque Sequence',
        prompt: 'Coolant is sitting in two head bolt holes. Why does that have to be removed before assembly?',
        options: [
          {
            text: 'Trapped liquid cannot compress, so the bolt reads full torque before it has actually stretched — and the boss can crack',
            correct: true,
            why:
              'The hydraulic effect gives a false reading, so that bolt never reaches its intended clamp load. Vacuum and blow out every hole.',
          },
          {
            text: 'It will boil and blow the gasket on first start',
            why: 'A small amount of coolant does not blow a gasket. The problem is the torque reading.',
          },
          {
            text: 'It corrodes the threads over time',
            why: 'Long-term corrosion is real but not the immediate assembly problem.',
          },
          {
            text: 'It dilutes the thread locker',
            why: 'Head bolts are not installed with thread locker.',
          },
        ],
      },
      {
        id: 'e4',
        draws: 'Timing Belt & Water Pump',
        prompt: 'What does it mean that an engine is an "interference" design?',
        options: [
          {
            text: 'At some crank angles the valves occupy space the piston will later pass through, so losing valve timing bends valves',
            correct: true,
            why:
              'The belt or chain is the only thing keeping those two events apart. There is no limp-home failure mode — it is fine, then it is a cylinder head.',
          },
          {
            text: 'The intake and exhaust valves can contact each other at high lift',
            why: 'Valves do not contact each other; the clash is valve to piston.',
          },
          {
            text: 'The engine suffers from electrical interference affecting the timing sensors',
            why: 'Unrelated to the mechanical term.',
          },
          {
            text: 'The timing belt interferes with the accessory drive and must be routed carefully',
            why: 'Different systems entirely.',
          },
        ],
      },
      {
        id: 'e5',
        draws: 'Timing Belt & Water Pump',
        prompt:
          'The crank pulley mark is on the pointer but both cam marks sit 180° from their index marks. What is going on?',
        options: [
          {
            text: 'The crank is at TDC on the wrong stroke — rotate it one more full turn clockwise',
            correct: true,
            why:
              'The crank turns twice per camshaft revolution, so cylinder 1 reaches TDC twice per cycle. Only the cam marks tell you which one you are on.',
          },
          {
            text: 'The belt has already jumped two teeth and the engine is damaged',
            why: 'A jumped belt shows as a small offset. 180° is the signature of the wrong stroke.',
          },
          {
            text: 'The cam sprockets were installed 180° out',
            why: 'They are keyed and cannot be fitted that way on their own.',
          },
          {
            text: 'Nothing — cam marks only matter once the belt is off',
            why: 'They are the only way to tell compression TDC from exhaust TDC.',
          },
        ],
      },
      {
        id: 'e6',
        draws: 'Timing Belt & Water Pump',
        prompt: 'The water pump is not leaking and spins freely. Why does the procedure still replace it?',
        options: [
          {
            text: 'It is driven by the timing belt, so a seized bearing destroys valve timing — and the access cost is this entire job',
            correct: true,
            why:
              'Shared failure mode plus access cost. Replacing it is risk management, not upselling.',
          },
          {
            text: 'The old pump will contaminate the new coolant',
            why: 'A clean, working pump does not contaminate coolant.',
          },
          {
            text: 'Impellers are a mileage-based wear item',
            why: 'Erosion happens, but it is not why the pump is in a timing belt kit.',
          },
          {
            text: 'The new belt will not tension correctly against an old pump sprocket',
            why: 'Tension is set by the tensioner.',
          },
        ],
      },
      {
        id: 'e7',
        draws: 'Thermostat & Cooling System Service',
        prompt: 'Why must the thermostat\'s wax element face the engine rather than the radiator?',
        options: [
          {
            text: 'It has to sense the temperature of coolant leaving the engine, which is what it is regulating',
            correct: true,
            why:
              'Reversed, it sits in cooler radiator-side coolant and opens late or not at all, so the engine overheats while the thermostat thinks all is well.',
          },
          {
            text: 'The spring only functions in that orientation',
            why: 'The spring returns the valve either way. Sensing position is what matters.',
          },
          {
            text: 'So the jiggle pin points downward and can drain',
            why: 'The jiggle pin goes up, to let air out — a separate consideration.',
          },
          {
            text: 'It does not matter; thermostats are symmetrical',
            why: 'They are not, and backwards installation is a common cause of unexplained overheating.',
          },
        ],
      },
      {
        id: 'e8',
        draws: 'Thermostat & Cooling System Service',
        prompt:
          'A freshly refilled car overheats on the first drive. The upper hose is cool and the gauge is climbing fast. What is happening?',
        options: [
          {
            text: 'Coolant is not reaching the radiator — trapped air or a stuck-closed thermostat. Shut it down immediately',
            correct: true,
            why:
              'A cool upper hose with a rising gauge means no flow to the radiator. Keep driving and you warp the head. Stop, cool completely, re-bleed.',
          },
          {
            text: 'The radiator is internally blocked',
            why: 'A blocked radiator still gives a hot upper hose, because coolant reaches it and then cannot pass through.',
          },
          {
            text: 'The cooling fans are not running',
            why: 'Fan failure overheats in traffic, but the upper hose would be hot because coolant is circulating.',
          },
          {
            text: 'The coolant mix is too strong',
            why: 'An over-strong mix reduces heat transfer slightly but does not stop flow.',
          },
        ],
      },
      {
        id: 'e9',
        draws: 'Rotating Assembly Teardown',
        prompt: 'Why does bearing clearance that is too tight fail faster than clearance that is too loose?',
        options: [
          {
            text: 'The oil film needs a minimum gap to form — below it there is metal-to-metal contact and the bearing wipes almost immediately',
            correct: true,
            why:
              'A hydrodynamic bearing floats on a wedge of oil. Too little clearance and that film cannot establish, so you get contact, heat and a wiped bearing in minutes. Too loose gives low pressure and a knock, which is slow by comparison.',
          },
          {
            text: 'Tight clearance raises oil pressure past the relief valve setting',
            why: 'Pressure may rise slightly, but the failure is loss of the oil film.',
          },
          {
            text: 'Tight clearance makes the engine harder to turn and overloads the starter',
            why: 'Drag goes up, but that is a symptom, not the mechanism.',
          },
          {
            text: 'Loose clearance never actually fails',
            why: 'It does, through low pressure, impact loading and knock. It is just slower.',
          },
        ],
      },
      {
        id: 'e10',
        draws: 'Rotating Assembly Teardown',
        prompt: 'You are checking main bearing clearance with Plastigauge. What must you not do?',
        options: [
          {
            text: 'Rotate the crankshaft with the gauging material installed',
            correct: true,
            why:
              'Rotation smears the strip and the width reading becomes meaningless. Torque the cap to full spec, remove it, read the width, and do not turn the crank in between.',
          },
          {
            text: 'Torque the cap to full specification',
            why: 'Full torque is exactly what you must do — the reading is only valid under real clamp load.',
          },
          {
            text: 'Place the strip across the journal rather than along it',
            why: 'Across the journal is correct.',
          },
          {
            text: 'Clean and dry the journal before laying the strip',
            why: 'Dry and clean is correct; oil would distort the crush.',
          },
        ],
      },
    ],
  },
]

export const levelById = (id: string) => LEVELS.find((l) => l.id === id)

/** Which level a given procedure belongs to, if any. */
export const levelForProcedure = (procId: string) =>
  LEVELS.find((l) => l.procedureIds.includes(procId))

export const TOTAL_EXAM_QUESTIONS = LEVELS.reduce((n, l) => n + l.questions.length, 0)
