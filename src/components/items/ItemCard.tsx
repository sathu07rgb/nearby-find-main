import { Link } from 'react-router-dom'
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react'
import type { ItemReport } from '../../types/database'
import { formatRelativeTime, getCategoryLabel, getCategoryEmoji, REPORT_STATUS_LABELS, truncate } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface ItemCardProps {
  report: ItemReport
  showStatus?: boolean
  compact?: boolean
}

export function ItemCard({ report, showStatus = true, compact = false }: ItemCardProps) {
  const statusInfo = REPORT_STATUS_LABELS[report.status] || REPORT_STATUS_LABELS.open

  return (
    <Link
      to={`/items/${report.id}`}
      className={cn(
        'card card-hover flex flex-col group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue bg-white',
        compact ? 'p-3' : 'p-4',
      )}
      aria-label={`${report.report_type === 'lost' ? 'Lost' : 'Found'}: ${report.item_name}`}
    >
      {/* Image / Icon container */}
      <div className={cn(
        'rounded-lg bg-gradient-to-br flex items-center justify-center text-4xl mb-3 flex-shrink-0 relative overflow-hidden',
        compact ? 'h-24' : 'h-36',
        report.report_type === 'lost' ? 'from-red-50 to-red-100' : 'from-green-50 to-green-100',
      )}>
        {report.photo_paths && report.photo_paths.length > 0 ? (
          <img
            src={report.photo_paths[0]}
            alt={report.item_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              (e.target as HTMLElement).style.display = 'none'
            }}
          />
        ) : null}
        <span className={report.photo_paths && report.photo_paths.length > 0 ? 'sr-only' : ''}>
          {getCategoryEmoji(report.category)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={cn('badge', report.report_type === 'lost' ? 'badge-lost' : 'badge-found')}>
            {report.report_type === 'lost' ? 'Lost' : 'Found'}
          </span>
          {showStatus && report.status !== 'open' && (
            <span className={cn('badge border', statusInfo.color)}>{statusInfo.label}</span>
          )}
          {report.is_demo && (
            <span className="badge bg-amber-50 text-amber-700 border border-amber-100">Demo</span>
          )}
        </div>

        {/* Title */}
        <h3 className={cn(
          'font-semibold text-brand-text group-hover:text-primary-blue transition-colors leading-snug',
          compact ? 'text-sm' : 'text-base',
        )}>
          {truncate(report.item_name, compact ? 40 : 55)}
        </h3>

        {/* Description */}
        {!compact && (
          <p className="text-sm text-brand-muted mt-1 line-clamp-2">
            {truncate(report.description, 100)}
          </p>
        )}

        {/* Meta */}
        <div className={cn('space-y-1', compact ? 'mt-2' : 'mt-3')}>
          <div className="flex items-center gap-1.5 text-xs text-brand-muted">
            <Tag className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
            <span>{getCategoryLabel(report.category)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-muted">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
            <span className="truncate">{report.city}{report.campus ? `, ${report.campus}` : ''}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-muted">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
            <span>{formatRelativeTime(report.event_date)}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!compact && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
          <span className="text-xs text-brand-muted">#{report.id.slice(-6).toUpperCase()}</span>
          <span className="text-xs font-medium text-primary-blue flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </span>
        </div>
      )}
    </Link>
  )
}
