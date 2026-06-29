import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiLightningBolt, HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi'
import { useToastContext } from '../components/Toast'

export default function Login() {
  const navigate = useNavigate()
  const { addToast } = useToastContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      addToast('Please fill in all fields.', 'error')
      return
    }

    setIsSubmitting(true)

    // Simulate login loading state
    setTimeout(() => {
      localStorage.setItem('is_logged_in', 'true')
      
      // Seed default profile if not exists
      if (!localStorage.getItem('user_profile')) {
        localStorage.setItem('user_profile', JSON.stringify({
          name: 'Venky Athlete',
          age: 24,
          weight: 75,
          height: 180,
          gender: 'male',
          activityLevel: 'Moderately Active',
          dailyWaterGoal: 8,
          dailySleepGoal: 8,
          dailyStepsGoal: 10000,
        }))
      }

      addToast('Successfully logged in! Welcome back 💪', 'success')
      setIsSubmitting(false)
      navigate('/')
      // Trigger a window event to let other components know login state changed
      window.dispatchEvent(new Event('storage'))
    }, 1000)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#06131A' }}
    >
      {/* Background Decorative Mesh Blobs */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #14B8A6, transparent)' }}
      />

      {/* Login Card */}
      <div className="glass-card p-8 w-full max-w-md relative z-10 animate-scale-in">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 gradient-bg-primary animate-float"
            style={{ boxShadow: '0 8px 30px rgba(6, 182, 212, 0.4)' }}
          >
            <HiLightningBolt className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold gradient-text tracking-wide mb-1">
            AI Fitness
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Smart Gym Assistant
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <HiMail className="text-lg" style={{ color: 'var(--text-muted)' }} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 text-sm"
                placeholder="athlete@aigym.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <HiLockClosed className="text-lg" style={{ color: 'var(--text-muted)' }} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 text-sm"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-secondary)]">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--color-primary)] focus:ring-0" 
              />
              Remember me
            </label>
            <a href="#forgot" className="font-semibold text-[var(--color-primary)] hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3.5 rounded-xl font-bold text-base justify-center mt-6 transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In <HiArrowRight className="text-lg" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <a href="#signup" className="font-bold text-[var(--color-primary)] hover:underline">
            Sign Up Now
          </a>
        </div>
      </div>
    </div>
  )
}
