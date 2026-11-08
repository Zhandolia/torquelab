import { useMemo } from 'react'
import * as THREE from 'three'
import { Mat, type MatKey } from './materials'
import {
  arcPlate,
  beltGeometry,
  beltPath,
  bellows,
  discWithHoles,
  helixTube,
  hexPrism,
  outlinePlate,
  pulleyProfile,
  radiatorCore,
  ring,
  roundedPlate,
  routedTube,
  sprocket,
  ventedRotorPlates,
  type PulleyNode,
} from './geo'

type V3 = [number, number, number]

const HALF = Math.PI / 2

/* ============================================================== fasteners */

/**
 * Bolt with its shank running down −Y and the head sitting above the origin,
 * so placing one means putting the origin on the mating surface.
 */
export function Bolt({
  d = 0.06,
  len = 0.3,
  head = 'hex',
  mat = 'zinc',
  position,
  rotation,
}: {
  d?: number
  len?: number
  head?: 'hex' | 'cap' | 'flange' | 'torx'
  mat?: MatKey
  position?: V3
  rotation?: V3
}) {
  const headH = d * 0.72
  const across = d * 1.75
  const headGeo = useMemo(() => hexPrism(across, headH), [across, headH])

  return (
    <group position={position} rotation={rotation}>
      {head === 'hex' || head === 'flange' ? (
        <mesh geometry={headGeo} position={[0, headH / 2, 0]} castShadow>
          <Mat k={mat} />
        </mesh>
      ) : (
        <mesh position={[0, headH / 2, 0]} castShadow>
          <cylinderGeometry args={[across * 0.5, across * 0.5, headH, 20]} />
          <Mat k={mat} />
        </mesh>
      )}
      {head === 'flange' && (
        <mesh position={[0, 0.006, 0]}>
          <cylinderGeometry args={[across * 0.78, across * 0.72, 0.014, 24]} />
          <Mat k={mat} />
        </mesh>
      )}
      {head === 'torx' && (
        <mesh position={[0, headH * 0.92, 0]}>
          <cylinderGeometry args={[d * 0.34, d * 0.34, headH * 0.4, 6]} />
          <Mat k="blackOxide" />
        </mesh>
      )}
      <mesh position={[0, -len / 2, 0]} castShadow>
        <cylinderGeometry args={[d / 2, d / 2, len, 18]} />
        <Mat k={mat} />
      </mesh>
      {/* thread relief near the tip */}
      <mesh position={[0, -len * 0.82, 0]}>
        <cylinderGeometry args={[d * 0.56, d * 0.56, len * 0.34, 18]} />
        <Mat k={mat} />
      </mesh>
    </group>
  )
}

export function Nut({ d = 0.06, mat = 'zinc', position, rotation }: { d?: number; mat?: MatKey; position?: V3; rotation?: V3 }) {
  const geo = useMemo(() => hexPrism(d * 1.8, d * 0.85), [d])
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} castShadow>
        <Mat k={mat} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[d * 0.5, d * 0.5, d * 0.95, 16]} />
        <Mat k="blackOxide" />
      </mesh>
    </group>
  )
}

export function LugNut({ d = 0.07, position, rotation }: { d?: number; position?: V3; rotation?: V3 }) {
  const geo = useMemo(() => hexPrism(d * 1.6, d * 1.5), [d])
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} castShadow>
        <Mat k="zinc" />
      </mesh>
      <mesh position={[0, -d * 0.85, 0]}>
        <coneGeometry args={[d * 0.85, d * 0.5, 20]} />
        <Mat k="zinc" />
      </mesh>
    </group>
  )
}

export function Washer({ od = 0.12, id = 0.062, t = 0.012, mat = 'zinc', position, rotation }: { od?: number; id?: number; t?: number; mat?: MatKey; position?: V3; rotation?: V3 }) {
  const geo = useMemo(() => discWithHoles(od, id, t), [od, id, t])
  return (
    <mesh geometry={geo} position={position} rotation={rotation}>
      <Mat k={mat} />
    </mesh>
  )
}

/** Wheel stud pressed into a hub, axis +Z. */
export function Stud({ d = 0.06, len = 0.2, position }: { d?: number; len?: number; position?: V3 }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[d / 2, d / 2, len, 16]} />
        <Mat k="steel" />
      </mesh>
    </group>
  )
}

/* ================================================================= brakes */

export function Rotor({
  od = 1.41,
  hatDia = 0.72,
  hatDepth = 0.2,
  plate = 0.055,
  gap = 0.085,
  lugs = 5,
  lugDist = 0.26,
  position,
  rotation,
}: {
  od?: number
  hatDia?: number
  hatDepth?: number
  plate?: number
  gap?: number
  lugs?: number
  lugDist?: number
  position?: V3
  rotation?: V3
}) {
  const plates = useMemo(() => ventedRotorPlates(od, hatDia, plate, gap, 36), [od, hatDia, plate, gap])
  const hat = useMemo(
    () =>
      discWithHoles(hatDia + 0.04, 0.34, hatDepth, [
        { r: 0.035, count: lugs, dist: lugDist },
      ]),
    [hatDia, hatDepth, lugs, lugDist],
  )
  const wall = useMemo(() => discWithHoles(hatDia + 0.04, hatDia - 0.02, hatDepth), [hatDia, hatDepth])

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={plates} castShadow receiveShadow>
        <Mat k="machined" />
      </mesh>
      <mesh geometry={wall} position={[0, 0, -hatDepth / 2 - gap / 2]}>
        <Mat k="castIron" />
      </mesh>
      <mesh geometry={hat} position={[0, 0, -hatDepth - gap / 2 - plate]}>
        <Mat k="castIron" />
      </mesh>
    </group>
  )
}

