import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

function AuthCallbackPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const hasProcessed = useRef(false)

  useEffect(() => {
    // 이미 처리했으면 중복 실행 방지
    if (hasProcessed.current) {
      return
    }

    const handleCallback = async () => {
      try {
        hasProcessed.current = true

        // URL에서 code 파라미터 추출
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const errorParam = params.get('error')

        // GitHub에서 에러를 반환한 경우
        if (errorParam) {
          const errorDescription = params.get('error_description') || '인증에 실패했습니다.'
          throw new Error(errorDescription)
        }

        // code가 없는 경우
        if (!code) {
          throw new Error('GitHub 인증 코드를 찾을 수 없습니다.')
        }

        // 백엔드 API로 code를 보내서 토큰 교환
        const needsOnboarding = await login(code)

        // 온보딩 필요 여부에 따라 리다이렉트
        if (needsOnboarding) {
          navigate({ to: '/onboarding' })
        } else {
          navigate({ to: '/home' })
        }
      } catch (err) {
        console.error('Auth callback error:', err)

        // 에러 메시지 설정
        const errorMessage =
          err instanceof Error ? err.message : '로그인 처리 중 오류가 발생했습니다.'
        setError(errorMessage)

        // 3초 후 홈으로 리다이렉트
        setTimeout(() => {
          navigate({ to: '/' })
        }, 3000)
      }
    }

    handleCallback()
  }, [login, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-full space-y-4 px-4">
      {error ? (
        // 에러 상태
        <>
          <AlertCircle className="h-12 w-12 text-red-500" />
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription className="text-center">{error}</AlertDescription>
          </Alert>
          <p className="text-gray-600 text-sm text-center">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </>
      ) : (
        // 로딩 상태
        <>
          <Loader2 className="h-12 w-12 animate-spin text-gray-900" />
          <p className="text-gray-900 text-lg font-medium">로그인 처리 중입니다...</p>
          <p className="text-gray-600 text-sm">잠시만 기다려주세요</p>
        </>
      )}
    </div>
  )
}

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})
