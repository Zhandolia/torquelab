import type { SystemId } from '../lib/types'

/**
 * The diagnostic bay.
 *
 * Every procedure in this platform answers "how do I do this job". None of them
 * answers the harder question, which is "is this the job". That is the half of
 * trade school that enthusiasts almost never get, and it is why so many home
 * repairs are a correct procedure performed on a part that was never faulty.
 *
 * A case is a complaint, then a sequence of decisions. Each decision costs
 * time, and some of them cost money for parts that were not the fault. You can
 * always reach the answer; what the case scores is how much you spent getting
 * there. The benchmark is the sum of the right moves, so a clean run is
 * possible and a guessed run is visibly expensive.
 */

export interface DiagOption {
  /** the move you make, in the first person */
  text: string
  /** the right next move at this point in the case */
  correct?: boolean
  /** minutes this costs whether it was right or not */
  costMin: number
  /** money spent on parts that turn out not to be the fault */
  costParts?: number
  /** what it taught you, or why it was the wrong move here */
  why: string
}

export interface DiagStage {
  id: string
  /** what you know going into this decision */
  context: string
  prompt: string
  /** parts highlighted in the viewer while this decision is open */
  focus?: string[]
  /** parts already off the vehicle at this point */
  hidden?: string[]
  explode?: number
  /** what the right move reveals */
  finding: string
  options: DiagOption[]
}

export interface DiagCase {
  id: string
  title: string
  /** the customer's own words, which are evidence and not a diagnosis */
  complaint: string
  vehicleId: string
  system: SystemId
  difficulty: 1 | 2 | 3 | 4 | 5
  assembly: string
  /** what you can observe before touching anything */
  observations: string[]
  stages: DiagStage[]
  verdict: {
    fault: string
    explain: string
    /** the procedure that actually fixes it */
    procedureId: string
  }
  lesson: string
}

/* ------------------------------------------------------------------ cases */

