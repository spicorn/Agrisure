import { ClipboardList, Factory, LayoutDashboard, Smartphone, Sprout } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/audit', label: 'Audit trail', icon: ClipboardList },
  { to: '/demo', label: 'Farmer demo', icon: Smartphone },
  { to: '/manufacturer', label: 'Issue codes', icon: Factory },
  { to: '/', label: 'Landing', icon: Sprout },
]

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return (
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 border-r border-forest/10 bg-white pt-20 transition-transform lg:static lg:translate-x-0 lg:pt-0`}>
      <p className="px-4 pb-2 pt-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">Agrisure console</p>
      <nav className="space-y-1 px-3" aria-label="Dashboard">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${isActive ? 'bg-forest text-white' : 'text-ink hover:bg-paper'}`}
          >
            <link.icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
