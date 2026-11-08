import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { discWithHoles, hexPrism, outlinePlate } from '../geo'
import {
  AxleStub,
  Bolt,
  BrakePad,
  Caliper,
  HubCartridge,
  LugNut,
  WheelSpeedSensor,
} from '../parts'

const HALF = Math.PI / 2

/** Six-lug truck wheel. */
function TruckWheel() {
  const face = useMemo(
    () =>
      discWithHoles(2.1, 0.62, 0.1, [
        { r: 0.045, count: 6, dist: 0.31 },
        { r: 0.2, count: 6, dist: 0.7, offset: Math.PI / 6 },
      ]),
    [],
  )
  return (
    <group>
      <mesh geometry={face} position={[0, 0, 0.22]}>
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0, 0, 0.02]} rotation={[HALF, 0, 0]}>
        <cylinderGeometry args={[1.07, 1.07, 0.5, 48, 1, true]} />
        <Mat k="aluminium" />
      </mesh>
      <mesh position={[0, 0, 0.05]} rotation={[HALF, 0, 0]}>
        <torusGeometry args={[1.32, 0.32, 18, 52]} />
        <Mat k="rubber" />
      </mesh>
    </group>
  )
}

/**
 * Steering knuckle with a through bore and three tapped ears, which is what a
 * bolt-on hub cartridge needs. Built here rather than reused from parts.tsx
 * because this procedure is specifically about what passes through that bore.
 */
function BoredKnuckle() {
  const plate = useMemo(
    () =>
      outlinePlate(
        [
          [-0.14, -1.0],
          [0.38, -0.66],
          [0.66, 0],
          [0.56, 0.66],
          [0.1, 1.04],
          [-0.52, 0.78],
          [-0.68, 0],
          [-0.55, -0.64],
        ],
        0.22,
        [{ x: 0, y: 0, r: 0.52 }],
      ),
    [],
  )
  const boss = useMemo(
    () => discWithHoles(1.06, 0.62, 0.22, [{ r: 0.05, count: 3, dist: 0.4, offset: Math.PI / 6 }]),
    [],
  )
  return (
    <group>
      <mesh geometry={plate} castShadow receiveShadow>
        <Mat k="castIron" />
      </mesh>
      <mesh geometry={boss}>
        <Mat k="castIron" />
      </mesh>
      {/* caliper bracket ears, cast into the knuckle on this truck */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-0.6, s * 0.4, 0]}>
          <boxGeometry args={[0.2, 0.22, 0.22]} />
          <Mat k="castIron" />
        </mesh>
      ))}
      {/* upper ball joint / steering arm bosses, for orientation only */}
      <mesh position={[0.1, 1.0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.22, 20]} />
        <Mat k="castIron" />
      </mesh>
      <mesh position={[-0.14, -1.0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.22, 20]} />
        <Mat k="castIron" />
      </mesh>
    </group>
  )
}

/**
 * Front hub bearing assembly on a four-wheel-drive truck corner, viewed from
 * outboard. Hub axis is Z; +Z points out of the wheel well.
 *
 * The teaching shape of this job is a stack: wheel, rotor, axle nut, hub
 * cartridge, knuckle — and a half-shaft running all the way through the middle
 * of it. Nothing comes off until the thing outboard of it is gone.
 */
