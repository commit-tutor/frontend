interface QuizProgressProps {
  answeredCount: number
  totalQuestions: number
  currentQuestionIndex: number
  allQuestions: Array<{ id: string }>
  quizAnswers: Record<string, number | string | null>
  onQuestionClick: (index: number) => void
}

export function QuizProgress({
  currentQuestionIndex,
  allQuestions,
  quizAnswers,
  onQuestionClick,
}: QuizProgressProps) {
  return (
    <>
      {/* Question Number Indicators - Floating at Bottom */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-3 flex gap-2 pointer-events-auto ml-64">
          {allQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-all hover:scale-110 ${
                index === currentQuestionIndex
                  ? 'bg-gray-900 text-white shadow-md'
                  : quizAnswers[allQuestions[index].id] !== undefined &&
                      quizAnswers[allQuestions[index].id] !== null
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
