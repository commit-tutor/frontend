import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Calendar,
  ArrowLeft,
} from 'lucide-react'

// Mock data
const MOCK_RESULT = {
  score: 2,
  total: 3,
  percentage: 67,
  timeSpent: '5분 23초',
  answers: [
    {
      questionId: '1',
      question: 'JWT에서 "Bearer" 접두사를 사용하는 이유는 무엇인가요?',
      userAnswer: 'HTTP 인증 스킴을 명시하기 위해',
      correctAnswer: 'HTTP 인증 스킴을 명시하기 위해',
      isCorrect: true,
      explanation:
        'Bearer는 HTTP 인증 스킴의 한 종류로, Authorization 헤더에서 토큰의 타입을 명시합니다. RFC 6750에서 정의된 표준입니다.',
    },
    {
      questionId: '2',
      question: '이 코드에서 사용된 해싱 알고리즘은?',
      userAnswer: 'SHA-256',
      correctAnswer: 'bcrypt',
      isCorrect: false,
      explanation:
        'bcrypt는 비밀번호 해싱을 위해 특별히 설계된 알고리즘으로, salt를 자동으로 생성하고 연산을 의도적으로 느리게 만들어 brute force 공격을 방지합니다.',
    },
    {
      questionId: '3',
      question: 'JWT 토큰은 몇 개의 부분으로 구성되나요?',
      userAnswer: '3',
      correctAnswer: '3',
      isCorrect: true,
      explanation: 'JWT는 Header, Payload, Signature 세 부분으로 구성되며, 점(.)으로 구분됩니다.',
    },
  ],
  aiComment:
    'JWT 인증의 기본 개념을 잘 이해하고 계시네요! 다만 bcrypt와 같은 해싱 알고리즘의 차이를 더 학습하시면 보안에 대한 이해가 깊어질 것입니다.',
  strengths: ['JWT 구조', 'HTTP 인증'],
  weaknesses: ['해싱 알고리즘', '암호화 vs 해싱'],
  relatedConcepts: [
    {
      title: 'bcrypt vs SHA-256',
      description: '비밀번호 해싱을 위한 알고리즘 비교',
      link: 'https://en.wikipedia.org/wiki/Bcrypt',
    },
    {
      title: 'JWT 공식 문서',
      description: 'JSON Web Token 표준 스펙',
      link: 'https://jwt.io/introduction',
    },
  ],
}

function ResultPage() {
  const navigate = useNavigate()

  const handleReviewIn3Days = () => {
    // TODO: Schedule review
    console.log('Review scheduled for 3 days later')
  }

  const handleBackToCommits = () => {
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex flex-col space-y-6 pb-6">
      {/* Score Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {MOCK_RESULT.score}/{MOCK_RESULT.total}
              </h1>
              <p className="text-lg text-gray-700 mt-2">정답률 {MOCK_RESULT.percentage}%</p>
            </div>
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="h-4 w-4" />
                {MOCK_RESULT.timeSpent}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Comment */}
      <Alert className="bg-purple-50 border-purple-200">
        <AlertDescription className="text-sm text-purple-900">
          💬 {MOCK_RESULT.aiComment}
        </AlertDescription>
      </Alert>

      {/* Learning Analysis */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">학습 성과 분석</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-gray-900">잘 이해한 개념</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MOCK_RESULT.strengths.map((strength, index) => (
                <Badge key={index} className="bg-green-100 text-green-700 border-green-300">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
          <Separator className="bg-gray-200" />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-900">보완이 필요한 개념</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MOCK_RESULT.weaknesses.map((weakness, index) => (
                <Badge key={index} className="bg-red-100 text-red-700 border-red-300">
                  {weakness}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Answers */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">상세 해설</h2>
        {MOCK_RESULT.answers.map((answer, index) => (
          <Card
            key={answer.questionId}
            className={`${
              answer.isCorrect
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                {answer.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <CardTitle className="text-sm text-gray-900">
                    {index + 1}. {answer.question}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-gray-600">내 답변</p>
                <p
                  className={`text-sm ${answer.isCorrect ? 'text-green-700' : 'text-red-700'} font-medium`}
                >
                  {answer.userAnswer}
                </p>
              </div>
              {!answer.isCorrect && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">정답</p>
                  <p className="text-sm text-green-700 font-medium">{answer.correctAnswer}</p>
                </div>
              )}
              <Alert className="bg-white border-gray-200">
                <AlertDescription className="text-xs text-gray-700">
                  {answer.explanation}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Related Concepts */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            관련 학습 자료
          </CardTitle>
          <CardDescription className="text-xs">
            더 깊이 학습하고 싶다면 아래 자료를 참고하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOCK_RESULT.relatedConcepts.map((concept, index) => (
            <a
              key={index}
              href={concept.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
            >
              <p className="text-sm font-medium text-gray-900">{concept.title}</p>
              <p className="text-xs text-gray-600 mt-1">{concept.description}</p>
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Review Schedule */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            복습 관리
          </CardTitle>
          <CardDescription className="text-xs">
            효과적인 학습을 위해 복습 일정을 설정하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={handleReviewIn3Days}
            variant="outline"
            className="w-full border-gray-300 text-gray-900 hover:bg-gray-100"
          >
            3일 후 복습하기
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-900 hover:bg-gray-100"
          >
            7일 후 복습하기
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Button
        onClick={handleBackToCommits}
        variant="outline"
        className="w-full border-gray-300 text-gray-900 hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        커밋 목록으로 돌아가기
      </Button>
    </div>
  )
}

export const Route = createFileRoute('/session/$commitSha/result')({
  component: ResultPage,
})
