import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Trophy, Brain, Home, RotateCcw } from 'lucide-react'
import { type QuizSubmitResponse, type MyQuizResponse } from '@/lib/api'

/**
 * 퀴즈 결과 페이지
 */
function QuizResultPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { quizId } = Route.useParams()

  // Router state에서 결과 데이터 가져오기 (있으면 사용)
  const routerState = (window.history.state as any)?.usr
  const stateResult: QuizSubmitResponse | undefined = routerState?.result
  const stateQuiz: MyQuizResponse | undefined = routerState?.quiz
  const savedSuccessfully: boolean = routerState?.savedSuccessfully || false

  // State가 없으면 API로 다시 조회 (새로고침 대응)
  const [quiz, setQuiz] = React.useState<MyQuizResponse | null>(stateQuiz || null)
  const [isLoading, setIsLoading] = React.useState(!stateQuiz)

  React.useEffect(() => {
    if (!stateQuiz) {
      // State가 없으면 퀴즈 데이터를 API로 가져오기
      const loadQuiz = async () => {
        try {
          const { myQuizApi } = await import('@/lib/api')
          const data = await myQuizApi.getQuizById(parseInt(quizId))
          setQuiz(data)
        } catch (error) {
          console.error('퀴즈 데이터 로드 실패:', error)
        } finally {
          setIsLoading(false)
        }
      }
      loadQuiz()
    }
  }, [quizId, stateQuiz])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <p className="text-gray-600">결과를 불러오는 중...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <p className="text-gray-600 mb-4">결과 정보를 찾을 수 없습니다.</p>
        <Button onClick={() => navigate({ to: '/my-quizzes' })}>퀴즈 목록으로</Button>
      </div>
    )
  }

  // State에서 받은 결과를 사용하거나, 퀴즈 데이터에서 계산
  const result: QuizSubmitResponse = stateResult || {
    quiz_id: quiz.id,
    score: quiz.score || 0,
    correct_answers: quiz.correct_answers || 0,
    wrong_answers: quiz.wrong_answers || 0,
    is_passed: (quiz.score || 0) >= 60,
    feedback:
      quiz.score && quiz.score >= 90
        ? '훌륭합니다! 완벽하게 이해하셨네요! 🎉'
        : quiz.score && quiz.score >= 70
          ? '잘하셨습니다! 대부분의 개념을 잘 이해하고 계세요. 👍'
          : quiz.score && quiz.score >= 60
            ? '합격입니다! 조금 더 학습하면 더 좋을 것 같아요. 💪'
            : '아쉽네요. 다시 한번 복습해보시는 것을 추천드립니다. 📚',
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-gray-900 text-white'
    if (score >= 70) return 'bg-gray-700 text-white'
    if (score >= 60) return 'bg-gray-500 text-white'
    return 'bg-gray-300 text-gray-900'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* 저장 성공 메시지 */}
      {savedSuccessfully && (
        <Alert className="mb-4 bg-gray-50 border-gray-300">
          <CheckCircle className="h-4 w-4 text-gray-900" />
          <AlertDescription className="text-gray-900">
            ✅ 퀴즈 결과가 성공적으로 저장되었습니다. 언제든지 나의 퀴즈에서 다시 확인할 수
            있습니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 결과 카드 */}
      <Card className="mb-6 border-gray-300">
        <CardContent className="p-8 text-center">
          {/* 아이콘 */}
          <div className="mb-6">
            {result.is_passed ? (
              <div className="w-20 h-20 mx-auto bg-gray-900 rounded-full flex items-center justify-center">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                <XCircle className="h-10 w-10 text-gray-700" />
              </div>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {result.is_passed ? '합격입니다!' : '아쉽네요'}
          </h1>
          <p className="text-gray-600 mb-6">{result.feedback}</p>

          {/* 점수 */}
          <div className="mb-6">
            <Badge className={`text-2xl px-6 py-2 ${getScoreBadge(result.score)}`}>
              {Math.round(result.score)}점
            </Badge>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Brain className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">전체 문제</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.correct_answers + result.wrong_answers}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="h-6 w-6 text-gray-900 mx-auto mb-2" />
              <p className="text-sm text-gray-600">정답</p>
              <p className="text-2xl font-bold text-gray-900">{result.correct_answers}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <XCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">오답</p>
              <p className="text-2xl font-bold text-gray-900">{result.wrong_answers}</p>
            </div>
          </div>

          {/* 퀴즈 정보 */}
          <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">퀴즈 정보</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                제목: <span className="text-gray-900 font-medium">{quiz.title}</span>
              </p>
              {quiz.selected_topic && (
                <p>
                  주제: <span className="text-gray-900 font-medium">{quiz.selected_topic}</span>
                </p>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                // 나의 퀴즈 목록 캐시 무효화 (최신 점수 반영)
                queryClient.invalidateQueries({ queryKey: ['myQuizzes'] })
                navigate({ to: '/my-quizzes' })
              }}
              className="flex-1 border-gray-300"
            >
              <Home className="h-4 w-4 mr-2" />
              퀴즈 목록
            </Button>
            <Button
              onClick={() => {
                // 특정 퀴즈 캐시 무효화 (새로운 시도 반영)
                queryClient.invalidateQueries({ queryKey: ['myQuiz', parseInt(quizId)] })
                navigate({ to: '/quiz/$quizId', params: { quizId } })
              }}
              className="flex-1 bg-gray-900 hover:bg-gray-800"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              다시 풀기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/quiz/$quizId/result')({
  component: QuizResultPage,
})
