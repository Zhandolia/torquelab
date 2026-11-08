export type SystemId =
  | 'brakes'
  | 'suspension'
  | 'engine'
  | 'timing'
  | 'driveline'
  | 'cooling'
  | 'interior'
  | 'exterior'
  | 'maintenance'

export const SYSTEMS: Record<SystemId, { label: string; blurb: string; ase: string }> = {
  brakes: { label: 'Brakes', blurb: 'Friction, hydraulics, ABS', ase: 'ASE A5' },
  suspension: { label: 'Suspension & Steering', blurb: 'Struts, arms, alignment', ase: 'ASE A4' },
  engine: { label: 'Engine Mechanical', blurb: 'Heads, rotating assembly, seals', ase: 'ASE A1' },
  timing: { label: 'Valve Timing', blurb: 'Belts, chains, phasing', ase: 'ASE A1' },
  driveline: { label: 'Transmission & Driveline', blurb: 'Automatics, axles, transfer case', ase: 'ASE A2 / A3' },
  cooling: { label: 'Cooling System', blurb: 'Pumps, thermostats, bleeding', ase: 'ASE A1' },
  interior: { label: 'Interior & Trim', blurb: 'Panels, clips, accessories', ase: 'ASE B' },
  exterior: { label: 'Body & Exterior', blurb: 'Covers, fascias, lighting', ase: 'ASE B' },
  maintenance: { label: 'Core Maintenance', blurb: 'Fluids, filters, inspection', ase: 'ASE A8' },
}

export type Drivetrain = 'FWD' | 'RWD' | '4WD' | 'AWD'

export interface Vehicle {
  id: string
  year: number
  make: string
  model: string
  trim: string
  nickname: string
  accent: string
  drivetrain: Drivetrain
  engine: {
    code: string
    displacement: string
    config: string
    power: string
    valvetrain: string
    timing: 'belt' | 'chain'
    interference: boolean
  }
  transmissions: string[]
  program: string
  whyTaught: string
  quickSpecs: { label: string; value: string }[]
}

export type ToolCategory = 'hand' | 'power' | 'measure' | 'specialty' | 'safety' | 'consumable'

export const TOOL_CATEGORY: Record<ToolCategory, { label: string; color: string }> = {
  hand: { label: 'Hand tool', color: 'text-shop-200' },
  power: { label: 'Power tool', color: 'text-sky-300' },
  measure: { label: 'Measuring', color: 'text-torque' },
  specialty: { label: 'Specialty', color: 'text-amber-caution' },
  safety: { label: 'Safety', color: 'text-safe' },
  consumable: { label: 'Consumable', color: 'text-shop-400' },
}

export interface Tool {
  name: string
  detail?: string
  category: ToolCategory
}

export interface TorqueSpec {
  fastener: string
  nm: number
  ftlb?: number
  inlb?: number
  angle?: string
  pattern?: string
  note?: string
  tty?: boolean
}

export type Hazard =
  | 'crush'
  | 'burn'
  | 'chemical'
  | 'pressure'
  | 'spring'
  | 'sharp'
  | 'eye'
  | 'fire'
  | 'electrical'

export const HAZARDS: Record<Hazard, { label: string; icon: string }> = {
  crush: { label: 'Crush / falling load', icon: '⬛' },
  burn: { label: 'Hot surfaces', icon: '🔥' },
  chemical: { label: 'Chemical exposure', icon: '🧪' },
  pressure: { label: 'Stored pressure', icon: '💨' },
  spring: { label: 'Stored spring energy', icon: '🌀' },
  sharp: { label: 'Sharp edges', icon: '🔺' },
  eye: { label: 'Eye hazard', icon: '👁' },
  fire: { label: 'Flammable', icon: '⚠' },
  electrical: { label: 'Electrical / HV', icon: '⚡' },
}

export interface Hotspot {
  part: string
  label: string
  spec?: string
}

export interface Step {
  id: string
  title: string
  body: string
  detail?: string[]
  camera?: { pos: [number, number, number]; target: [number, number, number] }
  focus?: string[]
  hide?: string[]
  explode?: number
  hotspots?: Hotspot[]
  torque?: TorqueSpec[]
  hazards?: Hazard[]
  tip?: string
  mistake?: string
  measure?: { name: string; spec: string; tool: string }[]
  durationMin?: number
}

export interface Checkpoint {
  id: string
  afterStep: string
  question: string
  options: { text: string; correct?: boolean; why: string }[]
}

export interface Procedure {
  id: string
  title: string
  subtitle: string
  primaryVehicleId: string
  alsoApplies?: string[]
  system: SystemId
  location: 'wheel' | 'underhood' | 'underbody' | 'interior' | 'exterior'
  difficulty: 1 | 2 | 3 | 4 | 5
  timeMin: number
  assembly: string
  summary: string
  objectives: string[]
  tools: Tool[]
  parts: { name: string; qty: string; note?: string }[]
  fluids?: { name: string; spec: string; qty: string }[]
  torqueTable: TorqueSpec[]
  hazards: { kind: Hazard; text: string }[]
  steps: Step[]
  checkpoints: Checkpoint[]
  /**
   * Disassembly state per step id: the parts that are already off the vehicle
   * by the time you reach that step, so the model matches the written order.
   */
  hiddenByStep?: Record<string, string[]>
}

/** Metadata for every named mesh group inside a 3D assembly. */
export interface PartInfo {
  id: string
  name: string
  group: string
  material?: string
  fn: string
  torque?: string
  inspect?: string
}

export const DIFFICULTY: Record<number, { label: string; color: string }> = {
  1: { label: 'Intro', color: 'text-safe' },
  2: { label: 'Basic', color: 'text-safe' },
  3: { label: 'Intermediate', color: 'text-amber-caution' },
  4: { label: 'Advanced', color: 'text-orange-400' },
  5: { label: 'Expert', color: 'text-danger' },
}
