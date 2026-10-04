import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface CountUpProps {
  value: number
  decimals?: number
  suffix?: string
  prefix?: string
}

export function CountUp({ value, decimals = 0, suffix = '', prefix = '' }: CountUpProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [shown, setShown] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    if (!inView || reduced) return
    const from = fromRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900)
      const eased = 1 - (1 - progress) ** 3
      const next = Math.max(0, from + (value - from) * eased)
      fromRef.current = next
      setShown(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value])

  const display = reduced ? value : shown
  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
