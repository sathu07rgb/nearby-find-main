import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '../lib/supabase'
import { DEMO_USER, DEMO_SESSION } from '../lib/demo-data'

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: DemoProfile | null
  loading: boolean
  isDemoMode: boolean
  demoLoggedIn: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signInWithPhone: (phone: string) => Promise<{ error: string | null }>
  verifyOTP: (phone: string, token: string) => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  demoLogin: () => void
  demoLogout: () => void
}

interface DemoProfile {
  id: string
  display_name: string
  avatar_url: string | null
  email: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_PROFILE_KEY = 'findit_demo_logged_in'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<DemoProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoLoggedIn, setDemoLoggedIn] = useState(false)

  useEffect(() => {
    if (isDemoMode) {
      // Check if demo user was previously logged in
      const stored = sessionStorage.getItem(DEMO_PROFILE_KEY)
      if (stored) {
        setDemoLoggedIn(true)
        setProfile(DEMO_USER)
      }
      setLoading(false)
      return
    }

    // Real Supabase auth
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      return { error: 'Demo mode: Use the demo login button or configure Supabase.' }
    }
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (isDemoMode) {
      return { error: 'Demo mode: Configure Supabase to enable real accounts.' }
    }
    const { error } = await supabase!.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    })
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    if (isDemoMode) {
      demoLogout()
      return
    }
    await supabase!.auth.signOut()
  }

  const signInWithGoogle = async () => {
    if (isDemoMode) {
      return { error: 'Demo mode: Configure Supabase Google OAuth to use this feature.' }
    }
    const { error } = await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    return { error: error?.message ?? null }
  }

  const signInWithPhone = async (phone: string) => {
    if (isDemoMode) {
      return { error: 'Demo mode: Configure Supabase SMS provider to use phone login.' }
    }
    const { error } = await supabase!.auth.signInWithOtp({ phone })
    return { error: error?.message ?? null }
  }

  const verifyOTP = async (phone: string, token: string) => {
    if (isDemoMode) {
      return { error: 'Demo mode: Phone OTP not available without Supabase configuration.' }
    }
    const { error } = await supabase!.auth.verifyOtp({ phone, token, type: 'sms' })
    return { error: error?.message ?? null }
  }

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      return { error: 'Demo mode: Configure Supabase to enable password reset.' }
    }
    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error: error?.message ?? null }
  }

  const demoLogin = () => {
    setDemoLoggedIn(true)
    setProfile(DEMO_USER)
    sessionStorage.setItem(DEMO_PROFILE_KEY, 'true')
  }

  const demoLogout = () => {
    setDemoLoggedIn(false)
    setProfile(null)
    sessionStorage.removeItem(DEMO_PROFILE_KEY)
  }

  const isLoggedIn = isDemoMode ? demoLoggedIn : !!user

  return (
    <AuthContext.Provider
      value={{
        user: isDemoMode && demoLoggedIn ? (DEMO_SESSION.user as User) : user,
        session: isDemoMode && demoLoggedIn ? (DEMO_SESSION as Session) : session,
        profile,
        loading,
        isDemoMode,
        demoLoggedIn,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithPhone,
        verifyOTP,
        resetPassword,
        demoLogin,
        demoLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function useIsAuthenticated(): boolean {
  const { user, demoLoggedIn, isDemoMode } = useAuth()
  return isDemoMode ? demoLoggedIn : !!user
}
