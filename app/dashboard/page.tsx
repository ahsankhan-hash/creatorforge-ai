'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Type,
  FileText,
  Image as ImageIcon,
  FileCode,
  Calendar as CalendarIcon,
  FolderHeart,
  Plus,
  ArrowRight,
  Loader2,
  Tv,
  ListTodo
} from 'lucide-react'
import { getProjects, Project } from '@/lib/supabase/projectHelper'
import { useAuth } from '@/components/shared/AuthContext'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  
  // Custom stats
  const [stats, setStats] = useState({
    projectsCount: 0,
    scriptsCount: 0,
    titlesCount: 0,
    nextVideo: 'No uploads scheduled'
  })

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await getProjects()
        setProjects(data.slice(0, 3)) // Show last 3 recent projects
        
        // Calculate stats
        let scriptsCount = 0
        let titlesCount = 0
        data.forEach(p => {
          if (p.script_outline) scriptsCount++
          if (p.titles && p.titles.length > 0) titlesCount += p.titles.length
        })

        // Simple local storage or placeholder checks for calendar
        const calendarJson = localStorage.getItem('cf_local_calendar') || '[]'
        const calendarEntries = JSON.parse(calendarJson) as Array<any>
        const upcoming = calendarEntries
          .filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setStats({
          projectsCount: data.length,
          scriptsCount,
          titlesCount,
          nextVideo: upcoming.length > 0 ? `${upcoming[0].title} (${new Date(upcoming[0].date).toLocaleDateString()})` : 'No upcoming uploads'
        })
      } catch {
        toast.error('Failed to load dashboard stats.')
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const quickActions = [
    {
      title: 'Title Generator',
      desc: 'Formulate highly clickable viral titles',
      icon: Type,
      href: '/dashboard/titles',
      color: 'var(--brand)',
      colorBg: 'rgba(124,58,237,0.1)'
    },
    {
      title: 'Description Studio',
      desc: 'Build YouTube SEO description layouts',
      icon: FileText,
      href: '/dashboard/descriptions',
      color: 'var(--accent)',
      colorBg: 'rgba(6,182,212,0.1)'
    },
    {
      title: 'Thumbnail Ideas',
      desc: 'Outline composition & visual concepts',
      icon: ImageIcon,
      href: '/dashboard/thumbnails',
      color: '#f59e0b',
      colorBg: 'rgba(245,158,11,0.1)'
    },
    {
      title: 'Script Blueprint',
      desc: 'Design full video hooks and section outlines',
      icon: FileCode,
      href: '/dashboard/scripts',
      color: '#10b981',
      colorBg: 'rgba(16,185,129,0.1)'
    }
  ]

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Hey, Creator 👋
          </h1>
          <p className="text-sm text-secondary mt-1">
            Ready to plan your next viral release? Let's build something epic today.
          </p>
        </div>
        <Link href="/dashboard/projects" className="btn-primary py-2.5 px-5 text-sm shrink-0 self-start sm:self-center">
          <Plus size={16} /> New Project
        </Link>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: stats.projectsCount, desc: 'Organized folders', icon: FolderHeart, color: 'var(--brand)' },
          { label: 'Scripts Generated', value: stats.scriptsCount, desc: 'Outlines compiled', icon: FileCode, color: '#10b981' },
          { label: 'Titles brainstormed', value: stats.titlesCount, desc: 'Saved candidates', icon: Type, color: 'var(--accent)' },
          { label: 'Next Scheduled Upload', value: stats.nextVideo, desc: 'Calendar roadmap', icon: CalendarIcon, color: '#ec4899', isText: true }
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="card p-5 flex flex-col justify-between min-h-[120px]"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">{stat.label}</span>
                <span className="p-1.5 rounded-lg text-xs" style={{ background: 'var(--card)', color: stat.color }}>
                  <Icon size={16} />
                </span>
              </div>
              <div className="mt-3">
                <h3 className={`font-display font-black text-primary ${stat.isText ? 'text-sm truncate' : 'text-3xl'}`}>
                  {stat.value}
                </h3>
                <p className="text-[10px] text-muted mt-1 leading-normal">{stat.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Tools Access */}
      <div>
        <h2 className="font-display text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-brand animate-bounce-subtle" /> Quick Action Generators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="card p-5 flex flex-col justify-between min-h-[140px] hover:shadow-float text-left"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: action.colorBg, color: action.color }}
                >
                  <Icon size={20} />
                </div>
                <div className="mt-4">
                  <h3 className="font-display font-bold text-sm text-primary flex items-center gap-1.5 justify-between">
                    {action.title} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-[11px] text-secondary mt-1">{action.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Recent Projects */}
        <div
          className="card p-6 lg:col-span-2 flex flex-col gap-4"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-display font-bold text-lg text-primary flex items-center gap-2">
              <FolderHeart size={18} className="text-brand" /> Recent Active Projects
            </h2>
            <Link href="/dashboard/projects" className="text-xs font-semibold hover:underline" style={{ color: 'var(--brand)' }}>
              See All
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-brand" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Tv size={40} className="mx-auto text-muted mb-3 opacity-30" />
              <p className="text-sm font-semibold text-primary">No active projects found</p>
              <p className="text-xs text-muted mt-1 mb-4">Create a folder to save all video research elements together.</p>
              <Link href="/dashboard/projects" className="btn-secondary py-1.5 px-4 text-xs">
                Create Project Folder
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map(project => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border hover:bg-surface transition-all w-full text-left"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-brand text-[10px] py-0 px-2">{project.niche}</span>
                      <span className="text-[10px] text-muted">Modified: {new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-primary truncate">{project.name}</h3>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    <div className="flex gap-2">
                      {project.titles.length > 0 && <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand/10 text-brand">Titles ({project.titles.length})</span>}
                      {project.description && <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/10 text-accent">Desc</span>}
                      {project.script_outline && <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-500">Script</span>}
                    </div>
                    <ArrowRight size={16} className="text-muted shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Platform Instructions/Tips */}
        <div
          className="card p-6 flex flex-col gap-4"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <div className="pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-display font-bold text-lg text-primary flex items-center gap-2">
              <ListTodo size={18} className="text-accent" /> Workflow Checklist
            </h2>
          </div>
          <ul className="flex flex-col gap-3">
            {[
              { text: 'Start with Title Generator to craft curiosities.', done: stats.titlesCount > 0 },
              { text: 'Outline visual design ideas in Thumbnail Concepts.', done: data => false }, // Placeholder checks
              { text: 'Expand sections into bullet-points in Script Outlines.', done: stats.scriptsCount > 0 },
              { text: 'Plan launch date inside Content Calendar.', done: false }
            ].map((tip, i) => (
              <li key={i} className="flex gap-2.5 items-start text-xs leading-relaxed">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold ${tip.done ? 'bg-green-500/20 text-green-500' : 'bg-brand/10 text-brand'}`}>
                  {i + 1}
                </span>
                <span className="text-secondary">{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
