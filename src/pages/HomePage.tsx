import {Bolt, Code, Target} from "lucide-react";
import HeaderComponent from "@/components/common/HeaderComponent.tsx";
import BottomComponent from "@/components/common/BottomComponent.tsx";
import MainTitleComponent from "@/components/home/MainTitleComponent.tsx";
import CardIntroComponent from "@/components/home/CardIntroComponent.tsx";
import StartComponent from "@/components/home/StartComponent.tsx";

export default function HomePage() {
  const cardInput = [
    {
      icon: Code,
      title: '내 코드 기반 학습',
      body: '실제 작성한 코드를 분석하여 맞춤형 퀴즈를 생성합니다.',
      fromColor: 'from-green-400',
      toColor: 'to-teal-500',
    },
    {
      icon: Bolt,
      title: '지능형 난이도 조절',
      body: 'AI가 당신의 실력을 분석하여 적절한 난이도의 문제를 제공합니다.',
      fromColor: 'from-sky-400',
      toColor: 'to-blue-500',
    },
    {
      icon: Target,
      title: '성장의 가시화',
      body: '학습 진행률과 약점을 한눈에 파악하고 체계적으로 실력을 향상시킬 수 있습니다.',
      fromColor: 'from-purple-500',
      toColor: 'to-indigo-600',
    },
  ];

  return (
    <div className="flex flex-col items-center text-white">
      <HeaderComponent/>
      <MainTitleComponent/>
      <button className="btn-primary text-white font-bold rounded-xl text-lg px-8 py-4 cursor-pointer mb-20">
        GitHub으로 시작하기
      </button>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 text-center md:grid-cols-3 mb-20">
        {cardInput.map((item) => (
        <CardIntroComponent
          Icon={item.icon}
          title={item.title}
          body={item.body}
          fromColor={item.fromColor}
          toColor={item.toColor}
        />
        ))}
      </div>
      <StartComponent />
      <BottomComponent/>
    </div>
  )
}
