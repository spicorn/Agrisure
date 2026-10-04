import { dictionary, type MessageKey } from '../data/translations.ts'
import { useVerification } from '../context/useVerification.ts'

export function useT() {
  const { language } = useVerification()
  return (key: MessageKey, vars?: Record<string, string>) => {
    const template = dictionary[language][key]
    if (!vars) return template
    return template.replace(/\{(\w+)\}/g, (_, token: string) => vars[token] ?? '')
  }
}
