import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { discWithHoles } from '../geo'
import {
  Bolt,
  BrakePad,
  Caliper,
  CaliperBracket,
  Hose,
  HubBearing,
  Knuckle,
  LugNut,
  ParkingLever,
  ScrewPiston,
  SlidePin,
} from '../parts'

const HALF = Math.PI / 2

/** Road wheel, five lug. Hidden once the procedure gets past step 2. */
function Wheel() {
  const face = useMemo(
    () =>
      discWithHoles(1.82, 0.56, 0.09, [
        { r: 0.04, count: 5, dist: 0.26 },
        { r: 0.16, count: 5, dist: 0.58, offset: Math.PI / 5 },
      ]),
    [],
  )
  return (
    <group>
      <mesh geometry={face} position={[0, 0, 0.2]}>
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0, 0, 0.02]} rotation={[HALF, 0, 0]}>
        <cylinderGeometry args={[0.93, 0.93, 0.42, 48, 1, true]} />
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0, 0, 0.04]} rotation={[HALF, 0, 0]}>
        <torusGeometry args={[1.12, 0.26, 18, 52]} />
        <Mat k="rubber" />
      </mesh>
    </group>
  )
}

/**
 * Rear disc brake corner with a cable-operated parking brake built into the
 * caliper, viewed from outboard. Rotor plane is XY; +Z points out of the wheel
 * well toward the viewer — the same convention as the front corner, so the
 * cameras read the same way.
 *
 * The thing that makes this corner different from the front one is the piston:
 * it rides on a ballscrew that the parking brake lever turns, so it has to be
 * wound back in rather than pressed.
 */
export function BrakeRear() {
  const shield = useMemo(() => discWithHoles(1.3, 0.78, 0.018), [])
  /* solid rotor — 10 mm of cast iron, no internal vanes */
  const rotorPlate = useMemo(() => discWithHoles(1.4, 0.7, 0.05), [])
  const rotorHat = useMemo(
    () => discWithHoles(0.76, 0.34, 0.26, [{ r: 0.036, count: 5, dist: 0.26 }]),
    [],
  )

  const hoseRoute = useMemo<[number, number, number][]>(
    () => [
      [-0.36, -0.3, -0.2],
      [-0.7, -0.6, -0.22],
      [-0.95, -1.05, -0.14],
      [-0.8, -1.5, 0.0],
    ],
    [],
  )

  const cableRoute = useMemo<[number, number, number][]>(
    () => [
      [-0.64, 0.42, -0.18],
      [-0.82, 0.7, -0.3],
      [-1.2, 0.92, -0.62],
      [-1.75, 0.98, -1.0],
    ],
    [],
  )

  return (
    <group>
      {/* -------------------------------------------- rear axle carrier */}
      <Part id="knuckle" dir={[-1.7, 0, -0.5]}>
        <Knuckle position={[0, 0, -0.56]} />
      </Part>

      {/* ------------------------------------------------------ hub */}
      <Part id="hub" dir={[0, 0, -1.1]}>
        <HubBearing position={[0, 0, -0.3]} />
      </Part>

      {/* --------------------------------------------- dust shield */}
      <Part id="shield" dir={[0, 0, -1.5]}>
        <mesh geometry={shield} position={[0, 0, -0.42]}>
          <Mat k="steel" />
        </mesh>
      </Part>

      {/* ---------------------------------------------------- rotor */}
      <Part id="rotor" dir={[0, 0, 1.3]}>
        <group>
          <mesh geometry={rotorPlate} castShadow receiveShadow>
            <Mat k="machined" />
          </mesh>
          <mesh geometry={rotorHat} position={[0, 0, -0.16]}>
            <Mat k="castIron" />
          </mesh>
          {/* locating screw */}
          <Bolt d={0.03} len={0.1} head="torx" position={[0.28, 0.17, -0.06]} rotation={[-HALF, 0, 0]} />
        </group>
      </Part>

      {/* ------------------------------------------ caliper bracket */}
      <Part id="bracket" dir={[-2.1, 0, -0.3]}>
        <CaliperBracket position={[-0.64, 0, -0.26]} />
      </Part>

      <Part id="bracketBolts" dir={[-0.4, 0, -2.2]}>
        {[-0.3, 0.3].map((y) => (
          <Bolt key={y} d={0.07} len={0.32} head="hex" position={[-0.97, y, -0.1]} rotation={[HALF, 0, 0]} />
        ))}
      </Part>

      {/* ----------------------------------------------------- pads */}
      <Part id="padInner" dir={[-0.7, 0, -1.5]}>
        <BrakePad position={[-0.64, 0, -0.13]} rotation={[0, 0, HALF]} w={0.56} h={0.34} wear={0.9} />
      </Part>
      <Part id="padOuter" dir={[-0.7, 0, 1.5]}>
        <BrakePad position={[-0.64, 0, 0.13]} rotation={[0, Math.PI, HALF]} w={0.56} h={0.34} wear={0.9} />
      </Part>
      <Part id="shims" dir={[-1.3, 0, 0]}>
        {[-0.2, 0.2].map((z) => (
          <mesh key={z} position={[-0.64, 0, z]} rotation={[0, 0, HALF]}>
            <boxGeometry args={[0.32, 0.54, 0.012]} />
            <Mat k="zinc" />
          </mesh>
        ))}
      </Part>

      {/* -------------------------------------------------- caliper */}
      <Part id="caliper" dir={[-2.3, 0.3, 0.4]}>
        <Caliper position={[-0.64, 0, 0.0]} pistons={0} width={0.7} />
      </Part>

      {/* the screw-in piston gets its own id — it is the whole lesson */}
      <Part id="piston" dir={[0, 0, 1.4]}>
        <ScrewPiston position={[-0.64, -0.02, -0.22]} bore={0.34} />
      </Part>

      <Part id="guidePins" dir={[0, 0, 2.4]}>
        {[-0.26, 0.26].map((y) => (
          <SlidePin key={y} position={[-0.68, y, -0.04]} />
        ))}
      </Part>

      {/* ------------------------------------------- parking brake */}
      <Part id="pbLever" dir={[-0.9, 1.1, -0.4]}>
        <ParkingLever position={[-0.64, 0.04, -0.3]} />
      </Part>

      <Part id="pbCable" dir={[-1.5, 1.1, -0.6]}>
        <Hose points={cableRoute} radius={0.05} mat="blackOxide" />
        {/* conduit end fitting where the cable enters the caliper bracket */}
        <mesh position={[-0.72, 0.7, -0.24]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 16]} />
          <Mat k="zinc" />
        </mesh>
        {/* locating clip on the carrier */}
        <mesh position={[-1.22, 0.92, -0.64]}>
          <boxGeometry args={[0.18, 0.12, 0.12]} />
          <Mat k="zinc" />
        </mesh>
      </Part>

      {/* --------------------------------------------- brake hose */}
      <Part id="hose" dir={[-0.8, -0.8, 0]}>
        <Hose points={hoseRoute} radius={0.042} />
        <mesh position={[-0.36, -0.28, -0.2]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.058, 0.058, 0.14, 6]} />
          <Mat k="blackOxide" />
        </mesh>
      </Part>

      {/* ----------------------------------------------- lug nuts */}
      <Part id="lugNuts" dir={[0, 0, 2.9]}>
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2
          return <LugNut key={i} position={[Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0.26]} rotation={[HALF, 0, 0]} />
        })}
      </Part>

      {/* -------------------------------------------------- wheel */}
      <Part id="wheel" dir={[0, 0, 3.4]}>
        <Wheel />
      </Part>
    </group>
  )
}
