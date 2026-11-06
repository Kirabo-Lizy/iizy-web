import { Check } from 'lucide-react'
import { Kicker, Reveal } from './Reveal'

export function Pricing() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><Kicker>Simple & honest</Kicker></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[.95] tracking-[-0.035em] text-violet-12">
              Free at the core. <span className="text-violet-9">More when you want it.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          <Reveal className="flex flex-col rounded-[32px] border border-mauve-4 bg-white p-7 sm:p-9">
            <p className="font-display text-xl font-semibold text-violet-12">iizy</p>
            <p className="mt-4 font-display text-6xl font-semibold tracking-tight text-violet-12">Free</p>
            <p className="mt-2 text-mauve-11">Everything you need to plan, share and grow.</p>
            <ul className="mt-8 space-y-3 border-t border-mauve-4 pt-6">
              {['Goals, habits & check-ins', 'Your lifetime Clarity Map', 'Circles, wins & events', 'Every privacy & safety control'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px]"><span className="grid size-5 place-items-center rounded-full bg-violet-3 text-violet-11"><Check className="size-3" strokeWidth={3} /></span>{f}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="relative flex flex-col overflow-hidden rounded-[32px] bg-violet-12 p-7 text-white shadow-[0_40px_80px_-40px_var(--violet-12)] sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-violet-9/50 blur-3xl" />
            <img src="/stickers/gem.png" alt="" className="sticker absolute right-6 top-6 size-16 rotate-12" />
            <p className="relative font-display text-xl font-semibold">iizy<span className="text-pink-7">+</span></p>
            <p className="relative mt-4 font-display text-6xl font-semibold tracking-tight">$3.99<span className="ml-1 font-sans text-base font-normal text-violet-7">/month</span></p>
            <p className="relative mt-2 text-violet-6">For when you want to go deeper.</p>
            <ul className="relative mt-8 space-y-3 border-t border-white/15 pt-6">
              {['Everything in iizy', 'Expanded customization', 'More capacity & insights', 'Premium planning experiences', 'No ads'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px]"><span className="grid size-5 place-items-center rounded-full bg-pink-7 text-pink-12"><Check className="size-3" strokeWidth={3} /></span>{f}</li>
              ))}
            </ul>
            <p className="relative mt-auto pt-8 text-xs text-violet-7">USD base price. Taxes & regional pricing confirmed at checkout. Cancel anytime.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
