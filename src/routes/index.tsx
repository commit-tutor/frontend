import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Code2, Brain, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()

  // 이미 로그인한 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/home' })
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleGithubLogin = async () => {
    try {
      // 백엔드 API를 통해 GitHub OAuth URL 가져오기
      const { authApi } = await import('@/lib/api')
      const { auth_url } = await authApi.getGithubLoginUrl()

      // GitHub OAuth 페이지로 리다이렉트
      window.location.href = auth_url
    } catch (error) {
      console.error('GitHub 로그인 URL 가져오기 실패:', error)
      alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 로딩 중이면 아무것도 표시하지 않음
  if (isLoading) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full space-y-8 max-w-2xl mx-auto px-4">
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

      {/* Login Button */}
      <div className="w-full max-w-xs">
        <Button
          size="lg"
          onClick={handleGithubLogin}
          className="w-full bg-gray-900 text-white hover:bg-gray-800"
        >
          <Github className="mr-2 h-5 w-5" />
          GitHub으로 시작하기
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

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8">
        <p>GitHub 계정으로 간편하게 시작하세요</p>
        <p className="mt-1">저장소 접근 권한은 학습 목적으로만 사용됩니다</p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: LandingPage,
})
