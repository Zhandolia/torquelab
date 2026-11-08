import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { discWithHoles } from '../geo'
import {
  BrakeDrum,
  BrakeShoe,
  HoldDownPin,
  LugNut,
  StarAdjuster,
  Stud,
  TensionSpring,
  WheelCylinder,
} from '../parts'

const HALF = Math.PI / 2

/**
 * Rear drum brake, leading/trailing design, viewed from outboard with the
 * drum pulled. +Z is out of the wheel well toward you.
 *
 * Geometry note: the shoes arc around a vertical axis through the centre, the
 * wheel cylinder sits at the top and the adjuster bridges the bottom. That is
 * the layout almost every small-car rear drum uses, and it is what makes the
 * spring order legible once you explode it.
 */
export function DrumBrake() {
  const backing = useMemo(
    () =>
      discWithHoles(1.62, 0.36, 0.035, [
        { r: 0.05, count: 4, dist: 0.62, offset: Math.PI / 4 },
      ]),
    [],
  )
  const hubFace = useMemo(() => discWithHoles(0.74, 0.3, 0.07, [{ r: 0.036, count: 4, dist: 0.26 }]), [])

  return (
    <group>
      {/* -------------------------------------------------- backing plate */}
      <Part id="backingPlate" dir={[0, 0, -1.6]}>
        <mesh geometry={backing} position={[0, 0, -0.32]} receiveShadow>
          <Mat k="steel" />
        </mesh>
        {/* raised shoe contact pads the shoes slide on */}
        {[0.6, 1.25, 1.9, 2.55, 3.2, 3.85, 4.5, 5.15].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.62, Math.sin(a) * 0.62, -0.29]}>
            <boxGeometry args={[0.1, 0.1, 0.03]} />
            <Mat k="machined" />
          </mesh>
        ))}
      </Part>

      {/* ------------------------------------------------------ hub flange */}
      <Part id="hub" dir={[0, 0, -1.0]}>
        <mesh geometry={hubFace} position={[0, 0, -0.14]}>
          <Mat k="machined" />
        </mesh>
        <mesh position={[0, 0, -0.24]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 0.18, 26]} />
          <Mat k="steel" />
        </mesh>
        {Array.from({ length: 4 }, (_, i) => {
          const a = (i / 4) * Math.PI * 2
          return <Stud key={i} position={[Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0.02]} />
        })}
      </Part>

      {/* --------------------------------------------------- wheel cylinder */}
      <Part id="wheelCylinder" dir={[0, 1.8, -0.6]}>
        <WheelCylinder position={[0, 0.72, -0.2]} />
      </Part>

      <Part id="brakeLine" dir={[0, 1.4, -1.8]}>
        <mesh position={[0, 0.76, -0.4]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.028, 0.028, 0.6, 12]} />
          <Mat k="machined" />
        </mesh>
      </Part>

      {/* -------------------------------------------------------- the shoes */}
      <Part id="shoeLeading" dir={[-1.9, 0.2, 0.3]}>
        <BrakeShoe r={0.62} span={2.15} start={1.85} position={[0, 0, -0.08]} />
      </Part>
      <Part id="shoeTrailing" dir={[1.9, 0.2, 0.3]}>
        <BrakeShoe r={0.62} span={2.15} start={-1.3} position={[0, 0, -0.08]} />
      </Part>

      {/* --------------------------------------------------- hold-down kits */}
      <Part id="holdDowns" dir={[0, 0, 2.0]}>
        <HoldDownPin position={[-0.6, 0.06, -0.12]} />
        <HoldDownPin position={[0.6, 0.06, -0.12]} />
      </Part>

      {/* ------------------------------------------------------- the springs */}
      <Part id="returnSprings" dir={[0, 2.4, 0.8]}>
        <TensionSpring from={[-0.33, 0.58, -0.08]} to={[0.33, 0.58, -0.08]} coils={16} r={0.05} />
        <TensionSpring
          from={[-0.3, 0.44, -0.02]}
          to={[0.3, 0.44, -0.02]}
          coils={14}
          r={0.042}
          mat="blackOxide"
        />
      </Part>

      <Part id="adjusterSpring" dir={[0, -2.2, 0.8]}>
        <TensionSpring from={[-0.3, -0.5, -0.02]} to={[0.3, -0.5, -0.02]} coils={13} r={0.042} />
      </Part>

      {/* ---------------------------------------------------- star adjuster */}
      <Part id="adjuster" dir={[0, -2.0, 0.4]}>
        <StarAdjuster len={0.62} position={[0, -0.66, -0.1]} />
      </Part>

      <Part id="adjusterLever" dir={[-1.4, -1.6, 0.9]}>
        <mesh position={[-0.28, -0.46, 0.02]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.42, 0.055, 0.025]} />
          <Mat k="steel" />
        </mesh>
      </Part>

      {/* ------------------------------------------------- parking brake kit */}
      <Part id="parkingLever" dir={[1.6, 0.6, 1.2]}>
        <mesh position={[0.46, 0.2, 0.04]} rotation={[0, 0, 1.2]}>
          <boxGeometry args={[0.5, 0.07, 0.03]} />
          <Mat k="steel" />
        </mesh>
        <mesh position={[0.6, 0.42, 0.04]}>
          <cylinderGeometry args={[0.04, 0.04, 0.09, 14]} />
          <Mat k="machined" />
        </mesh>
      </Part>

      <Part id="parkingCable" dir={[1.2, -1.2, -1.4]}>
        <mesh position={[0.68, -0.3, -0.26]} rotation={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
          <Mat k="steel" />
        </mesh>
        <mesh position={[0.86, -0.56, -0.26]} rotation={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 14]} />
          <Mat k="blackOxide" />
        </mesh>
      </Part>

      <Part id="strut" dir={[0, 1.2, 1.4]}>
        <mesh position={[0, 0.34, 0.04]} rotation={[0, 0, HALF]}>
          <boxGeometry args={[0.05, 1.04, 0.035]} />
          <Mat k="steel" />
        </mesh>
      </Part>

      {/* ---------------------------------------------------------- the drum */}
      <Part id="drum" dir={[0, 0, 2.6]}>
        <BrakeDrum od={1.5} depth={0.52} lugs={4} position={[0, 0, 0.12]} />
      </Part>

      <Part id="lugNuts" dir={[0, 0, 3.4]}>
        {Array.from({ length: 4 }, (_, i) => {
          const a = (i / 4) * Math.PI * 2
          return <LugNut key={i} position={[Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0.42]} rotation={[HALF, 0, 0]} />
        })}
      </Part>
    </group>
  )
}
