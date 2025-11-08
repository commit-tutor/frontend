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
  Calendar,
  User,
  FileText,
  AlertTriangle,
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

const API_BASE_URL = 'http://localhost:8000/api/v1/repo'

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

  // 브랜치 목록이 로드되면 첫 번째 브랜치를 선택
  useEffect(() => {
    console.log('🌿 브랜치 목록:', branches)
    if (branches.length > 0 && !selectedBranch) {
      // main 또는 master 브랜치를 우선적으로 선택, 없으면 첫 번째 브랜치
      const defaultBranch = branches.find(b => b === 'main' || b === 'master') || branches[0]
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
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
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

  const handleStartLearning = (commitSha: string) => {
    navigate({ to: `/session/${commitSha}` })
  }

  const handleBranchChange = (branch: string) => {
    console.log('🔄 브랜치 변경:', selectedBranch, '->', branch)
    setSelectedBranch(branch)
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

      {/* --- Commit Timeline --- */}
      <div className="space-y-4">
        {isLoading && !error ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                  <Skeleton className="h-3 w-full bg-gray-200" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-16 bg-gray-200" />
                    <Skeleton className="h-3 w-20 bg-gray-200" />
                  </div>
                  <Skeleton className="h-8 w-full bg-gray-200" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : commits.length === 0 && !error ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12 text-center">
              <GitCommit className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-900 font-medium mb-2">{selectedBranch})</p>
              <p className="text-sm text-gray-600">hello</p>
            </CardContent>
          </Card>
        ) : (
          commits.map((commit, index) => (
            <div key={commit.sha} className="relative">
              {/* Timeline Line */}
              {index !== commits.length - 1 && (
                <div className="absolute left-[11px] top-12 bottom-0 w-0.5 bg-gray-200" />
              )}

              <div className="flex gap-3">
                {/* Timeline Dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      commit.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  >
                    <GitCommit className="h-3 w-3 text-gray-900" />
                  </div>
                </div>

                {/* Commit Card */}
                <Card className="flex-1 bg-white border-gray-200 hover:border-gray-300 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    {/* Commit Message */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {commit.message}
                      </p>
                      <Badge
                        className={`${LEARNING_VALUE_COLORS[commit.learningValue]} text-gray-900 text-xs flex-shrink-0`}
                      >
                        {LEARNING_VALUE_LABELS[commit.learningValue]}
                      </Badge>
                    </div>

                    {/* Commit Metadata */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {commit.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {commit.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {commit.filesChanged} file chagned
                      </span>
                    </div>

                    {/* Code Changes */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-400">+{commit.additions}</span>
                      <span className="text-red-400">-{commit.deletions}</span>
                    </div>

                    {/* Action Button */}
                    {commit.isCompleted ? (
                      <Button
                        variant="outline"
                        onClick={() => handleStartLearning(commit.sha)}
                        className="w-full border-gray-300 text-gray-600"
                      >
                        학습하기
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartLearning(commit.sha)}
                        className="w-full bg-gray-900 text-white hover:bg-gray-800"
                      >
                        학습 시작
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/repo/$repoId/commits')({
  component: CommitsPage,
})
