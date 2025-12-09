import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'
import { type LearningTopic } from '@/lib/api'

type TopicSelectorProps = {
  topics: LearningTopic[]
  selectedTopicId: string | null
  onSelectTopic: (topicId: string | null) => void
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  hard: 'bg-red-100 text-red-800 border-red-300',
}

export function TopicSelector({ topics, selectedTopicId, onSelectTopic }: TopicSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            학습 주제 선택
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            커밋에서 추출된 주제를 선택하여 맞춤형 퀴즈를 생성하세요
          </p>
        </div>
        {selectedTopicId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectTopic(null)}
            className="text-gray-600"
          >
            전체 주제
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {topics.map((topic) => {
          const isSelected = selectedTopicId === topic.id
          const difficultyColor =
            difficultyColors[topic.difficulty as keyof typeof difficultyColors] ||
            difficultyColors.medium

          return (
            <Card
              key={topic.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-gray-900 bg-gray-50' : 'hover:border-gray-400'
              }`}
              onClick={() => onSelectTopic(isSelected ? null : topic.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{topic.title}</h4>
                    <Badge variant="outline" className={`text-xs ${difficultyColor}`}>
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{topic.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {topic.keywords.slice(0, 4).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                    {topic.keywords.length > 4 && (
                      <span className="text-xs text-gray-400">+{topic.keywords.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-8 text-gray-500">추출된 주제가 없습니다</div>
      )}
    </div>
  )
}
