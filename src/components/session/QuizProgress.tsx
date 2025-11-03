import { Alert, AlertDescription } from '@/components/ui/alert'

interface QuizProgressProps {
  answeredCount: number
  totalQuestions: number
  currentQuestionIndex: number
  allQuestions: Array<{ id: string }>
  quizAnswers: Record<string, number | string | null>
  onQuestionClick: (index: number) => void
}

export function QuizProgress({
  answeredCount,
  totalQuestions,
  currentQuestionIndex,
  allQuestions,
  quizAnswers,
  onQuestionClick,
}: QuizProgressProps) {
  return (
    <>
      {/* Progress Info */}
      <div className="flex items-center justify-between">
        <Alert className="bg-blue-50 border-blue-200 flex-1">
          <AlertDescription className="text-sm text-blue-900">
            코드 변경사항 기반 퀴즈 ({answeredCount}/{totalQuestions} 완료)
          </AlertDescription>
        </Alert>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gray-900 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Number Indicators */}
      <div className="flex gap-2 justify-center">
        {allQuestions.map((_, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(index)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
              index === currentQuestionIndex
                ? 'bg-gray-900 text-white'
                : quizAnswers[allQuestions[index].id] !== undefined &&
                  quizAnswers[allQuestions[index].id] !== null
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  )
}
