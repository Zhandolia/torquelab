import type { ComponentType } from 'react'
import { BrakeFront } from './BrakeFront'
import { StrutFront } from './StrutFront'
import { TimingV6 } from './TimingV6'
import { CylinderHeadAssembly } from './CylinderHead'
import { RotatingAssembly } from './RotatingAssembly'
import { TransService } from './TransService'
import { DoorPanel } from './DoorPanel'
import { BumperCover } from './BumperCover'
import { OilService } from './OilService'

export const ASSEMBLIES: Record<string, ComponentType> = {
  brakeFront: BrakeFront,
  strutFront: StrutFront,
  timingV6: TimingV6,
  cylinderHead: CylinderHeadAssembly,
  rotatingAssembly: RotatingAssembly,
  transService: TransService,
  doorPanel: DoorPanel,
  bumperCover: BumperCover,
  oilService: OilService,
}

/** Framing that shows the whole assembly, used when a step has no camera. */
export const DEFAULT_CAM: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  brakeFront: { pos: [3.1, 1.5, 3.7], target: [-0.3, 0, 0] },
  strutFront: { pos: [3.7, 0.9, 4.2], target: [0, 0.1, 0] },
  timingV6: { pos: [1.2, 1.4, 6.4], target: [0, 0.3, 0] },
  cylinderHead: { pos: [4.4, 2.8, 5.4], target: [0, 0.1, 0] },
  rotatingAssembly: { pos: [5.6, 2.6, 6.4], target: [0, 0.2, 0] },
  transService: { pos: [3.8, 1.2, 4.6], target: [0, -0.4, 0] },
  doorPanel: { pos: [1.4, 0.8, 7.0], target: [0, 0.1, 0] },
  bumperCover: { pos: [2.6, 2.2, 7.0], target: [0, 0.1, 0] },
  oilService: { pos: [3.4, 0.6, 4.6], target: [0, -0.3, 0] },
}

export { HEAD_BOLTS } from './CylinderHead'
