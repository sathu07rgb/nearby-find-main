import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, MapPin, Calendar } from 'lucide-react'
import type { PotentialMatch, ItemReport } from '../../types/database'
import { getCategoryEmoji, getScoreColor, getScoreBg, MATCH_STATUS_LABELS, formatRelativeTime, cn } from '../../lib/utils'

interface MatchCardProps {
  match: PotentialMatch
  lostReport?: ItemReport
  foundReport?: ItemReport
}

export function MatchCard({ match, lostReport, foundReport }: MatchCardProps) {
  const statusInfo = MATCH_STATUS_LABELS[match.status] || MATCH_STATUS_LABELS.suggested
  const scoreColor = getScoreColor(match.similarity_score)
  const scoreBg = getScoreBg(match.similarity_score)

  return (
    <div className="card p-4 space-y-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-blue" aria-hidden />
          <span className="text-sm font-semibold text-brand-text">Potential Match</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('badge border', statusInfo.color)}>{statusInfo.label}</span>
          <div className={cn('px-2.5 py-1 rounded-lg border text-xs font-bold', scoreBg, scoreColor)}>
            {match.similarity_score}/100
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-brand-muted">Similarity Score</span>
          <span className={cn('text-xs font-semibold', scoreColor)}>{match.similarity_score}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              match.similarity_score >= 75 ? 'bg-green-500' : match.similarity_score >= 50 ? 'bg-amber-500' : 'bg-red-400',
            )}
            style={{ width: `${match.similarity_score}%` }}
            aria-label={`Similarity: ${match.similarity_score}%`}
          />
        </div>
      </div>

      {/* Reports */}
      <div className="grid grid-cols-2 gap-3">
        {/* Lost */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <div className="text-xs text-red-600 font-semibold mb-1 uppercase tracking-wide">Lost</div>
          {lostReport ? (
            <>
              <div className="text-xl mb-1">{getCategoryEmoji(lostReport.category)}</div>
              <p className="text-sm font-medium text-brand-text line-clamp-2">{lostReport.item_name}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin className="w-3 h-3 text-brand-muted" />
                <span className="text-xs text-brand-muted truncate">{lostReport.city}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-brand-muted">Report #{match.lost_report_id.slice(-6)}</div>
          )}
        </div>

        {/* Found */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <div className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wide">Found</div>
          {foundReport ? (
            <>
              <div className="text-xl mb-1">{getCategoryEmoji(foundReport.category)}</div>
              <p className="text-sm font-medium text-brand-text line-clamp-2">{foundReport.item_name}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin className="w-3 h-3 text-brand-muted" />
                <span className="text-xs text-brand-muted truncate">{foundReport.city}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-brand-muted">Report #{match.found_report_id.slice(-6)}</div>
          )}
        </div>
      </div>

      {/* Explanation */}
      {match.match_explanation?.factors && (
        <div className="bg-blue-50/70 rounded-lg p-3 border border-blue-100">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Why matched:</strong>{' '}
            {match.match_explanation.factors.slice(0, 2).join(' · ')}
          </p>
          <p className="text-xs text-blue-600 mt-1.5 italic">
            This is a similarity score, not proof of ownership. Verify through the claim process.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-brand-muted">
          <Calendar className="w-3 h-3 inline mr-1" />
          {formatRelativeTime(match.created_at)}
        </span>
        <Link
          to={`/matches/${match.id}`}
          className="text-xs font-medium text-primary-blue hover:underline flex items-center gap-1"
        >
          View Match Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
