import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, GitBranch, Brain, Trophy, Target, Calendar } from 'lucide-react'

const MOCK_STATS = {
  overview: {
    totalCommits: 24,
    totalQuizzes: 87,
    averageScore: 82,
    totalStudyTime: '12시간 35분',
  },
  skillProgress: [
    { skill: 'React', level: 85, trend: '+12%' },
    { skill: 'TypeScript', level: 78, trend: '+8%' },
    { skill: 'Node.js', level: 72, trend: '+15%' },
    { skill: 'Python', level: 65, trend: '+5%' },
  ],
  weeklyActivity: [
    { day: '월', commits: 2, quizzes: 8 },
    { day: '화', commits: 3, quizzes: 12 },
    { day: '수', commits: 1, quizzes: 6 },
    { day: '목', commits: 4, quizzes: 15 },
    { day: '금', commits: 2, quizzes: 9 },
    { day: '토', commits: 0, quizzes: 3 },
    { day: '일', commits: 1, quizzes: 5 },
  ],
}

function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">통계</h1>
        <p className="text-gray-600 mt-2">학습 성과를 한눈에 확인하세요</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              총 학습 커밋
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{MOCK_STATS.overview.totalCommits}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              총 퀴즈 문제
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{MOCK_STATS.overview.totalQuizzes}</p>
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
            <p className="text-3xl font-bold text-gray-900">{MOCK_STATS.overview.averageScore}%</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              총 학습 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.overview.totalStudyTime}</p>
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            기술 스택 성장도
          </CardTitle>
          <CardDescription>각 기술별 학습 진행도</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_STATS.skillProgress.map((skill) => (
            <div key={skill.skill}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                    {skill.trend}
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">{skill.level}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            주간 활동
          </CardTitle>
          <CardDescription>이번 주 학습 활동</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {MOCK_STATS.weeklyActivity.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-xs text-gray-500 mb-2">{day.day}</p>
                <div className="space-y-1">
                  <div
                    className="bg-blue-100 rounded p-2 text-center"
                    title={`커밋 ${day.commits}개`}
                  >
                    <GitBranch className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <p className="text-xs font-medium text-blue-900">{day.commits}</p>
                  </div>
                  <div
                    className="bg-purple-100 rounded p-2 text-center"
                    title={`퀴즈 ${day.quizzes}개`}
                  >
                    <Brain className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <p className="text-xs font-medium text-purple-900">{day.quizzes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/statistics')({
  component: StatisticsPage,
})
