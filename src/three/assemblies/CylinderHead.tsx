import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { roundedPlate } from '../geo'
import { Bolt, CylinderHead as Head, EngineBlock, HeadGasket } from '../parts'

const HALF = Math.PI / 2
const BORES = 4
const SPACING = 0.56

/**
 * The ten head bolts, numbered in the factory tightening sequence.
 * Position index → bolt number. The sequence works from the centre of the head
 * outward in a spiral, which is what keeps the gasket evenly crushed.
 */
export const HEAD_BOLTS: { id: string; seq: number; x: number; z: number }[] = (() => {
  const xs = Array.from({ length: BORES + 1 }, (_, i) => -(BORES * SPACING) / 2 + i * SPACING)
  // grid order: [col, row] with row -1 = intake side, +1 = exhaust side
  const grid: [number, number][] = []
  for (const x of xs) {
    grid.push([x, -0.33], [x, 0.33])
  }
  // factory spiral: centre pair first, then alternate outward
  const order = [4, 5, 2, 7, 0, 9, 1, 8, 3, 6]
  return order.map((gi, n) => ({
    id: `bolt${n + 1}`,
    seq: n + 1,
    x: grid[gi][0],
    z: grid[gi][1],
  }))
})()

export function CylinderHeadAssembly() {
  const camCover = useMemo(
    () => roundedPlate(BORES * SPACING + 0.3, 0.8, 0.12, 0.08),
    [],
  )

  return (
    <group position={[0, -0.1, 0]}>
      {/* ------------------------------------------------------------- block */}
      <Part id="block" dir={[0, -0.4, 0]}>
        <EngineBlock bores={BORES} spacing={SPACING} position={[0, -1.0, 0]} />
      </Part>

      {/* ------------------------------------------------------ head gasket */}
      <Part id="gasket" dir={[0, 1.0, 0]}>
        <HeadGasket bores={BORES} spacing={SPACING} position={[0, -0.26, 0]} />
      </Part>

      {/* --------------------------------------------------------------- head */}
      <Part id="head" dir={[0, 2.1, 0]}>
        <Head bores={BORES} spacing={SPACING} position={[0, -0.22, 0]} />
      </Part>

      {/* --------------------------------------------------------- head bolts */}
      {HEAD_BOLTS.map((b) => (
        <Part key={b.id} id={b.id} dir={[0, 3.2, 0]}>
          <Bolt d={0.075} len={0.78} head="cap" position={[b.x, 0.46, b.z]} />
        </Part>
      ))}

      {/* --------------------------------------------------------- cam cover */}
      <Part id="camCover" dir={[0, 3.0, 0]}>
        <mesh geometry={camCover} position={[0, 0.58, 0]} rotation={[HALF, 0, 0]}>
          <Mat k="aluminium" />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[BORES * SPACING + 0.26, 0.2, 0.74]} />
          <Mat k="aluminium" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[BORES * SPACING + 0.32, 0.03, 0.82]} />
          <Mat k="rubber" />
        </mesh>
      </Part>

      {/* ------------------------------------------------------ intake side */}
      <Part id="intake" dir={[0, 0.4, -2.6]}>
        <group position={[0, 0.0, -0.66]}>
          <mesh>
            <boxGeometry args={[BORES * SPACING + 0.1, 0.44, 0.34]} />
            <Mat k="plastic" />
          </mesh>
          {Array.from({ length: BORES }, (_, i) => (
            <mesh
              key={i}
              position={[-((BORES - 1) * SPACING) / 2 + i * SPACING, 0.0, 0.3]}
              rotation={[HALF, 0, 0]}
            >
              <cylinderGeometry args={[0.13, 0.13, 0.3, 20]} />
              <Mat k="plastic" />
            </mesh>
          ))}
        </group>
      </Part>

      {/* ----------------------------------------------------- exhaust side */}
      <Part id="exhaust" dir={[0, 0.2, 2.6]}>
        <group position={[0, -0.1, 0.62]}>
          {Array.from({ length: BORES }, (_, i) => (
            <mesh
              key={i}
              position={[-((BORES - 1) * SPACING) / 2 + i * SPACING, 0.05, 0]}
              rotation={[HALF, 0, 0]}
            >
              <cylinderGeometry args={[0.1, 0.1, 0.4, 18]} />
              <Mat k="castIron" />
            </mesh>
          ))}
          <mesh position={[0, -0.18, 0.1]}>
            <boxGeometry args={[BORES * SPACING, 0.18, 0.3]} />
            <Mat k="castIron" />
          </mesh>
        </group>
      </Part>
    </group>
  )
}
