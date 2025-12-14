import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitBranch, ExternalLink } from 'lucide-react'
import type { Repository } from '@/lib/api'

interface RepositoryCardProps {
  repository: Repository
  onStartLearning: (repoId: number) => void
}

export function RepositoryCard({ repository, onStartLearning }: RepositoryCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // ExternalLink 클릭 시에는 네비게이션 하지 않음
    if ((e.target as HTMLElement).closest('a')) {
      return
    }
    onStartLearning(repository.id)
  }

  return (
    <Card
      className="bg-white border-gray-200 hover:border-gray-300 transition-colors cursor-pointer hover:shadow-md"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base text-gray-900 flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <a
                href={`https://github.com/${repository.full_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                {repository.name}
              </a>
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {repository.description || '설명 없음'}
            </CardDescription>
          </div>
          <a
            href={`https://github.com/${repository.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4 text-gray-500 hover:text-blue-600" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <Badge variant="outline" className="text-xs">
            {repository.language || 'N/A'}
          </Badge>
          <span>업데이트: {new Date(repository.updated_at).toLocaleDateString()}</span>
          <span className="text-xs text-gray-500">
            {repository.private ? '🔒 Private' : '📖 Public'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
