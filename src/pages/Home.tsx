import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Viewer } from '../three/Viewer'
import { ASSEMBLIES } from '../three/assemblies'
import { VEHICLES } from '../data/vehicles'
import { PROCEDURES, totalSteps } from '../data/procedures'
import { SYSTEMS, type SystemId } from '../lib/types'
import { Chip, Difficulty, SectionTitle, SpecNotice } from '../components/ui'

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
              to="/library"
              className="rounded-md bg-amber-caution px-5 py-2.5 text-[14px] font-semibold text-black transition-colors hover:bg-amber-caution/85"
            >
              Start with brakes →
            </Link>
            <Link
              to="/garage"
              className="rounded-md border border-shop-600 px-5 py-2.5 text-[14px] font-medium text-shop-200 transition-colors hover:bg-shop-850"
            >
              See the training fleet
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Stat n={String(PROCEDURES.length)} label="Full procedures" />
            <Stat n={String(totalSteps)} label="Guided steps" />
            <Stat n={String(VEHICLES.length)} label="Training vehicles" />
            <Stat n={String(Object.keys(ASSEMBLIES).length)} label="3D assemblies" />
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

      {/* ------------------------------------------------------------ start here */}
      <div className="mt-16">
        <SectionTitle sub="Start at the top if you are new. The list is ordered by how much it costs you to get it wrong.">
          Suggested order
        </SectionTitle>
        <div className="divide-y divide-shop-800 overflow-hidden rounded-lg border border-shop-800">
          {PROCEDURES.map((p, i) => (
            <Link
              key={p.id}
              to={`/procedure/${p.id}`}
              className="flex items-center gap-4 bg-shop-900/20 px-4 py-3 transition-colors hover:bg-shop-850"
            >
              <span className="tnum w-6 font-mono text-[12px] text-shop-600">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-shop-100">{p.title}</div>
                <div className="truncate text-[12px] text-shop-500">{p.subtitle}</div>
              </div>
              <div className="hidden shrink-0 sm:block">
                <Difficulty level={p.difficulty} />
              </div>
              <span className="shrink-0 font-mono text-[11px] text-shop-500">{p.steps.length} steps</span>
              <span className="text-shop-600">→</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <SpecNotice />
      </div>
    </div>
  )
}
