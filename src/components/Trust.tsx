import { Download, EyeOff, HandHeart, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Kicker, Reveal } from './Reveal'

const items = [
  { icon: EyeOff, t: 'Private stays private', d: 'Goals, budgets, cycle entries and reflections are never placed in public spaces.' },
  { icon: HandHeart, t: 'Never sold', d: "We don't sell personal information. Private wellbeing isn't used to target ads." },
  { icon: ShieldCheck, t: 'Age-aware by default', d: 'Younger users get private defaults and safer social settings from day one.' },
  { icon: Download, t: 'Yours to take', d: 'Access, export, correct or delete your information anytime in Settings.' },
]

export function Trust() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[.85fr_1.15fr] md:gap-16">
        <div className="relative">
          <Reveal><Kicker>Private by design</Kicker></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[.95] tracking-[-0.035em] text-violet-12">
              Your growth is personal. <span className="text-violet-9">We built it that way.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-mauve-11">
              The parts of your life you're still figuring out deserve a safe place. That's not a feature; it's the foundation.
            </p>
            <Link to="/privacy" className="mt-6 inline-flex items-center gap-1.5 border-b border-violet-7 pb-0.5 text-[15px] font-medium text-violet-11 hover:border-violet-11">
              Read the privacy policy
            </Link>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 hidden md:block">
            <img src="/stickers/lock.png" alt="" className="sticker size-24 -rotate-12" />
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.07} className="rounded-[28px] border border-mauve-4 bg-white p-6 transition-transform duration-500 hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-2xl bg-pink-3 text-pink-11"><it.icon className="size-5" /></span>
              <h3 className="mt-5 font-display text-xl font-semibold text-violet-12">{it.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-mauve-11">{it.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
