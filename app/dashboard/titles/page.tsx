'use client'

import { useState } from 'react'
import { Sparkles, Copy, FolderPlus, RefreshCw, Type, AlertCircle, Check } from 'lucide-react'
import { SaveToProjectModal } from '@/components/dashboard/SaveToProjectModal'
import { addTitleToProject } from '@/lib/supabase/projectHelper'
import toast from 'react-hot-toast'

interface GeneratedTitle {
  title: string
  style: string
  explanation: string
}

export default function TitleGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('General')
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState<GeneratedTitle[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Save modal states
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [selectedTitleToSave, setSelectedTitleToSave] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a video topic or idea.')
      return
    }

    setLoading(true)
    setError(null)
    setTitles([])

    try {
      const response = await fetch('/api/generate/titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), niche }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate titles.')
      }

      const data = await response.json()
      if (data.titles && Array.isArray(data.titles)) {
        setTitles(data.titles)
        toast.success('Generated titles successfully!')
      } else {
        throw new Error('Invalid response format.')
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
      toast.error('Failed to generate titles.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const triggerSaveModal = (title: string) => {
    setSelectedTitleToSave(title)
    setIsSaveModalOpen(true)
  }

  const handleSaveToProject = async (projectId: string): Promise<boolean> => {
    if (!selectedTitleToSave) return false
    try {
      const success = await addTitleToProject(projectId, selectedTitleToSave)
      return success
    } catch {
      return false
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
            <Type size={20} />
          </span>
          AI Title Generator
        </h1>
        <p className="text-sm text-secondary mt-1">
          Generate highly clickable, viral YouTube titles optimized for search hooks.
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
              <label className="label">What is your video about?</label>
              <textarea
                className="input h-32 resize-none leading-relaxed"
                placeholder="e.g. 5 psychological hacks that immediately increase confidence in social situations..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">Select Video Niche</label>
              <select
                className="select"
                value={niche}
                onChange={e => setNiche(e.target.value)}
                disabled={loading}
              >
                <option value="General">General Niche</option>
                <option value="Psychology">Psychology / Mindset</option>
                <option value="Senior Health">Senior Health / Longevity</option>
                <option value="Faith-based">Faith-based / Spiritual</option>
                <option value="Dark/Philosophical">Dark Philosophy / Stoicism</option>
              </select>
              <p className="text-[10px] text-muted mt-1.5 leading-normal">
                Tuning the niche customizes the hooks to fit specific viewer expectations.
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 mt-2 flex justify-center gap-2"
              disabled={loading || !topic.trim()}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate Titles
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Results Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {loading ? (
            /* Loading states skeleton cards */
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map(idx => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border flex flex-col gap-2.5"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="h-4 w-20 skeleton rounded-full" />
                  <div className="h-5 w-3/4 skeleton rounded-lg" />
                  <div className="h-3 w-1/2 skeleton rounded-md" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl border text-center flex flex-col items-center gap-3 bg-red-500/5 border-red-500/20 text-red-400">
              <AlertCircle size={32} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => handleGenerate()} className="btn-secondary text-xs px-4 py-2 mt-2">
                Retry Generation
              </button>
            </div>
          ) : titles.length === 0 ? (
            /* Empty state */
            <div
              className="p-12 text-center border-2 border-dashed rounded-3xl flex flex-col items-center gap-4"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand/10 text-brand">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-primary">Awaiting your idea</h3>
                <p className="text-sm text-secondary mt-1 max-w-sm mx-auto">
                  Type your video topic on the left panel and click Generate to see high-converting title options.
                </p>
              </div>
            </div>
          ) : (
            /* Results batch list */
            <div className="flex flex-col gap-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  GENERATED BATCH ({titles.length})
                </span>
                <button
                  onClick={() => handleGenerate()}
                  className="text-xs font-semibold hover:underline flex items-center gap-1 text-primary hover:text-brand transition-colors"
                >
                  <RefreshCw size={12} /> Regenerate Batch
                </button>
              </div>

              {titles.map((item, idx) => (
                <div
                  key={idx}
                  className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="badge badge-brand capitalize">{item.style} Hook</span>
                      <span className="text-[10px] text-muted truncate">{item.explanation}</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-primary leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(item.title, idx)}
                      className="w-9 h-9 rounded-xl border flex items-center justify-center btn-ghost"
                      title="Copy to clipboard"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {copiedIndex === idx ? (
                        <Check size={15} className="text-success" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                    <button
                      onClick={() => triggerSaveModal(item.title)}
                      className="w-9 h-9 rounded-xl border flex items-center justify-center btn-ghost"
                      title="Save to project"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <FolderPlus size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Project Modal */}
      <SaveToProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveToProject}
        assetType="title"
      />
    </div>
  )
}
