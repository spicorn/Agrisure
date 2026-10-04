import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { AuditEvent, TamperMark } from '../data/types.ts'
import { sha256 } from '../lib/hash.ts'
import { GENESIS } from '../lib/ledger.ts'
import { shortHash } from '../lib/format.ts'

export function ChainView({ events, tamper }: { events: AuditEvent[]; tamper: TamperMark | null }) {
  const scroller = useRef<HTMLDivElement>(null)
  const blocks = walk(events, tamper)
  const broken = blocks.some((block) => !block.intact)

  useEffect(() => {
    const node = scroller.current
    if (!node) return
    node.scrollTo({ left: node.scrollWidth, behavior: 'smooth' })
  }, [events.length, tamper])

  return (
    <section className="rounded-2xl bg-white p-4 shadow-card" aria-labelledby="chain-title">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id="chain-title" className="font-heading text-lg font-bold text-forest">
            Chain of blocks
          </h3>
          <p className="max-w-xl text-sm text-ink-soft">
            Simulated ledger for demonstration. Each block stores a SHA-256 hash of its contents plus the previous hash.
          </p>
        </div>
        <p role="status" className={`rounded-full px-3 py-1 text-sm font-bold ${broken ? 'bg-alert-soft text-[#991b1b]' : 'bg-emerald-soft text-[#065f46]'}`}>
          {broken ? 'Chain integrity broken' : 'Chain intact'}
        </p>
      </div>
      <div ref={scroller} className="flex gap-3 overflow-x-auto pb-3">
        {blocks.map((block, index) => (
          <motion.article
            key={block.id}
            initial={index === blocks.length - 1 ? { opacity: 0, x: 16 } : false}
            animate={{ opacity: 1, x: 0 }}
            className={`w-56 shrink-0 rounded-2xl border p-3 ${block.intact ? 'border-emerald/40 bg-emerald-soft/40' : 'border-alert bg-alert-soft'}`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">Block {index + 1}</p>
            <p className="mt-1 font-mono text-xs font-bold text-forest">{block.code}</p>
            <p className="text-xs text-ink">{block.action}</p>
            <p className="text-xs text-ink-soft">{block.displayLocation}</p>
            <p className="mt-2 text-[11px] text-ink-soft">Prev {shortHash(block.prevHash === GENESIS ? 'GENESIS' : block.prevHash)}</p>
            <p className="font-mono text-[11px] text-ink">Hash {shortHash(block.hash)}</p>
            {block.firstBreak ? <p className="mt-2 text-xs font-bold text-alert">Edited entry — hash no longer matches</p> : null}
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function walk(events: AuditEvent[], tamper: TamperMark | null) {
  let prev = GENESIS
  let broken = false
  return events.map((event) => {
    const forged = tamper?.id === event.id
    const payload = forged && tamper ? tamper.forgedPayload : event.payload
    const expected = sha256(`${event.prevHash}|${payload}`)
    const selfOk = event.prevHash === prev && expected === event.hash
    const firstBreak = !broken && !selfOk
    if (!selfOk) broken = true
    prev = event.hash
    return {
      ...event,
      displayLocation: forged && tamper ? tamper.forgedLocation : event.location,
      intact: !broken,
      firstBreak,
    }
  })
}
