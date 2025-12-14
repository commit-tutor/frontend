import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut } from 'lucide-react'

function SettingsProfilePage() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="flex flex-col space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">설정</h1>
        <p className="text-sm text-gray-600">프로필 정보를 확인하세요</p>
      </div>

      {/* User Profile */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 flex items-center gap-2">
            <User className="h-4 w-4" />
            프로필 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-gray-200" />

      {/* Account Management */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">계정 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={logout}
            variant="outline"
            className="w-full border-gray-300 text-gray-900 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/settings/profile')({
  component: SettingsProfilePage,
})
