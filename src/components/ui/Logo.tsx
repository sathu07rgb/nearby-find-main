import { Link } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { cn } from '../../lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  white?: boolean
  className?: string
}

export function Logo({ size = 'md', white = false, className }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-base' },
    md: { icon: 28, text: 'text-lg' },
    lg: { icon: 36, text: 'text-2xl' },
  }

  const s = sizes[size]

  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2 select-none', className)}
      aria-label="FindIt Nearby — Home"
    >
      {/* Logo SVG: location pin + search */}
      <div className="relative flex-shrink-0" style={{ width: s.icon, height: s.icon }}>
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          {/* Pin body */}
          <path
            d="M16 2C11.582 2 8 5.582 8 10c0 6.75 8 18 8 18s8-11.25 8-18c0-4.418-3.582-8-8-8z"
            fill={white ? 'white' : '#1769FF'}
          />
          {/* Search circle */}
          <circle cx="16" cy="10" r="4.5" fill={white ? '#1769FF' : 'white'} />
          <circle cx="15.5" cy="9.5" r="2.5" fill={white ? 'white' : '#0B1F4D'} stroke={white ? 'white' : '#0B1F4D'} strokeWidth="0.5" />
          {/* Search handle */}
          <line
            x1="17.5"
            y1="11.5"
            x2="20"
            y2="14"
            stroke={white ? '#1769FF' : 'white'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span
        className={cn(
          'font-bold tracking-tight leading-none',
          s.text,
          white ? 'text-white' : 'text-brand-navy',
        )}
      >
        FindIt{' '}
        <span className={white ? 'text-blue-200' : 'text-primary-blue'}>Nearby</span>
      </span>
    </Link>
  )
}
