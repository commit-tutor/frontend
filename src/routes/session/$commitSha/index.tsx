import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Code2, Brain, AlertCircle, Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

// Mock data - 실제 코드 변경사항 기반
const MOCK_COMMIT = {
  sha: 'abc123',
  message: 'feat: Add user authentication with JWT',
  author: 'johndoe',
  date: '2025-10-25',
  files: [
    {
      path: 'src/auth/middleware.js',
      diff: `@@ -1,10 +1,25 @@
-const validateUser = (req, res, next) => {
-  const token = req.headers.authorization;
-  if (!token) {
-    return res.status(401).json({ error: 'No token' });
-  }
-  next();
-};
+const jwt = require('jsonwebtoken');
+const bcrypt = require('bcrypt');
+
+const SALT_ROUNDS = 10;
+const JWT_SECRET = process.env.JWT_SECRET;
+
+const hashPassword = async (password) => {
+  return await bcrypt.hash(password, SALT_ROUNDS);
+};
+
+const validateToken = (req, res, next) => {
+  const authHeader = req.headers.authorization;
+  const token = authHeader?.split(' ')[1]; // Bearer <token>
+
+  if (!token) {
+    return res.status(401).json({ error: 'No token provided' });
+  }
+
+  try {
+    const decoded = jwt.verify(token, JWT_SECRET);
+    req.user = decoded;
+    next();
+  } catch (error) {
+    return res.status(403).json({ error: 'Invalid token' });
+  }
+};`,
    },
  ],
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

// 코드 변경사항 기반으로 생성된 퀴즈
const MOCK_QUIZ = {
  questions: [
    {
      id: '1',
      type: 'multiple',
      question: '코드 변경사항에서 Authorization 헤더를 파싱할 때 split(" ")[1]을 사용하는 이유는?',
      codeContext: `const authHeader = req.headers.authorization;
const token = authHeader?.split(' ')[1]; // Bearer <token>`,
      options: [
        '"Bearer " 접두사를 제거하고 실제 토큰만 추출하기 위해',
        '토큰을 두 부분으로 나누어 검증하기 위해',
        '공백을 제거하기 위해',
        '배열로 변환하기 위해',
      ],
      correctAnswer: 0,
      explanation: 'JWT 인증에서는 "Bearer <token>" 형식으로 전송되므로, split(" ")[1]을 사용하여 실제 토큰 부분만 추출합니다.',
    },
    {
      id: '2',
      type: 'multiple',
      question: '이 커밋에서 bcrypt의 SALT_ROUNDS가 10으로 설정되어 있습니다. 이 값의 의미는?',
      codeContext: `const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};`,
      options: [
        '해싱을 10번 반복한다',
        '2^10번의 해싱 라운드를 수행한다',
        '10자리 salt를 생성한다',
        '10초 동안 해싱한다',
      ],
      correctAnswer: 1,
      explanation: 'bcrypt의 SALT_ROUNDS는 cost factor로, 2^10 = 1024번의 해싱 라운드를 의미합니다. 값이 클수록 더 안전하지만 느려집니다.',
    },
    {
      id: '3',
      type: 'multiple',
      question: '변경된 코드에서 토큰 검증 실패 시 어떤 HTTP 상태 코드를 반환하나요?',
      codeContext: `try {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
} catch (error) {
  return res.status(403).json({ error: 'Invalid token' });
}`,
      options: ['401 Unauthorized', '403 Forbidden', '400 Bad Request', '500 Internal Server Error'],
      correctAnswer: 1,
      explanation: '토큰이 존재하지만 유효하지 않은 경우 403 Forbidden을 반환합니다. 401은 토큰이 없을 때 사용됩니다.',
    },
    {
      id: '4',
      type: 'short',
      question: '이 코드에서 JWT_SECRET을 어디에서 가져오나요? (process.env.? 형식으로 답하세요)',
      codeContext: `const JWT_SECRET = process.env.JWT_SECRET;`,
      correctAnswer: 'JWT_SECRET',
      explanation: '환경 변수에서 JWT_SECRET을 가져와 보안을 강화합니다. 하드코딩하면 안 됩니다.',
    },
  ],
}

function SessionPage() {
  const navigate = useNavigate()
  const { commitSha } = Route.useParams()
  const [activeTab, setActiveTab] = useState('review')
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number | string | null }>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const currentQuestion = MOCK_QUIZ.questions[currentQuestionIndex]
  const totalQuestions = MOCK_QUIZ.questions.length
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const isFirstQuestion = currentQuestionIndex === 0

  const handleQuizAnswer = (questionId: string, answer: number | string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    navigate({ to: `/session/${commitSha}/result` })
  }

  const hasAnsweredCurrentQuestion = quizAnswers[currentQuestion.id] !== undefined && quizAnswers[currentQuestion.id] !== null
  const answeredCount = Object.keys(quizAnswers).filter(
    (key) => quizAnswers[key] !== undefined && quizAnswers[key] !== null
  ).length

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
          {/* Progress Info */}
          <div className="flex items-center justify-between">
            <Alert className="bg-blue-50 border-blue-200 flex-1">
              <AlertDescription className="text-sm text-blue-900">
                코드 변경사항 기반 퀴즈 ({answeredCount}/{totalQuestions} 완료)
              </AlertDescription>
            </Alert>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Number Indicators */}
          <div className="flex gap-2 justify-center">
            {MOCK_QUIZ.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-gray-900 text-white'
                    : quizAnswers[MOCK_QUIZ.questions[index].id] !== undefined &&
                      quizAnswers[MOCK_QUIZ.questions[index].id] !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Current Question Card */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base text-gray-900 mb-2">
                    문제 {currentQuestionIndex + 1}. {currentQuestion.question}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit text-xs">
                    {currentQuestion.type === 'multiple' ? '객관식' : '단답형'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Code Context */}
              {currentQuestion.codeContext && (
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-gray-100 font-mono">{currentQuestion.codeContext}</pre>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-2">
                {currentQuestion.type === 'multiple' && 'options' in currentQuestion && currentQuestion.options ? (
                  currentQuestion.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => handleQuizAnswer(currentQuestion.id, oIndex)}
                      className={`w-full text-left p-3 rounded border transition-colors ${
                        quizAnswers[currentQuestion.id] === oIndex
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
                    value={(quizAnswers[currentQuestion.id] as string) || ''}
                    onChange={(e) => handleQuizAnswer(currentQuestion.id, e.target.value)}
                    className="w-full p-3 rounded bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-900"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
              variant="outline"
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              이전
            </Button>

            {!isLastQuestion ? (
              <Button
                onClick={handleNextQuestion}
                disabled={!hasAnsweredCurrentQuestion}
                className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
              >
                다음
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                disabled={answeredCount !== totalQuestions}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                제출하기
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/session/$commitSha/')({
  component: SessionPage,
})
