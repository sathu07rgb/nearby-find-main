import { Link } from 'react-router-dom'
import { Logo } from '../ui/Logo'
import { Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo white size="md" />
            <p className="mt-4 text-sm text-blue-200 leading-relaxed">
              Connecting lost belongings with their owners through intelligent matching and community trust.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-200">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a href="mailto:support@finditnearby.local" className="hover:text-white transition-colors">
                support@finditnearby.local
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/browse', label: 'Browse Items' },
                { to: '/report-lost', label: 'Report Lost Item' },
                { to: '/report-found', label: 'Report Found Item' },
                { to: '/matches', label: 'AI Matches' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/setup', label: 'Setup Guide' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/auth/signin', label: 'Sign In' },
                { to: '/auth/signup', label: 'Create Account' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/profile', label: 'My Profile' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-200">
            &copy; {currentYear} FindIt Nearby. All rights reserved.
          </p>
          <p className="text-xs text-blue-300">
            Intelligent Lost & Found Platform
          </p>
        </div>
      </div>
    </footer>
  )
}
