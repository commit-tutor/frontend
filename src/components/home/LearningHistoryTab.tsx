import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { myQuizApi, reviewApi, queryKeys } from '@/lib/api'
import { Trophy, Brain, Target, Calendar } from 'lucide-react'
import { useMemo } from 'react'

export function LearningHistoryTab() {
  const { data: quizData, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: queryKeys.myQuizzes(),
    queryFn: () => myQuizApi.getMyQuizzes(),
  })

  const { data: reviewData, isLoading: isLoadingReviews } = useQuery({
    queryKey: queryKeys.reviews,
    queryFn: () => reviewApi.getMyReviews(),
  })

  const stats = useMemo(() => {
    const quizzes = quizData?.quizzes || []
    const completedQuizzes = quizzes.filter((q) => q.is_completed)
    const totalQuestions = quizzes.reduce((sum, q) => sum + q.question_count, 0)
    const averageScore =
      completedQuizzes.length > 0
        ? Math.round(
            completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes.length,
          )
        : 0

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentQuizzes = quizzes.filter((q) => new Date(q.created_at) >= sevenDaysAgo).length

    const highestScore =
      completedQuizzes.length > 0 ? Math.max(...completedQuizzes.map((q) => q.score || 0)) : 0

    const totalCorrect = completedQuizzes.reduce((sum, q) => sum + (q.correct_answers || 0), 0)
    const totalAnswered = completedQuizzes.reduce((sum, q) => sum + q.question_count, 0)
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

    const uniqueDates = new Set(
      completedQuizzes.map((q) => new Date(q.completed_at!).toDateString()),
    )
    const streak = uniqueDates.size

    return {
      totalQuizzes: quizzes.length,
      completedQuizzes: completedQuizzes.length,
      totalQuestions,
      averageScore,
      recentQuizzes,
      highestScore,
      accuracy,
      streak,
      totalReviews: reviewData?.total || 0,
    }
  }, [quizData, reviewData])

  if (isLoadingQuizzes || isLoadingReviews) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />총 퀴즈 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
            <p className="text-xs text-gray-500 mt-1">완료: {stats.completedQuizzes}개</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-purple-600" />
              평균 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.averageScore}점</p>
            <p className="text-xs text-gray-500 mt-1">최고: {stats.highestScore}점</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              정답률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.accuracy}%</p>
            <p className="text-xs text-gray-500 mt-1">총 {stats.totalQuestions}문제</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              연속 학습
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.streak}일</p>
            <p className="text-xs text-gray-500 mt-1">최근 7일: {stats.recentQuizzes}개</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
