import { useEffect, useMemo, useState } from 'react'
import { Menu } from 'lucide-react'
import { CountUp } from '../components/CountUp.tsx'
import { ReportsPanel } from '../components/dashboard/ReportsPanel.tsx'
import { Sidebar } from '../components/dashboard/Sidebar.tsx'
import { VerificationChart } from '../components/dashboard/VerificationChart.tsx'
import { HotspotMap } from '../components/HotspotMap.tsx'
import { LiveFeed } from '../components/LiveFeed.tsx'
import { Navbar } from '../components/Navbar.tsx'
import { PROVINCES } from '../data/provinces.ts'
import { useVerification } from '../context/useVerification.ts'
import { daysAgo, localDateInput } from '../lib/format.ts'
import { applyFilters, chartSeries, hotspotCounts, summarize, type FeedFilters } from '../lib/stats.ts'

export default function Dashboard() {
  const { events, reports } = useVerification()
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<FeedFilters>({
    result: 'all',
    product: 'all',
    province: 'all',
    from: localDateInput(daysAgo(13)),
    to: localDateInput(new Date()),
  })

  useEffect(() => {
    document.title = 'Fraud dashboard · Agrisure'
  }, [])

  const products = useMemo(() => [...new Set(events.map((event) => event.product))].sort(), [events])
  const filtered = useMemo(() => applyFilters(events, filters), [events, filters])
  const stats = summarize(filtered)
  const series = chartSeries(filtered, filters.from, filters.to)
  const visibleReports = reports.filter((report) => {
    const time = new Date(report.timestamp).getTime()
    const start = new Date(`${filters.from}T00:00:00`).getTime()
    const end = new Date(`${filters.to}T23:59:59.999`).getTime()
    if (time < start || time > end) return false
    if (filters.province !== 'all' && report.province !== filters.province) return false
    return true
  })
  const counts = hotspotCounts(filtered, visibleReports)

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      {open ? <button type="button" className="fixed inset-0 z-20 bg-ink/40 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <div className="mx-auto flex max-w-[1400px]">
        <Sidebar open={open} onNavigate={() => setOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Regulator view</p>
              <h1 className="font-heading text-3xl font-extrabold text-forest">Fraud dashboard</h1>
            </div>
            <button type="button" className="rounded-full border border-forest/15 p-2 lg:hidden" aria-label="Open dashboard menu" onClick={() => setOpen(true)}>
              <Menu />
            </button>
          </div>
          <FilterBar filters={filters} products={products} onChange={setFilters} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Kpi label="Total verifications" value={stats.total} />
            <Kpi label="Genuine" value={stats.genuine} />
            <Kpi label="Suspected counterfeits" value={stats.counterfeit} />
            <Kpi label="Cloned-code alerts" value={stats.cloned} />
            <Kpi label="Fake rate" value={stats.fakeRate} decimals={1} suffix="%" />
          </div>
          <p className="mt-2 text-xs text-ink-soft">Fake rate is counterfeit scans divided by verifications in the current filter.</p>
          <section className="mt-4 rounded-2xl bg-white p-4 shadow-card">
            <h2 className="font-heading text-lg font-bold text-forest">Verifications</h2>
            <VerificationChart data={series} />
          </section>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <HotspotMap counts={counts} />
            <LiveFeed events={filtered} />
          </div>
          <div className="mt-4">
            <ReportsPanel reports={visibleReports} />
          </div>
        </main>
      </div>
    </div>
  )
}

function Kpi({ label, value, decimals = 0, suffix = '' }: { label: string; value: number; decimals?: number; suffix?: string }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-card">
      <p className="text-xs font-semibold text-ink-soft">{label}</p>
      <p className="mt-1 font-heading text-3xl font-extrabold text-forest">
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </p>
    </article>
  )
}

function FilterBar({
  filters,
  products,
  onChange,
}: {
  filters: FeedFilters
  products: string[]
  onChange: (filters: FeedFilters) => void
}) {
  const set = (patch: Partial<FeedFilters>) => onChange({ ...filters, ...patch })
  return (
    <form className="grid gap-2 rounded-2xl bg-white p-3 shadow-card sm:grid-cols-2 xl:grid-cols-5" aria-label="Dashboard filters">
      <Select label="Result" value={filters.result} onChange={(result) => set({ result: result as FeedFilters['result'] })} options={['all', 'genuine', 'counterfeit', 'already_used', 'expired']} />
      <Select label="Product" value={filters.product} onChange={(product) => set({ product })} options={['all', ...products]} />
      <Select label="Province" value={filters.province} onChange={(province) => set({ province })} options={['all', ...PROVINCES]} />
      <label className="text-xs font-semibold text-ink-soft">
        From
        <input type="date" className="mt-1 w-full rounded-xl border border-forest/15 px-2 py-2 text-sm text-ink" value={filters.from} onChange={(event) => set({ from: event.target.value })} />
      </label>
      <label className="text-xs font-semibold text-ink-soft">
        To
        <input type="date" className="mt-1 w-full rounded-xl border border-forest/15 px-2 py-2 text-sm text-ink" value={filters.to} onChange={(event) => set({ to: event.target.value })} />
      </label>
    </form>
  )
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-semibold text-ink-soft">
      {label}
      <select className="mt-1 w-full rounded-xl border border-forest/15 px-2 py-2 text-sm text-ink" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 'already_used' ? 'Possible clone' : option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </label>
  )
}
