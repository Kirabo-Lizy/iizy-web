import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { LegalHeader } from '../components/LegalHeader'
import { Footer } from '../components/Footer'
import { CONTACT } from '../lib/brand'
import { legalDocs, legalHub, legalMeta, legalOrder } from '../lib/legal'

const ease = [0.2, 0.7, 0.1, 1] as const

export default function LegalHub() {
  useEffect(() => {
    document.title = 'Legal & Safety — iizy'
    return () => { document.title = 'iizy — Your next chapter' }
  }, [])

  return (
    <>
      <LegalHeader />
      <main className="dot-grid">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:pt-44">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[.18em] text-violet-11">iizy · Legal</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[.9] tracking-[-0.045em] text-violet-12">
              Legal <span className="text-violet-9">& Safety</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-mauve-11">{legalHub.subtitle}</p>
          </motion.div>

          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {legalOrder.map((slug, i) => {
              const d = legalDocs[slug]
              const m = legalMeta[slug]
              return (
                <motion.li key={slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.05 }}>
                  <Link to={`/${slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-mauve-4 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-6 hover:shadow-[0_30px_60px_-36px_var(--violet-9)]">
                    <img src={`/stickers/${m.sticker}.png`} alt="" className="sticker absolute -right-3 -top-3 size-20 rotate-12 opacity-0 transition-all duration-500 group-hover:right-3 group-hover:top-3 group-hover:opacity-100 group-hover:rotate-6" />
                    <span className="grid size-11 place-items-center rounded-2xl bg-violet-3 text-violet-11 transition-colors duration-300 group-hover:bg-violet-9 group-hover:text-white">
                      <m.icon className="size-5" />
                    </span>
                    <h2 className="mt-5 pr-10 font-display text-xl font-semibold leading-tight text-violet-12">{d.title}</h2>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-mauve-11">{d.subtitle}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-violet-11">
                      Read details <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.li>
              )
            })}
            <motion.li initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.55 }}>
              <a href={`mailto:${CONTACT}`} className="flex h-full flex-col justify-between rounded-[28px] bg-violet-12 p-6 text-white transition-transform duration-500 hover:-translate-y-1">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-pink-7"><Mail className="size-5" /></span>
                <span>
                  <span className="mt-5 block font-display text-xl font-semibold">Questions or requests?</span>
                  <span className="mt-2 block break-all text-[15px] text-violet-6">{CONTACT}</span>
                </span>
              </a>
            </motion.li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
