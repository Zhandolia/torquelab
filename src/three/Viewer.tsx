import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Grid, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ViewerCtx, type AnchorEntry, type ViewerState } from './context'
import { ACCENT } from './materials'
import { ASSEMBLIES, DEFAULT_CAM } from './assemblies'
import type { Hotspot } from '../lib/types'

export interface CamSpec {
  pos: [number, number, number]
  target: [number, number, number]
}

interface Props {
  assembly: string
  focus?: string[]
  hidden?: string[]
  explode?: number
  cam?: CamSpec
  camNonce?: number
  hotspots?: Hotspot[]
  labels?: boolean
  ghost?: boolean
  xray?: boolean
  grid?: boolean
  autoRotate?: boolean
  selected: string | null
  onSelect: (id: string | null) => void
  className?: string
}

/* --------------------------------------------------------------- camera rig */

function CameraRig({ cam, nonce = 0 }: { cam?: CamSpec; nonce?: number }) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as {
    target?: THREE.Vector3
    update?: () => void
    addEventListener?: (t: string, fn: () => void) => void
    removeEventListener?: (t: string, fn: () => void) => void
  } | null
  const tween = useRef({ active: false, pos: new THREE.Vector3(), tgt: new THREE.Vector3() })
  const key = cam ? cam.pos.join(',') + '|' + cam.target.join(',') + '|' + nonce : ''

  useEffect(() => {
    if (!cam) return
    tween.current.pos.set(...cam.pos)
    tween.current.tgt.set(...cam.target)
    tween.current.active = true
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!controls?.addEventListener) return
    const stop = () => {
      tween.current.active = false
    }
    controls.addEventListener('start', stop)
    return () => controls.removeEventListener?.('start', stop)
  }, [controls])

  useFrame((_, dt) => {
    if (!tween.current.active) return
    const k = 1 - Math.pow(0.0015, Math.min(dt, 0.05))
    camera.position.lerp(tween.current.pos, k)
    if (controls?.target) {
      controls.target.lerp(tween.current.tgt, k)
      controls.update?.()
    }
    if (camera.position.distanceTo(tween.current.pos) < 0.015) tween.current.active = false
  })

  return null
}

/* ------------------------------------------------------------ explode drive */

function ExplodeDriver({ shared }: { shared: { explode: number; target: number } }) {
  const invalidate = useThree((s) => s.invalidate)
  useFrame((_, dt) => {
    const d = shared.target - shared.explode
    if (Math.abs(d) < 0.0008) {
      shared.explode = shared.target
      return
    }
    shared.explode += d * (1 - Math.pow(0.004, Math.min(dt, 0.05)))
    invalidate()
  })
  return null
}

/* ----------------------------------------------------------------- callouts */

function Callout({
  entry,
  label,
  spec,
  shared,
}: {
  entry: AnchorEntry
  label: string
  spec?: string
  shared: { explode: number }
}) {
  const g = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!g.current) return
    g.current.position.copy(entry.center).addScaledVector(entry.dir, shared.explode)
  })
  return (
    <group ref={g}>
      <mesh>
        <sphereGeometry args={[0.035, 12, 10]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <Html center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
        <div className="-translate-y-7 whitespace-nowrap rounded-md border border-amber-caution/50 bg-shop-950/90 px-2 py-1 text-[11px] leading-tight font-medium text-shop-100 shadow-lg backdrop-blur-sm">
          <span className="text-amber-caution">▸</span> {label}
          {spec && <span className="ml-1.5 font-mono text-[10px] text-torque">{spec}</span>}
        </div>
      </Html>
    </group>
  )
}

function Callouts({
  hotspots,
  anchors,
  shared,
  version,
}: {
  hotspots: Hotspot[]
  anchors: Map<string, AnchorEntry>
  shared: { explode: number }
  version: number
}) {
  const live = useMemo(
    () => hotspots.map((h) => ({ h, e: anchors.get(h.part) })).filter((x) => x.e),
    [hotspots, anchors, version],
  )
  return (
    <>
      {live.map(({ h, e }) => (
        <Callout key={h.part + h.label} entry={e!} label={h.label} spec={h.spec} shared={shared} />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------- viewer */

export function Viewer({
  assembly,
  focus = [],
  hidden = [],
  explode = 0,
  cam,
  camNonce = 0,
  hotspots = [],
  labels = true,
  ghost = true,
  xray = false,
  grid = true,
  autoRotate = false,
  selected,
  onSelect,
  className,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [version, setVersion] = useState(0)
  const anchors = useRef(new Map<string, AnchorEntry>()).current
  const shared = useRef({ explode, target: explode }).current

  useEffect(() => {
    shared.target = explode
  }, [explode, shared])

  const register = useCallback(
    (id: string, e: AnchorEntry) => {
      anchors.set(id, e)
      setVersion((v) => v + 1)
    },
    [anchors],
  )
  const unregister = useCallback(
    (id: string) => {
      anchors.delete(id)
      setVersion((v) => v + 1)
    },
    [anchors],
  )

  const ctx = useMemo<ViewerState>(
    () => ({
      focus,
      hidden,
      ghost,
      labels,
      xray,
      selected,
      hovered,
      setSelected: onSelect,
      setHovered,
      shared,
      anchors,
      register,
      unregister,
    }),
    [focus, hidden, ghost, labels, xray, selected, hovered, onSelect, shared, anchors, register, unregister],
  )

  const Assembly = ASSEMBLIES[assembly]
  const activeCam = cam ?? DEFAULT_CAM[assembly]

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: activeCam?.pos ?? [3.2, 2.1, 3.6], fov: 38, near: 0.1, far: 80 }}
        onPointerMissed={() => onSelect(null)}
      >
        <color attach="background" args={['#0a0b0d']} />
        <fog attach="fog" args={['#0a0b0d', 11, 24]} />

        <ambientLight intensity={0.5} />
        <hemisphereLight args={['#9fb4cc', '#1a1510', 0.5]} />
        <directionalLight
          position={[5, 8, 6]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <directionalLight position={[-7, 4, -5]} intensity={0.65} color="#8fb6e8" />
        <pointLight position={[0, -2.5, 3]} intensity={0.35} color="#ffd9a0" />

        <Suspense fallback={null}>
          <ViewerCtx.Provider value={ctx}>
            <group position={[0, 0.35, 0]}>
              {Assembly ? <Assembly /> : null}
              {labels && hotspots.length > 0 && (
                <Callouts hotspots={hotspots} anchors={anchors} shared={shared} version={version} />
              )}
            </group>
            <ExplodeDriver shared={shared} />
          </ViewerCtx.Provider>

          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.5}
            scale={14}
            blur={2.6}
            far={5}
            resolution={512}
            color="#000000"
          />
          {grid && (
            <Grid
              position={[0, -1.56, 0]}
              args={[24, 24]}
              cellSize={0.5}
              cellThickness={0.6}
              cellColor="#252a32"
              sectionSize={2.5}
              sectionThickness={1.1}
              sectionColor="#3a424d"
              fadeDistance={22}
              fadeStrength={1.4}
              infiniteGrid
            />
          )}
        </Suspense>

        <CameraRig cam={activeCam} nonce={camNonce} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.09}
          minDistance={1.2}
          maxDistance={20}
          autoRotate={autoRotate}
          autoRotateSpeed={0.7}
          target={activeCam ? new THREE.Vector3(...activeCam.target) : undefined}
        />
      </Canvas>
    </div>
  )
}
