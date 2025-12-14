import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { repoApi, queryKeys, type Repository, type Commit } from '@/lib/api'
import { GitBranch, Code2, BookOpen, AlertCircle, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export function RecentCommitsTab() {
  const navigate = useNavigate()
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)

  const { data: repositories, isLoading: isLoadingRepos } = useQuery({
    queryKey: queryKeys.repositories,
    queryFn: () => repoApi.getRepositories(),
  })

  const {
    data: commits,
    isLoading: isLoadingCommits,
    refetch,
  } = useQuery({
    queryKey: selectedRepo
      ? queryKeys.commits(selectedRepo.id, selectedRepo.default_branch)
      : ['commits', 'none'],
    queryFn: () => repoApi.getCommits(selectedRepo!.id, selectedRepo!.default_branch),
    enabled: !!selectedRepo,
  })

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ko })
    } catch {
      return dateString
    }
  }

  const getLearningValueColor = (value: string) => {
    switch (value) {
      case 'high':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getLearningValueText = (value: string) => {
    switch (value) {
      case 'high':
        return '⭐ 높음'
      case 'medium':
        return '⭐ 중간'
      case 'low':
        return '⭐ 낮음'
      default:
        return '⭐ 알 수 없음'
    }
  }

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
            저장소 선택
          </CardTitle>
          <CardDescription>
            최근 커밋을 확인할 저장소를 선택하세요 (총 {repositories.length}개)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {repositories.slice(0, 6).map((repo) => (
              <Button
                key={repo.id}
                variant={selectedRepo?.id === repo.id ? 'default' : 'outline'}
                className={`h-auto flex-col items-start p-4 ${
                  selectedRepo?.id === repo.id
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedRepo(repo)}
              >
                <div className="text-left w-full">
                  <p className="font-semibold truncate">{repo.name}</p>
                  <p className="text-xs opacity-70 mt-1 truncate">
                    {repo.owner_login}/{repo.name}
                  </p>
                  {repo.language && (
                    <Badge
                      variant="outline"
                      className={`mt-2 text-xs ${
                        selectedRepo?.id === repo.id ? 'bg-white/20 border-white/30 text-white' : ''
                      }`}
                    >
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

      {selectedRepo && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-purple-600" />
                  최근 커밋
                </CardTitle>
                <CardDescription>
                  {selectedRepo.full_name} • {selectedRepo.default_branch} 브랜치
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoadingCommits}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingCommits ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingCommits ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : !commits || commits.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">최근 커밋이 없습니다</p>
              </div>
            ) : (
              <>
                {commits.slice(0, 10).map((commit) => (
                  <div
                    key={commit.sha}
                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        commit.isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {commit.isCompleted ? (
                        <BookOpen className="h-5 w-5" />
                      ) : (
                        <GitBranch className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{commit.message}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {commit.author} • {formatDate(commit.date)}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <Badge variant="outline" className="text-xs">
                          {commit.filesChanged}개 파일
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs text-green-600 border-green-200"
                        >
                          +{commit.additions}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                          -{commit.deletions}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getLearningValueColor(commit.learningValue)}`}
                        >
                          {getLearningValueText(commit.learningValue)}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {commit.isCompleted ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                          >
                            ✅ 학습 완료
                          </Badge>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => {
                                // 퀴즈 생성 페이지로 이동 (커밋 SHA 전달)
                                navigate({
                                  to: '/dashboard',
                                  search: { commit: commit.sha },
                                })
                              }}
                            >
                              <Code2 className="h-3 w-3 mr-1" />
                              퀴즈 생성
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => {
                                // 리뷰 페이지로 이동
                                navigate({
                                  to: '/dashboard',
                                  search: { commit: commit.sha, action: 'review' },
                                })
                              }}
                            >
                              <BookOpen className="h-3 w-3 mr-1" />
                              리뷰 받기
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedRepo && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <GitBranch className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                위에서 저장소를 선택하면 최근 커밋을 볼 수 있습니다
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
