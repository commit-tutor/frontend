export default function HeaderComponent() {
  return (
    <div className="flex w-full items-center py-8 px-20 justify-between bg-white/5">
      <h1 className="text-xl gradient-text font-bold">Commit Tutor</h1>
      <button className="bg-white/5 border border-border/20 w-max-xl px-8 py-2 rounded-lg cursor-pointer hover:bg-white/10">로그인</button>
    </div>
  )
}
