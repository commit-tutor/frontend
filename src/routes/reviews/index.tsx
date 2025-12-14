import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, Trophy, Trash2, Loader2 } from 'lucide-react'
import { reviewApi, queryKeys } from '@/lib/api'

/**
 * 나의 복습 페이지
 */

function MyReviewsPage() {
  const navigate = useNavigate()

  // 복습 자료 목록 조회
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.reviews,
    queryFn: () => reviewApi.getMyReviews(),
  })

  const handleReviewClick = (reviewId: number) => {
    navigate({ to: '/reviews/$reviewId', params: { reviewId: reviewId.toString() } })
  }

  const handleDeleteReview = async (reviewId: number, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm('이 복습 자료를 삭제하시겠습니까?')) return

    try {
      await reviewApi.deleteReview(reviewId)
      refetch()
    } catch (error) {
      console.error('복습 자료 삭제 실패:', error)
      alert('복습 자료 삭제에 실패했습니다.')
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">나의 복습</h1>
        <p className="text-gray-600 mt-2">AI가 생성한 맞춤 학습 자료를 확인하세요</p>
      </div>

      {/* 통계 */}
      {data && (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">전체 복습 자료</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{data.total}</p>
              </div>
              <BookOpen className="h-16 w-16 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">복습 자료를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="text-center py-12 text-red-600">복습 자료를 불러오는데 실패했습니다.</div>
      )}

      {/* 복습 자료 목록 */}
      {data && data.reviews.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">아직 생성된 복습 자료가 없습니다.</p>
          <p className="text-gray-500 text-sm mt-2">
            퀴즈를 풀고 결과 화면에서 "AI 분석하기"를 클릭해보세요!
          </p>
        </div>
      )}

      {data && data.reviews.length > 0 && (
        <div className="grid gap-4">
          {data.reviews.map((review) => (
            <Card
              key={review.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
              onClick={() => handleReviewClick(review.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                      <h3 className="text-lg font-bold text-gray-900">{review.title}</h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{review.summary}</p>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      {review.quiz_title && (
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {review.quiz_title}
                        </span>
                      )}
                      {review.quiz_score !== undefined && (
                        <Badge variant="outline" className="text-gray-700 border-gray-300">
                          {Math.round(review.quiz_score)}점
                        </Badge>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(review.created_at)}
                      </span>
                    </div>

                    {/* 섹션 개수 표시 */}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {review.sections.length}개 학습 섹션
                      </Badge>
                      {review.related_concepts && review.related_concepts.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {review.related_concepts.length}개 관련 개념
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleDeleteReview(review.id, e)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/reviews/')({
  component: MyReviewsPage,
})
