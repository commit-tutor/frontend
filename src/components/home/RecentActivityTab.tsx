import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { myQuizApi, reviewApi, queryKeys } from '@/lib/api'
import { Brain, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export function RecentActivityTab() {
  const navigate = useNavigate()

  const { data: quizData, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: queryKeys.myQuizzes(),
    queryFn: () => myQuizApi.getMyQuizzes({ limit: 5 }),
  })

  const { data: reviewData, isLoading: isLoadingReviews } = useQuery({
    queryKey: queryKeys.reviews,
    queryFn: () => reviewApi.getMyReviews(),
  })

  const recentQuizzes = quizData?.quizzes || []
  const recentReviews = reviewData?.reviews.slice(0, 5) || []

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ko })
    } catch {
      return dateString
    }
  }

  if (isLoadingQuizzes || isLoadingReviews) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            최근 퀴즈
          </CardTitle>
          <CardDescription>
            완료: {quizData?.completed || 0} • 대기 중: {quizData?.pending || 0}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentQuizzes.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">아직 생성된 퀴즈가 없습니다</p>
              <Button size="sm" className="mt-4" onClick={() => navigate({ to: '/dashboard' })}>
                첫 퀴즈 만들기
              </Button>
            </div>
          ) : (
            <>
              {recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate({ to: `/quiz/${quiz.id}` })}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      quiz.is_completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {quiz.is_completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Brain className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{quiz.title}</p>
                    {quiz.description && (
                      <p className="text-xs text-gray-500 truncate">{quiz.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {quiz.is_completed && quiz.score !== undefined && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                          {quiz.score}점
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {quiz.question_count}문제
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(quiz.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate({ to: '/my-quizzes' })}
              >
                전체 퀴즈 보기
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            최근 복습 자료
          </CardTitle>
          <CardDescription>총 {reviewData?.total || 0}개의 복습 자료</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentReviews.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">아직 생성된 복습 자료가 없습니다</p>
              <p className="text-xs text-gray-400 mt-1">퀴즈를 완료하면 자동으로 생성됩니다</p>
            </div>
          ) : (
            <>
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate({ to: `/reviews/${review.id}` })}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{review.title}</p>
                    <p className="text-xs text-gray-500 truncate">{review.summary}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {review.quiz_score !== undefined && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          연관 퀴즈: {review.quiz_score}점
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate({ to: '/reviews' })}
              >
                전체 복습 자료 보기
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
