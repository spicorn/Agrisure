import { MessageSquare, Smartphone } from 'lucide-react'
import { Reveal } from '../Reveal.tsx'

export function ChannelsSection() {
  return (
    <section className="bg-paper py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-heading text-3xl font-extrabold text-forest sm:text-4xl">Two ways to check. Every farmer included.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-2xl bg-forest p-6 text-white shadow-card">
              <Smartphone aria-hidden="true" />
              <h3 className="mt-4 font-heading text-2xl font-bold">Smartphone: scan QR</h3>
              <p className="mt-2 leading-7 text-white/80">
                Open the Agrisure camera, scan the label, and get a genuine, already-used, or counterfeit result in under 10 seconds.
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="h-full rounded-2xl bg-white p-6 shadow-card">
              <MessageSquare className="text-forest" aria-hidden="true" />
              <h3 className="mt-4 font-heading text-2xl font-bold text-forest">Any phone: SMS / USSD</h3>
              <p className="mt-2 leading-7 text-ink-soft">
                Scratch the panel and text the code to 33444. It works on Econet, NetOne, Telecel and TelOne, in Shona, Ndebele and English.
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
