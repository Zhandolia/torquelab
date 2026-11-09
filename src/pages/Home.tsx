import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Viewer } from '../three/Viewer'
import { ASSEMBLIES } from '../three/assemblies'
import { VEHICLES } from '../data/vehicles'
import { PROCEDURES, totalSteps } from '../data/procedures'
import { LEVELS, TOTAL_EXAM_QUESTIONS } from '../data/curriculum'
import { CASES } from '../data/diagnostics'
import { INSTRUMENTS } from '../data/instruments'
import { Micrometer } from '../components/instruments'
import { GRADES } from '../data/fasteners'
import { BoltHead } from '../components/fastenerViz'
import { SYSTEMS, type SystemId } from '../lib/types'
import { Chip, SectionTitle, SpecNotice, fmtDuration } from '../components/ui'
import { procById } from '../data/procedures'
import { prepFor } from '../data/prep'
import { stepMinutes, stepNumber } from '../lib/jobsheet'
import { FLOOR, purchasesFor } from '../lib/kit'

const HERO: { id: string; label: string; hidden: string[] }[] = [
  {
    id: 'brakeFront',
    label: 'Front disc brake corner · 2016 Civic',
    hidden: ['wheel', 'lugNuts'],
  },
  {
    id: 'timingV6',
    label: 'Timing belt drive · 2009 Accord J35',
    hidden: ['upperCover', 'lowerCover', 'coverBolts', 'accessoryBelt', 'crankPulley', 'crankBolt'],
  },
  { id: 'strutFront', label: 'MacPherson strut · 2016 Civic', hidden: ['tower', 'swayBar'] },
  { id: 'rotatingAssembly', label: 'V8 rotating assembly · 2018 Mustang GT', hidden: [] },
]

function Hero() {
  const [i, setI] = useState(0)
  const [exp, setExp] = useState(0.2)

  useEffect(() => {
    const a = setInterval(() => setExp((e) => (e > 0.35 ? 0.12 : 0.52)), 4200)
    const b = setInterval(() => setI((n) => (n + 1) % HERO.length), 12600)
    return () => {
      clearInterval(a)
      clearInterval(b)
    }
  }, [])

  const hero = HERO[i]

  return (
    <div className="relative h-[clamp(300px,46vh,460px)] overflow-hidden rounded-xl border border-shop-800 bg-shop-900">
      <Viewer
        key={hero.id}
        assembly={hero.id}
        hidden={hero.hidden}
        explode={exp}
        autoRotate
        grid={false}
        labels={false}
        selected={null}
        onSelect={() => {}}
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-shop-950 via-shop-950/60 to-transparent p-4">
        <span className="font-mono text-[11px] text-shop-400">{hero.label}</span>
        <span className="flex gap-1.5">
          {HERO.map((a, n) => (
            <span
              key={a.id}
              className={`h-1 w-5 rounded-full ${n === i ? 'bg-amber-caution' : 'bg-shop-700'}`}
            />
          ))}
        </span>
      </div>
    </div>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-lg border border-shop-800 bg-shop-900/40 px-4 py-3">
      <div className="tnum font-mono text-[22px] leading-none font-bold text-amber-caution">{n}</div>
      <div className="mt-1 text-[11.5px] text-shop-400">{label}</div>
    </div>
  )
}

