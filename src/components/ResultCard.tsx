import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, ShieldAlert } from 'lucide-react'
import type { VerifyOutcome } from '../data/types.ts'
import { useVerification } from '../context/useVerification.ts'
import { formatDate } from '../lib/format.ts'
import { useT } from '../lib/useT.ts'
import { Button } from './Button.tsx'

export function ResultCard({ outcome, onAgain }: { outcome: VerifyOutcome; onAgain: () => void }) {
  const t = useT()
  const reduced = useReducedMotion()
  const { submitReport } = useVerification()
  const [open, setOpen] = useState(false)
  const [dealer, setDealer] = useState('')
  const [place, setPlace] = useState(outcome.verifiedLocation ?? '')
  const [photo, setPhoto] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const tone =
    outcome.result === 'genuine'
      ? 'bg-emerald-soft text-[#065f46]'
      : outcome.result === 'already_used'
        ? 'bg-gold-soft text-[#92400e]'
        : outcome.result === 'expired'
          ? 'bg-slate-100 text-slate-800'
          : 'bg-alert-soft text-[#991b1b]'

  const headline =
    outcome.result === 'genuine'
      ? t('genuineBody', { name: outcome.shortName, batch: outcome.batch })
      : outcome.result === 'already_used'
        ? t('alreadyBody', {
            date: formatDate(outcome.verifiedAt ?? new Date().toISOString()),
            place: outcome.verifiedLocation ?? '—',
          })
        : outcome.result === 'expired'
          ? t('expiredBody')
          : t('counterfeitBody')

  const shake = outcome.result === 'counterfeit' && !reduced ? { x: [0, -12, 10, -8, 8, -3, 0] } : { x: 0 }

  const submit = () => {
    if (!dealer.trim() || !place.trim()) {
      setError(t('required'))
      return
    }
    submitReport({
      code: outcome.code,
      product: outcome.product,
      dealerName: dealer,
      place,
      note: '',
      hasPhoto: photo,
    })
    setSent(true)
    setOpen(false)
  }

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1, ...shake }}
      className={`relative m-4 overflow-hidden rounded-2xl p-4 ${tone}`}
    >
      {outcome.result === 'genuine' ? (
        <motion.div
          aria-hidden="true"
          initial={reduced ? false : { scale: 1.4, rotate: -18, opacity: 0 }}
          animate={{ scale: 1, rotate: -8, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="absolute right-3 top-3 grid h-16 w-16 place-items-center rounded-full border-4 border-[#065f46] text-[10px] font-extrabold uppercase tracking-wider text-[#065f46]"
        >
          {t('genuine')}
        </motion.div>
      ) : null}
      <div className="mb-3 flex items-center gap-2">
        {outcome.result === 'counterfeit' ? <ShieldAlert className="h-6 w-6" aria-hidden="true" /> : <BadgeCheck className="h-6 w-6" aria-hidden="true" />}
        <p className="font-heading text-lg font-extrabold leading-tight">{headline}</p>
      </div>
      {outcome.result === 'already_used' ? <p className="mb-3 text-sm font-medium">{t('cloneWarning')}</p> : null}
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wide opacity-70">{t('product')}</dt>
          <dd className="font-semibold">{outcome.product}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide opacity-70">{t('manufacturer')}</dt>
          <dd className="font-semibold">{outcome.manufacturer}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide opacity-70">{t('batch')}</dt>
          <dd className="font-semibold">{outcome.batch}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide opacity-70">{t('madeOn')}</dt>
          <dd className="font-semibold">{outcome.manufactureDate}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide opacity-70">{t('expiry')}</dt>
          <dd className="font-semibold">{outcome.expiry}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide opacity-70">{t('retailer')}</dt>
          <dd className="font-semibold">{outcome.retailer}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onAgain}>
          {t('tryAgain')}
        </Button>
        {outcome.result === 'already_used' || outcome.result === 'counterfeit' ? (
          <Button type="button" variant={outcome.result === 'counterfeit' ? 'danger' : 'gold'} onClick={() => setOpen(true)}>
            {outcome.result === 'counterfeit' ? t('reportTo') : t('reportProduct')}
          </Button>
        ) : null}
      </div>
      {sent ? <p className="mt-3 text-sm font-semibold">{t('reportThanks')}</p> : null}
      {open ? (
        <form
          className="mt-4 space-y-3 rounded-2xl bg-white p-3 text-ink"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <h3 className="font-heading font-bold text-forest">{t('reportTitle')}</h3>
          <label className="block text-sm font-medium">
            {t('dealerName')}
            <input className="mt-1 w-full rounded-xl border border-forest/15 px-3 py-2" value={dealer} onChange={(event) => setDealer(event.target.value)} required />
          </label>
          <label className="block text-sm font-medium">
            {t('dealerPlace')}
            <input className="mt-1 w-full rounded-xl border border-forest/15 px-3 py-2" value={place} onChange={(event) => setPlace(event.target.value)} required />
          </label>
          <button type="button" className="w-full rounded-xl border border-dashed border-forest/30 px-3 py-3 text-sm" onClick={() => setPhoto((value) => !value)}>
            {photo ? t('attached') : t('attach')}
          </button>
          {error ? <p className="text-sm font-semibold text-alert">{error}</p> : null}
          <div className="flex gap-2">
            <Button type="submit">{t('submit')}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
          </div>
        </form>
      ) : null}
    </motion.div>
  )
}
