import { useState, useEffect, useCallback } from 'react'
import { repoApi } from '@/lib/api'

interface UseBranchesReturn {
  branches: string[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * 특정 저장소의 브랜치 목록을 가져오고 관리하는 커스텀 훅
 * @param repoId - 저장소 ID 또는 'owner/repo' 형식
 */
export function useBranches(repoId: string | number): UseBranchesReturn {
  const [branches, setBranches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBranches = useCallback(async () => {
    if (!repoId) {
      setError('저장소 ID가 필요합니다.')
      setIsLoading(false)
      return
    }

    console.log('🌿 브랜치 목록 요청 - Repo ID:', repoId)
    setIsLoading(true)
    setError(null)
    setBranches([])

    try {
      const data = await repoApi.getBranches(repoId)
      console.log('✅ 브랜치 목록 받음:', data)
      setBranches(data)
    } catch (err) {
      console.error('❌ 브랜치 목록 에러:', err)
      setError(err instanceof Error ? err.message : '브랜치 목록을 가져오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [repoId])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  return {
    branches,
    isLoading,
    error,
    refresh: fetchBranches,
  }
}
