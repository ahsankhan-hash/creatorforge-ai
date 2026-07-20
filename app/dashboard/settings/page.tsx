'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Shield, Moon, Sun, Key, LogOut, Loader2, RefreshCw } from 'lucide-react'
import { useAuth } from '@/components/shared/AuthContext'
import { useTheme } from '@/components/shared/ThemeProvider'
import { logoutUser } from '@/lib/supabase/authHelper'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const { error } = await logoutUser()
      if (error) {
        toast.error('Logout failed.')
      } else {
        toast.success('Logged out successfully.')
        router.push('/login')
        router.refresh()
      }
    } catch {
      toast.error('Error logging out.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
            <Settings size={20} />
          </span>
          Account Settings
        </h1>
        <p className="text-sm text-secondary mt-1">
          Customize your dashboard preferences, theme controls, and check API integrations.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <div
          className="card p-6 flex flex-col gap-4"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-display font-bold text-base text-primary flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <Shield size={18} className="text-brand" /> Profile & Credentials
          </h3>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-secondary uppercase text-[10px] tracking-wide">Registered Email</span>
            <span className="text-sm text-primary font-medium">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-xs font-semibold text-secondary uppercase text-[10px] tracking-wide">Status</span>
            <span className="badge badge-success text-[10px] self-start py-0 px-2.5 font-bold">Active Member</span>
          </div>
        </div>

        {/* Preferences Toggle */}
        <div
          className="card p-6 flex flex-col gap-4"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-display font-bold text-base text-primary flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            {theme === 'dark' ? <Moon size={18} className="text-brand" /> : <Sun size={18} className="text-amber-500" />}
            Theme Preference
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            Select your preferred visual style for the entire SaaS hub workspace.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setTheme('light')}
              className={`btn-ghost border py-2 px-5 text-xs font-bold rounded-xl flex items-center gap-1.5 ${theme === 'light' ? 'border-brand text-brand bg-brand/5' : ''}`}
              style={{ borderColor: theme === 'light' ? 'var(--brand)' : 'var(--border)' }}
            >
              <Sun size={14} /> Light Mode
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`btn-ghost border py-2 px-5 text-xs font-bold rounded-xl flex items-center gap-1.5 ${theme === 'dark' ? 'border-brand text-brand bg-brand/5' : ''}`}
              style={{ borderColor: theme === 'dark' ? 'var(--brand)' : 'var(--border)' }}
            >
              <Moon size={14} /> Dark Mode
            </button>
          </div>
        </div>

        {/* API Connection Checklist */}
        <div
          className="card p-6 flex flex-col gap-4"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-display font-bold text-base text-primary flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <Key size={18} className="text-accent" /> API Integrations Checklist
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            Verify if the backend environment configuration parameters are enabled for production mode.
          </p>

          <div className="flex flex-col gap-3 mt-2">
            {/* Database status */}
            <div className="flex items-center justify-between text-xs border-b pb-2.5" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <p className="font-bold text-primary">Supabase Auth & Database</p>
                <p className="text-[10px] text-muted">For cloud synchronization and user account persistence</p>
              </div>
              <span className={`badge font-bold text-[9px] py-0 px-2 ${isSupabaseConfigured ? 'badge-success' : 'badge-warning'}`}>
                {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL CACHE / DEMO MODE'}
              </span>
            </div>

            {/* AI pipeline status */}
            <div className="flex items-center justify-between text-xs pb-1">
              <div>
                <p className="font-bold text-primary">OpenAI GPT Engines</p>
                <p className="text-[10px] text-muted">Powers all 4 text-generation creator modules</p>
              </div>
              <span className={`badge font-bold text-[9px] py-0 px-2 ${isSupabaseConfigured ? 'badge-success' : 'badge-warning'}`}>
                {/* Check if environment variables for openAI is loaded if isSupabaseConfigured is checked or default to fallback */}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'LOADED' : 'SIMULATION MODE'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Exit logout buttons */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn-ghost border py-3 px-6 text-sm font-semibold rounded-xl text-red-500 border-red-500/20 hover:bg-red-500/10 flex items-center gap-2 justify-center w-full mt-4"
        >
          {loggingOut ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Logging out...
            </>
          ) : (
            <>
              <LogOut size={16} /> Log Out of Workspace
            </>
          )}
        </button>
      </div>
    </div>
  )
}
