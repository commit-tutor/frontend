import {Bolt, Code, Target} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-white">
      <div className="flex flex-col items-center mt-20 mb-14">
        <h1 className="text-center text-5xl font-bold"><span className="gradient-text">당신의 GitHub 저장소가</span> <br/> 최고의
          교재가 됩니다</h1>
        <p className="text-center">AI가 프로젝트 전체를 분석하여, <br/> 당신의 실력에 맞는 맞춤형 퀴즈와 코드 리뷰를 제공합니다.</p>
      </div>

      <button
        className="btn-primary text-white font-bold rounded-xl text-lg px-8 py-4 cursor-pointer mb-20"
      >
        GitHub으로 시작하기
      </button>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 text-center md:grid-cols-3 mb-20">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border/10 bg-white/5 p-8">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-teal-500">
            <Code className="h-6 w-6 text-white"/>
          </div>
          <h3 className="text-xl font-semibold">내 코드 기반 학습</h3>
          <p>실제 작성한 코드를 분석하여 맞춤형 퀴즈를 생성합니다.</p>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-lg border border-border/10 bg-white/5 p-8">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-500">
            <Bolt className="h-6 w-6 text-white"/>
          </div>
          <h3 className="text-xl font-semibold">지능형 난이도 조절</h3>
          <p>AI가 당신의 실력을 분석하여 적절한 난이도의 문제를 제공합니다.</p>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-lg border border-border/10 bg-white/5 p-8">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
            <Target className="h-6 w-6 text-white"/>
          </div>
          <h3 className="text-xl font-semibold">성장의 가시화</h3>
          <p>학습 진행률과 약점을 한눈에 파악하고 체계적으로 실력을 향상시킬 수 있습니다.</p>
        </div>
      </div>

      <div className="flex items-center max-w-4xl flex-col gap-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 text-white text-center p-12 mb-20">
        <h2 className="font-bold text-4xl">지금 바로 시작해보세요</h2>
        <p className="max-w-xl text-lg">GitHub 계정만 있으면 1분 안에 맞춤형 학습을 시작할 수 있습니다.</p>
        <button className="btn-primary rounded-xl max-w-3xl py-4 px-12 font-bold cursor-pointer">무료로 시작하기 →</button>
      </div>
    </div>
  )
}
