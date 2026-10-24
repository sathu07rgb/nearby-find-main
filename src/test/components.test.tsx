import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

describe('UI Components', () => {
  it('renders Button with correct text and handles disabled state', () => {
    render(<Button disabled>Click Me</Button>)
    const btn = screen.getByRole('button', { name: /click me/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toBeDisabled()
  })

  it('renders Logo with brand name and home link', () => {
    render(
      <BrowserRouter>
        <Logo size="md" />
      </BrowserRouter>
    )
    const logoLink = screen.getByRole('link', { name: /findit nearby/i })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })
})
