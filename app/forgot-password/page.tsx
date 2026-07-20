'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Mail, ArrowRight, AlertCircle, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email.')
      return
    }

    setLoading(true)
    try {
      // Simulate password reset email send
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitted(true)
      toast.success('Password reset link sent!')
    } catch {
      toast.error('Failed to send reset link.')
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
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-brand shadow-glow-brand">
              <Zap className="text-white" size={20} />
            </div>
            <span className="font-display font-black text-2xl text-primary">
              Creator<span className="gradient-text">Forge</span> AI
            </span>
          </Link>
          <p className="text-sm text-secondary text-center">
            Recover your account access
          </p>
        </div>

        <div
          className="rounded-3xl p-8 border shadow-float"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <h2 className="font-display text-2xl font-bold mb-4 text-primary">Forgot Password</h2>

          {submitted ? (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl text-xs flex gap-2.5 items-start bg-green-500/10 border border-green-500/20 text-green-400">
                <Check className="shrink-0 mt-0.5" size={16} />
                <div>
                  We have sent a password recovery link to <span className="font-bold">{email}</span>. Please verify your inbox and spam folders.
                </div>
              </div>
              <Link href="/login" className="btn-primary w-full py-3 justify-center text-sm mt-2">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-xs text-secondary leading-relaxed">
                Provide your registered email address and we will forward instructions to assign a new secure credential password.
              </p>
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

              <button type="submit" className="btn-primary w-full py-3.5 mt-2" disabled={loading}>
                {loading ? 'Sending Recovery Link...' : 'Send Recovery Link'}
              </button>

              <div className="text-center text-xs mt-2">
                <Link href="/login" className="font-bold hover:underline" style={{ color: 'var(--brand)' }}>
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
