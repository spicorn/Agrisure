import { CountUp } from '../CountUp.tsx'
import { Reveal } from '../Reveal.tsx'

const STATS = [
  { value: 15, suffix: '%', label: 'Agriculture is about 12–15% of Zimbabwe’s GDP.' },
  { value: 70, suffix: '%', label: 'Over 70% of the rural population depends on farming.' },
  { value: 25, suffix: '%', label: 'Up to 25% of agricultural chemicals in developing markets are fake.' },
]

export function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-24 bg-paper py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">The problem</p>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-extrabold text-forest sm:text-4xl">
            A fake bag looks like the real one until the crop fails.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <article className="h-full rounded-2xl bg-white p-6 shadow-card">
                <p className="font-heading text-5xl font-extrabold text-forest">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{stat.label}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-soft">Source for the chemical figure: Interpol, Operation Pangea, 2023.</p>
        <Reveal>
          <blockquote className="mt-8 rounded-2xl border border-gold/40 bg-gold-soft/60 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#92400e]">A season in Murehwa</p>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink">
              Last season a smallholder paid for maize seed that looked certified. Germination was thin. The crop failed.
              The household lost the income that pays school fees, and the agro-dealer still insisted the bag was genuine.
              Trust broke — in the brand, the dealer, and the next planting.
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
