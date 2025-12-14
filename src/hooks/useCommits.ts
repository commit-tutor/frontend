import { useQuery } from '@tanstack/react-query'
import { repoApi, queryKeys, type Commit } from '@/lib/api'

interface UseCommitsReturn {
  commits: Commit[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * 특정 저장소의 특정 브랜치 커밋 목록을 가져오고 관리하는 커스텀 훅
 * TanStack Query를 사용하여 브랜치별 자동 캐싱 및 재사용
 *
 * @param repoId - 저장소 ID 또는 'owner/repo' 형식
 * @param branch - 브랜치 이름 (예: 'main', 'develop')
 */
export function useCommits(repoId: string | number, branch: string): UseCommitsReturn {
  const {
    data: commits = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.commits(repoId, branch),
    queryFn: () => repoApi.getCommits(repoId, branch),
    staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 가비지 컬렉션 방지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 새로고침 비활성화
    refetchOnMount: false, // 컴포넌트 마운트 시 캐시 우선
    enabled: !!repoId && !!branch, // repoId와 branch가 있을 때만 쿼리 실행
  })

  const refresh = async () => {
    await refetch()
  }

  return {
    commits,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : '커밋 목록을 가져오는데 실패했습니다.'
      : null,
    refresh,
  }
}
