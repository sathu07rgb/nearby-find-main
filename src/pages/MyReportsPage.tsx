import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Sparkles, CheckCircle2, XCircle, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useReports } from '../context/ReportsContext'
import { useToast } from '../context/ToastContext'
import {
  formatDate,
  formatRelativeTime,
  getCategoryEmoji,
  getCategoryLabel,
  REPORT_STATUS_LABELS,
} from '../lib/utils'

export function MyReportsPage() {
  const { user, demoLoggedIn } = useAuth()
  const { reports, matches } = useReports()
  const { showSuccess } = useToast()
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all')

  const currentUserId = user?.id || (demoLoggedIn ? 'demo-user-001' : null)

  const userReports = useMemo(() => {
    return reports.filter((r) => {
      // In demo mode or if matches reporter
      if (currentUserId && r.reporter_id === currentUserId) return true
      if (demoLoggedIn && r.is_demo) return true
      return false
    })
  }, [reports, currentUserId, demoLoggedIn])

  const filteredReports = useMemo(() => {
    if (activeTab === 'all') return userReports
    return userReports.filter((r) => r.report_type === activeTab)
  }, [userReports, activeTab])

  const handleUpdateStatus = (reportId: string, newStatus: 'recovered' | 'closed' | 'open') => {
    const report = reports.find((r) => r.id === reportId)
    if (report) {
      report.status = newStatus
      showSuccess('Report status updated', `Item marked as ${newStatus}.`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">My Reports</h1>
          <p className="text-sm text-brand-muted mt-1">
            Manage your submitted lost and found reports and coordinate recoveries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/report-lost">
            <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
              <Plus className="w-4 h-4 mr-1" /> Lost Item
            </Button>
          </Link>
          <Link to="/report-found">
            <Button size="sm" variant="primary">
              <Plus className="w-4 h-4 mr-1" /> Found Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 transition-colors ${
            activeTab === 'all'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-brand-muted hover:text-brand-text'
          }`}
        >
          All ({userReports.length})
        </button>
        <button
          onClick={() => setActiveTab('lost')}
          className={`pb-3 transition-colors ${
            activeTab === 'lost'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-brand-muted hover:text-brand-text'
          }`}
        >
          Lost Items ({userReports.filter((r) => r.report_type === 'lost').length})
        </button>
        <button
          onClick={() => setActiveTab('found')}
          className={`pb-3 transition-colors ${
            activeTab === 'found'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-brand-muted hover:text-brand-text'
          }`}
        >
          Found Items ({userReports.filter((r) => r.report_type === 'found').length})
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const reportMatches = matches.filter(
              (m) => m.lost_report_id === report.id || m.found_report_id === report.id
            )
            const isLost = report.report_type === 'lost'

            return (
              <div
                key={report.id}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{getCategoryEmoji(report.category)}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
                        {isLost ? 'Lost' : 'Found'}
                      </span>
                      <span className="badge border bg-gray-50 border-gray-200">
                        {REPORT_STATUS_LABELS[report.status]?.label || report.status}
                      </span>
                      <span className="text-xs text-brand-muted">#{report.id.slice(-6).toUpperCase()}</span>
                    </div>
                    <h3 className="font-bold text-brand-navy text-base">{report.item_name}</h3>
                    <p className="text-xs text-brand-muted line-clamp-1">{report.description}</p>
                    <div className="flex items-center gap-3 text-xs text-brand-muted pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {report.city}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(report.event_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side controls */}
                <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                  {reportMatches.length > 0 && (
                    <Link to="/matches">
                      <Button size="sm" variant="secondary" className="text-xs">
                        <Sparkles className="w-3.5 h-3.5 mr-1" /> {reportMatches.length} Matches
                      </Button>
                    </Link>
                  )}

                  {report.status !== 'recovered' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-green-700 border-green-200 hover:bg-green-50"
                      onClick={() => handleUpdateStatus(report.id, 'recovered')}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Recovered
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-500"
                      onClick={() => handleUpdateStatus(report.id, 'open')}
                    >
                      Reopen
                    </Button>
                  )}

                  <Link to={`/items/${report.id}`}>
                    <Button size="sm" variant="ghost" className="text-xs">
                      View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-sm font-semibold text-brand-text mb-1">No reports in this category</p>
          <p className="text-xs text-brand-muted max-w-sm mx-auto mb-4">
            You haven't submitted any reports matching this filter yet.
          </p>
          <Link to="/report-lost">
            <Button size="sm" variant="primary">Create a Report</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
