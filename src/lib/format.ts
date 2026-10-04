export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Africa/Harare',
  }).format(new Date(iso))
}

export function formatStamp(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Harare',
  }).format(new Date(iso))
}

export function formatClock(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const mm = String(Math.floor(safe / 60)).padStart(2, '0')
  const ss = String(safe % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function localDateInput(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export function money(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function shortHash(hash: string) {
  if (hash.length < 18) return hash
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`
}

export function qrUrl(code: string) {
  return `https://scan.verify.farm/v/${code}`
}
