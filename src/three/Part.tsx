import { useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PartStateCtx, ViewerCtx, type PartState } from './context'

interface Props {
  id: string
  /** direction + magnitude this part travels when the assembly is exploded */
  dir?: [number, number, number]
  children: ReactNode
  /** decorative geometry: no picking, no label, never dimmed */
  scenery?: boolean
}

/**
 * Wraps a named sub-assembly. Handles explode offset, focus highlight,
 * ghosting, hit-testing and label anchor registration.
 */
export function Part({ id, dir = [0, 0, 0], children, scenery }: Props) {
  const v = useContext(ViewerCtx)
  const g = useRef<THREE.Group>(null)

  const hidden = v.hidden.includes(id)
  const highlight = v.focus.includes(id)
  const dim = !scenery && v.focus.length > 0 && !highlight
  const selected = v.selected === id
  const hovered = v.hovered === id

  const state = useMemo<PartState>(
    () => ({ dim, highlight, selected, hovered }),
    [dim, highlight, selected, hovered],
  )

  useEffect(() => {
    if (scenery || hidden || !g.current) return
    const box = new THREE.Box3().setFromObject(g.current)
    if (box.isEmpty()) return
    const c = box.getCenter(new THREE.Vector3()).sub(g.current.position)
    v.register(id, { center: c, dir: new THREE.Vector3(...dir) })
    return () => v.unregister(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hidden, scenery])

  useFrame(() => {
    const o = g.current
    if (!o) return
    const f = v.shared.explode
    o.position.set(dir[0] * f, dir[1] * f, dir[2] * f)
  })

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  /**
   * A ghosted part must not cast a shadow, or a dozen faded layers stack into
   * a solid dark blob and you lose the part you are actually looking at.
   */
  useEffect(() => {
    const o = g.current
    if (!o) return
    o.traverse((n) => {
      const m = n as THREE.Mesh
      if (!m.isMesh) return
      if (m.userData.baseCastShadow === undefined) m.userData.baseCastShadow = m.castShadow
      m.castShadow = dim ? false : m.userData.baseCastShadow
    })
  }, [dim])

  if (hidden) return null
  if (dim && !v.ghost) return null

  const interactive = !scenery && !dim

  return (
    <group
      ref={g}
      onPointerOver={
        interactive
          ? (e) => {
              e.stopPropagation()
              v.setHovered(id)
            }
          : undefined
      }
      onPointerOut={
        interactive
          ? (e) => {
              e.stopPropagation()
              v.setHovered(null)
            }
          : undefined
      }
      onClick={
        interactive
          ? (e) => {
              e.stopPropagation()
              v.setSelected(selected ? null : id)
            }
          : undefined
      }
    >
      <PartStateCtx.Provider value={state}>{children}</PartStateCtx.Provider>
    </group>
  )
}
