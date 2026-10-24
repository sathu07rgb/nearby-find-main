import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  LogOut,
  Edit3,
  Check,
  FileText,
  Sparkles,
  Award,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useReports } from '../context/ReportsContext'
import { useToast } from '../context/ToastContext'

export function ProfilePage() {
  const { user, profile, demoLoggedIn, signOut, isDemoMode } = useAuth()
  const { reports, matches } = useReports()
  const { showSuccess } = useToast()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(
    profile?.display_name || user?.user_metadata?.display_name || 'Demo User'
  )
  const [phone, setPhone] = useState('+91 98765 43210')
  const [bio, setBio] = useState('Active community member & student.')

  const currentUserId = user?.id || (demoLoggedIn ? 'demo-user-001' : null)
  const myReports = reports.filter((r) => r.reporter_id === currentUserId)
  const myLostCount = myReports.filter((r) => r.report_type === 'lost').length
  const myFoundCount = myReports.filter((r) => r.report_type === 'found').length
  const myRecoveredCount = myReports.filter((r) => r.status === 'recovered').length

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    showSuccess('Profile updated', 'Your display details have been updated.')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Avatar Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary-blue text-white flex items-center justify-center text-3xl font-extrabold shadow-md flex-shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-brand-navy">{displayName}</h1>
            <span className="badge bg-green-50 text-green-700 border border-green-200 self-center sm:self-auto">
              Verified Member
            </span>
            {isDemoMode && (
              <span className="badge bg-amber-50 text-amber-700 border border-amber-200 self-center sm:self-auto">
                Demo Profile
              </span>
            )}
          </div>
          <p className="text-xs text-brand-muted">{bio}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-brand-muted pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {user?.email || 'demo@finditnearby.app'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Member since Jan 2024
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-brand-navy border-b border-gray-100 pb-2">
            Edit Public Display Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Input
            label="Bio or Campus Affiliation"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              <Check className="w-4 h-4 mr-1" /> Save Changes
            </Button>
          </div>
        </form>
      )}

      {/* Recovery & Participation Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-card text-center">
          <FileText className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-brand-navy">{myLostCount}</div>
          <div className="text-xs text-brand-muted mt-0.5">Lost Reports</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-card text-center">
          <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-brand-navy">{myFoundCount}</div>
          <div className="text-xs text-brand-muted mt-0.5">Found Reports</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-card text-center">
          <ShieldCheck className="w-6 h-6 text-primary-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-brand-navy">{myRecoveredCount}</div>
          <div className="text-xs text-brand-muted mt-0.5">Recovered Items</div>
        </div>
      </div>

      {/* Privacy Policy and Security Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-brand-navy">Privacy & Account Security</h2>
        <div className="text-xs text-brand-muted leading-relaxed space-y-2">
          <p>
            • Your email address and phone number are never visible in public item searches.
          </p>
          <p>
            • Only authorized conversation partners can contact you through our in-app messaging protocol.
          </p>
          <p>
            • Changing profile display fields does not alter ownership verification records or claim decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
