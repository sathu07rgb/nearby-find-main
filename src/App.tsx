import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReportsProvider } from './context/ReportsContext'
import { ToastProvider } from './context/ToastContext'
import { PublicLayout } from './components/layout/PublicLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'

// Pages
import { LandingPage } from './pages/LandingPage'
import { BrowsePage } from './pages/BrowsePage'
import { ItemDetailsPage } from './pages/ItemDetailsPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { SetupPage } from './pages/SetupPage'

// Auth Pages
import { SignInPage } from './pages/auth/SignInPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { PhoneSignInPage } from './pages/auth/PhoneSignInPage'

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage'
import { ReportLostPage } from './pages/ReportLostPage'
import { ReportFoundPage } from './pages/ReportFoundPage'
import { MatchesPage } from './pages/MatchesPage'
import { MatchDetailsPage } from './pages/MatchDetailsPage'
import { MyReportsPage } from './pages/MyReportsPage'
import { MessagesPage } from './pages/MessagesPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { AdminPage } from './pages/AdminPage'

export default function App() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <ToastProvider>
          <Routes>
            {/* Public Layout Routes */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <LandingPage />
                </PublicLayout>
              }
            />
            <Route
              path="/browse"
              element={
                <PublicLayout>
                  <BrowsePage />
                </PublicLayout>
              }
            />
            <Route
              path="/items/:id"
              element={
                <PublicLayout>
                  <ItemDetailsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <PublicLayout>
                  <HowItWorksPage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <PublicLayout>
                  <PrivacyPage />
                </PublicLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <PublicLayout>
                  <TermsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/setup"
              element={
                <PublicLayout>
                  <SetupPage />
                </PublicLayout>
              }
            />

            {/* Auth Routes */}
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/phone" element={<PhoneSignInPage />} />

            {/* Dashboard Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/report-lost"
              element={
                <DashboardLayout>
                  <ReportLostPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/report-found"
              element={
                <DashboardLayout>
                  <ReportFoundPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/matches"
              element={
                <DashboardLayout>
                  <MatchesPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/matches/:id"
              element={
                <DashboardLayout>
                  <MatchDetailsPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/my-reports"
              element={
                <DashboardLayout>
                  <MyReportsPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/messages"
              element={
                <DashboardLayout>
                  <MessagesPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <DashboardLayout>
                  <AdminPage />
                </DashboardLayout>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <div className="max-w-md mx-auto text-center py-24 px-4">
                    <div className="text-6xl mb-4 font-extrabold text-primary-blue">404</div>
                    <h1 className="text-2xl font-bold text-brand-navy mb-2">Page Not Found</h1>
                    <p className="text-sm text-brand-muted mb-6">
                      The page you were looking for doesn't exist or has moved.
                    </p>
                    <a href="/" className="btn btn-primary">
                      Return to Home
                    </a>
                  </div>
                </PublicLayout>
              }
            />
          </Routes>
        </ToastProvider>
      </ReportsProvider>
    </AuthProvider>
  )
}
