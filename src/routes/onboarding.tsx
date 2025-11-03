import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const INTERESTS = [
  { id: 'backend', label: '백엔드', emoji: '🖥️' },
  { id: 'frontend', label: '프론트엔드', emoji: '🎨' },
  { id: 'mobile', label: '모바일', emoji: '📱' },
  { id: 'devops', label: 'DevOps', emoji: '🔧' },
  { id: 'ai', label: 'AI/ML', emoji: '🤖' },
  { id: 'blockchain', label: '블록체인', emoji: '⛓️' },
]

const GOAL_LEVELS = [
  { id: 'beginner', label: '입문', description: '프로그래밍을 처음 시작합니다' },
  { id: 'job_seeker', label: '취업준비', description: '개발자 취업을 준비하고 있습니다' },
  { id: 'professional', label: '실무향상', description: '현업 개발자로 스킬업을 원합니다' },
]

function OnboardingPage() {
  const navigate = useNavigate()
  const { updateProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedGoalLevel, setSelectedGoalLevel] = useState<string>('')
  const [dailyCommitGoal, setDailyCommitGoal] = useState(3)
  const [dailyQuizGoal, setDailyQuizGoal] = useState(5)

  const totalSteps = 3

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleComplete = () => {
    updateProfile({
      interests: selectedInterests,
      goalLevel: selectedGoalLevel,
      dailyCommitGoal,
      dailyQuizGoal,
    })
    navigate({ to: '/home' })
  }

  const handleSkip = () => {
    navigate({ to: '/home' })
  }

  const canProceed = () => {
    if (step === 1) return selectedInterests.length > 0
    if (step === 2) return selectedGoalLevel !== ''
    return true
  }

  return (
    <div className="flex flex-col min-h-full space-y-6">
      {/* Progress Indicator */}
      <div className="flex justify-center items-center space-x-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 w-16 rounded-full transition-colors ${
              s <= step ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {step} / {totalSteps}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-2">
          {step === 1 && '관심 분야를 선택해주세요'}
          {step === 2 && '목표 수준을 선택해주세요'}
          {step === 3 && '학습 목표를 설정해주세요'}
        </h2>
      </div>

      {/* Step 1: Interests */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-3">
          {INTERESTS.map((interest) => (
            <Card
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`cursor-pointer transition-all ${
                selectedInterests.includes(interest.id)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
              }`}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{interest.emoji}</div>
                <p className="font-medium">{interest.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step 2: Goal Level */}
      {step === 2 && (
        <div className="space-y-3">
          {GOAL_LEVELS.map((level) => (
            <Card
              key={level.id}
              onClick={() => setSelectedGoalLevel(level.id)}
              className={`cursor-pointer transition-all ${
                selectedGoalLevel === level.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg">{level.label}</CardTitle>
                <CardDescription
                  className={selectedGoalLevel === level.id ? 'text-gray-600' : ''}
                >
                  {level.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Step 3: Daily Goals */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-gray-900">일일 커밋 학습 목표: {dailyCommitGoal}개</Label>
            <input
              type="range"
              min="1"
              max="10"
              value={dailyCommitGoal}
              onChange={(e) => setDailyCommitGoal(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-600">하루에 학습할 커밋 수를 설정하세요</p>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-900">일일 퀴즈 목표: {dailyQuizGoal}개</Label>
            <input
              type="range"
              min="1"
              max="20"
              value={dailyQuizGoal}
              onChange={(e) => setDailyQuizGoal(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-600">하루에 풀 퀴즈 문제 수를 설정하세요</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex-1" />
      <div className="space-y-3">
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <ChevronLeft className="h-4 w-4 mr-1" />
              이전
            </Button>
          )}
          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
            >
              다음
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed()}
              className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
            >
              완료
            </Button>
          )}
        </div>
        <Button variant="ghost" onClick={handleSkip} className="w-full text-gray-600">
          건너뛰기
        </Button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})
