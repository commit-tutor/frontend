import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RefreshCw } from 'lucide-react'

interface DashboardHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  isLoading: boolean
  onRefresh: () => void
  repositoryCount: number
}

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  isLoading,
  onRefresh,
  repositoryCount,
}: DashboardHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">저장소</h1>
          <p className="text-sm text-gray-600">
            {repositoryCount > 0
              ? `${repositoryCount}개의 저장소가 있습니다`
              : '학습할 GitHub 저장소를 선택하세요'}
          </p>
        </div>
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
          title="GitHub에서 최신 저장소 목록을 가져옵니다"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '새로고침 중...' : '새로고침'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
        <Input
          placeholder="저장소 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
        />
      </div>
    </>
  )
}
