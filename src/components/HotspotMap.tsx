import { useState } from 'react'
import { MAP_MARKERS } from '../data/provinces.ts'

export function HotspotMap({ counts }: { counts: Record<string, number> }) {
  const [active, setActive] = useState<string | null>(null)
  const peak = Math.max(1, ...Object.values(counts))

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-card">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-heading text-lg font-bold text-forest">Counterfeit hotspot map</h3>
        <p className="text-xs text-ink-soft">Suspected fakes and cloned scans</p>
      </div>
      <div className="relative mx-auto max-w-md">
        <svg viewBox="0 0 400 480" className="h-auto w-full" role="img" aria-label="Stylized map of Zimbabwe">
          <path
            d="M118 42c28-18 78-22 122-8 36 12 78 28 96 62 18 34 28 62 22 104-6 40-18 62-28 98-12 42-22 78-48 112-22 28-48 58-86 64-34 6-62-18-84-48-24-32-36-58-52-96-18-42-40-62-46-104-6-40 8-78 28-108 16-24 42-58 76-76z"
            fill="#e7f3ec"
            stroke="#0B3D2E"
            strokeWidth="3"
          />
          <path d="M70 150c18 8 28 6 36-8 6 18 2 30-12 40" fill="none" stroke="#10B981" strokeWidth="2" />
          <text x="168" y="250" fill="#0B3D2E" fontSize="18" fontFamily="Plus Jakarta Sans, sans-serif" opacity="0.35">
            Zimbabwe
          </text>
        </svg>
        {MAP_MARKERS.map((marker) => {
          const count = counts[marker.province] ?? 0
          const size = 12 + (count / peak) * 22
          const on = active === marker.province
          return (
            <button
              key={marker.province}
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              aria-label={`${marker.label}, ${count} suspected counterfeit or cloned scans`}
              onMouseEnter={() => setActive(marker.province)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(marker.province)}
              onBlur={() => setActive(null)}
            >
              <span className="relative grid place-items-center" style={{ width: size, height: size }}>
                {count > 0 ? <span className="absolute inset-0 animate-ping rounded-full bg-alert/50 motion-reduce:animate-none" /> : null}
                <span className={`relative block h-full w-full rounded-full ${count > 0 ? 'bg-alert' : 'bg-forest/30'}`} />
              </span>
              <span className="mt-1 block max-w-24 text-[10px] font-semibold leading-tight text-forest">{marker.hint}</span>
              {on ? (
                <span role="tooltip" className="absolute left-1/2 top-full z-10 mt-1 w-40 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-left text-xs text-white shadow-lg">
                  <span className="block font-bold">{marker.label}</span>
                  <span>{count} suspected scans</span>
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
