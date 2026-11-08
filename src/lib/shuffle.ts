/**
 * Questions are authored with the correct answer first, because that is far
 * easier to write and review. Presenting them that way would let anyone pass
 * by always picking A, so option order is shuffled before display.
 *
 * The shuffle is seeded from the question id, so it is stable: the same
 * question always presents in the same order, on every render, in every
 * session, on every device. That matters because answers are stored as
 * indices — a random shuffle would make a saved result meaningless the moment
 * the page re-rendered.
 */

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function stableShuffle<T>(items: readonly T[], seedKey: string): T[] {
  const out = [...items]
  let seed = hash(seedKey) || 1
  for (let i = out.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const j = seed % (i + 1)
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}