export function BrakePad({
  w = 0.62,
  h = 0.38,
  friction = 0.055,
  wear = 1,
  position,
  rotation,
}: {
  w?: number
  h?: number
  friction?: number
  /** 1 = new, 0.2 = at the wear limit */
  wear?: number
  position?: V3
  rotation?: V3
}) {
  const plate = useMemo(() => roundedPlate(w, h, 0.05, 0.035), [w, h])
  const fric = useMemo(() => roundedPlate(w * 0.94, h * 0.9, 0.04, friction * wear), [w, h, friction, wear])
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={plate} castShadow>
        <Mat k="steel" />
      </mesh>
      <mesh geometry={fric} position={[0, 0, 0.0175 + (friction * wear) / 2]}>
        <Mat k="friction" />
      </mesh>
      {/* wear indicator tang */}
      <mesh position={[w * 0.42, h * 0.52, 0]}>
        <boxGeometry args={[0.05, 0.08, 0.012]} />
        <Mat k="steel" />
      </mesh>
    </group>
  )
}

export function Caliper({
  pistons = 1,
  bore = 0.3,
  width = 0.78,
  position,
  rotation,
  color,
}: {
  pistons?: number
  bore?: number
  width?: number
  position?: V3
  rotation?: V3
  color?: string
}) {
  const body = useMemo(() => roundedPlate(width, 0.52, 0.09, 0.3), [width])
  const bridge = useMemo(() => roundedPlate(width * 0.86, 0.2, 0.05, 0.1), [width])
  const fingers = useMemo(() => roundedPlate(width, 0.46, 0.07, 0.1), [width])
  const offsets = useMemo(() => {
    if (pistons === 1) return [0]
    const spread = width * 0.3
    return Array.from({ length: pistons }, (_, i) => -spread + (i * spread * 2) / (pistons - 1))
  }, [pistons, width])

  return (
    <group position={position} rotation={rotation}>
      {/* inboard half with the piston bores */}
      <mesh geometry={body} position={[0, 0, -0.2]} castShadow>
        <Mat k="paint" color={color} />
      </mesh>
      {/* bridge over the rotor */}
      <mesh geometry={bridge} position={[0, 0.2, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <Mat k="paint" color={color} />
      </mesh>
      {/* outboard fingers */}
      <mesh geometry={fingers} position={[0, 0, 0.26]} castShadow>
        <Mat k="paint" color={color} />
      </mesh>
      {offsets.map((x, i) => (
        <mesh key={i} position={[x, -0.02, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[bore / 2, bore / 2, 0.14, 26]} />
          <Mat k="machined" />
        </mesh>
      ))}
      {offsets.map((x, i) => (
        <mesh key={`b-${i}`} position={[x, -0.02, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[bore / 2 + 0.012, 0.016, 8, 24]} />
          <Mat k="rubber" />
        </mesh>
      ))}
      {/* bleeder screw */}
      <mesh position={[width * 0.38, 0.2, -0.2]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.14, 12]} />
        <Mat k="brass" />
      </mesh>
    </group>
  )
}

export function CaliperBracket({ position, rotation }: { position?: V3; rotation?: V3 }) {
  const geo = useMemo(
    () =>
      outlinePlate(
        [
          [-0.46, -0.34],
          [0.46, -0.34],
          [0.5, 0.1],
          [0.3, 0.42],
          [-0.3, 0.42],
          [-0.5, 0.1],
        ],
        0.1,
        [
          { x: -0.33, y: -0.2, r: 0.042 },
          { x: 0.33, y: -0.2, r: 0.042 },
        ],
      ),
    [],
  )
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} castShadow>
        <Mat k="castIron" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.4, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.28, 16]} />
          <Mat k="castIron" />
        </mesh>
      ))}
    </group>
  )
}

export function SlidePin({ position, rotation }: { position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.34, 14]} />
        <Mat k="machined" />
      </mesh>
      <mesh position={[0, 0, -0.19]}>
        <cylinderGeometry args={[0.058, 0.058, 0.05, 6]} />
        <Mat k="blackOxide" />
      </mesh>
      <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.042, 0.016, 8, 18]} />
        <Mat k="rubber" />
      </mesh>
    </group>
  )
}

/* ============================================================ suspension */

export function CoilSpring({
  coilR = 0.36,
  height = 1.15,
  coils = 6.5,
  wire = 0.075,
  position,
  rotation,
}: {
  coilR?: number
  height?: number
  coils?: number
  wire?: number
  position?: V3
  rotation?: V3
}) {
  const geo = useMemo(() => helixTube(coilR, height, coils, wire, 0.12), [coilR, height, coils, wire])
  return (
    <mesh geometry={geo} position={position} rotation={rotation} castShadow>
      <Mat k="spring" />
    </mesh>
  )
}

