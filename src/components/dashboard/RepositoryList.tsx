import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { GitBranch, AlertTriangle } from 'lucide-react'
import { RepositoryCard } from './RepositoryCard'
import type { Repository } from '@/lib/api'

interface RepositoryListProps {
  repositories: Repository[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  onStartLearning: (repoId: number) => void
}

export function RepositoryList({
  repositories,
  isLoading,
  error,
  searchQuery,
  onStartLearning,
}: RepositoryListProps) {
  // 로딩 상태
  if (isLoading && !error) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white border-gray-200">
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-5 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-8 w-24 bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <Card className="border-red-500 bg-red-50 text-red-800">
        <CardContent className="py-6 px-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm font-medium">
            <p>데이터를 로드하는 데 실패했습니다.</p>
            <p className="text-xs font-normal opacity-90">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 빈 상태
  if (repositories.length === 0) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="py-12 text-center">
          <GitBranch className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-900 font-medium mb-2">
            {searchQuery ? '검색 결과가 없습니다' : 'GitHub 저장소가 없습니다'}
          </p>
          <p className="text-sm text-gray-600">
            {searchQuery
              ? '검색어를 변경해보세요'
              : '먼저 GitHub 인증을 완료하거나 저장소를 생성해주세요'}
          </p>
        </CardContent>
      </Card>
    )
  }

  // 저장소 목록
  return (
    <div className="space-y-3">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} onStartLearning={onStartLearning} />
      ))}
    </div>
  )
}
