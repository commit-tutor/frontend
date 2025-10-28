import type {LucideIcon} from "lucide-react";

interface CardIntroProps {
  Icon: LucideIcon;
  title: string;
  body: string;
  fromColor: string;
  toColor: string;
}

export default function CardIntroComponent({ Icon, title, body, fromColor, toColor }: CardIntroProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border/10 bg-white/5 p-8">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${fromColor} ${toColor}`}>
        <Icon className="h-6 w-6 text-white"/>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p>{body}</p>
    </div>
  )
}
