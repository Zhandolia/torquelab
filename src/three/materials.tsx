import { useContext, useMemo } from 'react'
import type * as THREE from 'three'
import { PartStateCtx, ViewerCtx } from './context'

export type MatKey =
  | 'castIron'
  | 'machined'
  | 'aluminium'
  | 'steel'
  | 'zinc'
  | 'blackOxide'
  | 'rubber'
  | 'plastic'
  | 'friction'
  | 'copper'
  | 'paint'
  | 'spring'
  | 'gasket'
  | 'belt'
  | 'fluid'
  | 'trim'
  | 'glass'
  | 'brass'

interface MatDef {
  color: string
  metalness: number
  roughness: number
  transparent?: boolean
  opacity?: number
}

export const MATERIALS: Record<MatKey, MatDef> = {
  castIron: { color: '#6a6c71', metalness: 0.5, roughness: 0.68 },
  machined: { color: '#c2c8d0', metalness: 0.92, roughness: 0.18 },
  aluminium: { color: '#98a1ab', metalness: 0.74, roughness: 0.38 },
  steel: { color: '#7d848d', metalness: 0.86, roughness: 0.3 },
  zinc: { color: '#aeb6bd', metalness: 0.72, roughness: 0.36 },
  blackOxide: { color: '#2b2f35', metalness: 0.68, roughness: 0.44 },
  rubber: { color: '#17191c', metalness: 0.02, roughness: 0.93 },
  plastic: { color: '#282c32', metalness: 0.04, roughness: 0.62 },
  friction: { color: '#403d39', metalness: 0.08, roughness: 0.96 },
  copper: { color: '#b06b3a', metalness: 0.86, roughness: 0.3 },
  paint: { color: '#a8282c', metalness: 0.28, roughness: 0.42 },
  spring: { color: '#474e57', metalness: 0.8, roughness: 0.34 },
  gasket: { color: '#2d6650', metalness: 0.08, roughness: 0.82 },
  belt: { color: '#131518', metalness: 0.02, roughness: 0.95 },
  fluid: { color: '#3a2a10', metalness: 0.1, roughness: 0.25, transparent: true, opacity: 0.85 },
  trim: { color: '#33363c', metalness: 0.05, roughness: 0.78 },
  glass: { color: '#9ac6d8', metalness: 0.2, roughness: 0.08, transparent: true, opacity: 0.3 },
  brass: { color: '#b89c54', metalness: 0.88, roughness: 0.28 },
}

export const ACCENT = '#ffb000'
export const SELECT = '#35e0c8'

/** Declarative material whose look reacts to focus / ghost / x-ray / selection state. */
export function Mat({ k, color, side }: { k: MatKey; color?: string; side?: THREE.Side }) {
  const st = useContext(PartStateCtx)
  const { xray } = useContext(ViewerCtx)
  const def = MATERIALS[k]

  const props = useMemo(() => {
    const base = {
      color: color ?? def.color,
      metalness: def.metalness,
      roughness: def.roughness,
      transparent: def.transparent ?? false,
      opacity: def.opacity ?? 1,
      emissive: '#000000',
      emissiveIntensity: 0,
      depthWrite: true,
      toneMapped: true,
      ...(side !== undefined ? { side } : {}),
    }

    if (st.dim) {
      return {
        ...base,
        color: '#8e97a3',
        metalness: 0.2,
        roughness: 1,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        emissive: '#000000',
        emissiveIntensity: 0,
      }
    }

    if (st.selected) {
      return { ...base, emissive: SELECT, emissiveIntensity: 0.55 }
    }
    if (st.highlight) {
      return { ...base, emissive: ACCENT, emissiveIntensity: st.hovered ? 0.5 : 0.26 }
    }
    if (st.hovered) {
      return { ...base, emissive: '#ffffff', emissiveIntensity: 0.14 }
    }
    if (xray) {
      return { ...base, transparent: true, opacity: 0.34, depthWrite: false }
    }
    return base
  }, [k, color, side, st.dim, st.highlight, st.selected, st.hovered, xray, def])

  return <meshStandardMaterial {...props} />
}
