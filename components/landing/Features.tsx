'use client'

import { motion } from 'framer-motion'
import { Type, FileText, Image, FileCode, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Type,
    title: 'AI Title Generator',
    description: 'Generate 8–10 viral title variations with different hook styles — curiosity, listicle, emotional, and question-based. Tuned for your niche.',
    color: '#7c3aed',
    colorLight: 'rgba(124,58,237,0.12)',
    path: '/dashboard/titles',
    tags: ['Psychology', 'Faith-based', 'Senior Health', 'Dark/Philosophical'],
  },
  {
    icon: FileText,
    title: 'Description Generator',
    description: 'Structured SEO descriptions with hook, body, timestamps, hashtags, and subscribe CTAs — ready to paste directly into YouTube.',
    color: '#06b6d4',
    colorLight: 'rgba(6,182,212,0.12)',
    path: '/dashboard/descriptions',
    tags: ['SEO optimized', 'Hashtags', 'CTA included'],
  },
  {
    icon: Image,
    title: 'Thumbnail Concepts',
    description: 'Get 3–5 detailed thumbnail concept briefs with composition, emotion, color mood, and text overlay suggestions. No design skills needed.',
    color: '#f59e0b',
    colorLight: 'rgba(245,158,11,0.12)',
    path: '/dashboard/thumbnails',
    tags: ['Color mood', 'Composition', 'Text overlay'],
  },
  {
    icon: FileCode,
    title: 'Script Outlines',
    description: 'Full structured outlines with Hook/Intro, main sections with bullet points, and Conclusion/CTA. Export as Markdown or plain text.',
    color: '#10b981',
    colorLight: 'rgba(16,185,129,0.12)',
    path: '/dashboard/scripts',
    tags: ['Hook & CTA', 'Export to MD', 'Expandable sections'],
  },
  {
    icon: Calendar,
    title: 'Content Calendar',
    description: 'Plan your upload schedule on a beautiful month-view calendar. Track content status from Idea to Published with color-coded badges.',
    color: '#ec4899',
    colorLight: 'rgba(236,72,153,0.12)',
    path: '/dashboard/calendar',
    tags: ['Month view', 'Status tracking', 'Color coded'],
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="card p-6 flex flex-col gap-4 group relative overflow-hidden"
    >
      {/* Hover gradient accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(400px circle at 50% 0%, ${feature.colorLight}, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: feature.colorLight, color: feature.color }}
      >
        <Icon size={22} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-display font-bold text-lg mb-2 text-primary">{feature.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {feature.description}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {feature.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: feature.colorLight, color: feature.color }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Try it link */}
      <Link
        href={feature.path}
        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-2.5"
        style={{ color: feature.color }}
      >
        Try it free <ArrowRight size={14} />
      </Link>
    </motion.div>
  )
}

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container-section">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--brand)' }}
          >
            Everything You Need
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-primary">
            Five tools. One hub.
            <br />
            <span className="gradient-text">Zero excuses.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            CreatorForge AI gives you an end-to-end content creation pipeline — from idea to upload-ready assets.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(0, 3).map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
          {/* Last two cards centered */}
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 md:max-w-2xl lg:max-w-3xl mx-auto w-full">
            {features.slice(3).map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
