'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, #06b6d4)' }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container-section relative z-10 text-center py-16">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
          style={{
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: 'var(--brand)',
          }}
        >
          <Sparkles size={12} />
          AI-Powered YouTube Creator Suite
          <span className="px-2 py-0.5 rounded-full text-white text-xs" style={{ background: 'var(--brand)' }}>
            New
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95]"
        >
          Your Creative
          <br />
          <span className="gradient-text">Unfair Advantage</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Generate viral titles, SEO descriptions, thumbnail concepts, and complete script outlines in seconds.
          Plan your content calendar. Grow your channel — all in one hub.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/signup" className="btn-primary text-base px-8 py-4 animate-glow-pulse">
            Start Creating Free <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
            <Play size={16} />
            See How It Works
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-16"
        >
          {[
            { value: '10,000+', label: 'Creators' },
            { value: '500K+', label: 'Titles Generated' },
            { value: '4.9★', label: 'Avg Rating' },
            { value: '100+', label: 'Niches Supported' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-black text-2xl gradient-text">{stat.value}</div>
              <div className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative max-w-5xl mx-auto"
        >
          <div
            className="relative rounded-2xl overflow-hidden shadow-float"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            {/* Browser bar */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
              </div>
              <div
                className="flex-1 mx-4 px-3 py-1 rounded-lg text-xs"
                style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}
              >
                app.creatorforgeai.com/dashboard/titles
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="flex" style={{ minHeight: '380px' }}>
              {/* Sidebar */}
              <div
                className="hidden sm:flex flex-col w-56 p-4 gap-2 border-r shrink-0"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              >
                {[
                  { icon: '⚡', label: 'Dashboard', active: false },
                  { icon: '🎯', label: 'Title Generator', active: true },
                  { icon: '📝', label: 'Descriptions', active: false },
                  { icon: '🖼️', label: 'Thumbnails', active: false },
                  { icon: '📋', label: 'Scripts', active: false },
                  { icon: '📅', label: 'Calendar', active: false },
                  { icon: '💼', label: 'Projects', active: false },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium"
                    style={{
                      background: item.active ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: item.active ? 'var(--brand)' : 'var(--text-muted)',
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content preview */}
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <div className="h-5 w-48 skeleton mb-2 rounded-lg" />
                  <div className="h-3 w-64 skeleton rounded-lg" />
                </div>
                {/* Title result cards */}
                <div className="grid gap-3">
                  {[
                    '🔥 The Dark Psychology Trick That Makes People Trust You Instantly',
                    '😱 I Tried This Forbidden Mind Hack For 30 Days (shocking result)',
                    '🧠 Why Smart People Fall for This Psychological Trap Every Time',
                    '⚡ The One Thought Pattern That Separates Winners From Everyone Else',
                  ].map((title, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl text-left text-xs"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span className="font-medium">{title}</span>
                      <div className="flex gap-1.5 shrink-0 ml-3">
                        <div className="w-6 h-6 rounded-lg skeleton" />
                        <div className="w-6 h-6 rounded-lg skeleton" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating glow under mockup */}
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-3xl opacity-30 rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
