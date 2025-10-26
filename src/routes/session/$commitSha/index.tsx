import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Code2, Brain, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

// Mock data
const MOCK_COMMIT = {
  sha: 'abc123',
  message: 'feat: Add user authentication with JWT',
  author: 'johndoe',
  date: '2025-10-25',
}

const MOCK_AI_ANALYSIS = {
  summary: '이 커밋은 JWT를 사용한 사용자 인증 시스템을 구현했습니다. Express 미들웨어와 함께 토큰 기반 인증을 설정하고, 보안을 강화하기 위한 여러 조치를 취했습니다.',
  quality: {
    readability: 85,
    performance: 78,
    security: 92,
  },
  suggestions: [
    '환경 변수로 JWT secret을 관리하는 것이 좋습니다',
    'Token 만료 시간을 설정하여 보안을 강화하세요',
    '에러 핸들링을 더 구체적으로 개선할 수 있습니다',
  ],
  potentialBugs: ['비밀번호 해싱 알고리즘의 salt rounds가 너무 낮을 수 있습니다'],
}

const MOCK_QUIZ = {
  questions: [
    {
      id: '1',
      type: 'multiple',
      question: 'JWT에서 "Bearer" 접두사를 사용하는 이유는 무엇인가요?',
      options: [
        'HTTP 인증 스킴을 명시하기 위해',
        '토큰을 암호화하기 위해',
        '서버에서 요구하는 필수 형식',
        '보안을 강화하기 위해',
      ],
      correctAnswer: 0,
      userAnswer: null,
    },
    {
      id: '2',
      type: 'multiple',
      question: '이 코드에서 사용된 해싱 알고리즘은?',
      options: ['MD5', 'SHA-256', 'bcrypt', 'PBKDF2'],
      correctAnswer: 2,
      userAnswer: null,
    },
    {
      id: '3',
      type: 'short',
      question: 'JWT 토큰은 몇 개의 부분으로 구성되나요?',
      correctAnswer: '3',
      userAnswer: null,
    },
  ],
}

function SessionPage() {
  const navigate = useNavigate()
  const { commitSha } = Route.useParams()
  const [activeTab, setActiveTab] = useState('review')
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number | string | null }>({})

  const handleQuizAnswer = (questionId: string, answer: number | string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmitQuiz = () => {
    navigate({ to: `/session/${commitSha}/result` })
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Commit Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{MOCK_COMMIT.message}</h1>
        <p className="text-xs text-gray-600">
          {MOCK_COMMIT.author} · {MOCK_COMMIT.date} · {commitSha.slice(0, 7)}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            코드 리뷰
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            퀴즈
          </TabsTrigger>
        </TabsList>

        {/* Code Review Tab */}
        <TabsContent value="review" className="space-y-4 mt-4">
          {/* AI Summary */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-base text-gray-900">AI 분석 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{MOCK_AI_ANALYSIS.summary}</p>
            </CardContent>
          </Card>

          {/* Code Quality */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-base text-gray-900">코드 품질</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(MOCK_AI_ANALYSIS.quality).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">{key}</span>
                    <span className="text-gray-900 font-medium">{value}/100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                개선 제안
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_AI_ANALYSIS.suggestions.map((suggestion, index) => (
                <Alert key={index} className="bg-gray-100 border-gray-200">
                  <AlertDescription className="text-sm text-gray-700">
                    • {suggestion}
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Potential Bugs */}
          {MOCK_AI_ANALYSIS.potentialBugs.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-gray-900 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  잠재적 이슈
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {MOCK_AI_ANALYSIS.potentialBugs.map((bug, index) => (
                  <Alert key={index} className="bg-white border-red-200">
                    <AlertDescription className="text-sm text-red-700">• {bug}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Diff Viewer Placeholder */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-base text-gray-900">코드 변경사항</CardTitle>
              <CardDescription className="text-xs">
                Side-by-side diff 뷰어가 여기 표시됩니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded p-4 text-xs font-mono">
                <div className="text-green-400">+ const token = jwt.sign(payload, secret)</div>
                <div className="text-red-400">- const token = createToken(payload)</div>
                <div className="text-gray-500">  return token</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="space-y-4 mt-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-900">
              AI가 이 커밋을 기반으로 {MOCK_QUIZ.questions.length}개의 퀴즈를 생성했습니다
            </AlertDescription>
          </Alert>

          {MOCK_QUIZ.questions.map((question, qIndex) => (
            <Card key={question.id} className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-gray-900">
                  {qIndex + 1}. {question.question}
                </CardTitle>
                <Badge variant="outline" className="w-fit text-xs">
                  {question.type === 'multiple' ? '객관식' : '단답형'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {question.type === 'multiple' && 'options' in question && question.options ? (
                  question.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => handleQuizAnswer(question.id, oIndex)}
                      className={`w-full text-left p-3 rounded border transition-colors ${
                        quizAnswers[question.id] === oIndex
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm">{option}</span>
                    </button>
                  ))
                ) : (
                  <input
                    type="text"
                    placeholder="답을 입력하세요"
                    onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                    className="w-full p-3 rounded bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-900"
                  />
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(quizAnswers).length !== MOCK_QUIZ.questions.length}
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
          >
            제출하기
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/session/$commitSha/')({
  component: SessionPage,
})
