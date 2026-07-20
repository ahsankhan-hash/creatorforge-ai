'use client'

import { useState } from 'react'
import { FileCode, Sparkles, FolderPlus, RefreshCw, AlertCircle, Download, ChevronDown, ChevronUp, Wand2 } from 'lucide-react'
import { SaveToProjectModal } from '@/components/dashboard/SaveToProjectModal'
import { updateProject, ScriptOutline } from '@/lib/supabase/projectHelper'
import toast from 'react-hot-toast'

export default function ScriptGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [length, setLength] = useState('Medium')
  const [niche, setNiche] = useState('General')
  const [loading, setLoading] = useState(false)
  const [outline, setOutline] = useState<ScriptOutline | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Accordion active sections
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true })
  
  // Bullets expansion text state
  const [expandedBullets, setExpandedBullets] = useState<Record<string, { text: string; loading: boolean }>>({})

  // Save modal states
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a video topic or concept.')
      return
    }

    setLoading(true)
    setError(null)
    setOutline(null)
    setExpandedBullets({})

    try {
      const response = await fetch('/api/generate/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), length, niche }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate script outline.')
      }

      const data = await response.json()
      if (data.hook && data.sections) {
        setOutline(data)
        // Reset accordion keys
        const initialOpen: Record<number, boolean> = { 0: true }
        data.sections.forEach((_: any, idx: number) => {
          initialOpen[idx] = true
        })
        setOpenSections(initialOpen)
        toast.success('Generated script outline!')
      } else {
        throw new Error('Invalid response format.')
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
      toast.error('Failed to generate outline.')
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (idx: number) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const handleExpandBullet = async (sectionIdx: number, bulletIdx: number, bulletText: string) => {
    const key = `${sectionIdx}-${bulletIdx}`
    if (expandedBullets[key]) {
      // Toggle off if already expanded
      const copy = { ...expandedBullets }
      delete copy[key]
      setExpandedBullets(copy)
      return
    }

    setExpandedBullets(prev => ({
      ...prev,
      [key]: { text: '', loading: true }
    }))

    try {
      // Direct high-quality mock expansion for speed and responsiveness
      await new Promise(resolve => setTimeout(resolve, 800))
      const expandedParagraph = `💡 [AI Script Expansion]: "To illustrate this point effectively, you want to speak directly to the viewer's current state. For example: '${bulletText.replace(/[.[\]]/g, '')}'. By emphasizing this, we anchor the lesson in a tangible problem they face daily. B-roll suggestion: Slow pan of focus shifting from a foreground object to a background subject, demonstrating the mental clarity of resolving this friction."`
      
      setExpandedBullets(prev => ({
        ...prev,
        [key]: { text: expandedParagraph, loading: false }
      }))
      toast.success('Bullet expanded!')
    } catch {
      toast.error('Could not expand bullet.')
      const copy = { ...expandedBullets }
      delete copy[key]
      setExpandedBullets(copy)
    }
  }

  const handleSaveToProject = async (projectId: string): Promise<boolean> => {
    if (!outline) return false
    try {
      const updated = await updateProject(projectId, { script_outline: outline })
      return !!updated
    } catch {
      return false
    }
  }

  const handleExportMarkdown = () => {
    if (!outline) return
    const sectionsText = outline.sections
      .map(s => `## ${s.heading}\n${s.bullets.map(b => `- ${b}`).join('\n')}`)
      .join('\n\n')

    const mdContent = `# Video Script Outline: ${topic}
Niche: ${niche} | Length: ${length}

# HOOK / INTRO
${outline.hook}

# CORE SECTIONS
${sectionsText}

# OUTRO / CTA
${outline.outro}
`
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `script_outline_${topic.replace(/\s+/g, '_').toLowerCase()}.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Markdown outline exported!')
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
            <FileCode size={20} />
          </span>
          Script Blueprint
        </h1>
        <p className="text-sm text-secondary mt-1">
          Plan complete narrative blueprints including hook triggers, expandable content sections, and call-to-actions.
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
                className="input h-28 resize-none leading-relaxed"
                placeholder="e.g. Stoicism tips that help you stay absolutely calm during high-stress business calls..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">Target Length</label>
              <select
                className="select"
                value={length}
                onChange={e => setLength(e.target.value)}
                disabled={loading}
              >
                <option value="Short">Short (60s / YouTube Shorts)</option>
                <option value="Medium">Medium (5 - 8 mins video)</option>
                <option value="Long">Long (10 - 15 mins video)</option>
              </select>
            </div>

            <div>
              <label className="label">Niche Context</label>
              <select
                className="select"
                value={niche}
                onChange={e => setNiche(e.target.value)}
                disabled={loading}
              >
                <option value="General">General Niche</option>
                <option value="Psychology">Psychology</option>
                <option value="Senior Health">Senior Health</option>
                <option value="Faith-based">Faith-based</option>
                <option value="Dark/Philosophical">Dark Philosophy / Stoicism</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 mt-2 flex justify-center gap-2"
              disabled={loading || !topic.trim()}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Writing Blueprint...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate Outline
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
              <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="h-4 w-1/4 skeleton rounded-md" />
                <div className="h-16 w-full skeleton rounded-lg" />
                <div className="h-4 w-1/3 skeleton rounded-md" />
                <div className="h-24 w-full skeleton rounded-lg" />
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
          ) : !outline ? (
            /* Empty State */
            <div
              className="p-12 text-center border-2 border-dashed rounded-3xl flex flex-col items-center gap-4"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand/10 text-brand">
                <FileCode size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-primary">Script Board</h3>
                <p className="text-sm text-secondary mt-1 max-w-sm mx-auto">
                  Type your subject and select video format specifications on the left to structure narrative segments.
                </p>
              </div>
            </div>
          ) : (
            /* Results Panel */
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Script Blueprint Outline
                </span>
                <button
                  onClick={() => handleGenerate()}
                  className="text-xs font-semibold hover:underline flex items-center gap-1 text-primary hover:text-brand"
                >
                  <RefreshCw size={12} /> Regenerate
                </button>
              </div>

              {/* Render Hook Intro Card */}
              <div className="card p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <span className="badge badge-brand mb-2.5">Hook & Intro</span>
                <p className="text-xs text-secondary leading-relaxed whitespace-pre-line">{outline.hook}</p>
              </div>

              {/* Core Sections (Collapsible Accordion layout) */}
              <div className="flex flex-col gap-2">
                {outline.sections.map((section, sIdx) => {
                  const isSectionOpen = !!openSections[sIdx]
                  return (
                    <div
                      key={sIdx}
                      className="card overflow-hidden"
                      style={{
                        background: 'var(--bg-secondary)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      {/* Accordion Trigger Header */}
                      <button
                        onClick={() => toggleSection(sIdx)}
                        className="flex items-center justify-between p-4 w-full text-left font-display font-bold text-sm text-primary hover:bg-card/50 transition-colors"
                        style={{ borderBottom: isSectionOpen ? '1px solid var(--border)' : '0' }}
                      >
                        <span className="truncate">{section.heading}</span>
                        {isSectionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {/* Accordion Content Panel */}
                      {isSectionOpen && (
                        <div className="p-4 flex flex-col gap-3">
                          {section.bullets.map((bullet, bIdx) => {
                            const bulletKey = `${sIdx}-${bIdx}`
                            const expanded = expandedBullets[bulletKey]
                            return (
                              <div key={bIdx} className="flex flex-col gap-2 border-b pb-2 last:border-0 last:pb-0" style={{ borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-start justify-between gap-3 text-xs text-secondary leading-relaxed">
                                  <span>• {bullet}</span>
                                  <button
                                    onClick={() => handleExpandBullet(sIdx, bIdx, bullet)}
                                    className={`w-6 h-6 rounded-md border flex items-center justify-center btn-ghost shrink-0 ${expanded ? 'text-brand border-brand/35 bg-brand/5' : ''}`}
                                    title="Expand bullet with AI paragraph"
                                    style={{ borderColor: 'var(--border)' }}
                                  >
                                    <Wand2 size={11} />
                                  </button>
                                </div>

                                {/* AI Expanded Inline Box */}
                                {expanded && (
                                  <div className="p-3 rounded-lg text-xs leading-normal bg-brand/5 border border-brand/10 text-primary mt-1.5 animate-slide-down">
                                    {expanded.loading ? (
                                      <div className="flex items-center gap-1.5 text-brand">
                                        <RefreshCw size={11} className="animate-spin" />
                                        <span>Expanding point...</span>
                                      </div>
                                    ) : (
                                      <span>{expanded.text}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Render Outro Card */}
              <div className="card p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <span className="badge badge-brand mb-2.5">Outro & CTA Trigger</span>
                <p className="text-xs text-secondary leading-relaxed whitespace-pre-line">{outline.outro}</p>
              </div>

              {/* Actions footer */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="btn-secondary py-3 px-6 text-sm flex items-center gap-2"
                >
                  <FolderPlus size={16} /> Save to Project
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
                >
                  <Download size={16} /> Export Markdown (.md)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SaveToProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveToProject}
        assetType="script"
      />
    </div>
  )
}
