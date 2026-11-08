import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { ring, roundedPlate, routedTube } from '../geo'
import { Bolt, Connector, IgnitionCoil, SparkPlug } from '../parts'

const HALF = Math.PI / 2

/** Cylinder spacing, opened out from the real 100 mm bore spacing for clarity. */
const SP = 0.84
const XS = [-1.5 * SP, -0.5 * SP, 0.5 * SP, 1.5 * SP]

const COVER_W = 4 * SP + 0.5
const COVER_D = 1.15

/**
 * Coil-on-plug ignition on one bank of a V8, seen from above and slightly
 * ahead. The cam cover lies in the XZ plane with +Y up, so the stack reads
 * top-down the way you meet it: engine cover, harness, coils, plugs, then the
 * cover and the head underneath.
 *
 * Four cylinders are shown. The other bank is identical and is left out so the
 * plug wells stay legible.
 */
export function Ignition() {
  const coverTop = useMemo(
    () =>
      roundedPlate(
        COVER_W,
        COVER_D,
        0.16,
        0.06,
        XS.map((x) => ({ x, y: 0, r: 0.2 })),
      ),
    [],
  )
  const well = useMemo(() => ring(0.2, 0.52, 0.03), [])
  const gasket = useMemo(() => roundedPlate(COVER_W, COVER_D, 0.16, 0.03), [])

  /** Primary harness running down the bank above the coils. */
  const harness = useMemo(
    () =>
      routedTube(
        [
          [XS[0] - 0.5, 0.48, -0.42],
          [XS[0] - 0.16, 0.44, -0.3],
          [XS[1] - 0.16, 0.44, -0.3],
          [XS[2] - 0.16, 0.44, -0.3],
          [XS[3] - 0.16, 0.44, -0.3],
          [XS[3] + 0.5, 0.5, -0.42],
        ],
        0.045,
      ),
    [],
  )

  const coverBoltSpots = useMemo(() => {
    const out: [number, number][] = []
    for (let i = 0; i < 5; i++) {
      const x = -COVER_W / 2 + 0.2 + (i * (COVER_W - 0.4)) / 4
      out.push([x, -0.46], [x, 0.46])
    }
    return out
  }, [])

  return (
    <group>
      {/* -------------------------------------------- head (reference) */}
      <Part id="head" dir={[0, -1.2, 0]} scenery>
        <mesh position={[0, -0.95, 0]} receiveShadow>
          <boxGeometry args={[COVER_W - 0.1, 0.84, COVER_D - 0.08]} />
          <Mat k="aluminium" />
        </mesh>
        {/* exhaust port stubs, purely so the bank has an orientation */}
        {XS.map((x) => (
          <mesh key={x} position={[x, -0.95, -COVER_D / 2 - 0.1]} rotation={[HALF, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.24, 20]} />
            <Mat k="castIron" />
          </mesh>
        ))}
      </Part>

      {/* ----------------------------------------------- intake plenum */}
      <Part id="intake" dir={[0, 0.4, 1.8]} scenery>
        <mesh position={[0, 0.1, COVER_D / 2 + 0.78]} castShadow>
          <boxGeometry args={[COVER_W - 0.5, 0.9, 1.2]} />
          <Mat k="plastic" />
        </mesh>
        {XS.map((x) => (
          <mesh key={x} position={[x, -0.3, COVER_D / 2 + 0.24]} rotation={[HALF, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.4, 20]} />
            <Mat k="plastic" />
          </mesh>
        ))}
      </Part>

      {/* ------------------------------------------------- spark plugs */}
      <Part id="plugs" dir={[0, 2.6, 0]}>
        {XS.map((x) => (
          <SparkPlug key={x} position={[x, -0.52, 0]} />
        ))}
      </Part>

      {/* ---------------------------------------------------- cam cover */}
      <Part id="camCover" dir={[0, 1.4, 0]}>
        <mesh geometry={coverTop} rotation={[HALF, 0, 0]} castShadow>
          <Mat k="aluminium" color="#8d939b" />
        </mesh>
        {/* perimeter walls down to the head */}
        {[-1, 1].map((s) => (
          <mesh key={`w${s}`} position={[0, -0.26, (s * COVER_D) / 2]}>
            <boxGeometry args={[COVER_W, 0.52, 0.06]} />
            <Mat k="aluminium" color="#8d939b" />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={`e${s}`} position={[(s * COVER_W) / 2, -0.26, 0]}>
            <boxGeometry args={[0.06, 0.52, COVER_D]} />
            <Mat k="aluminium" color="#8d939b" />
          </mesh>
        ))}
        {/* the four plug wells */}
        {XS.map((x) => (
          <mesh key={x} geometry={well} position={[x, -0.26, 0]} rotation={[HALF, 0, 0]}>
            <Mat k="aluminium" color="#8d939b" />
          </mesh>
        ))}
      </Part>

      <Part id="coverGasket" dir={[0, 1.0, 0]}>
        <mesh geometry={gasket} position={[0, -0.53, 0]} rotation={[HALF, 0, 0]}>
          <Mat k="gasket" />
        </mesh>
      </Part>

      <Part id="coverBolts" dir={[0, 2.0, 0]}>
        {coverBoltSpots.map(([x, z]) => (
          <Bolt key={`${x}-${z}`} d={0.05} len={0.46} head="flange" position={[x, 0.06, z]} />
        ))}
      </Part>

      {/* ------------------------------------------------- coil harness */}
      <Part id="coilConnectors" dir={[0, 1.4, -0.9]}>
        <mesh geometry={harness}>
          <Mat k="rubber" />
        </mesh>
        {XS.map((x) => (
          <Connector key={x} position={[x - 0.16, 0.38, -0.2]} rotation={[0.5, 0, 0]} />
        ))}
      </Part>

      {/* ------------------------------------------------------- coils */}
      <Part id="coils" dir={[0, 1.9, 0]}>
        {XS.map((x) => (
          <IgnitionCoil key={x} position={[x, 0.06, 0]} />
        ))}
      </Part>

      <Part id="coilBolts" dir={[0, 2.4, 0.3]}>
        {XS.map((x) => (
          <Bolt key={x} d={0.05} len={0.28} head="flange" position={[x + 0.18, 0.17, 0]} />
        ))}
      </Part>

      {/* ------------------------------------------------ engine cover */}
      <Part id="engineCover" dir={[0, 3.0, 0]}>
        <mesh position={[0, 1.1, 0.18]} castShadow>
          <boxGeometry args={[COVER_W + 0.3, 0.14, COVER_D + 1.5]} />
          <Mat k="plastic" />
        </mesh>
        {/* grommet posts it pushes onto */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[(s * (COVER_W - 0.6)) / 2, 0.88, 0.18]}>
            <cylinderGeometry args={[0.06, 0.06, 0.3, 14]} />
            <Mat k="rubber" />
          </mesh>
        ))}
      </Part>
    </group>
  )
}
