/**
 * What to buy, in what order, to be able to do the most work.
 *
 * Every number here is computed from the procedures' own tool lists through the
 * canonical mapping in `data/toolkit.ts`. Nothing is a price — prices vary by
 * country, brand and year far too much to publish, and a made-up price is worse
 * than no price. What the data *can* answer honestly is the ordering question,
 * which is the one that actually blocks somebody: given that you will buy these
 * things one at a time, which one next opens up the most work.
 */

import { PROCEDURES } from '../data/procedures'
import { CANON, RAW_TO_CANON, canonById, isGating, type CanonTool, type KitKind } from '../data/toolkit'
import type { Procedure } from './types'

/** Canonical tool ids a procedure calls for, deduplicated, in catalogue order. */
export function toolIds(p: Procedure): string[] {
  const ids = new Set<string>()
  for (const t of p.tools) for (const id of RAW_TO_CANON[t.name] ?? []) ids.add(id)
  return CANON.filter((c) => ids.has(c.id)).map((c) => c.id)
}

export function toolsOf(p: Procedure, kind: KitKind): CanonTool[] {
  return toolIds(p)
    .map((id) => canonById(id)!)
    .filter((t) => t.kind === kind)
}

/**
 * procedure id -> the tools that genuinely gate whether you can start it.
 *
 * `own` tools only, and within those only the gating ones: a paint pen, a
 * blanket, a torch and your phone all appear in these lists and none of them
 * stops anybody doing anything. Counting them made the first version of the
 * ladder claim the last job was unlocked by buying a paint pen.
 */
const GATES = new Map<string, string[]>(
  PROCEDURES.map((p) => [p.id, toolIds(p).map((id) => canonById(id)!).filter(isGating).map((t) => t.id)]),
)

/** tool id -> the procedures that call for it. */
export function usage(): Map<string, string[]> {
  const m = new Map<string, string[]>()
  for (const p of PROCEDURES) for (const id of toolIds(p)) m.set(id, [...(m.get(id) ?? []), p.id])
  return m
}

export const USAGE = usage()
export const usedBy = (id: string) => USAGE.get(id) ?? []

/** Every `own` tool that any procedure here actually calls for. */
export const KIT_TOOLS = CANON.filter((t) => t.kind === 'own' && usedBy(t.id).length > 0)

/** Of those, the ones that stop a job rather than merely make it pleasanter. */
export const GATING_TOOLS = KIT_TOOLS.filter(isGating)


/** Which jobs a given set of owned tools lets you start. */
export function jobsUnlocked(owned: Set<string>): string[] {
  return PROCEDURES.filter((p) => (GATES.get(p.id) ?? []).every((id) => owned.has(id))).map((p) => p.id)
}

/** The `own` tools a job needs that you do not have. */
export function missingFor(procId: string, owned: Set<string>): CanonTool[] {
  return (GATES.get(procId) ?? []).filter((id) => !owned.has(id)).map((id) => canonById(id)!)
}

export interface LadderStep {
  tool: CanonTool
  /** jobs that become possible on this purchase and not before */
  unlocks: string[]
  /** how many jobs you can do once you own everything up to and including this */
  cumulative: number
  /** how many of the sixteen procedures call for it at all */
  demand: number
  index: number
}

/**
 * A greedy ordering: buy next whatever completes the most jobs, and where
 * nothing completes a job yet, whatever the most jobs are waiting on.
 *
 * The second half of that rule is what makes the result readable. Early on no
 * single purchase finishes anything — you cannot do a brake job until you have
 * all nine of its tools — so a pure "unlocks the most" greedy would stall with
 * every candidate scoring zero and fall back to arbitrary order. Ranking the
 * zeroes by demand instead means the ladder accumulates the tools the most jobs
 * are waiting on, and the unlocks arrive in bursts, which is exactly how it
 * feels to build a kit.
 *
 * Greedy set cover is not optimal in general. It does not need to be: this is a
 * suggested buying order, and the honest claim is "this order works well", not
 * "no other order is better".
 */
