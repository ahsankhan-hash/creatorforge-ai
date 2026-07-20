'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  FolderHeart,
  ArrowLeft,
  Loader2,
  Trash2,
  Copy,
  Edit3,
  Check,
  Type,
  FileText,
  Image as ImageIcon,
  FileCode,
  AlertCircle,
  Download,
  Plus
} from 'lucide-react'
import { getProjectById, updateProject, deleteProject, createProject, Project } from '@/lib/supabase/projectHelper'
import toast from 'react-hot-toast'

export default function ProjectDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Edit states
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedNiche, setEditedNiche] = useState('')
  const [editedDesc, setEditedDesc] = useState('')
  const [hasUnsavedDesc, setHasUnsavedDesc] = useState(false)

  const fetchProject = async () => {
    setLoading(true)
    try {
      const data = await getProjectById(id)
      if (data) {
        setProject(data)
        setEditedName(data.name)
        setEditedNiche(data.niche)
        setEditedDesc(data.description || '')
      } else {
        toast.error('Project folder not found.')
        router.push('/dashboard/projects')
      }
    } catch {
      toast.error('Failed to load project details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const handleUpdateNameAndNiche = async () => {
    if (!editedName.trim()) {
      toast.error('Project name cannot be empty.')
      return
    }

    setSaving(true)
    try {
      const updated = await updateProject(id, {
        name: editedName.trim(),
        niche: editedNiche,
      })
      if (updated) {
        setProject(updated)
        setIsEditingName(false)
        toast.success('Project details updated!')
      }
    } catch {
      toast.error('Failed to save details.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDescription = async () => {
    setSaving(true)
    try {
      const updated = await updateProject(id, { description: editedDesc })
      if (updated) {
        setProject(updated)
        setHasUnsavedDesc(false)
        toast.success('Description saved!')
      }
    } catch {
      toast.error('Failed to save description.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!project) return
    if (!confirm(`Confirm deletion of project "${project.name}"? All saved assets will be deleted.`)) {
      return
    }

    try {
      const success = await deleteProject(id)
      if (success) {
        toast.success('Project deleted.')
        router.push('/dashboard/projects')
      } else {
        toast.error('Could not delete project.')
      }
    } catch {
      toast.error('Failed to delete.')
    }
  }

  const handleDuplicateProject = async () => {
    if (!project) return
    setSaving(true)
    try {
      const duplicated = await createProject(`Copy of ${project.name}`, project.niche)
      if (duplicated) {
        // Copy other assets in
        await updateProject(duplicated.id, {
          titles: project.titles,
          description: project.description,
          thumbnail_concepts: project.thumbnail_concepts,
          script_outline: project.script_outline,
        })
        toast.success('Project folder duplicated successfully!')
        router.push(`/dashboard/projects/${duplicated.id}`)
      } else {
        toast.error('Could not duplicate project.')
      }
    } catch {
      toast.error('Failed to duplicate.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTitle = async (idxToDelete: number) => {
    if (!project) return
    const updatedTitles = project.titles.filter((_, idx) => idx !== idxToDelete)
    try {
      const updated = await updateProject(id, { titles: updatedTitles })
      if (updated) {
        setProject(updated)
        toast.success('Title removed.')
      }
    } catch {
      toast.error('Failed to remove title.')
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Navigation bar */}
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/dashboard/projects"
          className="text-xs font-semibold flex items-center gap-1.5 hover:text-brand transition-colors text-secondary"
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDuplicateProject}
            disabled={saving}
            className="btn-secondary py-1.5 px-3.5 text-xs flex items-center gap-1.5"
          >
            <Copy size={13} /> Duplicate Folder
          </button>
          <button
            onClick={handleDeleteProject}
            disabled={saving}
            className="btn-ghost py-1.5 px-3.5 text-xs border rounded-xl flex items-center gap-1.5 text-red-500 border-red-500/20 hover:bg-red-500/10"
          >
            <Trash2 size={13} /> Delete Folder
          </button>
        </div>
      </div>

      {/* Title Details Section */}
      <div className="bg-card/30 border p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
        {isEditingName ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 flex-1">
            <div className="flex-1 w-full">
              <label className="label text-[10px]">Folder Name</label>
              <input
                type="text"
                className="input py-2 text-xs"
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-44">
              <label className="label text-[10px]">Niche</label>
              <select
                className="select py-2 text-xs"
                value={editedNiche}
                onChange={e => setEditedNiche(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Psychology">Psychology</option>
                <option value="Senior Health">Senior Health</option>
                <option value="Faith-based">Faith-based</option>
                <option value="Dark/Philosophical">Dark/Philosophical</option>
              </select>
            </div>
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <button onClick={handleUpdateNameAndNiche} className="btn-primary py-2 px-4 text-xs flex items-center gap-1">
                <Check size={12} /> Save
              </button>
              <button onClick={() => setIsEditingName(false)} className="btn-secondary py-2 px-4 text-xs">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-brand text-[10px]">{project.niche} Niche</span>
              <span className="text-[10px] text-muted">Created {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
              {project.name}
              <button
                onClick={() => setIsEditingName(true)}
                className="text-muted hover:text-brand transition-colors p-1"
                title="Edit name"
              >
                <Edit3 size={16} />
              </button>
            </h1>
          </div>
        )}
      </div>

      {/* Grid of Saved Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Titles list Column */}
        <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h3 className="font-display font-bold text-base text-primary flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <Type size={18} className="text-brand" /> Saved Title Candidates
          </h3>

          {project.titles.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted">
              No title candidates saved. Generate them in the{' '}
              <Link href="/dashboard/titles" className="text-brand hover:underline font-bold">
                Title Generator
              </Link>{' '}
              to bookmark here.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {project.titles.map((title, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border bg-card text-xs text-primary font-medium"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="truncate pr-3">{title}</span>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(title)
                        toast.success('Copied title!')
                      }}
                      className="p-1 text-muted hover:text-brand transition-colors"
                      title="Copy"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteTitle(idx)}
                      className="p-1 text-muted hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visual Thumbnail Column */}
        <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h3 className="font-display font-bold text-base text-primary flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <ImageIcon size={18} className="text-accent" /> Saved Thumbnail Concepts
          </h3>

          {project.thumbnail_concepts.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted">
              No thumbnail concepts saved. Open the{' '}
              <Link href="/dashboard/thumbnails" className="text-brand hover:underline font-bold">
                Thumbnail Generator
              </Link>{' '}
              to save concepts here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.thumbnail_concepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border overflow-hidden flex flex-col bg-card"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="aspect-video w-full flex items-center justify-center relative font-display font-black text-xs border-b shadow-inner"
                    style={{ backgroundColor: concept.styleColors.bg, color: concept.styleColors.text, borderColor: concept.styleColors.border }}
                  >
                    <span>{concept.textOverlay}</span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-xs text-primary truncate">{concept.name}</h4>
                    <p className="text-[10px] text-secondary mt-1 line-clamp-2">{concept.composition}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description Column */}
        <div className="card p-6 flex flex-col gap-4 lg:col-span-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-display font-bold text-base text-primary flex items-center gap-2">
              <FileText size={18} className="text-brand" /> Saved Video Description
            </h3>
            {hasUnsavedDesc && (
              <button onClick={handleSaveDescription} className="btn-primary py-1 px-3 text-xs flex items-center gap-1">
                <Check size={12} /> Save Changes
              </button>
            )}
          </div>

          <textarea
            className="input h-60 resize-none font-mono text-xs leading-relaxed"
            placeholder="No description outline saved yet. Create one inside the Description Studio or write draft points directly here..."
            value={editedDesc}
            onChange={e => {
              setEditedDesc(e.target.value)
              setHasUnsavedDesc(true)
            }}
          />
        </div>

        {/* Script outline Column */}
        <div className="card p-6 flex flex-col gap-4 lg:col-span-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h3 className="font-display font-bold text-base text-primary flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <FileCode size={18} className="text-green-500" /> Saved Script Blueprint
          </h3>

          {!project.script_outline ? (
            <div className="text-center py-8 text-xs text-muted">
              No script outline saved. Build outlines inside the{' '}
              <Link href="/dashboard/scripts" className="text-brand hover:underline font-bold">
                Script Blueprint Generator
              </Link>.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl border bg-card/40" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-bold text-brand uppercase block mb-1">Intro Hook Cues</span>
                <p className="text-xs text-secondary leading-relaxed whitespace-pre-line">{project.script_outline.hook}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {project.script_outline.sections.map((section, idx) => (
                  <div key={idx} className="p-4 rounded-xl border bg-card flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
                    <h4 className="font-display font-bold text-xs text-primary">{section.heading}</h4>
                    <ul className="flex flex-col gap-1 text-[11px] text-secondary leading-relaxed">
                      {section.bullets.map((b, bIdx) => (
                        <li key={bIdx}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border bg-card/40" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-bold text-brand uppercase block mb-1">Outro Trigger & CTA Cues</span>
                <p className="text-xs text-secondary leading-relaxed whitespace-pre-line">{project.script_outline.outro}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
