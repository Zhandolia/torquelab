import { Part } from '../Part'
import { Mat } from '../materials'
import {
  BootClamp,
  CVBoot,
  CVInnerJoint,
  CVOuterJoint,
  HubBearing,
  Knuckle,
  Nut,
} from '../parts'

const HALF = Math.PI / 2

/**
 * Front driveshaft on a transverse FWD car, laid out along X.
 * Transmission at −X, wheel hub at +X, so the shaft reads left-to-right in the
 * same direction the torque travels.
 */
export function CVAxle() {
  return (
    <group position={[0, 0.1, 0]}>
      {/* ------------------------------------------------ transmission (ref) */}
      <Part id="transCase" scenery>
        <mesh position={[-2.25, -0.1, 0]}>
          <boxGeometry args={[1.0, 1.2, 1.0]} />
          <meshStandardMaterial
            color="#4e5660"
            metalness={0.5}
            roughness={0.6}
            transparent
            opacity={0.13}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[-1.82, 0, 0]} rotation={[0, 0, HALF]}>
          <cylinderGeometry args={[0.3, 0.3, 0.16, 24]} />
          <Mat k="aluminium" />
        </mesh>
      </Part>

      {/* ------------------------------------------------- inner tripod joint */}
      <Part id="innerJoint" dir={[-1.9, 0.5, 0]}>
        <CVInnerJoint position={[-1.5, 0, 0]} />
      </Part>

      <Part id="circlip" dir={[-2.4, 1.0, 0]}>
        <mesh position={[-1.78, 0, 0]} rotation={[0, 0, HALF]}>
          <torusGeometry args={[0.1, 0.014, 8, 22, Math.PI * 1.6]} />
          <Mat k="spring" />
        </mesh>
      </Part>

      <Part id="innerBoot" dir={[-1.2, 1.5, 0]}>
        <CVBoot rStart={0.25} rEnd={0.13} length={0.58} position={[-1.1, 0, 0]} rotation={[0, 0, -HALF]} />
      </Part>

      <Part id="innerClamps" dir={[-1.2, 2.1, 0]}>
        <BootClamp r={0.26} position={[-1.37, 0, 0]} rotation={[0, HALF, 0]} />
        <BootClamp r={0.14} position={[-0.83, 0, 0]} rotation={[0, HALF, 0]} />
      </Part>

      {/* ------------------------------------------------------- the shaft */}
      <Part id="shaft">
        <mesh rotation={[0, 0, HALF]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.8, 24]} />
          <Mat k="steel" />
        </mesh>
      </Part>

      <Part id="dampener" dir={[0, -1.6, 0]}>
        <mesh position={[-0.25, 0, 0]} rotation={[0, 0, HALF]}>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 24]} />
          <Mat k="rubber" />
        </mesh>
        <mesh position={[-0.25, 0, 0]} rotation={[0, 0, HALF]}>
          <torusGeometry args={[0.21, 0.02, 8, 26]} />
          <Mat k="zinc" />
        </mesh>
      </Part>

      {/* -------------------------------------------------- outer boot + joint */}
      <Part id="outerBoot" dir={[1.2, 1.5, 0]}>
        <CVBoot rStart={0.13} rEnd={0.26} length={0.5} position={[1.0, 0, 0]} rotation={[0, 0, -HALF]} />
      </Part>

      <Part id="outerClamps" dir={[1.2, 2.1, 0]}>
        <BootClamp r={0.14} position={[0.76, 0, 0]} rotation={[0, HALF, 0]} />
        <BootClamp r={0.27} position={[1.24, 0, 0]} rotation={[0, HALF, 0]} />
      </Part>

      <Part id="outerJoint" dir={[1.9, 0.5, 0]}>
        <CVOuterJoint position={[1.5, 0, 0]} />
      </Part>

      {/* ------------------------------------------------------ hub + knuckle */}
      {/* Both are modelled facing +Z, so they rotate a quarter turn to sit on
          an axle that runs along X. */}
      <Part id="hub" dir={[2.4, 0, 0]}>
        <group position={[1.92, 0, 0]} rotation={[0, HALF, 0]}>
          <HubBearing />
        </group>
      </Part>

      <Part id="knuckle" dir={[2.4, -1.4, 0]}>
        <Knuckle position={[2.08, 0, 0]} rotation={[0, HALF, 0]} />
      </Part>

      <Part id="axleNut" dir={[3.2, 0, 0]}>
        <Nut d={0.17} position={[2.0, 0, 0]} rotation={[0, 0, HALF]} />
        <mesh position={[1.92, 0, 0]} rotation={[0, 0, HALF]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />
          <Mat k="zinc" />
        </mesh>
      </Part>
    </group>
  )
}
