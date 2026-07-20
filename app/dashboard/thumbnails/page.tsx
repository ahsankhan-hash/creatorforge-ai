'use client'

import { useState } from 'react'
import { Image as ImageIcon, Sparkles, FolderPlus, RefreshCw, AlertCircle, Eye } from 'lucide-react'
import { SaveToProjectModal } from '@/components/dashboard/SaveToProjectModal'
import { updateProject, ThumbnailConcept } from '@/lib/supabase/projectHelper'
import toast from 'react-hot-toast'

export default function ThumbnailGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [concepts, setConcepts] = useState<ThumbnailConcept[]>([])
  const [error, setError] = useState<string | null>(null)

  // Save modal states
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a video topic or title.')
      return
    }

    setLoading(true)
    setError(null)
    setConcepts([])

    try {
      const response = await fetch('/api/generate/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate thumbnail concepts.')
      }

      const data = await response.json()
      if (data.concepts && Array.isArray(data.concepts)) {
        setConcepts(data.concepts)
        toast.success('Generated thumbnail concepts!')
      } else {
        throw new Error('Invalid response format.')
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
      toast.error('Failed to generate concepts.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToProject = async (projectId: string): Promise<boolean> => {
    if (concepts.length === 0) return false
    try {
      // Add or merge thumbnail concepts to project
      const updated = await updateProject(projectId, { thumbnail_concepts: concepts })
      return !!updated
    } catch {
      return false
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
            <ImageIcon size={20} />
          </span>
          AI Thumbnail Idea Generator
        </h1>
        <p className="text-sm text-secondary mt-1">
          Draft high-CTR visual structures for your videos, rendered as real-time color blocks and composition drafts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Panel */}
        <div
          className="card p-6 lg:col-span-1"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <form onSubmit={handleGenerate} className="flex flex-col gap-5">
            <div>
              <label className="label">Video Topic or Proposed Title</label>
              <textarea
                className="input h-32 resize-none leading-relaxed"
                placeholder="e.g. Inside the mind of a dark psychologist: 3 tricks to read people instantly..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 mt-2 flex justify-center gap-2"
              disabled={loading || !topic.trim()}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Draft Concept Layouts
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {loading ? (
            /* Loading skeletons with simulated cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(idx => (
                <div
                  key={idx}
                  className="card overflow-hidden flex flex-col min-h-[350px]"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="aspect-video w-full skeleton" />
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="h-5 w-2/3 skeleton rounded-lg" />
                    <div className="h-3 w-full skeleton rounded-md" />
                    <div className="h-3 w-3/4 skeleton rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl border text-center flex flex-col items-center gap-3 bg-red-500/5 border-red-500/20 text-red-400">
              <AlertCircle size={32} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => handleGenerate()} className="btn-secondary text-xs px-4 py-2 mt-2">
                Retry
              </button>
            </div>
          ) : concepts.length === 0 ? (
            /* Empty state */
            <div
              className="p-12 text-center border-2 border-dashed rounded-3xl flex flex-col items-center gap-4 animate-fade-in"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand/10 text-brand">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-primary">Concept Preview Canvas</h3>
                <p className="text-sm text-secondary mt-1 max-w-sm mx-auto">
                  Type your video theme on the left to output detailed visual frameworks and preview CSS color cards.
                </p>
              </div>
            </div>
          ) : (
            /* Results Panel */
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Visual Layouts
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSaveModalOpen(true)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-brand/10 border border-brand/20 text-brand hover:bg-brand/20 transition-all flex items-center gap-1.5"
                  >
                    <FolderPlus size={13} /> Save Batch to Project
                  </button>
                  <button
                    onClick={() => handleGenerate()}
                    className="text-xs font-semibold hover:underline flex items-center gap-1 text-primary hover:text-brand"
                  >
                    <RefreshCw size={12} /> Re-Generate
                  </button>
                </div>
              </div>

              {/* Grid of CSS mock cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {concepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="card overflow-hidden flex flex-col h-full hover:shadow-float"
                    style={{
                      background: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {/* Visual 16:9 CSS placeholder mockup */}
                    <div
                      className="aspect-video w-full relative flex items-center justify-center overflow-hidden border-b border-t shadow-inner select-none"
                      style={{
                        backgroundColor: concept.styleColors.bg,
                        borderColor: concept.styleColors.border,
                      }}
                    >
                      {/* Grid background simulation */}
                      <div className="absolute inset-0 opacity-10 bg-radial-grid pointer-events-none"
                        style={{
                          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                        }}
                      />

                      {/* Mock overlay element (silhouettes / icons placeholder) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <ImageIcon size={64} style={{ color: concept.styleColors.border }} />
                      </div>

                      {/* Glowing ambient ring */}
                      <div
                        className="absolute w-24 h-24 rounded-full blur-xl opacity-60 animate-glow-pulse"
                        style={{ background: concept.styleColors.border }}
                      />

                      {/* Big visual Text Overlay */}
                      <div
                        className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg font-display font-black text-lg tracking-wider shadow-lg transform rotate-[-2deg] border"
                        style={{
                          backgroundColor: concept.styleColors.bg,
                          borderColor: concept.styleColors.border,
                          color: concept.styleColors.text,
                        }}
                      >
                        {concept.textOverlay}
                      </div>

                      {/* Mock UI preview indicator */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold text-white bg-black/40 backdrop-blur-xs flex items-center gap-1">
                        <Eye size={9} /> PREVIEW
                      </div>
                    </div>

                    {/* Meta detailed content */}
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <div>
                        <h3 className="font-display font-bold text-base text-primary flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                            style={{ background: concept.styleColors.border }}
                          />
                          {concept.name}
                        </h3>
                        <p className="text-[10px] text-muted font-mono mt-0.5 uppercase tracking-wide">
                          Color Theme: {concept.styleColors.bg} / {concept.styleColors.border}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="text-xs">
                          <span className="font-semibold text-secondary uppercase text-[9px] tracking-wide block">Color Scheme Mood</span>
                          <span className="text-primary leading-normal">{concept.colorMood}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-semibold text-secondary uppercase text-[9px] tracking-wide block">Composition & Framing</span>
                          <span className="text-primary leading-normal">{concept.composition}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-semibold text-secondary uppercase text-[9px] tracking-wide block">Details & Visual Props</span>
                          <span className="text-primary leading-normal">{concept.visuals}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <SaveToProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveToProject}
        assetType="thumbnail"
      />
    </div>
  )
}
