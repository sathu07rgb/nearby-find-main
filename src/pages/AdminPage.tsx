import { useState } from 'react'
import {
  ShieldAlert,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  FileText,
  UserX,
  History,
  Lock,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useReports } from '../context/ReportsContext'
import { useToast } from '../context/ToastContext'
import { formatRelativeTime } from '../lib/utils'

interface AbuseReportItem {
  id: string
  report_id: string
  item_name: string
  reporter_name: string
  reason: string
  created_at: string
  status: 'pending' | 'resolved' | 'dismissed'
}

const INITIAL_ABUSE_REPORTS: AbuseReportItem[] = [
  {
    id: 'ab-1',
    report_id: 'demo-report-005',
    item_name: 'Brown Leather Wallet',
    reporter_name: 'User #882',
    reason: 'Contains vague location and suspected scam contact attempt.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    status: 'pending',
  },
  {
    id: 'ab-2',
    report_id: 'demo-report-007',
    item_name: 'Student ID Card',
    reporter_name: 'Admin Automated Filter',
    reason: 'Sensitive document reported without institutional handover advice.',
    created_at: new Date(Date.now() - 18000000).toISOString(),
    status: 'pending',
  },
]

export function AdminPage() {
  const { reports } = useReports()
  const { showSuccess, showError } = useToast()
  const [abuseList, setAbuseList] = useState<AbuseReportItem[]>(INITIAL_ABUSE_REPORTS)
  const [actionHistory, setActionHistory] = useState<string[]>([
    'Automated security scan ran at system startup.',
    'Moderator reviewed and verified 14 demo records.',
  ])

  const handleResolveAbuse = (id: string, action: 'hide' | 'dismiss') => {
    setAbuseList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'resolved' } : item
      )
    )

    const actionText =
      action === 'hide'
        ? `Hidden flagged report for ticket #${id}`
        : `Dismissed flag #${id} as false alarm`

    setActionHistory((prev) => [actionText, ...prev])
    showSuccess('Moderation Action Logged', actionText)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">
            Moderation & Safety Console
          </h1>
        </div>
        <p className="text-sm text-brand-muted">
          Review community flagged items, moderate inappropriate listings, and protect member safety.
        </p>
      </div>

      {/* Security Note */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 leading-relaxed flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Server-Enforced Access Policy:</strong> In production environments, access to this administration dashboard and administrative database mutations requires a verified moderator or admin role in Supabase auth metadata. Service role secrets are never bundled into the client build.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Abuse Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-brand-navy flex items-center justify-between">
            <span>Pending Abuse Reports ({abuseList.filter((a) => a.status === 'pending').length})</span>
          </h2>

          <div className="space-y-3">
            {abuseList.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                    Flagged Item: {ticket.item_name}
                  </span>
                  <span className="text-xs text-brand-muted">
                    {formatRelativeTime(ticket.created_at)}
                  </span>
                </div>

                <div className="text-xs text-brand-text bg-gray-50 p-3 rounded-lg">
                  <strong>Reason:</strong> {ticket.reason}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[11px] text-brand-muted">
                    Reported by {ticket.reporter_name}
                  </span>
                  {ticket.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-gray-600"
                        onClick={() => handleResolveAbuse(ticket.id, 'dismiss')}
                      >
                        Dismiss Flag
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="text-xs"
                        onClick={() => handleResolveAbuse(ticket.id, 'hide')}
                      >
                        <EyeOff className="w-3.5 h-3.5 mr-1" /> Hide Listing
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Action Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Moderation Audit Log */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <History className="w-4 h-4 text-brand-muted" /> Audit Log
          </h2>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card divide-y divide-gray-100">
            {actionHistory.map((item, idx) => (
              <div key={idx} className="py-2.5 text-xs text-brand-text first:pt-0 last:pb-0">
                <span className="block text-[10px] text-brand-muted">Recorded Action</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