export function StrutBody({
  len = 1.1,
  position,
  rotation,
}: {
  len?: number
  position?: V3
  rotation?: V3
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* damper tube */}
      <mesh position={[0, -len * 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.14, len * 0.5, 26]} />
        <Mat k="blackOxide" />
      </mesh>
      {/* piston rod */}
      <mesh position={[0, len * 0.26, 0]}>
        <cylinderGeometry args={[0.042, 0.042, len * 0.56, 18]} />
        <Mat k="machined" />
      </mesh>
      {/* spring seat */}
      <mesh position={[0, -len * 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.17, 0.05, 28]} />
        <Mat k="steel" />
      </mesh>
      {/* knuckle clamp ears */}
      <mesh position={[0, -len * 0.48, 0.06]}>
        <boxGeometry args={[0.34, 0.26, 0.12]} />
        <Mat k="castIron" />
      </mesh>
    </group>
  )
}

export function UpperMount({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.26, 0.1, 28]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.08, 24]} />
        <Mat k="rubber" />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.24, 0.07, Math.sin(a) * 0.24]}>
            <cylinderGeometry args={[0.026, 0.026, 0.14, 12]} />
            <Mat k="steel" />
          </mesh>
        )
      })}
    </group>
  )
}

export function BearingPlate({ position }: { position?: V3 }) {
  const geo = useMemo(() => discWithHoles(0.44, 0.11, 0.07), [])
  return (
    <mesh geometry={geo} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <Mat k="plastic" />
    </mesh>
  )
}

export function BumpStop({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.13, 0.26, 20]} />
        <Mat k="rubber" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.135, 0.13, 0.2, 20]} />
        <Mat k="plastic" />
      </mesh>
    </group>
  )
}

export function ControlArm({ position, rotation }: { position?: V3; rotation?: V3 }) {
  const geo = useMemo(
    () =>
      outlinePlate(
        [
          [-0.95, -0.1],
          [-0.2, -0.26],
          [0.85, -0.14],
          [0.95, 0.06],
          [0.1, 0.16],
          [-0.9, 0.12],
        ],
        0.14,
        [{ x: 0.82, y: -0.02, r: 0.06 }],
      ),
    [],
  )
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} castShadow>
        <Mat k="castIron" />
      </mesh>
      {/* inboard bushings */}
      <mesh position={[-0.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.26, 20]} />
        <Mat k="rubber" />
      </mesh>
      <mesh position={[-0.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.32, 14]} />
        <Mat k="steel" />
      </mesh>
    </group>
  )
}

export function BallJoint({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.1, 20, 16]} />
        <Mat k="machined" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.075, 0.2, 18]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.14, 20]} />
        <Mat k="rubber" />
      </mesh>
    </group>
  )
}

export function SwayBarLink({ len = 0.5, position, rotation }: { len?: number; position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.032, 0.032, len, 14]} />
        <Mat k="steel" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, (s * len) / 2, 0]}>
          <sphereGeometry args={[0.072, 16, 12]} />
          <Mat k="rubber" />
        </mesh>
      ))}
    </group>
  )
}

export function Knuckle({ position, rotation }: { position?: V3; rotation?: V3 }) {
  const geo = useMemo(
    () =>
      outlinePlate(
        [
          [-0.1, -0.78],
          [0.3, -0.52],
          [0.52, 0.0],
          [0.44, 0.52],
          [0.06, 0.82],
          [-0.42, 0.6],
          [-0.54, 0.0],
          [-0.44, -0.5],
        ],
        0.2,
        [{ x: 0, y: 0, r: 0.34 }],
      ),
    [],
  )
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} castShadow receiveShadow>
        <Mat k="castIron" />
      </mesh>
      {/* bearing boss */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.2, 32]} />
        <Mat k="castIron" />
      </mesh>
      {/* caliper bracket ears */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-0.46, s * 0.26, 0]}>
          <boxGeometry args={[0.16, 0.18, 0.2]} />
          <Mat k="castIron" />
        </mesh>
      ))}
    </group>
  )
}

export function HubBearing({ position }: { position?: V3 }) {
  const flange = useMemo(
    () => discWithHoles(0.74, 0.3, 0.09, [{ r: 0.038, count: 5, dist: 0.26 }]),
    [],
  )
  return (
    <group position={position}>
      <mesh geometry={flange}>
        <Mat k="machined" />
      </mesh>
      <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.41, 0.41, 0.2, 30]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.36, 0.035, 10, 32]} />
        <Mat k="rubber" />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return <Stud key={i} position={[Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0.14]} />
      })}
    </group>
  )
}

/* ================================================================= timing */

export function Sprocket({
  r = 0.42,
  teeth = 38,
  bore = 0.18,
  depth = 0.12,
  mat = 'steel',
  position,
  rotation,
  mark,
}: {
  r?: number
  teeth?: number
  bore?: number
  depth?: number
  mat?: MatKey
  position?: V3
  rotation?: V3
  /** timing mark notch painted on the face */
  mark?: boolean
}) {
  const geo = useMemo(() => sprocket(r, teeth, r * 0.1, depth, bore), [r, teeth, depth, bore])
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} castShadow>
        <Mat k={mat} />
      </mesh>
      {mark && (
        <mesh position={[0, r * 0.74, depth / 2 + 0.004]}>
          <boxGeometry args={[r * 0.1, r * 0.4, 0.008]} />
          <meshStandardMaterial color="#ffb000" emissive="#ffb000" emissiveIntensity={0.7} />
        </mesh>
      )}
    </group>
  )
}

