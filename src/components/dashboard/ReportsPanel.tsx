import type { FarmerReport, ReportStatus } from '../../data/types.ts'
import { formatStamp } from '../../lib/format.ts'
import { useVerification } from '../../context/useVerification.ts'

const NEXT: Record<ReportStatus, ReportStatus> = {
  new: 'investigating',
  investigating: 'referred',
  referred: 'new',
}

const LABEL: Record<ReportStatus, string> = {
  new: 'New',
  investigating: 'Investigating',
  referred: 'Referred to regulator',
}

const TONE: Record<ReportStatus, string> = {
  new: 'bg-gold-soft text-[#92400e]',
  investigating: 'bg-emerald-soft text-[#065f46]',
  referred: 'bg-forest text-white',
}

export function ReportsPanel({ reports }: { reports: FarmerReport[] }) {
  const { setReportStatus } = useVerification()
  return (
    <section className="rounded-2xl bg-white p-4 shadow-card">
      <h3 className="font-heading text-lg font-bold text-forest">Reports</h3>
      <p className="text-sm text-ink-soft">Filed from the farmer demo. Click a status to move it along.</p>
      {reports.length === 0 ? (
        <p className="mt-4 rounded-xl bg-paper px-3 py-4 text-sm text-ink-soft">No farmer reports yet. Submit one from a counterfeit or cloned result in the demo.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reports.map((report) => (
            <li key={report.id} className="rounded-xl border border-forest/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm font-bold text-forest">{report.code}</p>
                <button
                  type="button"
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${TONE[report.status]}`}
                  onClick={() => setReportStatus(report.id, NEXT[report.status])}
                >
                  {LABEL[report.status]}
                </button>
              </div>
              <p className="mt-1 text-sm">{report.product}</p>
              <p className="text-xs text-ink-soft">
                {report.dealerName} · {report.location} · {formatStamp(report.timestamp)}
                {report.hasPhoto ? ' · Photo attached' : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
