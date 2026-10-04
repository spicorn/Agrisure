import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { buttonClass } from '../lib/buttonClass.ts'
import { Wordmark } from './Logo.tsx'

const LINKS = [
  { to: '/#problem', label: 'Problem' },
  { to: '/#how', label: 'How it works' },
  { to: '/demo', label: 'Live Demo' },
  { to: '/dashboard', label: 'Dashboard' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="no-print sticky top-0 z-40 border-b border-forest/10 bg-paper/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3" aria-label="Primary">
        <Link to="/" aria-label="Agrisure home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) =>
            link.to.startsWith('/#') ? (
              <Link key={link.label} to={{ pathname: '/', hash: link.to.slice(2) }} className="text-sm font-semibold text-ink-soft hover:text-forest">
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-forest' : 'text-ink-soft hover:text-forest'}`}
              >
                {link.label}
              </NavLink>
            ),
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/demo" className={`${buttonClass('primary')} hidden sm:inline-flex`}>
            Try the demo
          </Link>
          <button type="button" className="rounded-full p-2 lg:hidden" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {open ? (
        <div className="space-y-1 border-t border-forest/10 px-4 py-3 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to.startsWith('/#') ? { pathname: '/', hash: link.to.slice(2) } : link.to}
              className="block rounded-xl px-3 py-2 font-semibold text-forest"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/demo" className={`${buttonClass('primary')} mt-2 w-full`} onClick={() => setOpen(false)}>
            Try the demo
          </Link>
        </div>
      ) : null}
    </header>
  )
}