export function Pulley({
  r = 0.4,
  width = 0.16,
  grooves = 6,
  position,
  rotation,
  mat = 'steel',
}: {
  r?: number
  width?: number
  grooves?: number
  position?: V3
  rotation?: V3
  mat?: MatKey
}) {
  const geo = useMemo(() => pulleyProfile(r, width, grooves), [r, width, grooves])
  return (
    <mesh geometry={geo} position={position} rotation={rotation} castShadow>
      <Mat k={mat} />
    </mesh>
  )
}

export function IdlerPulley({ r = 0.2, width = 0.16, position }: { r?: number; width?: number; position?: V3 }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, width, 28]} />
        <Mat k="steel" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.3, r * 0.3, width + 0.08, 18]} />
        <Mat k="machined" />
      </mesh>
    </group>
  )
}

export function TimingBelt({
  pulleys,
  width = 0.17,
  thickness = 0.05,
}: {
  pulleys: PulleyNode[]
  width?: number
  thickness?: number
}) {
  const geo = useMemo(() => {
    const path = beltPath(pulleys, 14)
    return beltGeometry(path, width, thickness, 0.05)
  }, [pulleys, width, thickness])
  return (
    <mesh geometry={geo} castShadow>
      <Mat k="belt" />
    </mesh>
  )
}

export function Tensioner({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.17, 28]} />
        <Mat k="steel" />
      </mesh>
      {/* hydraulic actuator */}
      <mesh position={[0.02, -0.34, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.085, 0.085, 0.42, 20]} />
        <Mat k="blackOxide" />
      </mesh>
      <mesh position={[0.05, -0.6, 0]}>
        <boxGeometry args={[0.2, 0.14, 0.14]} />
        <Mat k="aluminium" />
      </mesh>
      {/* pivot arm */}
      <mesh position={[0, -0.18, -0.06]}>
        <boxGeometry args={[0.1, 0.4, 0.06]} />
        <Mat k="steel" />
      </mesh>
    </group>
  )
}

export function WaterPump({ position }: { position?: V3 }) {
  const body = useMemo(() => discWithHoles(0.62, 0, 0.18, [{ r: 0.03, count: 6, dist: 0.24 }]), [])
  return (
    <group position={position}>
      <mesh geometry={body} position={[0, 0, -0.1]}>
        <Mat k="aluminium" />
      </mesh>
      {/* impeller shaft hub the sprocket mounts to */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.1, 0.1, 0.16, 20]} />
        <Mat k="machined" />
      </mesh>
      {/* outlet neck */}
      <mesh position={[0.3, -0.18, -0.1]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.1, 0.11, 0.26, 18]} />
        <Mat k="aluminium" />
      </mesh>
    </group>
  )
}

/* ================================================================= engine */

export function Piston({ d = 0.46, position, rotation }: { d?: number; position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[d / 2, d / 2, d * 0.62, 32]} />
        <Mat k="aluminium" />
      </mesh>
      {/* ring pack */}
      {[0.2, 0.12, 0.02].map((y, i) => (
        <mesh key={i} position={[0, d * y, 0]}>
          <torusGeometry args={[d / 2 + 0.002, 0.014, 8, 36]} />
          <Mat k={i === 2 ? 'machined' : 'blackOxide'} />
        </mesh>
      ))}
      {/* valve relief dish */}
      <mesh position={[0, d * 0.3, 0]}>
        <cylinderGeometry args={[d * 0.36, d * 0.36, 0.03, 28]} />
        <Mat k="blackOxide" />
      </mesh>
      {/* wrist pin */}
      <mesh position={[0, -d * 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[d * 0.17, d * 0.17, d * 1.02, 20]} />
        <Mat k="machined" />
      </mesh>
    </group>
  )
}

export function ConRod({ len = 0.72, position, rotation }: { len?: number; position?: V3; rotation?: V3 }) {
  const beam = useMemo(
    () =>
      outlinePlate(
        [
          [-0.07, 0],
          [0.07, 0],
          [0.13, -len * 0.9],
          [-0.13, -len * 0.9],
        ],
        0.11,
      ),
    [len],
  )
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={beam} castShadow>
        <Mat k="steel" />
      </mesh>
      {/* small end */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 22]} />
        <Mat k="steel" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.072, 0.072, 0.16, 20]} />
        <Mat k="brass" />
      </mesh>
      {/* big end + cap */}
      <mesh position={[0, -len * 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.17, 26]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, -len * 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.19, 24]} />
        <Mat k="copper" />
      </mesh>
    </group>
  )
}

export function Crankshaft({
  throws = 4,
  spacing = 0.56,
  position,
  rotation,
}: {
  throws?: number
  spacing?: number
  position?: V3
  rotation?: V3
}) {
  const total = throws * spacing + 0.5
  const angles = useMemo(
    () => Array.from({ length: throws }, (_, i) => (i === 0 || i === throws - 1 ? 0 : Math.PI)),
    [throws],
  )
  return (
    <group position={position} rotation={rotation}>
      {/* main journals along X */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, total, 26]} />
        <Mat k="machined" />
      </mesh>
      {angles.map((a, i) => {
        const x = -((throws - 1) * spacing) / 2 + i * spacing
        const r = 0.26
        return (
          <group key={i} position={[x, 0, 0]} rotation={[a, 0, 0]}>
            {/* counterweights */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.16, -r * 0.5, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 22, 1, false, -0.6, 2.2]} />
                <Mat k="steel" />
              </mesh>
            ))}
            {/* rod journal */}
            <mesh position={[0, r, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.13, 0.13, 0.21, 22]} />
              <Mat k="machined" />
            </mesh>
          </group>
        )
      })}
      {/* snout + flange */}
      <mesh position={[total / 2 - 0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 20]} />
        <Mat k="machined" />
      </mesh>
      <mesh position={[-total / 2 + 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.34, 0.1, 28]} />
        <Mat k="steel" />
      </mesh>
    </group>
  )
}

