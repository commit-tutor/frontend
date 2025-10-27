import axios, { AxiosError } from 'axios'

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초
})

// Request Interceptor: 모든 요청에 JWT 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('github_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: 에러 핸들링
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401 Unauthorized - 토큰 만료 또는 무효
    if (error.response?.status === 401) {
      localStorage.removeItem('github_token')
      localStorage.removeItem('user_data')
      window.location.href = '/'
    }

    // 에러 메시지 처리
    const errorMessage =
      (error.response?.data as { detail?: string })?.detail ||
      error.message ||
      '알 수 없는 오류가 발생했습니다.'

    return Promise.reject(new Error(errorMessage))
  }
)

// 타입 정의
export type GitHubCallbackRequest = {
  code: string
}

export type UserResponse = {
  id: string
  username: string
  email: string | null
  avatar_url: string
  github_token: string
  needs_onboarding: boolean
}

export type LoginURLResponse = {
  auth_url: string
}

// Auth API
export const authApi = {
  /**
   * GitHub OAuth 로그인 URL 가져오기
   */
  getGithubLoginUrl: async (): Promise<LoginURLResponse> => {
    const response = await apiClient.get<LoginURLResponse>('/auth/github/login')
    return response.data
  },

  /**
   * GitHub OAuth 콜백 처리
   * @param code - GitHub에서 받은 authorization code
   */
  githubCallback: async (code: string): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/auth/github/callback', {
      code,
    })
    return response.data
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/auth/me')
    return response.data
  },
}

export default apiClient
