'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'
import { useTheme } from '@/components/shared/ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { clsx } from 'clsx'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'py-3 backdrop-blur-xl border-b'
          : 'py-5'
      )}
      style={{
        background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
      }}
    >
      <div className="container-section flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-brand shadow-glow-brand">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-primary">
            Creator<span className="gradient-text">Forge</span> AI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="btn-ghost w-9 h-9 p-0 rounded-xl"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link href="/login" className="btn-secondary py-2 px-4 text-sm">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary py-2 px-5 text-sm">
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleTheme} className="btn-ghost w-9 h-9 p-0 rounded-xl" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="btn-ghost w-9 h-9 p-0 rounded-xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mt-2 mx-4 rounded-2xl p-4 flex flex-col gap-1 animate-slide-down"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-surface transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
            <Link href="/login" className="btn-secondary w-full justify-center py-2.5" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary w-full justify-center py-2.5" onClick={() => setMenuOpen(false)}>
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
