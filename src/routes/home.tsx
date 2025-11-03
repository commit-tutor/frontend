import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  BookOpen,
  
  Clock,
  Target,
  GitBranch,
  Brain,
  Trophy,
  ArrowRight,
} from 'lucide-react'

// Mock data
const MOCK_STATS = {
  totalCommitsLearned: 12,
  totalQuizzesTaken: 45,
  averageScore: 78,
  currentStreak: 5,
  weeklyGoal: {
    commits: { current: 8, target: 10 },
    quizzes: { current: 32, target: 35 },
  },
}

const MOCK_RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'commit',
    title: 'feat: Add user authentication',
    repository: 'awesome-project',
    score: 85,
    date: '2시간 전',
  },
  {
    id: '2',
    type: 'quiz',
    title: 'React Hooks 퀴즈',
    score: 90,
    date: '5시간 전',
  },
  {
    id: '3',
    type: 'commit',
    title: 'fix: Resolve memory leak',
    repository: 'backend-api',
    score: 72,
    date: '어제',
  },
]

const MOCK_RECOMMENDATIONS = [
  {
    id: '1',
    repository: 'awesome-project',
    commitMessage: 'refactor: Improve component structure',
    learningValue: 'high',
  },
  {
    id: '2',
    repository: 'python-ml',
    commitMessage: 'feat: Add machine learning pipeline',
    learningValue: 'high',
  },
]

function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          안녕하세요, {user?.username}님! 👋
        </h1>
        <p className="text-gray-600 mt-2">오늘도 코드로 배우는 하루를 시작해보세요</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              학습한 커밋
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{MOCK_STATS.totalCommitsLearned}</p>
            <p className="text-xs text-gray-500 mt-1">총 커밋 수</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              완료한 퀴즈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{MOCK_STATS.totalQuizzesTaken}</p>
            <p className="text-xs text-gray-500 mt-1">총 문제 수</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              평균 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{MOCK_STATS.averageScore}%</p>
            <p className="text-xs text-gray-500 mt-1">퀴즈 평균</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              연속 학습
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{MOCK_STATS.currentStreak}일</p>
            <p className="text-xs text-gray-500 mt-1">현재 스트릭</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            주간 목표
          </CardTitle>
          <CardDescription>이번 주 학습 진행 상황</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">커밋 학습</span>
              <span className="font-medium text-gray-900">
                {MOCK_STATS.weeklyGoal.commits.current} / {MOCK_STATS.weeklyGoal.commits.target}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-900 h-2 rounded-full transition-all"
                style={{
                  width: `${getProgressPercentage(
                    MOCK_STATS.weeklyGoal.commits.current,
                    MOCK_STATS.weeklyGoal.commits.target,
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">퀴즈 풀기</span>
              <span className="font-medium text-gray-900">
                {MOCK_STATS.weeklyGoal.quizzes.current} / {MOCK_STATS.weeklyGoal.quizzes.target}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-900 h-2 rounded-full transition-all"
                style={{
                  width: `${getProgressPercentage(
                    MOCK_STATS.weeklyGoal.quizzes.current,
                    MOCK_STATS.weeklyGoal.quizzes.target,
                  )}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              최근 활동
            </CardTitle>
            <CardDescription>최근 학습 기록</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_RECENT_ACTIVITY.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'commit'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {activity.type === 'commit' ? (
                    <GitBranch className="h-5 w-5" />
                  ) : (
                    <Brain className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  {activity.type === 'commit' && (
                    <p className="text-xs text-gray-500">{activity.repository}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.score}점
                    </Badge>
                    <span className="text-xs text-gray-500">{activity.date}</span>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate({ to: '/learning-history' })}
            >
              전체 기록 보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Recommended Commits */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              추천 학습
            </CardTitle>
            <CardDescription>학습하기 좋은 커밋</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-900">{rec.commitMessage}</p>
                  <Badge className="bg-green-100 text-green-700 border-green-300 flex-shrink-0">
                    추천
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">{rec.repository}</p>
                <Button
                  size="sm"
                  className="w-full bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => navigate({ to: '/dashboard' })}
                >
                  학습 시작
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate({ to: '/dashboard' })}
            >
              더 많은 커밋 보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/home')({
  component: HomePage,
})
