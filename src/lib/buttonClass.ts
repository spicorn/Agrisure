type Variant = 'primary' | 'gold' | 'ghost' | 'danger' | 'outline'

const styles: Record<Variant, string> = {
  primary: 'bg-forest text-white hover:bg-forest-deep',
  gold: 'bg-gold text-ink hover:brightness-95',
  ghost: 'bg-transparent text-forest hover:bg-forest/5',
  danger: 'bg-alert text-white hover:brightness-95',
  outline: 'border border-forest/15 bg-white text-forest hover:border-forest/40',
}

export function buttonClass(variant: Variant = 'primary', className = '') {
  return `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`
}
