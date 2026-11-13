import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { LegalHeader } from '../components/LegalHeader'
import { Footer } from '../components/Footer'

const ease = [0.2, 0.7, 0.1, 1] as const

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — iizy'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    return () => { robots.remove(); document.title = 'iizy — Your next chapter' }
  }, [])

  return (
    <>
      <LegalHeader />
      <main className="dot-grid">
        <div className="mx-auto flex min-h-[78vh] max-w-3xl flex-col items-center justify-center px-5 pb-24 pt-36 text-center">
          <motion.img
            src="/stickers/pin.png" alt="" className="sticker size-24"
            initial={{ rotate: -30, scale: 0 }} animate={{ rotate: -8, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 14 }}
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 }}>
            <p className="mt-6 text-sm font-medium uppercase tracking-[.18em] text-violet-11">404 · Page not found</p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[.95] tracking-[-0.045em] text-violet-12">
              This page took a <span className="text-violet-9">different path.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-mauve-11">
              The link may be old or mistyped. Your next chapter is still right where you left it.
            </p>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link to="/" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-9 px-6 py-4 font-medium text-white shadow-[0_14px_30px_-12px_var(--violet-9)] transition-colors hover:bg-violet-10">
                Back to iizy <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/#waitlist" className="inline-flex items-center justify-center rounded-2xl border border-mauve-6 bg-white px-6 py-4 font-medium text-violet-12 transition-colors hover:border-violet-8">
                Join the waitlist
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
