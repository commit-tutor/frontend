import { useState, useMemo } from 'react'
import type { Repository } from '@/lib/api'

interface UseRepositorySearchReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredRepositories: Repository[]
}

/**
 * 저장소 검색 기능을 제공하는 커스텀 훅
 */
export function useRepositorySearch(repositories: Repository[]): UseRepositorySearchReturn {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRepositories = useMemo(() => {
    if (!searchQuery.trim()) {
      return repositories
    }

    const query = searchQuery.toLowerCase()
    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        false,
    )
  }, [repositories, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    filteredRepositories,
  }
}
