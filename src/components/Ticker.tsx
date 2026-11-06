const words = ['Goals', 'Habits', 'Vision boards', 'Focus', 'Circles', 'Check-ins', 'Wins', 'Reflections', 'Events', 'Ask iizy']
const stickers = ['target', 'seedling', 'pin', 'hourglass', 'heart', 'sun', 'trophy', 'notebook', 'ticket', 'sparkles']

export function Ticker() {
  const row = words.map((w, i) => (
    <span key={w} className="flex shrink-0 items-center gap-6 pr-6">
      <span className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-tight text-violet-12">{w}</span>
      <img src={`/stickers/${stickers[i]}.png`} alt="" className="size-9 sm:size-11" />
    </span>
  ))
  return (
    <div className="overflow-x-clip py-3" aria-hidden="true">
      <div className="group relative -mx-[5%] -rotate-1 overflow-hidden border-y border-violet-6 bg-violet-3 py-5">
        <div className="flex w-max animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]">
          <div className="flex">{row}</div>
          <div className="flex">{row}</div>
        </div>
      </div>
    </div>
  )
}
