import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { roundedPlate } from '../geo'
import { Bolt, DrainPan, TransFilter, TransPan, ValveBody } from '../parts'

const HALF = Math.PI / 2

/** Bolt ring around the pan flange — matches TransPan's hole pattern. */
const PAN_BOLTS: [number, number][] = (() => {
  const out: [number, number][] = []
  const n = 8
  for (let i = 0; i < n; i++) {
    const x = -0.75 + (i * 1.5) / (n - 1)
    out.push([x, -0.62], [x, 0.62])
  }
  for (let i = 1; i < 4; i++) {
    const z = -0.62 + (i * 1.24) / 4
    out.push([-0.82, z], [0.82, z])
  }
  return out
})()

/**
 * Automatic transmission pan, filter and valve body, viewed from under the
 * truck. The transmission is upside down relative to how you see it on a
 * bench — this is deliberately the on-the-lift orientation.
 */
export function TransService() {
  const gasket = useMemo(
    () =>
      roundedPlate(
        1.78,
        1.38,
        0.14,
        0.025,
        PAN_BOLTS.map(([x, z]) => ({ x, y: z, r: 0.026 })),
      ),
    [],
  )

  return (
    <group position={[0, 0.3, 0]}>
      {/* ------------------------------------------------- transmission case */}
      <Part id="case" scenery>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[1.9, 0.95, 1.5]} />
          <meshStandardMaterial
            color="#4e5660"
            metalness={0.5}
            roughness={0.6}
            transparent
            opacity={0.11}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[1.86, 0.08, 1.46]} />
          <Mat k="aluminium" />
        </mesh>
      </Part>

      {/* ---------------------------------------------------- valve body */}
      <Part id="valveBody" dir={[0, 1.4, 0]}>
        <ValveBody position={[0, -0.02, 0]} />
      </Part>

      {/* -------------------------------------------------------- filter */}
      <Part id="filter" dir={[0, -1.5, 0]}>
        <TransFilter position={[0, -0.4, 0]} />
      </Part>

      {/* -------------------------------------------------- gasket + pan */}
      <Part id="gasket" dir={[0, -2.1, 0]}>
        <mesh geometry={gasket} position={[0, -0.56, 0]} rotation={[HALF, 0, 0]}>
          <Mat k="gasket" />
        </mesh>
      </Part>

      <Part id="pan" dir={[0, -2.9, 0]}>
        <TransPan position={[0, -0.62, 0]} />
      </Part>

      <Part id="panBolts" dir={[0, -3.8, 0]}>
        {PAN_BOLTS.map(([x, z], i) => (
          <Bolt key={i} d={0.05} len={0.22} head="hex" position={[x, -0.72, z]} rotation={[Math.PI, 0, 0]} />
        ))}
      </Part>

      {/* --------------------------------------------------- magnets in pan */}
      <Part id="magnets" dir={[1.6, -2.4, 0]}>
        {[
          [-0.4, 0.25],
          [0.4, -0.25],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.86, z]}>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 20]} />
            <Mat k="blackOxide" />
          </mesh>
        ))}
      </Part>

      {/* ---------------------------------------------------- catch basin */}
      <Part id="catchPan" scenery>
        <DrainPan position={[0, -2.1, 0]} />
      </Part>
    </group>
  )
}
