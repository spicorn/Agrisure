import { useEffect, useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Footer } from '../components/Footer.tsx'
import { LanguageSwitcher } from '../components/LanguageSwitcher.tsx'
import { Logo } from '../components/Logo.tsx'
import { Navbar } from '../components/Navbar.tsx'
import { PhoneFrame } from '../components/PhoneFrame.tsx'
import { QRScanner } from '../components/QRScanner.tsx'
import { ScratchCard } from '../components/ScratchCard.tsx'
import { SeedBag } from '../components/SeedBag.tsx'
import { SmsSimulator } from '../components/SmsSimulator.tsx'
import { DEMO_SCRATCH_CODE } from '../data/mockCodes.ts'
import { PLACES } from '../data/provinces.ts'
import type { Network } from '../data/types.ts'
import { useVerification } from '../context/useVerification.ts'
import { useT } from '../lib/useT.ts'

export default function Demo() {
  const { resetDemo, language } = useVerification()
  const [session, setSession] = useState(0)

  useEffect(() => {
    document.title = 'Farmer demo · Agrisure'
  }, [])

  const reset = () => {
    resetDemo()
    setSession((value) => value + 1)
  }

  return (
    <div>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <main>
        <DemoSession key={session} language={language} onReset={reset} />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}

function DemoSession({ language, onReset }: { language: string; onReset: () => void }) {
  const t = useT()
  const [tab, setTab] = useState<'qr' | 'sms'>('qr')
  const [code, setCode] = useState('')
  const [place, setPlace] = useState('Murehwa')
  const [network, setNetwork] = useState<Network>('Econet')

  return (
    <div className="mx-auto grid max-w-5xl items-start gap-6 px-4 py-4 md:py-10 lg:grid-cols-[280px_minmax(0,400px)] lg:justify-center">
      <section className="lg:pt-8" aria-labelledby="bag-title">
        <div className="mb-3 flex items-center justify-between md:hidden">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-forest">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Agrisure
          </Link>
          <Button type="button" variant="outline" className="px-3 py-1.5" onClick={onReset}>
            {t('reset')}
          </Button>
        </div>
        <h1 id="bag-title" className="mb-4 hidden font-heading text-3xl font-extrabold text-forest md:block">
          Farmer verification
        </h1>
        <SeedBag brand="SeedCo" title="SC 727" subtitle="Scratch the panel, then verify">
          <ScratchCard code={DEMO_SCRATCH_CODE} onReveal={setCode} />
        </SeedBag>
        <p className="mx-auto mt-4 hidden max-w-xs text-center text-sm text-ink-soft md:block">
          The code under the panel fills the phone. Check it once, then again, to see one-time deactivation.
        </p>
        <div className="mt-4 hidden md:block">
          <Button type="button" variant="outline" onClick={onReset}>
            {t('reset')}
          </Button>
        </div>
      </section>
      <PhoneFrame>
        <div className="flex items-center justify-between bg-forest px-3 py-3 text-white" lang={language === 'sn' ? 'sn' : language === 'nd' ? 'nd' : 'en'}>
          <span className="inline-flex items-center gap-2 font-heading font-bold">
            <Logo className="h-7 w-8" />
            Agrisure
          </span>
          <LanguageSwitcher />
        </div>
        <p className="bg-emerald-soft px-3 py-2 text-center text-[11px] font-semibold text-[#065f46]">{t('awareness')}</p>
        <div className="grid grid-cols-2 gap-2 border-b border-forest/10 bg-white px-3 py-2">
          <label className="text-[11px] font-semibold text-ink-soft">
            {t('yourArea')}
            <select className="mt-1 w-full rounded-lg border border-forest/15 px-2 py-1 text-sm text-ink" value={place} onChange={(event) => setPlace(event.target.value)}>
              {PLACES.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-semibold text-ink-soft">
            {t('network')}
            <select className="mt-1 w-full rounded-lg border border-forest/15 px-2 py-1 text-sm text-ink" value={network} onChange={(event) => setNetwork(event.target.value as Network)}>
              {['Econet', 'NetOne', 'Telecel', 'TelOne'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <LayoutGroup id="demo-tabs">
          <div className="grid grid-cols-2 gap-1 bg-paper px-3 py-2" role="tablist">
            {([
              ['qr', t('scanQr')],
              ['sms', t('smsTab')],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className="relative rounded-xl px-3 py-2 text-sm font-bold text-forest"
                onClick={() => setTab(id)}
              >
                {tab === id ? <motion.span layoutId="demo-tab" className="absolute inset-0 rounded-xl bg-white shadow-sm" /> : null}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div className="flex min-h-0 flex-1 flex-col">
          {tab === 'qr' ? (
            <QRScanner code={code} onCodeChange={setCode} place={place} network={network} />
          ) : (
            <SmsSimulator code={code} onCodeChange={setCode} place={place} network={network} onNetwork={setNetwork} />
          )}
        </div>
      </PhoneFrame>
    </div>
  )
}
