import { createClient, isSupabaseConfigured } from './client'
import { getCurrentUser } from './authHelper'

export interface CalendarEntry {
  id: string
  user_id: string
  date: string // YYYY-MM-DD format
  title: string
  status: 'Idea' | 'Scripting' | 'Filming' | 'Editing' | 'Published'
  project_id?: string | null
}

const CALENDAR_LOCAL_KEY = 'cf_local_calendar'

export async function getCalendarEntries(): Promise<CalendarEntry[]> {
  const user = await getCurrentUser()
  if (!user) return []

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('calendar_entries')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching calendar entries from Supabase:', error)
      return []
    }
    return (data || []) as CalendarEntry[]
  } else {
    // LocalStorage Fallback
    const localEntries = localStorage.getItem(CALENDAR_LOCAL_KEY) || '[]'
    const entries = JSON.parse(localEntries) as CalendarEntry[]
    return entries.filter(e => e.user_id === user.id)
  }
}

export async function addCalendarEntry(entry: Omit<CalendarEntry, 'id' | 'user_id'>): Promise<CalendarEntry | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const newEntry = {
    ...entry,
    user_id: user.id
  }

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('calendar_entries')
      .insert([newEntry])
      .select()
      .single()

    if (error) {
      console.error('Error adding calendar entry to Supabase:', error)
      return null
    }
    return data as CalendarEntry
  } else {
    // LocalStorage
    const localEntries = localStorage.getItem(CALENDAR_LOCAL_KEY) || '[]'
    const entries = JSON.parse(localEntries) as CalendarEntry[]
    
    const entryWithId: CalendarEntry = {
      ...newEntry,
      id: Math.random().toString(36).substring(2, 15),
    }

    entries.push(entryWithId)
    localStorage.setItem(CALENDAR_LOCAL_KEY, JSON.stringify(entries))
    return entryWithId
  }
}

export async function updateCalendarEntry(id: string, updates: Partial<CalendarEntry>): Promise<CalendarEntry | null> {
  const user = await getCurrentUser()
  if (!user) return null

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('calendar_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating calendar entry ${id} in Supabase:`, error)
      return null
    }
    return data as CalendarEntry
  } else {
    // LocalStorage
    const localEntries = localStorage.getItem(CALENDAR_LOCAL_KEY) || '[]'
    let entries = JSON.parse(localEntries) as CalendarEntry[]

    const index = entries.findIndex(e => e.id === id && e.user_id === user.id)
    if (index === -1) return null

    const updatedEntry = {
      ...entries[index],
      ...updates
    } as CalendarEntry

    entries[index] = updatedEntry
    localStorage.setItem(CALENDAR_LOCAL_KEY, JSON.stringify(entries))
    return updatedEntry
  }
}

export async function deleteCalendarEntry(id: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { error } = await supabase
      .from('calendar_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting calendar entry ${id} from Supabase:`, error)
      return false
    }
    return true
  } else {
    // LocalStorage
    const localEntries = localStorage.getItem(CALENDAR_LOCAL_KEY) || '[]'
    const entries = JSON.parse(localEntries) as CalendarEntry[]

    const filtered = entries.filter(e => !(e.id === id && e.user_id === user.id))
    localStorage.setItem(CALENDAR_LOCAL_KEY, JSON.stringify(filtered))
    return true
  }
}
