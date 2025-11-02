import { createFileRoute, useNavigate } from '@tanstack/react-router'
import apiClient from '@/lib/api'
import { useState, useEffect } from 'react' // useEffect 추가
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  GitBranch,
  Star,
  ExternalLink,
  Link as LinkIcon,
  AlertTriangle,
} from 'lucide-react' // AlertTriangle 아이콘 추가

// --- 1. Repository 데이터 타입 정의 (백엔드 응답 구조 기반) ---
// 백엔드 (repo.py)의 process_repositories_data 함수에서 반환하는 구조를 따릅니다.
interface Repository {
  id: string
  name: string
  full_name: string // GitHub 링크 생성 및 API 호출에 사용
  owner_login: string
  private: boolean
  fork: boolean
  description: string | null
  language: string | null
  default_branch: string
  updated_at: string
  stars: number
  isConnected: boolean // Commit Tutor와의 연결 상태
}

// FastAPI 백엔드 주소 (개발 환경에 따라 다를 수 있음)
const API_BASE_URL = 'http://localhost:8000/api/v1/repo/get_repo'

function DashboardPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // MOCK_REPOSITORIES를 제거하고 실제 상태를 사용하도록 변경
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태를 true로 시작
  const [error, setError] = useState<string | null>(null) // 에러 상태 추가

  // --- 2. API 호출 함수 구현 ---
  const fetchRepositories = async () => {
    setIsLoading(true)
    setError(null)
    setRepositories([])

    try {
      const response = await fetch(API_BASE_URL)

      if (!response.ok) {
        // 백엔드에서 401(토큰 오류)이나 404/500(API 오류)를 보낼 경우
        let errorDetail = response.statusText
        try {
          // FastAPI에서 HTTPException을 보낼 경우 JSON 본문을 파싱하여 상세 에러 메시지를 얻습니다.
          const errorData = await response.json()
          errorDetail = errorData.detail || errorDetail
        } catch (e) {
          // JSON 파싱 실패 시 기본 응답 텍스트 사용
        }
        throw new Error(`저장소 로딩 실패: ${response.status} - ${errorDetail}`)
      }

      const data: Repository[] = await response.json()
      setRepositories(data)
    } catch (err) {
      // 네트워크 오류 또는 기타 예외
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // --- 3. 컴포넌트 마운트 시 데이터 로드 ---
  useEffect(() => {
    fetchRepositories()
    // 의존성 배열이 비어있으므로 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.
  }, [])

  // --- 4. 필터링 로직은 그대로 유지 ---
  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  )

  const handleStartLearning = (repoId: string) => {
    navigate({ to: `/repo/${repoId}/commits` })
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">저장소</h1>
          <p className="text-sm text-gray-600">학습할 GitHub 저장소를 선택하세요</p>
        </div>
        <Button
          onClick={fetchRepositories}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2 text-xs border-gray-300"
        >
          <GitBranch className={`h-4 w-4 ${isLoading ? `animate-spin` : ``}`} />
          {isLoading ? '로딩 중...' : '새로고침'}
        </Button>
      </div>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
        <Input
          placeholder="저장소 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
        />
      </div>
      {/* Error Message Display */}
      {error && (
        <Card className="border-red-500 bg-red-50 text-red-800">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm font-medium">
              <p>데이터를 로드하는 데 실패했습니다.</p>
              <p className="text-xs font-normal opacity-90">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Repository List */}
      <div className="space-y-3">
        {isLoading && !error ? (
          // Loading Skeleton
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white border-gray-200">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-full bg-gray-200" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 bg-gray-200" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : filteredRepos.length === 0 ? (
          // Empty State
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12 text-center">
              <GitBranch className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-900 font-medium mb-2">
                {error
                  ? 'API 연결에 문제가 있습니다.'
                  : searchQuery
                    ? '검색어를 변경해보세요'
                    : 'GitHub 저장소가 없거나 권한이 필요합니다'}
              </p>
              <p className="text-sm text-gray-600">
                {error
                  ? '백엔드 서버 상태와 GitHub 토큰을 확인하세요.'
                  : '먼저 GitHub 인증을 완료해야 합니다.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          // Repository Cards
          filteredRepos.map((repo) => (
            <Card
              key={repo.id}
              className="bg-white border-gray-200 hover:border-gray-300 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base text-gray-900 flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      {/* GitHub 레포 링크로 연결 */}
                      <a
                        href={`https://github.com/${repo.full_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        {repo.name}
                      </a>
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {repo.description || '설명 없음'}
                    </CardDescription>
                  </div>
                  {/* GitHub 외부 링크 아이콘 */}
                  <a
                    href={`https://github.com/${repo.full_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                  </a>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <Badge variant="outline" className="text-xs">
                    {repo.language || 'N/A'}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {repo.stars}
                  </span>
                  <span>업데이트: {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>

                {
                  <Button
                    onClick={() => handleStartLearning(repo.id)}
                    className="w-full bg-gray-900 text-white hover:bg-gray-800"
                  >
                    학습하기
                  </Button>
                  /* {repo.isConnected ? (
                  <Button
                    onClick={() => handleStartLearning(repo.id)}
                    className="w-full bg-gray-900 text-white hover:bg-gray-800"
                  >
                    학습하기
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnectRepo(repo.id)}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    연결하기
                  </Button>
                )} */
                }
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})
