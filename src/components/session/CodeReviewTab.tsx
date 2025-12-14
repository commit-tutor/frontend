import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileCode, FilePlus, FileX, FileEdit } from 'lucide-react'
import type { CommitDiffInfo } from '@/lib/api'

interface AIAnalysis {
  summary: string
  quality: {
    readability: number
    performance: number
    security: number
  }
  suggestions: string[]
  potentialBugs: string[]
}

interface CodeReviewTabProps {
  analysis: AIAnalysis | null
  files?: CommitDiffInfo[]
}

// 파일 상태별 아이콘 가져오기
const getFileStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'added':
      return <FilePlus className="h-4 w-4 text-green-600" />
    case 'removed':
      return <FileX className="h-4 w-4 text-red-600" />
    case 'modified':
      return <FileEdit className="h-4 w-4 text-yellow-600" />
    case 'renamed':
      return <FileCode className="h-4 w-4 text-blue-600" />
    default:
      return <FileCode className="h-4 w-4 text-gray-600" />
  }
}

// 파일 상태별 색상 가져오기
const getFileStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'added':
      return <Badge className="bg-green-100 text-green-700 text-xs">added</Badge>
    case 'removed':
      return <Badge className="bg-red-100 text-red-700 text-xs">removed</Badge>
    case 'modified':
      return <Badge className="bg-yellow-100 text-yellow-700 text-xs">modified</Badge>
    case 'renamed':
      return <Badge className="bg-blue-100 text-blue-700 text-xs">renamed</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-700 text-xs">{status}</Badge>
  }
}

// diff 파싱 및 렌더링
const renderDiffLines = (patch: string | undefined) => {
  if (!patch) {
    return <div className="text-sm text-gray-500 italic">diff 정보 없음</div>
  }

  const lines = patch.split('\n')

  return (
    <div className="font-mono text-xs overflow-x-auto">
      {lines.map((line, index) => {
        let lineClass = 'px-2 py-0.5'
        let bgClass = ''
        let textClass = 'text-gray-800'

        if (line.startsWith('+') && !line.startsWith('+++')) {
          bgClass = 'bg-green-50'
          textClass = 'text-green-800'
        } else if (line.startsWith('-') && !line.startsWith('---')) {
          bgClass = 'bg-red-50'
          textClass = 'text-red-800'
        } else if (line.startsWith('@@')) {
          bgClass = 'bg-blue-50'
          textClass = 'text-blue-800 font-semibold'
        } else if (line.startsWith('+++') || line.startsWith('---')) {
          textClass = 'text-gray-600 font-semibold'
        }

        return (
          <div key={index} className={`${lineClass} ${bgClass} ${textClass}`}>
            {line || ' '}
          </div>
        )
      })}
    </div>
  )
}

export function CodeReviewTab({ files }: CodeReviewTabProps) {
  return (
    <div className="space-y-4">
      {/* File Changes */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">코드 변경사항</CardTitle>
          <CardDescription className="text-xs">
            {files && files.length > 0
              ? `${files.length}개의 파일이 변경되었습니다`
              : 'diff 정보를 불러오는 중...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {files && files.length > 0 ? (
            files.map((file, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* File Header */}
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileStatusIcon(file.status)}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {file.filename}
                    </span>
                    {getFileStatusBadge(file.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <span className="text-green-600 font-medium">+{file.additions}</span>
                    <span className="text-red-600 font-medium">-{file.deletions}</span>
                  </div>
                </div>

                {/* Diff Content */}
                <div className="bg-white max-h-96 overflow-auto">{renderDiffLines(file.patch)}</div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <FileCode className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600">변경 사항을 불러오는 중입니다...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
