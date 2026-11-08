import { useStore } from '../lib/store'

function Toggle({
  on,
  onClick,
  label,
  hint,
}: {
  on: boolean
  onClick: () => void
  label: string
  hint: string
}) {
  return (
    <button
      onClick={onClick}
      title={hint}
      aria-pressed={on}
      className={`rounded px-2 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase transition-colors ${
        on
          ? 'bg-amber-caution text-black'
          : 'bg-shop-850 text-shop-400 hover:bg-shop-800 hover:text-shop-200'
      }`}
    >
      {label}
    </button>
  )
}

export function ViewerToolbar({
  explode,
  onExplode,
  onReset,
  partCount,
}: {
  explode: number
  onExplode: (v: number) => void
  onReset: () => void
  partCount: number
}) {
  const v = useStore((s) => s.viewer)
  const set = useStore((s) => s.setViewer)

  return (
    <div className="pointer-events-auto absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-3 rounded-lg border border-shop-700 bg-shop-950/88 px-3 py-2 backdrop-blur-md">
      <div className="flex min-w-[190px] flex-1 items-center gap-2.5">
        <span className="font-mono text-[10px] tracking-wider text-shop-500 uppercase">Explode</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={explode}
          onChange={(e) => onExplode(Number(e.target.value))}
          className="min-w-0 flex-1"
          aria-label="Explode assembly"
        />
        <span className="tnum w-9 font-mono text-[11px] text-amber-caution">
          {Math.round(explode * 100)}%
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Toggle on={v.labels} onClick={() => set({ labels: !v.labels })} label="Tags" hint="Show part callouts" />
        <Toggle
          on={v.ghost}
          onClick={() => set({ ghost: !v.ghost })}
          label="Ghost"
          hint="Fade unfocused parts instead of hiding them"
        />
        <Toggle on={v.xray} onClick={() => set({ xray: !v.xray })} label="X-ray" hint="See through everything" />
        <Toggle on={v.grid} onClick={() => set({ grid: !v.grid })} label="Grid" hint="Shop floor grid" />
        <Toggle
          on={v.autoRotate}
          onClick={() => set({ autoRotate: !v.autoRotate })}
          label="Spin"
          hint="Slowly orbit the assembly"
        />
        <button
          onClick={onReset}
          title="Return to this step's camera angle"
          className="rounded bg-shop-850 px-2 py-1 font-mono text-[10px] font-semibold tracking-wider text-shop-400 uppercase transition-colors hover:bg-shop-800 hover:text-shop-200"
        >
          Recentre
        </button>
      </div>

      <span className="hidden font-mono text-[10px] text-shop-600 lg:block">{partCount} parts</span>
    </div>
  )
}
