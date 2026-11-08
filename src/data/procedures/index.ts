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
import { corollaDrumBrakes } from './corollaDrumBrakes'
import { camryCooling } from './camryCooling'
import { silveradoSerpentine } from './silveradoSerpentine'
import { civicCvAxle } from './civicCvAxle'
import { camryRearBrakes } from './camryRearBrakes'
import { silveradoHubBearing } from './silveradoHubBearing'
import { mustangSparkPlugs } from './mustangSparkPlugs'

/**
 * Ordered by how much it costs you to get it wrong, which is also roughly the
 * order a first-year student meets them.
 */
export const PROCEDURES: Procedure[] = [
  oilService,
  silveradoSerpentine,
  civicDoorPanel,
  civicBumperCover,
  mustangSparkPlugs,
  civicFrontBrakes,
  corollaDrumBrakes,
  camryRearBrakes,
  camryCooling,
  silveradoTransService,
  civicCvAxle,
  silveradoHubBearing,
  civicFrontStrut,
  camryCylinderHead,
  accordTimingBelt,
  mustangBottomEnd,
]

export const procById = (id: string) => PROCEDURES.find((p) => p.id === id)

export const proceduresForVehicle = (vid: string) =>
  PROCEDURES.filter((p) => p.primaryVehicleId === vid || p.alsoApplies?.includes(vid))

export const totalSteps = PROCEDURES.reduce((n, p) => n + p.steps.length, 0)
