import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Search, AlertCircle, Sparkles, MessageSquare } from 'lucide-react'
import { cn } from '../../lib/utils'

const BOTTOM_NAV = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, exact: true },
  { to: '/browse', label: 'Browse', icon: Search },
  { to: '/report-lost', label: 'Report', icon: AlertCircle },
  { to: '/matches', label: 'Matches', icon: Sparkles },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
]

export function MobileBottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 safe-area-inset-bottom"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-stretch">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors min-h-[56px]',
                isActive
                  ? 'text-primary-blue'
                  : 'text-brand-muted hover:text-brand-text',
              )
            }
          >
            <item.icon className="w-5 h-5" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
