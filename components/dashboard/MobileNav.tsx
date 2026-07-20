'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Zap,
  Menu,
  X,
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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
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
      setIsOpen(false)
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

  const activeItem = navItems.find(item =>
    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
  )

  return (
    <div className="md:hidden">
      {/* Top sticky header */}
      <header
        className="fixed top-0 left-0 right-0 h-16 border-b z-40 flex items-center justify-between px-4 backdrop-blur-xl"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-brand shadow-glow-brand">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-sm text-primary">
            Creator<span className="gradient-text">Forge</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full badge-brand">
            {activeItem?.label || 'Dashboard'}
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl btn-ghost"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Spacer to push content down below sticky header */}
      <div className="h-16" />

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'var(--bg-secondary)',
        }}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-brand">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm text-primary">Menu</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg btn-ghost"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon shrink-0" size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t flex flex-col gap-3.5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col min-w-0 max-w-[150px]">
              <span className="text-xs font-bold text-primary truncate">
                {user?.email || 'Creator Account'}
              </span>
              <span className="text-[10px] text-muted truncate">Mobile View</span>
            </div>
            <button
              onClick={toggleTheme}
              className="btn-ghost w-8 h-8 p-0 rounded-lg shrink-0 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
