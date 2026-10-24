import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  PackageSearch,
  Sparkles,
  CheckCircle,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { MatchCard } from '../components/items/MatchCard'
import { useAuth } from '../context/AuthContext'
import { useReports } from '../context/ReportsContext'
import { formatRelativeTime, getCategoryEmoji, REPORT_STATUS_LABELS } from '../lib/utils'

export function DashboardPage() {
  const { user, profile, demoLoggedIn, isDemoMode } = useAuth()
  const { reports, matches, loading } = useReports()

  const currentUserId = user?.id || (demoLoggedIn ? 'demo-user-001' : null)
  const displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    (demoLoggedIn ? 'Demo User' : 'Community Member')

  // Derive genuine stats from actual records
  const myReports = useMemo(() => {
    if (!currentUserId) return []
    return reports.filter((r) => r.reporter_id === currentUserId)
  }, [reports, currentUserId])

  const myLostCount = myReports.filter((r) => r.report_type === 'lost' && r.status === 'open').length
  const myFoundCount = myReports.filter((r) => r.report_type === 'found' && r.status === 'open').length
  const recoveredCount = myReports.filter((r) => r.status === 'recovered').length

  const myMatches = useMemo(() => {
    if (!currentUserId) return matches.slice(0, 4)
    const myReportIds = new Set(myReports.map((r) => r.id))
    const userMatches = matches.filter(
      (m) => myReportIds.has(m.lost_report_id) || myReportIds.has(m.found_report_id)
    )
    return userMatches.length > 0 ? userMatches : matches.slice(0, 4)
  }, [matches, myReports, currentUserId])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Track your lost items, review found belongings, and examine AI matches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/report-lost">
            <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
              <Plus className="w-4 h-4 mr-1" /> Report Lost
            </Button>
          </Link>
          <Link to="/report-found">
            <Button size="sm" variant="primary">
              <Plus className="w-4 h-4 mr-1" /> Report Found
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-brand-navy">{myLostCount}</span>
            <span className="text-xs text-brand-muted block">Open Lost Reports</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-brand-navy">{myFoundCount}</span>
            <span className="text-xs text-brand-muted block">Open Found Reports</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-blue flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-brand-navy">{myMatches.length}</span>
            <span className="text-xs text-brand-muted block">Potential Matches</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-brand-navy">{recoveredCount}</span>
            <span className="text-xs text-brand-muted block">Items Recovered</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Matches on Left, Activity on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: AI Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-blue" />
              High-Confidence Potential Matches
            </h2>
            <Link to="/matches" className="text-xs font-semibold text-primary-blue hover:underline">
              View All ({matches.length}) →
            </Link>
          </div>

          {myMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myMatches.slice(0, 4).map((m) => {
                const lost = reports.find((r) => r.id === m.lost_report_id)
                const found = reports.find((r) => r.id === m.found_report_id)
                return (
                  <MatchCard
                    key={m.id}
                    match={m}
                    lostReport={lost}
                    foundReport={found}
                  />
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <Sparkles className="w-10 h-10 text-brand-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-brand-text">No active matches found</p>
              <p className="text-xs text-brand-muted mt-1">
                When a new report matching your items is published, it will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Right: My Reports Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-navy">My Reports</h2>
            <Link to="/my-reports" className="text-xs font-semibold text-primary-blue hover:underline">
              Manage →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 shadow-card">
            {myReports.length > 0 ? (
              myReports.slice(0, 5).map((r) => (
                <Link
                  key={r.id}
                  to={`/items/${r.id}`}
                  className="p-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors block"
                >
                  <span className="text-2xl flex-shrink-0">{getCategoryEmoji(r.category)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-brand-text truncate">{r.item_name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-0.5">
                      <span className={r.report_type === 'lost' ? 'text-red-600' : 'text-green-600'}>
                        {r.report_type.toUpperCase()}
                      </span>
                      <span>·</span>
                      <span>{formatRelativeTime(r.event_date)}</span>
                    </div>
                  </div>
                  <span className="badge text-[10px] bg-gray-50 border border-gray-200">
                    {r.status}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-brand-muted">
                You haven't reported any lost or found items yet.
                <div className="mt-3 flex justify-center gap-2">
                  <Link to="/report-lost">
                    <Button size="sm" variant="outline">Report Lost</Button>
                  </Link>
                  <Link to="/report-found">
                    <Button size="sm" variant="primary">Report Found</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
