'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FolderHeart, Plus, Search, Loader2, RefreshCw, Grid, List, Trash2, ArrowRight } from 'lucide-react'
import { getProjects, createProject, deleteProject, Project } from '@/lib/supabase/projectHelper'
import toast from 'react-hot-toast'

export default function ProjectsOverviewPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [nicheFilter, setNicheFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Create project form states
  const [isCreating, setIsCreating] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectNiche, setProjectNiche] = useState('General')

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch {
      toast.error('Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) {
      toast.error('Project name cannot be empty.')
      return
    }

    try {
      const created = await createProject(projectName.trim(), projectNiche)
      if (created) {
        toast.success('Project created successfully!')
        setProjectName('')
        setIsCreating(false)
        fetchProjects() // reload
      } else {
        toast.error('Could not create project.')
      }
    } catch {
      toast.error('Failed to create.')
    }
  }

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? All saved AI assets in this project will be lost permanently.`)) {
      return
    }

    try {
      const success = await deleteProject(id)
      if (success) {
        toast.success('Project deleted.')
        fetchProjects()
      } else {
        toast.error('Could not delete project.')
      }
    } catch {
      toast.error('Failed to delete.')
    }
  }

  // Filter projects by search and niche dropdowns
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesNiche = nicheFilter === 'All' || p.niche === nicheFilter
    return matchesSearch && matchesNiche
  })

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
              <FolderHeart size={20} />
            </span>
            Saved Projects
          </h1>
          <p className="text-sm text-secondary mt-1">
            Browse and manage your channel's content creation workspace directories.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary py-2.5 px-5 text-sm shrink-0 self-start sm:self-center"
        >
          <Plus size={16} /> New Project Folder
        </button>
      </div>

      {/* Creation Modal Form */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleCreateProject}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl relative overflow-hidden animate-scale-in"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-display font-bold text-lg text-primary">New Project Folder</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn-ghost w-8 h-8 p-0 rounded-lg flex items-center justify-center"
              >
                <Plus className="rotate-45" size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="label">Project Folder Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Stoic Philosophy Channel"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="label">Niche</label>
                <select
                  className="select"
                  value={projectNiche}
                  onChange={e => setProjectNiche(e.target.value)}
                >
                  <option value="General">General</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Senior Health">Senior Health</option>
                  <option value="Faith-based">Faith-based</option>
                  <option value="Dark/Philosophical">Dark/Philosophical</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5 text-sm">
                  Create Folder
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter and View Layout Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40 p-4 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
            <input
              type="text"
              className="input pl-10 py-2 text-xs"
              placeholder="Search folders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Niche Dropdown */}
          <select
            className="select py-2 px-4 text-xs w-full sm:w-44"
            value={nicheFilter}
            onChange={e => setNicheFilter(e.target.value)}
          >
            <option value="All">All Niches</option>
            <option value="General">General</option>
            <option value="Psychology">Psychology</option>
            <option value="Senior Health">Senior Health</option>
            <option value="Faith-based">Faith-based</option>
            <option value="Dark/Philosophical">Dark/Philosophical</option>
          </select>
        </div>

        {/* View Mode controls */}
        <div className="hidden sm:flex items-center gap-1.5 border p-1 rounded-xl" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs ${viewMode === 'grid' ? 'bg-brand/15 text-brand' : 'btn-ghost'}`}
            title="Grid view"
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs ${viewMode === 'list' ? 'bg-brand/15 text-brand' : 'btn-ghost'}`}
            title="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Main projects container */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-brand" size={32} />
        </div>
      ) : filteredProjects.length === 0 ? (
        /* Empty project list */
        <div className="text-center py-20 border-2 border-dashed rounded-3xl" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <FolderHeart size={48} className="mx-auto text-muted mb-3 opacity-25" />
          <h3 className="font-display font-bold text-base text-primary">No project folders found</h3>
          <p className="text-xs text-secondary mt-1 mb-6">Create a folder directory to structure your YouTube releases.</p>
          <button onClick={() => setIsCreating(true)} className="btn-secondary py-2 px-5 text-xs inline-flex items-center gap-1.5">
            <Plus size={14} /> Create Your First Folder
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {filteredProjects.map(project => {
            const assetCount =
              project.titles.length +
              (project.description ? 1 : 0) +
              project.thumbnail_concepts.length +
              (project.script_outline ? 1 : 0)

            return (
              <div
                key={project.id}
                className="card p-5 flex flex-col justify-between min-h-[170px]"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className="badge badge-brand text-[9px] py-0.5 px-2">{project.niche}</span>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="text-muted hover:text-red-500 transition-colors p-1"
                      title="Delete folder"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 className="font-display font-bold text-base text-primary line-clamp-1">{project.name}</h3>
                  <p className="text-[10px] text-muted mt-1">Modified: {new Date(project.updated_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-xs font-semibold text-secondary">{assetCount} saved items</span>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="text-xs font-bold text-brand hover:underline flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Open Workspace <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List Layout view */
        <div className="flex flex-col gap-2 animate-fade-in">
          {filteredProjects.map(project => {
            const assetCount =
              project.titles.length +
              (project.description ? 1 : 0) +
              project.thumbnail_concepts.length +
              (project.script_outline ? 1 : 0)

            return (
              <div
                key={project.id}
                className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="badge badge-brand text-[9px] py-0 px-2">{project.niche}</span>
                    <span className="text-[10px] text-muted">Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-primary truncate">{project.name}</h3>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-start">
                  <span className="text-xs font-semibold text-secondary">{assetCount} items</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="btn-ghost py-1 px-3 text-xs border rounded-lg flex items-center gap-1"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      Open <ArrowRight size={12} />
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="btn-ghost py-1.5 px-2 rounded-lg border text-red-500 hover:bg-red-500/10 border-red-500/20"
                      title="Delete folder"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
