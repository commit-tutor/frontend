import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

function RootRedirect() {
  const navigate = useNavigate()
  const { isLoading } = useAuth()

  // 항상 /home으로 리다이렉트 (home에서 로그인 상태에 따라 처리)
  useEffect(() => {
    if (!isLoading) {
      navigate({ to: '/home', replace: true })
    }
  }, [isLoading, navigate])

  // 로딩 중에는 빈 화면 표시
  if (isLoading) {
    return null
  }

  // 리다이렉트가 진행 중임을 표시 (일시적)
  return null
}

export const Route = createFileRoute('/')({
  component: RootRedirect,
})
