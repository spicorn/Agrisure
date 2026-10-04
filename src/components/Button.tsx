import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonClass } from '../lib/buttonClass.ts'

type Variant = 'primary' | 'gold' | 'ghost' | 'danger' | 'outline'

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  )
}
