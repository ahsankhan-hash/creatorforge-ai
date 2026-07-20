'use client'

import { useState } from 'react'
import { FileText, Sparkles, Copy, FolderPlus, RefreshCw, AlertCircle, Check } from 'lucide-react'
import { SaveToProjectModal } from '@/components/dashboard/SaveToProjectModal'
import { updateProject } from '@/lib/supabase/projectHelper'
import toast from 'react-hot-toast'

interface DescriptionData {
  hook: string
  summary: string
  timestamps: Array<{ time: string; label: string }>
  hashtags: string[]
  cta: string
}

export default function DescriptionGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState('Professional')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DescriptionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Save modal states
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Helper to compile description into a standard plain text layout
  const compileDescriptionText = (desc: DescriptionData) => {
    if (!desc) return ''
    const timestampsText = desc.timestamps
      .map(t => `${t.time} - ${t.label}`)
      .join('\n')
    const hashtagsText = desc.hashtags.join(' ')

    return `${desc.hook}

${desc.summary}

TIMESTAMPS:
${timestampsText}

RESOURCES & CONNECT:
${desc.cta}

${hashtagsText}`
  }

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a video topic or summary.')
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch('/api/generate/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), keywords: keywords.trim(), tone }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate description.')
      }

      const result = await response.json()
      if (result.hook && result.summary) {
        setData(result)
        toast.success('Generated description successfully!')
      } else {
        throw new Error('Invalid response format.')
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
      toast.error('Failed to generate description.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!data) return
    const text = compileDescriptionText(data)
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied entire description to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveToProject = async (projectId: string): Promise<boolean> => {
    if (!data) return false
    const text = compileDescriptionText(data)
    try {
      const updated = await updateProject(projectId, { description: text })
      return !!updated
    } catch {
      return false
    }
  }

  const compiledText = data ? compileDescriptionText(data) : ''
  const characterCount = compiledText.length

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
            <FileText size={20} />
          </span>
          Description Studio
        </h1>
        <p className="text-sm text-secondary mt-1">
          Draft optimized YouTube SEO descriptions containing hook, outline chapters, resources, and hashtags.
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
              <label className="label">Video Topic / Core Theme</label>
              <textarea
                className="input h-28 resize-none leading-relaxed"
                placeholder="e.g. How dark psychology shapes daily social interactions..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">Target Keywords (Optional)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. social hacking, brain tricks, influence"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">Select Narrative Tone</label>
              <select
                className="select"
                value={tone}
                onChange={e => setTone(e.target.value)}
                disabled={loading}
              >
                <option value="Professional">Professional / Informative</option>
                <option value="Excited">Energetic / Hype</option>
                <option value="Curious">Mysterious / Suspenseful</option>
                <option value="Friendly">Casual / Warm</option>
              </select>
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
                  <Sparkles size={16} /> Generate Description
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {loading ? (
            /* Loading Shimmer state */
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-6 w-32 skeleton rounded-md" />
              <div className="card p-6 flex flex-col gap-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="h-4 w-1/4 skeleton rounded-md" />
                <div className="h-20 w-full skeleton rounded-lg" />
                <div className="h-4 w-1/5 skeleton rounded-md" />
                <div className="h-28 w-full skeleton rounded-lg" />
              </div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl border text-center flex flex-col items-center gap-3 bg-red-500/5 border-red-500/20 text-red-400">
              <AlertCircle size={32} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => handleGenerate()} className="btn-secondary text-xs px-4 py-2 mt-2">
                Retry
              </button>
            </div>
          ) : !data ? (
            /* Empty State */
            <div
              className="p-12 text-center border-2 border-dashed rounded-3xl flex flex-col items-center gap-4"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand/10 text-brand">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-primary">Drafting Area</h3>
                <p className="text-sm text-secondary mt-1 max-w-sm mx-auto">
                  Provide your topic and optional target search terms on the left to output structured SEO content.
                </p>
              </div>
            </div>
          ) : (
            /* Result display */
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Description Preview
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${characterCount > 4500 ? 'bg-red-500/10 text-red-400' : 'badge-brand'}`}>
                    {characterCount} / 5000 chars
                  </span>
                  <button
                    onClick={() => handleGenerate()}
                    className="text-xs font-semibold hover:underline flex items-center gap-1 text-primary hover:text-brand transition-colors"
                  >
                    <RefreshCw size={12} /> Regenerate
                  </button>
                </div>
              </div>

              {/* Render structure cards for preview */}
              <div className="flex flex-col gap-4">
                {/* Hook and body */}
                <div className="card p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <span className="text-[10px] font-bold tracking-wider text-brand uppercase block mb-2">Hook Introduction</span>
                  <p className="text-sm font-semibold text-primary leading-relaxed">{data.hook}</p>
                  
                  <span className="text-[10px] font-bold tracking-wider text-brand uppercase block mt-5 mb-2">Detailed Summary</span>
                  <p className="text-xs text-secondary leading-relaxed whitespace-pre-line">{data.summary}</p>
                </div>

                {/* Timestamps */}
                <div className="card p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <span className="text-[10px] font-bold tracking-wider text-brand uppercase block mb-3">Chapter Roadmap (Timestamps)</span>
                  <div className="flex flex-col gap-2">
                    {data.timestamps.map((t, idx) => (
                      <div key={idx} className="flex gap-4 text-xs font-medium border-b pb-1.5 last:border-0 last:pb-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-mono text-brand shrink-0">{t.time}</span>
                        <span className="text-primary truncate">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA and Hashtags */}
                <div className="card p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <span className="text-[10px] font-bold tracking-wider text-brand uppercase block mb-2">Resources & CTA</span>
                  <p className="text-xs text-secondary leading-relaxed mb-4">{data.cta}</p>

                  <span className="text-[10px] font-bold tracking-wider text-brand uppercase block mb-2">Hashtags</span>
                  <div className="flex flex-wrap gap-2">
                    {data.hashtags.map(tag => (
                      <span key={tag} className="badge badge-brand text-[10px]">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Global actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsSaveModalOpen(true)}
                    className="btn-secondary py-3 px-6 text-sm flex items-center gap-2"
                  >
                    <FolderPlus size={16} /> Save to Project
                  </button>
                  <button
                    onClick={handleCopy}
                    className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Entire Text'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <SaveToProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveToProject}
        assetType="description"
      />
    </div>
  )
}