export function MainCap({ position }: { position?: V3 }) {
  const geo = useMemo(
    () =>
      outlinePlate(
        [
          [-0.3, 0.1],
          [0.3, 0.1],
          [0.28, -0.22],
          [-0.28, -0.22],
        ],
        0.21,
        [],
      ),
    [],
  )
  return (
    <group position={position}>
      <mesh geometry={geo}>
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.21, 24, 1, false, Math.PI, Math.PI]} />
        <Mat k="copper" />
      </mesh>
    </group>
  )
}

export function EngineBlock({
  bores = 4,
  spacing = 0.56,
  position,
}: {
  bores?: number
  spacing?: number
  position?: V3
}) {
  const w = bores * spacing + 0.36
  const deckHoles = useMemo(() => {
    const holes: { x: number; y: number; r: number }[] = []
    for (let i = 0; i < bores; i++) {
      holes.push({ x: -((bores - 1) * spacing) / 2 + i * spacing, y: 0, r: 0.235 })
    }
    return holes
  }, [bores, spacing])
  const deck = useMemo(() => roundedPlate(w, 0.86, 0.06, 0.1, deckHoles), [w, deckHoles])

  return (
    <group position={position}>
      {/* deck face */}
      <mesh geometry={deck} position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <Mat k="aluminium" />
      </mesh>
      {/* skirt */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[w, 1.22, 0.86]} />
        <Mat k="aluminium" />
      </mesh>
      {/* cylinder bores as honed liners */}
      {deckHoles.map((h, i) => (
        <mesh key={i} position={[h.x, 0.4, 0]}>
          <cylinderGeometry args={[0.235, 0.235, 0.66, 30, 1, true]} />
          <Mat k="blackOxide" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* head bolt bosses */}
      {Array.from({ length: bores + 1 }, (_, i) => {
        const x = -(bores * spacing) / 2 + i * spacing
        return [-1, 1].map((s) => (
          <mesh key={`${i}-${s}`} position={[x, 0.68, s * 0.33]}>
            <cylinderGeometry args={[0.07, 0.07, 0.14, 14]} />
            <Mat k="aluminium" />
          </mesh>
        ))
      })}
    </group>
  )
}

export function CylinderHead({
  bores = 4,
  spacing = 0.56,
  position,
}: {
  bores?: number
  spacing?: number
  position?: V3
}) {
  const w = bores * spacing + 0.36
  const holes = useMemo(() => {
    const h: { x: number; y: number; r: number }[] = []
    for (let i = 0; i <= bores; i++) {
      const x = -(bores * spacing) / 2 + i * spacing
      h.push({ x, y: -0.33, r: 0.062 }, { x, y: 0.33, r: 0.062 })
    }
    return h
  }, [bores, spacing])
  const plate = useMemo(() => roundedPlate(w, 0.86, 0.06, 0.1, holes), [w, holes])

  return (
    <group position={position}>
      <mesh geometry={plate} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[w, 0.46, 0.86]} />
        <Mat k="aluminium" />
      </mesh>
      {/* combustion chambers */}
      {Array.from({ length: bores }, (_, i) => {
        const x = -((bores - 1) * spacing) / 2 + i * spacing
        return (
          <group key={i}>
            <mesh position={[x, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <sphereGeometry args={[0.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <Mat k="blackOxide" />
            </mesh>
            {/* valves */}
            {[-0.09, 0.09].map((z, j) => (
              <mesh key={j} position={[x, 0.16, z]}>
                <cylinderGeometry args={[0.075, 0.075, 0.06, 18]} />
                <Mat k="machined" />
              </mesh>
            ))}
          </group>
        )
      })}
      {/* cam carrier bosses */}
      {[-0.22, 0.22].map((z) => (
        <mesh key={z} position={[0, 0.5, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, w * 0.92, 20]} />
          <Mat k="machined" />
        </mesh>
      ))}
    </group>
  )
}

export function HeadGasket({ bores = 4, spacing = 0.56, position }: { bores?: number; spacing?: number; position?: V3 }) {
  const w = bores * spacing + 0.36
  const holes = useMemo(() => {
    const h: { x: number; y: number; r: number }[] = []
    for (let i = 0; i < bores; i++) {
      h.push({ x: -((bores - 1) * spacing) / 2 + i * spacing, y: 0, r: 0.235 })
    }
    for (let i = 0; i <= bores; i++) {
      const x = -(bores * spacing) / 2 + i * spacing
      h.push({ x, y: -0.33, r: 0.062 }, { x, y: 0.33, r: 0.062 })
    }
    return h
  }, [bores, spacing])
  const geo = useMemo(() => roundedPlate(w, 0.86, 0.06, 0.022, holes), [w, holes])
  return (
    <mesh geometry={geo} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <Mat k="gasket" />
    </mesh>
  )
}

/* ============================================================== driveline */

export function TransPan({ position }: { position?: V3 }) {
  const holes = useMemo(() => {
    const h: { x: number; y: number; r: number }[] = []
    const n = 8
    for (let i = 0; i < n; i++) {
      h.push({ x: -0.75 + (i * 1.5) / (n - 1), y: -0.62, r: 0.026 })
      h.push({ x: -0.75 + (i * 1.5) / (n - 1), y: 0.62, r: 0.026 })
    }
    for (let i = 1; i < 4; i++) {
      h.push({ x: -0.82, y: -0.62 + (i * 1.24) / 4, r: 0.026 })
      h.push({ x: 0.82, y: -0.62 + (i * 1.24) / 4, r: 0.026 })
    }
    return h
  }, [])
  const flange = useMemo(() => roundedPlate(1.78, 1.38, 0.14, 0.03, holes), [holes])
  return (
    <group position={position}>
      <mesh geometry={flange} rotation={[Math.PI / 2, 0, 0]}>
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[1.56, 0.3, 1.16]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.4, 0.06, 1.0]} />
        <Mat k="steel" />
      </mesh>
      {/* drain plug */}
      <mesh position={[0.5, -0.32, 0.3]}>
        <cylinderGeometry args={[0.07, 0.07, 0.07, 6]} />
        <Mat k="blackOxide" />
      </mesh>
    </group>
  )
}

export function TransFilter({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.82, 0.07, 0.6]} />
        <Mat k="plastic" />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.76, 0.04, 0.54]} />
        <Mat k="gasket" />
      </mesh>
      <mesh position={[-0.22, 0.16, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.26, 22]} />
        <Mat k="plastic" />
      </mesh>
      <mesh position={[-0.22, 0.3, 0]}>
        <torusGeometry args={[0.12, 0.028, 10, 24]} />
        <Mat k="rubber" />
      </mesh>
    </group>
  )
}

