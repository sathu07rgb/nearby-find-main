import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, Search, ChevronDown, LogOut, User, Settings, LayoutDashboard } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { useAuth, useIsAuthenticated } from '../../context/AuthContext'
import { isDemoMode } from '../../lib/supabase'
import { cn } from '../../lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/browse', label: 'Browse Items' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const isAuth = useIsAuthenticated()
  const { signOut, user, demoLoggedIn, isDemoMode: demoMode } = useAuth()
  const navigate = useNavigate()

  const displayName = demoLoggedIn
    ? 'Demo User'
    : user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'Account'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setProfileOpen(false)
  }

  return (
    <>
      {isDemoMode && (
        <div className="demo-banner">
          🎭 <strong>Demo Mode</strong> — No Supabase configured. Data is local and not persisted.{' '}
          <Link to="/setup" className="underline hover:no-underline">
            Setup instructions
          </Link>
        </div>
      )}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-nav">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    cn(
                      'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary-blue bg-pale-blue'
                        : 'text-brand-muted hover:text-brand-text hover:bg-gray-50',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {isAuth ? (
                <>
                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="hidden sm:flex p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-gray-50 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                  </Link>

                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-brand-text"
                      aria-expanded={profileOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary-blue text-white flex items-center justify-center text-xs font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium max-w-[100px] truncate">{displayName}</span>
                      <ChevronDown className="w-4 h-4 text-brand-muted" />
                    </button>

                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} aria-hidden />
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-modal border border-gray-100 py-1 z-20 animate-scale-in">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-brand-muted" />
                            Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <User className="w-4 h-4 text-brand-muted" />
                            My Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-brand-muted" />
                            Settings
                          </Link>
                          <div className="h-px bg-gray-100 my-1" />
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Dashboard CTA */}
                  <Link to="/dashboard" className="hidden sm:block">
                    <Button size="sm" variant="primary">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth/signin" className="hidden sm:block">
                    <Button size="sm" variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/auth/signup" className="hidden sm:block">
                    <Button size="sm" variant="primary">Get Started</Button>
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-gray-50 transition-colors lg:hidden"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary-blue bg-pale-blue'
                        : 'text-brand-muted hover:text-brand-text hover:bg-gray-50',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              {isAuth ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-brand-text hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-brand-text hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false) }}
                    className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/signin"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="ghost" size="md" className="w-full justify-start">Sign In</Button>
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="primary" size="md" className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
