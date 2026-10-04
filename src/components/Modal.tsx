import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close dialog" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agrisure-modal-title"
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-paper p-6 shadow-2xl"
      >
        <h2 id="agrisure-modal-title" className="font-heading text-xl font-bold text-forest">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
