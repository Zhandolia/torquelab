import { Part } from '../Part'
import { Mat } from '../materials'
import { Bolt, BodyPanel, TrimClip } from '../parts'

const HALF = Math.PI / 2

/**
 * Front bumper cover and everything behind it, looking at the nose of the car
 * from slightly above. +Z is forward, away from the vehicle.
 */
export function BumperCover() {
  return (
    <group position={[0, 0.1, 0]}>
      {/* --------------------------------------------- radiator support (ref) */}
      <Part id="support" scenery>
        <mesh position={[0, 0.3, -1.2]}>
          <boxGeometry args={[3.4, 1.5, 0.12]} />
          <Mat k="trim" color="#24272c" />
        </mesh>
        <mesh position={[0, 1.0, -1.0]}>
          <boxGeometry args={[3.3, 0.14, 0.3]} />
          <Mat k="steel" />
        </mesh>
      </Part>

      {/* ------------------------------------------------- reinforcement bar */}
      <Part id="reinfBar" dir={[0, 0, -1.6]}>
        <mesh position={[0, 0.0, -0.55]}>
          <boxGeometry args={[3.5, 0.42, 0.22]} />
          <Mat k="steel" />
        </mesh>
        {[-1.3, 1.3].map((x) => (
          <mesh key={x} position={[x, 0.0, -0.78]}>
            <boxGeometry args={[0.3, 0.46, 0.3]} />
            <Mat k="steel" />
          </mesh>
        ))}
      </Part>

      <Part id="barBolts" dir={[0, 0, -2.4]}>
        {[-1.3, 1.3].map((x) =>
          [-0.14, 0.14].map((y) => (
            <Bolt key={`${x}-${y}`} d={0.075} len={0.3} position={[x, y, -0.92]} rotation={[-HALF, 0, 0]} />
          )),
        )}
      </Part>

      {/* -------------------------------------------------------- energy foam */}
      <Part id="absorber" dir={[0, 0.5, 1.2]}>
        <BodyPanel
          w={3.2}
          h={0.6}
          t={0.3}
          bowX={0.22}
          position={[0, 0.02, -0.28]}
          mat="plastic"
          color="#4a4d52"
        />
      </Part>

      {/* ------------------------------------------------------ fender liners */}
      {[-1, 1].map((s) => (
        <Part key={s} id={s < 0 ? 'linerLeft' : 'linerRight'} dir={[s * 2.2, -0.4, 0.4]}>
          <BodyPanel
            w={0.8}
            h={1.4}
            t={0.04}
            bowX={0.16}
            position={[s * 1.75, -0.2, -0.45]}
            rotation={[0, s * 0.5, 0]}
            mat="plastic"
            color="#1e2024"
          />
        </Part>
      ))}

      <Part id="linerScrews" dir={[0, -1.4, 1.8]}>
        {[-1, 1].map((s) =>
          [-0.5, 0.0, 0.5].map((y) => (
            <Bolt
              key={`${s}-${y}`}
              d={0.03}
              len={0.14}
              head="torx"
              position={[s * 1.72, y - 0.2, -0.1]}
              rotation={[HALF, 0, 0]}
            />
          )),
        )}
      </Part>

      {/* ------------------------------------------------------- top fasteners */}
      <Part id="topClips" dir={[0, 1.8, 0.6]}>
        {[-1.35, -0.9, -0.45, 0, 0.45, 0.9, 1.35].map((x) => (
          <TrimClip key={x} position={[x, 0.72, -0.3]} rotation={[-HALF, 0, 0]} />
        ))}
      </Part>

      <Part id="topScrews" dir={[0, 2.4, 0.6]}>
        {[-1.6, 1.6].map((x) => (
          <Bolt key={x} d={0.035} len={0.18} head="torx" position={[x, 0.74, -0.3]} />
        ))}
      </Part>

      {/* --------------------------------------------------- lower splash bolts */}
      <Part id="lowerScrews" dir={[0, -2.2, 0.4]}>
        {[-1.1, -0.55, 0, 0.55, 1.1].map((x) => (
          <Bolt key={x} d={0.035} len={0.18} head="torx" position={[x, -0.62, -0.2]} rotation={[Math.PI, 0, 0]} />
        ))}
      </Part>

      {/* ------------------------------------------------------------- lamps */}
      {[-1, 1].map((s) => (
        <Part key={s} id={s < 0 ? 'lampLeft' : 'lampRight'} dir={[s * 1.4, 0.8, 0.8]}>
          <group position={[s * 1.25, 0.55, -0.35]} rotation={[0, s * -0.3, 0]}>
            <mesh>
              <boxGeometry args={[0.85, 0.36, 0.4]} />
              <Mat k="glass" />
            </mesh>
            <mesh position={[0, 0, -0.18]}>
              <boxGeometry args={[0.8, 0.32, 0.12]} />
              <Mat k="plastic" />
            </mesh>
            <mesh position={[-0.15, 0, 0.1]} rotation={[HALF, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.08, 20]} />
              <Mat k="machined" />
            </mesh>
          </group>
        </Part>
      ))}

      {/* -------------------------------------------------------- the grille */}
      <Part id="grille" dir={[0, 0.9, 2.2]}>
        <group position={[0, 0.2, 0.18]}>
          <BodyPanel w={2.0} h={0.44} t={0.08} bowX={0.14} mat="plastic" color="#15171a" />
          {Array.from({ length: 11 }, (_, i) => (
            <mesh key={i} position={[-0.9 + i * 0.18, 0, 0.06]}>
              <boxGeometry args={[0.05, 0.4, 0.06]} />
              <Mat k="plastic" color="#0f1113" />
            </mesh>
          ))}
        </group>
      </Part>

      {/* -------------------------------------------------- the bumper cover */}
      <Part id="cover" dir={[0, 0, 3.4]}>
        <group>
          <BodyPanel
            w={3.5}
            h={1.5}
            t={0.07}
            bowX={0.42}
            bowY={0.1}
            position={[0, 0.1, 0.3]}
            mat="paint"
            color="#b8bcc2"
          />
          {/* wrap-around ends */}
          {[-1, 1].map((s) => (
            <BodyPanel
              key={s}
              w={0.85}
              h={1.4}
              t={0.06}
              bowX={0.2}
              position={[s * 1.95, 0.1, -0.22]}
              rotation={[0, s * 0.85, 0]}
              mat="paint"
              color="#b8bcc2"
            />
          ))}
          {/* lower valance */}
          <BodyPanel
            w={2.4}
            h={0.5}
            t={0.05}
            bowX={0.2}
            position={[0, -0.68, 0.18]}
            rotation={[0.35, 0, 0]}
            mat="plastic"
            color="#1b1d21"
          />
        </group>
      </Part>
    </group>
  )
}
