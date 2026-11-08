import { createContext } from 'react'
import * as THREE from 'three'

export interface PartState {
  dim: boolean
  highlight: boolean
  selected: boolean
  hovered: boolean
}

export const PartStateCtx = createContext<PartState>({
  dim: false,
  highlight: false,
  selected: false,
  hovered: false,
})

export interface AnchorEntry {
  center: THREE.Vector3
  dir: THREE.Vector3
}

export interface ViewerState {
  focus: string[]
  hidden: string[]
  ghost: boolean
  labels: boolean
  xray: boolean
  selected: string | null
  hovered: string | null
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
  /** mutable, written every frame — never read during render */
  shared: { explode: number; target: number }
  anchors: Map<string, AnchorEntry>
  register: (id: string, e: AnchorEntry) => void
  unregister: (id: string) => void
}

export const ViewerCtx = createContext<ViewerState>({
  focus: [],
  hidden: [],
  ghost: true,
  labels: true,
  xray: false,
  selected: null,
  hovered: null,
  setSelected: () => {},
  setHovered: () => {},
  shared: { explode: 0, target: 0 },
  anchors: new Map(),
  register: () => {},
  unregister: () => {},
})
