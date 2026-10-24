import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/ui/Logo'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword, isDemoMode: demoMode } = useAuth()
  const { showError } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    if (demoMode) {
      showError('Demo mode active', 'Password reset requires a configured Supabase project.')
      return
    }
    setIsLoading(true)
    const { error } = await resetPassword(data.email)
    setIsLoading(false)
    if (error) {
      showError('Reset failed', error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pale-blue to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-modal border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-brand-text mb-2">Check your inbox</h2>
          <p className="text-brand-muted mb-2">
            If an account exists for <strong>{getValues('email')}</strong>, you'll receive a password reset link shortly.
          </p>
          <p className="text-sm text-brand-muted mb-6">
            For security, we don't confirm whether an arbitrary email belongs to an existing account.
          </p>
          <Link to="/auth/signin">
            <Button variant="primary" size="lg" className="w-full">Back to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pale-blue to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-modal border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><Logo size="lg" /></div>
            <h1 className="text-2xl font-bold text-brand-text">Reset your password</h1>
            <p className="text-brand-muted text-sm mt-1">
              Enter your email and we'll send you instructions to set a new password.
            </p>
          </div>

          {demoMode && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>Demo mode:</strong> Password reset requires Supabase Auth email service configuration.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              required
              placeholder="you@example.com"
              {...register('email')}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-5"
              loading={isLoading}
            >
              Send Reset Link
            </Button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            Remembered it?{' '}
            <Link to="/auth/signin" className="text-primary-blue font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
