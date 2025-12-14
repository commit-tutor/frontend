import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Code2, Brain, Trophy, Zap, Target } from 'lucide-react'

export function LandingSection() {
  const handleGithubLogin = async () => {
    try {
      const { authApi } = await import('@/lib/api')
      const { auth_url } = await authApi.getGithubLoginUrl()
      window.location.href = auth_url
    } catch (error) {
      console.error('GitHub 로그인 URL 가져오기 실패:', error)
      alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-12 max-w-4xl mx-auto px-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-900 mb-4">
          <Code2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          내가 작성한 코드가
          <br />
          나만의 선생님이 됩니다
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          GitHub 커밋을 AI가 분석해서 맞춤형 퀴즈와 코드 리뷰를 자동 생성합니다
        </p>

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleGithubLogin}
            className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg"
          >
            <Github className="mr-2 h-5 w-5" />
            GitHub으로 5초만에 시작하기
          </Button>
        </div>

        <p className="text-sm text-gray-500 pt-2">
          💡 GitHub 계정만 있으면 바로 시작 • 무료로 사용 가능
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <Code2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-gray-900">AI 코드 리뷰</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">
              시니어 개발자처럼 코드를 분석하고 개선점을 제안합니다
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg text-gray-900">맞춤형 퀴즈</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">
              내 코드 패턴을 분석하여 실전 문제를 자동 생성합니다
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-100 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-3">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-lg text-gray-900">학습 진도 추적</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">
              학습 데이터를 분석하여 성장 과정을 시각화합니다
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="w-full space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">🔄 이렇게 작동합니다</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">저장소 연동</h3>
              <p className="text-sm text-gray-600">GitHub 계정 연결</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">커밋 선택</h3>
              <p className="text-sm text-gray-600">학습할 커밋 고르기</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI 분석</h3>
              <p className="text-sm text-gray-600">코드 자동 분석</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">학습 시작</h3>
              <p className="text-sm text-gray-600">퀴즈 풀고 복습하기</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="w-full bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            이런 분들께 추천합니다
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">주니어 개발자</h4>
            </div>
            <p className="text-sm text-gray-600">코드 리뷰 받을 기회가 적을 때</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">사이드 프로젝트</h4>
            </div>
            <p className="text-sm text-gray-600">혼자 공부하며 개발할 때</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <h4 className="font-semibold text-gray-900">취업 준비생</h4>
            </div>
            <p className="text-sm text-gray-600">내 코드 품질 체크하고 싶을 때</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4 pt-8">
        <h3 className="text-2xl font-bold text-gray-900">지금 바로 시작해보세요</h3>
        <Button
          size="lg"
          onClick={handleGithubLogin}
          className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg"
        >
          <Github className="mr-2 h-5 w-5" />
          무료로 시작하기
        </Button>
        <p className="text-xs text-gray-500">저장소 접근 권한은 학습 목적으로만 사용됩니다</p>
      </div>
    </div>
  )
}
