import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitBranch, Brain, Calendar } from 'lucide-react'

const MOCK_HISTORY = [
  {
    id: '1',
    type: 'commit',
    title: 'feat: Add user authentication with JWT',
    repository: 'awesome-project',
    score: 85,
    date: '2025-10-26',
    time: '14:30',
  },
  {
    id: '2',
    type: 'quiz',
    title: 'React Hooks 퀴즈',
    score: 90,
    date: '2025-10-26',
    time: '10:15',
  },
  {
    id: '3',
    type: 'commit',
    title: 'fix: Resolve memory leak in useEffect hook',
    repository: 'backend-api',
    score: 72,
    date: '2025-10-25',
    time: '16:45',
  },
  {
    id: '4',
    type: 'commit',
    title: 'refactor: Improve component structure',
    repository: 'awesome-project',
    score: 88,
    date: '2025-10-25',
    time: '09:20',
  },
  {
    id: '5',
    type: 'quiz',
    title: 'TypeScript 기초 퀴즈',
    score: 95,
    date: '2025-10-24',
    time: '15:30',
  },
]

function LearningHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">학습 기록</h1>
        <p className="text-gray-600 mt-2">지금까지의 학습 활동을 확인하세요</p>
      </div>

      <div className="space-y-4">
        {MOCK_HISTORY.map((item) => (
          <Card key={item.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === 'commit'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {item.type === 'commit' ? (
                    <GitBranch className="h-6 w-6" />
                  ) : (
                    <Brain className="h-6 w-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      {item.type === 'commit' && (
                        <p className="text-sm text-gray-500 mt-1">{item.repository}</p>
                      )}
                    </div>
                    <Badge
                      className={`flex-shrink-0 ${
                        item.score >= 90
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : item.score >= 70
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                      }`}
                    >
                      {item.score}점
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                    </span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/learning-history')({
  component: LearningHistoryPage,
})
