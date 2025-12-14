import { useQuery } from '@tanstack/react-query'
import { repoApi, queryKeys, type Repository } from '@/lib/api'

interface UseRepositoriesReturn {
  repositories: Repository[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * 저장소 목록을 가져오고 관리하는 커스텀 훅
 * TanStack Query를 사용하여 자동 캐싱 및 재사용
 */
export function useRepositories(): UseRepositoriesReturn {
  const {
    data: repositoriesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.repositories,
    queryFn: repoApi.getRepositories,
    staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 가비지 컬렉션 방지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 새로고침 비활성화
    refetchOnMount: false, // 컴포넌트 마운트 시 자동 새로고침 비활성화 (캐시 우선)
  })

  // 배열이 아닌 경우 빈 배열로 변환 (안전성 보장)
  const repositories = Array.isArray(repositoriesData) ? repositoriesData : []

  const refresh = async () => {
    await refetch()
  }

  return {
    repositories,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.'
      : null,
    refresh,
  }
}
