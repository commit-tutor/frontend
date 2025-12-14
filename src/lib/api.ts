import axios, { AxiosError } from 'axios'

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  },
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
  },
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

export type Repository = {
  id: number
  name: string
  full_name: string
  owner_login: string
  private: boolean
  fork: boolean
  description: string | null
  language: string | null
  default_branch: string
  updated_at: string
}

export type Commit = {
  sha: string
  message: string
  author: string
  date: string
  filesChanged: number
  additions: number
  deletions: number
  learningValue: 'high' | 'medium' | 'low'
  isCompleted: boolean
}

// Learning API Types
export type QuizQuestion = {
  id: string
  type: 'multiple' | 'short'
  question: string
  codeContext?: string
  options?: string[]
  correctAnswer: number | string
  explanation?: string
}

export type LearningTopic = {
  id: string
  title: string
  description: string
  keywords: string[]
}

export type TopicExtractionRequest = {
  commitShas: string[]
}

export type TopicExtractionResponse = {
  topics: LearningTopic[]
  metadata?: {
    totalCommits: number
    extractedCount: number
    extractedAt: string
  }
}

export type QuizGenerationRequest = {
  commitShas: string[]
  questionCount?: number
  selectedTopic?: string
}

export type QuizGenerationResponse = {
  questions: QuizQuestion[]
  metadata?: {
    totalCommits: number
    requestedCount: number
    generatedCount: number
    generatedAt: string
  }
}

export type CodeQuality = {
  readability: number
  performance: number
  security: number
}

export type AIAnalysis = {
  summary: string
  quality: CodeQuality
  suggestions: string[]
  potentialBugs: string[]
}

export type CodeAnalysisRequest = {
  commitSha: string
  focusAreas?: string[]
}

export type CommitDiffInfo = {
  filename: string
  status: string
  additions: number
  deletions: number
  patch?: string
}