export function ValveBody({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.3, 0.26, 0.92]} />
        <Mat k="aluminium" />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-0.5 + i * 0.2, 0.17, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.1, 16]} />
          <Mat k="copper" />
        </mesh>
      ))}
      <mesh position={[0.2, 0.16, 0.26]}>
        <boxGeometry args={[0.7, 0.08, 0.32]} />
        <Mat k="plastic" />
      </mesh>
    </group>
  )
}

/* ============================================================ body / trim */

export function BodyPanel({
  w,
  h,
  t = 0.06,
  bowX = 0,
  bowY = 0,
  mat = 'trim',
  position,
  rotation,
  color,
}: {
  w: number
  h: number
  t?: number
  bowX?: number
  bowY?: number
  mat?: MatKey
  position?: V3
  rotation?: V3
  color?: string
}) {
  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(w, h, t, 30, 16, 1)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const u = (p.getX(i) / w) * 2
      const v = (p.getY(i) / h) * 2
      p.setZ(i, p.getZ(i) - bowX * (1 - u * u) - bowY * (1 - v * v))
    }
    p.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [w, h, t, bowX, bowY])
  return (
    <mesh geometry={geo} position={position} rotation={rotation} castShadow receiveShadow>
      <Mat k={mat} color={color} />
    </mesh>
  )
}

/** Christmas-tree style trim clip, axis +Z. */
export function TrimClip({ position, rotation }: { position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.17, 12]} />
        <Mat k="plastic" />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0, -0.02 - i * 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.062, 0.05, 14]} />
          <Mat k="plastic" />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.02, 16]} />
        <Mat k="plastic" />
      </mesh>
    </group>
  )
}

export function Speaker({ r = 0.34, position, rotation }: { r?: number; position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r * 0.95, 0.05, 32]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[r * 0.78, 0.16, 32, 1, true]} />
        <Mat k="plastic" />
      </mesh>
      <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.3, r * 0.3, 0.14, 20]} />
        <Mat k="blackOxide" />
      </mesh>
    </group>
  )
}

export function Connector({ position, rotation }: { position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.16, 0.1, 0.12]} />
        <Mat k="plastic" />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[0.1, 0.07, 0.1]} />
        <Mat k="rubber" />
      </mesh>
    </group>
  )
}

/* ============================================================ maintenance */

export function OilFilter({ r = 0.19, h = 0.52, position, rotation }: { r?: number; h?: number; position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[r, r, h, 30]} />
        <Mat k="paint" color="#1d4f86" />
      </mesh>
      <mesh position={[0, -h / 2 - 0.015, 0]}>
        <cylinderGeometry args={[r * 0.84, r * 0.84, 0.04, 28]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, -h / 2 - 0.035, 0]}>
        <torusGeometry args={[r * 0.66, 0.022, 10, 28]} />
        <Mat k="rubber" />
      </mesh>
      {/* grip ribs */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.012, h * 0.8, 0.03]} />
            <Mat k="paint" color="#17406c" />
          </mesh>
        )
      })}
    </group>
  )
}

export function OilPan({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.5, 0.1, 1.0]} />
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0.1, -0.2, 0]}>
        <boxGeometry args={[1.0, 0.34, 0.8]} />
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0.1, -0.4, 0.3]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.072, 0.072, 0.09, 6]} />
        <Mat k="blackOxide" />
      </mesh>
    </group>
  )
}

export function DrainPan({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.95, 0.85, 0.22, 36]} />
        <Mat k="plastic" color="#17191d" />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.86, 0.86, 0.06, 36]} />
        <Mat k="fluid" />
      </mesh>
    </group>
  )
}

