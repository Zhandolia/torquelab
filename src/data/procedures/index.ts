import type { Procedure } from '../../lib/types'
import { civicFrontBrakes } from './civicFrontBrakes'
import { civicFrontStrut } from './civicFrontStrut'
import { accordTimingBelt } from './accordTimingBelt'
import { camryCylinderHead } from './camryCylinderHead'
import { mustangBottomEnd } from './mustangBottomEnd'
import { silveradoTransService } from './silveradoTransService'
import { civicDoorPanel } from './civicDoorPanel'
import { civicBumperCover } from './civicBumperCover'
import { oilService } from './oilService'

export const PROCEDURES: Procedure[] = [
  oilService,
  civicFrontBrakes,
  civicDoorPanel,
  civicBumperCover,
  silveradoTransService,
  civicFrontStrut,
  camryCylinderHead,
  accordTimingBelt,
  mustangBottomEnd,
]

export const procById = (id: string) => PROCEDURES.find((p) => p.id === id)

export const proceduresForVehicle = (vid: string) =>
  PROCEDURES.filter((p) => p.primaryVehicleId === vid || p.alsoApplies?.includes(vid))

export const totalSteps = PROCEDURES.reduce((n, p) => n + p.steps.length, 0)
