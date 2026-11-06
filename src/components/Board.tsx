import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import {
  CalendarHeart, Check, Hand, Heart, Images, MessageCircle, Pause, Play, Repeat, RotateCcw,
  Send, Sparkles, Sun, Target, Timer, Trophy, Users,
} from 'lucide-react'
import { Kicker, Reveal } from './Reveal'
import { cn } from '../lib/cn'

function Card({ icon: Icon, title, note, className, children, delay = 0 }: {
  icon: typeof Target; title: string; note: string; className?: string; children: ReactNode; delay?: number
}) {
  return (
    <Reveal delay={delay} className={cn('group relative flex flex-col overflow-hidden rounded-[28px] border border-mauve-4 bg-white p-5 transition-shadow duration-500 hover:shadow-[0_30px_60px_-36px_var(--violet-9)] sm:p-6', className)}>
      <header className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-3 text-violet-11 transition-colors duration-300 group-hover:bg-violet-9 group-hover:text-white">
          <Icon className="size-[18px]" />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold leading-tight text-violet-12">{title}</h3>
          <p className="mt-0.5 text-sm text-mauve-10">{note}</p>
        </div>
      </header>
      <div className="mt-5 flex flex-1 flex-col">{children}</div>
    </Reveal>
  )
}

/* ---------- Goals ---------- */
function Goals() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const goals = [
    { t: 'Launch my small business', p: 68, c: 'var(--violet-9)' },
    { t: 'Save for a laptop', p: 42, c: 'var(--plum-9)' },
    { t: 'Read 12 books this year', p: 83, c: 'var(--pink-9)' },
  ]
  return (
    <div ref={ref} className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative size-32 shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--violet-3)" strokeWidth="12" />
          <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#gr)" strokeWidth="12" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 0.64 : 0 }} transition={{ duration: 1.8, ease: [0.2, 0.7, 0.1, 1], delay: 0.3 }} />
          <defs><linearGradient id="gr"><stop offset="0" stopColor="var(--violet-9)" /><stop offset="1" stopColor="var(--pink-9)" /></linearGradient></defs>
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className="font-display text-3xl font-semibold text-violet-12">64%</span>
          <span className="text-[11px] text-mauve-10">this quarter</span>
        </div>
      </div>
      <ul className="w-full flex-1 space-y-3">
        {goals.map((g, i) => (
          <li key={g.t}>
            <div className="flex justify-between gap-3 text-sm"><span className="font-medium text-mauve-12">{g.t}</span><span className="text-mauve-10">{g.p}%</span></div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mauve-3">
              <motion.div className="h-full rounded-full" style={{ background: g.c }} initial={{ width: 0 }} animate={{ width: inView ? `${g.p}%` : 0 }} transition={{ duration: 1.4, delay: 0.4 + i * 0.12, ease: [0.2, 0.7, 0.1, 1] }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Habits ---------- */
function Habits() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const [grid, setGrid] = useState([
    [1, 1, 1, 1, 0, 0, 0],
    [1, 0, 1, 1, 0, 0, 0],
    [1, 1, 0, 1, 0, 0, 0],
  ])
  const names = ['Morning prayer', 'Read 10 pages', 'Drink 2L water']
  const toggle = (r: number, c: number) => setGrid((g) => g.map((row, i) => (i === r ? row.map((v, j) => (j === c ? 1 - v : v)) : row)))
  const total = grid.flat().filter(Boolean).length
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(7,17px)] items-center gap-x-[3px] min-[380px]:grid-cols-[minmax(0,1fr)_repeat(7,22px)] min-[380px]:gap-x-1 lg:grid-cols-[minmax(0,1fr)_repeat(7,28px)] lg:gap-x-1.5 gap-y-2.5 text-sm">
        <span />
        {days.map((d, i) => <span key={i} className="text-center text-[11px] font-medium text-mauve-9">{d}</span>)}
        {grid.map((row, r) => (
          <div key={r} className="contents">
            <span className="truncate pr-1.5 text-xs font-medium min-[380px]:pr-2 min-[380px]:text-[13px] text-mauve-12 lg:text-sm">{names[r]}</span>
            {row.map((v, c) => (
              <motion.button
                key={c} type="button" whileTap={{ scale: 0.8 }} onClick={() => toggle(r, c)}
                aria-label={`${names[r]} ${days[c]}`} aria-pressed={!!v}
                className={cn('grid aspect-square place-items-center rounded-md transition-colors min-[380px]:rounded-lg', v ? 'bg-violet-9 text-white' : 'bg-mauve-3 hover:bg-violet-4')}
              >
                <AnimatePresence>{v ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="size-3 min-[380px]:size-3.5" strokeWidth={3} /></motion.span> : null}</AnimatePresence>
              </motion.button>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-auto pt-5 text-sm text-mauve-10"><span className="font-semibold text-violet-11">{total} check-ins</span> this week · tap a square</p>
    </>
  )
}

/* ---------- Focus timer ---------- */
function Focus() {
  const TOTAL = 25 * 60
  const [left, setLeft] = useState(TOTAL)
  const [run, setRun] = useState(false)
  useEffect(() => {
    if (!run) return
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [run])
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="relative grid size-36 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--mauve-3)" strokeWidth="5" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--violet-9)" strokeWidth="5" strokeLinecap="round"
            pathLength={1} strokeDasharray="1" strokeDashoffset={(TOTAL - left) / TOTAL} style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center">
          <p className="font-display text-3xl font-semibold tabular-nums text-violet-12">{mm}:{ss}</p>
          <p className="text-[11px] text-mauve-10">Study session</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => setRun((r) => !r)} className="inline-flex items-center gap-1.5 rounded-xl bg-violet-12 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-11">
          {run ? <Pause className="size-4" /> : <Play className="size-4" />} {run ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setRun(false); setLeft(TOTAL) }} className="grid size-9 place-items-center rounded-xl bg-mauve-3 text-mauve-11 hover:bg-mauve-4" aria-label="Reset timer">
          <RotateCcw className="size-4" />
        </button>
      </div>
    </div>
  )
}

/* ---------- Vision board ---------- */
function Vision() {
  const tiles = [
    { t: 'Soft mornings', bg: 'linear-gradient(160deg,var(--pink-4),var(--pink-6))', c: 'text-pink-12', s: 'sun', r: -3, span: 'row-span-2' },
    { t: 'My own business', bg: 'linear-gradient(160deg,var(--violet-9),var(--violet-12))', c: 'text-white', s: 'laptop', r: 2, span: '' },
    { t: 'Grow in faith', bg: 'linear-gradient(160deg,var(--plum-3),var(--plum-6))', c: 'text-plum-12', s: 'pray', r: -2, span: '' },
    { t: 'Read more', bg: 'linear-gradient(160deg,var(--violet-3),var(--violet-6))', c: 'text-violet-12', s: 'books', r: 3, span: '' },
    { t: 'Bloom where planted', bg: 'linear-gradient(160deg,var(--pink-3),var(--plum-4))', c: 'text-plum-12', s: 'blossom', r: -1, span: '' },
  ]
  return (
    <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-3">
      {tiles.map((t, i) => (
        <motion.div
          key={t.t}
          className={cn('relative flex min-h-[110px] flex-col justify-end overflow-visible rounded-2xl p-3 shadow-sm', t.span)}
          style={{ background: t.bg, rotate: t.r }}
          whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          {i % 2 === 0 ? <img src="/stickers/pin.png" alt="" className="sticker absolute -top-3 left-1/2 size-8 -translate-x-1/2" /> : <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />}
          <img src={`/stickers/${t.s}.png`} alt="" className="sticker absolute right-2 top-3 size-12 sm:size-14" />
          <p className={cn('font-display text-[15px] font-semibold leading-tight sm:text-base', t.c)}>{t.t}</p>
        </motion.div>
      ))}
    </div>
  )
}

/* ---------- Circles ---------- */
function Circles() {
  const [cheer, setCheer] = useState(false)
  const [love, setLove] = useState(false)
  return (
    <>
      <div className="flex gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pink-4 font-display font-semibold text-pink-11">A</span>
        <div className="rounded-2xl rounded-tl-md bg-mauve-2 p-3.5">
          <p className="text-sm"><b className="font-semibold">Amara</b> <span className="text-mauve-10">· Sunday Circle</span></p>
          <p className="mt-1 text-[15px] leading-snug text-mauve-12">Day 30 of my morning walks. Didn't think I'd make it past week one.</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 pl-[52px]">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCheer((v) => !v)} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors', cheer ? 'border-transparent bg-violet-4 text-violet-11' : 'border-mauve-5 hover:bg-mauve-2')}>
          <Hand className="size-4" /> Proud of you <b>{14 + (cheer ? 1 : 0)}</b>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setLove((v) => !v)} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors', love ? 'border-transparent bg-pink-4 text-pink-11' : 'border-mauve-5 hover:bg-mauve-2')}>
          <Heart className={cn('size-4', love && 'fill-current')} /> <b>{32 + (love ? 1 : 0)}</b>
        </motion.button>
        <span className="inline-flex items-center gap-1.5 px-1 text-sm text-mauve-10"><MessageCircle className="size-4" /> 6</span>
      </div>
      <div className="mt-auto flex items-center gap-3 border-t border-mauve-4 pt-4">
        <div className="flex">
          {['K', 'N', 'J', 'R'].map((l, i) => (
            <span key={l} className="-ml-2 grid size-8 place-items-center rounded-full border-2 border-white font-display text-xs font-semibold first:ml-0" style={{ background: ['var(--violet-4)', 'var(--pink-4)', 'var(--plum-4)', 'var(--violet-6)'][i] }}>{l}</span>
          ))}
        </div>
        <span className="text-sm text-mauve-10">+8 in your Circle</span>
      </div>
    </>
  )
}

/* ---------- Ask iizy ---------- */
function AskIizy() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reply = "Let's make it small: pray 5 minutes, then write one line about what you're grateful for. Want me to add it to your mornings?"
  const [shown, setShown] = useState('')
  useEffect(() => {
    if (!inView) return
    let i = 0
    const t0 = setTimeout(function tick() {
      i++
      setShown(reply.slice(0, i))
      if (i < reply.length) setTimeout(tick, 18)
    }, 900)
    return () => clearTimeout(t0)
  }, [inView])
  return (
    <div ref={ref} className="flex flex-1 flex-col gap-3">
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-violet-9 px-4 py-2.5 text-[15px] text-white">I want to start journaling but I never stick with it 😩</div>
      <div className="flex max-w-[92%] gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-violet-3 text-violet-11"><Sparkles className="size-3.5" /></span>
        <div className="min-h-[72px] rounded-2xl rounded-tl-md bg-violet-2 px-4 py-2.5 text-[15px] leading-snug text-violet-12 ring-1 ring-violet-5">
          {shown || <span className="inline-flex gap-1 py-1">{[0, 1, 2].map((d) => <motion.span key={d} className="size-1.5 rounded-full bg-violet-8" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />)}</span>}
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2 rounded-xl border border-mauve-5 bg-mauve-1 py-1.5 pl-3.5 pr-1.5 text-sm text-mauve-9">
        Ask anything about your plans…
        <span className="ml-auto grid size-8 place-items-center rounded-lg bg-violet-12 text-white"><Send className="size-3.5" /></span>
      </div>
    </div>
  )
}

/* ---------- Events ---------- */
function Events() {
  const [going, setGoing] = useState(false)
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-[linear-gradient(150deg,var(--violet-12),var(--plum-12))] p-4 text-white">
      <img src="/stickers/ticket.png" alt="" className="sticker absolute -right-2 -top-2 size-14 rotate-12" />
      <p className="text-xs text-violet-7">Sat 15 Nov · Kampala</p>
      <p className="mt-1 max-w-[80%] font-display text-lg font-semibold leading-tight">Vision board brunch</p>
      <div className="my-3 border-t border-dashed border-white/25" />
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setGoing((g) => !g)} className={cn('mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-colors', going ? 'bg-pink-7 text-pink-12' : 'bg-white text-violet-12')}>
        {going ? <><Check className="size-4" /> You're going</> : 'RSVP'}
      </motion.button>
    </div>
  )
}

/* ---------- Wins ---------- */
function Wins() {
  const [bursts, setBursts] = useState<number[]>([])
  const fire = () => {
    const id = Date.now()
    setBursts((b) => [...b, id])
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1200)
  }
  const colors = ['var(--violet-9)', 'var(--pink-9)', 'var(--plum-9)', 'var(--violet-7)', 'var(--pink-7)']
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center text-center">
      <img src="/stickers/trophy.png" alt="" className="sticker size-16" />
      <p className="mt-2 font-display text-lg font-semibold leading-tight text-violet-12">Finished my first month of saving</p>
      <motion.button whileTap={{ scale: 0.92 }} onClick={fire} className="relative mt-4 inline-flex items-center gap-1.5 rounded-xl bg-pink-4 px-4 py-2 text-sm font-medium text-pink-11 hover:bg-pink-5">
        <img src="/stickers/party.png" alt="" className="size-5" /> Celebrate
        {bursts.map((id) => (
          <span key={id} className="pointer-events-none absolute left-1/2 top-1/2">
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2
              return (
                <motion.span key={i} className="absolute size-2 rounded-[2px]" style={{ background: colors[i % colors.length] }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: Math.cos(a) * (60 + (i % 3) * 20), y: Math.sin(a) * (50 + (i % 4) * 15) + 30, opacity: 0, rotate: 200 }}
                  transition={{ duration: 1.1, ease: [0.2, 0.7, 0.1, 1] }} />
              )
            })}
          </span>
        ))}
      </motion.button>
    </div>
  )
}

