import { useEffect, useState } from 'react'
import { QR_WINDOW_MS } from '../context/logic.ts'
import { formatClock } from '../lib/format.ts'

export function ExpiryTimer({ issuedAt, compact = false }: { issuedAt: number; compact?: boolean }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const left = Math.max(0, Math.ceil((issuedAt + QR_WINDOW_MS - now) / 1000))
  const ratio = left / (QR_WINDOW_MS / 1000)
  const expired = left === 0

  return (
    <div className={compact ? 'text-[11px]' : 'text-xs'}>
      <div className="mb-1 flex items-center justify-between gap-2 font-semibold">
        <span className={expired ? 'text-alert' : 'text-ink-soft'}>{expired ? 'Expired' : 'Expires within 30 minutes'}</span>
        <span className={`tabular-nums ${expired ? 'text-alert' : 'text-forest'}`}>{formatClock(left)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-forest/10" aria-hidden="true">
        <div
          className={`h-full rounded-full ${expired ? 'bg-alert' : 'bg-emerald'}`}
          style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%` }}
        />
      </div>
    </div>
  )
}
