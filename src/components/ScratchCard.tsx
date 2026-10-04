import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useT } from '../lib/useT.ts'

interface ScratchCardProps {
  code: string
  onReveal: (code: string) => void
}

export function ScratchCard({ code, onReveal }: ScratchCardProps) {
  const t = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealedRef = useRef(false)
  const drawing = useRef(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let paintedWidth = 0
    const paint = () => {
      if (revealedRef.current || drawing.current) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width < 2 || Math.abs(rect.width - paintedWidth) < 1) return
      paintedWidth = rect.width
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
      gradient.addColorStop(0, '#d6d3d1')
      gradient.addColorStop(0.45, '#a8a29e')
      gradient.addColorStop(1, '#e7e5e4')
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = '#44403c'
      ctx.font = '700 11px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('SCRATCH', rect.width / 2, rect.height / 2 - 7)
      ctx.font = '600 10px Inter, sans-serif'
      ctx.fillText('PIN UNDER PANEL', rect.width / 2, rect.height / 2 + 9)
    }
    paint()
    const observer = new ResizeObserver(paint)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const finish = () => {
    if (revealedRef.current) return
    revealedRef.current = true
    setRevealed(true)
    onReveal(code)
  }

  const scratch = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealedRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 16, 0, Math.PI * 2)
    ctx.fill()
    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let clear = 0
    const step = 16
    for (let i = 3; i < sample.length; i += step * 4) {
      if (sample[i] < 32) clear += 1
    }
    if (clear / (sample.length / (step * 4)) > 0.42) finish()
  }

  return (
    <div className="relative mx-auto h-[76px] w-full overflow-hidden rounded-xl border border-dashed border-forest/30 bg-white">
      <p className="absolute inset-0 flex items-center justify-center px-2 text-center font-mono text-sm font-bold tracking-wide text-forest">
        {code}
      </p>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none ${revealed ? 'pointer-events-none opacity-0 transition-opacity' : 'cursor-crosshair'}`}
        aria-label={t('scratchHint')}
        onPointerDown={(event) => {
          drawing.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          scratch(event)
        }}
        onPointerMove={scratch}
        onPointerUp={() => {
          drawing.current = false
        }}
        onPointerCancel={() => {
          drawing.current = false
        }}
      />
      <div className="absolute inset-x-0 bottom-1 flex justify-center">
        {revealed ? (
          <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-bold text-[#065f46]" role="status">
            {t('revealed')}
          </span>
        ) : (
          <button type="button" className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-forest" onClick={finish}>
            {t('revealCode')}
          </button>
        )}
      </div>
    </div>
  )
}
