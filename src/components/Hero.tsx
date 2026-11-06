import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useLenis } from 'lenis/react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ArrowDown, ArrowRight, Hand } from 'lucide-react'
import { Phone } from './Phone'
import { Sticker } from './Sticker'
import { BrandIcon, brands } from '../lib/brand'

const handles = ['yourname', 'girlinprogress', 'softlife', 'nextchapter', 'faithful', 'you']

function useTyped(words: string[]) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let n = 0, i = words[0].length, del = true, t: number
    const tick = () => {
      i += del ? -1 : 1
      setText(words[n].slice(0, i))
      let wait = del ? 50 : 90
      if (del && i === 0) { del = false; n = (n + 1) % words.length; wait = 280 }
      else if (!del && i === words[n].length) { del = true; wait = 2200 }
      t = window.setTimeout(tick, wait)
    }
    t = window.setTimeout(tick, 2400)
    return () => clearTimeout(t)
  }, [words])
  return text
}

const ease = [0.2, 0.7, 0.1, 1] as const

export function Hero() {
  const box = useRef<HTMLElement>(null)
  const typed = useTyped(handles)
  const lenis = useLenis()
  const { scrollYProgress } = useScroll({ target: box, offset: ['start start', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, -220])

  const go = (h: string) => lenis?.scrollTo(h, { offset: -88, duration: 1.4 })

  return (
    <section id="top" ref={box} className="dot-grid relative overflow-hidden pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-violet-2 to-transparent" />

      {/* draggable stickers — the same set as Kirabo's Linktree */}
      <Sticker drag={box} name="books" size={88} rotate={-10} delay={0.6} className="left-[4%] top-[18%] z-20 hidden md:block" />
      <Sticker drag={box} name="gem" size={70} rotate={14} delay={0.75} className="right-[6%] top-[16%] z-20 hidden md:block" />
      <Sticker drag={box} name="pin" size={58} rotate={-18} delay={0.9} className="left-[14%] top-[52%] z-20 hidden lg:block" />
      <Sticker drag={box} name="laptop" size={92} rotate={8} delay={1.05} className="right-[12%] top-[50%] z-20 hidden lg:block" />
      <Sticker drag={box} name="ribbon" size={44} rotate={-6} delay={1.2} className="left-3 top-[104px] z-20 hidden min-[380px]:block md:hidden" />
      <Sticker drag={box} name="sparkles" size={42} rotate={10} delay={1.3} className="right-3 top-[100px] z-20 hidden min-[380px]:block md:hidden" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className="inline-flex cursor-default items-center gap-2 rounded-full border border-violet-6 bg-white/80 py-1 pl-1 pr-3 text-[13px] font-medium text-violet-11 backdrop-blur">
                <span className="rounded-full bg-violet-9 px-2 py-0.5 text-[11px] font-semibold text-white">Waitlist open</span>
                Small steps. A bigger life.
                <Hand className="hidden size-3.5 md:block" />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content sideOffset={8} className="rounded-lg bg-violet-12 px-3 py-1.5 text-xs text-white shadow-lg">
                Psst, the stickers are draggable
                <Tooltip.Arrow className="fill-violet-12" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </motion.div>

        <h1 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(3.4rem,11vw,9.5rem)] font-semibold leading-[.88] tracking-[-0.045em] text-violet-12">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.1 }}>
              Your next
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span className="relative inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.22 }}>
              <span className="bg-[linear-gradient(100deg,var(--violet-9),var(--plum-9)_55%,var(--pink-9))] bg-clip-text text-transparent">chapter.</span>
              <svg viewBox="0 0 420 30" className="absolute -bottom-[0.16em] left-0 w-full overflow-visible" aria-hidden="true">
                <motion.path
                  d="M4 20 C 90 6, 200 4, 300 12 S 400 22, 416 10"
                  fill="none" stroke="var(--pink-7)" strokeWidth="7" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 1, ease }}
                />
              </svg>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-mauve-11 sm:text-lg"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.5 }}
        >
          Your plans. Your people. A bigger picture of your progress. iizy keeps your goals, habits and wins in one
          place, so the small steps finally add up to something you can see.
        </motion.p>

        <motion.div
          className="mx-auto mt-9 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.65 }}
        >
          <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-mauve-6 bg-white px-4 py-3.5 text-left shadow-[0_10px_30px_-18px_var(--violet-9)]">
            <span className="shrink-0 text-[15px] text-mauve-9">iizy.app/</span>
            <span className="truncate font-display text-lg font-semibold text-violet-12">@{typed}</span>
            <span className="ml-0.5 h-5 w-[2px] shrink-0 animate-pulse bg-violet-9" />
          </div>
          <button
            onClick={() => go('#waitlist')}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-9 px-6 py-4 font-medium text-white shadow-[0_14px_30px_-12px_var(--violet-9)] transition-all hover:bg-violet-10 hover:shadow-[0_18px_36px_-12px_var(--violet-9)] active:scale-[.98]"
          >
            Be the first @
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <motion.div
          className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-mauve-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        >
          <span className="inline-flex items-center gap-1.5"><BrandIcon icon={brands.android} className="size-4 text-mauve-11" /> Android</span>
          <span className="inline-flex items-center gap-1.5"><BrandIcon icon={brands.apple} className="size-4 text-mauve-11" /> iOS</span>
          <span className="h-3 w-px bg-mauve-6" />
          <span>Free core · optional iizy+</span>
        </motion.div>
      </div>

      {/* phone + floating cards */}
      <div className="relative z-10 mx-auto mt-16 flex max-w-5xl justify-center px-5 pb-10">
        <motion.div style={{ y: phoneY }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.5 }}>
          <Phone />
        </motion.div>

        <motion.div style={{ y: cardsY }} className="absolute left-[2%] top-24 hidden w-60 -rotate-3 rounded-2xl border border-mauve-4 bg-white p-4 text-left shadow-[0_24px_50px_-28px_var(--violet-9)] md:block lg:left-[8%]">
          <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-2" />
          <p className="text-xs font-medium text-mauve-10">Evening check-in</p>
          <p className="mt-1 font-display text-lg font-semibold leading-tight text-violet-12">How did today feel?</p>
          <div className="mt-3 flex gap-1.5">
            {['Heavy', 'Okay', 'Light', 'Grateful'].map((m, i) => (
              <span key={m} className={i === 3 ? 'rounded-full bg-pink-4 px-2.5 py-1 text-[11px] font-medium text-pink-11' : 'rounded-full bg-mauve-3 px-2.5 py-1 text-[11px] text-mauve-11'}>{m}</span>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ y: cardsY }} className="absolute right-[2%] top-56 hidden w-56 rotate-2 rounded-2xl bg-violet-12 p-4 text-left text-white shadow-[0_24px_50px_-24px_var(--violet-12)] md:block lg:right-[8%]">
          <img src="/stickers/trophy.png" alt="" className="sticker absolute -right-5 -top-7 size-14 rotate-12" />
          <p className="text-xs text-violet-7">New win, shared with Circle</p>
          <p className="mt-1 font-display text-lg font-medium leading-tight">Registered my business name!</p>
          <div className="mt-3 flex items-center">
            {['var(--pink-6)', 'var(--violet-7)', 'var(--plum-6)'].map((c, i) => (
              <span key={i} className="-ml-1.5 size-6 rounded-full border-2 border-violet-12 first:ml-0" style={{ background: c }} />
            ))}
            <span className="ml-2 text-[11px] text-violet-7">14 cheered you on</span>
          </div>
        </motion.div>
      </div>

      <button onClick={() => go('#board')} className="relative z-10 mx-auto mb-6 flex items-center gap-2 text-[13px] font-medium text-mauve-10 hover:text-violet-11" aria-label="Scroll to features">
        <ArrowDown className="size-4 animate-bounce" /> Scroll
      </button>
    </section>
  )
}
