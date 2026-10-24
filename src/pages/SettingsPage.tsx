import { useState } from 'react'
import { Bell, Shield, Moon, Trash2, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'

export function SettingsPage() {
  const { showSuccess, showWarning } = useToast()
  const [matchAlerts, setMatchAlerts] = useState(true)
  const [messageAlerts, setMessageAlerts] = useState(true)
  const [claimAlerts, setClaimAlerts] = useState(true)

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault()
    showSuccess('Preferences Saved', 'Your notification settings have been updated.')
  }

  const handleClearDemoData = () => {
    sessionStorage.clear()
    showWarning('Demo Data Reset', 'Local session cache cleared. Reloading page...')
    setTimeout(() => window.location.reload(), 800)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">Settings</h1>
        <p className="text-sm text-brand-muted mt-1">
          Customize notifications, privacy controls, and local app preferences.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-6">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2 border-b border-gray-100 pb-3">
          <Bell className="w-5 h-5 text-primary-blue" />
          Notification Preferences
        </h2>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-brand-text block">AI Match Alerts</span>
              <span className="text-xs text-brand-muted">
                Receive notifications when candidate matches score above 50%
              </span>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-primary-blue focus:ring-primary-blue"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-brand-text block">New Message Notifications</span>
              <span className="text-xs text-brand-muted">
                Notify when a finder or owner sends an in-app message
              </span>
            </div>
            <input
              type="checkbox"
              checked={messageAlerts}
              onChange={(e) => setMessageAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-primary-blue focus:ring-primary-blue"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-brand-text block">Claim Status Updates</span>
              <span className="text-xs text-brand-muted">
                Get alerted when an ownership claim is verified or scheduled for handover
              </span>
            </div>
            <input
              type="checkbox"
              checked={claimAlerts}
              onChange={(e) => setClaimAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-primary-blue focus:ring-primary-blue"
            />
          </label>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="sm">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Save Settings
            </Button>
          </div>
        </form>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-red-600 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          Reset Demo State
        </h2>
        <p className="text-xs text-brand-muted leading-relaxed">
          Clear all locally cached session reports, simulated logins, and test claims stored in this browser session.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={handleClearDemoData}
        >
          Clear Local Demo Cache
        </Button>
      </div>
    </div>
  )
}
