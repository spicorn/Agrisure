import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Network, VerifyOutcome } from '../data/types.ts'
import { useVerification } from '../context/useVerification.ts'
import { formatDate } from '../lib/format.ts'
import { useT } from '../lib/useT.ts'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']
const NETWORKS: Network[] = ['Econet', 'NetOne', 'Telecel', 'TelOne']

interface SmsSimulatorProps {
  code: string
  onCodeChange: (value: string) => void
  place: string
  network: Network
  onNetwork: (network: Network) => void
}

interface Bubble {
  id: string
  from: 'me' | 'them'
  text: string
}

export function SmsSimulator({ code, onCodeChange, place, network, onNetwork }: SmsSimulatorProps) {
  const t = useT()
  const { verifyCode } = useVerification()
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [typing, setTyping] = useState(false)
  const [busy, setBusy] = useState(false)

  const replyFor = (outcome: VerifyOutcome) => {
    if (outcome.result === 'genuine') return t('genuineSms', { name: outcome.shortName, batch: outcome.batch })
    if (outcome.result === 'already_used') {
      return t('alreadySms', {
        date: formatDate(outcome.verifiedAt ?? new Date().toISOString()),
        place: outcome.verifiedLocation ?? place,
      })
    }
    if (outcome.result === 'expired') return t('expiredSms')
    return t('fakeSms')
  }

  const send = () => {
    const next = code.trim()
    if (!next || busy) return
    setBusy(true)
    setBubbles((current) => [...current, { id: `out-${Date.now()}`, from: 'me', text: next.toUpperCase() }])
    setTyping(true)
    window.setTimeout(() => {
      const outcome = verifyCode({ code: next, channel: 'sms', network, place })
      setTyping(false)
      setBubbles((current) => [...current, { id: `in-${Date.now()}`, from: 'them', text: replyFor(outcome) }])
      setBusy(false)
    }, 1300)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#1c1917] text-[#d6d3d1]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs">
        <label className="font-semibold">
          <span className="sr-only">{t('network')}</span>
          <select
            aria-label={t('network')}
            value={network}
            onChange={(event) => onNetwork(event.target.value as Network)}
            className="rounded-md bg-transparent font-semibold text-[#d6d3d1]"
          >
            {NETWORKS.map((item) => (
              <option key={item} value={item} className="text-ink">
                {item}
              </option>
            ))}
          </select>
        </label>
        <span className="font-mono text-[11px] text-gold">SMS · 33444</span>
        <span aria-hidden="true">▮▮▮</span>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-[#c5d5b0] p-3 text-ink" aria-live="polite">
        <p className="text-center text-[11px] font-semibold text-[#3f4f32]">
          {t('toLabel')} 33444 · {network}
        </p>
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.p
              key={bubble.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${bubble.from === 'me' ? 'ml-auto bg-[#245c43] text-white' : 'bg-white text-ink'}`}
            >
              {bubble.text}
            </motion.p>
          ))}
        </AnimatePresence>
        {typing ? (
          <p className="w-fit rounded-2xl bg-white px-3 py-2 text-sm text-ink-soft">
            {t('typing')}
            <span className="inline-flex gap-1 pl-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest [animation-delay:240ms]" />
            </span>
          </p>
        ) : null}
      </div>
      <label className="block border-t border-white/10 px-3 py-2">
        <span className="sr-only">{t('typeCode')}</span>
        <input
          value={code}
          onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
          placeholder={t('typeCode')}
          className="w-full rounded-lg bg-[#292524] px-3 py-2 font-mono text-sm uppercase text-white placeholder:normal-case placeholder:text-white/40"
        />
      </label>
      <div className="grid grid-cols-3 gap-1 px-3 pb-2">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="rounded-lg bg-[#292524] py-2 text-sm font-semibold"
            onClick={() => onCodeChange(`${code}${key}`.slice(0, 16))}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 px-3 pb-3">
        <button type="button" className="rounded-xl bg-[#44403c] py-2 text-sm font-semibold" onClick={() => onCodeChange(code.slice(0, -1))}>
          {t('backspace')}
        </button>
        <button type="button" className="rounded-xl bg-emerald py-2 text-sm font-bold text-ink" disabled={busy} onClick={send}>
          {t('sendSms')}
        </button>
      </div>
    </div>
  )
}
