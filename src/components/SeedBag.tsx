import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function SeedBag({
  brand,
  title,
  subtitle,
  children,
}: {
  brand: string
  title: string
  subtitle: string
  children?: ReactNode
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className="relative mx-auto w-[250px]"
      animate={reduced ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="absolute -top-3 left-1/2 h-8 w-28 -translate-x-1/2 rounded-t-2xl bg-forest-deep" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-b-[2rem] rounded-t-2xl bg-gradient-to-b from-forest-mid to-forest px-4 pb-5 pt-8 shadow-card">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/20" aria-hidden="true" />
        <div className="relative rounded-2xl bg-paper p-3 text-center shadow-inner">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">{brand}</p>
          <p className="font-heading text-xl font-extrabold text-forest">{title}</p>
          <p className="text-xs text-ink-soft">{subtitle}</p>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </motion.div>
  )
}
