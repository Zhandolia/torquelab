import { NavLink, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { PROCEDURES } from '../data/procedures'
import { UnitToggle } from './ui'

const LINKS = [
  { to: '/path', label: 'Path' },
  { to: '/garage', label: 'Garage' },
  { to: '/library', label: 'Procedures' },
  { to: '/diagnose', label: 'Diagnose' },
  { to: '/bench', label: 'Bench' },
]

export function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden className="shrink-0">
      <circle cx="16" cy="16" r="13" fill="none" stroke="#ffb000" strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <rect
            key={i}
            x={15}
            y={1.5}
            width={2}
            height={4.5}
            fill="#ffb000"
            transform={`rotate(${(a * 180) / Math.PI} 16 16)`}
          />
        )
      })}
      <circle cx="16" cy="16" r="5" fill="none" stroke="#35e0c8" strokeWidth="2" />
    </svg>
  )
}

export function Nav() {
  const progress = useStore((s) => s.progress)
  const done = PROCEDURES.filter((p) => progress[p.id]?.completedAt).length

  return (
    <header className="sticky top-0 z-40 border-b border-shop-800 bg-shop-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-2 px-3 sm:gap-6 sm:px-5">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Mark />
          <span className="hidden font-mono text-[15px] font-bold tracking-tight sm:inline">
            TORQUE<span className="text-amber-caution">LAB</span>
          </span>
        </Link>

        {/* five links do not fit on a 375px phone, so the rail scrolls rather
            than silently clipping whichever one falls off the end */}
        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] sm:gap-1 [&::-webkit-scrollbar]:hidden">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `shrink-0 rounded px-2 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors sm:px-3 sm:text-[13px] ${
                  isActive ? 'bg-shop-800 text-shop-100' : 'text-shop-400 hover:bg-shop-850 hover:text-shop-200'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span className="hidden font-mono text-[11px] text-shop-500 sm:block">
            {done}/{PROCEDURES.length} complete
          </span>
          <UnitToggle />
        </div>
      </div>
    </header>
  )
}
