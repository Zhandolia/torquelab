import * as THREE from 'three'

/** 1 unit ≈ 200 mm. Keeps a 282 mm rotor at a comfortable 1.41 units. */
export const MM = 1 / 200

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

const EXTRUDE = { bevelEnabled: false, steps: 1, curveSegments: 48 }

/* ------------------------------------------------------------------ discs */

export interface HoleSpec {
  r: number
  count: number
  dist: number
  offset?: number
}

/** Flat disc with a centre bore and optional rings of holes, extruded in Z. */
export function discWithHoles(od: number, bore: number, depth: number, holes: HoleSpec[] = []) {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, od / 2, 0, Math.PI * 2, false)
  if (bore > 0) {
    const h = new THREE.Path()
    h.absarc(0, 0, bore / 2, 0, Math.PI * 2, true)
    shape.holes.push(h)
  }
  for (const spec of holes) {
    for (let i = 0; i < spec.count; i++) {
      const a = (i / spec.count) * Math.PI * 2 + (spec.offset ?? 0)
      const p = new THREE.Path()
      p.absarc(Math.cos(a) * spec.dist, Math.sin(a) * spec.dist, spec.r, 0, Math.PI * 2, true)
      shape.holes.push(p)
    }
  }
  const g = new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth })
  g.translate(0, 0, -depth / 2)
  return g
}

/** Internally vented rotor: two friction plates joined by radial vanes. */
export function ventedRotorPlates(od: number, bore: number, plate: number, gap: number, vanes: number) {
  const parts: THREE.BufferGeometry[] = []
  const front = discWithHoles(od, bore, plate)
  front.translate(0, 0, (gap + plate) / 2)
  const back = discWithHoles(od, bore, plate)
  back.translate(0, 0, -(gap + plate) / 2)
  parts.push(front, back)

  const vaneLen = (od - bore) / 2
  for (let i = 0; i < vanes; i++) {
    const a = (i / vanes) * Math.PI * 2
    const v = new THREE.BoxGeometry(vaneLen * 0.92, od * 0.018, gap)
    v.translate(bore / 2 + vaneLen / 2, 0, 0)
    v.rotateZ(a)
    parts.push(v)
  }
  return mergeGeos(parts)
}

/* --------------------------------------------------------------- sprockets */

/** Gear / timing sprocket profile with real tooth flanks, extruded in Z. */
export function sprocket(rootR: number, teeth: number, toothH: number, depth: number, bore = 0) {
  const shape = new THREE.Shape()
  const seg = (Math.PI * 2) / teeth
  const tipR = rootR + toothH
  const pts: THREE.Vector2[] = []
  for (let i = 0; i < teeth; i++) {
    const a = i * seg
    // root → rising flank → tip → falling flank
    pts.push(new THREE.Vector2(Math.cos(a) * rootR, Math.sin(a) * rootR))
    pts.push(new THREE.Vector2(Math.cos(a + seg * 0.2) * rootR, Math.sin(a + seg * 0.2) * rootR))
    pts.push(new THREE.Vector2(Math.cos(a + seg * 0.33) * tipR, Math.sin(a + seg * 0.33) * tipR))
    pts.push(new THREE.Vector2(Math.cos(a + seg * 0.62) * tipR, Math.sin(a + seg * 0.62) * tipR))
    pts.push(new THREE.Vector2(Math.cos(a + seg * 0.75) * rootR, Math.sin(a + seg * 0.75) * rootR))
  }
  shape.setFromPoints(pts)
  shape.closePath()
  if (bore > 0) {
    const h = new THREE.Path()
    h.absarc(0, 0, bore / 2, 0, Math.PI * 2, true)
    shape.holes.push(h)
  }
  const g = new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth })
  g.translate(0, 0, -depth / 2)
  return g
}

/** Smooth V-groove / serpentine pulley built as a lathe profile around Y. */
export function pulleyProfile(r: number, width: number, grooves: number) {
  const pts: THREE.Vector2[] = []
  pts.push(new THREE.Vector2(0.001, -width / 2))
  pts.push(new THREE.Vector2(r * 0.22, -width / 2))
  pts.push(new THREE.Vector2(r * 0.22, -width / 2 + 0.01))
  const step = width / grooves
  for (let i = 0; i < grooves; i++) {
    const y = -width / 2 + i * step
    pts.push(new THREE.Vector2(r, y))
    pts.push(new THREE.Vector2(r * 0.93, y + step * 0.5))
    pts.push(new THREE.Vector2(r, y + step))
  }
  pts.push(new THREE.Vector2(r * 0.22, width / 2 - 0.01))
  pts.push(new THREE.Vector2(r * 0.22, width / 2))
  pts.push(new THREE.Vector2(0.001, width / 2))
  const g = new THREE.LatheGeometry(pts, 56)
  g.rotateX(Math.PI / 2)
  return g
}

/* ----------------------------------------------------------------- springs */

