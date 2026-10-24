import type { ItemReport, PotentialMatch, Notification } from '../types/database'
import { findMatches } from './matching'

// ============================================================
// DEMO USER
// ============================================================
export const DEMO_USER = {
  id: 'demo-user-001',
  display_name: 'Demo User',
  avatar_url: null,
  email: 'demo@finditnearby.app',
}

export const DEMO_SESSION = {
  user: {
    id: 'demo-user-001',
    email: 'demo@finditnearby.app',
    user_metadata: { display_name: 'Demo User' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
  },
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
}

// ============================================================
// DEMO ITEM REPORTS (clearly labeled)
// ============================================================
const now = new Date()
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString()

export const DEMO_REPORTS: ItemReport[] = [
  {
    id: 'demo-report-001',
    reporter_id: 'demo-user-002',
    report_type: 'lost',
    item_name: 'Black Wireless Earbuds',
    category: 'electronics',
    description: 'Black Sony WF-1000XM4 wireless earbuds in a black charging case. Left them near the library study area.',
    photo_paths: [],
    approximate_location: 'Near the central library, reading hall entrance',
    city: 'Bangalore',
    campus: 'BMS College of Engineering',
    event_date: daysAgo(3),
    status: 'open',
    is_demo: true,
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
  {
    id: 'demo-report-002',
    reporter_id: 'demo-user-003',
    report_type: 'found',
    item_name: 'Wireless Earbuds (Black)',
    category: 'electronics',
    description: 'Found a pair of black wireless earbuds with a black case near the library. They appear to be Sony brand.',
    photo_paths: [],
    approximate_location: 'College library, near main entrance',
    city: 'Bangalore',
    campus: 'BMS College of Engineering',
    event_date: daysAgo(2),
    status: 'open',
    is_demo: true,
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
  {
    id: 'demo-report-003',
    reporter_id: 'demo-user-004',
    report_type: 'lost',
    item_name: 'Blue College Backpack',
    category: 'wallets_bags',
    description: 'Blue Wildcraft backpack with my college ID and some textbooks inside. Lost during morning classes.',
    photo_paths: [],
    approximate_location: 'Room 204, Engineering Block B',
    city: 'Bangalore',
    campus: 'BMS College of Engineering',
    event_date: daysAgo(5),
    status: 'open',
    is_demo: true,
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: 'demo-report-004',
    reporter_id: 'demo-user-003',
    report_type: 'found',
    item_name: 'Blue Backpack',
    category: 'wallets_bags',
    description: 'Found a blue backpack in classroom 204. Has some engineering textbooks inside.',
    photo_paths: [],
    approximate_location: 'Classroom 204, B Block',
    city: 'Bangalore',
    campus: 'BMS College of Engineering',
    event_date: daysAgo(4),
    status: 'open',
    is_demo: true,
    created_at: daysAgo(4),
    updated_at: daysAgo(4),
  },
  {
    id: 'demo-report-005',
    reporter_id: 'demo-user-005',
    report_type: 'lost',
    item_name: 'Brown Leather Wallet',
    category: 'wallets_bags',
    description: 'Brown leather wallet with cash, college ID, and debit card. Lost near the bus stop outside campus.',
    photo_paths: [],
    approximate_location: 'Bus stop outside main gate',
    city: 'Bangalore',
    campus: null,
    event_date: daysAgo(1),
    status: 'open',
    is_demo: true,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
  {
    id: 'demo-report-006',
    reporter_id: 'demo-user-006',
    report_type: 'found',
    item_name: 'Keys with Blue Keychain',
    category: 'keys',
    description: 'Found a set of keys with a blue keychain in the cafeteria near the food counter.',
    photo_paths: [],
    approximate_location: 'College cafeteria',
    city: 'Bangalore',
    campus: 'BMS College of Engineering',
    event_date: daysAgo(1),
    status: 'open',
    is_demo: true,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
  {
    id: 'demo-report-007',
    reporter_id: 'demo-user-001',
    report_type: 'lost',
    item_name: 'Student ID Card',
    category: 'id_cards',
    description: 'Lost my college student ID card. It has my photo and student number on it.',
    photo_paths: [],
    approximate_location: 'Sports ground or gymnasium',
    city: 'Bangalore',
    campus: 'BMS College of Engineering',
    event_date: daysAgo(7),
    status: 'open',
    is_demo: true,
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
  },
  {
    id: 'demo-report-008',
    reporter_id: 'demo-user-001',
    report_type: 'found',
    item_name: 'Engineering Textbook',
    category: 'books_stationery',
    description: 'Found an engineering mathematics textbook with handwritten notes in the library reading area.',
    photo_paths: [],
    approximate_location: 'Library reading area, 2nd floor',
    city: 'Bangalore',
    campus: 'BMS College of Engineering',
    event_date: daysAgo(2),
    status: 'open',
    is_demo: true,
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
]

// ============================================================
// DEMO MATCHES
// ============================================================
const lostReports = DEMO_REPORTS.filter((r) => r.report_type === 'lost')
const foundReports = DEMO_REPORTS.filter((r) => r.report_type === 'found')
const rawMatches = findMatches(lostReports, foundReports, 25)

export const DEMO_MATCHES: PotentialMatch[] = rawMatches.map((m, i) => ({
  id: `demo-match-${String(i + 1).padStart(3, '0')}`,
  lost_report_id: m.lostReportId,
  found_report_id: m.foundReportId,
  similarity_score: m.score.total,
  match_explanation: m.explanation,
  status: i === 0 ? 'under_review' : 'suggested',
  created_at: daysAgo(1),
  updated_at: daysAgo(1),
}))

// ============================================================
// DEMO NOTIFICATIONS
// ============================================================
export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'demo-notif-001',
    user_id: 'demo-user-001',
    type: 'new_match',
    title: 'Potential match found!',
    body: 'Your lost Student ID report may match a found item.',
    related_record_id: DEMO_MATCHES[0]?.id ?? null,
    read_at: null,
    created_at: daysAgo(1),
  },
  {
    id: 'demo-notif-002',
    user_id: 'demo-user-001',
    type: 'new_message',
    title: 'New message',
    body: 'You have a new message regarding your found item report.',
    related_record_id: null,
    read_at: daysAgo(0),
    created_at: daysAgo(2),
  },
]

// ============================================================
// HELPER: get report by ID
// ============================================================
export function getDemoReport(id: string): ItemReport | undefined {
  return DEMO_REPORTS.find((r) => r.id === id)
}

export function getDemoMatch(id: string): PotentialMatch | undefined {
  return DEMO_MATCHES.find((m) => m.id === id)
}

export function getDemoUserReports(userId: string): ItemReport[] {
  return DEMO_REPORTS.filter((r) => r.reporter_id === userId)
}

export function getDemoUserMatches(userId: string): PotentialMatch[] {
  const userReportIds = getDemoUserReports(userId).map((r) => r.id)
  return DEMO_MATCHES.filter(
    (m) => userReportIds.includes(m.lost_report_id) || userReportIds.includes(m.found_report_id),
  )
}
