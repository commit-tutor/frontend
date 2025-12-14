import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Loader2, AlertCircle, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useQuiz } from '@/hooks/useQuiz'
import { QuizTab } from '@/components/session/QuizTab'
import { myQuizApi, type MyQuizResponse, type QuizQuestion } from '@/lib/api'
import { Alert, AlertDescription } from '@/components/ui/alert'

/**
 * 저장된 퀴즈 진행 페이지
 * 기존 세션 페이지와 동일한 UI 사용
 */
function QuizPlayPage() {
  const navigate = useNavigate()
  const { quizId } = Route.useParams()

  const [quiz, setQuiz] = useState<MyQuizResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 퀴즈 문제 데이터
  const quizQuestions = (quiz?.questions as QuizQuestion[]) || []

  // 퀴즈 로직 (기존 세션 페이지와 동일)
  const quizLogic = useQuiz(quizQuestions)

  // 퀴즈 불러오기
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true)
        const data = await myQuizApi.getQuizById(parseInt(quizId))
        setQuiz(data)
        setError(null)
        console.log('✅ 저장된 퀴즈 로드 완료:', data.title)
      } catch (err: any) {
        console.error('❌ 퀴즈 로드 실패:', err)
        setError(err.response?.data?.detail || '퀴즈를 불러올 수 없습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuiz()
  }, [quizId])

  // 퀴즈 제출 핸들러
  const handleSubmitQuiz = async () => {
    if (isSubmitting || !quiz) return

    const unansweredCount = quizQuestions.length - quizLogic.answeredCount

    if (unansweredCount > 0) {
      if (!confirm(`${unansweredCount}개의 문제가 미답변 상태입니다. 제출하시겠습니까?`)) {
        return
      }
    }

    try {
      setIsSubmitting(true)

      console.log('🚀 퀴즈 제출 및 채점 중...')
      const result = await myQuizApi.submitQuiz(parseInt(quizId), {
        user_answers: quizLogic.quizAnswers,
        duration_seconds: null,
      })

      console.log('✅ 퀴즈 제출 완료 - 점수:', result.score)
      console.log('💾 결과가 데이터베이스에 저장되었습니다')

      // 결과 페이지로 이동
      navigate({
        to: '/quiz/$quizId/result',
        params: { quizId },
        state: { result, quiz, savedSuccessfully: true },
      })
    } catch (err: any) {
      console.error('❌ 퀴즈 제출 실패:', err)
      alert('퀴즈 제출에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">퀴즈를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="border-gray-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || '퀴즈를 찾을 수 없습니다.'}</AlertDescription>
        </Alert>
        <Button
          onClick={() => navigate({ to: '/my-quizzes' })}
          className="mt-4 bg-gray-900 hover:bg-gray-800"
        >
          퀴즈 목록으로
        </Button>
      </div>
    )
  }

  // 퀴즈가 아직 로드되지 않았거나 문제가 없는 경우
  if (quizQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="border-gray-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>퀴즈 문제가 없습니다.</AlertDescription>
        </Alert>
        <Button
          onClick={() => navigate({ to: '/my-quizzes' })}
          className="mt-4 bg-gray-900 hover:bg-gray-800"
        >
          퀴즈 목록으로
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <BookmarkCheck className="h-7 w-7 text-gray-900" />
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          </div>
        </div>
        {quiz.description && <p className="text-gray-600 ml-10">{quiz.description}</p>}
        {quiz.selected_topic && (
          <p className="text-sm text-gray-900 font-medium ml-10 mt-1">
            주제: {quiz.selected_topic}
          </p>
        )}
      </div>

      {/* 탭 (퀴즈만) */}
      <Tabs defaultValue="quiz" className="w-full">
        <TabsContent value="quiz">
          <QuizTab
            questions={quizQuestions}
            currentQuestionIndex={quizLogic.currentQuestionIndex}
            currentQuestion={quizLogic.currentQuestion}
            totalQuestions={quizLogic.totalQuestions}
            isLastQuestion={quizLogic.isLastQuestion}
            isFirstQuestion={quizLogic.isFirstQuestion}
            quizAnswers={quizLogic.quizAnswers}
            answeredCount={quizLogic.answeredCount}
            hasAnsweredCurrentQuestion={quizLogic.hasAnsweredCurrentQuestion}
            submittedAnswers={quizLogic.submittedAnswers}
            hasSubmittedCurrentQuestion={quizLogic.hasSubmittedCurrentQuestion}
            onAnswer={quizLogic.handleAnswer}
            onSubmitAnswer={quizLogic.handleSubmitAnswer}
            onNext={quizLogic.handleNext}
            onPrevious={quizLogic.handlePrevious}
            onSubmit={handleSubmitQuiz}
            goToQuestion={quizLogic.goToQuestion}
          />

          {/* 제출 중 로딩 오버레이 */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 text-center max-w-sm">
                <Loader2 className="h-12 w-12 animate-spin text-gray-900 mx-auto mb-4" />
                <p className="text-gray-900 font-bold text-lg mb-2">채점 및 저장 중...</p>
                <p className="text-gray-600 text-sm">
                  답안을 채점하고 결과를 데이터베이스에 저장하고 있습니다
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/quiz/$quizId/')({
  component: QuizPlayPage,
})
