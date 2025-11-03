import { useState, useEffect, useCallback } from 'react'
import { repoApi, type Repository } from '@/lib/api'

interface UseRepositoriesReturn {
  repositories: Repository[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * 저장소 목록을 가져오고 관리하는 커스텀 훅
 */
export function useRepositories(): UseRepositoriesReturn {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRepositories = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchRepositories()
  }, [fetchRepositories])

  return {
    repositories,
    isLoading,
    error,
    refresh: fetchRepositories,
  }
}
