import type { ItemCategory, ItemReport, MatchExplanation, PotentialMatch } from '../types/database'

// ===== TEXT SIMILARITY =====
// Simple TF-based Jaccard similarity for overlapping word tokens

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2),
  )
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1
  const intersection = new Set([...a].filter((x) => b.has(x)))
  const union = new Set([...a, ...b])
  return intersection.size / union.size
}

function textSimilarity(textA: string, textB: string): number {
  const tokensA = tokenize(textA)
  const tokensB = tokenize(textB)
  return jaccardSimilarity(tokensA, tokensB)
}

// ===== LOCATION PROXIMITY =====
// Simple string-based location similarity (no GPS required)

function locationProximity(locationA: string, cityA: string, campusA: string | null,
  locationB: string, cityB: string, campusB: string | null): number {
  const aText = `${locationA} ${cityA} ${campusA ?? ''}`.toLowerCase()
  const bText = `${locationB} ${cityB} ${campusB ?? ''}`.toLowerCase()
  
  // Exact city match is a strong signal
  if (cityA.toLowerCase() === cityB.toLowerCase()) {
    // Check campus match if available
    if (campusA && campusB && campusA.toLowerCase() === campusB.toLowerCase()) {
      return 1.0
    }
    // Same city, check general location similarity
    const locSim = textSimilarity(locationA, locationB)
    return 0.6 + locSim * 0.4
  }
  
  // Check general text similarity across all location fields
  return textSimilarity(aText, bText) * 0.5
}

// ===== TIME PROXIMITY =====
// Score decreases as time gap increases

function timeProximity(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime()
  const b = new Date(dateB).getTime()
  const diffDays = Math.abs(a - b) / (1000 * 60 * 60 * 24)
  
  if (diffDays <= 1) return 1.0
  if (diffDays <= 3) return 0.85
  if (diffDays <= 7) return 0.65
  if (diffDays <= 14) return 0.45
  if (diffDays <= 30) return 0.25
  return 0.1
}

// ===== CATEGORY MATCH =====

function categoryMatch(catA: ItemCategory, catB: ItemCategory): boolean {
  return catA === catB
}

// ===== WEIGHTS =====
const WEIGHTS = {
  text: 0.40,
  category: 0.20,
  location: 0.25,
  time: 0.15,
}

// ===== MATCHING ENGINE =====

export interface MatchScore {
  total: number        // 0–100 normalized
  textScore: number
  categoryScore: number
  locationScore: number
  timeScore: number
  factors: string[]
  summary: string
}

export function computeMatchScore(
  lostReport: ItemReport,
  foundReport: ItemReport,
): MatchScore {
  // Text: combine item_name + description
  const lostText = `${lostReport.item_name} ${lostReport.description}`
  const foundText = `${foundReport.item_name} ${foundReport.description}`
  const textScore = textSimilarity(lostText, foundText)

  // Category
  const catScore = categoryMatch(lostReport.category, foundReport.category) ? 1.0 : 0.0

  // Location
  const locScore = locationProximity(
    lostReport.approximate_location, lostReport.city, lostReport.campus,
    foundReport.approximate_location, foundReport.city, foundReport.campus,
  )

  // Time
  const timeScore = timeProximity(lostReport.event_date, foundReport.event_date)

  // Weighted total
  const total = Math.round(
    (textScore * WEIGHTS.text +
      catScore * WEIGHTS.category +
      locScore * WEIGHTS.location +
      timeScore * WEIGHTS.time) *
      100,
  )

  // Build explanatory factors
  const factors: string[] = []
  
  if (catScore === 1.0) {
    factors.push(`Same category: ${lostReport.category.replace('_', ' ')}`)
  } else {
    factors.push(`Different categories (lost: ${lostReport.category}, found: ${foundReport.category})`)
  }

  if (textScore > 0.3) {
    factors.push(`High text similarity in name/description (${Math.round(textScore * 100)}%)`)
  } else if (textScore > 0.1) {
    factors.push(`Some overlapping keywords in description`)
  }

  if (locScore >= 0.9) {
    factors.push(`Same campus and city`)
  } else if (locScore >= 0.6) {
    factors.push(`Same city area`)
  } else if (locScore >= 0.3) {
    factors.push(`Nearby location`)
  }

  if (timeScore >= 0.85) {
    factors.push(`Found within 3 days of loss`)
  } else if (timeScore >= 0.45) {
    factors.push(`Found within 2 weeks of loss`)
  } else {
    factors.push(`Larger time gap between loss and find`)
  }

  const summary = buildSummary(lostReport, foundReport, total, factors)

  return {
    total,
    textScore: Math.round(textScore * 100),
    categoryScore: Math.round(catScore * 100),
    locationScore: Math.round(locScore * 100),
    timeScore: Math.round(timeScore * 100),
    factors,
    summary,
  }
}

function buildSummary(
  lost: ItemReport,
  found: ItemReport,
  score: number,
  factors: string[],
): string {
  const level = score >= 75 ? 'strong' : score >= 50 ? 'moderate' : 'weak'
  return (
    `${level.charAt(0).toUpperCase() + level.slice(1)} similarity (${score}/100). ` +
    `Both reports involve "${lost.item_name}" and "${found.item_name}". ` +
    factors.slice(0, 2).join('. ') + '. ' +
    'This is a similarity score — verify ownership through the claim process before arranging a handover.'
  )
}

// ===== BATCH MATCHING =====

export interface MatchCandidate {
  lostReportId: string
  foundReportId: string
  score: MatchScore
  explanation: MatchExplanation
}

export function findMatches(
  lostReports: ItemReport[],
  foundReports: ItemReport[],
  minScore = 30,
): MatchCandidate[] {
  const candidates: MatchCandidate[] = []

  for (const lost of lostReports) {
    if (lost.status === 'recovered' || lost.status === 'closed') continue
    
    for (const found of foundReports) {
      if (found.status === 'recovered' || found.status === 'closed') continue
      
      const score = computeMatchScore(lost, found)
      if (score.total >= minScore) {
        candidates.push({
          lostReportId: lost.id,
          foundReportId: found.id,
          score,
          explanation: {
            text_similarity: score.textScore,
            category_match: score.categoryScore === 100,
            location_proximity: score.locationScore,
            time_proximity: score.timeScore,
            factors: score.factors,
            summary: score.summary,
          },
        })
      }
    }
  }

  // Sort by score descending
  return candidates.sort((a, b) => b.score.total - a.score.total)
}

export function buildMatchFromCandidate(
  candidate: MatchCandidate,
): Omit<PotentialMatch, 'id' | 'created_at' | 'updated_at'> {
  return {
    lost_report_id: candidate.lostReportId,
    found_report_id: candidate.foundReportId,
    similarity_score: candidate.score.total,
    match_explanation: candidate.explanation,
    status: 'suggested',
  }
}