export type CommitDetailResponse = {
  sha: string
  message: string
  author: string
  date: string
  filesChanged: number
  additions: number
  deletions: number
  files: CommitDiffInfo[]
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

// Repository API
export const repoApi = {
  /**
   * 사용자의 저장소 목록 조회
   */
  getRepositories: async (): Promise<Repository[]> => {
    const response = await apiClient.get<Repository[]>('/repo/get_repo')
    return response.data
  },

  /**
   * 특정 저장소의 커밋 목록 조회
   * @param repoIdentifier - 저장소 ID 또는 'owner/repo' 형식
   * @param branch - 브랜치 이름 (기본값: main)
   */
  getCommits: async (repoIdentifier: string | number, branch = 'main'): Promise<Commit[]> => {
    const response = await apiClient.get<Commit[]>(`/repo/${repoIdentifier}/commits`, {
      params: { branch },
    })
    return response.data
  },

  /**
   * 특정 저장소의 브랜치 목록 조회
   * @param repoIdentifier - 저장소 ID 또는 'owner/repo' 형식
   */
  getBranches: async (repoIdentifier: string | number): Promise<string[]> => {
    const response = await apiClient.get<string[]>(`/repo/${repoIdentifier}/branches`)
    return response.data
  },

  /**
   * 특정 커밋의 상세 정보 (diff 포함) 조회
   * @param repoIdentifier - 저장소 ID 또는 'owner/repo' 형식
   * @param commitSha - 커밋 SHA
   */
  getCommitDetails: async (
    repoIdentifier: string | number,
    commitSha: string,
  ): Promise<CommitDetailResponse> => {
    const response = await apiClient.get<CommitDetailResponse>(
      `/repo/${repoIdentifier}/commits/${commitSha}/details`,
    )
    return response.data
  },
}

// Learning API
export const learningApi = {
  /**
   * 커밋에서 학습 가능한 주제 추출
   * @param request - 주제 추출 요청 (커밋 SHA 목록)
   * @returns 추출된 학습 주제 목록
   */
  extractTopics: async (request: TopicExtractionRequest): Promise<TopicExtractionResponse> => {
    const response = await apiClient.post<TopicExtractionResponse>('/learning/topics', request)
    return response.data
  },

  /**
   * 선택한 커밋들로 퀴즈 생성
   * @param request - 퀴즈 생성 요청 (커밋 SHA 목록, 개수, 선택된 주제)
   */
  generateQuiz: async (request: QuizGenerationRequest): Promise<QuizGenerationResponse> => {
    const response = await apiClient.post<QuizGenerationResponse>('/learning/quiz', request)
    return response.data
  },

  /**
   * 커밋 기반 학습 퀴즈 생성
   * @param request - 퀴즈 생성 요청 (커밋 SHA 목록, 개수, 선택된 주제)
   * @returns 퀴즈와 커밋 정보
   */
  generateLearningSession: async (
    request: QuizGenerationRequest,
  ): Promise<{
    quiz: QuizGenerationResponse
    commitInfo: CommitDetailResponse
  }> => {
    const response = await apiClient.post('/learning/session', request)
    return response.data
  },
}

// 나의 퀴즈 API Types
export type QuizSaveRequest = {
  title: string
  description?: string
  commit_shas: string[]
  repository_info?: Record<string, any>
  question_count: number
  selected_topic?: string
  questions: QuizQuestion[]
}

export type QuizSubmitRequest = {
  user_answers: Record<string, any>
  duration_seconds?: number | null
}

export type MyQuizResponse = {
  id: number
  title: string
  description?: string
  commit_shas: string[]
  repository_info?: Record<string, any>
  question_count: number
  selected_topic?: string
  questions: QuizQuestion[]
  is_completed: boolean
  completed_at?: string
  score?: number
  correct_answers?: number
  wrong_answers?: number
  duration_seconds?: number
  created_at: string
  updated_at?: string
}

export type QuizListResponse = {
  quizzes: MyQuizResponse[]
  total: number
  completed: number
  pending: number
}

export type QuizSubmitResponse = {
  quiz_id: number
  score: number
  correct_answers: number
  wrong_answers: number
  is_passed: boolean
  feedback?: string
}

/**
 * 나의 퀴즈 API
 */
export const myQuizApi = {
  /**
   * 퀴즈 저장
   */
  saveQuiz: async (request: QuizSaveRequest): Promise<MyQuizResponse> => {
    const response = await apiClient.post<MyQuizResponse>('/my-quiz', request)
    return response.data
  },

  /**
   * 나의 퀴즈 목록 조회
   */
  getMyQuizzes: async (params?: {
    is_completed?: boolean
    limit?: number
    offset?: number
  }): Promise<QuizListResponse> => {
    const response = await apiClient.get<QuizListResponse>('/my-quiz', { params })
    return response.data
  },

  /**
   * 특정 퀴즈 조회
   */
  getQuizById: async (quizId: number): Promise<MyQuizResponse> => {
    const response = await apiClient.get<MyQuizResponse>(`/my-quiz/${quizId}`)
    return response.data
  },

  /**
   * 퀴즈 제출
   */
  submitQuiz: async (quizId: number, request: QuizSubmitRequest): Promise<QuizSubmitResponse> => {
    const response = await apiClient.post<QuizSubmitResponse>(`/my-quiz/${quizId}/submit`, request)
    return response.data
  },

  /**
   * 퀴즈 삭제
   */
  deleteQuiz: async (quizId: number): Promise<void> => {
    await apiClient.delete(`/my-quiz/${quizId}`)
  },
}

// Query Keys - TanStack Query 캐시 키 상수
export const queryKeys = {
  repositories: ['repositories'] as const,
  commits: (repoId: string | number, branch: string) => ['commits', repoId, branch] as const,
  branches: (repoId: string | number) => ['branches', repoId] as const,
  commitDetails: (repoId: string | number, sha: string) => ['commitDetails', repoId, sha] as const,
  myQuizzes: (isCompleted?: boolean) => ['myQuizzes', isCompleted] as const,
  myQuiz: (quizId: number) => ['myQuiz', quizId] as const,
}

export default apiClient
