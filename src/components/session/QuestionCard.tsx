import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'

interface Question {
  id: string
  type: string
  question: string
  codeContext?: string
  options?: string[]
  correctAnswer: number | string
  explanation?: string
}

interface QuestionCardProps {
  question: Question
  questionIndex: number
  userAnswer: number | string | null
  isSubmitted: boolean
  onAnswer: (questionId: string, answer: number | string) => void
  onSubmit: () => void
}

export function QuestionCard({
  question,
  questionIndex,
  userAnswer,
  isSubmitted,
  onAnswer,
  onSubmit,
}: QuestionCardProps) {
  // 답변 여부 확인
  const hasAnswered = userAnswer !== null && userAnswer !== undefined && userAnswer !== ''

  // 정답 여부 확인 (확인 버튼을 누른 경우에만)
  const isCorrect =
    hasAnswered && isSubmitted
      ? question.type === 'multiple'
        ? userAnswer === question.correctAnswer
        : String(userAnswer).trim().toLowerCase() ===
          String(question.correctAnswer).trim().toLowerCase()
      : null

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base text-gray-900 mb-2">
              문제 {questionIndex + 1}. {question.question}
            </CardTitle>
            <Badge variant="outline" className="w-fit text-xs">
              객관식
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
          {question.options?.map((option, oIndex) => {
            const isSelected = userAnswer === oIndex
            const isCorrectOption = oIndex === question.correctAnswer
            const showCorrect = isSubmitted && isCorrectOption
            const showWrong = isSubmitted && isSelected && !isCorrectOption

            return (
              <button
                key={oIndex}
                onClick={() => !isSubmitted && onAnswer(question.id, oIndex)}
                disabled={isSubmitted}
                className={`w-full text-left p-3 rounded border transition-colors flex items-center justify-between ${
                  showCorrect
                    ? 'bg-green-50 text-green-900 border-green-500'
                    : showWrong
                      ? 'bg-red-50 text-red-900 border-red-500'
                      : isSelected
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="text-sm flex-1">{option}</span>
                {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                {showWrong && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* 확인 버튼 */}
        {hasAnswered && !isSubmitted && (
          <Button onClick={onSubmit} className="w-full bg-gray-900 hover:bg-gray-800">
            확인
          </Button>
        )}

        {/* Feedback - 확인 버튼을 누른 후에만 표시 */}
        {isSubmitted && isCorrect !== null && (
          <div className="space-y-3">
            {/* 정답/오답 표시 */}
            <div
              className={`w-full rounded-lg border px-4 py-3 flex items-center gap-3 ${
                isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              )}
              <div className={`font-semibold text-base ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                {isCorrect ? '정답입니다! 🎉' : '틀렸습니다'}
              </div>
            </div>

            {/* 해설 */}
            {question.explanation && (
              <div className="w-full rounded-lg border px-4 py-3 bg-blue-50 border-blue-500">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-blue-900 font-semibold text-sm mb-2">
                      해설
                    </div>
                    <div className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {question.explanation}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
