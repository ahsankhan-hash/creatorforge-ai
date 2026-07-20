'use client'

import { useState, useEffect } from 'react'
import { getProjects, createProject, Project } from '@/lib/supabase/projectHelper'
import { X, Plus, FolderPlus, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface SaveToProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (projectId: string) => Promise<boolean>
  assetType: 'title' | 'description' | 'thumbnail' | 'script'
}

export function SaveToProjectModal({ isOpen, onClose, onSave, assetType }: SaveToProjectModalProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectNiche, setNewProjectNiche] = useState('General')

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
    if (isOpen) {
      fetchProjects()
      setShowCreateForm(false)
      setNewProjectName('')
    }
  }, [isOpen])

  const handleCreateAndSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) {
      toast.error('Project name cannot be empty.')
      return
    }

    setSaving(true)
    try {
      const created = await createProject(newProjectName.trim(), newProjectNiche)
      if (created) {
        const success = await onSave(created.id)
        if (success) {
          toast.success(`Created project and saved ${assetType}!`)
          onClose()
        }
      } else {
        toast.error('Could not create project.')
      }
    } catch {
      toast.error('Operation failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleSelectAndSave = async (projectId: string) => {
    setSaving(true)
    try {
      const success = await onSave(projectId)
      if (success) {
        toast.success(`Saved to project successfully!`)
        onClose()
      } else {
        toast.error('Failed to save to project.')
      }
    } catch {
      toast.error('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl border p-6 shadow-2xl relative overflow-hidden animate-scale-in"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-display font-bold text-lg text-primary flex items-center gap-2">
            <FolderPlus size={20} className="text-brand" /> Save {assetType}
          </h3>
          <button onClick={onClose} className="btn-ghost w-8 h-8 p-0 rounded-lg flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        {saving ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand mb-3" size={32} />
            <p className="text-sm font-semibold text-secondary">Saving asset to project...</p>
          </div>
        ) : showCreateForm ? (
          /* Create project form */
          <form onSubmit={handleCreateAndSave} className="flex flex-col gap-4">
            <div>
              <label className="label">New Project Name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Psychology Hacks Channel"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="label">Niche / Category</label>
              <select
                className="select"
                value={newProjectNiche}
                onChange={e => setNewProjectNiche(e.target.value)}
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
                onClick={() => setShowCreateForm(false)}
              >
                Back to list
              </button>
              <button
                type="submit"
                className="btn-primary py-2 px-5 text-sm"
              >
                Create & Save
              </button>
            </div>
          </form>
        ) : (
          /* Projects selector list */
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">CHOOSE PROJECT</span>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-xs font-bold hover:underline flex items-center gap-1"
                style={{ color: 'var(--brand)' }}
              >
                <Plus size={14} /> Create New
              </button>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="animate-spin text-brand" size={24} />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-xl" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm text-secondary mb-3">No projects created yet.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-secondary py-1.5 px-4 text-xs inline-flex items-center gap-1.5"
                >
                  <Plus size={14} /> Create Your First Project
                </button>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto flex flex-col gap-1.5 pr-1">
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectAndSave(project.id)}
                    className="flex items-center justify-between p-3 rounded-xl border text-left text-sm font-medium hover:bg-surface transition-all w-full"
                    style={{
                      background: 'var(--card)',
                      borderColor: 'var(--border)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-primary truncate font-bold">{project.name}</p>
                      <p className="text-[10px] text-muted truncate mt-0.5">Niche: {project.niche}</p>
                    </div>
                    <span className="text-xs shrink-0 px-2 py-0.5 rounded-md bg-surface text-muted border ml-2">
                      {project.titles.length + (project.description ? 1 : 0) + project.thumbnail_concepts.length + (project.script_outline ? 1 : 0)} assets
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
