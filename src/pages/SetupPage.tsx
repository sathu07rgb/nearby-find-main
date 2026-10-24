import { useState } from 'react'
import {
  Database,
  Key,
  Shield,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { isDemoMode } from '../lib/supabase'
import { useToast } from '../context/ToastContext'

export function SetupPage() {
  const { showInfo } = useToast()
  const [copied, setCopied] = useState(false)

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  const copyEnvSample = () => {
    const sample = `# Frontend Public Config
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional Map Integration (Frontend)
VITE_GOOGLE_MAPS_API_KEY=

# Server-Side Secrets (Never expose in VITE_ variables)
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
`
    navigator.clipboard.writeText(sample)
    setCopied(true)
    showInfo('Copied .env template to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">
          Configuration & Setup Guide
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          Complete instructions to link Supabase, enable Row Level Security, and configure OAuth.
        </p>
      </div>

      {/* Current Environment Status */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Database className="w-5 h-5 text-primary-blue" />
          Integration Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-navy">Supabase Connection</span>
              {isDemoMode ? (
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Demo Mode
                </span>
              ) : (
                <span className="text-green-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              )}
            </div>
            <p className="text-[11px] text-brand-muted">
              {isDemoMode
                ? 'Using simulated in-memory store and seeded demo records.'
                : `URL: ${supabaseUrl}`}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-navy">Google OAuth</span>
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Requires Setup
              </span>
            </div>
            <p className="text-[11px] text-brand-muted">
              Configure Client ID in Supabase Auth &gt; Providers &gt; Google.
            </p>
          </div>
        </div>
      </div>

      {/* Step by step guide */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-card space-y-6">
        <h2 className="text-lg font-bold text-brand-navy">
          Step-by-Step Production Setup
        </h2>

        {/* Step 1 */}
        <div className="space-y-2">
          <div className="text-sm font-bold text-primary-blue">
            Step 1: Create a Supabase Project
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Head to{' '}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary-blue underline inline-flex items-center gap-0.5"
            >
              supabase.com <ExternalLink className="w-3 h-3" />
            </a>{' '}
            and create a new project. Copy your <strong>Project URL</strong> and{' '}
            <strong>Anon Key</strong> from Settings &gt; API.
          </p>
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <div className="text-sm font-bold text-primary-blue">
            Step 2: Apply Database Schema & RLS Policies
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Open the Supabase SQL Editor and run the migration script located at{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-brand-navy">
              supabase/schema.sql
            </code>
            . This creates the tables: <code>profiles</code>, <code>item_reports</code>,{' '}
            <code>potential_matches</code>, <code>claims</code>, <code>conversations</code>,{' '}
            <code>messages</code>, and applies PostgreSQL Row Level Security (RLS) policies.
          </p>
        </div>

        {/* Step 3 */}
        <div className="space-y-2">
          <div className="text-sm font-bold text-primary-blue">
            Step 3: Create Storage Bucket
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Create a storage bucket named <code>item-photos</code> in Supabase Storage with public read access for report previews.
          </p>
        </div>

        {/* Step 4 */}
        <div className="space-y-2">
          <div className="text-sm font-bold text-primary-blue">
            Step 4: Configure Environment Variables
          </div>
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
`}
            </pre>
            <button
              onClick={copyEnvSample}
              className="absolute top-3 right-3 text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
