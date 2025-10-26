import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { User, Save, LogOut, Trash2, AlertTriangle } from 'lucide-react'

const INTERESTS = [
  { id: 'backend', label: '백엔드', emoji: '🖥️' },
  { id: 'frontend', label: '프론트엔드', emoji: '🎨' },
  { id: 'mobile', label: '모바일', emoji: '📱' },
  { id: 'devops', label: 'DevOps', emoji: '🔧' },
  { id: 'ai', label: 'AI/ML', emoji: '🤖' },
  { id: 'blockchain', label: '블록체인', emoji: '⛓️' },
]

const GOAL_LEVELS = [
  { id: 'beginner', label: '입문' },
  { id: 'job_seeker', label: '취업준비' },
  { id: 'professional', label: '실무향상' },
]

function SettingsProfilePage() {
  const { user, profile, updateProfile, logout } = useAuth()
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile?.interests || [])
  const [selectedGoalLevel, setSelectedGoalLevel] = useState<string>(profile?.goalLevel || '')
  const [dailyCommitGoal, setDailyCommitGoal] = useState(profile?.dailyCommitGoal || 3)
  const [dailyQuizGoal, setDailyQuizGoal] = useState(profile?.dailyQuizGoal || 5)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleSave = () => {
    updateProfile({
      interests: selectedInterests,
      goalLevel: selectedGoalLevel,
      dailyCommitGoal,
      dailyQuizGoal,
    })
    // TODO: Show success toast
    alert('프로필이 저장되었습니다!')
  }

  const handleDeleteAccount = () => {
    // TODO: API call to delete account
    console.log('Account deletion requested')
    logout()
  }

  if (!user) return null

  return (
    <div className="flex flex-col space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">설정</h1>
        <p className="text-sm text-gray-600">프로필 및 학습 설정을 관리하세요</p>
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

      {/* Learning Preferences */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">관심 분야</CardTitle>
          <CardDescription className="text-xs">학습하고 싶은 분야를 선택하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {INTERESTS.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-3 rounded border transition-colors text-sm ${
                  selectedInterests.includes(interest.id)
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-gray-100 text-gray-900 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{interest.emoji}</span>
                {interest.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">목표 수준</CardTitle>
          <CardDescription className="text-xs">현재 학습 목표를 선택하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {GOAL_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedGoalLevel(level.id)}
                className={`w-full p-3 rounded border transition-colors text-sm text-left ${
                  selectedGoalLevel === level.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-gray-100 text-gray-900 border-gray-200 hover:border-gray-300'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">학습 목표</CardTitle>
          <CardDescription className="text-xs">일일 학습 목표를 설정하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-900 text-sm">
              일일 커밋 학습: <span className="font-bold">{dailyCommitGoal}개</span>
            </Label>
            <input
              type="range"
              min="1"
              max="10"
              value={dailyCommitGoal}
              onChange={(e) => setDailyCommitGoal(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 text-sm">
              일일 퀴즈: <span className="font-bold">{dailyQuizGoal}개</span>
            </Label>
            <input
              type="range"
              min="1"
              max="20"
              value={dailyQuizGoal}
              onChange={(e) => setDailyQuizGoal(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className="w-full bg-gray-900 text-white hover:bg-gray-800"
      >
        <Save className="h-4 w-4 mr-2" />
        변경사항 저장
      </Button>

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

          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="w-full border-red-900 text-red-400 hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              회원 탈퇴
            </Button>
          ) : (
            <Alert className="bg-red-950/20 border-red-900/50">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-sm text-red-300 mb-3">
                정말로 탈퇴하시겠습니까? 모든 학습 데이터가 삭제되며 복구할 수 없습니다.
              </AlertDescription>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleDeleteAccount}
                  size="sm"
                  className="flex-1 bg-red-600 text-gray-900 hover:bg-red-700"
                >
                  탈퇴하기
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-300"
                >
                  취소
                </Button>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/settings/profile')({
  component: SettingsProfilePage,
})
