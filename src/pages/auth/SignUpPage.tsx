import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/ui/Logo'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp, signInWithGoogle, demoLogin, isDemoMode: demoMode } = useAuth()
  const { showError } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const { error } = await signUp(data.email, data.password, data.name)
    setIsLoading(false)
    if (error) {
      showError('Sign up failed', error)
    } else {
      setSuccess(true)
    }
  }

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle()
    if (error) showError('Google sign-in failed', error)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pale-blue to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-modal border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-brand-text mb-2">Check your email</h2>
          <p className="text-brand-muted mb-6">
            We sent a confirmation link to your email. Click it to activate your account.
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
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-brand-text">Create your account</h1>
            <p className="text-brand-muted text-sm mt-1">Join your community on FindIt Nearby</p>
          </div>

          {demoMode && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>Demo Mode:</strong> Supabase is unconfigured.{' '}
              <button
                type="button"
                onClick={() => { demoLogin(); navigate('/dashboard') }}
                className="underline font-semibold text-primary-blue hover:text-blue-800"
              >
                Sign in with demo account instead
              </button>
            </div>
          )}

          {!demoMode && (
            <>
              <Button variant="outline" size="lg" className="w-full mb-4" onClick={handleGoogle}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs text-brand-muted">
                  <span className="bg-white px-3">or sign up with email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.name?.message}
                required
                placeholder="Your full name"
                {...register('name')}
              />
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
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                hint="Min. 8 chars, one uppercase, one number"
                required
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-brand-muted hover:text-brand-text" aria-label={showPassword ? 'Hide' : 'Show'} tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('password')}
              />
              <Input
                label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                required
                rightElement={
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-brand-muted hover:text-brand-text" aria-label={showConfirm ? 'Hide' : 'Show'} tabIndex={-1}>
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('confirmPassword')}
              />
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                    {...register('terms')}
                  />
                  <span className="text-sm text-brand-muted">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-blue hover:underline">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-blue hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-600" role="alert">{errors.terms.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            Already have an account?{' '}
            <Link to="/auth/signin" className="text-primary-blue font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
