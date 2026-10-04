import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Printer } from 'lucide-react'
import { Button } from '../components/Button.tsx'
import { ExpiryTimer } from '../components/ExpiryTimer.tsx'
import { Footer } from '../components/Footer.tsx'
import { Navbar } from '../components/Navbar.tsx'
import { MANUFACTURERS, SUGGESTED_PRODUCTS, type ManufacturerName } from '../data/mockCodes.ts'
import type { ProductCode } from '../data/types.ts'
import { isQrExpired } from '../context/logic.ts'
import { useVerification } from '../context/useVerification.ts'
import { downloadCsv } from '../lib/csv.ts'
import { money, qrUrl } from '../lib/format.ts'

const PRICE = 0.1

export default function Manufacturer() {
  const { generateCodes } = useVerification()
  const [manufacturer, setManufacturer] = useState<ManufacturerName>('SeedCo')
  const [product, setProduct] = useState(SUGGESTED_PRODUCTS.SeedCo.product)
  const [batch, setBatch] = useState(SUGGESTED_PRODUCTS.SeedCo.batch)
  const [quantity, setQuantity] = useState(12)
  const [labels, setLabels] = useState<ProductCode[]>([])
  const [notice, setNotice] = useState('')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    document.title = 'Issue codes · Agrisure'
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const qty = Math.min(50, Math.max(1, quantity || 1))
  const preview = labels[0]

  const onManufacturer = (value: ManufacturerName) => {
    setManufacturer(value)
    setProduct(SUGGESTED_PRODUCTS[value].product)
    setBatch(SUGGESTED_PRODUCTS[value].batch)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const created = generateCodes({ manufacturer, product, batch, quantity: qty })
    setLabels(created)
    setNotice(`${created.length} codes are now genuine in the farmer demo until the first scan.`)
  }

  const exportCsv = () => {
    downloadCsv('agrisure-labels.csv', [
      ['code', 'pin', 'product', 'manufacturer', 'batch', 'manufactured', 'expiry', 'qr'],
      ...labels.map((label) => [label.code, label.pin, label.product, label.manufacturer, label.batch, label.manufactureDate, label.expiry, qrUrl(label.code)]),
    ])
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Manufacturer</p>
        <h1 className="mt-2 font-heading text-4xl font-extrabold text-forest">Issue protected labels</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <form className="no-print space-y-4 rounded-2xl bg-white p-5 shadow-card" onSubmit={submit}>
            <label className="block text-sm font-semibold">
              Manufacturer
              <select className="mt-1 w-full rounded-xl border border-forest/15 px-3 py-2" value={manufacturer} onChange={(event) => onManufacturer(event.target.value as ManufacturerName)}>
                {MANUFACTURERS.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Product name
              <input className="mt-1 w-full rounded-xl border border-forest/15 px-3 py-2" value={product} onChange={(event) => setProduct(event.target.value)} required />
            </label>
            <label className="block text-sm font-semibold">
              Batch number
              <input className="mt-1 w-full rounded-xl border border-forest/15 px-3 py-2" value={batch} onChange={(event) => setBatch(event.target.value)} required />
            </label>
            <label className="block text-sm font-semibold">
              Quantity (1–50)
              <input className="mt-1 w-full rounded-xl border border-forest/15 px-3 py-2" type="number" min={1} max={50} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} required />
            </label>
            <Button type="submit">Generate codes</Button>
            {notice ? <p className="text-sm font-medium text-[#065f46]" role="status">{notice}</p> : null}
          </form>
          <aside className="no-print space-y-4">
            <article className="rounded-2xl bg-forest p-5 text-white shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Agrisure revenue</p>
              <p className="mt-2 font-heading text-3xl font-extrabold">{money(qty * PRICE)}</p>
              <p className="mt-2 text-sm text-white/80">{qty} codes × $0.10, inside the $0.05–$0.12 pay-per-QR band.</p>
            </article>
            <LabelPreview manufacturer={manufacturer} product={product} batch={batch} code={preview} now={now} />
          </aside>
        </div>
        {labels.length > 0 ? (
          <section className="mt-8">
            <div className="no-print mb-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4" aria-hidden="true" /> Print labels
              </Button>
              <Button type="button" variant="outline" onClick={exportCsv}>
                <Download className="h-4 w-4" aria-hidden="true" /> Download CSV
              </Button>
            </div>
            <div className="label-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {labels.map((label, index) => (
                <motion.article key={label.code} className="label-card rounded-2xl bg-white p-4 shadow-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 12) * 0.03 }}>
                  <QrFace code={label.code} issuedAt={label.issuedAt} now={now} />
                  <p className="mt-3 font-mono text-sm font-bold text-forest">{label.code}</p>
                  <p className="text-sm">Scratch-off PIN <span className="font-mono font-bold">{label.pin}</span></p>
                  <p className="text-xs text-ink-soft">{label.product}</p>
                  <p className="text-xs text-ink-soft">Batch {label.batch}</p>
                  <div className="mt-2">
                    <ExpiryTimer issuedAt={label.issuedAt} compact />
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}

function LabelPreview({
  manufacturer,
  product,
  batch,
  code,
  now,
}: {
  manufacturer: string
  product: string
  batch: string
  code?: ProductCode
  now: number
}) {
  const bottle = manufacturer === 'Agricura'
  return (
    <article className={`rounded-2xl p-4 text-white shadow-card ${bottle ? 'bg-[#14532d]' : 'bg-forest-mid'}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Label preview</p>
      <div className={`mt-3 rounded-2xl bg-paper p-3 text-ink ${bottle ? 'mx-auto w-40 rounded-b-full' : ''}`}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft">{manufacturer}</p>
        <p className="font-heading text-sm font-extrabold text-forest">{product}</p>
        <p className="text-xs">Batch {batch}</p>
        <div className="mt-2">
          {code ? <QrFace code={code.code} issuedAt={code.issuedAt} now={now} /> : <div className="grid h-24 place-items-center rounded-lg border border-dashed border-forest/20 text-xs text-ink-soft">QR after generate</div>}
        </div>
      </div>
    </article>
  )
}

function QrFace({ code, issuedAt, now }: { code: string; issuedAt: number; now: number }) {
  const expired = isQrExpired(issuedAt, now)
  return (
    <div className="relative mx-auto w-fit rounded-lg bg-white p-2">
      <QRCodeSVG value={qrUrl(code)} size={112} fgColor="#0B3D2E" bgColor="#FFFFFF" title={`Verification QR for ${code}`} />
      {expired ? <div className="absolute inset-2 grid place-items-center bg-white/90 text-sm font-extrabold uppercase text-alert">Expired</div> : null}
    </div>
  )
}
