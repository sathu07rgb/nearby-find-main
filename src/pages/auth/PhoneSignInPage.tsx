import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Phone, ArrowLeft, KeyRound, Clock } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/ui/Logo'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { isDemoMode } from '../../lib/supabase'

export function PhoneSignInPage() {
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)

  const { signInWithPhone, verifyOTP, demoLogin } = useAuth()
  const { showSuccess, showError, showWarning } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 8) {
      showError('Invalid phone number', 'Please enter a valid phone number.')
      return
    }

    if (isDemoMode) {
      showWarning('Demo Mode', 'SMS provider is not configured. Real SMS will not be sent.')
      return
    }

    setLoading(true)
    const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`
    const { error } = await signInWithPhone(fullPhone)
    setLoading(false)

    if (error) {
      showError('Failed to send OTP', error)
    } else {
      setOtpSent(true)
      setTimer(60)
      showSuccess('Code sent', `Verification code sent to ${fullPhone}`)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length < 6) {
      showError('Invalid Code', 'Please enter a 6-digit code.')
      return
    }

    setLoading(true)
    const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`
    const { error } = await verifyOTP(fullPhone, otp)
    setLoading(false)

    if (error) {
      showError('Verification failed', error)
    } else {
      showSuccess('Signed in successfully!')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pale-blue to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-modal border border-gray-100 p-8">
          <Link
            to="/auth/signin"
            className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><Logo size="lg" /></div>
            <h1 className="text-2xl font-bold text-brand-text">Phone Verification</h1>
            <p className="text-brand-muted text-sm mt-1">
              Sign in with your mobile number via OTP
            </p>
          </div>

          {isDemoMode && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 space-y-2">
              <p>
                <strong>Notice:</strong> Phone OTP authentication requires Supabase SMS provider setup (e.g. Twilio or MessageBird).
              </p>
              <button
                type="button"
                onClick={() => { demoLogin(); navigate('/dashboard') }}
                className="btn btn-sm btn-secondary w-full"
              >
                Use Demo Login Instead
              </button>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <label className="label-base">Phone Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="input-base w-24 flex-shrink-0"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (AE)</option>
                  <option value="+65">+65 (SG)</option>
                </select>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  leftIcon={<Phone className="w-4 h-4" />}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                loading={loading}
              >
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                label="Enter 6-digit Code"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength={6}
                required
                leftIcon={<KeyRound className="w-4 h-4" />}
              />
              <div className="flex items-center justify-between text-xs text-brand-muted">
                <span>Didn't receive code?</span>
                {timer > 0 ? (
                  <span className="flex items-center gap-1 text-primary-blue">
                    <Clock className="w-3.5 h-3.5" /> Resend in {timer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-primary-blue font-medium hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                loading={loading}
              >
                Verify & Continue
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
