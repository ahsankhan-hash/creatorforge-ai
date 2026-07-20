import { createClient, isSupabaseConfigured } from './client'

export interface CreatorUser {
  id: string
  email: string
  created_at: string
}

// Cookie helper to set/delete cookies client-side for mock session integration with middleware
function setCookie(name: string, value: string, days?: number) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

function deleteCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export async function loginUser(email: string, password: string): Promise<{ user: CreatorUser | null; error: string | null }> {
  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) return { user: null, error: error.message }
    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at,
        },
        error: null,
      }
    }
    return { user: null, error: 'User session not created.' }
  } else {
    // Mock Authentication
    const usersJson = localStorage.getItem('cf_mock_users') || '[]'
    const users = JSON.parse(usersJson) as Array<any>
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    
    if (!user) {
      return { user: null, error: 'Invalid email or password.' }
    }

    const sessionUser: CreatorUser = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    }

    // Persist session to localStorage and set middleware cookie
    localStorage.setItem('cf_current_user', JSON.stringify(sessionUser))
    setCookie('cf-mock-auth', JSON.stringify(sessionUser), 7)

    return { user: sessionUser, error: null }
  }
}

export async function signupUser(email: string, password: string): Promise<{ user: CreatorUser | null; error: string | null }> {
  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) return { user: null, error: error.message }
    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at,
        },
        error: null,
      }
    }
    return { user: null, error: 'Signup succeeded but no user was returned. Please verify your email.' }
  } else {
    // Mock Signup
    const usersJson = localStorage.getItem('cf_mock_users') || '[]'
    const users = JSON.parse(usersJson) as Array<any>
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (exists) {
      return { user: null, error: 'An account with this email already exists.' }
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      email: email.toLowerCase(),
      password: password,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem('cf_mock_users', JSON.stringify(users))

    const sessionUser: CreatorUser = {
      id: newUser.id,
      email: newUser.email,
      created_at: newUser.created_at,
    }

    // Log the user in directly after signup
    localStorage.setItem('cf_current_user', JSON.stringify(sessionUser))
    setCookie('cf-mock-auth', JSON.stringify(sessionUser), 7)

    return { user: sessionUser, error: null }
  }
}

export async function logoutUser(): Promise<{ error: string | null }> {
  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) return { error: error.message }
    return { error: null }
  } else {
    localStorage.removeItem('cf_current_user')
    deleteCookie('cf-mock-auth')
    return { error: null }
  }
}

export async function getCurrentUser(): Promise<CreatorUser | null> {
  if (isSupabaseConfigured) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
      }
    }
    return null
  } else {
    const userStr = localStorage.getItem('cf_current_user')
    if (userStr) {
      try {
        return JSON.parse(userStr) as CreatorUser
      } catch {
        return null
      }
    }
    return null
  }
}