/* ---------- Check-in ---------- */
function CheckIn() {
  const moods = [
    { e: '😮‍💨', l: 'Heavy' }, { e: '🙂', l: 'Okay' }, { e: '😌', l: 'Calm' }, { e: '🥹', l: 'Grateful' },
  ]
  const [pick, setPick] = useState(3)
  return (
    <div className="flex flex-1 flex-col">
      <p className="text-[15px] text-mauve-11">How are you, really?</p>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {moods.map((m, i) => (
          <button key={m.l} onClick={() => setPick(i)} aria-pressed={pick === i} className={cn('flex flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-medium transition-all', pick === i ? 'bg-violet-9 text-white shadow-[0_8px_20px_-10px_var(--violet-9)]' : 'bg-mauve-2 text-mauve-11 hover:bg-violet-3')}>
            <span className="text-xl">{m.e}</span>{m.l}
          </button>
        ))}
      </div>
      <p className="mt-auto pt-4 text-sm text-mauve-10">Private by default. Only you see this.</p>
    </div>
  )
}

export function Board() {
  return (
    <section id="board" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="relative">
            <Reveal><Kicker>Inside iizy</Kicker></Reveal>
            <Reveal delay={0.05}>
              <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-[.95] tracking-[-0.035em] text-violet-12">
                Your whole life,<br /><span className="text-violet-9">on one board.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-[17px] leading-relaxed text-mauve-11">Plan it, share it, see it. Everything below works, so go ahead and tap around.</p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
          <Card icon={Target} title="Goals" note="Big dreams, broken into this week." className="md:col-span-3"><Goals /></Card>
          <Card icon={Repeat} title="Habits" note="Gentle streaks that celebrate you." className="md:col-span-3" delay={0.05}><Habits /></Card>
          <Card icon={Images} title="Vision board" note="Pin the life you're building. Pinterest optional." className="md:col-span-4"><Vision /></Card>
          <Card icon={Timer} title="Focus" note="Deep work, study, rest." className="md:col-span-2" delay={0.05}><Focus /></Card>
          <Card icon={Users} title="Circles" note="Share only what you choose." className="md:col-span-3"><Circles /></Card>
          <Card icon={Sparkles} title="Ask iizy" note="A thoughtful nudge when you need it." className="md:col-span-3" delay={0.05}><AskIizy /></Card>
          <Card icon={CalendarHeart} title="Events" note="Plans with your people." className="md:col-span-2"><Events /></Card>
          <Card icon={Trophy} title="Wins" note="Every one counts." className="md:col-span-2" delay={0.05}><Wins /></Card>
          <Card icon={Sun} title="Check-ins" note="A quiet moment, daily." className="md:col-span-2" delay={0.1}><CheckIn /></Card>
        </div>
      </div>
    </section>
  )
}
