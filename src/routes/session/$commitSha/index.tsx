import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code2, Brain, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuiz } from '@/hooks/useQuiz'
import { CodeReviewTab } from '@/components/session/CodeReviewTab'
import { QuizTab } from '@/components/session/QuizTab'
import { TopicSelector } from '@/components/session/TopicSelector'
import {
  learningApi,
  repoApi,
  type QuizQuestion,
  type CommitDiffInfo,
  type LearningTopic,
} from '@/lib/api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

/**
 * 학습 세션 페이지 - 코드 분석 & 퀴즈
 * 플로우: 1) 커밋 파일 로드 → 2) 주제 추출 → 3) 주제 선택 → 4) 퀴즈 생성 & 학습
 */
function SessionPage() {
  const navigate = useNavigate()
  const { commitSha } = Route.useParams()
  const [activeTab, setActiveTab] = useState('review')

  // Router state에서 커밋 정보 가져오기
  const routerState = (window.history.state as any)?.usr?.commitInfo

  // 데이터 상태
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [commitFiles, setCommitFiles] = useState<CommitDiffInfo[]>([])
  const [commitInfo, setCommitInfo] = useState<{
    sha: string
    message: string
    author: string
    date: string
  } | null>(routerState || null)
  const [topics, setTopics] = useState<LearningTopic[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  // 로딩 상태
  const [isLoadingFiles, setIsLoadingFiles] = useState(true)
  const [isLoadingTopics, setIsLoadingTopics] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [hasGeneratedAI, setHasGeneratedAI] = useState(false)
  const [hasExtractedTopics, setHasExtractedTopics] = useState(false)

  // 에러 상태
  const [filesError, setFilesError] = useState<string | null>(null)
  const [topicsError, setTopicsError] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  // 퀴즈 로직
  const quiz = useQuiz(quizQuestions)

  // 1단계: 페이지 진입 시 커밋 파일(diff) 정보 먼저 로드
  useEffect(() => {
    const loadCommitFiles = async () => {
      const commitIdentifiers = commitSha.split(',').map((id) => id.trim())

      console.log('📦 커밋 파일 정보 로드 시작:', commitIdentifiers)

      try {
        setIsLoadingFiles(true)

        // 모든 커밋의 파일 정보 가져오기
        const allFiles: CommitDiffInfo[] = []
        let firstCommitInfo = null

        for (const commitId of commitIdentifiers) {
          const [repoIdentifier, sha] = commitId.split(':')
          const response = await repoApi.getCommitDetails(repoIdentifier, sha)

          // 첫 번째 커밋의 정보를 헤더에 표시
          if (!firstCommitInfo) {
            firstCommitInfo = {
              sha: response.sha,
              message: response.message,
              author: response.author,
              date: response.date,
            }
          }

          // 모든 커밋의 파일을 수집
          if (response.files) {
            allFiles.push(...response.files)
          }
        }

        setCommitFiles(allFiles)
        setCommitInfo(firstCommitInfo)
        setFilesError(null)
        console.log(
          '✅ 커밋 파일 정보 로드 완료:',
          allFiles.length,
          '개 (',
          commitIdentifiers.length,
          '개 커밋)',
        )
      } catch (error) {
        console.error('❌ 커밋 파일 로드 실패:', error)
        setFilesError(error instanceof Error ? error.message : '파일 정보를 불러올 수 없습니다')
        setCommitFiles([])
      } finally {
        setIsLoadingFiles(false)
      }
    }

    loadCommitFiles()
  }, [commitSha])

  // 2단계: 주제 추출
  const handleExtractTopics = async () => {
    const commitIdentifiers = commitSha.split(',').map((id) => id.trim())

    console.log('🔍 주제 추출 시작')

    try {
      setIsLoadingTopics(true)
      setTopicsError(null)

      const topicsData = await learningApi.extractTopics({
        commitShas: commitIdentifiers,
      })

      setTopics(topicsData.topics)
      setHasExtractedTopics(true)
      console.log('✅ 주제 추출 완료:', topicsData.topics.length, '개')
    } catch (error) {
      console.error('❌ 주제 추출 실패:', error)
      const errorMessage =
        error instanceof Error ? error.message : '주제 추출 중 오류가 발생했습니다'
      setTopicsError(errorMessage)
    } finally {
      setIsLoadingTopics(false)
    }
  }

  // 3단계: 퀴즈 생성 (주제 선택 후)
  const handleGenerateAI = async () => {
    const commitIdentifiers = commitSha.split(',').map((id) => id.trim())

    console.log('🚀 퀴즈 생성 시작')

    try {
      setIsGeneratingAI(true)
      setAiError(null)

      const selectedTopic = selectedTopicId
        ? topics.find((t) => t.id === selectedTopicId)?.title
        : undefined

      const sessionData = await learningApi.generateLearningSession({
        commitShas: commitIdentifiers,
        difficulty: 'medium',
        questionCount: 5,
        selectedTopic,
      })

      // 퀴즈 설정
      setQuizQuestions(sessionData.quiz.questions)
      console.log('✅ 퀴즈 생성 완료:', sessionData.quiz.questions.length, '개')

      setHasGeneratedAI(true)

      // 퀴즈 탭으로 자동 전환
      setActiveTab('quiz')
    } catch (error) {
      console.error('❌ 퀴즈 생성 실패:', error)
      const errorMessage =
        error instanceof Error ? error.message : '퀴즈 생성 중 오류가 발생했습니다'
      setAiError(errorMessage)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleSubmitQuiz = () => {
    navigate({ to: `/session/${commitSha}/result` })
  }

  const commitCount = commitSha.split(',').length

  return (
    <div className="flex flex-col space-y-4">
      {/* Commit Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
          {commitCount > 1 ? `${commitCount}개의 커밋 학습` : commitInfo?.message || '로딩 중...'}
        </h1>
        <p className="text-xs text-gray-600">
          {commitCount > 1
            ? `선택된 ${commitCount}개 커밋을 기반으로 퀴즈 생성`
            : commitInfo
              ? `${commitInfo.author} · ${commitInfo.date} · ${commitInfo.sha.slice(0, 7)}`
              : '커밋 정보를 불러오는 중...'}
        </p>
      </div>

      {/* 주제 추출 버튼 - 파일 로딩 완료 후 & 주제 미추출 & 퀴즈 미생성 시 */}
      {!isLoadingFiles && !hasExtractedTopics && !hasGeneratedAI && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <Sparkles className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">학습 주제 추출</h3>
            <p className="text-sm text-gray-600 mb-4">
              커밋 코드를 분석하여 학습 가능한 주제를 추출합니다
            </p>
            <Button
              onClick={handleExtractTopics}
              disabled={isLoadingTopics}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
              size="lg"
            >
              {isLoadingTopics ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  주제 추출 중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  학습 주제 추출하기
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 주제 선택 및 퀴즈 생성 버튼 */}
      {hasExtractedTopics && !hasGeneratedAI && (
        <div className="space-y-4">
          <TopicSelector
            topics={topics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
          />
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
              size="lg"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  퀴즈 생성 중...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  {selectedTopicId ? '선택한 주제로 퀴즈 생성' : '전체 주제로 퀴즈 생성'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 퀴즈 생성 중 표시 */}
      {isGeneratingAI && (
        <Alert className="border-blue-500 bg-blue-50">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <AlertDescription className="text-blue-800">
            AI가 퀴즈를 생성하는 중입니다... (약 10-15초 소요)
          </AlertDescription>
        </Alert>
      )}

      {/* 주제 추출 에러 */}
      {topicsError && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            주제 추출 실패: {topicsError}
          </AlertDescription>
        </Alert>
      )}

      {/* 퀴즈 생성 에러 */}
      {aiError && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{aiError}</AlertDescription>
        </Alert>
      )}

      {/* Tabs - 파일 로딩 완료 후 표시 */}
      {!isLoadingFiles && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="review" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              코드 변경사항
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="flex items-center gap-2"
              disabled={!hasGeneratedAI}
            >
              <Brain className="h-4 w-4" />
              퀴즈
              {!hasGeneratedAI && <span className="text-xs">(생성 필요)</span>}
            </TabsTrigger>
          </TabsList>

          {/* Code Review Tab - diff는 항상 표시 (AI 리뷰 없음) */}
          <TabsContent value="review" className="mt-4">
            {filesError && (
              <Alert className="mb-4 border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  파일 변경사항 로딩 실패: {filesError}
                </AlertDescription>
              </Alert>
            )}
            <CodeReviewTab analysis={null} files={commitFiles} />
          </TabsContent>

          {/* Quiz Tab - 퀴즈 생성 후 표시 */}
          <TabsContent value="quiz" className="mt-4">
            {hasGeneratedAI && quizQuestions.length > 0 ? (
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
                submittedAnswers={quiz.submittedAnswers}
                hasSubmittedCurrentQuestion={quiz.hasSubmittedCurrentQuestion}
                onAnswer={quiz.handleAnswer}
                onSubmitAnswer={quiz.handleSubmitAnswer}
                onNext={quiz.handleNext}
                onPrevious={quiz.handlePrevious}
                onSubmit={handleSubmitQuiz}
                goToQuestion={quiz.goToQuestion}
              />
            ) : (
              <div className="text-center py-12 text-gray-600">퀴즈를 먼저 생성해주세요</div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* 파일 로딩 중 */}
      {isLoadingFiles && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600">커밋 정보를 불러오는 중...</span>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/session/$commitSha/')({
  component: SessionPage,
})
