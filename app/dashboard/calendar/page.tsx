'use client'

import { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  FolderOpen,
  Check,
  X,
  Loader2,
  CalendarCheck
} from 'lucide-react'
import { getCalendarEntries, addCalendarEntry, deleteCalendarEntry, CalendarEntry } from '@/lib/supabase/calendarHelper'
import { getProjects, Project } from '@/lib/supabase/projectHelper'
import toast from 'react-hot-toast'

const STATUSES = ['Idea', 'Scripting', 'Filming', 'Editing', 'Published'] as const
type StatusType = typeof STATUSES[number]

export default function ContentCalendarPage() {
  const [entries, setEntries] = useState<CalendarEntry[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Current calendar viewport date state
  const [currentDate, setCurrentDate] = useState(new Date())

  // Day inspection panel modal states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  // New entry form inputs
  const [newTitle, setNewTitle] = useState('')
  const [newStatus, setNewStatus] = useState<StatusType>('Idea')
  const [linkedProjectId, setLinkedProjectId] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [entriesData, projectsData] = await Promise.all([
        getCalendarEntries(),
        getProjects(),
      ])
      setEntries(entriesData)
      setProjects(projectsData)
    } catch {
      toast.error('Failed to load schedule data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Date utilities
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Formatting date key for simple lookup YYYY-MM-DD
  const formatDateKey = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !newTitle.trim()) {
      toast.error('Please specify a title.')
      return
    }

    const dateKey = formatDateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )

    try {
      const added = await addCalendarEntry({
        date: dateKey,
        title: newTitle.trim(),
        status: newStatus,
        project_id: linkedProjectId || null,
      })

      if (added) {
        setEntries(prev => [...prev, added])
        setNewTitle('')
        setLinkedProjectId('')
        setNewStatus('Idea')
        setIsAddFormOpen(false)
        toast.success('Scheduled successfully!')
      }
    } catch {
      toast.error('Could not schedule.')
    }
  }

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Remove this upload event?')) return

    try {
      const success = await deleteCalendarEntry(id)
      if (success) {
        setEntries(prev => prev.filter(e => e.id !== id))
        toast.success('Event removed.')
      }
    } catch {
      toast.error('Failed to remove event.')
    }
  }

  // Get status color configs
  const getStatusBadgeStyle = (status: StatusType) => {
    switch (status) {
      case 'Idea':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
      case 'Scripting':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
      case 'Filming':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
      case 'Editing':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
      case 'Published':
        return 'bg-green-500/10 text-green-500 border border-green-500/20'
      default:
        return 'bg-neutral-500/10 text-neutral-500'
    }
  }

  // Render Calendar Helper
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayIndex = getFirstDayOfMonth(currentDate) // 0-6 index
  const daysArray = Array.from({ length: daysInMonth }, (_, idx) => idx + 1)

  // Empty prepending blocks for alignment
  const blankCells = Array.from({ length: firstDayIndex }, (_, idx) => idx)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Filter entries that match currently viewed day
  const getSelectedDayEntries = () => {
    if (!selectedDate) return []
    const key = formatDateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )
    return entries.filter(e => e.date === key)
  }

  const selectedDayEntries = getSelectedDayEntries()

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
              <CalendarIcon size={20} />
            </span>
            Content Calendar
          </h1>
          <p className="text-sm text-secondary mt-1">
            Plan upload deadlines and track release checkpoints visually.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-brand" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Calendar month grid (left col) */}
          <div className="card p-6 lg:col-span-3 flex flex-col gap-5 bg-secondary border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            {/* Calendar Controls */}
            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="font-display font-bold text-lg text-primary">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center gap-1.5 border rounded-xl p-0.5" style={{ borderColor: 'var(--border)' }}>
                <button onClick={handlePrevMonth} className="btn-ghost p-1.5 rounded-lg">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={handleNextMonth} className="btn-ghost p-1.5 rounded-lg">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex flex-col gap-1 w-full overflow-x-auto select-none no-scrollbar">
              {/* Day Titles Header */}
              <div className="grid grid-cols-7 gap-1 text-center font-display font-semibold text-xs text-muted mb-2 min-w-[500px]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-7 gap-1.5 min-w-[500px]">
                {/* Prefil cells */}
                {blankCells.map(b => (
                  <div key={`blank-${b}`} className="min-h-[85px] border border-transparent opacity-0" />
                ))}

                {/* Actual Day cells */}
                {daysArray.map(day => {
                  const dateStr = formatDateKey(year, month, day)
                  const dayEntries = entries.filter(e => e.date === dateStr)
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

                  return (
                    <div
                      key={`day-${day}`}
                      onClick={() => {
                        setSelectedDate(new Date(year, month, day))
                        setIsAddFormOpen(false)
                      }}
                      className={`cal-day ${isToday ? 'today' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[11px] font-bold ${isToday ? 'text-brand' : 'text-primary'}`}>{day}</span>
                        {dayEntries.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        )}
                      </div>

                      {/* Display small titles/dots for entry summaries */}
                      <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar max-h-[55px]">
                        {dayEntries.slice(0, 2).map(entry => (
                          <div
                            key={entry.id}
                            className={`text-[8px] px-1 py-0.5 rounded-md truncate font-semibold`}
                            style={{
                              background: entry.status === 'Published' ? 'rgba(16,185,129,0.15)' : 'var(--border)',
                              color: entry.status === 'Published' ? 'var(--success)' : 'var(--text-primary)',
                            }}
                          >
                            {entry.title}
                          </div>
                        ))}
                        {dayEntries.length > 2 && (
                          <div className="text-[7px] text-muted font-bold pl-1">+{dayEntries.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Agenda & Inspect Panel (right col) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {selectedDate ? (
              <div
                className="card p-6 flex flex-col gap-4"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              >
                {/* Selected Day Header */}
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-sm text-primary">
                      {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h3>
                    <p className="text-[10px] text-muted mt-0.5">{selectedDayEntries.length} tasks scheduled</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddFormOpen(prev => !prev)
                      setNewTitle('')
                    }}
                    className="p-1.5 rounded-lg btn-ghost border shrink-0"
                    style={{ borderColor: 'var(--border)' }}
                    title="Add Entry"
                  >
                    <Plus size={14} className={isAddFormOpen ? 'rotate-45' : ''} />
                  </button>
                </div>

                {/* Add entry form overlay trigger */}
                {isAddFormOpen ? (
                  <form onSubmit={handleAddEntry} className="flex flex-col gap-3 pb-3 border-b animate-slide-down" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div>
                      <label className="label text-[10px]">Video Title / Idea</label>
                      <input
                        type="text"
                        className="input py-2 text-xs"
                        placeholder="e.g. Brain Hack Video release"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="label text-[10px]">Workflow Status</label>
                      <select
                        className="select py-2 text-xs"
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value as StatusType)}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label text-[10px]">Link Project (Optional)</label>
                      <select
                        className="select py-2 text-xs"
                        value={linkedProjectId}
                        onChange={e => setLinkedProjectId(e.target.value)}
                      >
                        <option value="">Select a Project...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        className="btn-ghost py-1 px-3 text-xs"
                        onClick={() => setIsAddFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary py-1 px-4 text-xs">
                        Save
                      </button>
                    </div>
                  </form>
                ) : null}

                {/* Entries items list */}
                {selectedDayEntries.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted">
                    No release deadlines planned for this day. Click the plus icon to schedule one.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
                    {selectedDayEntries.map(entry => {
                      const linked = projects.find(p => p.id === entry.project_id)
                      return (
                        <div
                          key={entry.id}
                          className="p-3.5 rounded-xl border bg-card/65 flex flex-col gap-2 relative group hover:border-brand/40 transition-colors"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <span className={`badge text-[9px] py-0 px-2 font-bold ${getStatusBadgeStyle(entry.status)}`}>
                              {entry.status}
                            </span>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                              title="Delete Event"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <h4 className="text-xs font-bold text-primary leading-snug">{entry.title}</h4>

                          {linked && (
                            <Link
                              href={`/dashboard/projects/${linked.id}`}
                              className="text-[9px] font-bold text-brand hover:underline flex items-center gap-1 mt-1"
                            >
                              <FolderOpen size={10} /> {linked.name}
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Default Overview sidebar */
              <div
                className="card p-6 text-center flex flex-col items-center gap-4"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              >
                <CalendarCheck size={40} className="text-muted opacity-25" />
                <div>
                  <h3 className="font-display font-bold text-base text-primary">Day Inspector</h3>
                  <p className="text-xs text-secondary mt-1">
                    Select any grid square in the calendar layout to plan uploads or verify schedules for that day.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
