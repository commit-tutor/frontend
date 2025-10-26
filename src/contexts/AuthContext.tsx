import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  email: string
  avatarUrl: string
  githubToken?: string
}

interface UserProfile {
  interests: string[]
  goalLevel: string
  dailyCommitGoal: number
  dailyQuizGoal: number
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  updateProfile: (profile: UserProfile) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Check for stored auth token and validate it
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('github_token')
        if (token) {
          // TODO: Validate token and fetch user data
          // Mock user data for development
          setUser({
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            avatarUrl: 'https://github.com/ghost.png',
            githubToken: token,
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (token: string) => {
    try {
      setIsLoading(true)
      localStorage.setItem('github_token', token)

      // TODO: Fetch user data from backend
      // Mock user data for now
      setUser({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        avatarUrl: 'https://github.com/ghost.png',
        githubToken: token,
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('github_token')
    setUser(null)
    setProfile(null)
  }

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)
    // TODO: Save to backend
  }

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
