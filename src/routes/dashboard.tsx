import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { repoApi, type Repository } from '@/lib/api'
import { useState, useEffect } from 'react'
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
  AlertTriangle,
} from 'lucide-react'

function DashboardPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API 호출 함수 - repoApi 사용
  const fetchRepositories = async () => {
    setIsLoading(true)
    setError(null)
    setRepositories([])

    try {
      const data = await repoApi.getRepositories()
      setRepositories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchRepositories()
  }, [])

  // --- 4. 필터링 로직은 그대로 유지 ---
  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  )

  const handleStartLearning = (repoId: number) => {
    navigate({ to: `/repo/${repoId}/commits_mock` })
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
                  <span>업데이트: {new Date(repo.updated_at).toLocaleDateString()}</span>
                  <span className="text-xs text-gray-500">
                    {repo.private ? '🔒 Private' : '📖 Public'}
                  </span>
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
