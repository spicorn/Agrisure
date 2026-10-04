import { LayoutGroup, motion } from 'framer-motion'
import type { Language } from '../data/types.ts'
import { useVerification } from '../context/useVerification.ts'

const OPTIONS: { id: Language; label: string; name: string }[] = [
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'sn', label: 'Shona', name: 'Shona' },
  { id: 'nd', label: 'Ndebele', name: 'Ndebele' },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useVerification()
  return (
    <LayoutGroup id="language-switch">
      <div className="flex rounded-full bg-black/20 p-0.5" role="group" aria-label="Language">
        {OPTIONS.map((option) => {
          const active = language === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              aria-label={option.name}
              onClick={() => setLanguage(option.id)}
              className="relative rounded-full px-2 py-1 text-[11px] font-semibold text-white"
            >
              {active ? <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-white/20" /> : null}
              <span className="relative">{option.label}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
