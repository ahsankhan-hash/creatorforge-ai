'use client'

import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect to try CreatorForge AI and experience the power of AI content creation.',
    cta: 'Get Started Free',
    ctaHref: '/signup',
    highlight: false,
    features: [
      '20 AI generations / month',
      'Title Generator',
      'Description Generator',
      '3 saved projects',
      'Content calendar (1 month view)',
      'Export as plain text',
    ],
    missing: [
      'Thumbnail concept generator',
      'Script outline generator',
      'Unlimited projects',
      'Priority AI queue',
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For serious creators and multi-channel operators who need unlimited power.',
    cta: 'Start Pro Free Trial',
    ctaHref: '/signup?plan=pro',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited AI generations',
      'All 4 generator tools',
      'Unlimited saved projects',
      'Full content calendar',
      'Export as Markdown',
      'Priority AI queue',
      'Multi-channel project folders',
      'Advanced niche tuning',
      'Early access to new features',
    ],
    missing: [],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(6,182,212,0.06), transparent)' }}
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
            style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--brand)' }}
          >
            Simple Pricing
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-primary">
            Start free.
            <br />
            <span className="gradient-text">Scale when ready.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            No credit card required. Cancel anytime. Upgrade when your channel demands it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col"
            >
              <div
                className="flex-1 rounded-2xl p-8 flex flex-col gap-6"
                style={{
                  background: plan.highlight
                    ? 'linear-gradient(145deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.08) 100%)'
                    : 'var(--card)',
                  border: plan.highlight ? '2px solid var(--brand)' : '1px solid var(--border)',
                  boxShadow: plan.highlight ? 'var(--glow)' : 'var(--shadow)',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="btn-primary px-4 py-1 text-xs flex items-center gap-1.5">
                      <Zap size={12} /> {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan name + price */}
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: plan.highlight ? 'var(--brand)' : 'var(--text-muted)' }}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="font-display font-black text-5xl text-primary">{plan.price}</span>
                    <span className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>/{plan.period}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={plan.highlight ? 'btn-primary justify-center' : 'btn-secondary justify-center'}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="flex flex-col gap-3">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                      <span className="shrink-0 mt-0.5 text-base leading-none">—</span>
                      <span style={{ color: 'var(--text-muted)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm mt-8"
          style={{ color: 'var(--text-muted)' }}
        >
          All plans include a 14-day Pro trial. No payment info required.
        </motion.p>
      </div>
    </section>
  )
}
