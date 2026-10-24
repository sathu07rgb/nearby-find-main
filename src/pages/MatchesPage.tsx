import { useState, useMemo } from 'react'
import { Sparkles, SlidersHorizontal, Info, ShieldAlert } from 'lucide-react'
import { MatchCard } from '../components/items/MatchCard'
import { useReports } from '../context/ReportsContext'
import { ITEM_CATEGORIES } from '../lib/utils'
import type { MatchStatus } from '../types/database'

export function MatchesPage() {
  const { matches, reports, loading } = useReports()
  const [minScore, setMinScore] = useState<number>(30)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score')

  const filteredMatches = useMemo(() => {
    return matches
      .filter((m) => {
        if (m.similarity_score < minScore) return false
        if (statusFilter !== 'all' && m.status !== statusFilter) return false

        if (selectedCategory) {
          const lost = reports.find((r) => r.id === m.lost_report_id)
          const found = reports.find((r) => r.id === m.found_report_id)
          if (lost?.category !== selectedCategory && found?.category !== selectedCategory) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return b.similarity_score - a.similarity_score
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [matches, reports, minScore, selectedCategory, statusFilter, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-6 h-6 text-primary-blue" />
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">AI-Assisted Matches</h1>
        </div>
        <p className="text-sm text-brand-muted">
          Our algorithm compares lost reports against found reports using text tokens, category classification, geographical proximity, and time windows.
        </p>
      </div>

      {/* Algorithmic Explainability Banner */}
      <div className="bg-pale-blue border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary-blue flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong>Explainable Matching Engine:</strong> Scores (0–100) are computed from Text Similarity (40%), Location Proximity (25%), Category Agreement (20%), and Date Proximity (15%). A higher score represents feature similarity — never automatic legal proof of ownership.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1">
            Minimum Score: {minScore}%
          </label>
          <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-base text-xs py-2"
          >
            <option value="">All Categories</option>
            {ITEM_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-base text-xs py-2"
          >
            <option value="all">All Statuses</option>
            <option value="suggested">Suggested</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="recovered">Recovered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'date')}
            className="input-base text-xs py-2"
          >
            <option value="score">Highest Similarity</option>
            <option value="date">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="skeleton h-6 w-1/3" />
              <div className="skeleton h-24" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map((match) => {
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
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-card p-8">
          <Sparkles className="w-12 h-12 text-primary-blue mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold text-brand-text mb-1">No matches meeting criteria</h3>
          <p className="text-sm text-brand-muted max-w-sm mx-auto mb-4">
            Try lowering the minimum similarity threshold or selecting "All Categories".
          </p>
          <button
            onClick={() => {
              setMinScore(20)
              setSelectedCategory('')
              setStatusFilter('all')
            }}
            className="btn btn-sm btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
