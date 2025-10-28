import HeaderComponent from "@/components/common/HeaderComponent.tsx";
import BottomComponent from "@/components/common/BottomComponent.tsx";
import MainTitleComponent from "@/components/home/MainTitleComponent.tsx";
import CardIntroComponent from "@/components/home/CardIntroComponent.tsx";
import StartComponent from "@/components/home/StartComponent.tsx";
import {cardInput} from "@/constants/homePageData.ts";

export default function HomePage() {
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
          Icon={item.Icon}
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
