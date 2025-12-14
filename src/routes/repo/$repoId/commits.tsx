import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GitCommit,
  GitBranch,
  ChevronDown,
  User,
  AlertTriangle,
  CheckSquare,
  Square,
  Info,
  RefreshCw,
} from 'lucide-react'
import { useBranches } from '@/hooks/useBranches'
import { useCommits } from '@/hooks/useCommits'

function CommitsPage() {
  const navigate = useNavigate()
  const { repoId } = Route.useParams()

  // 브랜치 목록 가져오기 (TanStack Query 기반 - 캐싱)
  const { branches, isLoading: isBranchesLoading, error: branchesError } = useBranches(repoId)

  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedCommits, setSelectedCommits] = useState<Set<string>>(new Set())

  // 커밋 목록 가져오기 (TanStack Query 기반 - 브랜치별 캐싱)
  const { commits, isLoading, error, refresh } = useCommits(repoId, selectedBranch)

  // 브랜치 목록이 로드되면 첫 번째 브랜치를 선택
  useEffect(() => {
    console.log('🌿 브랜치 목록:', branches)
    if (branches.length > 0 && !selectedBranch) {
      // main 또는 master 브랜치를 우선적으로 선택, 없으면 첫 번째 브랜치
      const defaultBranch = branches.find((b) => b === 'main' || b === 'master') || branches[0]
      console.log('✅ 기본 브랜치 선택:', defaultBranch)
      setSelectedBranch(defaultBranch)
    }
  }, [branches, selectedBranch])

  const handleBranchChange = (branch: string) => {
    console.log('🔄 브랜치 변경:', selectedBranch, '->', branch)
    setSelectedBranch(branch)
    setSelectedCommits(new Set()) // 브랜치 변경 시 선택 초기화
  }

  const handleRefresh = async () => {
    console.log('🔄 커밋 목록 새로고침')
    await refresh()
  }

  const toggleCommitSelection = (commitSha: string) => {
    setSelectedCommits((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commitSha)) {
        newSet.delete(commitSha)
      } else {
        newSet.add(commitSha)
      }
      return newSet
    })
  }

  const handleStartBatchLearning = () => {
    if (selectedCommits.size === 0) return

    // 여러 커밋을 한 번에 학습하는 세션으로 이동
    // 모든 선택된 커밋을 repoId:sha 형태로 변환
    const commitShas = Array.from(selectedCommits)
    const commitIdentifiers = commitShas.map((sha) => `${repoId}:${sha}`)

    // 여러 커밋을 쉼표로 구분하여 URL에 전달
    const commitsParam = commitIdentifiers.join(',')

    // 세션 페이지로 이동
    navigate({ to: `/session/${encodeURIComponent(commitsParam)}` })
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">커밋 목록</h1>
          <p className="text-sm text-gray-600">
            Repository ID: {repoId}
            {commits.length > 0 && ` • ${commits.length}개의 커밋`}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isLoading || !selectedBranch}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
          title="GitHub에서 최신 커밋 목록을 가져옵니다"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '새로고침 중...' : '새로고침'}
        </Button>
      </div>

      {/* Branch Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-gray-200"
            disabled={isLoading || isBranchesLoading}
          >
            <span className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              {isBranchesLoading ? '브랜치 로딩 중...' : selectedBranch || '브랜치 선택'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          {branches.length === 0 ? (
            <DropdownMenuItem disabled>사용 가능한 브랜치가 없습니다</DropdownMenuItem>
          ) : (
            branches.map((branch) => (
              <DropdownMenuItem
                key={branch}
                onClick={() => handleBranchChange(branch)}
                className={selectedBranch === branch ? 'bg-gray-100' : ''}
              >
                {branch}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- Selection Guide --- */}
      {!isLoading && commits.length > 0 && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="py-1 px-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <Info className="h-5 w-5 flex-shrink-0 text-gray-600" />
                <div className="text-sm flex-1">
                  {selectedCommits.size === 0 ? (
                    <p className="text-gray-900 font-medium">학습을 시작할 커밋을 선택해주세요</p>
                  ) : (
                    <div>
                      <p className="text-gray-900 font-medium mb-2">
                        <span className="font-bold">{selectedCommits.size}개</span>의 커밋 선택됨
                      </p>
                      <div className="space-y-1">
                        {commits
                          .filter((commit) => selectedCommits.has(commit.sha))
                          .slice(0, 10)
                          .map((commit) => (
                            <p key={commit.sha} className="text-xs text-gray-600 truncate">
                              • {commit.message}
                            </p>
                          ))}
                        {selectedCommits.size > 10 && (
                          <p className="text-xs text-gray-500 italic">
                            외 {selectedCommits.size - 10}개
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedCommits.size > 0 && (
                <div className="flex gap-2 items-end self-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCommits(new Set())}
                    className="border-gray-300 text-gray-700"
                  >
                    선택 해제
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStartBatchLearning}
                    className="bg-gray-900 text-white hover:bg-gray-800"
                  >
                    학습 시작하기
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Error Message Display --- */}
      {branchesError && (
        <Card className="border-red-500 bg-red-50 text-red-800">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm font-medium">
              <p>브랜치 목록 가져오기 실패</p>
              <p className="text-xs font-normal opacity-90">{branchesError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-500 bg-red-50 text-red-800">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm font-medium">
              <p>커밋 가져오기 실패</p>
              <p className="text-xs font-normal opacity-90">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Commit List --- */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {isBranchesLoading || isLoading ? (
          // 브랜치 로딩 중 또는 커밋 로딩 중
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 border-b border-gray-200 last:border-b-0">
                <Skeleton className="h-4 w-3/4 bg-gray-200 mb-2" />
                <Skeleton className="h-3 w-1/2 bg-gray-200" />
              </div>
            ))}
          </>
        ) : commits.length === 0 && !error ? (
          // 커밋이 없는 경우
          <div className="py-12 text-center">
            <GitCommit className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-900 font-medium mb-2">{selectedBranch} 브랜치</p>
            <p className="text-sm text-gray-600">커밋이 없습니다</p>
          </div>
        ) : (
          commits.map((commit, index) => {
            const isSelected = selectedCommits.has(commit.sha)
            return (
              <div
                key={commit.sha}
                className={`flex items-center gap-3 px-3 py-2 border-b border-gray-200 last:border-b-0 transition-colors ${
                  isSelected
                    ? 'bg-gray-100 border-l-4 border-l-gray-900'
                    : index % 2 === 0
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Checkbox for selecting commit */}
                <button
                  onClick={() => toggleCommitSelection(commit.sha)}
                  className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                >
                  {isSelected ? (
                    <CheckSquare className="h-4 w-4 text-gray-900" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {/* Commit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{commit.message}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {commit.author}
                    </span>
                    <span>committed on {commit.date}</span>
                  </div>
                </div>

                {/* Commit SHA */}
                <div className="flex-shrink-0 text-xs font-mono text-gray-600">
                  {commit.sha.substring(0, 7)}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/repo/$repoId/commits')({
  component: CommitsPage,
})
