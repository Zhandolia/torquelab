import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { roundedPlate } from '../geo'
import { Bolt, BodyPanel, Connector, Speaker, TrimClip } from '../parts'

const HALF = Math.PI / 2

/** Clip positions around the perimeter of the trim panel. */
const CLIPS: [number, number][] = [
  [-1.3, -0.95],
  [-0.78, -1.0],
  [-0.26, -1.02],
  [0.26, -1.02],
  [0.78, -1.0],
  [1.3, -0.95],
  [1.45, -0.45],
  [1.45, 0.1],
  [1.45, 0.62],
  [-1.45, -0.45],
  [-1.45, 0.1],
  [-1.45, 0.62],
]

/**
 * Driver's door, looking at the inner face — the view you get sitting in the
 * seat. +Z is toward the cabin, so pulling the trim panel moves it at you.
 */
export function DoorPanel() {
  const shell = useMemo(
    () =>
      roundedPlate(3.1, 2.3, 0.18, 0.08, [
        { x: -0.55, y: -0.55, r: 0.38 }, // speaker aperture
        { x: 0.95, y: -0.2, r: 0.12 }, // harness pass-through
      ]),
    [],
  )
  const trim = useMemo(() => roundedPlate(3.0, 2.2, 0.16, 0.06), [])

  return (
    <group>
      {/* ---------------------------------------------------------- door shell */}
      <Part id="shell" scenery>
        <mesh geometry={shell} position={[0, 0.1, -0.5]}>
          <Mat k="trim" color="#2b2f35" />
        </mesh>
        {/* window glass in the track */}
        <mesh position={[0, 1.5, -0.46]}>
          <boxGeometry args={[2.8, 0.9, 0.03]} />
          <Mat k="glass" />
        </mesh>
      </Part>

      {/* -------------------------------------------------- window regulator */}
      <Part id="regulator" dir={[0, 0, -2.0]}>
        <group position={[0, 0.2, -0.42]}>
          <mesh rotation={[0, 0, 0.5]}>
            <boxGeometry args={[1.9, 0.07, 0.05]} />
            <Mat k="steel" />
          </mesh>
          <mesh rotation={[0, 0, -0.5]}>
            <boxGeometry args={[1.9, 0.07, 0.05]} />
            <Mat k="steel" />
          </mesh>
          <mesh position={[-0.7, -0.4, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 22]} />
            <Mat k="blackOxide" />
          </mesh>
        </group>
      </Part>

      {/* ---------------------------------------------------- weather sheet */}
      <Part id="weatherSheet" dir={[0, 0, 0.9]}>
        <mesh position={[0, 0.1, -0.4]}>
          <boxGeometry args={[2.9, 2.0, 0.01]} />
          <Mat k="glass" color="#1e2126" />
        </mesh>
      </Part>

      {/* --------------------------------------------------------- speaker */}
      <Part id="speaker" dir={[0, -0.8, 1.6]}>
        <Speaker r={0.36} position={[-0.55, -0.45, -0.4]} />
      </Part>

      <Part id="speakerScrews" dir={[0, -0.8, 2.4]}>
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + 0.4
          return (
            <Bolt
              key={i}
              d={0.032}
              len={0.16}
              head="torx"
              position={[-0.55 + Math.cos(a) * 0.38, -0.45 + Math.sin(a) * 0.38, -0.3]}
              rotation={[HALF, 0, 0]}
            />
          )
        })}
      </Part>

      {/* ----------------------------------------------------- inner handle */}
      <Part id="handleRod" dir={[-1.6, 0.4, 0.8]}>
        <mesh position={[1.0, 0.45, -0.34]} rotation={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.022, 0.022, 0.8, 10]} />
          <Mat k="steel" />
        </mesh>
        <mesh position={[1.12, 0.78, -0.34]}>
          <boxGeometry args={[0.3, 0.12, 0.1]} />
          <Mat k="plastic" />
        </mesh>
      </Part>

      {/* ------------------------------------------------------ switch pack */}
      <Part id="switchPack" dir={[0.6, 1.4, 1.5]}>
        <group position={[0.9, 0.62, 0.02]}>
          <mesh>
            <boxGeometry args={[0.7, 0.3, 0.16]} />
            <Mat k="plastic" />
          </mesh>
          {[-0.2, 0, 0.2].map((x) => (
            <mesh key={x} position={[x, 0.08, 0.1]}>
              <boxGeometry args={[0.14, 0.1, 0.05]} />
              <Mat k="trim" />
            </mesh>
          ))}
        </group>
        <Connector position={[0.9, 0.62, -0.14]} />
      </Part>

      {/* --------------------------------------------------------- armrest */}
      <Part id="armrest" dir={[0, 0.9, 1.3]}>
        <mesh position={[0.3, 0.1, 0.1]}>
          <boxGeometry args={[1.5, 0.34, 0.4]} />
          <Mat k="trim" color="#3b3f46" />
        </mesh>
        <mesh position={[0.3, 0.3, 0.1]}>
          <boxGeometry args={[1.42, 0.06, 0.36]} />
          <Mat k="rubber" />
        </mesh>
      </Part>

      {/* ----------------------------------------------- screws behind trim */}
      <Part id="trimScrews" dir={[0, -1.4, 2.6]}>
        {[
          [-1.1, -0.98],
          [1.1, -0.98],
          [0.95, 0.3],
        ].map(([x, y], i) => (
          <Bolt key={i} d={0.035} len={0.2} head="torx" position={[x, y, 0.08]} rotation={[HALF, 0, 0]} />
        ))}
      </Part>

      {/* ------------------------------------------------------- trim clips */}
      <Part id="clips" dir={[0, 0, 1.9]}>
        {CLIPS.map(([x, y], i) => (
          <TrimClip key={i} position={[x, y, -0.22]} />
        ))}
      </Part>

      {/* --------------------------------------------------- the trim panel */}
      <Part id="trimPanel" dir={[0, 0, 2.9]}>
        <mesh geometry={trim} position={[0, 0.1, 0]}>
          <Mat k="trim" color="#3a3e45" />
        </mesh>
        {/* grab pocket */}
        <mesh position={[0.3, -0.25, 0.08]}>
          <boxGeometry args={[1.4, 0.5, 0.1]} />
          <Mat k="trim" color="#33373d" />
        </mesh>
        {/* speaker grille */}
        <BodyPanel w={0.8} h={0.8} t={0.03} position={[-0.55, -0.45, 0.05]} mat="plastic" />
      </Part>
    </group>
  )
}
