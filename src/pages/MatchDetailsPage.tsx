import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Tag,
  Shield,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Textarea'
import { useReports } from '../context/ReportsContext'
import { useToast } from '../context/ToastContext'
import {
  formatDate,
  formatRelativeTime,
  getCategoryLabel,
  getCategoryEmoji,
  getScoreColor,
  getScoreBg,
  MATCH_STATUS_LABELS,
} from '../lib/utils'

export function MatchDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { matches, reports } = useReports()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()

  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [claimEvidence, setClaimEvidence] = useState('')
  const [claimSubmitting, setClaimSubmitting] = useState(false)

  const match = matches.find((m) => m.id === id)

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-brand-navy mb-2">Match Record Not Found</h2>
        <p className="text-sm text-brand-muted mb-6">This candidate match might have been rejected or closed.</p>
        <Link to="/matches">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Matches
          </Button>
        </Link>
      </div>
    )
  }

  const lost = reports.find((r) => r.id === match.lost_report_id)
  const found = reports.find((r) => r.id === match.found_report_id)
  const scoreColor = getScoreColor(match.similarity_score)
  const scoreBg = getScoreBg(match.similarity_score)

  const handleRejectMatch = () => {
    match.status = 'rejected'
    showSuccess('Match rejected', 'This candidate has been moved to rejected status.')
    navigate('/matches')
  }

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimEvidence.trim()) return

    setClaimSubmitting(true)
    setTimeout(() => {
      setClaimSubmitting(false)
      match.status = 'under_review'
      setClaimModalOpen(false)
      showSuccess('Verification Initiated', 'Claim sent to finder for evidence review.')
    }, 500)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/matches"
          className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to AI Matches
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-blue" />
              Candidate Match Comparison
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Match Reference: #{match.id.toUpperCase()} · Status: {MATCH_STATUS_LABELS[match.status]?.label || 'Suggested'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-xl border text-base font-extrabold flex items-center gap-2 ${scoreBg} ${scoreColor}`}>
              <Sparkles className="w-4 h-4" />
              {match.similarity_score}/100 Similarity
            </div>
          </div>
        </div>
      </div>

      {/* Algorithmic Breakdown Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
          Algorithmic Score Breakdown
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-pale-blue/60 p-3.5 rounded-xl border border-blue-100">
            <span className="text-xs text-brand-muted block mb-1">Text Similarity (40%)</span>
            <span className="text-xl font-bold text-brand-navy">
              {match.match_explanation?.text_similarity ?? 75}%
            </span>
          </div>

          <div className="bg-pale-blue/60 p-3.5 rounded-xl border border-blue-100">
            <span className="text-xs text-brand-muted block mb-1">Category (20%)</span>
            <span className="text-xl font-bold text-brand-navy">
              {match.match_explanation?.category_match ? '100%' : '0%'}
            </span>
          </div>

          <div className="bg-pale-blue/60 p-3.5 rounded-xl border border-blue-100">
            <span className="text-xs text-brand-muted block mb-1">Location (25%)</span>
            <span className="text-xl font-bold text-brand-navy">
              {match.match_explanation?.location_proximity ?? 80}%
            </span>
          </div>

          <div className="bg-pale-blue/60 p-3.5 rounded-xl border border-blue-100">
            <span className="text-xs text-brand-muted block mb-1">Time Window (15%)</span>
            <span className="text-xl font-bold text-brand-navy">
              {match.match_explanation?.time_proximity ?? 85}%
            </span>
          </div>
        </div>

        {match.match_explanation && (
          <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-1.5 text-brand-text">
            <div className="font-semibold text-brand-navy">Algorithmic Summary:</div>
            <p className="leading-relaxed">{match.match_explanation.summary}</p>
          </div>
        )}
      </div>

      {/* Side-by-side Report Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lost Report */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge badge-lost font-bold">Lost Report</span>
            {lost && (
              <Link to={`/items/${lost.id}`} className="text-xs text-primary-blue hover:underline">
                View Full Post →
              </Link>
            )}
          </div>

          {lost ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCategoryEmoji(lost.category)}</span>
                <div>
                  <h3 className="font-bold text-brand-navy text-lg">{lost.item_name}</h3>
                  <span className="text-xs text-brand-muted">{getCategoryLabel(lost.category)}</span>
                </div>
              </div>
              <p className="text-sm text-brand-text bg-gray-50 p-3 rounded-lg leading-relaxed">
                {lost.description}
              </p>
              <div className="space-y-1 text-xs text-brand-muted">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lost.approximate_location}, {lost.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reported lost on {formatDate(lost.event_date)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-brand-muted">Report data not available.</p>
          )}
        </div>

        {/* Found Report */}
        <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge badge-found font-bold">Found Report</span>
            {found && (
              <Link to={`/items/${found.id}`} className="text-xs text-primary-blue hover:underline">
                View Full Post →
              </Link>
            )}
          </div>

          {found ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCategoryEmoji(found.category)}</span>
                <div>
                  <h3 className="font-bold text-brand-navy text-lg">{found.item_name}</h3>
                  <span className="text-xs text-brand-muted">{getCategoryLabel(found.category)}</span>
                </div>
              </div>
              <p className="text-sm text-brand-text bg-gray-50 p-3 rounded-lg leading-relaxed">
                {found.description}
              </p>
              <div className="space-y-1 text-xs text-brand-muted">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{found.approximate_location}, {found.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reported found on {formatDate(found.event_date)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-brand-muted">Report data not available.</p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-brand-navy">Is this your item?</h3>
          <p className="text-xs text-brand-muted mt-0.5">
            Initiate ownership verification to answer finder's private questions.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleRejectMatch}
          >
            <XCircle className="w-4 h-4 mr-1.5" /> Not a Match
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1 sm:flex-none"
            onClick={() => setClaimModalOpen(true)}
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Start Verification Claim
          </Button>
        </div>
      </div>

      {/* Verification Modal */}
      <Modal
        open={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Start Ownership Verification"
      >
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <p className="text-xs text-brand-muted leading-relaxed">
            Please answer specific questions about markings, contents, or serial numbers to confirm this found item belongs to you.
          </p>
          <Textarea
            label="Your Ownership Evidence"
            placeholder="Describe unique details that prove this is yours..."
            value={claimEvidence}
            onChange={(e) => setClaimEvidence(e.target.value)}
            required
            rows={4}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setClaimModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={claimSubmitting}>
              Submit Verification Claim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
