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
import { Chip, SectionTitle, SpecNotice } from '../components/ui'

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
        <SectionTitle sub="The two things every procedure here quietly assumes you can already do: read an instrument to a hundredth of a millimetre, and understand what a torque figure is actually buying.">
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
      </div>

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
