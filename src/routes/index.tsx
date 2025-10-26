import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Code2, Brain, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/home' })
    }
  }, [isAuthenticated, navigate])

  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth flow
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'YOUR_CLIENT_ID'
    const redirectUri = `${window.location.origin}/auth/callback`
    const scope = 'read:user,user:email,repo'

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  }

  const handleDevLogin = () => {
    // Development only: Quick login for testing
    localStorage.setItem('github_token', 'dev_token_123')
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full space-y-8 max-w-2xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Commit Tutor</h1>
        <p className="text-xl text-gray-700">내가 짠 코드가 교사가 된다</p>
        <p className="text-sm text-gray-600">
          GitHub 커밋으로 배우는
          <br />
          나만의 코드 학습 플랫폼
        </p>
      </div>

      {/* Login Buttons */}
      <div className="w-full max-w-xs space-y-3">
        <Button
          size="lg"
          onClick={handleGithubLogin}
          className="w-full bg-gray-900 text-white hover:bg-gray-800"
        >
          <Github className="mr-2 h-5 w-5" />
          GitHub으로 시작하기
        </Button>

        {/* Development Mode Login */}
        <Button
          size="lg"
          onClick={handleDevLogin}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          개발자 모드 로그인
        </Button>
      </div>

      {/* Features */}
      <div className="w-full space-y-3 mt-8">
        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-gray-900">
              <Code2 className="mr-2 h-4 w-4 text-blue-600" />
              AI 코드 리뷰
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs text-gray-600">
              커밋마다 AI가 코드를 분석하고 개선점을 제안합니다
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-gray-900">
              <Brain className="mr-2 h-4 w-4 text-purple-600" />
              맞춤형 퀴즈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs text-gray-600">
              내 코드를 기반으로 실전 퀴즈를 자동 생성합니다
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-gray-900">
              <Trophy className="mr-2 h-4 w-4 text-yellow-600" />
              학습 성과 추적
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs text-gray-600">
              학습 데이터를 분석하여 성장을 시각화합니다
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: LandingPage,
})
