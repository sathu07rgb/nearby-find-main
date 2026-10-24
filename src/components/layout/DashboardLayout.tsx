import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { MobileBottomNav } from './MobileBottomNav'
import { useIsAuthenticated, useAuth } from '../../context/AuthContext'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isAuth = useIsAuthenticated()
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pale-blue">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-muted text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return <Navigate to="/auth/signin" replace />
  }

  return (
    <div className="min-h-screen bg-pale-blue">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
