export function Logo({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 64" className={className} aria-hidden="true">
      <path d="M9 56c6-8 7-16 3-28" stroke="#C4A035" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M12 48c-5-.7-7.5-3-7.5-3s2.6-3.2 7.6-2.2" stroke="#F5B83D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M11.5 39c-5-.7-7.5-3-7.5-3s2.6-3.2 7.6-2.2" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M11 30c-5-.7-7.5-3-7.5-3s2.6-3.2 7.6-2.2" stroke="#0B3D2E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M63 56c-6-8-7-16-3-28" stroke="#C4A035" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M60 48c5-.7 7.5-3 7.5-3s-2.6-3.2-7.6-2.2" stroke="#F5B83D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M60.5 39c5-.7 7.5-3 7.5-3s-2.6-3.2-7.6-2.2" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M61 30c5-.7 7.5-3 7.5-3s-2.6-3.2-7.6-2.2" stroke="#0B3D2E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M36 4 58 12.5V28c0 13.5-8.6 23-22 27.4C22.6 51 14 41.5 14 28V12.5L36 4Z" fill="#0B3D2E" />
      <path d="M36 8.2 54 15.2V28c0 11.2-7 19.2-18 23C25 47.2 18 39.2 18 28V15.2L36 8.2Z" fill="#0F4A38" />
      <g fill="#F7F8F5">
        <rect x="24" y="16" width="6" height="6" rx="0.7" />
        <rect x="31.5" y="16" width="2.6" height="2.6" rx="0.3" />
        <rect x="35.2" y="16" width="2.6" height="2.6" rx="0.3" />
        <rect x="40" y="16" width="6" height="6" rx="0.7" />
        <rect x="24" y="23.4" width="2.6" height="2.6" rx="0.3" />
        <rect x="27.8" y="23.4" width="2.6" height="2.6" rx="0.3" />
        <rect x="37.2" y="23.4" width="2.6" height="2.6" rx="0.3" />
        <rect x="43.4" y="23.4" width="2.6" height="2.6" rx="0.3" />
        <rect x="24" y="29" width="6" height="6" rx="0.7" />
        <rect x="40" y="29" width="6" height="6" rx="0.7" />
      </g>
      <path d="M28.2 42.2 32.6 46.6 44 33.2" stroke="#10B981" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Logo className="h-9 w-10 shrink-0" />
      <span className="leading-tight">
        <span className="block font-heading text-lg font-extrabold tracking-tight text-forest">Agrisure</span>
        {compact ? null : (
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft sm:block">
            Scan. Verify. Farm with confidence.
          </span>
        )}
      </span>
    </span>
  )
}
