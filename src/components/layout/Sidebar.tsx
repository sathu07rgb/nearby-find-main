import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  AlertCircle,
  Search,
  Sparkles,
  FileText,
  MessageSquare,
  User,
  Settings,
  LogOut,
  CheckSquare,
  PackageSearch,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'

const SIDEBAR_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/report-lost', label: 'Report Lost', icon: AlertCircle },
  { to: '/report-found', label: 'Report Found', icon: PackageSearch },
  { to: '/browse', label: 'Browse Items', icon: Search },
  { to: '/matches', label: 'AI Matches', icon: Sparkles },
  { to: '/my-reports', label: 'My Reports', icon: FileText },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
]

const BOTTOM_LINKS = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 min-h-screen sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Dashboard navigation">
        {SIDEBAR_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'text-primary-blue bg-pale-blue'
                  : 'text-brand-muted hover:text-brand-text hover:bg-gray-50',
              )
            }
          >
            <link.icon className="w-4 h-4 flex-shrink-0" aria-hidden />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        {BOTTOM_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'text-primary-blue bg-pale-blue'
                  : 'text-brand-muted hover:text-brand-text hover:bg-gray-50',
              )
            }
          >
            <link.icon className="w-4 h-4 flex-shrink-0" aria-hidden />
            {link.label}
          </NavLink>
        ))}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
