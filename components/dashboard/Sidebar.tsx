'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Zap,
  LayoutDashboard,
  Type,
  FileText,
  Image as ImageIcon,
  FileCode,
  Calendar as CalendarIcon,
  FolderHeart,
  Settings,
  LogOut,
  Sun,
  Moon
} from 'lucide-react'
import { logoutUser } from '@/lib/supabase/authHelper'
import { useAuth } from '@/components/shared/AuthContext'
import { useTheme } from '@/components/shared/ThemeProvider'
import toast from 'react-hot-toast'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    const { error } = await logoutUser()
    if (error) {
      toast.error('Logout failed.')
    } else {
      toast.success('Logged out successfully.')
      router.push('/login')
      router.refresh()
    }
  }

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/titles', label: 'Title Generator', icon: Type },
    { href: '/dashboard/descriptions', label: 'Descriptions', icon: FileText },
    { href: '/dashboard/thumbnails', label: 'Thumbnails', icon: ImageIcon },
    { href: '/dashboard/scripts', label: 'Scripts', icon: FileCode },
    { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarIcon },
    { href: '/dashboard/projects', label: 'Saved Projects', icon: FolderHeart },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className="hidden md:flex flex-col w-64 border-r h-screen sticky top-0 shrink-0 select-none"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Brand Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-brand shadow-glow-brand">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-base text-primary">
            Creator<span className="gradient-text">Forge</span> AI
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon shrink-0" size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer / User section */}
      <div className="p-4 border-t flex flex-col gap-3" style={{ borderColor: 'var(--border)' }}>
        {/* Quick info / Theme */}
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col min-w-0 max-w-[130px]">
            <span className="text-xs font-semibold text-primary truncate">
              {user?.email || 'Creator Account'}
            </span>
            <span className="text-[10px] text-muted truncate">Active Channel</span>
          </div>
          <button
            onClick={toggleTheme}
            className="btn-ghost w-8 h-8 p-0 rounded-lg shrink-0 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Signout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
