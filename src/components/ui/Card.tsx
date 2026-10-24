import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover, onClick }: CardProps) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn('card text-left w-full', hover && 'card-hover cursor-pointer', className)}
      >
        {children}
      </button>
    )
  }
  return (
    <div className={cn('card', hover && 'card-hover', className)}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-5 py-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: CardHeaderProps) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-5 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl', className)}>
      {children}
    </div>
  )
}
