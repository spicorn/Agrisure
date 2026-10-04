import { AlertTriangle, BadgeCheck, Clock3, ShieldX } from 'lucide-react'
import type { VerifyStatus } from '../data/types.ts'

const STYLES: Record<VerifyStatus, string> = {
  genuine: 'bg-emerald-soft text-[#065f46]',
  already_used: 'bg-gold-soft text-[#92400e]',
  counterfeit: 'bg-alert-soft text-[#991b1b]',
  expired: 'bg-slate-200 text-slate-700',
}

const LABELS: Record<VerifyStatus, string> = {
  genuine: 'Genuine',
  already_used: 'Possible clone',
  counterfeit: 'Counterfeit',
  expired: 'Expired',
}

export function ResultBadge({ result }: { result: VerifyStatus }) {
  const Icon = result === 'genuine' ? BadgeCheck : result === 'already_used' ? AlertTriangle : result === 'expired' ? Clock3 : ShieldX
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[result]}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {LABELS[result]}
    </span>
  )
}
