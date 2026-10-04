import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COUNTERFEIT_SAMPLE } from '../data/mockCodes.ts'
import type { Network, VerifyOutcome } from '../data/types.ts'
import { isSeedCode } from '../context/logic.ts'
import { useVerification } from '../context/useVerification.ts'
import { useT } from '../lib/useT.ts'
import { Button } from './Button.tsx'
import { ExpiryTimer } from './ExpiryTimer.tsx'
import { ResultBadge } from './ResultBadge.tsx'
import { ResultCard } from './ResultCard.tsx'

interface QRScannerProps {
  code: string
  onCodeChange: (value: string) => void
  place: string
  network: Network
}

export function QRScanner({ code, onCodeChange, place, network }: QRScannerProps) {
  const t = useT()
  const { codes, verifyCode } = useVerification()
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'result'>('idle')
  const [outcome, setOutcome] = useState<VerifyOutcome | null>(null)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const active = codes.find((item) => item.code === code.trim().toUpperCase() || item.pin === code.trim().toUpperCase())
  const generated = codes.filter((item) => !isSeedCode(item.code))

  const run = (value: string) => {
    const next = value.trim()
    if (!next) return
    onCodeChange(next)
    setPhase('scanning')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setOutcome(verifyCode({ code: next, channel: 'qr', network, place }))
      setPhase('result')
    }, 1400)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AnimatePresence mode="wait">
        {phase === 'result' && outcome ? (
          <motion.div key="result" className="min-h-0 flex-1 overflow-y-auto">
            <ResultCard outcome={outcome} onAgain={() => setPhase('idle')} />
          </motion.div>
        ) : (
          <motion.div key="scan" className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-forest-deep">
              <div className="absolute inset-6 rounded-xl border border-white/20" />
              <span className="absolute left-4 top-4 h-7 w-7 border-l-4 border-t-4 border-gold" />
              <span className="absolute right-4 top-4 h-7 w-7 border-r-4 border-t-4 border-gold" />
              <span className="absolute bottom-4 left-4 h-7 w-7 border-b-4 border-l-4 border-gold" />
              <span className="absolute bottom-4 right-4 h-7 w-7 border-b-4 border-r-4 border-gold" />
              {phase === 'scanning' ? <span className="scanline absolute left-6 right-6 h-0.5 bg-emerald shadow-[0_0_16px_#10B981]" /> : null}
              <p className="absolute inset-x-0 bottom-3 text-center text-xs font-medium text-white/80">
                {phase === 'scanning' ? t('verifying') : t('scan')}
              </p>
            </div>
            {active ? <ExpiryTimer issuedAt={active.issuedAt} /> : null}
            <label className="block text-sm font-semibold text-forest">
              {t('codeLabel')}
              <input
                value={code}
                onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
                className="mt-1 w-full rounded-xl border border-forest/15 bg-white px-3 py-2 font-mono uppercase tracking-wide"
                autoCapitalize="characters"
                aria-label={t('codeLabel')}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" onClick={() => run(code)} disabled={phase === 'scanning'}>
                {t('verify')}
              </Button>
              <Button type="button" variant="outline" onClick={() => run(code.trim() || 'AGR269514Q')} disabled={phase === 'scanning'}>
                {t('simulateScan')}
              </Button>
            </div>
            <CodeList title={t('demoCodes')} codes={[...codes.filter((item) => isSeedCode(item.code)).map((item) => item.code), COUNTERFEIT_SAMPLE]} lookup={codes} onPick={run} disabled={phase === 'scanning'} />
            {generated.length > 0 ? (
              <CodeList title={t('newCodes')} codes={generated.slice(-6).map((item) => item.code)} lookup={codes} onPick={run} disabled={phase === 'scanning'} />
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CodeList({
  title,
  codes,
  lookup,
  onPick,
  disabled,
}: {
  title: string
  codes: string[]
  lookup: { code: string; status: 'genuine' | 'already_used'; shortName: string }[]
  onPick: (code: string) => void
  disabled: boolean
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-soft">{title}</p>
      <ul className="space-y-1.5">
        {codes.map((code) => {
          const known = lookup.find((item) => item.code === code)
          return (
            <li key={code}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(code)}
                className="flex w-full items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-left shadow-sm disabled:opacity-50"
              >
                <span>
                  <span className="block font-mono text-sm font-bold text-forest">{code}</span>
                  <span className="block text-[11px] text-ink-soft">{known?.shortName ?? 'Not in registry'}</span>
                </span>
                <ResultBadge result={known ? (known.status === 'already_used' ? 'already_used' : 'genuine') : 'counterfeit'} />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
