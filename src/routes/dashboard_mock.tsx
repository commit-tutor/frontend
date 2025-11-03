import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, GitBranch, Star, ExternalLink, Link as LinkIcon } from 'lucide-react'

// Mock data - TODO: Replace with actual API call
const MOCK_REPOSITORIES = [
  {
    id: '1',
    name: 'awesome-project',
    description: 'A really awesome project with React and TypeScript',
    language: 'TypeScript',
    stars: 42,
    isConnected: true,
    updatedAt: '2025-10-25',
  },
  {
    id: '2',
    name: 'backend-api',
    description: 'REST API built with Node.js and Express',
    language: 'JavaScript',
    stars: 15,
    isConnected: false,
    updatedAt: '2025-10-20',
  },
  {
    id: '3',
    name: 'python-ml',
    description: 'Machine learning experiments',
    language: 'Python',
    stars: 8,
    isConnected: false,
    updatedAt: '2025-10-18',
  },
]

function DashboardPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading] = useState(false)
  const [repositories] = useState(MOCK_REPOSITORIES)

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  )

  const handleConnectRepo = (repoId: string) => {
    // TODO: API call to connect repository
    console.log('Connecting repository:', repoId)
  }

  const handleStartLearning = (repoId: string) => {
    navigate({ to: `/repo/${repoId}/commits_mock` })
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">저장소</h1>
        <p className="text-sm text-gray-600">학습할 GitHub 저장소를 선택하세요</p>
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
      {/* Repository List */}
      <div className="space-y-3">
        {isLoading ? (
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
              <p className="text-gray-900 font-medium mb-2">저장소를 찾을 수 없습니다</p>
              <p className="text-sm text-gray-600">
                {searchQuery ? '검색어를 변경해보세요' : 'GitHub 저장소가 없거나 권한이 필요합니다'}
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
                      {repo.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {repo.description || '설명 없음'}
                    </CardDescription>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <Badge variant="outline" className="text-xs">
                    {repo.language}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stars}
                  </span>
                  <span>업데이트: {repo.updatedAt}</span>
                </div>

                {repo.isConnected ? (
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
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard_mock')({
  component: DashboardPage,
})
