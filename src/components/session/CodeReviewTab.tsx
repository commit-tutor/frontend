import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Lightbulb } from 'lucide-react'

interface AIAnalysis {
  summary: string
  quality: {
    readability: number
    performance: number
    security: number
  }
  suggestions: string[]
  potentialBugs: string[]
}

interface CodeReviewTabProps {
  analysis: AIAnalysis
}

export function CodeReviewTab({ analysis }: CodeReviewTabProps) {
  return (
    <div className="space-y-4">
      {/* AI Summary */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">AI 분석 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Code Quality */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">코드 품질</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(analysis.quality).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 capitalize">{key}</span>
                <span className="text-gray-900 font-medium">{value}/100</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            개선 제안
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {analysis.suggestions.map((suggestion, index) => (
            <Alert key={index} className="bg-gray-100 border-gray-200">
              <AlertDescription className="text-sm text-gray-700">• {suggestion}</AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Potential Bugs */}
      {analysis.potentialBugs.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              잠재적 이슈
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.potentialBugs.map((bug, index) => (
              <Alert key={index} className="bg-white border-red-200">
                <AlertDescription className="text-sm text-red-700">• {bug}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Diff Viewer Placeholder */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">코드 변경사항</CardTitle>
          <CardDescription className="text-xs">
            Side-by-side diff 뷰어가 여기 표시됩니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded p-4 text-xs font-mono">
            <div className="text-green-400">+ const token = jwt.sign(payload, secret)</div>
            <div className="text-red-400">- const token = createToken(payload)</div>
            <div className="text-gray-500"> return token</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
