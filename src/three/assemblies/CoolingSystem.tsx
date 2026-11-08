import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { discWithHoles, routedTube } from '../geo'
import { Bolt, Hose, HoseClamp, Radiator, Thermostat } from '../parts'

const HALF = Math.PI / 2

/**
 * Engine cooling circuit, looking at the front of a transverse four-cylinder.
 * The radiator sits at +Z (the front of the car), the engine behind it, and
 * the hoses follow the actual flow path so the thermostat's position in the
 * loop is obvious.
 */
export function CoolingSystem() {
  const upper = useMemo<[number, number, number][]>(
    () => [
      [-0.95, 0.74, 1.15],
      [-0.4, 0.95, 0.95],
      [0.25, 0.92, 0.55],
      [0.62, 0.72, 0.18],
    ],
    [],
  )
  const lower = useMemo<[number, number, number][]>(
    () => [
      [0.95, -0.66, 1.15],
      [0.45, -0.85, 0.9],
      [-0.2, -0.82, 0.5],
      [-0.6, -0.6, 0.15],
    ],
    [],
  )
  const overflowLine = useMemo<[number, number, number][]>(
    () => [
      [-1.15, 0.92, 1.2],
      [-1.5, 1.0, 1.0],
      [-1.75, 0.75, 0.75],
    ],
    [],
  )
  const fanRing = useMemo(() => discWithHoles(1.28, 1.16, 0.08), [])
  const overflowTube = useMemo(() => routedTube(overflowLine, 0.04, 36), [overflowLine])

  return (
    <group position={[0, 0.1, -0.3]}>
      {/* --------------------------------------------------- engine (ref) */}
      <Part id="block" scenery>
        <mesh position={[0, 0, -0.5]}>
          <boxGeometry args={[1.9, 1.6, 1.0]} />
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

      {/* ----------------------------------------------------- the radiator */}
      <Part id="radiator" dir={[0, 0, 2.6]}>
        <Radiator w={2.7} h={1.7} position={[0, 0, 1.25]} />
      </Part>

      <Part id="radCap" dir={[0, 1.6, 1.8]}>
        <mesh position={[-1.05, 0.78, 1.25]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.14, 24]} />
          <Mat k="plastic" color="#1b1e22" />
        </mesh>
        <mesh position={[-1.05, 0.66, 1.25]}>
          <cylinderGeometry args={[0.11, 0.11, 0.12, 20]} />
          <Mat k="machined" />
        </mesh>
      </Part>

      {/* ---------------------------------------------------- cooling fans */}
      <Part id="fanShroud" dir={[0, 0, -1.9]}>
        <mesh geometry={fanRing} position={[0, 0, 0.92]}>
          <Mat k="plastic" />
        </mesh>
        <mesh position={[0, 0, 0.92]}>
          <boxGeometry args={[2.6, 1.6, 0.04]} />
          <Mat k="plastic" color="#1a1d21" />
        </mesh>
      </Part>

      <Part id="fan" dir={[0, 0, -2.6]}>
        {Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0.86]} rotation={[0.4, 0, a + HALF]}>
              <boxGeometry args={[0.44, 0.3, 0.025]} />
              <Mat k="plastic" color="#23262b" />
            </mesh>
          )
        })}
        <mesh position={[0, 0, 0.86]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 20]} />
          <Mat k="blackOxide" />
        </mesh>
      </Part>

      {/* --------------------------------------------------------- the hoses */}
      <Part id="upperHose" dir={[0, 1.4, 1.0]}>
        <Hose points={upper} radius={0.11} />
        <HoseClamp r={0.13} position={[-0.9, 0.76, 1.1]} rotation={[0, HALF, 0.4]} />
        <HoseClamp r={0.13} position={[0.58, 0.71, 0.24]} rotation={[0, 0.3, 0.6]} />
      </Part>

      <Part id="lowerHose" dir={[0, -1.4, 1.0]}>
        <Hose points={lower} radius={0.12} />
        <HoseClamp r={0.14} position={[0.9, -0.68, 1.1]} rotation={[0, HALF, -0.4]} />
        <HoseClamp r={0.14} position={[-0.56, -0.62, 0.2]} rotation={[0, -0.3, -0.5]} />
      </Part>

      {/* --------------------------------------------- thermostat + housing */}
      <Part id="tstatHousing" dir={[1.3, 0.9, 0.9]}>
        <mesh position={[0.72, 0.68, 0.0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.2, 0.22, 0.26, 24]} />
          <Mat k="aluminium" />
        </mesh>
        {[-1, 1].map((s) => (
          <Bolt key={s} d={0.045} len={0.2} position={[0.72 + s * 0.16, 0.56, 0.12]} rotation={[HALF, 0, 0]} />
        ))}
      </Part>

      <Part id="thermostat" dir={[1.9, 1.4, 0.4]}>
        <Thermostat position={[0.72, 0.68, 0.02]} rotation={[0, 0, -0.5]} />
      </Part>

      <Part id="tstatGasket" dir={[1.6, 1.1, 0.7]}>
        <mesh position={[0.72, 0.68, -0.1]} rotation={[0, 0, -0.5]}>
          <torusGeometry args={[0.2, 0.022, 10, 28]} />
          <Mat k="rubber" />
        </mesh>
      </Part>

      {/* --------------------------------------------------- expansion tank */}
      <Part id="overflow" dir={[-2.4, 0.8, 0.6]}>
        <mesh position={[-1.85, 0.4, 0.7]}>
          <boxGeometry args={[0.52, 0.72, 0.42]} />
          <Mat k="glass" color="#b9c4ce" />
        </mesh>
        <mesh position={[-1.85, 0.3, 0.7]}>
          <boxGeometry args={[0.46, 0.4, 0.36]} />
          <Mat k="fluid" color="#2c6ea8" />
        </mesh>
        <mesh position={[-1.85, 0.82, 0.7]}>
          <cylinderGeometry args={[0.13, 0.13, 0.14, 20]} />
          <Mat k="plastic" color="#1b1e22" />
        </mesh>
      </Part>

      <Part id="overflowHose" dir={[-1.8, 1.0, 0.8]}>
        <mesh geometry={overflowTube}>
          <Mat k="rubber" />
        </mesh>
      </Part>

      {/* ------------------------------------------------------ bleed point */}
      <Part id="bleeder" dir={[0.6, 2.0, 0.6]}>
        <mesh position={[0.3, 0.96, 0.2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.16, 14]} />
          <Mat k="brass" />
        </mesh>
        <mesh position={[0.3, 1.06, 0.2]}>
          <boxGeometry args={[0.13, 0.05, 0.05]} />
          <Mat k="plastic" color="#c9a227" />
        </mesh>
      </Part>

      {/* ------------------------------------------------------- water pump */}
      <Part id="waterPump" dir={[-1.6, -1.4, -0.6]}>
        <mesh position={[-0.74, -0.5, -0.18]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.2, 26]} />
          <Mat k="aluminium" />
        </mesh>
        <mesh position={[-0.74, -0.5, -0.02]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.18, 18]} />
          <Mat k="machined" />
        </mesh>
      </Part>
    </group>
  )
}