/** Coil spring as a swept tube along a helix. */
export function helixTube(coilR: number, height: number, coils: number, wire: number, taper = 0) {
  const steps = Math.max(80, Math.floor(coils * 28))
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * coils * Math.PI * 2
    const r = coilR * (1 - taper * Math.sin(t * Math.PI))
    pts.push(new THREE.Vector3(Math.cos(a) * r, t * height - height / 2, Math.sin(a) * r))
  }
  const curve = new THREE.CatmullRomCurve3(pts)
  return new THREE.TubeGeometry(curve, steps, wire / 2, 10, false)
}

/* --------------------------------------------------------------- fasteners */

export function hexPrism(acrossFlats: number, h: number) {
  const r = acrossFlats / Math.sqrt(3)
  const g = new THREE.CylinderGeometry(r, r, h, 6)
  g.rotateY(Math.PI / 6)
  return g
}

/* --------------------------------------------------------------- belt loop */

export interface PulleyNode {
  x: number
  y: number
  r: number
}

/**
 * Computes the closed path a belt takes around a set of pulleys by solving the
 * external tangents between consecutive pulleys on the convex hull, then
 * wrapping an arc across each pulley. Returns points in CCW order.
 */
export function beltPath(pulleys: PulleyNode[], arcSeg = 10): THREE.Vector2[] {
  const n = pulleys.length
  const cx = pulleys.reduce((s, p) => s + p.x, 0) / n
  const cy = pulleys.reduce((s, p) => s + p.y, 0) / n
  const ord = [...pulleys].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx))

  const inA = new Array<number>(n).fill(0)
  const outA = new Array<number>(n).fill(0)

  for (let i = 0; i < n; i++) {
    const A = ord[i]
    const B = ord[(i + 1) % n]
    const dx = B.x - A.x
    const dy = B.y - A.y
    const d = Math.hypot(dx, dy)
    const theta = Math.atan2(dy, dx)
    const phi = Math.acos(clamp((A.r - B.r) / d, -1, 1))
    const a = theta - phi
    outA[i] = a
    inA[(i + 1) % n] = a
  }

  const out: THREE.Vector2[] = []
  for (let i = 0; i < n; i++) {
    const P = ord[i]
    let delta = outA[i] - inA[i]
    while (delta < 0) delta += Math.PI * 2
    const steps = Math.max(2, Math.ceil((delta / (Math.PI * 2)) * arcSeg * n))
    for (let s = 0; s <= steps; s++) {
      const a = inA[i] + (delta * s) / steps
      out.push(new THREE.Vector2(P.x + Math.cos(a) * P.r, P.y + Math.sin(a) * P.r))
    }
  }
  return out
}

/**
 * Flat toothed belt swept along a closed 2D path. The inner face is modulated
 * by arc length so the teeth stay evenly pitched all the way round.
 */
export function beltGeometry(
  path: THREE.Vector2[],
  width: number,
  thickness: number,
  toothPitch = 0.055,
  /** 0 for a smooth serpentine belt, ~0.55 for a toothed timing belt */
  toothRatio = 0.55,
) {
  const N = path.length
  const pos: number[] = []
  const idx: number[] = []

  // cumulative arc length for tooth phasing
  const len: number[] = [0]
  for (let i = 1; i <= N; i++) {
    len[i] = len[i - 1] + path[i % N].distanceTo(path[i - 1])
  }
  const total = len[N]
  const teeth = Math.max(8, Math.round(total / toothPitch))
  const toothDepth = thickness * toothRatio

  const hw = width / 2
  for (let i = 0; i < N; i++) {
    const p = path[i]
    const prev = path[(i - 1 + N) % N]
    const next = path[(i + 1) % N]
    const tx = next.x - prev.x
    const ty = next.y - prev.y
    const tl = Math.hypot(tx, ty) || 1
    // outward normal for a CCW path
    const nx = ty / tl
    const ny = -tx / tl

    const phase = (len[i] / total) * teeth
    const tooth = Math.cos(phase * Math.PI * 2) > 0 ? toothDepth : 0

    const ox = p.x + nx * (thickness / 2)
    const oy = p.y + ny * (thickness / 2)
    const ix = p.x - nx * (thickness / 2 - tooth)
    const iy = p.y - ny * (thickness / 2 - tooth)

    // 0 outer-front, 1 outer-back, 2 inner-front, 3 inner-back
    pos.push(ox, oy, hw, ox, oy, -hw, ix, iy, hw, ix, iy, -hw)
  }

  for (let i = 0; i < N; i++) {
    const a = i * 4
    const b = ((i + 1) % N) * 4
    // outer skin
    idx.push(a + 0, b + 0, b + 1, a + 0, b + 1, a + 1)
    // inner skin
    idx.push(a + 2, a + 3, b + 3, a + 2, b + 3, b + 2)
    // front rim
    idx.push(a + 0, a + 2, b + 2, a + 0, b + 2, b + 0)
    // back rim
    idx.push(a + 1, b + 1, b + 3, a + 1, b + 3, a + 3)
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

/* ------------------------------------------------------------------ plates */

/** Rounded rectangular plate with optional bolt holes, extruded in Z. */
export function roundedPlate(
  w: number,
  h: number,
  radius: number,
  depth: number,
  holes: { x: number; y: number; r: number }[] = [],
) {
  const shape = new THREE.Shape()
  const r = Math.min(radius, w / 2, h / 2)
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  for (const hl of holes) {
    const p = new THREE.Path()
    p.absarc(hl.x, hl.y, hl.r, 0, Math.PI * 2, true)
    shape.holes.push(p)
  }
  const g = new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth })
  g.translate(0, 0, -depth / 2)
  return g
}

