import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Separator } from '@/components/ui/separator'
import { Home, FolderGit2, BookOpen, BookCheck, Settings, TrendingUp, Code2 } from 'lucide-react'

const NAV_ITEMS = [
  {
    title: '홈',
    icon: Home,
    path: '/home',
    description: '대시보드',
  },
  {
    title: '저장소',
    icon: FolderGit2,
    path: '/dashboard',
    description: 'GitHub 저장소',
  },
  {
    title: '나의 퀴즈',
    icon: BookOpen,
    path: '/my-quizzes',
    description: '퀴즈 목록 및 기록',
  },
  {
    title: '나의 복습',
    icon: BookCheck,
    path: '/reviews',
    description: 'AI 복습 자료',
  },
  {
    title: '통계',
    icon: TrendingUp,
    path: '/statistics',
    description: '학습 통계',
  },
]

const BOTTOM_NAV_ITEMS = [
  {
    title: '설정',
    icon: Settings,
    path: '/settings/profile',
    description: '프로필 설정',
  },
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  if (!user) return null

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900">Commit Tutor</h1>
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{item.title}</p>
                <p className={`text-xs ${active ? 'text-gray-300' : 'text-gray-500'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </nav>

      <Separator className="bg-gray-200" />

      {/* Bottom Navigation */}
      <nav className="p-4 space-y-1">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{item.title}</p>
                <p className={`text-xs ${active ? 'text-gray-300' : 'text-gray-500'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
