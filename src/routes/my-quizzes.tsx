import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Calendar, Clock, Trash2, Play, CheckCircle, AlertCircle } from 'lucide-react'
import { myQuizApi, queryKeys } from '@/lib/api'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'

function MyQuizzesPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'completed'>('all')

  // 전체 퀴즈 조회
  const { data: allQuizzes, isLoading: isLoadingAll } = useQuery({
    queryKey: queryKeys.myQuizzes(undefined),
    queryFn: () => myQuizApi.getMyQuizzes(),
    enabled: selectedTab === 'all',
  })

  // 미완료 퀴즈 조회
  const { data: pendingQuizzes, isLoading: isLoadingPending } = useQuery({
    queryKey: queryKeys.myQuizzes(false),
    queryFn: () => myQuizApi.getMyQuizzes({ is_completed: false }),
    enabled: selectedTab === 'pending',
  })

  // 완료 퀴즈 조회
  const { data: completedQuizzes, isLoading: isLoadingCompleted } = useQuery({
    queryKey: queryKeys.myQuizzes(true),
    queryFn: () => myQuizApi.getMyQuizzes({ is_completed: true }),
    enabled: selectedTab === 'completed',
  })

  const currentData =
    selectedTab === 'all'
      ? allQuizzes
      : selectedTab === 'pending'
        ? pendingQuizzes
        : completedQuizzes

  const isLoading =
    selectedTab === 'all'
      ? isLoadingAll
      : selectedTab === 'pending'
        ? isLoadingPending
        : isLoadingCompleted

  const handleQuizClick = (quizId: number) => {
    // 퀴즈 진행 페이지로 이동
    router.navigate({
      to: '/quiz/$quizId',
      params: { quizId: quizId.toString() },
    })
  }

  const handleDeleteQuiz = async (quizId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('정말 이 퀴즈를 삭제하시겠습니까?')) {
      try {
        await myQuizApi.deleteQuiz(quizId)
        // 쿼리 무효화하여 목록 새로고침
        router.invalidate()
      } catch (error) {
        console.error('퀴즈 삭제 실패:', error)
        alert('퀴즈 삭제에 실패했습니다.')
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-white text-gray-700 border-gray-300'
    if (score >= 90) return 'bg-gray-900 text-white border-gray-900'
    if (score >= 70) return 'bg-gray-700 text-white border-gray-700'
    if (score >= 60) return 'bg-gray-500 text-white border-gray-500'
    return 'bg-gray-300 text-gray-900 border-gray-400'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">나의 퀴즈</h1>
        <p className="text-gray-600 mt-2">생성한 퀴즈와 학습 기록을 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      {currentData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-gray-300 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">전체 퀴즈</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{currentData.total}</p>
                </div>
                <Brain className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-300 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">미완료</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{currentData.pending}</p>
                </div>
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-300 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">완료</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{currentData.completed}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 탭 */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="pending">미완료</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-600">로딩 중...</div>
          ) : !currentData || currentData.quizzes.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              {selectedTab === 'pending'
                ? '미완료 퀴즈가 없습니다.'
                : selectedTab === 'completed'
                  ? '완료한 퀴즈가 없습니다.'
                  : '퀴즈를 생성해보세요!'}
            </div>
          ) : (
            <div className="space-y-4">
              {currentData.quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="bg-white border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleQuizClick(quiz.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          quiz.is_completed
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        {quiz.is_completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Brain className="h-6 w-6" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                            {quiz.description && (
                              <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
                            )}
                          </div>

                          {quiz.is_completed && quiz.score !== undefined && (
                            <Badge className={`flex-shrink-0 ${getScoreColor(quiz.score)}`}>
                              {Math.round(quiz.score)}점
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Brain className="h-4 w-4" />
                            {quiz.question_count}문제
                          </span>
                          {quiz.selected_topic && (
                            <span className="text-gray-900 font-medium">
                              주제: {quiz.selected_topic}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(quiz.created_at)}
                            </span>
                            <span>{formatTime(quiz.created_at)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {!quiz.is_completed && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleQuizClick(quiz.id)
                                }}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                시작하기
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/my-quizzes')({
  component: MyQuizzesPage,
})
