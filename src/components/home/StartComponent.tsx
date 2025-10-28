export default function StartComponent() {
  return (
    <div
      className="flex items-center max-w-3xl flex-col gap-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 text-white text-center py-10 px-32 mb-20"
    >
      <h2 className="font-bold text-4xl">지금 바로 시작해보세요</h2>
      <p className="max-w-xl text-base">GitHub 계정만 있으면 1분 안에 맞춤형 학습을 시작할 수 있습니다.</p>
      <button className="btn-primary rounded-xl max-w-3xl py-4 px-12 font-bold cursor-pointer">무료로 시작하기 →</button>
    </div>
  )
}
