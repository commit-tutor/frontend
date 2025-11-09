import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code2, Brain, Loader2 } from 'lucide-react'
import { useQuiz } from '@/hooks/useQuiz'
import { CodeReviewTab } from '@/components/session/CodeReviewTab'
import { QuizTab } from '@/components/session/QuizTab'
import {
  learningApi,
  repoApi,
  type QuizQuestion,
  type AIAnalysis,
  type CommitDiffInfo,
} from '@/lib/api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

// Mock data - 실제 코드 변경사항 기반
const MOCK_COMMIT = {
  sha: 'abc123',
  message: 'feat: Add user authentication with JWT',
  author: 'johndoe',
  date: '2025-10-25',
}

const MOCK_AI_ANALYSIS = {
  summary:
    '이 커밋은 JWT를 사용한 사용자 인증 시스템을 구현했습니다. Express 미들웨어와 함께 토큰 기반 인증을 설정하고, 보안을 강화하기 위한 여러 조치를 취했습니다.',
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
      type: 'multiple' as const,
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
      explanation:
        'JWT 인증에서는 "Bearer <token>" 형식으로 전송되므로, split(" ")[1]을 사용하여 실제 토큰 부분만 추출합니다.',
    },
    {
      id: '2',
      type: 'multiple' as const,
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
      explanation:
        'bcrypt의 SALT_ROUNDS는 cost factor로, 2^10 = 1024번의 해싱 라운드를 의미합니다. 값이 클수록 더 안전하지만 느려집니다.',
    },
    {
      id: '3',
      type: 'multiple' as const,
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
      explanation:
        '토큰이 존재하지만 유효하지 않은 경우 403 Forbidden을 반환합니다. 401은 토큰이 없을 때 사용됩니다.',
    },
    {
      id: '4',
      type: 'short' as const,
      question: '이 코드에서 JWT_SECRET을 어디에서 가져오나요? (process.env.? 형식으로 답하세요)',
      codeContext: `const JWT_SECRET = process.env.JWT_SECRET;`,
      correctAnswer: 'JWT_SECRET',
      explanation: '환경 변수에서 JWT_SECRET을 가져와 보안을 강화합니다. 하드코딩하면 안 됩니다.',
    },
  ],
}

/**
 * 학습 세션 페이지 - 코드 리뷰 & 퀴즈
 * 컨테이너 컴포넌트: 비즈니스 로직과 데이터 관리
 */
