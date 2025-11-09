import { QuizProgress } from './QuizProgress'
import { QuestionCard } from './QuestionCard'
import { QuizNavigation } from './QuizNavigation'

interface QuizQuestion {
  id: string
  type: string
  question: string
  codeContext?: string
  options?: string[]
  correctAnswer: number | string
  explanation?: string
}

interface QuizTabProps {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  currentQuestion: QuizQuestion
  totalQuestions: number
  isLastQuestion: boolean
  isFirstQuestion: boolean
  quizAnswers: Record<string, number | string | null>
  answeredCount: number
  hasAnsweredCurrentQuestion: boolean
  submittedAnswers: Set<string>
  hasSubmittedCurrentQuestion: boolean
  onAnswer: (questionId: string, answer: number | string) => void
  onSubmitAnswer: (questionId: string) => void
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
  goToQuestion: (index: number) => void
}

export function QuizTab({
  questions,
  currentQuestionIndex,
  currentQuestion,
  totalQuestions,
  isLastQuestion,
  isFirstQuestion,
  quizAnswers,
  answeredCount,
  hasAnsweredCurrentQuestion,
  submittedAnswers,
  hasSubmittedCurrentQuestion,
  onAnswer,
  onSubmitAnswer,
  onNext,
  onPrevious,
  onSubmit,
  goToQuestion,
}: QuizTabProps) {
  return (
    <div className="space-y-4">
      <QuizProgress
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        currentQuestionIndex={currentQuestionIndex}
        allQuestions={questions}
        quizAnswers={quizAnswers}
        onQuestionClick={goToQuestion}
      />

      <QuestionCard
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        userAnswer={quizAnswers[currentQuestion.id] ?? null}
        isSubmitted={hasSubmittedCurrentQuestion}
        onAnswer={onAnswer}
        onSubmit={() => onSubmitAnswer(currentQuestion.id)}
      />

      <QuizNavigation
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        hasAnsweredCurrentQuestion={hasAnsweredCurrentQuestion}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onPrevious={onPrevious}
        onNext={onNext}
        onSubmit={onSubmit}
      />
    </div>
  )
}