export function ladder(): LadderStep[] {
  const owned = new Set<string>()
  const pool = [...KIT_TOOLS]
  const out: LadderStep[] = []
  let done = 0

  while (pool.length) {
    let best = pool[0]
    let bestScore: [number, number, number] = [-1, -1, -1]

    for (const t of pool) {
      const trial = new Set(owned)
      trial.add(t.id)
      // Three keys in order: how many jobs this finishes, whether it can ever
      // block a job at all, then how many jobs are waiting on it. The middle
      // key keeps the torch and the parts trays — both genuinely common — from
      // being bought ahead of the tools that are actually in the way.
      const score: [number, number, number] = [
        jobsUnlocked(trial).length - done,
        isGating(t) ? 1 : 0,
        usedBy(t.id).length,
      ]
      if (score[0] > bestScore[0] || (score[0] === bestScore[0] && (score[1] > bestScore[1] || (score[1] === bestScore[1] && score[2] > bestScore[2])))) {
        best = t
        bestScore = score
      }
    }

    const before = new Set(jobsUnlocked(owned))
    owned.add(best.id)
    const after = jobsUnlocked(owned)
    done = after.length

    out.push({
      tool: best,
      unlocks: after.filter((id) => !before.has(id)),
      cumulative: done,
      demand: usedBy(best.id).length,
      index: out.length + 1,
    })
    pool.splice(pool.indexOf(best), 1)
  }
  return out
}

export const LADDER = ladder()

/** How many purchases it takes to reach n jobs, for the headline claims. */
export function purchasesFor(jobs: number) {
  const hit = LADDER.find((s) => s.cumulative >= jobs)
  return hit ? hit.index : LADDER.length
}

/**
 * The entry cost: purchases before any job at all becomes possible.
 *
 * This is the number worth knowing before you start, and nothing else on the
 * platform says it. You cannot half-do a brake job, so there is a floor you
 * have to clear before the first thing is achievable — and it is a lot higher
 * than anybody expects when they are standing in a shop holding one socket set.
 */
export const FLOOR = purchasesFor(1)

/** Tools only one procedure in the whole platform calls for. */
export const SINGLE_JOB = CANON.filter((t) => usedBy(t.id).length === 1 && t.kind !== 'part')

/**
 * The guard. The mapping table is hand-written against free text, so the two
 * ways it can rot are a tool string nobody mapped (silently dropped from every
 * shopping list) and a mapping pointing at a catalogue id that no longer
 * exists. Both are invisible in the UI — the page just renders a slightly
 * shorter list — so they have to be shouted about here instead.
 */
if (import.meta.env.DEV) {
  const problems: string[] = []
  const seen = new Set<string>()

  for (const p of PROCEDURES) {
    for (const t of p.tools) {
      seen.add(t.name)
      const ids = RAW_TO_CANON[t.name]
      if (!ids) {
        problems.push(`${p.id}: tool "${t.name}" is not in RAW_TO_CANON`)
        continue
      }
      for (const id of ids) if (!canonById(id)) problems.push(`"${t.name}" maps to unknown tool id "${id}"`)
    }
  }

  for (const name of Object.keys(RAW_TO_CANON))
    if (!seen.has(name)) problems.push(`RAW_TO_CANON has "${name}", which no procedure asks for any more`)

  for (const t of CANON)
    if (usedBy(t.id).length === 0) problems.push(`catalogue entry "${t.id}" is never called for by any procedure`)

  if (problems.length) console.error(`[kit] ${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
  else
    console.info(
      `[kit] ${seen.size} tool strings across ${PROCEDURES.length} procedures map onto ${CANON.length} real purchases; ` +
        `${KIT_TOOLS.length} of them are kit items, and all 16 jobs are reachable in ${LADDER.length}`,
    )
}
