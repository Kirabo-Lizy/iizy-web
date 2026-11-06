import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Mail } from 'lucide-react'
import { LegalHeader } from '../components/LegalHeader'
import { Footer } from '../components/Footer'
import { CONTACT } from '../lib/brand'
import { legalDocs, legalMeta, legalOrder } from '../lib/legal'
import { cn } from '../lib/cn'

const ease = [0.2, 0.7, 0.1, 1] as const

/** Splits "Label: rest" list items so the label can be emphasised, as on the live site. */
function ListItem({ text }: { text: string }) {
  const i = text.indexOf(': ')
  const head = i > 0 && i < 40 ? text.slice(0, i) : null
  return (
    <li className="flex gap-3">
      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-violet-9" />
      <span>{head ? <><b className="font-semibold text-mauve-12">{head}:</b> {text.slice(i + 2)}</> : text}</span>
    </li>
  )
}

export default function LegalDoc({ slug }: { slug: string }) {
  const doc = legalDocs[slug]
  const meta = legalMeta[slug]
  const [active, setActive] = useState(doc.sections[0]?.id)
  const lenis = useLenis()

  const idx = legalOrder.indexOf(slug)
  const prev = legalOrder[(idx - 1 + legalOrder.length) % legalOrder.length]
  const next = legalOrder[(idx + 1) % legalOrder.length]

  useEffect(() => {
    document.title = `${doc.title} — iizy`
    setActive(doc.sections[0]?.id)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
    }, { rootMargin: '-30% 0px -60% 0px' })
    doc.sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el) })
    return () => { io.disconnect(); document.title = 'iizy — Your next chapter' }
  }, [doc])

  return (
    <>
      <LegalHeader back={{ to: '/legal', label: 'Legal & Safety' }} />

      <main className="dot-grid">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:pt-44">
          <motion.div key={slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium text-mauve-10">
              <Link to="/legal" className="text-violet-11 hover:underline">Legal & Safety</Link>
              <span>/</span>
              <span>{meta.short}</span>
            </nav>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[.92] tracking-[-0.045em] text-violet-12">{doc.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-mauve-11">{doc.subtitle}</p>
            <p className="mt-2 text-sm text-mauve-10">Effective {doc.effective}</p>
          </motion.div>

          <motion.aside key={`${slug}-short`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease }}
            className="relative mt-12 overflow-hidden rounded-[32px] bg-violet-12 p-7 text-white sm:p-9">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-9/50 blur-3xl" />
            <img src={`/stickers/${meta.sticker}.png`} alt="" className="sticker absolute right-4 top-4 size-16 rotate-12 sm:right-8 sm:top-8 sm:size-20" />
            <p className="relative font-display text-2xl font-semibold">The short version</p>
            <ul className="relative mt-5 space-y-3 pr-12 sm:pr-24">
              {doc.short.map((t) => (
                <li key={t} className="flex gap-3 text-violet-5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-pink-7 text-pink-12"><Check className="size-3" strokeWidth={3} /></span>{t}
                </li>
              ))}
            </ul>
          </motion.aside>

          <div className="mt-16 grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-20">
            <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-medium uppercase tracking-[.16em] text-mauve-10">On this page</p>
              <ul className="mt-4 flex flex-wrap gap-2 lg:block lg:space-y-0.5 lg:border-l lg:border-mauve-5">
                {doc.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); lenis?.scrollTo(`#${s.id}`, { offset: -100, duration: 1.2 }) }}
                      className={cn('block rounded-full border px-3 py-1.5 text-[13px] transition-colors lg:-ml-px lg:rounded-none lg:border-0 lg:border-l-2 lg:px-4 lg:py-1.5 lg:text-[14px]',
                        active === s.id ? 'border-violet-9 bg-violet-3 font-medium text-violet-11 lg:bg-transparent' : 'border-mauve-5 text-mauve-11 hover:text-mauve-12 lg:border-transparent')}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <article className="min-w-0 space-y-4">
              {doc.sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 rounded-[28px] border border-mauve-4 bg-white p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-violet-12 sm:text-[28px]">{s.title}</h2>
                  <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-mauve-11">
                    {s.blocks.map((b, i) => 'p' in b
                      ? <p key={i}>{b.p}</p>
                      : <ul key={i} className="space-y-2">{b.list.map((li) => <ListItem key={li} text={li} />)}</ul>)}
                  </div>
                </section>
              ))}

              {doc.links.length > 0 && (
                <div className="rounded-[28px] border border-dashed border-violet-6 p-6 sm:p-8">
                  <p className="text-xs font-medium uppercase tracking-[.16em] text-mauve-10">External references</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {doc.links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-violet-3 px-3.5 py-2 text-sm font-medium text-violet-11 transition-colors hover:bg-violet-9 hover:text-white">
                          {l.label} <ArrowUpRight className="size-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a href={`mailto:${CONTACT}`} className="flex flex-col gap-3 rounded-[28px] bg-pink-3 p-6 transition-colors hover:bg-pink-4 sm:flex-row sm:items-center sm:p-8">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-pink-11"><Mail className="size-5" /></span>
                <span className="min-w-0">
                  <span className="block text-[15px] text-mauve-11">iizy is operated by Kirabo Prosper Ruth, Uganda. Support, privacy requests and complaints:</span>
                  <span className="block break-all font-medium text-pink-11">{CONTACT}</span>
                </span>
              </a>

              <div className="grid gap-3 pt-6 sm:grid-cols-2">
                {[{ s: prev, dir: 'Previous' }, { s: next, dir: 'Next' }].map(({ s, dir }) => (
                  <Link key={dir} to={`/${s}`} className={cn('group flex items-center gap-4 rounded-[24px] border border-mauve-4 bg-white p-5 transition-colors hover:border-violet-7', dir === 'Next' && 'sm:flex-row-reverse sm:text-right')}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-3 text-violet-11 transition-colors group-hover:bg-violet-9 group-hover:text-white">
                      {dir === 'Next' ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
                    </span>
                    <span>
                      <span className="block text-xs text-mauve-10">{dir}</span>
                      <span className="block font-display text-lg font-semibold text-violet-12">{legalDocs[s].title}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
