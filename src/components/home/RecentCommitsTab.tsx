import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { repoApi, queryKeys } from '@/lib/api'
import { GitBranch } from 'lucide-react'

export function RecentCommitsTab() {
  const navigate = useNavigate()

  const { data: repositoriesData, isLoading: isLoadingRepos } = useQuery({
    queryKey: queryKeys.repositories,
    queryFn: () => repoApi.getRepositories(),
  })

  // 배열이 아닌 경우 빈 배열로 변환 (안전성 보장)
  const repositories = Array.isArray(repositoriesData) ? repositoriesData : []

  if (isLoadingRepos) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!repositories || repositories.length === 0) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <GitBranch className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">연동된 GitHub 저장소가 없습니다</p>
            <Button size="sm" className="mt-4" onClick={() => navigate({ to: '/dashboard' })}>
              저장소 연동하기
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            저장소
          </CardTitle>
          <CardDescription>
            저장소를 클릭하여 커밋 목록을 확인하세요 (총 {repositories.length}개)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {repositories.slice(0, 6).map((repo) => (
              <Button
                key={repo.id}
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate({ to: `/repo/${repo.id}/commits` })}
              >
                <div className="text-left w-full">
                  <p className="font-semibold truncate">{repo.name}</p>
                  <p className="text-xs opacity-70 mt-1 truncate">
                    {repo.owner_login}/{repo.name}
                  </p>
                  {repo.language && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {repo.language}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
          {repositories.length > 6 && (
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() => navigate({ to: '/dashboard' })}
            >
              전체 저장소 보기 ({repositories.length}개)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
