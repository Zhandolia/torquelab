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
  SlidePin,
} from '../parts'

const HALF = Math.PI / 2

/** Road wheel — hidden as soon as the procedure gets past step 2. */
function Wheel() {
  const face = useMemo(
    () =>
      discWithHoles(1.86, 0.58, 0.09, [
        { r: 0.04, count: 5, dist: 0.26 },
        { r: 0.17, count: 5, dist: 0.6, offset: Math.PI / 5 },
      ]),
    [],
  )
  return (
    <group>
      <mesh geometry={face} position={[0, 0, 0.2]}>
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0, 0, 0.02]} rotation={[HALF, 0, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.42, 48, 1, true]} />
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0, 0, 0.04]} rotation={[HALF, 0, 0]}>
        <torusGeometry args={[1.14, 0.26, 18, 52]} />
        <Mat k="rubber" />
      </mesh>
    </group>
  )
}

/**
 * Front disc brake corner, viewed from outboard.
 * Rotor plane is XY; +Z points out of the wheel well toward the viewer.
 */
export function BrakeFront() {
  const shield = useMemo(() => discWithHoles(1.46, 0.8, 0.018), [])
  const rotorPlates = useMemo(() => discWithHoles(1.41, 0.72, 0.055), [])
  const rotorHat = useMemo(() => discWithHoles(0.78, 0.34, 0.2, [{ r: 0.036, count: 5, dist: 0.26 }]), [])

  const hoseRoute = useMemo<[number, number, number][]>(
    () => [
      [-0.38, 0.28, -0.2],
      [-0.72, 0.52, -0.18],
      [-0.9, 0.95, -0.1],
      [-0.72, 1.35, 0.05],
    ],
    [],
  )

  return (
    <group>
      {/* ---------------------------------------------------------- knuckle */}
      <Part id="knuckle" dir={[-1.7, 0, -0.5]}>
        <Knuckle position={[0, 0, -0.56]} />
      </Part>

      {/* ------------------------------------------------------ hub bearing */}
      <Part id="hub" dir={[0, 0, -1.1]}>
        <HubBearing position={[0, 0, -0.3]} />
      </Part>

      {/* ------------------------------------------------------ dust shield */}
      <Part id="shield" dir={[0, 0, -1.5]}>
        <mesh geometry={shield} position={[0, 0, -0.44]}>
          <Mat k="steel" />
        </mesh>
      </Part>

      {/* ------------------------------------------------------------ rotor */}
      <Part id="rotor" dir={[0, 0, 1.3]}>
        <group>
          <mesh geometry={rotorPlates} position={[0, 0, 0.07]} castShadow receiveShadow>
            <Mat k="machined" />
          </mesh>
          <mesh geometry={rotorPlates} position={[0, 0, -0.07]} castShadow>
            <Mat k="machined" />
          </mesh>
          {Array.from({ length: 34 }, (_, i) => {
            const a = (i / 34) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 0.53, Math.sin(a) * 0.53, 0]} rotation={[0, 0, a]}>
                <boxGeometry args={[0.33, 0.026, 0.085]} />
                <Mat k="castIron" />
              </mesh>
            )
          })}
          <mesh geometry={rotorHat} position={[0, 0, -0.22]}>
            <Mat k="castIron" />
          </mesh>
          {/* retaining screw */}
          <Bolt d={0.03} len={0.1} head="torx" position={[0.28, 0.17, -0.12]} rotation={[-HALF, 0, 0]} />
        </group>
      </Part>

      {/* -------------------------------------------------- caliper bracket */}
      <Part id="bracket" dir={[-2.1, 0, -0.3]}>
        <CaliperBracket position={[-0.66, 0, -0.26]} />
      </Part>

      <Part id="bracketBolts" dir={[-0.4, 0, -2.2]}>
        {[-0.3, 0.3].map((y) => (
          <Bolt key={y} d={0.075} len={0.34} head="hex" position={[-0.99, y, -0.1]} rotation={[HALF, 0, 0]} />
        ))}
      </Part>

      {/* ------------------------------------------------------------- pads */}
      <Part id="padInner" dir={[-0.7, 0, -1.5]}>
        <BrakePad position={[-0.66, 0, -0.17]} rotation={[0, 0, HALF]} wear={0.95} />
      </Part>
      <Part id="padOuter" dir={[-0.7, 0, 1.5]}>
        <BrakePad position={[-0.66, 0, 0.17]} rotation={[0, Math.PI, HALF]} wear={0.95} />
      </Part>
      <Part id="shims" dir={[-1.3, 0, 0]}>
        {[-0.235, 0.235].map((z) => (
          <mesh key={z} position={[-0.66, 0, z]} rotation={[0, 0, HALF]}>
            <boxGeometry args={[0.36, 0.6, 0.012]} />
            <Mat k="zinc" />
          </mesh>
        ))}
      </Part>

      {/* ---------------------------------------------------------- caliper */}
      <Part id="caliper" dir={[-2.3, 0.3, 0.4]}>
        <Caliper position={[-0.66, 0, 0.04]} rotation={[0, 0, 0]} pistons={1} bore={0.34} />
      </Part>

      <Part id="guidePins" dir={[0, 0, 2.4]}>
        {[-0.28, 0.28].map((y) => (
          <SlidePin key={y} position={[-0.7, y, -0.02]} />
        ))}
      </Part>

      {/* ------------------------------------------------------ brake hose */}
      <Part id="hose" dir={[-0.8, 0.8, 0]}>
        <Hose points={hoseRoute} radius={0.045} />
        <mesh position={[-0.38, 0.26, -0.2]} rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.062, 0.062, 0.14, 6]} />
          <Mat k="blackOxide" />
        </mesh>
      </Part>

      {/* --------------------------------------------------------- lug nuts */}
      <Part id="lugNuts" dir={[0, 0, 2.9]}>
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2
          return <LugNut key={i} position={[Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0.26]} rotation={[HALF, 0, 0]} />
        })}
      </Part>

      {/* ------------------------------------------------------------ wheel */}
      <Part id="wheel" dir={[0, 0, 3.4]}>
        <Wheel />
      </Part>
    </group>
  )
}
