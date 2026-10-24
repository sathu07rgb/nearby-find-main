import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Calendar,
  Tag,
  ArrowLeft,
  Shield,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Share2,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Textarea'
import { Input } from '../components/ui/Input'
import { MatchCard } from '../components/items/MatchCard'
import { useReports } from '../context/ReportsContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  formatDate,
  formatRelativeTime,
  getCategoryLabel,
  getCategoryEmoji,
  REPORT_STATUS_LABELS,
} from '../lib/utils'

export function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { getReport, getMatchesForReport, reports } = useReports()
  const { user, demoLoggedIn } = useAuth()
  const { showSuccess, showError, showInfo } = useToast()
  const navigate = useNavigate()

  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [claimEvidence, setClaimEvidence] = useState('')
  const [claimSubmitting, setClaimSubmitting] = useState(false)

  const [abuseModalOpen, setAbuseModalOpen] = useState(false)
  const [abuseReason, setAbuseReason] = useState('')
  const [abuseSubmitting, setAbuseSubmitting] = useState(false)

  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState('')

  const report = getReport(id || '')
  const matches = id ? getMatchesForReport(id) : []

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-brand-navy mb-2">Report Not Found</h2>
        <p className="text-sm text-brand-muted mb-6">
          The requested report could not be found or has been removed.
        </p>
        <Link to="/browse">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Browse
          </Button>
        </Link>
      </div>
    )
  }

  const isLost = report.report_type === 'lost'
  const isReporter =
    (user && user.id === report.reporter_id) ||
    (demoLoggedIn && report.reporter_id === 'demo-user-001')

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimEvidence.trim()) {
      showError('Please provide verification details')
      return
    }

    setClaimSubmitting(true)
    setTimeout(() => {
      setClaimSubmitting(false)
      setClaimModalOpen(false)
      setClaimEvidence('')
      showSuccess(
        'Claim Submitted',
        'The finder has been notified to review your verification evidence.'
      )
    }, 600)
  }

  const handleAbuseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!abuseReason.trim()) {
      showError('Please state the reason for flagging this report')
      return
    }

    setAbuseSubmitting(true)
    setTimeout(() => {
      setAbuseSubmitting(false)
      setAbuseModalOpen(false)
      setAbuseReason('')
      showSuccess(
        'Report Received',
        'Thank you. Our moderation team has been notified.'
      )
    }, 500)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!initialMessage.trim()) return

    showSuccess('Message sent', 'Continuing to conversations.')
    setMessageModalOpen(false)
    navigate('/messages')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${isLost ? 'Lost' : 'Found'}: ${report.item_name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showInfo('Link copied to clipboard')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photos & Primary Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-card space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span
                  className={`badge ${isLost ? 'badge-lost' : 'badge-found'} font-semibold`}
                >
                  {isLost ? 'Lost Item' : 'Found Item'}
                </span>
                <span className="badge border bg-gray-50 text-gray-700 border-gray-200">
                  {REPORT_STATUS_LABELS[report.status]?.label || 'Open'}
                </span>
                {report.is_demo && (
                  <span className="badge bg-amber-50 text-amber-700 border border-amber-200">
                    Demo Record
                  </span>
                )}
                <span className="text-xs text-brand-muted ml-auto">
                  ID: #{report.id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy leading-snug">
                {report.item_name}
              </h1>

              <div className="flex items-center gap-4 text-xs text-brand-muted mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {getCategoryLabel(report.category)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(report.event_date)} ({formatRelativeTime(report.event_date)})
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {report.city}
                  {report.campus ? ` · ${report.campus}` : ''}
                </span>
              </div>
            </div>

            {/* Media preview */}
            <div
              className={`w-full aspect-video rounded-xl flex items-center justify-center text-6xl relative overflow-hidden bg-gradient-to-br ${
                isLost ? 'from-red-50 to-red-100' : 'from-green-50 to-green-100'
              }`}
            >
              {report.photo_paths && report.photo_paths.length > 0 ? (
                <img
                  src={report.photo_paths[0]}
                  alt={report.item_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getCategoryEmoji(report.category)}</span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-brand-text uppercase tracking-wider text-xs">
                Description
              </h2>
              <p className="text-sm text-brand-text leading-relaxed whitespace-pre-line">
                {report.description}
              </p>
            </div>

            {/* Location Landmark */}
            <div className="bg-pale-blue/60 p-4 rounded-xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-navy">
                <MapPin className="w-4 h-4 text-primary-blue" />
                Approximate Location
              </div>
              <p className="text-sm text-brand-text pl-5">
                {report.approximate_location}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text"
              >
                <Share2 className="w-4 h-4" /> Share Link
              </button>
              <button
                onClick={() => setAbuseModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700"
              >
                <AlertTriangle className="w-4 h-4" /> Report Suspicious Activity
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Actions, Verification, Reporter Card */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-brand-navy">Take Action</h2>

            {isReporter ? (
              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-900">
                You created this report. You can manage its status and review potential matches from your dashboard.
              </div>
            ) : isLost ? (
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => setMessageModalOpen(true)}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" /> I Found This Item
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => setClaimModalOpen(true)}
              >
                <Shield className="w-4 h-4 mr-1.5" /> Claim Ownership
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => setMessageModalOpen(true)}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" /> Contact via Platform
            </Button>

            <Link to="/matches" className="block">
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center text-xs"
              >
                <Sparkles className="w-4 h-4 mr-1.5" /> View AI Matches ({matches.length})
              </Button>
            </Link>
          </div>

          {/* Privacy & Safety Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <Shield className="w-4 h-4 text-green-600" />
              Ownership Protection
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              FindIt Nearby never automatically transfers ownership. To retrieve an item, the claimant must verify details known only to the genuine owner.
            </p>
          </div>
        </div>
      </div>

      {/* Potential Matches for this report */}
      {matches.length > 0 && (
        <div className="pt-8 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-blue" />
              Potential Matches ({matches.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => {
              const lost = reports.find((r) => r.id === match.lost_report_id)
              const found = reports.find((r) => r.id === match.found_report_id)
              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  lostReport={lost}
                  foundReport={found}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      <Modal
        open={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Submit Ownership Claim"
      >
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <p className="text-xs text-brand-muted leading-relaxed">
            Please answer verification questions to establish ownership. Mention specific serial numbers, wallpapers, markings, or interior contents.
          </p>
          <Textarea
            label="Verification Evidence & Details"
            placeholder="e.g. Inside the wallet is a metro card with ID ending in 442, and there is a family photograph in the zipper compartment."
            value={claimEvidence}
            onChange={(e) => setClaimEvidence(e.target.value)}
            required
            rows={4}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setClaimModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={claimSubmitting}>
              Submit Claim for Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* Message Modal */}
      <Modal
        open={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        title="Send Platform Message"
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <p className="text-xs text-brand-muted leading-relaxed">
            Contact the reporter safely through FindIt Nearby. Your phone number and email remain private.
          </p>
          <Textarea
            label="Message"
            placeholder="Hello, I believe this might be my item / I found an item matching your description..."
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            required
            rows={4}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMessageModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Message
            </Button>
          </div>
        </form>
      </Modal>

      {/* Report Abuse Modal */}
      <Modal
        open={abuseModalOpen}
        onClose={() => setAbuseModalOpen(false)}
        title="Report Inappropriate Content"
      >
        <form onSubmit={handleAbuseSubmit} className="space-y-4">
          <p className="text-xs text-brand-muted">
            If this post violates community guidelines, contains offensive material, or appears fraudulent, please explain below.
          </p>
          <Textarea
            label="Reason for Flagging"
            placeholder="Explain why this post should be reviewed by moderators..."
            value={abuseReason}
            onChange={(e) => setAbuseReason(e.target.value)}
            required
            rows={3}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAbuseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={abuseSubmitting}>
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
