import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { roundedPlate } from '../geo'
import { Bolt, IdlerPulley, Pulley, Sprocket, Tensioner, TimingBelt, WaterPump, type PulleyNode } from '../parts'

const HALF = Math.PI / 2

/**
 * Front of a transverse 60° V6 with a toothed timing belt.
 * Everything lives in the XY plane with +Z toward the viewer, which is exactly
 * how you stand in front of the engine with the right-hand wheel removed.
 *
 * The belt path is solved from these pulley centres at runtime, so if you move
 * a sprocket the belt re-wraps correctly.
 */
const NODES: PulleyNode[] = [
  { x: 0, y: -0.15, r: 0.34 }, // crankshaft
  { x: 1.0, y: 0.35, r: 0.21 }, // idler
  { x: 1.3, y: 1.6, r: 0.6 }, // front bank cam
  { x: -1.3, y: 1.6, r: 0.6 }, // rear bank cam
  { x: -1.05, y: 0.4, r: 0.24 }, // tensioner
  { x: -0.55, y: -0.12, r: 0.3 }, // water pump
]

const [CRANK, IDLER, CAM_F, CAM_R, TENS, PUMP] = NODES

export function TimingV6() {
  const blockFace = useMemo(() => roundedPlate(3.9, 3.0, 0.3, 0.18), [])
  const upperCover = useMemo(
    () => roundedPlate(3.7, 1.5, 0.22, 0.08, [
      { x: -1.5, y: -0.5, r: 0.045 },
      { x: 1.5, y: -0.5, r: 0.045 },
      { x: 0, y: 0.58, r: 0.045 },
    ]),
    [],
  )
  const lowerCover = useMemo(
    () => roundedPlate(2.3, 1.5, 0.2, 0.08, [
      { x: -0.95, y: 0.55, r: 0.045 },
      { x: 0.95, y: 0.55, r: 0.045 },
      { x: 0, y: -0.58, r: 0.045 },
    ]),
    [],
  )

  return (
    <group position={[0, -0.6, 0]}>
      {/* ----------------------------------------------------- block backdrop */}
      <Part id="blockFace" scenery>
        <mesh geometry={blockFace} position={[0, 0.8, -0.45]}>
          <Mat k="aluminium" />
        </mesh>
        {/* cam journal bosses behind each cam sprocket */}
        {[CAM_F, CAM_R].map((n, i) => (
          <mesh key={i} position={[n.x, n.y, -0.3]} rotation={[HALF, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.26, 24]} />
            <Mat k="aluminium" />
          </mesh>
        ))}
      </Part>

      {/* --------------------------------------------------------- the covers */}
      <Part id="upperCover" dir={[0, 0.9, 2.3]}>
        <mesh geometry={upperCover} position={[0, 1.95, 0.42]}>
          <Mat k="plastic" />
        </mesh>
      </Part>

      <Part id="lowerCover" dir={[0, -0.8, 2.3]}>
        <mesh geometry={lowerCover} position={[0, 0.1, 0.42]}>
          <Mat k="plastic" />
        </mesh>
      </Part>

      <Part id="coverBolts" dir={[0, 0, 3.0]}>
        {[
          [-1.5, 1.45],
          [1.5, 1.45],
          [0, 2.53],
          [-0.95, 0.65],
          [0.95, 0.65],
          [0, -0.48],
        ].map(([x, y], i) => (
          <Bolt key={i} d={0.045} len={0.2} head="hex" position={[x, y, 0.56]} rotation={[HALF, 0, 0]} />
        ))}
      </Part>

      {/* ------------------------------------------------- crankshaft pulley */}
      <Part id="crankPulley" dir={[0, -0.6, 3.2]}>
        <Pulley r={0.62} width={0.26} grooves={6} position={[CRANK.x, CRANK.y, 0.72]} />
        <mesh position={[CRANK.x, CRANK.y, 0.86]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 20]} />
          <Mat k="machined" />
        </mesh>
      </Part>

      <Part id="crankBolt" dir={[0, 0, 4.0]}>
        <Bolt d={0.11} len={0.5} head="hex" position={[CRANK.x, CRANK.y, 1.26]} rotation={[HALF, 0, 0]} />
      </Part>

      {/* ----------------------------------------------- crankshaft sprocket */}
      <Part id="crankSprocket" dir={[0, -0.9, 1.9]}>
        <Sprocket r={CRANK.r} teeth={21} bore={0.2} depth={0.19} position={[CRANK.x, CRANK.y, 0]} mark />
        {/* TDC keyway */}
        <mesh position={[CRANK.x, CRANK.y + 0.2, 0.1]}>
          <boxGeometry args={[0.04, 0.09, 0.04]} />
          <Mat k="machined" />
        </mesh>
      </Part>

      {/* ------------------------------------------------- camshaft sprockets */}
      <Part id="camFront" dir={[1.6, 0.9, 1.4]}>
        <Sprocket r={CAM_F.r} teeth={38} bore={0.22} depth={0.18} position={[CAM_F.x, CAM_F.y, 0]} mark />
        <mesh position={[CAM_F.x, CAM_F.y, 0.11]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 22]} />
          <Mat k="machined" />
        </mesh>
        <Bolt d={0.075} len={0.26} position={[CAM_F.x, CAM_F.y, 0.3]} rotation={[HALF, 0, 0]} />
      </Part>

      <Part id="camRear" dir={[-1.6, 0.9, 1.4]}>
        <Sprocket r={CAM_R.r} teeth={38} bore={0.22} depth={0.18} position={[CAM_R.x, CAM_R.y, 0]} mark />
        <mesh position={[CAM_R.x, CAM_R.y, 0.11]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 22]} />
          <Mat k="machined" />
        </mesh>
        <Bolt d={0.075} len={0.26} position={[CAM_R.x, CAM_R.y, 0.3]} rotation={[HALF, 0, 0]} />
      </Part>

      {/* ------------------------------------------------------------- idler */}
      <Part id="idler" dir={[1.9, -0.2, 1.1]}>
        <IdlerPulley r={IDLER.r} width={0.2} position={[IDLER.x, IDLER.y, 0]} />
        <Bolt d={0.06} len={0.22} position={[IDLER.x, IDLER.y, 0.22]} rotation={[HALF, 0, 0]} />
      </Part>

      {/* --------------------------------------------------------- tensioner */}
      <Part id="tensioner" dir={[-2.0, -0.3, 1.1]}>
        <Tensioner position={[TENS.x, TENS.y, 0]} />
      </Part>

      <Part id="tensionerBolt" dir={[-2.4, -0.3, 1.8]}>
        <Bolt d={0.065} len={0.26} position={[TENS.x, TENS.y, 0.22]} rotation={[HALF, 0, 0]} />
      </Part>

      {/* -------------------------------------------------------- water pump */}
      <Part id="waterPump" dir={[-1.2, -1.7, 1.0]}>
        <WaterPump position={[PUMP.x, PUMP.y, -0.06]} />
        <Sprocket r={PUMP.r} teeth={19} bore={0.16} depth={0.18} mat="steel" position={[PUMP.x, PUMP.y, 0]} />
      </Part>

      <Part id="pumpBolts" dir={[-1.2, -1.7, 2.2]}>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <Bolt
              key={i}
              d={0.045}
              len={0.2}
              position={[PUMP.x + Math.cos(a) * 0.24, PUMP.y + Math.sin(a) * 0.24, 0.1]}
              rotation={[HALF, 0, 0]}
            />
          )
        })}
      </Part>

      {/* ------------------------------------------------------- timing belt */}
      <Part id="belt" dir={[0, 0, 1.6]}>
        <TimingBelt pulleys={NODES} width={0.2} thickness={0.055} />
      </Part>

      {/* ------------------------------------------- accessory drive (scenery) */}
      <Part id="accessoryBelt" dir={[0, 0, 3.6]}>
        <mesh position={[CRANK.x, CRANK.y + 1.1, 0.72]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.12, 0.035, 8, 56, Math.PI * 1.1]} />
          <Mat k="belt" />
        </mesh>
      </Part>
    </group>
  )
}
