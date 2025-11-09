import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-react'
import { useBranches } from '@/hooks/useBranches'

type LearningValue = 'high' | 'medium' | 'low'

interface Commit {
  sha: string
  message: string
  author: string
  date: string
  filesChanged: number
  additions: number
  deletions: number
  learningValue: LearningValue
  isCompleted: boolean
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/repo`

const LEARNING_VALUE_COLORS: Record<LearningValue, string> = {
  high: 'bg-green-500',
  medium: 'bg-yellow-500',
  low: 'bg-neutral-500',
}

const LEARNING_VALUE_LABELS: Record<LearningValue, string> = {
  high: 'high',
  medium: 'medium',
  low: 'low',
}

function CommitsPage() {
  const navigate = useNavigate()
  const { repoId } = Route.useParams()

  // 브랜치 목록 가져오기
  const { branches, isLoading: isBranchesLoading, error: branchesError } = useBranches(repoId)

  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [commits, setCommits] = useState<Commit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCommits, setSelectedCommits] = useState<Set<string>>(new Set())

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

  const fetchCommits = async (branch: string) => {
    setIsLoading(true)
    setError(null)
    setCommits([])

    // 백엔드URL: http://localhost:8000/api/v1/repo/{repoId}/commits?branch=main
    const url = `${API_BASE_URL}/${repoId}/commits?branch=${branch}`
    console.log('📡 커밋 요청 URL:', url)
    console.log('🔑 브랜치:', branch)

    try {
      const token = localStorage.getItem('github_token')
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      console.log('📥 응답 상태:', response.status)

      if (!response.ok) {
        let errorDetail = response.statusText
        try {
          const errorData = await response.json()
          console.log('❌ 에러 데이터:', errorData)
          errorDetail = errorData.detail || errorDetail
        } catch (e) {}
        throw new Error(`커밋 로딩 실패 (${response.status}): ${errorDetail}`)
      }

      const data: Commit[] = await response.json()
      console.log('✅ 커밋 데이터 받음:', data.length, '개')
      console.log('📋 커밋 목록:', data)
      setCommits(data)
    } catch (err) {
      console.error('❌ 커밋 로딩 에러:', err)
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedBranch) {
      fetchCommits(selectedBranch)
    }
  }, [repoId, selectedBranch])

  const handleBranchChange = (branch: string) => {
    console.log('🔄 브랜치 변경:', selectedBranch, '->', branch)
    setSelectedBranch(branch)
    setSelectedCommits(new Set()) // 브랜치 변경 시 선택 초기화
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">커밋 목록</h1>
        <p className="text-sm text-gray-600">Repository ID: {repoId}</p>
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
        {isLoading && !error ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border-b border-gray-200 last:border-b-0">
                <Skeleton className="h-4 w-3/4 bg-gray-200 mb-2" />
                <Skeleton className="h-3 w-1/2 bg-gray-200" />
              </div>
            ))}
          </>
        ) : commits.length === 0 && !error ? (
          <div className="py-12 text-center">
            <GitCommit className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-900 font-medium mb-2">{selectedBranch}</p>
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
                    <Badge
                      className={`${LEARNING_VALUE_COLORS[commit.learningValue]} text-white text-xs flex-shrink-0 px-1.5 py-0`}
                    >
                      {LEARNING_VALUE_LABELS[commit.learningValue]}
                    </Badge>
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