export function HubUnit() {
  const shield = useMemo(() => discWithHoles(1.62, 0.9, 0.018), [])
  const rotorPlate = useMemo(() => discWithHoles(1.62, 0.76, 0.065), [])
  const rotorHat = useMemo(
    () => discWithHoles(0.84, 0.38, 0.22, [{ r: 0.04, count: 6, dist: 0.31 }]),
    [],
  )
  const nutHex = useMemo(() => hexPrism(0.42, 0.18), [])

  return (
    <group>
      {/* ---------------------------------------------------- knuckle */}
      <Part id="knuckle" dir={[-1.9, 0, -0.6]}>
        <group position={[0, 0, -0.52]}>
          <BoredKnuckle />
        </group>
      </Part>

      {/* -------------------------------------------------- half-shaft */}
      <Part id="axleShaft" dir={[-2.6, 0, -0.2]}>
        <AxleStub len={1.5} position={[0, 0, -0.5]} />
      </Part>

      {/* ------------------------------------------------ hub cartridge */}
      <Part id="hubUnit" dir={[0, 0, 1.9]}>
        <HubCartridge position={[0, 0, -0.28]} studs={6} studDist={0.31} />
      </Part>

      {/* three bolts in from behind the knuckle */}
      <Part id="hubBolts" dir={[0, 0, -2.4]}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2 + Math.PI / 6
          return (
            <Bolt
              key={i}
              d={0.08}
              len={0.44}
              head="hex"
              position={[Math.cos(a) * 0.4, Math.sin(a) * 0.4, -0.72]}
              rotation={[-HALF, 0, 0]}
            />
          )
        })}
      </Part>

      {/* --------------------------------------------- ABS speed sensor */}
      <Part id="absSensor" dir={[0.6, 1.5, 0.3]}>
        <WheelSpeedSensor position={[0.52, 0.5, -0.3]} />
      </Part>
      <Part id="absBolt" dir={[0.8, 1.2, 1.6]}>
        <Bolt d={0.05} len={0.2} head="hex" position={[0.72, 0.5, -0.14]} rotation={[HALF, 0, 0]} />
      </Part>

      {/* ------------------------------------------------- dust shield */}
      <Part id="shield" dir={[0, 0, -1.7]}>
        <mesh geometry={shield} position={[0, 0, -0.44]}>
          <Mat k="steel" />
        </mesh>
      </Part>

      {/* -------------------------------------------------- axle nut */}
      <Part id="axleNut" dir={[0, 0, 2.2]}>
        <group position={[0, 0, 0.32]}>
          <mesh geometry={nutHex} rotation={[HALF, 0, 0]} castShadow>
            <Mat k="zinc" />
          </mesh>
          <mesh rotation={[HALF, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.2, 20]} />
            <Mat k="blackOxide" />
          </mesh>
        </group>
      </Part>

      {/* ----------------------------------------------------- rotor */}
      <Part id="rotor" dir={[0, 0, 1.4]}>
        <group>
          <mesh geometry={rotorPlate} position={[0, 0, 0.08]} castShadow receiveShadow>
            <Mat k="machined" />
          </mesh>
          <mesh geometry={rotorPlate} position={[0, 0, -0.08]} castShadow>
            <Mat k="machined" />
          </mesh>
          {Array.from({ length: 38 }, (_, i) => {
            const a = (i / 38) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0]} rotation={[0, 0, a]}>
                <boxGeometry args={[0.38, 0.028, 0.095]} />
                <Mat k="castIron" />
              </mesh>
            )
          })}
          <mesh geometry={rotorHat} position={[0, 0, -0.24]}>
            <Mat k="castIron" />
          </mesh>
        </group>
      </Part>

      {/* --------------------------------------------------- caliper */}
      <Part id="caliper" dir={[-2.4, 0.4, 0.4]}>
        <Caliper position={[-0.78, 0, 0.04]} pistons={2} bore={0.3} width={0.9} />
      </Part>
      <Part id="pads" dir={[-1.2, 0, 0]}>
        <BrakePad position={[-0.78, 0, -0.17]} rotation={[0, 0, HALF]} w={0.68} h={0.4} wear={0.8} />
        <BrakePad position={[-0.78, 0, 0.17]} rotation={[0, Math.PI, HALF]} w={0.68} h={0.4} wear={0.8} />
      </Part>
      <Part id="caliperBolts" dir={[-0.5, 0, -2.4]}>
        {[-0.4, 0.4].map((y) => (
          <Bolt key={y} d={0.08} len={0.36} head="hex" position={[-1.12, y, -0.1]} rotation={[HALF, 0, 0]} />
        ))}
      </Part>

      {/* -------------------------------------------------- lug nuts */}
      <Part id="lugNuts" dir={[0, 0, 3.0]}>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <LugNut key={i} d={0.075} position={[Math.cos(a) * 0.31, Math.sin(a) * 0.31, 0.3]} rotation={[HALF, 0, 0]} />
          )
        })}
      </Part>

      {/* ----------------------------------------------------- wheel */}
      <Part id="wheel" dir={[0, 0, 3.8]}>
        <TruckWheel />
      </Part>
    </group>
  )
}
