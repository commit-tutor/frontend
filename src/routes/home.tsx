import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LandingSection } from '@/components/home/LandingSection'
import { QuickActions } from '@/components/home/QuickActions'
import { RecentActivityTab } from '@/components/home/RecentActivityTab'
import { RecentCommitsTab } from '@/components/home/RecentCommitsTab'
import { LearningHistoryTab } from '@/components/home/LearningHistoryTab'
import { Clock, GitBranch, BarChart3 } from 'lucide-react'

function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <LandingSection />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">안녕하세요, {user?.username}님! 👋</h1>
        <p className="text-gray-600 mt-2">오늘도 코드로 배우는 하루를 시작해보세요</p>
      </div>

      <QuickActions />

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">최근 활동</span>
            <span className="sm:hidden">활동</span>
          </TabsTrigger>
          <TabsTrigger value="commits" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub 커밋</span>
            <span className="sm:hidden">커밋</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">학습 기록</span>
            <span className="sm:hidden">기록</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          <RecentActivityTab />
        </TabsContent>

        <TabsContent value="commits" className="mt-6">
          <RecentCommitsTab />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <LearningHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/home')({
  component: HomePage,
})
