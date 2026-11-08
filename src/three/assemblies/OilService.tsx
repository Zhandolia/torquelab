import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { routedTube } from '../geo'
import { Bolt, DrainPan, OilFilter, OilPan, Washer } from '../parts'

const HALF = Math.PI / 2

/**
 * Oil pan, drain plug and spin-on filter, viewed from under the front of the
 * car. The stream of old oil is modelled so the step about aiming the drain
 * pan actually shows what it is talking about.
 */
export function OilService() {
  const stream = useMemo(
    () =>
      routedTube(
        [
          [0.1, -0.52, 0.3],
          [0.06, -0.9, 0.28],
          [0.0, -1.4, 0.22],
          [-0.04, -1.86, 0.16],
        ],
        0.028,
        40,
      ),
    [],
  )

  return (
    <group position={[0, 0.5, 0]}>
      {/* ------------------------------------------------------- block (ref) */}
      <Part id="block" scenery>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.7, 1.0, 1.1]} />
          <meshStandardMaterial
            color="#4e5660"
            metalness={0.5}
            roughness={0.6}
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      </Part>

      {/* --------------------------------------------------------- the pan */}
      <Part id="oilPan" dir={[0, -1.0, 0]}>
        <OilPan position={[0, 0.1, 0]} />
      </Part>

      {/* -------------------------------------------------------- drain plug */}
      <Part id="drainPlug" dir={[0.4, -1.9, 0.5]}>
        <Bolt d={0.12} len={0.2} head="hex" position={[0.1, -0.42, 0.3]} rotation={[Math.PI, 0, 0]} />
      </Part>

      <Part id="crushWasher" dir={[1.3, -1.3, 0.6]}>
        <Washer od={0.2} id={0.122} t={0.016} mat="copper" position={[0.1, -0.4, 0.3]} rotation={[HALF, 0, 0]} />
      </Part>

      {/* --------------------------------------------------------- the filter */}
      <Part id="filter" dir={[2.0, 0.2, 1.2]}>
        <OilFilter r={0.2} h={0.56} position={[0.95, 0.42, 0.45]} rotation={[0.25, 0, 0.3]} />
      </Part>

      <Part id="filterGasket" dir={[2.4, -0.3, 1.5]}>
        <mesh position={[0.88, 0.14, 0.42]} rotation={[0.25, 0, 0.3]}>
          <torusGeometry args={[0.135, 0.022, 10, 28]} />
          <Mat k="rubber" />
        </mesh>
      </Part>

      <Part id="filterMount" dir={[0, 0, 0]}>
        <mesh position={[0.84, 0.05, 0.4]} rotation={[0.25, 0, 0.3]}>
          <cylinderGeometry args={[0.17, 0.17, 0.12, 24]} />
          <Mat k="aluminium" />
        </mesh>
        <mesh position={[0.84, 0.08, 0.4]} rotation={[0.25, 0, 0.3]}>
          <cylinderGeometry args={[0.07, 0.07, 0.2, 18]} />
          <Mat k="machined" />
        </mesh>
      </Part>

      {/* --------------------------------------------------------- oil stream */}
      <Part id="stream" dir={[0, 0, 0]}>
        <mesh geometry={stream}>
          <Mat k="fluid" />
        </mesh>
      </Part>

      {/* ---------------------------------------------------------- drain pan */}
      <Part id="drainPan" dir={[0, -0.6, 0]}>
        <DrainPan position={[-0.05, -2.0, 0.15]} />
      </Part>

      {/* ----------------------------------------------------------- fill cap */}
      <Part id="fillCap" dir={[0, 2.4, 0]}>
        <group position={[-0.4, 1.28, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.17, 0.17, 0.14, 26]} />
            <Mat k="plastic" color="#1b1e22" />
          </mesh>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 0.17, 0, Math.sin(a) * 0.17]} rotation={[0, -a, 0]}>
                <boxGeometry args={[0.02, 0.13, 0.03]} />
                <Mat k="plastic" color="#141619" />
              </mesh>
            )
          })}
        </group>
      </Part>

      {/* ----------------------------------------------------------- dipstick */}
      <Part id="dipstick" dir={[0, 2.0, -1.2]}>
        <mesh position={[0.5, 1.2, -0.3]} rotation={[0, 0, -0.12]}>
          <cylinderGeometry args={[0.035, 0.035, 0.9, 14]} />
          <Mat k="steel" />
        </mesh>
        <mesh position={[0.56, 1.68, -0.3]}>
          <torusGeometry args={[0.1, 0.03, 10, 22]} />
          <Mat k="paint" color="#c9a227" />
        </mesh>
      </Part>
    </group>
  )
}
