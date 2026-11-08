import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { discWithHoles, roundedPlate } from '../geo'
import {
  BallJoint,
  BearingPlate,
  Bolt,
  BumpStop,
  CoilSpring,
  ControlArm,
  Knuckle,
  Nut,
  StrutBody,
  SwayBarLink,
} from '../parts'

const HALF = Math.PI / 2

/** Ribbed dust boot over the piston rod. */
function DustBoot() {
  return (
    <group>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[0, i * 0.055, 0]}>
          <torusGeometry args={[0.095, 0.022, 8, 24]} />
          <Mat k="rubber" />
        </mesh>
      ))}
    </group>
  )
}

/**
 * MacPherson strut corner. Y is up; the strut axis leans slightly
 * so the camber angle is visible when you orbit.
 */
export function StrutFront() {
  const tower = useMemo(
    () => roundedPlate(1.5, 1.5, 0.2, 0.07, [{ x: 0, y: 0, r: 0.14 }]),
    [],
  )
  const upperSeat = useMemo(() => discWithHoles(0.78, 0.12, 0.05), [])
  const lowerSeat = useMemo(() => discWithHoles(0.74, 0.3, 0.05), [])

  return (
    <group rotation={[0, 0, -0.06]}>
      {/* ------------------------------------------------- strut tower (ref) */}
      <Part id="tower" scenery>
        <mesh geometry={tower} position={[0, 1.42, 0]} rotation={[HALF, 0, 0]}>
          <Mat k="trim" />
        </mesh>
      </Part>

      <Part id="upperNuts" dir={[0, 2.2, 0]}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2 + 0.5
          return <Nut key={i} d={0.055} position={[Math.cos(a) * 0.24, 1.49, Math.sin(a) * 0.24]} />
        })}
      </Part>

      {/* ------------------------------------------------------ centre nut */}
      <Part id="centreNut" dir={[0, 1.9, 0]}>
        <Nut d={0.07} position={[0, 1.3, 0]} />
        <mesh position={[0, 1.24, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.03, 20]} />
          <Mat k="zinc" />
        </mesh>
      </Part>

      {/* ----------------------------------------------------- upper mount */}
      <Part id="upperMount" dir={[0, 1.5, 0]}>
        <group position={[0, 1.15, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.26, 0.11, 30]} />
            <Mat k="steel" />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.09, 24]} />
            <Mat k="rubber" />
          </mesh>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2 + 0.5
            return (
              <mesh key={i} position={[Math.cos(a) * 0.24, 0.17, Math.sin(a) * 0.24]}>
                <cylinderGeometry args={[0.027, 0.027, 0.4, 12]} />
                <Mat k="steel" />
              </mesh>
            )
          })}
        </group>
      </Part>

      {/* -------------------------------------------------- thrust bearing */}
      <Part id="bearing" dir={[0.9, 1.0, 0]}>
        <BearingPlate position={[0, 1.0, 0]} />
      </Part>

      <Part id="upperSeat" dir={[0.9, 0.75, 0]}>
        <mesh geometry={upperSeat} position={[0, 0.93, 0]} rotation={[HALF, 0, 0]}>
          <Mat k="steel" />
        </mesh>
        <mesh position={[0, 0.89, 0]} rotation={[HALF, 0, 0]}>
          <torusGeometry args={[0.34, 0.03, 8, 30]} />
          <Mat k="rubber" />
        </mesh>
      </Part>

      {/* ---------------------------------------------------- bump stop set */}
      <Part id="bumpStop" dir={[1.3, 0.4, 0]}>
        <BumpStop position={[0, 0.6, 0]} />
      </Part>

      <Part id="dustBoot" dir={[1.7, 0.1, 0]}>
        <group position={[0, 0.42, 0]}>
          <DustBoot />
        </group>
      </Part>

      {/* -------------------------------------------------------- the spring */}
      <Part id="spring" dir={[-1.9, 0.2, 0]}>
        <CoilSpring coilR={0.37} height={1.12} coils={6.2} wire={0.08} position={[0, 0.4, 0]} />
      </Part>

      <Part id="lowerSeat" dir={[-1.1, -0.3, 0]}>
        <mesh geometry={lowerSeat} position={[0, -0.18, 0]} rotation={[HALF, 0, 0]}>
          <Mat k="steel" />
        </mesh>
      </Part>

      {/* --------------------------------------------------------- the strut */}
      <Part id="strut">
        <StrutBody len={1.5} position={[0, 0.2, 0]} />
      </Part>

      {/* ------------------------------------------------- strut-to-knuckle */}
      <Part id="strutBolts" dir={[0, 0, 2.2]}>
        {[-0.5, -0.74].map((y) => (
          <group key={y}>
            <Bolt d={0.07} len={0.42} position={[0, y, 0.3]} rotation={[-HALF, 0, 0]} />
            <Nut d={0.07} position={[0, y, -0.2]} rotation={[-HALF, 0, 0]} />
          </group>
        ))}
      </Part>

      {/* ------------------------------------------------------------ knuckle */}
      <Part id="knuckle" dir={[0.3, -2.0, 0]}>
        <Knuckle position={[0, -1.0, 0]} />
      </Part>

      {/* --------------------------------------------------------- ball joint */}
      <Part id="ballJoint" dir={[0, -1.5, 0]}>
        <BallJoint position={[0.02, -1.42, 0]} />
      </Part>

      {/* -------------------------------------------------------- lower arm */}
      <Part id="controlArm" dir={[0, -2.4, 0]}>
        <ControlArm position={[-0.55, -1.62, 0]} rotation={[HALF, 0, 0.06]} />
      </Part>

      {/* ------------------------------------------------------ sway bar link */}
      <Part id="swayLink" dir={[1.9, 0, 0]}>
        <SwayBarLink len={0.62} position={[0.5, -0.32, 0.1]} rotation={[0, 0, -0.2]} />
      </Part>

      <Part id="swayBar" scenery>
        <mesh position={[0.95, -0.72, 0.1]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.055, 0.055, 1.5, 18]} />
          <Mat k="steel" />
        </mesh>
      </Part>
    </group>
  )
}
