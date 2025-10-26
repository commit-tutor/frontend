import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuth } from '@/contexts/AuthContext'

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

export const Route = createRootRoute({
  component: RootLayout,
})
