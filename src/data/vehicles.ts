import type { Vehicle } from '../lib/types'

/**
 * Fleet selection rationale
 * ─────────────────────────
 * These five vehicles mirror the platforms used in manufacturer-specific
 * advanced training (Honda PACT, Ford FACT, GM ASEP, Toyota T-TEN) that runs
 * alongside the core automotive program at schools like UTI's Dallas/Irving
 * campus. Each one was chosen because it isolates a teaching concept cleanly:
 * transverse FWD, longitudinal RWD V8, body-on-frame 4WD truck, a true
 * timing-BELT interference engine, and the highest-volume sedan in the US.
 */
export const VEHICLES: Vehicle[] = [
  {
    id: 'civic-2016',
    year: 2016,
    make: 'Honda',
    model: 'Civic',
    trim: 'LX Sedan',
    nickname: 'The Trainer',
    accent: '#e0484d',
    drivetrain: 'FWD',
    engine: {
      code: 'R18Z1',
      displacement: '1.8 L (1799 cc)',
      config: 'Inline-4, transverse',
      power: '143 hp @ 6500 rpm',
      valvetrain: 'SOHC 16v, i-VTEC',
      timing: 'chain',
      interference: true,
    },
    transmissions: ['CVT', '5-speed manual'],
    program: 'Honda PACT',
    whyTaught:
      'The default teaching car. Transverse FWD layout, MacPherson front struts, four-wheel disc brakes, and enough room in the wheel well that a first-year student can actually see what they are doing. Nothing on it requires a specialty tool you will not already own.',
    quickSpecs: [
      { label: 'Lug nut torque', value: '108 N·m / 80 ft-lb' },
      { label: 'Oil capacity', value: '3.9 qt w/ filter' },
      { label: 'Oil spec', value: '0W-20 full synthetic' },
      { label: 'Front rotor', value: '282 mm vented' },
      { label: 'Wheel', value: '16 × 7 / 215-55R16' },
      { label: 'Front suspension', value: 'MacPherson strut' },
      { label: 'Rear suspension', value: 'Multi-link' },
      { label: 'Brake fluid', value: 'DOT 3' },
    ],
  },
  {
    id: 'accord-v6-2009',
    year: 2009,
    make: 'Honda',
    model: 'Accord',
    trim: 'EX-L V6',
    nickname: 'The Belt Car',
    accent: '#3f7fd4',
    drivetrain: 'FWD',
    engine: {
      code: 'J35Z2',
      displacement: '3.5 L (3471 cc)',
      config: 'V6, 60°, transverse',
      power: '271 hp @ 6200 rpm',
      valvetrain: 'SOHC 24v, VCM',
      timing: 'belt',
      interference: true,
    },
    transmissions: ['5-speed automatic'],
    program: 'Honda PACT',
    whyTaught:
      'Almost every current engine runs a chain, which means students graduate having never set valve timing on a belt. This J-series V6 is the canonical belt job: interference engine, two cam sprockets, a spring-loaded tensioner, and a water pump that lives behind the belt. Get it wrong by one tooth and you bend valves — which is exactly why it is worth practising in 3D first.',
    quickSpecs: [
      { label: 'Lug nut torque', value: '108 N·m / 80 ft-lb' },
      { label: 'Timing belt interval', value: '105k mi / 7 yr' },
      { label: 'Crank pulley bolt', value: '245 N·m / 181 ft-lb' },
      { label: 'Interference engine', value: 'Yes — belt failure bends valves' },
      { label: 'Coolant', value: 'Honda Type 2 blue' },
      { label: 'Oil capacity', value: '4.5 qt w/ filter' },
      { label: 'Firing order', value: '1-4-2-5-3-6' },
      { label: 'Belt teeth', value: '~148' },
    ],
  },
  {
    id: 'mustang-gt-2018',
    year: 2018,
    make: 'Ford',
    model: 'Mustang',
    trim: 'GT Fastback',
    nickname: 'The Coyote',
    accent: '#d98324',
    drivetrain: 'RWD',
    engine: {
      code: 'Gen-3 Coyote',
      displacement: '5.0 L (5038 cc)',
      config: 'V8, 90°, longitudinal',
      power: '460 hp @ 7000 rpm',
      valvetrain: 'DOHC 32v, Ti-VCT',
      timing: 'chain',
      interference: true,
    },
    transmissions: ['10R80 10-speed automatic', 'MT82-D4 6-speed manual'],
    program: 'Ford FACT / ASSET',
    whyTaught:
      'The RWD counterweight to the Civic. Longitudinal engine, driveshaft, independent rear suspension, and a bottom end worth tearing down: forged crank, plasma-transferred-wire-arc bores, and a main cap torque sequence that teaches torque-plus-angle properly. Big four-piston front brakes make caliper work easy to see.',
    quickSpecs: [
      { label: 'Lug nut torque', value: '150 N·m / 111 ft-lb' },
      { label: 'Oil capacity', value: '10 qt w/ filter' },
      { label: 'Oil spec', value: '5W-30 synthetic blend' },
      { label: 'Front brakes', value: '380 mm, 4-piston fixed' },
      { label: 'Bore × stroke', value: '93.0 × 92.7 mm' },
      { label: 'Compression', value: '12.0:1' },
      { label: 'Firing order', value: '1-5-4-8-6-3-7-2' },
      { label: 'Rear suspension', value: 'Integral-link IRS' },
    ],
  },
  {
    id: 'silverado-2015',
    year: 2015,
    make: 'Chevrolet',
    model: 'Silverado 1500',
    trim: 'LT Crew Cab 4WD',
    nickname: 'The Work Truck',
    accent: '#c9a227',
    drivetrain: '4WD',
    engine: {
      code: 'L83 EcoTec3',
      displacement: '5.3 L (5328 cc)',
      config: 'V8, 90°, longitudinal',
      power: '355 hp @ 5600 rpm',
      valvetrain: 'OHV 16v, AFM, direct injection',
      timing: 'chain',
      interference: true,
    },
    transmissions: ['6L80 6-speed automatic'],
    program: 'GM ASEP',
    whyTaught:
      'Body-on-frame, torsion-free coil-over-shock front end, leaf-sprung rear, transfer case, and a transmission big enough to teach fluid service on without fighting for access. Trucks are also where the paying work is — half of what rolls into an independent shop in Texas is a half-ton pickup.',
    quickSpecs: [
      { label: 'Lug nut torque', value: '190 N·m / 140 ft-lb' },
      { label: 'Oil capacity', value: '8 qt w/ filter' },
      { label: 'Trans fluid', value: 'DEXRON-VI, ~7.4 qt drop' },
      { label: 'Trans pan bolts', value: '12 N·m / 106 in-lb' },
      { label: 'Front suspension', value: 'Coil-over-shock, SLA' },
      { label: 'Rear suspension', value: 'Multi-leaf, solid axle' },
      { label: 'Firing order', value: '1-8-7-2-6-5-4-3' },
      { label: 'Transfer case', value: 'MP1626 / NVG-149' },
    ],
  },
  {
    id: 'camry-2014',
    year: 2014,
    make: 'Toyota',
    model: 'Camry',
    trim: 'LE',
    nickname: 'The Volume Seller',
    accent: '#6b8f9c',
    drivetrain: 'FWD',
    engine: {
      code: '2AR-FE',
      displacement: '2.5 L (2494 cc)',
      config: 'Inline-4, transverse',
      power: '178 hp @ 6000 rpm',
      valvetrain: 'DOHC 16v, Dual VVT-i',
      timing: 'chain',
      interference: true,
    },
    transmissions: ['U760E 6-speed automatic'],
    program: 'Toyota T-TEN',
    whyTaught:
      'The most common car in American driveways, which makes it the one students will actually get paid to fix. The 2AR-FE is also the cleanest four-cylinder for head work: aluminium block and head, torque-to-yield head bolts with a proper angle spec, and a published tightening sequence that drills in why pattern matters.',
    quickSpecs: [
      { label: 'Lug nut torque', value: '103 N·m / 76 ft-lb' },
      { label: 'Head bolts', value: '49 N·m + 90° + 90° (TTY)' },
      { label: 'Oil capacity', value: '4.6 qt w/ filter' },
      { label: 'Oil spec', value: '0W-20 full synthetic' },
      { label: 'Head gasket', value: 'Multi-layer steel' },
      { label: 'Valve clearance', value: 'Shim-under-bucket' },
      { label: 'Firing order', value: '1-3-4-2' },
      { label: 'Coolant', value: 'Toyota SLLC pink' },
    ],
  },
]

export const vehicleById = (id: string) => VEHICLES.find((v) => v.id === id)
export const vehicleName = (v: Vehicle) => `${v.year} ${v.make} ${v.model}`
