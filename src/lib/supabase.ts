// Supabase client configuration with demo mode fallback
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isDemoMode = !supabaseUrl || !supabaseAnonKey || 
  supabaseUrl === 'your_supabase_project_url' || 
  supabaseAnonKey === 'your_supabase_anon_key'

let _supabase: SupabaseClient<Database> | null = null

export function getSupabase(): SupabaseClient<Database> | null {
  if (isDemoMode) return null
  if (!_supabase) {
    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  }
  return _supabase
}

export const supabase = isDemoMode ? null : getSupabase()
