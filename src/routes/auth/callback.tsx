import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

function AuthCallbackPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL parameters
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (!code) {
          throw new Error('No authorization code found')
        }

        // TODO: Exchange code for token via backend
        // For now, using mock token
        await login(code)

        // TODO: Check if user needs onboarding
        const needsOnboarding = false // This should come from backend

        if (needsOnboarding) {
          navigate({ to: '/onboarding' })
        } else {
          navigate({ to: '/home' })
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate({ to: '/' })
      }
    }

    handleCallback()
  }, [login, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-full space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-gray-900" />
      <p className="text-gray-900 text-lg font-medium">로그인 처리 중입니다...</p>
      <p className="text-gray-600 text-sm">잠시만 기다려주세요</p>
    </div>
  )
}

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})
