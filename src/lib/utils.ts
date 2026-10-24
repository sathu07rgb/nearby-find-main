import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  return formatDate(dateString)
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const ITEM_CATEGORIES = [
  { value: 'electronics', label: 'Electronics', emoji: '📱' },
  { value: 'wallets_bags', label: 'Wallets & Bags', emoji: '👜' },
  { value: 'keys', label: 'Keys', emoji: '🔑' },
  { value: 'id_cards', label: 'ID Cards & Documents', emoji: '🪪' },
  { value: 'clothing', label: 'Clothing', emoji: '👕' },
  { value: 'books_stationery', label: 'Books & Stationery', emoji: '📚' },
  { value: 'jewellery', label: 'Jewellery', emoji: '💍' },
  { value: 'other', label: 'Other', emoji: '📦' },
] as const

export function getCategoryLabel(value: string): string {
  return ITEM_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function getCategoryEmoji(value: string): string {
  return ITEM_CATEGORIES.find((c) => c.value === value)?.emoji ?? '📦'
}

export const REPORT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: 'Open', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  matched: { label: 'Potential Match', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  recovered: { label: 'Recovered', color: 'bg-green-50 text-green-700 border-green-100' },
  closed: { label: 'Closed', color: 'bg-gray-50 text-gray-600 border-gray-100' },
}

export const MATCH_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  suggested: { label: 'Suggested', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  under_review: { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  verified: { label: 'Verified', color: 'bg-green-50 text-green-700 border-green-100' },
  recovered: { label: 'Recovered', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-100' },
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-amber-600'
  return 'text-red-600'
}

export function getScoreBg(score: number): string {
  if (score >= 75) return 'bg-green-50 border-green-100'
  if (score >= 50) return 'bg-amber-50 border-amber-100'
  return 'bg-red-50 border-red-100'
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{8,15}$/.test(phone)
}
