import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '../../lib/buttonClass.ts'
import { SeedBag } from '../SeedBag.tsx'

export function HeroSection() {
  const reduced = useReducedMotion()
  return (
    <section className="hero-wash overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="glass-panel rounded-3xl p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">Scan. Verify. Farm with confidence.</p>
          <h1 className="mt-3 max-w-xl font-heading text-4xl font-extrabold tracking-tight text-forest sm:text-6xl">
            Verify before you plant.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-ink-soft">
            Instant genuine-or-fake feedback on seeds, fertilizers, pesticides and stock feeds — even without a smartphone.
          </p>
          <p className="mt-2 text-sm font-medium text-forest">Protecting every harvest: seeds, fertilizers, stock feeds, chemicals.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/demo" className={buttonClass('primary')}>Try farmer demo</Link>
            <Link to="/dashboard" className={buttonClass('gold')}>View fraud dashboard</Link>
          </div>
        </div>
        <div className="relative mx-auto h-[460px] w-full max-w-md">
          <SeedBag brand="SeedCo" title="SC 727" subtitle="Late maturity maize · 25kg">
            <div className="mx-auto grid h-16 w-16 grid-cols-4 gap-0.5 rounded-md bg-white p-1" aria-hidden="true">
              {Array.from({ length: 16 }, (_, index) => (
                <span key={index} className={index % 3 === 0 ? 'bg-forest' : 'bg-forest/15'} />
              ))}
            </div>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-ink-soft">Scratch to reveal</p>
          </SeedBag>
          <motion.div
            className="absolute -right-1 bottom-4 w-44 rounded-[1.6rem] border-4 border-ink bg-white p-2 shadow-2xl sm:right-0"
            animate={reduced ? undefined : { y: [8, -6, 8] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <div className="rounded-xl bg-emerald-soft p-3 text-center">
              <BadgeCheck className="mx-auto h-7 w-7 text-[#065f46]" />
              <p className="font-heading text-sm font-extrabold text-[#065f46]">Genuine Product</p>
              <p className="text-[11px] text-[#065f46]">SeedCo SC 727 Certified</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