export const CASES: DiagCase[] = [
  /* ------------------------------------------------------------------- 1 */
  {
    id: 'pulsating-pedal',
    title: 'The shake under braking',
    complaint:
      '"The steering wheel shakes in my hands when I brake coming off the motorway. It is fine the rest of the time. I think the rotors are warped — can you just put new ones on?"',
    vehicleId: 'civic-2016',
    system: 'brakes',
    difficulty: 2,
    assembly: 'brakeFront',
    observations: [
      '2016 Civic, 92,000 km, front pads replaced by a quick-fit chain eight months ago',
      'No noise, no pulling, no warning lights',
      'Tyres are even across the tread and about half worn',
    ],
    stages: [
      {
        id: 'd1',
        context:
          'The customer has already told you the diagnosis. They are describing a real symptom and guessing at a cause, and those are two different things.',
        prompt: 'What is your first move?',
        focus: [],
        finding:
          'On the road test the shake arrives only under braking, from about 110 km/h, and it is through the steering wheel rather than the seat. Coasting at the same speed, the car is smooth.',
        options: [
          {
            text: 'Road test it and establish exactly when the shake appears',
            correct: true,
            costMin: 15,
            why:
              'Confirm the complaint in your own hands before you touch anything. Whether a vibration appears under braking or all the time, and whether you feel it in the wheel or the seat, narrows the fault to a system before you have opened a single fastener.',
          },
          {
            text: 'Order front rotors and pads — the customer has already described warped rotors',
            costMin: 0,
            costParts: 185,
            why:
              'You have bought parts on a customer’s diagnosis. Even if rotors are involved, fitting them without finding what ruined the last set means this car is back in eight months with the same complaint.',
          },
          {
            text: 'Put it on the lift and pull both front wheels off',
            costMin: 20,
            why:
              'Not wrong, exactly, but you skipped the free information. A corner that is apart tells you about condition; a road test tells you about behaviour, and behaviour is what the customer is complaining about.',
          },
          {
            text: 'Send it for four-wheel balancing',
            costMin: 30,
            costParts: 40,
            why:
              'Imbalance produces a vibration at a given road speed whether you are braking or not. The customer already told you it only happens under braking, which rules this out before you spend anything.',
          },
        ],
      },
      {
        id: 'd2',
        context:
          'Under braking only, felt in the steering wheel. That puts it in the front brakes rather than in the tyres, the driveshafts or the suspension.',
        prompt: 'How do you turn that into a measurement?',
        focus: ['rotor'],
        hidden: ['wheel', 'lugNuts'],
        explode: 0.1,
        finding:
          'Rotor thickness measured at eight points around the disc varies by 0.04 mm. The limit is 0.015 mm. The pads are at 6 mm and wearing evenly.',
        options: [
          {
            text: 'Micrometer the rotor at eight points around the disc and look for thickness variation',
            correct: true,
            costMin: 15,
            why:
              'This is the measurement that matches the symptom. A disc with thick and thin spots pushes the pads, and therefore the caliper and the steering, in and out once per revolution. That is what a "warped rotor" actually is.',
          },
          {
            text: 'Fit new rotors — thickness variation is what it will be',
            costMin: 30,
            costParts: 185,
            why:
              'You are probably right about the rotors and you still have not asked why. The answer matters, because the same cause will do the same thing to the new ones.',
          },
          {
            text: 'Check the tie rod ends and lower ball joints for play',
            costMin: 25,
            why:
              'Worn steering or suspension joints let a brake vibration feel worse, but they do not create a vibration that appears only under braking. Worth a look as part of a general inspection, not as the next diagnostic step.',
          },
          {
            text: 'Measure pad thickness and call it worn pads',
            costMin: 10,
            why:
              'Pad thickness tells you whether the car needs pads. It tells you nothing about a vibration — a brand new pad on a disc with thickness variation shakes exactly the same.',
          },
        ],
      },
      {
        id: 'd3',
        context:
          'The rotors are out of spec and need replacing. Fitting them is twenty minutes. The question is what put 0.04 mm of variation into a disc that was new eight months ago.',
        prompt: 'What do you check before the new rotors go on?',
        focus: ['hub', 'rotor'],
        hidden: ['wheel', 'lugNuts', 'caliper', 'guidePins', 'padInner', 'padOuter', 'shims'],
        explode: 0.45,
        finding:
          'Lateral runout with the old rotor mounted and lightly nipped up reads 0.12 mm. The hub face is carrying a ring of rust scale. Cleaned to bare metal, the same rotor reads 0.03 mm.',
        options: [
          {
            text: 'Dial-indicate lateral runout on the hub face, then clean it to bare metal and measure again',
            correct: true,
            costMin: 20,
            why:
              'This is the whole case. Scale on the hub face holds the disc at a slight angle; the high spot rubs the pads every revolution and wears itself into a thin spot. Runout becomes thickness variation becomes a pulsating pedal.',
          },
          {
            text: 'Fit the new rotors and road test',
            costMin: 25,
            why:
              'They will feel perfect for about five thousand miles, which is long enough that the customer will not connect the return visit to this one. The rust is still under the new disc.',
          },
          {
            text: 'Machine the old rotors on an on-car brake lathe',
            costMin: 45,
            why:
              'An on-car lathe actually does address runout, because it cuts a surface true to the hub as it sits. But these discs are already below the thickness you would want to cut into, and you still have not looked at the hub face.',
          },
          {
            text: 'Replace the wheel bearing, since runout comes from the hub',
            costMin: 40,
            costParts: 160,
            why:
              'A failed bearing can give you runout, but it also gives you play and noise, and this car has neither. Corrosion on the mounting face is enormously more common and costs nothing but a wire brush.',
          },
        ],
      },
    ],
    verdict: {
      fault: 'Corrosion on the hub mounting face, creating lateral runout that wore the rotors into thickness variation',
      explain:
        'The rotors do need replacing — they are out of spec. But they are the casualty, not the cause. The previous shop fitted pads and discs onto a hub face they never cleaned, and the new discs were out of true from the moment they were bolted on. Clean the face to bare metal, confirm assembled runout under 0.04 mm, and the fix lasts.',
      procedureId: 'civic-front-brakes',
    },
    lesson:
      'Almost nothing a customer calls a warped rotor is actually warped. Cast iron does not bend at brake temperatures; it wears. Find the runout, and then find what caused the runout.',
  },

  /* ------------------------------------------------------------------- 2 */
  {
    id: 'front-end-growl',
    title: 'The growl that changes with the corner',
    complaint:
      '"There is a humming from the front that starts about 60 and gets louder the faster I go. It goes quiet when I turn left. My mate says it is a wheel bearing."',
    vehicleId: 'silverado-2015',
    system: 'suspension',
    difficulty: 3,
    assembly: 'hubUnit',
    observations: [
      '2015 Silverado 1500, 148,000 km, four-wheel drive',
      'No ABS or traction lights, no codes reported by the customer',
      'Tyres are a matched set, 7 mm, no obvious cupping',
    ],
    stages: [
      {
        id: 'd1',
        context:
          'A hum that rises with road speed is a rotating-component noise. Tyres, bearings and driveline all qualify, and at 60 km/h they sound more alike than anyone admits.',
        prompt: 'Where do you start?',
        focus: [],
        finding:
          'On a steady left-hand sweep the noise drops away almost completely. On a right-hand sweep it is noticeably louder. Straight ahead it sits in the middle.',
        options: [
          {
            text: 'Road test with deliberate, gentle left and right sweeps at a steady speed',
            correct: true,
            costMin: 15,
            why:
              'Cornering transfers load onto the outside wheel. A bearing noise follows the load, so the direction that changes the noise tells you which side to look at. It costs one road test and it is the single most useful test in this fault.',
          },
          {
            text: 'Order a hub assembly for the side it seems to come from',
            costMin: 10,
            costParts: 190,
            why:
              'Noise inside a cab bounces off the firewall and the glass, and the side it appears to come from is wrong often enough that guessing is a coin flip with a 190 dollar stake.',
          },
          {
            text: 'Put it on the lift and spin both front wheels by hand',
            costMin: 15,
            why:
              'Worth doing, and it sometimes finds a bearing that is obviously rough. But a sealed hub that howls under 700 kg of vehicle load can feel perfectly smooth spun by hand with no load on it at all.',
          },
          {
            text: 'Fit a new pair of front tyres — cupped tyres make exactly this noise',
            costMin: 45,
            costParts: 420,
            why:
              'Cupped tyres genuinely do make this noise, and tyre roar is the most common misdiagnosis of a wheel bearing. But these tyres are not cupped, and you have not ruled anything in yet.',
          },
        ],
      },
      {
        id: 'd2',
        context:
          'The noise goes quiet turning left and loud turning right. Now work out what that means before you reach for a tool.',
        prompt: 'Which corner are you going to measure?',
        focus: ['hubUnit'],
        hidden: ['wheel', 'lugNuts'],
        finding:
          'The left front it is. Turning left unloads the left wheel and the noise goes away; turning right loads it up and the noise gets worse.',
        options: [
          {
            text: 'The left front — turning left unloads that wheel, and unloading it is what quietens the noise',
            correct: true,
            costMin: 5,
            why:
              'Load transfers to the outside of the corner. A left turn throws weight onto the right wheel and takes it off the left, so a noise that disappears in a left turn belongs to the wheel that just got lighter.',
          },
          {
            text: 'The right front — the noise is quietest when the right wheel is most loaded, so that is the one under strain',
            costMin: 30,
            why:
              'The logic is inverted. A loaded bearing is a noisier bearing, not a quieter one. Half an hour measuring a healthy corner.',
          },
          {
            text: 'Both fronts, since you cannot tell them apart from inside the cab',
            costMin: 45,
            why:
              'Thorough and expensive. The road test already told you which side; measuring both is time the customer pays for twice.',
          },
          {
            text: 'The front differential — directional noise means driveline',
            costMin: 50,
            why:
              'A differential noise changes with throttle and overrun rather than with steering load, and it does not switch sides when you corner.',
          },
        ],
      },
      {
        id: 'd3',
        context:
          'Left front. Now prove it, because "it sounds like a bearing" has bought a lot of hubs that did not need buying.',
        prompt: 'How do you confirm it before ordering the part?',
        focus: ['hubUnit', 'knuckle'],
        hidden: ['wheel', 'lugNuts', 'caliper', 'caliperBolts', 'pads', 'rotor'],
        explode: 0.2,
        finding:
          'A dial indicator on the knuckle with the tip against the hub flange reads 0.31 mm of play against a 0.13 mm limit, and the hub is rough through one point of each rotation.',
        options: [
          {
            text: 'Dial indicator on the knuckle, tip on the hub flange, and rock the wheel at 12 and 6',
            correct: true,
            costMin: 20,
            why:
              'A number against a published limit. This is what separates a repair you can defend from a part you guessed at, and it takes twenty minutes including setting the indicator up.',
          },
          {
            text: 'Grab the tyre at 12 and 6 and shake it',
            costMin: 10,
            why:
              'A quick screen that finds gross play, and plenty of failing bearings pass it. If you feel something you have learned something; if you feel nothing you have learned nothing.',
          },
          {
            text: 'Fit the hub — the road test was conclusive enough',
            costMin: 10,
            costParts: 190,
            why:
              'The road test was good evidence. It is not a measurement, and the hub bolts are seized into a knuckle you now have to open on a hunch.',
          },
          {
            text: 'Stethoscope on the knuckle while a helper drives it on the lift',
            costMin: 25,
            why:
              'Useful supporting evidence and it does localise noise well. It is still a noise test, and you already know the noise is there. You need the play figure.',
          },
        ],
      },
    ],
    verdict: {
      fault: 'Left front hub bearing assembly, 0.31 mm of flange play against a 0.13 mm limit',
      explain:
        'Confirmed two ways: the noise follows the load in the direction the geometry predicts, and the play exceeds the published limit by a factor of more than two. The hub is a sealed unit with nothing inside to adjust or repack, so it is replaced complete — and the ABS ring is moulded into its seal, which is why the speed sensor comes out of the way first.',
      procedureId: 'silverado-hub-bearing',
    },
    lesson:
      'The cornering test costs one road test and tells you which side. The dial indicator costs twenty minutes and tells you whether you are right. Between them they are cheaper than being wrong once.',
  },

  /* ------------------------------------------------------------------- 3 */
  {
    id: 'single-cylinder-misfire',
    title: 'The flashing light at idle',
    complaint:
      '"It shakes at idle and the engine light started flashing on the way here. It has been getting worse for a week. The plugs are due anyway — just do the plugs and coils, all of them."',
    vehicleId: 'mustang-gt-2018',
    system: 'maintenance',
    difficulty: 3,
    assembly: 'ignition',
    observations: [
      '2018 Mustang GT, 5.0 Coyote, 71,000 km',
      'A flashing check engine light means a misfire severe enough to damage the catalyst — this one should not be driven further than it has to be',
      'Idle is uneven with a regular stumble; it smooths out above about 2,000 rpm',
    ],
    stages: [
      {
        id: 'd1',
        context:
          'The customer has authorised a plug and coil set on all eight cylinders. That is about 600 dollars of parts, and it may well not fix anything.',
        prompt: 'What do you do first?',
        focus: [],
        finding:
          'P0306 is stored and pending. Misfire counters are climbing on cylinder 6 only; the other seven are at zero. Fuel trims are normal.',
        options: [
          {
            text: 'Scan it, read the stored and pending codes, and watch the per-cylinder misfire counters',
            correct: true,
            costMin: 10,
            why:
              'The engine has been counting misfires by cylinder for a week and will tell you which one for free. Ten minutes with a scan tool turns a vague complaint into a specific cylinder.',
          },
          {
            text: 'Fit eight plugs and eight coils as the customer asked',
            costMin: 90,
            costParts: 620,
            why:
              'The customer authorised it, so you are not going to get into trouble — but a single-cylinder misfire with a mechanical or sealing cause will still be there afterwards, and now it is your fault in their eyes.',
          },
          {
            text: 'Clean the mass airflow sensor',
            costMin: 20,
            costParts: 15,
            why:
              'A dirty MAF skews fuelling across every cylinder. It does not produce a single-cylinder stumble, and this engine idles unevenly rather than leanly.',
          },
          {
            text: 'Add injector cleaner and ask them to come back in a week',
            costMin: 10,
            costParts: 25,
            why:
              'A flashing misfire light means raw fuel is reaching the catalytic converter. Sending this car away for a week is how a 200 dollar repair becomes a catalytic converter.',
          },
        ],
      },
      {
        id: 'd2',
        context:
          'Cylinder 6, and only cylinder 6. The three usual families are ignition, fuel and mechanical, and you can separate them without buying anything.',
        prompt: 'What is the cheapest test that rules out a whole family?',
        focus: ['coils', 'coilConnectors'],
        hidden: ['engineCover'],
        explode: 0.3,
        finding:
          'Coils swapped between 6 and 5, codes cleared, engine run. The misfire stays on cylinder 6. It is not the coil.',
        options: [
          {
            text: 'Swap the number 6 coil with number 5, clear the codes and run it again',
            correct: true,
            costMin: 25,
            why:
              'The classic substitution test and it costs nothing but time. If the misfire follows the coil, you have found it. If it stays put, you have eliminated the coil with certainty rather than with an invoice.',
          },
          {
            text: 'Replace the number 6 coil',
            costMin: 20,
            costParts: 90,
            why:
              'Coils do fail and you might get lucky. But you have bought a part to perform a test you could have done by swapping two of them, and if the misfire remains you have learned the same thing for 90 dollars more.',
          },
          {
            text: 'Compression test cylinder 6',
            costMin: 50,
            why:
              'The right thought in the wrong order. Mechanical is the expensive family to rule out and the least likely here, so you test it after the cheap reversible ones, not before.',
          },
          {
            text: 'Replace the number 6 injector',
            costMin: 60,
            costParts: 150,
            why:
              'Direct injectors on this engine are not a casual swap, and nothing you have seen points at fuel. Normal trims argue against it.',
          },
        ],
      },
      {
        id: 'd3',
        context:
          'Not the coil. The misfire is specific to one cylinder and the engine is otherwise healthy. You still have not actually looked at anything.',
        prompt: 'What do you look at now?',
        focus: ['coils', 'camCover', 'coverGasket'],
        hidden: ['engineCover', 'coilConnectors'],
        explode: 0.45,
        finding:
          'The number 6 plug well is half full of engine oil. The coil boot is soft and swollen, and there are grey tracking lines running up the inside of it where the spark has been going to ground against the side of the well.',
        options: [
          {
            text: 'Pull the number 6 coil out and look down the plug well',
            correct: true,
            costMin: 15,
            why:
              'Ten minutes of looking. The plug well is a sealed pocket by design, so anything in it is a finding, and a boot that has been arcing to the side of the well shows it plainly.',
          },
          {
            text: 'Fuel pressure and injector balance test',
            costMin: 40,
            why:
              'A fine test on a car where fuel is implicated. Here the trims are normal and the fault is specific to one cylinder’s ignition path, which you have not finished examining.',
          },
          {
            text: 'Replace the number 6 spark plug and road test',
            costMin: 25,
            costParts: 25,
            why:
              'It may well run right for a few weeks, which is the worst possible outcome — the customer believes it is fixed and the cause is still filling the well.',
          },
          {
            text: 'Perform a cylinder leak-down test on number 6',
            costMin: 55,
            why:
              'Still the expensive family, and still unnecessary while a free visual inspection of the ignition path remains undone.',
          },
        ],
      },
    ],
    verdict: {
      fault: 'Oil in the number 6 plug well from failed camshaft cover gasket well seals, shorting the coil boot to ground',
      explain:
        'Oil gets past the well seals in the cam cover gasket, fills the pocket the plug sits in, softens the rubber boot and gives the spark an easier path to the side of the aluminium well than across the plug gap. The repair is a cam cover gasket and that one boot — and the plugs, since they are out and due. Fitting eight coils would have changed nothing.',
      procedureId: 'mustang-spark-plugs',
    },
    lesson:
      'Work outward from the cheapest reversible test. A coil swap costs twenty minutes and proves something; a parts cannon costs six hundred dollars and proves nothing.',
  },

  /* ------------------------------------------------------------------- 4 */
  {
    id: 'dragging-rear-brake',
    title: 'The hot wheel and the useless handbrake',
    complaint:
      '"There is a smell after I drive it and the handbrake barely holds on my drive now. I had the rear pads done at a garage about a year ago."',
    vehicleId: 'camry-2014',
    system: 'brakes',
    difficulty: 3,
    assembly: 'brakeRear',
    observations: [
      '2014 Camry, 134,000 km, rear discs with the parking brake built into the caliper',
      'No warning lights, pedal feels normal cold',
      'A faint hot smell in the wheel arch after a short drive',
    ],
    stages: [
      {
        id: 'd1',
        context:
          'Two symptoms that sound unrelated — a smell and a weak parking brake — on a car that had rear brake work a year ago. They are almost certainly one fault.',
        prompt: 'What is your first move?',
        focus: [],
        finding:
          'After a ten-minute drive the right rear wheel is far too hot to hold a hand near. The other three are barely warm. The right rear rotor has gone blue.',
        options: [
          {
            text: 'Drive it for ten minutes, then compare wheel and rotor temperature at all four corners',
            correct: true,
            costMin: 15,
            why:
              'A dragging brake makes heat, and heat is free to measure. One corner much hotter than the other three localises the fault to a wheel before you have taken anything apart.',
          },
          {
            text: 'Fit new rear pads and rotors',
            costMin: 70,
            costParts: 240,
            why:
              'The pads will be thin and the rotor will be cooked, so you will feel justified. Both are consequences. Whatever is dragging the brake will cook the new ones too.',
          },
          {
            text: 'Bleed the rear brakes',
            costMin: 40,
            why:
              'A sensible response to a soft pedal. The pedal is fine, and nothing about a weak parking brake is hydraulic — the parking brake on this car is a cable and a screw.',
          },
          {
            text: 'Tighten the parking brake cable adjuster under the console',
            costMin: 20,
            why:
              'The instinct everyone has, and it is the single most damaging thing you can do here. If a brake is already dragging, shortening the cable holds it on harder all the time.',
          },
        ],
      },
      {
        id: 'd2',
        context:
          'Right rear, dragging hard enough to blue a rotor. The hydraulic side and the parking brake side both act on the same piston, so you need to know which one is holding it on.',
        prompt: 'How do you tell a mechanical drag from a hydraulic one?',
        focus: ['pbLever', 'caliper', 'piston'],
        hidden: ['wheel', 'lugNuts'],
        explode: 0.25,
        finding:
          'With a helper applying and releasing the parking brake, the lever on the caliper swings over cleanly on application — and on release it stops about 4 mm short of its stop and sits there.',
        options: [
          {
            text: 'Wheel off, and watch the caliper parking brake lever while a helper applies and releases the handbrake',
            correct: true,
            costMin: 25,
            why:
              'Direct observation of the mechanism. The lever has a stop, and a lever that does not come back to it is holding the piston partly applied — that is a dragging brake with a cause you can see.',
          },
          {
            text: 'Crack the bleeder to see whether trapped pressure releases the brake',
            costMin: 20,
            why:
              'Exactly the right test for a dragging front brake with a collapsed hose or a sticking master cylinder. Here the mechanism holding the piston out is mechanical, so the brake will stay dragging with the bleeder wide open — which is itself informative, at the cost of a bleed.',
          },
          {
            text: 'Replace the caliper',
            costMin: 60,
            costParts: 210,
            why:
              'Calipers of this design do seize, and this one may be fine. You are replacing the part the problem is acting on rather than the part causing it.',
          },
          {
            text: 'Measure the rear pad thickness',
            costMin: 10,
            why:
              'It will be 2 mm on that corner and 6 mm on the other. That confirms the drag you already know about and does not tell you what is causing it.',
          },
        ],
      },
      {
        id: 'd3',
        context:
          'The lever is not returning. Either the lever pivot is seized in the caliper, or the cable that pulls it is not letting it come back.',
        prompt: 'How do you separate those two?',
        focus: ['pbCable', 'pbLever'],
        hidden: ['wheel', 'lugNuts'],
        explode: 0.35,
        finding:
          'With the cable end out of the clevis, the lever snaps back to its stop under its own spring and stays there. The inner cable will barely move in its conduit by hand, and the conduit end is full of rust.',
        options: [
          {
            text: 'Disconnect the cable at the clevis and see whether the lever returns on its own',
            correct: true,
            costMin: 15,
            why:
              'One connection, two minutes, and it splits the fault cleanly. A lever that snaps back once the cable is off was never the problem; a lever that still sits short is seized in the caliper.',
          },
          {
            text: 'Replace the caliper, since the lever is on it',
            costMin: 60,
            costParts: 210,
            why:
              'You still have not established that the caliper is at fault. A seized cable will hold a brand new caliper’s lever exactly as short as it held this one.',
          },
          {
            text: 'Work penetrating oil into the cable where it enters the conduit',
            costMin: 20,
            why:
              'Worth trying on a cable that is merely stiff, and it occasionally buys a year. A cable with water-driven corrosion through the length of its conduit does not come back, and a parking brake is not the system to gamble on.',
          },
          {
            text: 'Replace the rear flexible brake hose',
            costMin: 35,
            costParts: 45,
            why:
              'A collapsed hose traps hydraulic pressure and drags a brake, which is a genuine fault with these symptoms — but it does not stop a mechanical lever returning to its stop.',
          },
        ],
      },
    ],
    verdict: {
      fault: 'Seized right rear parking brake cable, holding the caliper lever off its stop and dragging the brake',
      explain:
        'A corroded inner cable cannot retract inside its conduit, so the caliper lever stays partly applied and the ballscrew holds the piston against the pads permanently. That is the heat, the smell and the blued rotor. The parking brake feels weak because the self-adjuster has already run out taking up wear that the drag itself created. The repair is the cable — plus the rotor and pads it destroyed.',
      procedureId: 'camry-rear-brakes',
    },
    lesson:
      'When a parking brake feels long, the instinct is to tighten the cable. Find out why it is long first: on a dragging brake, tightening the cable is the one adjustment that makes everything worse.',
  },

  /* ------------------------------------------------------------------- 5 */
  {
    id: 'air-lock-overheat',
    title: 'Hot in traffic, cold heater',
    complaint:
      '"I had the water pump done last month. Now it creeps up towards the red whenever I am sitting in traffic, and the heater blows cold. It is fine once I am moving."',
    vehicleId: 'camry-2014',
    system: 'cooling',
    difficulty: 2,
    assembly: 'coolingSystem',
    observations: [
      '2014 Camry, water pump and thermostat replaced by another shop four weeks ago',
      'Expansion tank sits on the COLD mark and does not move much',
      'Upper hose gets hot; the heater outlet stays cool at idle',
    ],
    stages: [
      {
        id: 'd1',
        context:
          'The symptom started after a cooling system was opened and refilled. That is not proof of anything, but it is the most useful fact you have.',
        prompt: 'Where do you look first?',
        focus: ['overflow', 'radCap', 'radiator'],
        finding:
          'Stone cold, the expansion tank reads full to the COLD mark. The radiator itself, with the cap off, is about two litres down — you can see the top of the core.',
        options: [
          {
            text: 'Take the cap off the radiator stone cold and check the level in the radiator itself, not the tank',
            correct: true,
            costMin: 10,
            why:
              'The expansion tank only tells you what the tank has. If the system cannot draw coolant back past an air pocket, the tank reads normal while the radiator is half empty. Checking the radiator directly takes a minute and settles it.',
          },
          {
            text: 'Replace the thermostat again',
            costMin: 60,
            costParts: 55,
            why:
              'A stuck thermostat overheats everywhere, not just in traffic, and it does not give you a cold heater while the upper hose is hot. You are replacing a part that was new four weeks ago.',
          },
          {
            text: 'Fit a new pressure cap',
            costMin: 10,
            costParts: 25,
            why:
              'Cheap, quick, and a weak cap really does cause overheating that looks like a thermostat. It does not explain a heater blowing cold, which is the symptom that points somewhere specific.',
          },
          {
            text: 'Pressure test the system for leaks',
            costMin: 30,
            why:
              'Good discipline and you will want to do it eventually. But you have a heater blowing cold on a system that was opened last month, and that combination deserves to be chased first.',
          },
        ],
      },
      {
        id: 'd2',
        context:
          'Tank full, radiator two litres down, heater cold, upper hose hot. Four facts that only fit together one way.',
        prompt: 'What are you looking at?',
        focus: ['bleeder', 'overflowHose', 'overflow'],
        finding:
          'Air trapped in the system. The heater core sits high in the circuit, so it is the first thing an air pocket starves, and a system with air in it cannot pull coolant back from the tank as it cools.',
        options: [
          {
            text: 'Air trapped in the system from the refill — the heater core is high in the circuit and gets starved first',
            correct: true,
            costMin: 5,
            why:
              'Every symptom fits. The pump cannot move air, the heater core is a high point so it holds the pocket, and a system full of air cannot draw coolant back from the tank, which is why the tank stays full while the radiator empties.',
          },
          {
            text: 'A failed head gasket pushing combustion gas into the cooling system',
            costMin: 40,
            why:
              'This produces exactly the same picture, and it is the thing you must rule out before you commit — a block test takes forty minutes. But a system that was opened four weeks ago has a far more likely explanation.',
          },
          {
            text: 'A blocked radiator core',
            costMin: 40,
            costParts: 380,
            why:
              'A blocked core overheats under load, where it needs its full capacity, rather than at idle where it needs the least. And it does not empty itself into an air pocket.',
          },
          {
            text: 'A failed water pump — the new one must be defective',
            costMin: 90,
            costParts: 170,
            why:
              'Possible but rare, and a pump that moves no coolant at all gives you a hot upper hose and nothing else moving. You have not yet done the one thing that would prove or disprove an air lock.',
          },
        ],
      },
      {
        id: 'd3',
        context:
          'You think it is air. Being right is worth nothing until the air is out, and "top it up and refit the cap" puts the pocket straight back into the heater core.',
        prompt: 'How do you actually get the air out?',
        focus: ['bleeder', 'tstatHousing', 'upperHose'],
        finding:
          'Front raised, cap off, bleed screw open, heater on full hot. Roughly a litre of air comes out of the bleed screw as the thermostat opens. The heater goes hot, the level drops twice more as it burps, and the temperature settles and stays there at idle.',
        options: [
          {
            text: 'Raise the front, open the bleed screw at the high point, heater on full, and run it up to temperature with the cap off',
            correct: true,
            costMin: 45,
            why:
              'The procedure exists because gravity does the work. Raising the front puts the filler above the rest of the circuit, the bleed screw releases the pocket the thermostat opening pushes along, and the heater on full keeps the core in the loop.',
          },
          {
            text: 'Top the radiator up to the neck, refit the cap and road test it',
            costMin: 15,
            why:
              'It will look fixed in the yard and be back by tomorrow. The air has not left the system; it has moved to the next high point, which is the heater core again.',
          },
          {
            text: 'Fit a vacuum filler to the open system and refill under vacuum',
            costMin: 35,
            why:
              'An excellent tool and a legitimate alternative that most shops now use. It is on the list because it works — if your bay has one, use it; the point is that the air must be removed deliberately rather than hoped away.',
          },
          {
            text: 'Replace the head gasket',
            costMin: 480,
            costParts: 1200,
            why:
              'The most expensive wrong answer in this entire bay, and it gets chosen in real shops on exactly this evidence. Rule out the free explanation before you quote the catastrophic one.',
          },
        ],
      },
    ],
    verdict: {
      fault: 'Air lock left in the cooling system by an incomplete refill after the water pump job',
      explain:
        'The previous shop did the mechanical work and filled the system from the radiator neck without bleeding it. A pump cannot circulate air, the heater core sits high enough to hold the pocket, and at road speed there is enough airflow through the radiator to hide the problem entirely. In traffic there is not. Bleed it properly and every symptom goes at once.',
      procedureId: 'camry-cooling-system',
    },
    lesson:
      'A cold heater on an overheating engine is one of the most specific symptoms in the trade: it means the coolant is not reaching the highest point of the circuit. That is air, or it is a level problem, long before it is a pump.',
  },

  /* ------------------------------------------------------------------- 6 */
  {
    id: 'cv-click-on-lock',
    title: 'The click on full lock',
    complaint:
      '"It makes a clicking noise when I am turning into a parking space. It has done it for about six months and it is getting louder."',
    vehicleId: 'civic-2016',
    system: 'driveline',
    difficulty: 2,
    assembly: 'cvAxle',
    observations: [
      '2016 Civic, 118,000 km, front wheel drive',
      'Only at low speed with the wheel at or near full lock, and only under power',
      'Nothing at all in a straight line, at any speed',
    ],
    stages: [
      {
        id: 'd1',
        context:
          'A rhythmic click that only appears at large steering angles under power is about as specific as a noise complaint ever gets. There is still a side to identify and a cause to find.',
        prompt: 'What is your first move?',
        focus: [],
        finding:
          'Slow tight circles both ways in an empty car park. On full left lock under power it clicks steadily in time with wheel rotation. On full right lock it is silent.',
        options: [
          {
            text: 'Drive slow tight circles both ways under light power and note which lock it clicks on',
            correct: true,
            costMin: 10,
            why:
              'Thirty seconds of driving in a car park narrows it to one side. The joint running at the greatest angle is the one that complains, and at full lock that is the outer joint on the outside of the turn.',
          },
          {
            text: 'Fit a pair of reconditioned driveshafts',
            costMin: 150,
            costParts: 390,
            why:
              'Two axles when you have not established that either of them is faulty, let alone both. These are the easiest noises in the trade to localise and you skipped the free step.',
          },
          {
            text: 'Check the front wheel bearings for play',
            costMin: 25,
            why:
              'A reasonable general check and part of any front-end inspection. But a bearing noise rises with road speed and is there in a straight line; this noise exists only at full lock under power.',
          },
          {
            text: 'Fit a new split-boot kit to whichever side looks worst',
            costMin: 70,
            costParts: 35,
            why:
              'A boot is the right thing to think about and the wrong thing to fit once a joint is already clicking. Once it clicks, the dirt has already done its work inside.',
          },
        ],
      },
      {
        id: 'd2',
        context:
          'Clicks on full left lock, silent on right. Now turn that into a side before you lift anything.',
        prompt: 'Which joint is the suspect?',
        focus: ['outerJoint'],
        finding:
          'The right front outer joint. On full left lock the right wheel is on the outside of the turn and its outer joint runs at the greatest articulation angle of the four.',
        options: [
          {
            text: 'The right front outer joint — on left lock the right wheel is outside the turn and its outer joint works at the greatest angle',
            correct: true,
            costMin: 5,
            why:
              'The outer joint on the outside of the turn takes the sharpest angle and the most torque at once. A worn Rzeppa joint clicks when it is asked to do both, which is why the noise is handed.',
          },
          {
            text: 'The left front outer joint — the noise comes from the side you are turning towards',
            costMin: 25,
            why:
              'Inverted. The inside wheel of a turn follows a tighter path but its outer joint sits at a smaller angle, and it is carrying less of the drive torque.',
          },
          {
            text: 'An inner tripod joint',
            costMin: 30,
            why:
              'Inner joints plunge rather than articulate, so they shudder under hard acceleration from rest rather than clicking on lock. Worth checking while you are there, not the suspect here.',
          },
          {
            text: 'The differential, since it only happens when the wheels turn at different speeds',
            costMin: 45,
            why:
              'A differential works hardest in a tight turn, so the logic is not silly — but a differential fault would not change with steering direction, and it would not be a per-revolution click at the wheel.',
          },
        ],
      },
      {
        id: 'd3',
        context:
          'You can order a right front axle now and you will probably be right. But a constant velocity joint that has been greased and sealed since the factory does not simply wear out at 118,000 km.',
        prompt: 'What do you check before you order anything?',
        focus: ['outerBoot', 'outerClamps', 'outerJoint'],
        hidden: [],
        explode: 0.3,
        finding:
          'The right outer boot has a circumferential split in the folds, and the inside of the wheel arch, the lower arm and the back of the brake shield are all sprayed with grease. The left boot is intact and clean.',
        options: [
          {
            text: 'Get the wheel off and inspect both boots and the inside of the arch for thrown grease',
            correct: true,
            costMin: 15,
            why:
              'The boot is the part that fails; the joint is the part that dies of it. Finding the split confirms the side, explains the failure, and tells you to check the other three boots before the same thing happens again.',
          },
          {
            text: 'Order the right front axle without looking',
            costMin: 10,
            costParts: 200,
            why:
              'Almost certainly the right part. You have still not confirmed the side with your eyes, and you have not looked at the other three boots — one of which may be a month from doing this.',
          },
          {
            text: 'Pack fresh grease into the joint through the split and fit a clamp',
            costMin: 40,
            costParts: 20,
            why:
              'Grit got in months ago and has been lapping the ball tracks ever since. Fresh grease does not undo wear, and the click is the evidence that the wear has already happened.',
          },
          {
            text: 'Replace both front axles while it is on the lift',
            costMin: 170,
            costParts: 400,
            why:
              'If the other boot were split you would have an argument. Check first — the left one here is intact, and the customer is paying 200 dollars for a part with nothing wrong with it.',
          },
        ],
      },
    ],
    verdict: {
      fault: 'Right front outer CV joint, worn out after a split boot let grit into it',
      explain:
        'The boot split, grease was thrown out and road grit was drawn in. From that point the joint was running dry on contaminated ball tracks, and the click is the end of a process that started months ago. Replace the axle, and inspect the remaining three boots while the car is up — the one that split tells you about the age of the rest.',
      procedureId: 'civic-cv-axle',
    },
    lesson:
      'Noises that change with steering direction hand themselves to you. The part worth finding is not which joint is clicking, but which rubber part failed and let it happen.',
  },
]

export const caseById = (id: string) => CASES.find((c) => c.id === id)

/** The benchmark: the time this case takes when every move is the right one. */
export const bookTime = (c: DiagCase) =>
  c.stages.reduce((n, s) => n + (s.options.find((o) => o.correct)?.costMin ?? 0), 0)

export const TOTAL_DECISIONS = CASES.reduce((n, c) => n + c.stages.length, 0)
