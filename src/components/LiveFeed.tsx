import { AnimatePresence, motion } from 'framer-motion'
import type { AuditEvent } from '../data/types.ts'
import { formatStamp } from '../lib/format.ts'
import { ResultBadge } from './ResultBadge.tsx'

export function LiveFeed({ events }: { events: AuditEvent[] }) {
  const rows = [...events].reverse().slice(0, 8)
  return (
    <section className="rounded-2xl bg-white p-4 shadow-card" aria-labelledby="live-feed-title">
      <div className="mb-3 flex items-center justify-between">
        <h3 id="live-feed-title" className="font-heading text-lg font-bold text-forest">
          Live feed
        </h3>
        <span className="inline-flex items-center gap-2 rounded-full bg-alert-soft px-2.5 py-1 text-xs font-bold text-[#991b1b]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-alert" />
          </span>
          LIVE
        </span>
      </div>
      <ul className="space-y-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {rows.map((event) => (
            <motion.li
              key={event.id}
              layout
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-1 rounded-xl bg-paper px-3 py-2 sm:grid-cols-[110px_1fr_auto] sm:items-center"
            >
              <span className="text-xs text-ink-soft">{formatStamp(event.timestamp)}</span>
              <span>
                <span className="block font-mono text-sm font-bold text-forest">{event.code}</span>
                <span className="block text-xs text-ink-soft">
                  {event.product} · {event.location} · {event.network} · {event.channel === 'qr' ? 'QR' : 'SMS'}
                </span>
              </span>
              <ResultBadge result={event.result} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  )
}
