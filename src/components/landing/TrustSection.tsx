import { Link } from 'react-router-dom'
import { Factory, Landmark, Lock, MapPinned, ScrollText, ShieldCheck, Store, Tractor } from 'lucide-react'
import { buttonClass } from '../../lib/buttonClass.ts'
import { Reveal } from '../Reveal.tsx'

const FEATURES = [
  { icon: ShieldCheck, title: 'Anti-cloning encryption', body: 'Each code is unique and sealed. A photograph of a label is not enough to mint another valid pack.' },
  { icon: Lock, title: 'One-time deactivation', body: 'The first successful check retires the code. A second hit is flagged as a possible clone.' },
  { icon: MapPinned, title: 'Geo-tracking dashboard', body: 'Manufacturers and regulators see where genuine and fake checks cluster across provinces.' },
  { icon: ScrollText, title: 'Immutable audit trail', body: 'Every scan is hashed into a simulated ledger. If a past record is edited, the chain shows the break.' },
]

const AUDIENCE = [
  { icon: Tractor, title: 'Farmers', body: 'Check a bag before it goes into the soil, on a smartphone or a basic phone.' },
  { icon: Factory, title: 'Manufacturers', body: 'Seed Co, Windmill, ZFC and Agricura issue codes and watch their brands.' },
  { icon: Store, title: 'Agro-dealers', body: 'Certified retailers show farmers they sell sealed, verifiable stock.' },
  { icon: Landmark, title: 'Regulators', body: 'Ministry of Lands and Agriculture and SAZ follow reports and hotspots.' },
]

const MODEL = [
  { title: 'Pay per QR code', body: '$0.05–$0.12 each time a manufacturer prints a protected label.' },
  { title: 'SaaS dashboard', body: 'A subscription for live scans, hotspots and exportable reports.' },
  { title: 'Dealer certification', body: '$50 per year for an agro-dealer to be listed as a certified retailer.' },
  { title: 'Data and reports', body: 'Anonymised fraud trends for regulators, insurers and manufacturers.' },
]

export function TrustSection() {
  return (
    <div>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-3xl font-extrabold text-forest sm:text-4xl">Security a farmer can feel.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.05}>
                <article className="h-full rounded-2xl border border-forest/10 p-5">
                  <feature.icon className="text-emerald" aria-hidden="true" />
                  <h3 className="mt-3 font-heading text-lg font-bold text-forest">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{feature.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-3xl font-extrabold text-forest sm:text-4xl">Who it serves</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white p-5 shadow-card">
                <item.icon className="text-forest" aria-hidden="true" />
                <h3 className="mt-3 font-heading text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-forest py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">Business model</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODEL.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white/10 p-5">
                <h3 className="font-heading text-lg font-bold text-gold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/80">{item.body}</p>
              </article>
            ))}
          </div>
          <Link to="/manufacturer" className={`${buttonClass('gold')} mt-8`}>
            Open the code generator
          </Link>
        </div>
      </section>
    </div>
  )
}
