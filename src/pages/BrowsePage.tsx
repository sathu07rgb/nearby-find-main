import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, SlidersHorizontal, RotateCcw, AlertCircle, Plus } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { ItemCard } from '../components/items/ItemCard'
import { useReports } from '../context/ReportsContext'
import { ITEM_CATEGORIES } from '../lib/utils'

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchReports, loading } = useReports()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState<'lost' | 'found' | 'all'>(
    (searchParams.get('type') as 'lost' | 'found') || 'all'
  )
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  // Keep query params synced
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (type !== 'all') params.set('type', type)
    if (category) params.set('category', category)
    if (city) params.set('city', city)
    if (status) params.set('status', status)
    setSearchParams(params, { replace: true })
  }, [query, type, category, city, status, setSearchParams])

  const filteredReports = useMemo(() => {
    const results = searchReports(query, {
      type: type === 'all' ? undefined : type,
      category: category || undefined,
      city: city || undefined,
      status: status || undefined,
    })

    return results.sort((a, b) => {
      const dateA = new Date(a.event_date).getTime()
      const dateB = new Date(b.event_date).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })
  }, [searchReports, query, type, category, city, status, sortBy])

  const clearFilters = () => {
    setQuery('')
    setType('all')
    setCategory('')
    setCity('')
    setStatus('')
    setSortBy('newest')
  }

  const hasActiveFilters = query || type !== 'all' || category || city || status

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">Browse Reports</h1>
          <p className="text-sm text-brand-muted mt-1">
            Search publicly visible lost and found items. Personal contact details are protected.
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

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card mb-6 space-y-4">
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by keywords, model, location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          {/* Type Toggle */}
          <div className="inline-flex rounded-lg p-1 bg-gray-100 self-start sm:self-auto">
            <button
              onClick={() => setType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                type === 'all' ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setType('lost')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                type === 'lost' ? 'bg-red-500 text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setType('found')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                type === 'found' ? 'bg-green-600 text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Found Only
            </button>
          </div>
        </div>

        {/* Detailed Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            <label className="block text-xs font-medium text-brand-muted mb-1">City or Campus</label>
            <input
              type="text"
              placeholder="Filter city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input-base text-xs py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-base text-xs py-2"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="matched">Potential Match</option>
              <option value="recovered">Recovered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="input-base text-xs py-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-brand-muted">
            <span>
              Showing <strong>{filteredReports.length}</strong> matching results
            </span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-primary-blue hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Item Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="skeleton h-32 rounded-lg" />
              <div className="skeleton h-4 rounded w-3/4" />
              <div className="skeleton h-3 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredReports.map((report) => (
            <ItemCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-card p-8">
          <div className="w-12 h-12 rounded-full bg-pale-blue text-primary-blue flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text mb-1">No items found</h3>
          <p className="text-sm text-brand-muted max-w-sm mx-auto mb-4">
            Try adjusting your search terms or clearing active filters to see more results.
          </p>
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}
