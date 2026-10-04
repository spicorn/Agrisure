import type { AuditEvent, FarmerReport, VerifyStatus } from '../data/types.ts'

export interface FeedFilters {
  result: 'all' | VerifyStatus
  product: string
  province: string
  from: string
  to: string
}

export function applyFilters(events: AuditEvent[], filters: FeedFilters) {
  const start = new Date(`${filters.from}T00:00:00`).getTime()
  const end = new Date(`${filters.to}T23:59:59.999`).getTime()
  return events.filter((event) => {
    if (event.kind !== 'verification') return false
    const time = new Date(event.timestamp).getTime()
    if (time < start || time > end) return false
    if (filters.result !== 'all' && event.result !== filters.result) return false
    if (filters.product !== 'all' && event.product !== filters.product) return false
    if (filters.province !== 'all' && event.province !== filters.province) return false
    return true
  })
}

export function summarize(events: AuditEvent[]) {
  const total = events.length
  const genuine = events.filter((event) => event.result === 'genuine').length
  const counterfeit = events.filter((event) => event.result === 'counterfeit').length
  const cloned = events.filter((event) => event.result === 'already_used').length
  const fakeRate = total === 0 ? 0 : (counterfeit / total) * 100
  return { total, genuine, counterfeit, cloned, fakeRate }
}

export function chartSeries(events: AuditEvent[], from: string, to: string) {
  const start = new Date(`${from}T00:00:00`)
  const end = new Date(`${to}T00:00:00`)
  const days: { key: string; label: string; genuine: number; counterfeit: number }[] = []
  const cursor = new Date(start)
  let guard = 0
  while (cursor <= end && guard < 21) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`
    days.push({
      key,
      label: cursor.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      genuine: 0,
      counterfeit: 0,
    })
    cursor.setDate(cursor.getDate() + 1)
    guard += 1
  }
  const index = new Map(days.map((day, i) => [day.key, i]))
  for (const event of events) {
    const date = new Date(event.timestamp)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const slot = index.get(key)
    if (slot === undefined) continue
    if (event.result === 'genuine') days[slot].genuine += 1
    if (event.result === 'counterfeit') days[slot].counterfeit += 1
  }
  return days
}

export function hotspotCounts(events: AuditEvent[], reports: FarmerReport[]) {
  const counts: Record<string, number> = {}
  for (const event of events) {
    if (event.result === 'counterfeit' || event.result === 'already_used') {
      counts[event.province] = (counts[event.province] ?? 0) + 1
    }
  }
  for (const report of reports) {
    counts[report.province] = (counts[report.province] ?? 0) + 1
  }
  return counts
}
