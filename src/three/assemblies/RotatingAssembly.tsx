import { useMemo } from 'react'
import { Part } from '../Part'
import { Mat } from '../materials'
import { roundedPlate } from '../geo'
import { Bolt, ConRod, Crankshaft, MainCap, Piston } from '../parts'

const HALF = Math.PI / 2
const BANK = Math.PI / 4 // 90° included angle → ±45° from vertical
const THROWS = [-0.84, -0.28, 0.28, 0.84]
const MAINS = [-1.12, -0.56, 0, 0.56, 1.12]
const BORE = 0.46

/** One bank of four cylinders: deck, bores, pistons and rods. */
function Bank({ sign, idPrefix }: { sign: 1 | -1; idPrefix: string }) {
  const deck = useMemo(
    () =>
      roundedPlate(
        2.6,
        0.9,
        0.08,
        0.1,
        THROWS.map((x) => ({ x, y: 0, r: BORE / 2 })),
      ),
    [],
  )

  return (
    <group rotation={[sign * BANK, 0, 0]}>
      <Part id={`${idPrefix}Deck`} scenery>
        <mesh geometry={deck} position={[0, 1.62, 0]} rotation={[HALF, 0, 0]}>
          <Mat k="aluminium" />
        </mesh>
        {THROWS.map((x) => (
          <mesh key={x} position={[x, 1.25, 0]}>
            <cylinderGeometry args={[BORE / 2, BORE / 2, 0.78, 30, 1, true]} />
            <meshStandardMaterial color="#1c2024" metalness={0.92} roughness={0.12} side={2} />
          </mesh>
        ))}
      </Part>

      <Part id={`${idPrefix}Pistons`} dir={[0, 2.0, 0]}>
        {THROWS.map((x) => (
          <Piston key={x} d={BORE} position={[x, 1.42, 0]} />
        ))}
      </Part>

      <Part id={`${idPrefix}Rods`} dir={[0, 1.3, 0]}>
        {THROWS.map((x) => (
          <ConRod key={x} len={0.78} position={[x, 1.3, 0]} />
        ))}
      </Part>

      <Part id={`${idPrefix}RodBolts`} dir={[0, 0.7, 0]}>
        {THROWS.map((x) =>
          [-0.19, 0.19].map((o) => (
            <Bolt
              key={`${x}-${o}`}
              d={0.05}
              len={0.3}
              head="cap"
              position={[x + o, 0.36, 0]}
              rotation={[Math.PI, 0, 0]}
            />
          )),
        )}
      </Part>
    </group>
  )
}

/**
 * 90° V8 short block. Crank runs along X, banks splay ±45°, which makes the
 * shared rod journals and the main cap register easy to read when exploded.
 */
export function RotatingAssembly() {
  return (
    <group position={[0, -0.2, 0]}>
      {/* ------------------------------------------------------- crankcase */}
      <Part id="crankcase" scenery>
        <mesh position={[0, 0.0, 0]}>
          <boxGeometry args={[2.9, 1.0, 1.5]} />
          <meshStandardMaterial
            color="#4e5660"
            metalness={0.5}
            roughness={0.6}
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </mesh>
        {MAINS.map((x) => (
          <mesh key={x} position={[x, -0.02, 0]} rotation={[0, 0, HALF]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 26, 1, false, 0, Math.PI]} />
            <Mat k="aluminium" />
          </mesh>
        ))}
      </Part>

      <Bank sign={1} idPrefix="bankA" />
      <Bank sign={-1} idPrefix="bankB" />

      {/* ----------------------------------------------------- crankshaft */}
      <Part id="crank">
        <Crankshaft throws={4} spacing={0.56} />
      </Part>

      {/* ------------------------------------------------- main bearings */}
      <Part id="mainBearings" dir={[0, -1.1, 0]}>
        {MAINS.map((x) => (
          <mesh key={x} position={[x, -0.02, 0]} rotation={[0, 0, HALF]}>
            <cylinderGeometry args={[0.162, 0.162, 0.2, 26, 1, true, Math.PI, Math.PI]} />
            <Mat k="copper" side={2} />
          </mesh>
        ))}
      </Part>

      {/* ---------------------------------------------------- main caps */}
      <Part id="mainCaps" dir={[0, -2.0, 0]}>
        {MAINS.map((x) => (
          <MainCap key={x} position={[x, -0.26, 0]} />
        ))}
      </Part>

      <Part id="mainBolts" dir={[0, -3.0, 0]}>
        {MAINS.map((x) =>
          [-0.22, 0.22].map((z) => (
            <Bolt key={`${x}-${z}`} d={0.06} len={0.44} head="cap" position={[x, -0.5, z]} rotation={[Math.PI, 0, 0]} />
          )),
        )}
      </Part>

      {/* ------------------------------------------------- front damper */}
      <Part id="damper" dir={[2.6, 0, 0]}>
        <mesh position={[1.58, 0, 0]} rotation={[0, 0, HALF]}>
          <cylinderGeometry args={[0.46, 0.46, 0.2, 34]} />
          <Mat k="castIron" />
        </mesh>
        <mesh position={[1.58, 0, 0]} rotation={[0, 0, HALF]}>
          <torusGeometry args={[0.42, 0.045, 10, 36]} />
          <Mat k="rubber" />
        </mesh>
      </Part>

      {/* ------------------------------------------------- rear main seal */}
      <Part id="rearSeal" dir={[-2.6, 0, 0]}>
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, HALF]}>
          <torusGeometry args={[0.28, 0.055, 12, 34]} />
          <Mat k="rubber" />
        </mesh>
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, HALF]}>
          <cylinderGeometry args={[0.36, 0.36, 0.06, 30, 1, true]} />
          <Mat k="steel" />
        </mesh>
      </Part>
    </group>
  )
}
