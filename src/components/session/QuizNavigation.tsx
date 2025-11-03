import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface QuizNavigationProps {
  isFirstQuestion: boolean
  isLastQuestion: boolean
  hasAnsweredCurrentQuestion: boolean
  answeredCount: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}

export function QuizNavigation({
  isFirstQuestion,
  isLastQuestion,
  hasAnsweredCurrentQuestion,
  answeredCount,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
}: QuizNavigationProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onPrevious} disabled={isFirstQuestion} variant="outline" className="flex-1">
        <ChevronLeft className="h-4 w-4 mr-2" />
        이전
      </Button>

      {!isLastQuestion ? (
        <Button
          onClick={onNext}
          disabled={!hasAnsweredCurrentQuestion}
          className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
        >
          다음
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={answeredCount !== totalQuestions}
          className="flex-1 bg-green-600 text-white hover:bg-green-700"
        >
          제출하기
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
