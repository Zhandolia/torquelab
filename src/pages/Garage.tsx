import { Link, useParams } from 'react-router-dom'
import { VEHICLES, vehicleById, vehicleName } from '../data/vehicles'
import { proceduresForVehicle } from '../data/procedures'
import { SYSTEMS } from '../lib/types'
import { Chip, Difficulty, fmtDuration, SectionTitle, SpecNotice } from '../components/ui'
import { useStore } from '../lib/store'

/** Simple side-profile silhouette, keyed by body style. */
function Silhouette({ shape, accent }: { shape: 'sedan' | 'coupe' | 'truck'; accent: string }) {
  const paths = {
    sedan: 'M8 44 L16 44 Q20 30 34 27 L58 24 Q72 23 84 27 L104 34 L136 36 Q146 38 146 44 L140 44',
    coupe: 'M8 44 L16 44 Q19 32 30 28 L54 20 Q70 17 86 23 L110 33 L138 36 Q148 38 148 44 L142 44',
    truck: 'M6 44 L14 44 Q17 30 30 27 L52 25 Q60 24 62 30 L62 36 L118 36 L118 24 L146 24 L146 44 L140 44',
  }
  return (
    <svg viewBox="0 0 156 56" className="h-full w-full" aria-hidden>
      <path d={paths[shape]} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" opacity="0.85" />
      {[30, 118].map((x) => (
        <g key={x}>
          <circle cx={x} cy={44} r={9} fill="none" stroke={accent} strokeWidth="2" />
          <circle cx={x} cy={44} r={3} fill={accent} opacity="0.5" />
        </g>
      ))}
      <line x1="0" y1="53" x2="156" y2="53" stroke="#252a32" strokeWidth="1.5" />
    </svg>
  )
}

const SHAPES: Record<string, 'sedan' | 'coupe' | 'truck'> = {
  'civic-2016': 'sedan',
  'accord-v6-2009': 'sedan',
  'mustang-gt-2018': 'coupe',
  'silverado-2015': 'truck',
  'camry-2014': 'sedan',
  'corolla-2015': 'sedan',
}

export function Garage() {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8">
      <SectionTitle
        sub="Five platforms, each chosen because it isolates a concept cleanly. This mirrors the manufacturer-specific programs that run alongside a core automotive curriculum — Honda PACT, Ford FACT, GM ASEP, Toyota T-TEN."
      >
        The training fleet
      </SectionTitle>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {VEHICLES.map((v) => {
          const procs = proceduresForVehicle(v.id)
          return (
            <Link
              key={v.id}
              to={`/vehicle/${v.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-shop-800 bg-shop-900/30 transition-colors hover:border-shop-600"
            >
              <div
                className="grid-bg relative h-28 px-6 py-3"
                style={{ background: `linear-gradient(160deg, ${v.accent}14, transparent 70%)` }}
              >
                <Silhouette shape={SHAPES[v.id]} accent={v.accent} />
                <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest text-shop-500 uppercase">
                  {v.drivetrain}
                </span>
              </div>

              <div className="flex-1 border-t border-shop-800 p-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[15px] font-semibold text-shop-100">{vehicleName(v)}</h3>
                  <span className="text-[12px] text-shop-500">{v.trim}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Chip>{v.engine.displacement}</Chip>
                  <Chip>{v.engine.code}</Chip>
                  <Chip tone={v.engine.timing === 'belt' ? 'amber' : 'neutral'}>
                    timing {v.engine.timing}
                  </Chip>
                </div>
                <p className="mt-3 line-clamp-4 text-[12.5px] leading-relaxed text-shop-400">{v.whyTaught}</p>
              </div>

              <div className="flex items-center justify-between border-t border-shop-800 px-4 py-2.5">
                <span className="font-mono text-[10.5px] tracking-wide text-shop-500">{v.program}</span>
                <span className="text-[11.5px] text-amber-caution group-hover:underline">
                  {procs.length} procedures →
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8">
        <SpecNotice />
      </div>
    </div>
  )
}

export function VehicleDetail() {
  const { id = '' } = useParams()
  const v = vehicleById(id)
  const progress = useStore((s) => s.progress)

  if (!v) {
    return (
      <div className="p-10 text-center text-shop-400">
        Unknown vehicle.{' '}
        <Link to="/garage" className="text-amber-caution underline">
          Back to the garage
        </Link>
      </div>
    )
  }

  const procs = proceduresForVehicle(v.id)

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8">
      <Link to="/garage" className="text-[12px] text-shop-500 transition-colors hover:text-amber-caution">
        ← Garage
      </Link>

      <div
        className="mt-3 overflow-hidden rounded-xl border border-shop-800"
        style={{ background: `linear-gradient(140deg, ${v.accent}1a, transparent 65%)` }}
      >
        <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="amber">{v.program}</Chip>
              <Chip>{v.drivetrain}</Chip>
              <Chip>{v.nickname}</Chip>
            </div>
            <h1 className="mt-3 text-[clamp(26px,3.4vw,38px)] leading-tight font-bold">
              {vehicleName(v)} <span className="text-shop-400">{v.trim}</span>
            </h1>
            <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-shop-300">{v.whyTaught}</p>
          </div>
          <div className="grid-bg rounded-lg px-6 py-5">
            <Silhouette shape={SHAPES[v.id]} accent={v.accent} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <SectionTitle sub="Everything in the library that applies to this platform.">
            Procedures
          </SectionTitle>
          <div className="divide-y divide-shop-800 overflow-hidden rounded-lg border border-shop-800">
            {procs.map((p) => {
              const pr = progress[p.id]
              const pct = pr ? Math.round((pr.steps.length / p.steps.length) * 100) : 0
              return (
                <Link
                  key={p.id}
                  to={`/procedure/${p.id}`}
                  className="flex items-center gap-4 bg-shop-900/20 px-4 py-3 transition-colors hover:bg-shop-850"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-medium text-shop-100">{p.title}</span>
                      {p.primaryVehicleId !== v.id && <Chip>also applies</Chip>}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-shop-500">
                      <span>{SYSTEMS[p.system].label}</span>
                      <span>{p.steps.length} steps</span>
                      <span>{fmtDuration(p.timeMin)}</span>
                    </div>
                  </div>
                  <Difficulty level={p.difficulty} />
                  {pct > 0 && (
                    <span className="tnum font-mono text-[11px] text-amber-caution">{pct}%</span>
                  )}
                  <span className="text-shop-600">→</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionTitle>Engine</SectionTitle>
            <div className="space-y-1.5 rounded-lg border border-shop-800 bg-shop-900/30 p-4">
              {[
                ['Code', v.engine.code],
                ['Displacement', v.engine.displacement],
                ['Configuration', v.engine.config],
                ['Valvetrain', v.engine.valvetrain],
                ['Output', v.engine.power],
                ['Timing drive', `${v.engine.timing}${v.engine.interference ? ' · interference' : ''}`],
              ].map(([k, val]) => (
                <div key={k} className="flex justify-between gap-3 text-[12.5px]">
                  <span className="text-shop-500">{k}</span>
                  <span className="text-right font-mono text-shop-200">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle>Quick specs</SectionTitle>
            <div className="space-y-1.5 rounded-lg border border-shop-800 bg-shop-900/30 p-4">
              {v.quickSpecs.map((s) => (
                <div key={s.label} className="flex justify-between gap-3 text-[12.5px]">
                  <span className="text-shop-500">{s.label}</span>
                  <span className="text-right font-mono text-shop-200">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle>Transmissions</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {v.transmissions.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>

          <SpecNotice />
        </div>
      </div>
    </div>
  )
}
