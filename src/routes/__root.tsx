import { createRootRoute, Outlet, useLocation, Link } from '@tanstack/react-router'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { Home } from 'lucide-react'

const NO_SIDEBAR_ROUTES = ['/', '/auth/callback', '/onboarding']

export function RootLayout() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const showSidebar = isAuthenticated && !NO_SIDEBAR_ROUTES.includes(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="h-5 w-5" />
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})
