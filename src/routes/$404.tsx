import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search } from 'lucide-react'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-full space-y-6">
      <Card className="bg-white border-gray-200 w-full">
        <CardContent className="py-12 text-center space-y-6">
          {/* 404 Graphic */}
          <div className="relative">
            <h1 className="text-8xl font-bold text-gray-200">404</h1>
            <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-gray-400" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h2>
            <p className="text-sm text-gray-600">
              요청하신 페이지가 존재하지 않거나
              <br />
              이동되었을 수 있습니다
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
            >
              <Home className="h-4 w-4 mr-2" />
              대시보드로 가기
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full border-gray-300 text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전 페이지로
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Help */}
      <p className="text-xs text-gray-500 text-center">
        문제가 계속되면 새로고침하거나
        <br />
        로그아웃 후 다시 시도해주세요
      </p>
    </div>
  )
}

export const Route = createFileRoute('/$404')({
  component: NotFoundPage,
})
