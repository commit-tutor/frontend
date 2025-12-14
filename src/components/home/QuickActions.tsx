import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, FolderGit2, BookOpen, Sparkles } from 'lucide-react'

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          빠른 시작
        </CardTitle>
        <CardDescription>자주 사용하는 기능에 빠르게 접근하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-auto flex-col items-start p-4 hover:bg-gray-50 hover:border-gray-300"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">새 퀴즈 만들기</p>
              <p className="text-xs text-gray-500 mt-1">커밋을 선택하고 AI 퀴즈 생성</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col items-start p-4 hover:bg-gray-50 hover:border-gray-300"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FolderGit2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">저장소 선택</p>
              <p className="text-xs text-gray-500 mt-1">GitHub 저장소에서 학습 시작</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col items-start p-4 hover:bg-gray-50 hover:border-gray-300"
            onClick={() => navigate({ to: '/reviews' })}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">복습하기</p>
              <p className="text-xs text-gray-500 mt-1">학습한 내용 다시 보기</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
