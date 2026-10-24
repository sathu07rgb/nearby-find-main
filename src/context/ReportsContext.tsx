import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { ItemReport, PotentialMatch } from '../types/database'
import { DEMO_REPORTS, DEMO_MATCHES, getDemoReport } from '../lib/demo-data'
import { isDemoMode } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { findMatches } from '../lib/matching'
import { generateId } from '../lib/utils'

interface ReportsContextValue {
  reports: ItemReport[]
  matches: PotentialMatch[]
  loading: boolean
  error: string | null
  addReport: (report: Omit<ItemReport, 'id' | 'created_at' | 'updated_at'>) => Promise<ItemReport>
  getReport: (id: string) => ItemReport | undefined
  getMatchesForReport: (reportId: string) => PotentialMatch[]
  refreshReports: () => void
  searchReports: (query: string, filters: ReportFilters) => ItemReport[]
}

export interface ReportFilters {
  type?: 'lost' | 'found' | 'all'
  category?: string
  city?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

const ReportsContext = createContext<ReportsContextValue | null>(null)

// Local demo store (separate from seeded demo data)
const localDemoStore: ItemReport[] = []

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<ItemReport[]>([])
  const [matches, setMatches] = useState<PotentialMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReports = async () => {
    setLoading(true)
    setError(null)

    if (isDemoMode) {
      const allDemoReports = [...DEMO_REPORTS, ...localDemoStore]
      setReports(allDemoReports)
      // Recalculate matches including user-submitted demo reports
      const lost = allDemoReports.filter((r) => r.report_type === 'lost')
      const found = allDemoReports.filter((r) => r.report_type === 'found')
      const rawMatches = findMatches(lost, found, 25)
      const dynamicMatches: PotentialMatch[] = rawMatches.map((m, i) => ({
        id: `match-${String(i + 1).padStart(3, '0')}`,
        lost_report_id: m.lostReportId,
        found_report_id: m.foundReportId,
        similarity_score: m.score.total,
        match_explanation: m.explanation,
        status: 'suggested',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
      setMatches(dynamicMatches.length ? dynamicMatches : DEMO_MATCHES)
      setLoading(false)
      return
    }

    try {
      const { data, error: err } = await supabase!
        .from('item_reports')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) throw err
      setReports(data ?? [])

      const { data: matchData } = await supabase!
        .from('potential_matches')
        .select('*')
        .order('similarity_score', { ascending: false })
      setMatches(matchData ?? [])
    } catch (e) {
      const msg = (e as Error).message
      console.warn('Supabase items fetch warning:', msg)
      setError(msg)
      // Fallback to demo items so user sees working data while tables are being migrated
      setReports([...DEMO_REPORTS, ...localDemoStore])
      setMatches(DEMO_MATCHES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const addReport = async (
    report: Omit<ItemReport, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<ItemReport> => {
    const now = new Date().toISOString()
    const newReport: ItemReport = {
      ...report,
      id: generateId(),
      created_at: now,
      updated_at: now,
      is_demo: isDemoMode,
    }

    if (isDemoMode) {
      localDemoStore.push(newReport)
      setReports((prev) => [newReport, ...prev])
      return newReport
    }

    try {
      const { data, error: err } = await (supabase!
        .from('item_reports') as any)
        .insert(report)
        .select()
        .single()
      if (err) throw new Error(err.message)
      setReports((prev) => [data, ...prev])
      return data
    } catch (dbErr) {
      console.warn('Database insert failed, stored locally:', dbErr)
      localDemoStore.push(newReport)
      setReports((prev) => [newReport, ...prev])
      return newReport
    }
  }

  const getReport = (id: string): ItemReport | undefined => {
    return reports.find((r) => r.id === id) ?? getDemoReport(id)
  }

  const getMatchesForReport = (reportId: string): PotentialMatch[] => {
    return matches.filter(
      (m) => m.lost_report_id === reportId || m.found_report_id === reportId,
    )
  }

  const searchReports = (query: string, filters: ReportFilters): ItemReport[] => {
    let result = reports.filter((r) => r.status !== 'closed')

    // Type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter((r) => r.report_type === filters.type)
    }

    // Category filter
    if (filters.category) {
      result = result.filter((r) => r.category === filters.category)
    }

    // City filter
    if (filters.city) {
      result = result.filter((r) =>
        r.city.toLowerCase().includes(filters.city!.toLowerCase()),
      )
    }

    // Status filter
    if (filters.status) {
      result = result.filter((r) => r.status === filters.status)
    }

    // Date range
    if (filters.dateFrom) {
      result = result.filter((r) => r.event_date >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      result = result.filter((r) => r.event_date <= filters.dateTo!)
    }

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (r) =>
          r.item_name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.approximate_location.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          (r.campus && r.campus.toLowerCase().includes(q)),
      )
    }

    return result
  }

  return (
    <ReportsContext.Provider
      value={{
        reports,
        matches,
        loading,
        error,
        addReport,
        getReport,
        getMatchesForReport,
        refreshReports: loadReports,
        searchReports,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports() {
  const ctx = useContext(ReportsContext)
  if (!ctx) throw new Error('useReports must be used inside ReportsProvider')
  return ctx
}
