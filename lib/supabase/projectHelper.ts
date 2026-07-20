import { createClient, isSupabaseConfigured } from './client'
import { getCurrentUser } from './authHelper'

export interface ThumbnailConcept {
  name: string
  colorMood: string
  composition: string
  visuals: string
  textOverlay: string
  styleColors: {
    bg: string
    border: string
    text: string
  }
}

export interface ScriptOutline {
  hook: string
  sections: Array<{
    heading: string
    bullets: string[]
  }>
  outro: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  niche: string
  status: string
  titles: string[]
  description: string
  thumbnail_concepts: ThumbnailConcept[]
  script_outline: ScriptOutline | null
  created_at: string
  updated_at: string
}

// LocalStorage key constants
const PROJECTS_LOCAL_KEY = 'cf_local_projects'

export async function getProjects(): Promise<Project[]> {
  const user = await getCurrentUser()
  if (!user) return []

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects from Supabase:', error)
      return []
    }
    return (data || []) as Project[]
  } else {
    // LocalStorage Fallback
    const localProjects = localStorage.getItem(PROJECTS_LOCAL_KEY) || '[]'
    const projects = JSON.parse(localProjects) as Project[]
    // Filter by current user
    return projects
      .filter(p => p.user_id === user.id)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  const user = await getCurrentUser()
  if (!user) return null

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching project ${id} from Supabase:`, error)
      return null
    }
    return data as Project
  } else {
    const projects = await getProjects()
    return projects.find(p => p.id === id) || null
  }
}

export async function createProject(name: string, niche: string = 'General'): Promise<Project | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const newProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
    user_id: user.id,
    name,
    niche,
    status: 'active',
    titles: [],
    description: '',
    thumbnail_concepts: [],
    script_outline: null,
  }

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select()
      .single()

    if (error) {
      console.error('Error creating project in Supabase:', error)
      return null
    }
    return data as Project
  } else {
    // LocalStorage
    const localProjects = localStorage.getItem(PROJECTS_LOCAL_KEY) || '[]'
    const projects = JSON.parse(localProjects) as Project[]
    
    const projectWithId: Project = {
      ...newProject,
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    projects.push(projectWithId)
    localStorage.setItem(PROJECTS_LOCAL_KEY, JSON.stringify(projects))
    return projectWithId
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const cleanUpdates = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating project ${id} in Supabase:`, error)
      return null
    }
    return data as Project
  } else {
    // LocalStorage
    const localProjects = localStorage.getItem(PROJECTS_LOCAL_KEY) || '[]'
    let projects = JSON.parse(localProjects) as Project[]
    
    const index = projects.findIndex(p => p.id === id && p.user_id === user.id)
    if (index === -1) return null

    const updatedProject = {
      ...projects[index],
      ...cleanUpdates,
      updated_at: new Date().toISOString(),
    } as Project

    projects[index] = updatedProject
    localStorage.setItem(PROJECTS_LOCAL_KEY, JSON.stringify(projects))
    return updatedProject
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting project ${id} from Supabase:`, error)
      return false
    }
    return true
  } else {
    // LocalStorage
    const localProjects = localStorage.getItem(PROJECTS_LOCAL_KEY) || '[]'
    const projects = JSON.parse(localProjects) as Project[]
    
    const filtered = projects.filter(p => !(p.id === id && p.user_id === user.id))
    localStorage.setItem(PROJECTS_LOCAL_KEY, JSON.stringify(filtered))
    return true
  }
}

// Add title to a specific project helper
export async function addTitleToProject(projectId: string, title: string): Promise<boolean> {
  const project = await getProjectById(projectId)
  if (!project) return false

  const updatedTitles = [...(project.titles || [])]
  if (!updatedTitles.includes(title)) {
    updatedTitles.push(title)
  }

  const result = await updateProject(projectId, { titles: updatedTitles })
  return !!result;
}
