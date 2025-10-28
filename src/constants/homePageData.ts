import { Bolt, Code, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CardInfo {
  Icon: LucideIcon;
  title: string;
  body: string;
  fromColor: string;
  toColor: string;
}

export const cardInput: CardInfo[] = [
  {
    Icon: Code,
    title: '내 코드 기반 학습',
    body: '실제 작성한 코드를 분석하여 맞춤형 퀴즈를 생성합니다.',
    fromColor: 'from-green-400',
    toColor: 'to-teal-500',
  },
  {
    Icon: Bolt,
    title: '지능형 난이도 조절',
    body: 'AI가 당신의 실력을 분석하여 적절한 난이도의 문제를 제공합니다.',
    fromColor: 'from-sky-400',
    toColor: 'to-blue-500',
  },
  {
    Icon: Target,
    title: '성장의 가시화',
    body: '학습 진행률과 약점을 한눈에 파악하고 체계적으로 실력을 향상시킬 수 있습니다.',
    fromColor: 'from-purple-500',
    toColor: 'to-indigo-600',
  },
];
