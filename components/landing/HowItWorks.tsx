'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Sparkles, FolderOpen, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Lightbulb,
    title: 'Enter Your Idea',
    description: 'Type your video topic, choose your niche (Psychology, Senior Health, Faith-based, etc.), and select your style preferences.',
    color: '#7c3aed',
    colorLight: 'rgba(124,58,237,0.12)',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Generates Your Assets',
    description: 'In seconds, CreatorForge AI creates viral titles, an SEO description, thumbnail concept briefs, and a full script outline — all at once.',
    color: '#06b6d4',
    colorLight: 'rgba(6,182,212,0.12)',
  },
  {
    number: '03',
    icon: FolderOpen,
    title: 'Save & Organize',
    description: 'Bundle everything into a Project. Schedule on your content calendar. Copy assets directly to YouTube Studio when you\'re ready to upload.',
    color: '#10b981',
    colorLight: 'rgba(16,185,129,0.12)',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(124,58,237,0.06), transparent)' }}
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
            style={{ background: 'rgba(6,182,212,0.12)', color: 'var(--accent)' }}
          >
            How It Works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-primary">
            From idea to
            <br />
            <span className="gradient-text">upload-ready in 60s</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Three simple steps replace hours of manual research, writing, and planning.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            className="absolute top-[3.5rem] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px hidden lg:block"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #10b981)' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                      style={{ background: step.colorLight, color: step.color, border: `2px solid ${step.color}30` }}
                    >
                      <Icon size={28} strokeWidth={1.8} />
                    </div>
                    {/* Step number */}
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white z-20"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold text-xl mb-3 text-primary">{step.title}</h3>
                  <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                    {step.description}
                  </p>

                  {/* Mobile arrow */}
                  {i < 2 && (
                    <div className="lg:hidden mt-6" style={{ color: 'var(--text-muted)' }}>
                      <ArrowRight size={20} className="rotate-90" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
