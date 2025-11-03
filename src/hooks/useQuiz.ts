import { useState, useMemo } from 'react'

interface QuizQuestion {
  id: string
  type: string
  question: string
  codeContext?: string
  options?: string[]
  correctAnswer: number | string
  explanation?: string
}

interface UseQuizReturn {
  currentQuestionIndex: number
  currentQuestion: QuizQuestion
  totalQuestions: number
  isLastQuestion: boolean
  isFirstQuestion: boolean
  quizAnswers: Record<string, number | string | null>
  answeredCount: number
  hasAnsweredCurrentQuestion: boolean
  handleAnswer: (questionId: string, answer: number | string) => void
  handleNext: () => void
  handlePrevious: () => void
  goToQuestion: (index: number) => void
}

/**
 * 퀴즈 상태 및 네비게이션을 관리하는 커스텀 훅
 */
export function useQuiz(questions: QuizQuestion[]): UseQuizReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | string | null>>({})

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const isFirstQuestion = currentQuestionIndex === 0

  const hasAnsweredCurrentQuestion = useMemo(() => {
    return (
      quizAnswers[currentQuestion?.id] !== undefined && quizAnswers[currentQuestion?.id] !== null
    )
  }, [quizAnswers, currentQuestion])

  const answeredCount = useMemo(() => {
    return Object.keys(quizAnswers).filter(
      (key) => quizAnswers[key] !== undefined && quizAnswers[key] !== null,
    ).length
  }, [quizAnswers])

  const handleAnswer = (questionId: string, answer: number | string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index)
    }
  }

  return {
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    isLastQuestion,
    isFirstQuestion,
    quizAnswers,
    answeredCount,
    hasAnsweredCurrentQuestion,
    handleAnswer,
    handleNext,
    handlePrevious,
    goToQuestion,
  }
}