export function Hose({
  points,
  radius = 0.05,
  mat = 'rubber',
}: {
  points: [number, number, number][]
  radius?: number
  mat?: MatKey
}) {
  const geo = useMemo(() => routedTube(points, radius), [points, radius])
  return (
    <mesh geometry={geo}>
      <Mat k={mat} />
    </mesh>
  )
}

/* ========================================================== drum brakes */

export function BrakeDrum({
  od = 1.5,
  depth = 0.52,
  lugs = 4,
  position,
  rotation,
}: {
  od?: number
  depth?: number
  lugs?: number
  position?: V3
  rotation?: V3
}) {
  const shell = useMemo(() => ring(od / 2, depth, 0.07), [od, depth])
  const face = useMemo(
    () => discWithHoles(od, 0.34, 0.06, [{ r: 0.038, count: lugs, dist: 0.26 }]),
    [od, lugs],
  )
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={shell} castShadow receiveShadow>
        <Mat k="castIron" />
      </mesh>
      <mesh geometry={face} position={[0, 0, depth / 2 - 0.03]}>
        <Mat k="castIron" />
      </mesh>
      {/* machined friction surface just inside the shell */}
      <mesh rotation={[HALF, 0, 0]}>
        <cylinderGeometry args={[od / 2 - 0.075, od / 2 - 0.075, depth * 0.84, 48, 1, true]} />
        <Mat k="machined" side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

/** Curved shoe: web plate, arced table and bonded friction lining. */
export function BrakeShoe({
  r = 0.6,
  span = 2.1,
  start = 0,
  lining = 0.07,
  wear = 1,
  position,
  rotation,
}: {
  r?: number
  span?: number
  start?: number
  lining?: number
  wear?: number
  position?: V3
  rotation?: V3
}) {
  const table = useMemo(() => arcPlate(r - 0.03, r, start, start + span, 0.3), [r, span, start])
  const friction = useMemo(
    () => arcPlate(r, r + lining * wear, start + 0.08, start + span - 0.08, 0.26),
    [r, span, start, lining, wear],
  )
  const web = useMemo(() => arcPlate(r - 0.26, r - 0.02, start + 0.1, start + span - 0.1, 0.045), [r, span, start])
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={table} castShadow>
        <Mat k="steel" />
      </mesh>
      <mesh geometry={friction}>
        <Mat k="friction" />
      </mesh>
      <mesh geometry={web}>
        <Mat k="steel" />
      </mesh>
    </group>
  )
}

export function WheelCylinder({ position, rotation }: { position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[0, 0, HALF]}>
        <cylinderGeometry args={[0.1, 0.1, 0.42, 24]} />
        <Mat k="castIron" />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.25, 0, 0]} rotation={[0, 0, HALF]}>
            <cylinderGeometry args={[0.062, 0.062, 0.1, 18]} />
            <Mat k="machined" />
          </mesh>
          <mesh position={[s * 0.2, 0, 0]} rotation={[0, 0, HALF]}>
            <coneGeometry args={[0.095, 0.1, 18]} />
            <Mat k="rubber" />
          </mesh>
        </group>
      ))}
      {/* bleeder screw out the back */}
      <mesh position={[0, 0.02, -0.14]} rotation={[HALF, 0, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.16, 12]} />
        <Mat k="brass" />
      </mesh>
    </group>
  )
}

/** Extension spring stretched between two points. */
export function TensionSpring({
  from,
  to,
  coils = 14,
  r = 0.045,
  wire = 0.018,
  mat = 'spring',
}: {
  from: V3
  to: V3
  coils?: number
  r?: number
  wire?: number
  mat?: MatKey
}) {
  const { geo, mid, quat } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const len = a.distanceTo(b)
    const g = helixTube(r, len * 0.84, coils, wire)
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      b.clone().sub(a).normalize(),
    )
    return { geo: g, mid: a.clone().add(b).multiplyScalar(0.5), quat: q }
  }, [from, to, coils, r, wire])

  return (
    <group position={mid.toArray()} quaternion={quat}>
      <mesh geometry={geo}>
        <Mat k={mat} />
      </mesh>
      {/* hook ends */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, s * 0.46, 0]}>
          <torusGeometry args={[r * 0.9, wire / 2, 8, 16, Math.PI * 1.4]} />
          <Mat k={mat} />
        </mesh>
      ))}
    </group>
  )
}

/** Star-wheel adjuster: threaded strut with a toothed wheel. */
export function StarAdjuster({ len = 0.42, position, rotation }: { len?: number; position?: V3; rotation?: V3 }) {
  const star = useMemo(() => sprocket(0.065, 14, 0.022, 0.05, 0.02), [])
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[0, 0, HALF]}>
        <cylinderGeometry args={[0.03, 0.03, len, 14]} />
        <Mat k="machined" />
      </mesh>
      <mesh geometry={star} rotation={[0, HALF, 0]}>
        <Mat k="blackOxide" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * len) / 2, 0, 0]}>
          <boxGeometry args={[0.09, 0.1, 0.07]} />
          <Mat k="steel" />
        </mesh>
      ))}
    </group>
  )
}

export function HoldDownPin({ position }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh rotation={[HALF, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.4, 10]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[0, 0, 0.16]} rotation={[HALF, 0, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.035, 16]} />
        <Mat k="zinc" />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.09, 14]} />
        <Mat k="spring" />
      </mesh>
    </group>
  )
}

