import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Question {
  id: string
  type: string
  question: string
  codeContext?: string
  options?: string[]
}

interface QuestionCardProps {
  question: Question
  questionIndex: number
  userAnswer: number | string | null
  onAnswer: (questionId: string, answer: number | string) => void
}

export function QuestionCard({ question, questionIndex, userAnswer, onAnswer }: QuestionCardProps) {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base text-gray-900 mb-2">
              문제 {questionIndex + 1}. {question.question}
            </CardTitle>
            <Badge variant="outline" className="w-fit text-xs">
              {question.type === 'multiple' ? '객관식' : '단답형'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Code Context */}
        {question.codeContext && (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-100 font-mono">{question.codeContext}</pre>
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-2">
          {question.type === 'multiple' && question.options ? (
            question.options.map((option, oIndex) => (
              <button
                key={oIndex}
                onClick={() => onAnswer(question.id, oIndex)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  userAnswer === oIndex
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm">{option}</span>
              </button>
            ))
          ) : (
            <input
              type="text"
              placeholder="답을 입력하세요"
              value={(userAnswer as string) || ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="w-full p-3 rounded bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-900"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
