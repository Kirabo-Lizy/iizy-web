import { useRef, useState } from 'react'
import { ArrowUpRight, BadgeCheck, MapPin } from 'lucide-react'
import { BrandIcon, socials } from '../lib/brand'
import { Kicker, Reveal } from './Reveal'
import { Sticker } from './Sticker'

export function Founder() {
  const box = useRef<HTMLElement>(null)
  const [photo, setPhoto] = useState(true)
  return (
    <section id="founder" ref={box} className="relative overflow-hidden bg-pink-2 py-24 sm:py-32">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
      <Sticker drag={box} name="pray" size={64} rotate={-8} className="left-[4%] top-16 z-10 hidden md:block" />
      <Sticker drag={box} name="ribbon" size={60} rotate={12} delay={0.15} className="right-[5%] top-24 z-10 hidden md:block" />
      <Sticker drag={box} name="notebook" size={70} rotate={-6} delay={0.3} className="bottom-16 right-[8%] z-10 hidden md:block" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[.9fr_1.1fr] md:gap-20">
        {/* profile card */}
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="relative rotate-[-2deg] rounded-[32px] border border-pink-5 bg-white p-6 shadow-[0_40px_80px_-40px_var(--pink-9)]">
            <span className="tape -top-3 left-10 -rotate-6" />
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-[conic-gradient(var(--violet-9),var(--pink-9),var(--plum-9),var(--violet-9))] p-[3px]">
                <div className="grid size-20 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-[linear-gradient(140deg,var(--pink-5),var(--violet-6))]">
                  {photo ? (
                    <img src="/kirabo.jpg" alt="Kirabo Prosper" className="size-full object-cover" onError={() => setPhoto(false)} />
                  ) : (
                    <span className="font-display text-3xl font-semibold text-violet-12">K</span>
                  )}
                </div>
              </div>
              <div>
                <p className="flex items-center gap-1 font-display text-xl font-semibold text-violet-12">Kirabo Prosper <BadgeCheck className="size-4 text-violet-9" /></p>
                <p className="text-sm text-mauve-10">@kirabo_prosper</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-mauve-10"><MapPin className="size-3" /> Uganda</p>
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-mauve-12">
              Your favorite girl in progress 🎀 Faith, beauty, soft living & building my dreams 💻 Creator | Founder of iizy ♡
            </p>
            <div className="mt-5 grid grid-cols-3 divide-x divide-mauve-4 rounded-2xl bg-mauve-2 py-3 text-center">
              <div><p className="font-display text-lg font-semibold text-violet-12">30.9K</p><p className="text-[11px] text-mauve-10">followers</p></div>
              <div><p className="font-display text-lg font-semibold text-violet-12">4</p><p className="text-[11px] text-mauve-10">platforms</p></div>
              <div><p className="font-display text-lg font-semibold text-violet-12">1</p><p className="text-[11px] text-mauve-10">big dream</p></div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal><Kicker>Meet the founder</Kicker></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1] tracking-[-0.035em] text-violet-12">
              Built by a girl in progress, <span className="text-pink-11">for everyone still becoming.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-mauve-11">
              Kirabo shares the everyday reality of growing with her community: the faith, the soft mornings,
              the plans that work and the ones that don't. iizy comes from that same belief. You don't need a perfect
              life to make progress. You need a place to see it.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col gap-3 rounded-2xl border border-pink-5 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-violet-12 hover:bg-violet-12">
                <span className="flex items-center justify-between">
                  <BrandIcon icon={s.icon} className="size-5 text-violet-12 transition-colors group-hover:text-white" />
                  <ArrowUpRight className="size-4 text-mauve-8 transition-colors group-hover:text-pink-7" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-violet-12 transition-colors group-hover:text-white">{s.stat}</span>
                  <span className="text-xs text-mauve-10 transition-colors group-hover:text-violet-7">{s.name}</span>
                </span>
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