/* ============================================================== cooling */

export function Radiator({
  w = 2.6,
  h = 1.5,
  position,
  rotation,
}: {
  w?: number
  h?: number
  position?: V3
  rotation?: V3
}) {
  const core = useMemo(() => radiatorCore(w, h * 0.78, 0.16, 28), [w, h])
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={core} castShadow receiveShadow>
        <Mat k="aluminium" color="#596069" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, (s * h) / 2.3, 0]}>
          <boxGeometry args={[w, h * 0.12, 0.22]} />
          <Mat k="plastic" color="#1d2024" />
        </mesh>
      ))}
    </group>
  )
}

export function Thermostat({ position, rotation }: { position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* valve plate */}
      <mesh>
        <cylinderGeometry args={[0.17, 0.17, 0.03, 28]} />
        <Mat k="machined" />
      </mesh>
      {/* wax element */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.075, 0.09, 0.18, 20]} />
        <Mat k="copper" />
      </mesh>
      {/* bias spring */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.16, 18, 1, true]} />
        <Mat k="spring" side={THREE.DoubleSide} />
      </mesh>
      {/* jiggle pin */}
      <mesh position={[0.11, 0.02, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.05, 10]} />
        <Mat k="brass" />
      </mesh>
    </group>
  )
}

export function HoseClamp({ r = 0.1, position, rotation }: { r?: number; position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[0, 0, HALF]}>
        <torusGeometry args={[r, 0.016, 8, 26]} />
        <Mat k="zinc" />
      </mesh>
      <mesh position={[0, r + 0.03, 0]}>
        <boxGeometry args={[0.07, 0.07, 0.07]} />
        <Mat k="zinc" />
      </mesh>
    </group>
  )
}

/* ============================================================== CV axle */

/** Rzeppa outer joint — the bell that bolts into the hub. */
export function CVOuterJoint({ position, rotation }: { position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[0, 0, HALF]}>
        <sphereGeometry args={[0.26, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <Mat k="machined" />
      </mesh>
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, HALF]}>
        <cylinderGeometry args={[0.24, 0.2, 0.2, 26]} />
        <Mat k="steel" />
      </mesh>
      {/* splined stub that passes through the hub */}
      <mesh position={[0.34, 0, 0]} rotation={[0, 0, HALF]}>
        <cylinderGeometry args={[0.1, 0.1, 0.44, 22]} />
        <Mat k="machined" />
      </mesh>
    </group>
  )
}

/** Tripod inner joint — the housing that slides in the transmission. */
export function CVInnerJoint({ position, rotation }: { position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[0, 0, HALF]}>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 28]} />
        <Mat k="steel" />
      </mesh>
      <mesh position={[-0.22, 0, 0]} rotation={[0, 0, HALF]}>
        <cylinderGeometry args={[0.16, 0.16, 0.16, 22]} />
        <Mat k="machined" />
      </mesh>
      {/* the three roller trunnions */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2
        return (
          <mesh key={i} position={[0.06, Math.cos(a) * 0.17, Math.sin(a) * 0.17]} rotation={[0, 0, HALF]}>
            <cylinderGeometry args={[0.055, 0.055, 0.13, 16]} />
            <Mat k="machined" />
          </mesh>
        )
      })}
    </group>
  )
}

export function CVBoot({
  rStart = 0.24,
  rEnd = 0.1,
  length = 0.5,
  position,
  rotation,
}: {
  rStart?: number
  rEnd?: number
  length?: number
  position?: V3
  rotation?: V3
}) {
  const geo = useMemo(() => bellows(rStart, rEnd, length, 5, 0.035), [rStart, rEnd, length])
  return (
    <mesh geometry={geo} position={position} rotation={rotation}>
      <Mat k="rubber" side={THREE.DoubleSide} />
    </mesh>
  )
}

export function BootClamp({ r = 0.13, position, rotation }: { r?: number; position?: V3; rotation?: V3 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={[r, 0.018, 8, 24]} />
      <Mat k="zinc" />
    </mesh>
  )
}

/* ==================================================== accessory drive */

/** Generic belt-driven accessory: a body behind its pulley. */
export function Accessory({
  w = 0.5,
  h = 0.44,
  d = 0.5,
  label,
  position,
  mat = 'aluminium',
}: {
  w?: number
  h?: number
  d?: number
  label?: string
  position?: V3
  mat?: MatKey
}) {
  return (
    <group position={position} name={label}>
      <mesh position={[0, 0, -d / 2 - 0.12]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <Mat k={mat} />
      </mesh>
      <mesh position={[0, 0, -d - 0.14]} rotation={[HALF, 0, 0]}>
        <cylinderGeometry args={[h * 0.44, h * 0.44, 0.1, 22]} />
        <Mat k={mat} />
      </mesh>
    </group>
  )
}

/** Smooth multi-rib belt — same path solver as the timing belt, no teeth. */
export function SerpentineBelt({
  pulleys,
  width = 0.24,
  thickness = 0.05,
}: {
  pulleys: PulleyNode[]
  width?: number
  thickness?: number
}) {
  const geo = useMemo(() => {
    const path = beltPath(pulleys, 16)
    return beltGeometry(path, width, thickness, 0.05, 0)
  }, [pulleys, width, thickness])
  return (
    <mesh geometry={geo} castShadow>
      <Mat k="belt" />
    </mesh>
  )
}

export { type PulleyNode }