function SessionPage() {
  const navigate = useNavigate()
  const { commitSha } = Route.useParams()
  const [activeTab, setActiveTab] = useState('review')

  // 데이터 상태
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [commitFiles, setCommitFiles] = useState<CommitDiffInfo[]>([])
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true)
  const [isLoadingReview, setIsLoadingReview] = useState(true)
  const [isLoadingFiles, setIsLoadingFiles] = useState(true)
  const [quizError, setQuizError] = useState<string | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [filesError, setFilesError] = useState<string | null>(null)

  // 퀴즈 로직을 커스텀 훅으로 분리
  const quiz = useQuiz(quizQuestions)

  // 컴포넌트 마운트 시 퀴즈와 리뷰 생성
  useEffect(() => {
    const loadLearningData = async () => {
      // commitSha 파라미터는 쉼표로 구분된 여러 커밋을 포함할 수 있음
      // 형식: "repoId:sha1,repoId:sha2,repoId:sha3"
      const commitIdentifiers = commitSha.split(',').map((id) => id.trim())

      console.log('📦 선택된 커밋 개수:', commitIdentifiers.length)
      console.log('📦 커밋 식별자:', commitIdentifiers)

      // 첫 번째 커밋의 repoIdentifier와 sha 분리 (파일 정보용)
      const [repoIdentifier, firstSha] = commitIdentifiers[0].split(':')

      // 1. 첫 번째 커밋의 상세 정보 (diff 포함) 가져오기 - 코드 리뷰 탭에 표시용
      try {
        setIsLoadingFiles(true)
        const commitDetails = await repoApi.getCommitDetails(repoIdentifier, firstSha)
        setCommitFiles(commitDetails.files)
        setFilesError(null)
        console.log('✅ 커밋 파일 정보 로드 완료:', commitDetails.files.length, '개')
      } catch (error) {
        console.error('❌ 커밋 상세 정보 로딩 실패:', error)
        setFilesError(error instanceof Error ? error.message : '파일 정보를 가져올 수 없습니다.')
        setCommitFiles([])
      } finally {
        setIsLoadingFiles(false)
      }

      // 2. 퀴즈 생성 - 모든 선택된 커밋 사용
      try {
        setIsLoadingQuiz(true)
        console.log('🎯 퀴즈 생성 요청: ', commitIdentifiers)
        const quizResponse = await learningApi.generateQuiz({
          commitShas: commitIdentifiers, // 모든 커밋 전달
          difficulty: 'medium',
          questionCount: 5,
        })
        setQuizQuestions(quizResponse.questions)
        setQuizError(null)
        console.log('✅ 퀴즈 생성 완료:', quizResponse.questions.length, '개')
      } catch (error) {
        console.error('❌ 퀴즈 생성 실패:', error)
        setQuizError(error instanceof Error ? error.message : '퀴즈를 생성할 수 없습니다.')
        // 폴백: Mock 데이터 사용
        setQuizQuestions(MOCK_QUIZ.questions as QuizQuestion[])
      } finally {
        setIsLoadingQuiz(false)
      }

      // 3. 코드 리뷰 생성 - 첫 번째 커밋 사용 (여러 커밋 리뷰는 향후 개선)
      try {
        setIsLoadingReview(true)
        console.log('📝 코드 리뷰 생성 요청: ', commitIdentifiers[0])
        const reviewResponse = await learningApi.generateReview({
          commitSha: commitIdentifiers[0],
        })
        setAiAnalysis(reviewResponse)
        setReviewError(null)
        console.log('✅ 코드 리뷰 생성 완료')
      } catch (error) {
        console.error('❌ 리뷰 생성 실패:', error)
        setReviewError(error instanceof Error ? error.message : '리뷰를 생성할 수 없습니다.')
        // 폴백: Mock 데이터 사용
        setAiAnalysis(MOCK_AI_ANALYSIS)
      } finally {
        setIsLoadingReview(false)
      }
    }

    loadLearningData()
  }, [commitSha])

  const handleSubmitQuiz = () => {
    navigate({ to: `/session/${commitSha}/result` })
  }

  // 선택된 커밋 개수 계산
  const commitCount = commitSha.split(',').length

  return (
    <div className="flex flex-col space-y-4">
      {/* Commit Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
          {commitCount > 1 ? `${commitCount}개의 커밋 학습` : MOCK_COMMIT.message}
        </h1>
        <p className="text-xs text-gray-600">
          {commitCount > 1
            ? `선택된 ${commitCount}개 커밋을 기반으로 퀴즈와 코드 리뷰 생성`
            : `${MOCK_COMMIT.author} · ${MOCK_COMMIT.date} · ${commitSha.slice(0, 7)}`}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            커밋 분석
            {isLoadingReview && <Loader2 className="h-3 w-3 animate-spin" />}
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            퀴즈
            {isLoadingQuiz && <Loader2 className="h-3 w-3 animate-spin" />}
          </TabsTrigger>
        </TabsList>

        {/* Code Review Tab */}
        <TabsContent value="review" className="mt-4">
          {reviewError && (
            <Alert className="mb-4 border-yellow-500 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                {reviewError} (Mock 데이터를 표시합니다)
              </AlertDescription>
            </Alert>
          )}
          {filesError && (
            <Alert className="mb-4 border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                파일 변경사항 로딩 실패: {filesError}
              </AlertDescription>
            </Alert>
          )}
          {isLoadingReview || isLoadingFiles ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">
                {isLoadingFiles ? '코드 변경사항을 불러오는 중...' : 'AI가 코드를 분석하는 중...'}
              </span>
            </div>
          ) : (
            <CodeReviewTab analysis={aiAnalysis || MOCK_AI_ANALYSIS} files={commitFiles} />
          )}
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="mt-4">
          {quizError && (
            <Alert className="mb-4 border-yellow-500 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                {quizError} (Mock 데이터를 표시합니다)
              </AlertDescription>
            </Alert>
          )}
          {isLoadingQuiz ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">퀴즈를 생성하는 중...</span>
            </div>
          ) : quizQuestions.length > 0 ? (
            <QuizTab
              questions={quizQuestions}
              currentQuestionIndex={quiz.currentQuestionIndex}
              currentQuestion={quiz.currentQuestion}
              totalQuestions={quiz.totalQuestions}
              isLastQuestion={quiz.isLastQuestion}
              isFirstQuestion={quiz.isFirstQuestion}
              quizAnswers={quiz.quizAnswers}
              answeredCount={quiz.answeredCount}
              hasAnsweredCurrentQuestion={quiz.hasAnsweredCurrentQuestion}
              onAnswer={quiz.handleAnswer}
              onNext={quiz.handleNext}
              onPrevious={quiz.handlePrevious}
              onSubmit={handleSubmitQuiz}
              goToQuestion={quiz.goToQuestion}
            />
          ) : (
            <div className="text-center py-12 text-gray-600">퀴즈를 생성할 수 없습니다.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/session/$commitSha/')({
  component: SessionPage,
})
