import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { roundedPlate } from '../geo'
import { Accessory, Bolt, IdlerPulley, Pulley, SerpentineBelt, type PulleyNode } from '../parts'

const HALF = Math.PI / 2

/**
 * Accessory drive on the front of a longitudinal V8, +Z toward the grille.
 *
 * The belt path is solved from these pulley centres by the same tangent/hull
 * routine the timing belt uses, with the tooth depth set to zero. One
 * simplification worth knowing: the solver wraps the belt around the OUTSIDE
 * of every pulley, so this is a convex route. Real serpentine layouts usually
 * run at least one backside idler that the belt wraps the other way, which is
 * exactly why the routing diagram on the fan shroud is the authority and not
 * your memory of how it looked.
 */
const NODES: PulleyNode[] = [
  { x: 0, y: -1.0, r: 0.44 }, // crankshaft
  { x: 1.15, y: -0.3, r: 0.3 }, // A/C compressor
  { x: 1.25, y: 0.85, r: 0.28 }, // alternator
  { x: 0.1, y: 1.45, r: 0.3 }, // water pump
  { x: -1.1, y: 0.9, r: 0.32 }, // power steering
  { x: -1.3, y: -0.25, r: 0.26 }, // tensioner
]

const [CRANK, AC, ALT, PUMP, PS, TENS] = NODES

export function SerpentineDrive() {
  const cover = useMemo(() => roundedPlate(3.4, 3.4, 0.3, 0.2), [])

  return (
    <group position={[0, -0.1, 0]}>
      {/* ------------------------------------------------- engine front face */}
      <Part id="frontCover" scenery>
        {/* Kept dark so the pulleys and belt read against it. */}
        <mesh geometry={cover} position={[0, 0.2, -0.62]}>
          <Mat k="trim" color="#2a2e34" />
        </mesh>
      </Part>

      {/* ------------------------------------------------------- crankshaft */}
      <Part id="crankPulley" dir={[0, -1.2, 2.2]}>
        <Pulley r={CRANK.r} width={0.3} grooves={6} position={[CRANK.x, CRANK.y, 0]} />
        <mesh position={[CRANK.x, CRANK.y, 0.18]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 20]} />
          <Mat k="machined" />
        </mesh>
      </Part>

      {/* ------------------------------------------------------- accessories */}
      <Part id="alternator" dir={[2.0, 1.4, -0.6]}>
        <Accessory w={0.62} h={0.56} d={0.62} position={[ALT.x, ALT.y, 0]} />
        <Pulley r={ALT.r} width={0.26} grooves={6} position={[ALT.x, ALT.y, 0]} />
      </Part>

      <Part id="acCompressor" dir={[2.0, -0.8, -0.6]}>
        <Accessory w={0.7} h={0.6} d={0.7} position={[AC.x, AC.y, 0]} mat="blackOxide" />
        <Pulley r={AC.r} width={0.28} grooves={6} position={[AC.x, AC.y, 0]} />
      </Part>

      <Part id="powerSteering" dir={[-2.0, 1.2, -0.6]}>
        <Accessory w={0.6} h={0.58} d={0.56} position={[PS.x, PS.y, 0]} />
        <Pulley r={PS.r} width={0.26} grooves={6} position={[PS.x, PS.y, 0]} />
      </Part>

      <Part id="waterPump" dir={[0, 2.2, -0.6]}>
        <Accessory w={0.66} h={0.56} d={0.44} position={[PUMP.x, PUMP.y, 0]} />
        <Pulley r={PUMP.r} width={0.26} grooves={6} position={[PUMP.x, PUMP.y, 0]} />
      </Part>

      {/* --------------------------------------------------------- tensioner */}
      <Part id="tensioner" dir={[-2.4, -0.4, 1.0]}>
        <IdlerPulley r={TENS.r} width={0.28} position={[TENS.x, TENS.y, 0]} />
        {/* spring-loaded arm and its pivot */}
        <mesh position={[TENS.x + 0.26, TENS.y - 0.2, -0.16]} rotation={[0, 0, -0.7]}>
          <boxGeometry args={[0.6, 0.14, 0.1]} />
          <Mat k="steel" />
        </mesh>
        <mesh position={[TENS.x + 0.48, TENS.y - 0.42, -0.16]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.18, 22]} />
          <Mat k="blackOxide" />
        </mesh>
        {/* the square drive you put a breaker bar on */}
        <mesh position={[TENS.x + 0.48, TENS.y - 0.42, 0.04]} rotation={[HALF, Math.PI / 4, 0]}>
          <boxGeometry args={[0.1, 0.07, 0.1]} />
          <Mat k="machined" />
        </mesh>
      </Part>

      <Part id="tensionerBolt" dir={[-2.8, -0.4, 1.8]}>
        <Bolt d={0.07} len={0.3} position={[TENS.x + 0.48, TENS.y - 0.42, 0.22]} rotation={[HALF, 0, 0]} />
      </Part>

      {/* -------------------------------------------------------- the belt */}
      <Part id="belt" dir={[0, 0, 1.8]}>
        <SerpentineBelt pulleys={NODES} width={0.26} thickness={0.055} />
      </Part>

      {/* --------------------------------------------- routing diagram decal */}
      <Part id="routingDecal" dir={[-1.0, 2.6, 1.4]}>
        <mesh position={[-1.5, 1.9, 0.3]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.56, 0.02]} />
          <Mat k="plastic" color="#c9c3b4" />
        </mesh>
      </Part>
    </group>
  )
}
