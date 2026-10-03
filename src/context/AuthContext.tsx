import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const API_URL = '/api/auth'

interface User {
  id: number
  full_name: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signUp: (data: SignUpData) => Promise<{ success: boolean; message: string }>
  signOut: () => void
}

interface SignUpData {
  full_name: string
  email: string
  password: string
  role: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('drumgate_token'))
  const [loading, setLoading] = useState(true)

  // On mount, verify existing token
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user)
        } else {
          // Token invalid — clear it
          localStorage.removeItem('drumgate_token')
          setToken(null)
        }
      })
      .catch(() => {
        localStorage.removeItem('drumgate_token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('drumgate_token', data.token)
        setToken(data.token)
        setUser(data.user)
      }

      return { success: data.success, message: data.message }
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' }
    }
  }

  const signUp = async (signUpData: SignUpData) => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('drumgate_token', data.token)
        setToken(data.token)
        setUser(data.user)
      }

      return { success: data.success, message: data.message }
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' }
    }
  }

  const signOut = () => {
    localStorage.removeItem('drumgate_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