/** Shape built from an explicit outline, used for knuckles, arms and brackets. */
export function outlinePlate(
  points: [number, number][],
  depth: number,
  holes: { x: number; y: number; r: number }[] = [],
) {
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1])
  shape.closePath()
  for (const hl of holes) {
    const p = new THREE.Path()
    p.absarc(hl.x, hl.y, hl.r, 0, Math.PI * 2, true)
    shape.holes.push(p)
  }
  const g = new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth })
  g.translate(0, 0, -depth / 2)
  return g
}

/**
 * Doubly-curved shell for body panels: a w × h sheet bowed in both axes.
 */
export function shellPanel(w: number, h: number, t: number, bowX: number, bowY: number, seg = 28) {
  const g = new THREE.BoxGeometry(w, h, t, seg, Math.max(4, Math.floor(seg / 2)), 1)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const z = p.getZ(i)
    const u = (x / w) * 2
    const v = (y / h) * 2
    p.setZ(i, z - bowX * (1 - u * u) - bowY * (1 - v * v))
  }
  p.needsUpdate = true
  g.computeVertexNormals()
  return g
}

/* ------------------------------------------------------------------- arcs */

/**
 * Annular sector — the shape of a brake shoe, a backing plate segment or any
 * curved rib. Angles in radians, extruded in Z.
 */
export function arcPlate(
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number,
  depth: number,
) {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, rOuter, startAngle, endAngle, false)
  shape.absarc(0, 0, rInner, endAngle, startAngle, true)
  shape.closePath()
  const g = new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth })
  g.translate(0, 0, -depth / 2)
  return g
}

/** Open-ended cylinder wall used for drum shells and bearing races. */
export function ring(radius: number, height: number, thickness: number, seg = 48) {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false)
  const hole = new THREE.Path()
  hole.absarc(0, 0, radius - thickness, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  const g = new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, depth: height, curveSegments: seg })
  g.translate(0, 0, -height / 2)
  return g
}

/* ----------------------------------------------------------------- bellows */

/**
 * Convoluted boot — CV joints, steering racks, dust covers. Lathed around Y so
 * the folds stay even as the two ends taper to different diameters.
 */
export function bellows(rStart: number, rEnd: number, length: number, folds = 6, amp = 0.045) {
  const pts: THREE.Vector2[] = []
  const steps = folds * 4
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const base = rStart + (rEnd - rStart) * t
    // taper the fold depth out at both ends so the clamps sit on smooth bands
    const envelope = Math.sin(Math.min(1, t * 6) * (Math.PI / 2)) * Math.sin(Math.min(1, (1 - t) * 6) * (Math.PI / 2))
    const r = base + Math.sin(t * folds * Math.PI * 2) * amp * envelope
    pts.push(new THREE.Vector2(Math.max(0.01, r), t * length - length / 2))
  }
  return new THREE.LatheGeometry(pts, 40)
}

/* ---------------------------------------------------------------- radiator */

/** Radiator / condenser core: a slab with vertical tubes and visible fin banding. */
export function radiatorCore(w: number, h: number, d: number, tubes = 26) {
  const parts: THREE.BufferGeometry[] = []
  const slab = new THREE.BoxGeometry(w, h, d * 0.55)
  parts.push(slab)
  for (let i = 0; i < tubes; i++) {
    const x = -w / 2 + (w / (tubes - 1)) * i
    const t = new THREE.BoxGeometry(w / tubes / 2.6, h * 0.98, d)
    t.translate(x, 0, 0)
    parts.push(t)
  }
  return mergeGeos(parts)
}

/* ------------------------------------------------------------------ merging */

export function mergeGeos(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const out = new THREE.BufferGeometry()
  let vCount = 0
  const pos: number[] = []
  const norm: number[] = []
  const idx: number[] = []

  for (const g0 of list) {
    const g = g0.index ? g0.toNonIndexed() : g0
    const p = g.attributes.position
    if (!g.attributes.normal) g.computeVertexNormals()
    const nm = g.attributes.normal
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i))
      norm.push(nm.getX(i), nm.getY(i), nm.getZ(i))
      idx.push(vCount + i)
    }
    vCount += p.count
  }
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  out.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3))
  out.setIndex(idx)
  return out
}

/** Tube swept through arbitrary 3D points — hoses, lines, wiring. */
export function routedTube(points: [number, number, number][], radius: number, seg = 90) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
  return new THREE.TubeGeometry(curve, seg, radius, 10, false)
}
