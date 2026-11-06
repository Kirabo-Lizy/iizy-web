import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'

const milestones = [
  { at: 0.02, month: 'January', title: 'It started with one goal.', body: 'Downloaded iizy. Wrote down a single goal: start my own business.', sticker: 'seedling', x: 40, y: 250 },
  { at: 0.34, month: 'April', title: 'The first win.', body: 'Registered the business name, and 14 people in my Circle cheered.', sticker: 'trophy', x: 210, y: 170 },
  { at: 0.62, month: 'August', title: 'A habit that stuck.', body: 'Morning prayer, thirty days straight. Small, but it changed everything.', sticker: 'pray', x: 370, y: 205 },
  { at: 0.9, month: 'Now', title: 'Your next chapter.', body: 'Look back and see it clearly: every small step, connected.', sticker: 'sparkles', x: 540, y: 60 },
]

const PATH = 'M40 250 C 110 250, 130 170, 210 170 S 320 240, 370 205 S 470 60, 540 60'

export function ClarityMap() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const steps = useTransform(progress, [0, 1], [1, 142])
  const [active, setActive] = useState(0)
  const [count, setCount] = useState(1)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let i = 0
    milestones.forEach((m, j) => { if (v >= m.at) i = j })
    setActive(i)
  })
  useMotionValueEvent(steps, 'change', (v) => setCount(Math.round(v)))

  const m = milestones[active]

  return (
    <section id="map" ref={ref} className="dark-theme relative h-[340vh] bg-violet-1">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* ambient light */}
        <div className="pointer-events-none absolute -right-40 top-10 size-[640px] rounded-full bg-violet-9/25 blur-[120px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 size-[520px] rounded-full bg-pink-9/15 blur-[120px]" />
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-5 md:grid-cols-[.9fr_1.1fr] md:gap-16">
          <div className="order-2 md:order-1">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-6 px-3 py-1 text-[13px] font-medium text-violet-11">
              <span className="size-1.5 rounded-full bg-pink-9" /> The Clarity Map
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[.95] tracking-[-0.035em] text-mauve-12">
              Small steps,<br /><span className="text-violet-11">finally connected.</span>
            </h2>

            <div className="relative mt-8 min-h-[150px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
                >
                  <p className="text-sm font-medium uppercase tracking-[.16em] text-pink-11">{m.month}</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-mauve-12 sm:text-3xl">{m.title}</p>
                  <p className="mt-2 max-w-md text-[17px] leading-relaxed text-mauve-11">{m.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <div>
                <p className="font-display text-4xl font-semibold tabular-nums text-mauve-12">{count}</p>
                <p className="text-sm text-mauve-11">small steps recorded</p>
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                {milestones.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= active ? 'w-8 bg-violet-9' : 'w-4 bg-mauve-6'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative rounded-[32px] border border-mauve-6 bg-mauve-2/60 p-4 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between px-1 text-[12px] text-mauve-11">
                <span>Your journey · so far</span><span>sample data</span>
              </div>
              <div className="relative mt-2">
              <svg viewBox="0 0 580 300" className="w-full overflow-visible" aria-hidden="true">
                {[80, 150, 220].map((y) => <line key={y} x1="0" x2="580" y1={y} y2={y} stroke="var(--mauve-5)" strokeDasharray="3 6" />)}
                <path d={PATH} fill="none" stroke="var(--mauve-6)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10" />
                <motion.path d={PATH} fill="none" stroke="url(#mapGrad)" strokeWidth="5" strokeLinecap="round" style={{ pathLength: progress }} />
                <defs>
                  <linearGradient id="mapGrad" x1="0" x2="1">
                    <stop offset="0" stopColor="var(--violet-9)" />
                    <stop offset="1" stopColor="var(--pink-9)" />
                  </linearGradient>
                </defs>
                {milestones.map((ms, i) => (
                  <g key={ms.month}>
                    <motion.circle cx={ms.x} cy={ms.y} r="9" fill="var(--violet-1)" stroke={i <= active ? 'var(--pink-9)' : 'var(--mauve-7)'} strokeWidth="3"
                      animate={{ scale: i === active ? 1.35 : 1 }} style={{ transformOrigin: `${ms.x}px ${ms.y}px` }} />
                    <text x={ms.x} y={ms.y + 34} textAnchor="middle" fontSize="13" fontWeight="500" fill={i <= active ? 'var(--mauve-12)' : 'var(--mauve-9)'} className="font-sans">{ms.month}</text>
                  </g>
                ))}
              </svg>
              {milestones.map((ms, i) => (
                <span key={ms.sticker} className="pointer-events-none absolute -translate-x-1/2 -translate-y-full" style={{ left: `${(ms.x / 580) * 100}%`, top: `${(ms.y / 300) * 100}%` }}>
                  <motion.img
                    src={`/stickers/${ms.sticker}.png`} alt=""
                    className="sticker size-10 sm:size-14"
                    initial={false}
                    animate={i <= active ? { opacity: 1, scale: 1, y: -14, rotate: i % 2 ? 8 : -8 } : { opacity: 0, scale: 0.4, y: 0, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  />
                </span>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
