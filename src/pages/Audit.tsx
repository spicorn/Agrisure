import { useEffect, useMemo, useState } from 'react'
import { Download, Menu } from 'lucide-react'
import { Button } from '../components/Button.tsx'
import { ChainView } from '../components/ChainView.tsx'
import { Sidebar } from '../components/dashboard/Sidebar.tsx'
import { Navbar } from '../components/Navbar.tsx'
import { ResultBadge } from '../components/ResultBadge.tsx'
import { useVerification } from '../context/useVerification.ts'
import { downloadCsv } from '../lib/csv.ts'
import { formatStamp } from '../lib/format.ts'

export default function Audit() {
  const { events, tamper, tamperTest, restoreChain } = useVerification()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.title = 'Audit trail · Agrisure'
  }, [])

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return [...events].reverse().filter((event) => {
      if (!needle) return true
      return `${event.id} ${event.code} ${event.action} ${event.location} ${event.product} ${event.device} ${event.channel}`.toLowerCase().includes(needle)
    })
  }, [events, query])

  const exportCsv = () => {
    downloadCsv('agrisure-audit.csv', [
      ['timestamp', 'eventId', 'code', 'action', 'location', 'device', 'channel', 'result', 'hash'],
      ...rows.map((event) => [event.timestamp, event.id, event.code, event.action, event.location, event.device, event.channel, event.result, event.hash]),
    ])
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      {open ? <button type="button" className="fixed inset-0 z-20 bg-ink/40 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <div className="mx-auto flex max-w-[1400px]">
        <Sidebar open={open} onNavigate={() => setOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Forensic accounting</p>
              <h1 className="font-heading text-3xl font-extrabold text-forest">Audit trail</h1>
            </div>
            <button type="button" className="rounded-full border border-forest/15 p-2 lg:hidden" aria-label="Open dashboard menu" onClick={() => setOpen(true)}>
              <Menu />
            </button>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button type="button" variant="danger" onClick={tamperTest} disabled={Boolean(tamper)}>
              Tamper test
            </Button>
            <Button type="button" variant="outline" onClick={restoreChain} disabled={!tamper}>
              Restore ledger
            </Button>
          </div>
          <ChainView events={events} tamper={tamper} />
          <section className="mt-4 rounded-2xl bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <label className="block text-sm font-semibold text-forest">
                Search the ledger
                <input className="mt-1 w-72 max-w-full rounded-xl border border-forest/15 px-3 py-2 font-normal" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Code, place, action" />
              </label>
              <Button type="button" variant="outline" onClick={exportCsv}>
                <Download className="h-4 w-4" aria-hidden="true" /> Download CSV
              </Button>
            </div>
            <div className="mt-4 max-h-[520px] overflow-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="sticky top-0 bg-white text-xs uppercase tracking-wide text-ink-soft">
                  <tr>
                    <th className="py-2 pr-3">Timestamp</th>
                    <th className="py-2 pr-3">Event ID</th>
                    <th className="py-2 pr-3">Code</th>
                    <th className="py-2 pr-3">Action</th>
                    <th className="py-2 pr-3">Location</th>
                    <th className="py-2 pr-3">Device</th>
                    <th className="py-2">Channel</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((event) => (
                    <tr key={event.id} className="border-t border-forest/10">
                      <td className="py-2 pr-3 whitespace-nowrap">{formatStamp(event.timestamp)}</td>
                      <td className="py-2 pr-3 font-mono text-xs">{event.id}</td>
                      <td className="py-2 pr-3 font-mono text-xs font-bold text-forest">{event.code}</td>
                      <td className="py-2 pr-3">
                        {event.action}
                        <span className="ml-2"><ResultBadge result={event.result} /></span>
                      </td>
                      <td className="py-2 pr-3">{tamper?.id === event.id ? tamper.forgedLocation : event.location}</td>
                      <td className="py-2 pr-3">{event.device}</td>
                      <td className="py-2">{event.channel === 'qr' ? 'QR' : 'SMS'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
