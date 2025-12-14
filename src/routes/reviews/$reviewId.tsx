import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BookOpen, Home, Lightbulb, CheckCircle, ArrowRight, Loader2, Trophy } from 'lucide-react'
import { reviewApi, queryKeys, type ReviewSection } from '@/lib/api'

// 간단한 마크다운 렌더러
const SimpleMarkdown = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    // HTML 이스케이프 (XSS 방지)
    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    // 코드 블록 (먼저 처리)
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, _lang, code) => {
      const escapedCode = escapeHtml(code.trim())
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3 text-sm"><code>${escapedCode}</code></pre>`
    })

    // 인라인 코드
    text = text.replace(/`([^`]+)`/g, (_, code) => {
      const escapedCode = escapeHtml(code)
      return `<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">${escapedCode}</code>`
    })

    // 헤더
    text = text.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    text = text.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    text = text.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')

    // 볼드, 이탤릭
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')

    // 리스트
    text = text.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
    text = text.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$1. $2</li>')

    // 줄바꿈
    text = text.replace(/\n\n/g, '<p class="my-2"></p>')
    text = text.replace(/\n/g, '<br />')

    return text
  }

  return (
    <div
      className="prose prose-gray max-w-none text-gray-700"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}

/**
 * 복습 자료 상세 페이지
 */

function ReviewDetailPage() {
  const navigate = useNavigate()
  const { reviewId } = Route.useParams()

  // 복습 자료 조회
  const {
    data: review,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.review(parseInt(reviewId)),
    queryFn: () => reviewApi.getReviewById(parseInt(reviewId)),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">복습 자료를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="border-red-300 bg-red-50">
          <AlertDescription className="text-red-900">
            복습 자료를 찾을 수 없습니다.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/reviews' })} className="mt-4">
          복습 목록으로
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-900">{review.title}</h1>
        </div>

        {/* 퀴즈 정보 */}
        {review.quiz_title && (
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{review.quiz_title}</span>
            {review.quiz_score !== undefined && (
              <Badge variant="outline" className="text-gray-700 border-gray-300">
                {Math.round(review.quiz_score)}점
              </Badge>
            )}
          </div>
        )}

        {/* 요약 */}
        <Alert className="bg-gray-50 border-gray-200">
          <Lightbulb className="h-5 w-5 text-gray-500" />
          <AlertDescription className="text-gray-700 font-medium">
            {review.summary}
          </AlertDescription>
        </Alert>
      </div>

      {/* 학습 섹션 */}
      <div className="space-y-6 mb-8">
        {review.sections.map((section: ReviewSection, index: number) => (
          <Card key={index} className="border-gray-200 overflow-hidden">
            <CardContent className="px-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                {section.title}
              </h2>

              {/* 학습 내용 (마크다운) */}
              <div className="mb-6">
                <SimpleMarkdown content={section.content} />
              </div>

              {/* 핵심 포인트 */}
              {section.key_points && section.key_points.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                    핵심 포인트
                  </h3>
                  <ul className="space-y-2">
                    {section.key_points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-gray-600 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 예제 */}
              {section.examples && section.examples.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3">💡 예제</h3>
                  <div className="space-y-3">
                    {section.examples.map((example, idx) => (
                      <div key={idx}>
                        <SimpleMarkdown content={example} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 관련 개념 */}
      {review.related_concepts && review.related_concepts.length > 0 && (
        <Card className="border-gray-200 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-gray-500" />
              관련 개념
            </h2>
            <div className="flex flex-wrap gap-2">
              {review.related_concepts.map((concept, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1.5 px-3">
                  {concept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 추가 학습 자료 */}
      {review.further_reading && review.further_reading.length > 0 && (
        <Card className="border-gray-200 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="h-6 w-6 text-gray-500" />
              다음 단계
            </h2>
            <ul className="space-y-2">
              {review.further_reading.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-gray-600 mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 하단 버튼 */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/reviews' })}
          className="flex-1 border-gray-300"
        >
          <Home className="h-4 w-4 mr-2" />
          복습 목록
        </Button>
        <Button
          onClick={() =>
            navigate({ to: '/quiz/$quizId', params: { quizId: review.quiz_id.toString() } })
          }
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Trophy className="h-4 w-4 mr-2" />
          퀴즈 다시 풀기
        </Button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/reviews/$reviewId')({
  component: ReviewDetailPage,
})
