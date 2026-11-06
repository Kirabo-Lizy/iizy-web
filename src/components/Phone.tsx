import { motion } from 'motion/react'
import { Check, Flame, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/cn'

const habits = [
  { label: 'Morning prayer', time: '6:30', done: true },
  { label: 'Read 10 pages', time: '8:00', done: true },
  { label: 'Walk 5,000 steps', time: '17:30', done: false },
]

export function Phone({ className }: { className?: string }) {
  const [list, setList] = useState(habits)
  const done = list.filter((h) => h.done).length

  return (
    <div className={cn('relative w-[290px] rounded-[48px] bg-mauve-12 p-[11px] shadow-[0_50px_100px_-30px_rgb(47_38_95/.55),inset_0_0_0_1.5px_rgb(255_255_255/.12)] sm:w-[310px]', className)}>
      <div className="absolute left-1/2 top-[22px] z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
      <div className="relative h-[600px] overflow-hidden rounded-[38px] bg-violet-2 px-4 pt-14 sm:h-[640px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-mauve-10">Thursday, 6 Nov</p>
            <p className="font-display text-[22px] font-semibold leading-tight text-violet-12">Hi, Kirabo</p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-[linear-gradient(140deg,var(--pink-6),var(--violet-7))] font-display text-sm font-semibold text-violet-12">K</span>
        </div>

        {/* streak card */}
        <div className="mt-4 rounded-2xl bg-violet-12 p-4 text-white">
          <div className="flex items-center justify-between text-[11px] text-violet-6">
            <span>Your next chapter</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5"><Flame className="size-3 text-pink-7" /> 12 days</span>
          </div>
          <p className="mt-2 font-display text-[19px] font-medium leading-snug">Launch my small business</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,var(--pink-7),var(--violet-7))]" initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.6, delay: 1, ease: [0.2, 0.7, 0.1, 1] }} />
          </div>
          <p className="mt-2 text-[11px] text-violet-6">68% · 3 steps left this week</p>
        </div>

        {/* today */}
        <div className="mt-4 flex items-baseline justify-between">
          <p className="font-display text-[15px] font-semibold text-violet-12">Today</p>
          <p className="text-[11px] text-mauve-10">{done}/{list.length} done</p>
        </div>
        <ul className="mt-2 space-y-2">
          {list.map((h, i) => (
            <li key={h.label}>
              <button
                type="button"
                onClick={() => setList((l) => l.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}
                className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left shadow-[0_1px_2px_rgb(0_0_0/.04)] transition-transform active:scale-[.98]"
              >
                <motion.span
                  animate={{ scale: h.done ? [1, 1.25, 1] : 1 }}
                  className={cn('grid size-5 place-items-center rounded-md border transition-colors', h.done ? 'border-violet-9 bg-violet-9 text-white' : 'border-mauve-7')}
                >
                  {h.done && <Check className="size-3" strokeWidth={3} />}
                </motion.span>
                <span className={cn('flex-1 text-[13px] font-medium', h.done ? 'text-mauve-10 line-through decoration-violet-7' : 'text-mauve-12')}>{h.label}</span>
                <span className="text-[11px] text-mauve-9">{h.time}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* ask iizy */}
        <div className="mt-4 rounded-2xl border border-violet-5 bg-violet-3 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-11"><Sparkles className="size-3.5" /> Ask iizy</p>
          <p className="mt-1 text-[12.5px] leading-snug text-violet-12">You've prayed 12 mornings in a row. Want to add a 5-minute journal after?</p>
        </div>

        {/* tab bar */}
        <div className="absolute inset-x-3 bottom-3 flex justify-around rounded-2xl bg-white/90 py-3 text-[10px] font-medium text-mauve-10 shadow-[0_-4px_20px_-8px_rgb(0_0_0/.1)] backdrop-blur">
          <span className="text-violet-11">Today</span><span>Map</span><span>Circles</span><span>Me</span>
        </div>
      </div>
    </div>
  )
}
