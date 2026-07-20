'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { loginUser } from '@/lib/supabase/authHelper'
import toast from 'react-hot-toast'
import { isSupabaseConfigured } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const { user, error: loginErr } = await loginUser(email, password)

      if (loginErr) {
        setError(loginErr)
        toast.error(loginErr)
      } else {
        toast.success('Successfully logged in!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.')
      toast.error('Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden bg-gradient-dark-bg">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Link */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-brand shadow-glow-brand transition-transform duration-300 group-hover:scale-105">
              <Zap className="text-white" size={20} />
            </div>
            <span className="font-display font-black text-2xl text-primary">
              Creator<span className="gradient-text">Forge</span> AI
            </span>
          </Link>
          <p className="text-sm text-secondary text-center">
            Log in to manage your content workflow
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-3xl p-8 border shadow-float"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <h2 className="font-display text-2xl font-bold mb-6 text-primary">Welcome back</h2>

          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 rounded-xl text-xs flex gap-2.5 items-start bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <div>
                <span className="font-bold">Offline / Demo Mode active.</span> Local storage accounts are simulated. Enter any email and passwords to register or log in.
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="email"
                  className="input pl-11"
                  placeholder="name@channel.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold hover:underline"
                  style={{ color: 'var(--brand)' }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="password"
                  className="input pl-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-secondary">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold hover:underline" style={{ color: 'var(--brand)' }}>
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
