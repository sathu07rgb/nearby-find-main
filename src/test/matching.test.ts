import { describe, it, expect } from 'vitest'
import { computeMatchScore, findMatches } from '../lib/matching'
import type { ItemReport } from '../types/database'

const createMockReport = (overrides: Partial<ItemReport>): ItemReport => ({
  id: 'test-id',
  reporter_id: 'user-1',
  report_type: 'lost',
  item_name: 'Item',
  category: 'electronics',
  description: 'Description',
  photo_paths: [],
  approximate_location: 'Library',
  city: 'Bangalore',
  campus: 'Main Campus',
  event_date: new Date().toISOString(),
  status: 'open',
  is_demo: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

describe('AI Matching Algorithm', () => {
  it('assigns high similarity score to compatible lost & found reports', () => {
    const lostReport = createMockReport({
      report_type: 'lost',
      item_name: 'Black Sony Wireless Earbuds WF-1000XM4',
      category: 'electronics',
      description: 'Lost black wireless earbuds in a black charging case near library reading room',
      approximate_location: 'Central Library, 2nd floor',
      city: 'Bangalore',
      campus: 'Engineering College',
      event_date: '2026-10-20T10:00:00Z',
    })

    const foundReport = createMockReport({
      report_type: 'found',
      item_name: 'Black Wireless Earbuds',
      category: 'electronics',
      description: 'Found black Sony wireless earbuds with case near the central library',
      approximate_location: 'Library reading room',
      city: 'Bangalore',
      campus: 'Engineering College',
      event_date: '2026-10-21T14:00:00Z',
    })

    const match = computeMatchScore(lostReport, foundReport)

    // Should have a high score (> 70)
    expect(match.total).toBeGreaterThanOrEqual(70)
    expect(match.categoryScore).toBe(100)
    expect(match.locationScore).toBeGreaterThanOrEqual(80)
    expect(match.timeScore).toBeGreaterThanOrEqual(85)
    expect(match.factors.length).toBeGreaterThan(0)
  })

  it('assigns low score to unrelated reports across different categories and cities', () => {
    const lostReport = createMockReport({
      report_type: 'lost',
      item_name: 'Gold Ring with diamond',
      category: 'jewellery',
      description: 'Lost gold ring near hostel dining room',
      approximate_location: 'Hostel Block C',
      city: 'Delhi',
      campus: null,
      event_date: '2026-09-01T10:00:00Z',
    })

    const foundReport = createMockReport({
      report_type: 'found',
      item_name: 'Blue Umbrella',
      category: 'other',
      description: 'Found large blue folding umbrella at bus station',
      approximate_location: 'Metro Station Exit B',
      city: 'Mumbai',
      campus: null,
      event_date: '2026-10-24T12:00:00Z',
    })

    const match = computeMatchScore(lostReport, foundReport)

    // Should be low (< 25)
    expect(match.total).toBeLessThan(25)
    expect(match.categoryScore).toBe(0)
  })

  it('filters out reports with status recovered or closed during batch matching', () => {
    const lost1 = createMockReport({ id: 'l1', report_type: 'lost', status: 'open' })
    const lostClosed = createMockReport({ id: 'l2', report_type: 'lost', status: 'closed' })
    const found1 = createMockReport({ id: 'f1', report_type: 'found', status: 'open' })

    const candidates = findMatches([lost1, lostClosed], [found1], 0)

    const lostIds = candidates.map((c) => c.lostReportId)
    expect(lostIds).toContain('l1')
    expect(lostIds).not.toContain('l2')
  })
})
