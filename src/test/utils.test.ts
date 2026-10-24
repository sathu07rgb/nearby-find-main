import { describe, it, expect } from 'vitest'
import {
  truncate,
  validateEmail,
  validatePhone,
  getScoreColor,
  getScoreBg,
  getCategoryLabel,
} from '../lib/utils'

describe('Utility Functions', () => {
  it('truncates text properly with ellipsis', () => {
    expect(truncate('Hello world', 5)).toBe('Hello…')
    expect(truncate('Short', 10)).toBe('Short')
  })

  it('validates email addresses correctly', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('user@domain')).toBe(false)
  })

  it('validates phone numbers', () => {
    expect(validatePhone('+919876543210')).toBe(true)
    expect(validatePhone('12345678')).toBe(true)
    expect(validatePhone('abc')).toBe(false)
  })

  it('returns correct score colors and backgrounds', () => {
    expect(getScoreColor(85)).toBe('text-green-600')
    expect(getScoreColor(60)).toBe('text-amber-600')
    expect(getScoreColor(20)).toBe('text-red-600')

    expect(getScoreBg(80)).toContain('bg-green-50')
  })

  it('resolves category labels', () => {
    expect(getCategoryLabel('electronics')).toBe('Electronics')
    expect(getCategoryLabel('wallets_bags')).toBe('Wallets & Bags')
    expect(getCategoryLabel('unknown')).toBe('unknown')
  })
})
