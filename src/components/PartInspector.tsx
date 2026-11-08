import { partInfo, partsFor } from '../data/partsMeta'
import { Chip } from './ui'

export function PartInspector({
  assembly,
  selected,
  onClose,
}: {
  assembly: string
  selected: string | null
  onClose: () => void
}) {
  if (!selected) return null
  const info = partInfo(assembly, selected)
  if (!info) return null

  return (
    <div className="pointer-events-auto absolute top-3 left-3 w-[290px] overflow-hidden rounded-lg border border-torque/40 bg-shop-950/93 backdrop-blur-md fade-up">
      <div className="flex items-start gap-2 border-b border-shop-800 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[9.5px] tracking-widest text-torque uppercase">{info.group}</div>
          <h3 className="truncate text-[14px] font-semibold text-shop-100">{info.name}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close part inspector"
          className="-mt-0.5 rounded px-1.5 text-shop-500 transition-colors hover:text-shop-100"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2.5 px-3 py-3">
        {info.material && (
          <div>
            <div className="font-mono text-[9.5px] tracking-widest text-shop-500 uppercase">Material</div>
            <div className="text-[12.5px] text-shop-200">{info.material}</div>
          </div>
        )}
        <div>
          <div className="font-mono text-[9.5px] tracking-widest text-shop-500 uppercase">What it does</div>
          <div className="text-[12.5px] leading-relaxed text-shop-200">{info.fn}</div>
        </div>
        {info.torque && (
          <div>
            <div className="font-mono text-[9.5px] tracking-widest text-shop-500 uppercase">Torque</div>
            <div className="font-mono text-[12.5px] font-semibold text-torque">{info.torque}</div>
          </div>
        )}
        {info.inspect && (
          <div>
            <div className="font-mono text-[9.5px] tracking-widest text-shop-500 uppercase">Inspect for</div>
            <div className="text-[12.5px] leading-relaxed text-amber-caution/90">{info.inspect}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function PartTree({
  assembly,
  focus,
  selected,
  onSelect,
}: {
  assembly: string
  focus: string[]
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  const parts = partsFor(assembly)
  const groups = [...new Set(parts.map((p) => p.group))]

  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g}>
          <div className="mb-1 font-mono text-[9.5px] tracking-widest text-shop-500 uppercase">{g}</div>
          <ul className="space-y-0.5">
            {parts
              .filter((p) => p.group === g)
              .map((p) => {
                const inStep = focus.includes(p.id)
                const isSel = selected === p.id
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => onSelect(isSel ? null : p.id)}
                      className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[12.5px] transition-colors ${
                        isSel
                          ? 'bg-torque/15 text-torque'
                          : inStep
                            ? 'bg-amber-caution/10 text-amber-caution'
                            : 'text-shop-400 hover:bg-shop-850 hover:text-shop-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          isSel ? 'bg-torque' : inStep ? 'bg-amber-caution' : 'bg-shop-600'
                        }`}
                      />
                      <span className="truncate">{p.name}</span>
                      {inStep && <Chip tone="amber" className="ml-auto shrink-0">this step</Chip>}
                    </button>
                  </li>
                )
              })}
          </ul>
        </div>
      ))}
    </div>
  )
}
