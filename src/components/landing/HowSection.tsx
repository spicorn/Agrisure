import { motion, useReducedMotion } from 'framer-motion'

const STEPS = [
  { title: 'Manufacturer generates a unique code', body: 'Every bag or bottle gets a one-off identity. No two packs share a code.' },
  { title: 'Code printed under a scratch panel', body: 'The secret stays covered until the farmer buys it, so a photo of the shelf cannot be cloned.' },
  { title: 'Farmer buys', body: 'Agro-dealers sell the sealed pack. The scratch panel is still intact at the counter.' },
  { title: 'Farmer scans QR or sends SMS', body: 'A smartphone reads the QR. Any other phone sends the code to 33444.' },
  { title: 'System verifies and logs it', body: 'Agrisure answers genuine, already used, or counterfeit, and writes the check to the audit trail.' },
]

export function HowSection() {
  const reduced = useReducedMotion()
  return (
    <section id="how" className="scroll-mt-24 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">How it works</p>
        <h2 className="mt-2 font-heading text-3xl font-extrabold text-forest sm:text-4xl">Five steps from the factory to the field.</h2>
        <ol className="relative mt-12 space-y-6 border-l-2 border-emerald/40 pl-6">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              initial={reduced ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="relative"
            >
              <span className="absolute -left-[34px] grid h-8 w-8 place-items-center rounded-full bg-forest text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="font-heading text-lg font-bold text-forest">{step.title}</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-soft">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
