import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { BrandIcon, CONTACT, socials } from '../lib/brand'
import { legalNav } from '../lib/legal-nav'
import { Logo } from './Logo'

export function Footer() {
  const lenis = useLenis()
  const legal = legalNav.map((l) => ({ label: l.label, to: `/${l.slug}` }))
  return (
    <footer className="dark-theme relative overflow-hidden bg-violet-1 pt-20 text-mauve-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 border-b border-mauve-5 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-mauve-11">Plan with intention. Grow with company. iizy is operated by Kirabo Prosper Ruth, Uganda.</p>
            <a href={`mailto:${CONTACT}`} className="mt-4 inline-block text-[15px] text-violet-11 underline decoration-violet-7 underline-offset-4">{CONTACT}</a>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                  className="grid size-11 place-items-center rounded-xl border border-mauve-6 text-mauve-11 transition-colors hover:border-violet-9 hover:bg-violet-9 hover:text-white">
                  <BrandIcon icon={s.icon} className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Legal">
            <Link to="/legal" className="text-xs font-medium uppercase tracking-[.16em] text-mauve-10 hover:text-mauve-12">Legal & safety</Link>
            <ul className="mt-4 space-y-2.5">
              {legal.map((l) => (
                <li key={l.to}><Link to={l.to} className="text-[15px] text-mauve-11 hover:text-mauve-12">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Explore">
            <p className="text-xs font-medium uppercase tracking-[.16em] text-mauve-10">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {[['Features', '/#board'], ['Clarity Map', '/#map'], ['Founder', '/#founder'], ['FAQ', '/#faq'], ['Join waitlist', '/#waitlist']].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-[15px] text-mauve-11 hover:text-mauve-12">{l}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <p className="select-none py-10 font-display text-[clamp(3.5rem,13vw,11rem)] font-semibold leading-[.85] tracking-[-0.05em] text-mauve-12">
          small steps.<br /><span className="bg-[linear-gradient(100deg,var(--violet-11),var(--pink-11))] bg-clip-text text-transparent">bigger life.</span>
        </p>
        <img src="/stickers/sparkles.png" alt="" className="sticker absolute right-[8%] top-10 hidden size-20 rotate-12 md:block" />
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-mauve-5 px-5 py-6 text-sm text-mauve-10">
        <span>© {new Date().getFullYear()} iizy</span>
        <button onClick={() => lenis?.scrollTo(0, { duration: 1.6 })} className="inline-flex items-center gap-1.5 hover:text-mauve-12">Back to top <ArrowUp className="size-4" /></button>
      </div>
    </footer>
  )
}
