import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  CheckCircle,
  ChevronRight,
  Lock,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ItemCard } from '../components/items/ItemCard'
import { useReports } from '../context/ReportsContext'
import { ITEM_CATEGORIES } from '../lib/utils'

const STEPS = [
  {
    step: '01',
    title: 'Report an Item',
    description: 'Submit a detailed report for your lost or found item. Add photos, approximate location, and key details.',
    icon: '📝',
    color: 'from-blue-50 to-blue-100 border-blue-200',
  },
  {
    step: '02',
    title: 'Discover Matches',
    description: 'Our explainable AI algorithm compares your report with others and calculates normalized similarity scores.',
    icon: '🔍',
    color: 'from-purple-50 to-purple-100 border-purple-200',
  },
  {
    step: '03',
    title: 'Verify & Recover',
    description: 'Confirm ownership through our secure verification workflow and coordinate a safe handover.',
    icon: '✅',
    color: 'from-green-50 to-green-100 border-green-200',
  },
]

const TRUST_POINTS = [
  {
    icon: Lock,
    title: 'Private Communication',
    description: 'Direct in-app messages protect your identity. Personal phone numbers and emails are never exposed publicly.',
  },
  {
    icon: CheckCircle,
    title: 'Ownership Verification',
    description: 'Claimants submit private evidence. Finders evaluate claims before confirming handovers.',
  },
  {
    icon: Shield,
    title: 'Sensitive Items Protocol',
    description: 'For IDs, passports, cards, and keys, we advise handover via campus security or official desks.',
  },
  {
    icon: Users,
    title: 'Community Moderation',
    description: 'Suspicious entries or abuse can be reported directly to administrators for immediate review.',
  },
]

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const { reports, loading } = useReports()
  const navigate = useNavigate()

  const recentReports = reports.filter((r) => r.status === 'open').slice(0, 6)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (searchCategory) params.set('category', searchCategory)
    if (searchCity) params.set('city', searchCity)
    navigate(`/browse?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-b from-pale-blue to-white pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Background decoration */}
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-indigo-100/40 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 text-sm text-primary-blue font-medium shadow-sm mb-6">
            <Sparkles className="w-4 h-4" aria-hidden />
            AI-Powered Lost & Found Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-navy leading-tight tracking-tight">
            Lost something?
            <br />
            <span className="text-primary-blue">Let's find it.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Report lost belongings, discover found items, and reconnect with what matters.
            FindIt Nearby helps communities find potential matches faster.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/report-lost">
              <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2">
                Report a Lost Item
                <ArrowRight className="w-5 h-5" aria-hidden />
              </Button>
            </Link>
            <Link to="/report-found">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Report a Found Item
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm mx-auto sm:max-w-none sm:grid-cols-3 sm:gap-8">
            {[
              { value: reports.length || '8+', label: 'Active Reports' },
              { value: '88%', label: 'Match Confidence' },
              { value: '3 min', label: 'Avg. Report Time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-brand-navy">{stat.value}</div>
                <div className="text-xs sm:text-sm text-brand-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK SEARCH ── */}
      <section className="py-10 bg-white border-b border-gray-100" aria-labelledby="search-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="search-heading" className="text-center text-xl font-bold text-brand-text mb-6">
            Search Lost & Found Items
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3" role="search">
            <Input
              placeholder="Search item name, keywords…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="flex-1"
              aria-label="Search query"
            />
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="input-base sm:w-44"
              aria-label="Category filter"
            >
              <option value="">All Categories</option>
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
            <Input
              placeholder="City / Campus"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
              className="sm:w-44"
              aria-label="Location filter"
            />
            <Button type="submit" variant="primary" size="md" className="sm:w-auto w-full flex-shrink-0">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 md:py-24 bg-white" aria-labelledby="how-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="how-heading" className="section-title">How It Works</h2>
            <p className="section-subtitle mt-3 max-w-xl mx-auto">
              Three simple steps to reconnect with your lost belongings safely.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map((step, idx) => (
              <div
                key={step.step}
                className={`relative rounded-2xl border bg-gradient-to-br p-6 lg:p-8 ${step.color}`}
              >
                {idx < STEPS.length - 1 && (
                  <ChevronRight
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-300 hidden md:block z-10"
                    aria-hidden
                  />
                )}
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-xs font-bold text-brand-muted tracking-widest uppercase mb-2">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-bold text-brand-text mb-2">{step.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-12 bg-pale-blue/50" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="categories-heading" className="text-center text-xl font-bold text-brand-text mb-8">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {ITEM_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                to={`/browse?category=${cat.value}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-blue hover:shadow-card-hover transition-all group text-center"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <span className="text-xs font-medium text-brand-muted group-hover:text-primary-blue transition-colors leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT REPORTS ── */}
      <section className="py-16 md:py-24 bg-white" aria-labelledby="recent-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 id="recent-heading" className="section-title">Recently Reported</h2>
              <p className="section-subtitle mt-1">Help reunite these items with their owners.</p>
            </div>
            <Link to="/browse">
              <Button variant="secondary" size="md">
                View All Items <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-4 space-y-3">
                  <div className="skeleton h-32 rounded-lg" />
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : recentReports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentReports.map((report) => (
                <ItemCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-pale-blue/50 rounded-2xl border border-blue-100">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">No reports yet</h3>
              <p className="text-brand-muted mb-6 max-w-sm mx-auto">
                Be the first to report a lost or found item in your community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/report-lost">
                  <Button variant="primary">Report Lost Item</Button>
                </Link>
                <Link to="/report-found">
                  <Button variant="secondary">Report Found Item</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── TRUST & SAFETY ── */}
      <section className="py-16 md:py-24 bg-brand-navy text-white" aria-labelledby="trust-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="trust-heading" className="text-3xl font-bold text-white">Trust & Safety</h2>
            <p className="mt-3 text-blue-200 text-lg max-w-xl mx-auto">
              FindIt Nearby protects user privacy with zero exposure of sensitive identifiers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_POINTS.map((point) => (
              <div key={point.title} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <point.icon className="w-8 h-8 text-secondary-blue mb-4" aria-hidden />
                <h3 className="text-base font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-sm text-blue-200 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-pale-blue" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="section-title mb-4">
            Ready to find what's lost?
          </h2>
          <p className="section-subtitle mb-8">
            Join your campus or community on FindIt Nearby today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth/signup">
              <Button size="lg" variant="primary">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="secondary">
                Browse Items
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
