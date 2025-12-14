import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRepositories } from '@/hooks/useRepositories'
import { useRepositorySearch } from '@/hooks/useRepositorySearch'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { RepositoryList } from '@/components/dashboard/RepositoryList'

/**
 * 대시보드 페이지 - 저장소 목록 표시
 * 컨테이너 컴포넌트: 비즈니스 로직과 데이터 관리
 */
function DashboardPage() {
  const navigate = useNavigate()

  // 커스텀 훅으로 데이터 페칭 로직 분리 (TanStack Query 기반 - 자동 캐싱)
  const { repositories, isLoading, error, refresh } = useRepositories()

  // 검색 로직 분리
  const { searchQuery, setSearchQuery, filteredRepositories } = useRepositorySearch(repositories)

  // 이벤트 핸들러
  const handleStartLearning = (repoId: number) => {
    navigate({ to: `/repo/${repoId}/commits` })
  }

  const handleRefresh = async () => {
    await refresh()
  }

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        repositoryCount={Array.isArray(repositories) ? repositories.length : 0}
      />

      <RepositoryList
        repositories={filteredRepositories}
        isLoading={isLoading}
        error={error}
        searchQuery={searchQuery}
        onStartLearning={handleStartLearning}
      />
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})
