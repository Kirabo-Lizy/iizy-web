import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { cn } from '../lib/cn'

const links = [
  { href: '#board', label: 'Features' },
  { href: '#map', label: 'Clarity Map' },
  { href: '#founder', label: 'Founder' },
  { href: '#faq', label: 'FAQ' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  useLenis(({ scroll }) => setScrolled(scroll > 24), [])

  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open, lenis])

  const go = (href: string) => {
    setOpen(false)
    requestAnimationFrame(() => lenis?.scrollTo(href, { offset: -88, duration: 1.4 }))
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.1, 1] }}
        className={cn(
          'mx-auto flex h-16 max-w-6xl items-center gap-4 rounded-2xl pl-4 pr-2.5 transition-all duration-500',
          scrolled ? 'border border-mauve-a4 bg-white/75 shadow-[0_12px_40px_-24px_var(--violet-9)] backdrop-blur-xl' : 'border border-transparent',
        )}
      >
        <a href="#top" onClick={(e) => { e.preventDefault(); go('#top') }} aria-label="iizy home">
          <Logo />
        </a>
        <span className="hidden items-center gap-2 rounded-full bg-violet-3 px-3 py-1 text-xs font-medium text-violet-11 lg:inline-flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-8" />
            <span className="relative inline-flex size-2 rounded-full bg-violet-9" />
          </span>
          Currently in testing
        </span>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => { e.preventDefault(); go(l.href) }}
                className="rounded-full px-4 py-2 text-[15px] font-medium text-mauve-11 transition-colors hover:bg-violet-3 hover:text-violet-12"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#waitlist"
          onClick={(e) => { e.preventDefault(); go('#waitlist') }}
          className="group ml-auto hidden items-center gap-1.5 rounded-xl bg-violet-12 px-4 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-violet-11 md:ml-2 md:inline-flex"
        >
          Join waitlist
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger className="ml-auto grid size-11 place-items-center rounded-xl bg-violet-12 text-white md:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </Dialog.Trigger>
          <AnimatePresence>
            {open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div className="fixed inset-0 z-50 bg-violet-12/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                </Dialog.Overlay>
                <Dialog.Content asChild forceMount aria-describedby={undefined}>
                  <motion.div
                    className="fixed inset-x-3 top-3 z-50 overflow-hidden rounded-3xl bg-white p-5 shadow-2xl"
                    initial={{ opacity: 0, y: -20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  >
                    <div className="flex items-center justify-between">
                      <Logo />
                      <Dialog.Title className="sr-only">Menu</Dialog.Title>
                      <Dialog.Close className="grid size-11 place-items-center rounded-xl bg-violet-3 text-violet-12" aria-label="Close menu">
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                    <ul className="mt-6 divide-y divide-mauve-4">
                      {links.map((l, i) => (
                        <motion.li key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                          <a href={l.href} onClick={(e) => { e.preventDefault(); go(l.href) }} className="flex items-center justify-between py-4 font-display text-2xl font-medium text-violet-12">
                            {l.label} <ArrowUpRight className="size-5 text-violet-9" />
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                    <a href="#waitlist" onClick={(e) => { e.preventDefault(); go('#waitlist') }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-9 py-4 font-medium text-white">
                      Join the waitlist
                    </a>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </motion.nav>
    </header>
  )
}