export function Home() {
  const systems = [...new Set(PROCEDURES.map((p) => p.system))] as SystemId[]

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8">
      {/* ------------------------------------------------------------------ hero */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <Chip tone="amber">Interactive 3D · built for self-taught mechanics</Chip>
          <h1 className="mt-4 text-[clamp(30px,4.4vw,52px)] leading-[1.04] font-bold tracking-tight">
            Learn the job from
            <span className="text-amber-caution"> every angle</span>,<br />
            not from a shaky phone video.
          </h1>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-shop-300">
            Trade schools teach mechanics on real cars over a year. Everyone else learns from a dark YouTube clip
            where the one moment that matters happens off-camera. TorqueLab puts the assembly itself in front of
            you — rotate it, pull it apart, click any part, and walk the procedure step by step with the torque
            specs and the measurements where you need them.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              to="/path"
              className="rounded-md bg-amber-caution px-5 py-2.5 text-[14px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
            >
              Start the learning path →
            </Link>
            <Link
              to="/library"
              className="rounded-md border border-shop-600 px-5 py-2.5 text-[14px] font-medium text-shop-200 transition-colors hover:bg-shop-850"
            >
              Browse procedures
            </Link>
          </div>

          <Link
            to="/safety"
            className="hatch mt-4 flex items-center gap-3 rounded-md border border-amber-caution/35 px-4 py-2.5 transition-colors hover:border-amber-caution/70"
          >
            <span className="text-[15px]" aria-hidden>
              ⬛
            </span>
            <span className="text-[13px] leading-snug text-shop-200">
              <span className="font-semibold text-amber-caution">Read the safety brief first.</span> Lift points,
              stored energy, and the things that hurt people working alone on a driveway. →
            </span>
          </Link>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            <Stat n={String(PROCEDURES.length)} label="Full procedures" />
            <Stat n={String(totalSteps)} label="Guided steps" />
            <Stat n={String(Object.keys(ASSEMBLIES).length)} label="3D assemblies" />
            <Stat n={String(VEHICLES.length)} label="Training vehicles" />
            <Stat n={String(TOTAL_EXAM_QUESTIONS)} label="Exam questions" />
          </div>
        </div>

        <Hero />
      </div>

      {/* -------------------------------------------------------------- the gap */}
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          {
            h: 'The angle problem',
            p: 'A video shows one camera position, usually the one where a forearm is in the way. Here you orbit to whatever angle answers your question — behind the knuckle, under the pan, square on to a timing mark.',
          },
          {
            h: 'The order problem',
            p: 'Half of mechanical work is sequence: which fastener releases what, and what is load-bearing until the moment it is not. Every step isolates the parts it touches and ghosts the rest so the order is obvious.',
          },
          {
            h: 'The spec problem',
            p: 'An owner\'s manual tells you the oil capacity. It does not tell you that the caliper bracket is 136 N·m and the guide pin is 32 N·m, or why. Specs sit next to the step that needs them, in N·m or ft-lb.',
          },
        ].map((c) => (
          <div key={c.h} className="rounded-lg border border-shop-800 bg-shop-900/30 p-5">
            <h3 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-amber-caution uppercase">
              {c.h}
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-shop-300">{c.p}</p>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- systems */}
      <div className="mt-16">
        <SectionTitle sub="Grouped the way an ASE certification area is grouped, so what you learn here maps onto what a shop expects.">
          Systems covered
        </SectionTitle>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((s) => {
            const procs = PROCEDURES.filter((p) => p.system === s)
            return (
              <Link
                key={s}
                to="/library"
                className="group rounded-lg border border-shop-800 bg-shop-900/30 p-4 transition-colors hover:border-amber-caution/40 hover:bg-shop-850"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[14.5px] font-semibold text-shop-100">{SYSTEMS[s].label}</h3>
                  <span className="font-mono text-[10px] text-shop-500">{SYSTEMS[s].ase}</span>
                </div>
                <p className="mt-0.5 text-[12px] text-shop-500">{SYSTEMS[s].blurb}</p>
                <div className="mt-3 space-y-1">
                  {procs.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 text-[12.5px] text-shop-400">
                      <span className="h-1 w-1 rounded-full bg-shop-600" />
                      <span className="truncate group-hover:text-shop-200">{p.title}</span>
                    </div>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------ the path */}
      <div className="mt-16">
        <SectionTitle sub="Four levels, ordered by consequence rather than by system. Each one ends in an assessment that draws across its procedures.">
          The learning path
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {LEVELS.map((l) => (
            <Link
              key={l.id}
              to="/path"
              className="group flex flex-col rounded-xl border border-shop-800 bg-shop-900/30 p-4 transition-colors hover:border-shop-600 hover:bg-shop-850/60"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 font-mono text-[13px] font-bold"
                  style={{ borderColor: l.accent, color: l.accent }}
                >
                  {l.index}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[14.5px] font-semibold text-shop-100">{l.title}</div>
                  <div className="font-mono text-[10px] tracking-widest text-shop-500 uppercase">{l.ase}</div>
                </div>
              </div>
              <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-shop-400">{l.subtitle}</p>
              <div className="mt-3 flex items-center justify-between border-t border-shop-800 pt-2.5 font-mono text-[11px] text-shop-500">
                <span>{l.procedureIds.length} procedures</span>
                <span className="group-hover:text-amber-caution">{l.questions.length} exam Qs →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------ shop skills */}
      <div className="mt-16">
        <SectionTitle sub="The things every procedure here quietly assumes you can already do: read an instrument to a hundredth of a millimetre, understand what a torque figure is actually buying, and find a fault with a meter.">
          Shop skills
        </SectionTitle>
        <Link
          to="/measure"
          className="group grid gap-5 rounded-xl border border-shop-800 bg-shop-900/30 p-5 transition-colors hover:border-amber-caution/40 hover:bg-shop-850/60 lg:grid-cols-[1fr_1.15fr] lg:items-center"
        >
          <div>
            <p className="text-[13.5px] leading-relaxed text-shop-300">
              "Discard at 21.0 mm" is useless to someone who has never read a vernier scale, and most self-taught
              mechanics never have. Three instruments, with the sleeve and thimble drawn to scale against each
              other so the reading comes out of the geometry — then a drill that keeps generating readings until
              you can take them.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {INSTRUMENTS.map((i) => (
                <span
                  key={i.id}
                  className="rounded border border-shop-700 bg-shop-850 px-2.5 py-1 text-[12px] text-shop-300"
                >
                  {i.name} <span className="font-mono text-[10.5px] text-shop-500">{i.resolution.toFixed(2)} mm</span>
                </span>
              ))}
            </div>
            <span className="mt-4 inline-block text-[13.5px] font-medium text-amber-caution">
              Open the bench →
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-shop-800 bg-shop-950 px-3 py-4">
            <Micrometer value={21.37} />
          </div>
        </Link>

        <Link
          to="/torque"
          className="group mt-3 grid gap-5 rounded-xl border border-shop-800 bg-shop-900/30 p-5 transition-colors hover:border-amber-caution/40 hover:bg-shop-850/60 lg:grid-cols-[1fr_1.15fr] lg:items-center"
        >
          <div>
            <p className="text-[13.5px] leading-relaxed text-shop-300">
              Torque is not the point — clamp load is, and torque is a cheap, noisy way of guessing at it. About
              nine tenths of what you put into a wrench is eaten by friction, which is why oiling a thread and
              keeping the same reading can push a bolt past its yield point while the wrench still clicks on
              cue. Pick a fastener from these procedures, change the thread condition, and watch the gauge move.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Clamp load simulator', 'Torque-to-yield', 'Grade markings', 'Every spec in one table'].map((t) => (
                <span key={t} className="rounded border border-shop-700 bg-shop-850 px-2.5 py-1 text-[12px] text-shop-300">
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-4 inline-block text-[13.5px] font-medium text-amber-caution">
              Open fasteners & torque →
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 rounded-lg border border-shop-800 bg-shop-950 px-3 py-5">
            {GRADES.slice(0, 3).map((g) => (
              <div key={g.id} className="text-center">
                <BoltHead grade={g} size={72} />
                <div className="font-mono text-[10.5px] text-shop-500">{g.proofMPa} MPa</div>
              </div>
            ))}
          </div>
        </Link>

        <Link
          to="/electrical"
          className="group mt-3 grid gap-5 rounded-xl border border-shop-800 bg-shop-900/30 p-5 transition-colors hover:border-amber-caution/40 hover:bg-shop-850/60 lg:grid-cols-[1fr_1.15fr] lg:items-center"
        >
          <div>
            <p className="text-[13.5px] leading-relaxed text-shop-300">
              A wiring diagram tells you nothing about where to put the probes. This is one lamp circuit, solved
              properly, with faults you can drop into it and a meter you can move around — so you can watch a
              corroded ground beep happily on a continuity test while it eats six and a half volts under load.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Voltage drop', 'Continuity traps', 'Finding an open', 'Hidden-fault drill'].map((t) => (
                <span key={t} className="rounded border border-shop-700 bg-shop-850 px-2.5 py-1 text-[12px] text-shop-300">
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-4 inline-block text-[13.5px] font-medium text-amber-caution">
              Open the electrical bench →
            </span>
          </div>
          <div className="rounded-lg border-2 border-shop-700 bg-[#121b14] px-5 py-6">
            <div className="flex items-baseline justify-end gap-2">
              <span className="tnum font-mono text-[34px] leading-none font-bold text-[#7dffb0]">6.52</span>
              <span className="font-mono text-[15px] text-[#7dffb0]/70">V</span>
            </div>
            <div className="mt-2 text-right font-mono text-[10px] tracking-widest text-[#7dffb0]/50 uppercase">
              across a ground stud that passes a continuity test
            </div>
          </div>
        </Link>
      </div>

      {/* ------------------------------------------------------ the tool kit */}
      <TheKit />

      {/* ------------------------------------------------------ at the car */}
      <AtTheCar />

      {/* -------------------------------------------------- diagnostic bay */}
      <div className="mt-16">
        <SectionTitle sub="Procedures teach you how to do the job. The bay teaches you whether it is the job — the half of trade school that nobody films.">
          The diagnostic bay
        </SectionTitle>
        <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-xl border border-shop-800 bg-shop-900/30 p-5">
            <p className="text-[13.5px] leading-relaxed text-shop-300">
              Each case opens the way a job opens: a customer describing a symptom and guessing at the cause. You
              choose what to check and in what order. Every decision costs time, and some of them put parts on the
              car that were never at fault — the running total sits at the top of the screen while you work.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-shop-300">
              You can always reach the answer. What gets scored is what the diagnosis cost, measured against the
              time the same case takes when every move is the right one.
            </p>
            <Link
              to="/diagnose"
              className="mt-4 inline-block rounded-md border border-amber-caution/50 bg-amber-caution/10 px-4 py-2 text-[13.5px] font-medium text-amber-caution transition-colors hover:bg-amber-caution/20"
            >
              Open the bay — {CASES.length} cases →
            </Link>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {CASES.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to={`/diagnose/${c.id}`}
                className="group rounded-lg border border-shop-800 bg-shop-900/30 p-4 transition-colors hover:border-amber-caution/40 hover:bg-shop-850"
              >
                <div className="font-mono text-[10px] tracking-widest text-amber-caution uppercase">
                  {SYSTEMS[c.system].label}
                </div>
                <h3 className="mt-0.5 text-[14px] leading-snug font-semibold text-shop-100">{c.title}</h3>
                <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-shop-500 italic">{c.complaint}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <SpecNotice />
      </div>
    </div>
  )
}

/**
 * The barrier that comes before any of the learning: not knowing what to buy,
 * and being quietly certain it is more than you can afford.
 */
function TheKit() {
  return (
    <div className="mt-16">
      <SectionTitle sub="Across these sixteen procedures the tool lists run to 187 entries written 153 different ways, which reads like a trade career's worth of equipment. Collapsed to what you would actually buy, it is 93 things — and only 57 of them can ever stop you starting a job.">
        What you need to own
      </SectionTitle>
      <Link
        to="/kit"
        className="group grid gap-5 rounded-xl border border-shop-800 bg-shop-900/30 p-5 transition-colors hover:border-amber-caution/40 hover:bg-shop-850/60 lg:grid-cols-[1fr_1.15fr] lg:items-center"
      >
        <div>
          <p className="text-[13.5px] leading-relaxed text-shop-300">
            Eleven different torque wrenches appear in these procedures, from 5–25 N·m to 60–300 N·m. That is not
            eleven wrenches — it is three, and every figure in the platform falls inside one of them. Tick what
            you already own and the page works out which jobs that lets you start, and which single purchase
            would open up the most work next.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Buying order', 'What you can do today', 'Hire, do not buy', 'No invented prices'].map((t) => (
              <span key={t} className="rounded border border-shop-700 bg-shop-850 px-2.5 py-1 text-[12px] text-shop-300">
                {t}
              </span>
            ))}
          </div>
          <span className="mt-4 inline-block text-[13.5px] font-medium text-amber-caution">
            Open the tool kit →
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { n: FLOOR, l: 'purchases before the first job is possible', c: 'text-amber-caution' },
            { n: purchasesFor(8), l: 'to reach eight of the sixteen', c: 'text-torque' },
            { n: purchasesFor(PROCEDURES.length), l: 'to reach all sixteen', c: 'text-shop-100' },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border border-shop-800 bg-shop-950 px-3 py-4">
              <div className={`tnum font-mono text-[28px] leading-none font-bold ${s.c}`}>{s.n}</div>
              <div className="mt-1.5 text-[11.5px] leading-snug text-shop-500">{s.l}</div>
            </div>
          ))}
        </div>
      </Link>
    </div>
  )
}

/**
 * Everything above this point is for learning the job at a desk. This is the
 * other half: the page you take outside, where the question is no longer "how
 * does this work" but "can I still drive this to work on Monday".
 *
 * The example is the hub bearing because it has the widest gap in the whole
 * platform between the flat rate and what following the procedure properly
 * actually costs — and that gap is the thing a driveway mechanic gets wrong.
 */
function AtTheCar() {
  const proc = procById('silverado-hub-bearing')!
  const prep = prepFor(proc.id)!
  const mins = stepMinutes(proc)
  const commitAt = stepNumber(proc, prep.commitStep)
  const immobileAt = prep.immobileFrom ? stepNumber(proc, prep.immobileFrom) : 0

  return (
    <div className="mt-16">
      <SectionTitle sub="A procedure is read at a desk and performed in a driveway. The job sheet is the part that goes outside with you: light enough to read in sunlight, printable, and honest about how long the job really takes and when you stop being able to change your mind.">
        Taking it to the car
      </SectionTitle>
      <Link
        to={`/sheet/${proc.id}`}
        className="group grid gap-5 rounded-xl border border-shop-800 bg-shop-900/30 p-5 transition-colors hover:border-amber-caution/40 hover:bg-shop-850/60 lg:grid-cols-[1fr_1.15fr] lg:items-center"
      >
        <div>
          <p className="text-[13.5px] leading-relaxed text-shop-300">
            Every tool, part, torque figure and measurement limit for one job, collected onto a single page with
            tick boxes and both units on every line. Plus the four things a step list cannot tell you: which step
            the car stops being driveable at, which one you cannot turn back from, whether you can stop halfway,
            and the one tool there is no substitute for.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Point of no return', 'Both units, always', 'Tickable at the car', 'Prints on paper'].map((t) => (
              <span key={t} className="rounded border border-shop-700 bg-shop-850 px-2.5 py-1 text-[12px] text-shop-300">
                {t}
              </span>
            ))}
          </div>
          <span className="mt-4 inline-block text-[13.5px] font-medium text-amber-caution">
            Open a job sheet →
          </span>
        </div>

        <div className="rounded-lg border border-shop-800 bg-white px-4 py-4 text-neutral-900">
          <p className="font-mono text-[9.5px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
            TorqueLab · job sheet
          </p>
          <p className="mt-0.5 text-[15px] leading-tight font-bold">{proc.title}</p>

          <div className="mt-3 flex gap-3">
            <div className="flex-1 rounded border border-neutral-300 px-2 py-1.5">
              <p className="font-mono text-[8.5px] font-bold tracking-widest text-neutral-500 uppercase">
                Shop flat rate
              </p>
              <p className="text-[17px] leading-tight font-bold tabular-nums">{fmtDuration(proc.timeMin)}</p>
            </div>
            <div className="flex-1 rounded border-2 border-neutral-900 px-2 py-1.5">
              <p className="font-mono text-[8.5px] font-bold tracking-widest text-neutral-700 uppercase">
                Your first time
              </p>
              <p className="text-[17px] leading-tight font-bold tabular-nums">{fmtDuration(mins)}</p>
            </div>
          </div>

          <div className="mt-3 flex gap-[2px]">
            {Array.from({ length: proc.steps.length }, (_, i) => {
              const n = i + 1
              const committed = n >= commitAt
              const immobile = immobileAt > 0 && n >= immobileAt
              return (
                <div
                  key={n}
                  className={`h-4 flex-1 rounded-[2px] ${committed ? 'bg-amber-500' : 'bg-neutral-300'}`}
                  style={
                    immobile
                      ? {
                          backgroundImage: committed
                            ? 'repeating-linear-gradient(45deg,#f59e0b 0 3px,#b45309 3px 6px)'
                            : 'repeating-linear-gradient(45deg,#d4d4d4 0 3px,#a3a3a3 3px 6px)',
                        }
                      : undefined
                  }
                />
              )
            })}
          </div>
          <p className="mt-1.5 font-mono text-[9.5px] tracking-widest text-neutral-500 uppercase">
            point of no return · step {commitAt} of {proc.steps.length}
          </p>
        </div>
      </Link>
    </div>
  )
}
