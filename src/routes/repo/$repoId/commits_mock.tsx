import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GitCommit, GitBranch, ChevronDown, Calendar, User, FileText } from 'lucide-react'

type LearningValue = 'high' | 'medium' | 'low'

// Mock data - TODO: Replace with actual API call
const MOCK_COMMITS: Array<{
  sha: string
  message: string
  author: string
  date: string
  filesChanged: number
  additions: number
  deletions: number
  learningValue: LearningValue
  isCompleted: boolean
}> = [
  {
    sha: 'abc123',
    message: 'feat: Add user authentication with JWT',
    author: 'johndoe',
    date: '2025-10-25',
    filesChanged: 8,
    additions: 120,
    deletions: 15,
    learningValue: 'high',
    isCompleted: false,
  },
  {
    sha: 'def456',
    message: 'fix: Resolve memory leak in useEffect hook',
    author: 'janedoe',
    date: '2025-10-24',
    filesChanged: 3,
    additions: 25,
    deletions: 30,
    learningValue: 'medium',
    isCompleted: true,
  },
  {
    sha: 'ghi789',
    message: 'chore: Update dependencies',
    author: 'johndoe',
    date: '2025-10-23',
    filesChanged: 1,
    additions: 5,
    deletions: 5,
    learningValue: 'low',
    isCompleted: false,
  },
]

const LEARNING_VALUE_COLORS: Record<LearningValue, string> = {
  high: 'bg-green-500',
  medium: 'bg-yellow-500',
  low: 'bg-neutral-500',
}

const LEARNING_VALUE_LABELS: Record<LearningValue, string> = {
  high: '높음',
  medium: '중간',
  low: '낮음',
}

function CommitsPage() {
  const navigate = useNavigate()
  const { repoId } = Route.useParams()
  const [selectedBranch, setSelectedBranch] = useState('main')
  const [commits] = useState(MOCK_COMMITS)

  const handleStartLearning = (commitSha: string) => {
    navigate({ to: `/session/${commitSha}` })
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
          <Button variant="outline" className="w-full justify-between border-gray-200">
            <span className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              {selectedBranch}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuItem onClick={() => setSelectedBranch('main')}>main</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedBranch('develop')}>develop</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedBranch('feature/new')}>
            feature/new
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Commit Timeline */}
      <div className="space-y-4">
        {commits.map((commit, index) => (
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
                      {commit.filesChanged}개 파일
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
                      다시 학습하기
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
        ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/repo/$repoId/commits_mock')({
  component: CommitsPage,
})
