'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Marcus Rivera',
    handle: '@marcuspsych',
    role: 'Psychology Channel · 280K subs',
    avatar: 'MR',
    avatarColor: '#7c3aed',
    rating: 5,
    text: "CreatorForge AI completely replaced my 2-hour title brainstorming sessions. I paste my video idea and get 10 viral-worthy titles instantly. The psychology niche selector is scary accurate.",
  },
  {
    name: 'Fatima Hassan',
    handle: '@faithfullyFatima',
    role: 'Islamic Content · 95K subs',
    avatar: 'FH',
    avatarColor: '#06b6d4',
    rating: 5,
    text: "The faith-based niche mode really gets the tone right. No more awkward AI outputs that sound out of place. The script outlines save me 3 hours per video, every single week.",
  },
  {
    name: 'David Chen',
    handle: '@SeniorHealthTips',
    role: 'Senior Health · 140K subs',
    avatar: 'DC',
    avatarColor: '#10b981',
    rating: 5,
    text: "Managing 3 channels used to be chaos. Now every project is organized in one place — titles, descriptions, thumbnails, outlines, and my upload schedule. It's like having a production assistant.",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.05), transparent)' }}
      />

      <div className="container-section relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
          >
            Trusted by creators
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-primary">
            Creators who scaled
            <br />
            <span className="gradient-text">with CreatorForge AI</span>
          </h2>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            * These are sample testimonials illustrating typical creator experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="card p-6 flex flex-col gap-4"
            >
              {/* Quote icon */}
              <Quote size={24} style={{ color: t.avatarColor, opacity: 0.5 }} />

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#f59e0b" stroke="none" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                  style={{ background: t.avatarColor }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
