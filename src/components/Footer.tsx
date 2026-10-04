import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TEAM } from '../data/team.ts'
import { Button } from './Button.tsx'
import { Logo } from './Logo.tsx'
import { Modal } from './Modal.tsx'

export function Footer() {
  const [open, setOpen] = useState(false)
  return (
    <footer className="no-print border-t border-forest/10 bg-forest text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-11" />
            <div>
              <p className="font-heading text-lg font-extrabold">Agrisure Security Company (Pvt) Ltd</p>
              <p className="text-sm text-white/75">Scan. Verify. Farm with confidence.</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
            Protecting every harvest: seeds, fertilizers, stock feeds, chemicals.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Product</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-gold" to="/demo">Farmer demo</Link></li>
            <li><Link className="hover:text-gold" to="/manufacturer">Code generator</Link></li>
            <li><Link className="hover:text-gold" to="/dashboard">Fraud dashboard</Link></li>
            <li><Link className="hover:text-gold" to="/audit">Forensic audit trail</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Campus</p>
          <p className="mt-3 text-sm leading-6 text-white/80">Harare Institute of Technology — Department of Forensic Accounting and Auditing — 2026</p>
          <p className="mt-2 text-sm text-white/80">HIT 1101 Technopreneurship 1</p>
          <Button type="button" variant="gold" className="mt-4" onClick={() => setOpen(true)}>
            Team
          </Button>
        </div>
      </div>
      <Modal open={open} title="HIT 1101 Technopreneurship 1" onClose={() => setOpen(false)}>
        <ul className="divide-y divide-forest/10">
          {TEAM.map((member) => (
            <li key={member.reg} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="font-semibold text-ink">{member.name}</span>
              <span className="font-mono text-forest">{member.reg}</span>
            </li>
          ))}
        </ul>
      </Modal>
    </footer>
  )
}
