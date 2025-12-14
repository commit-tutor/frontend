import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authApi, repoApi, queryKeys } from '@/lib/api'
import type { UserResponse } from '@/lib/api'

// 사용자 인터페이스
interface User {
  id: string
  username: string
  email: string | null
  avatarUrl: string
  needsOnboarding: boolean
}

// 사용자 프로필 인터페이스 (온보딩 데이터)
interface UserProfile {
  interests: string[]
  goalLevel: string
  dailyCommitGoal: number
  dailyQuizGoal: number
}

// AuthContext 타입
interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (code: string) => Promise<boolean>
  logout: () => void
  updateProfile: (profile: UserProfile) => void
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider Props
interface AuthProviderProps {
  children: ReactNode
}

// AuthProvider 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기화: localStorage에서 사용자 정보 복원
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('github_token')
        const userData = localStorage.getItem('user_data')

        if (token && userData) {
          const parsedUser = JSON.parse(userData) as User
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Auth 초기화 실패:', error)
        // 손상된 데이터 제거
        localStorage.removeItem('github_token')
        localStorage.removeItem('user_data')
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  /**
   * 로그인 처리
   * @param code - GitHub에서 받은 authorization code
   * @returns needs_onboarding 값 (온보딩 필요 여부)
   */
  const login = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // 백엔드 API 호출: code를 token으로 교환
      const response: UserResponse = await authApi.githubCallback(code)

      // localStorage에 저장
      localStorage.setItem('github_token', response.github_token)
      localStorage.setItem(
        'user_data',
        JSON.stringify({
          id: response.id,
          username: response.username,
          email: response.email,
          avatarUrl: response.avatar_url,
          needsOnboarding: response.needs_onboarding,
        }),
      )

      // state 업데이트
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        avatarUrl: response.avatar_url,
        needsOnboarding: response.needs_onboarding,
      })

      // 저장소 목록을 백그라운드에서 미리 가져와 캐시에 저장
      // 사용자가 Dashboard로 이동했을 때 즉시 표시되도록
      queryClient.prefetchQuery({
        queryKey: queryKeys.repositories,
        queryFn: repoApi.getRepositories,
        staleTime: 10 * 60 * 1000, // 10분 동안 유효
      })

      return response.needs_onboarding
    } catch (error) {
      console.error('로그인 실패:', error)
      // 에러 발생 시 저장된 데이터 정리
      localStorage.removeItem('github_token')
      localStorage.removeItem('user_data')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 로그아웃 처리
   */
  const logout = () => {
    // localStorage 정리
    localStorage.removeItem('github_token')
    localStorage.removeItem('user_data')

    // state 초기화
    setUser(null)
    setProfile(null)

    // TanStack Query 캐시 초기화
    queryClient.clear()

    // 홈으로 리다이렉트
    window.location.href = '/'
  }

  /**
   * 프로필 업데이트 (온보딩 완료 후)
   * @param newProfile - 새로운 프로필 데이터
   */
  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)

    // user의 needsOnboarding을 false로 업데이트
    if (user) {
      const updatedUser = { ...user, needsOnboarding: false }
      setUser(updatedUser)
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
    }

    // TODO: 백엔드에 프로필 저장 API 호출
    console.log('프로필 업데이트:', newProfile)
  }

  // Context 값
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

/**
 * useAuth Hook
 * AuthContext를 사용하기 위한 커스텀 훅
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  }

  return context
}
