import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Dialog from '@radix-ui/react-dialog'
import { BellRing, Check, Loader2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandIcon, brands } from '../lib/brand'
import { Reveal } from './Reveal'
import { Sticker } from './Sticker'
import { cn } from '../lib/cn'

type Platform = 'Android' | 'iOS'
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export function Waitlist() {
  const box = useRef<HTMLElement>(null)
  const [platform, setPlatform] = useState<Platform>('Android')
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; agree?: boolean }>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next = { email: isEmail(email) ? undefined : 'Please enter a valid email address.', agree: !agree }
    setErrors(next)
    if (next.email || next.agree) return
    setLoading(true)
    /*
     * DEMO — nothing is stored yet. Connect iizy's existing waitlist backend here (Firebase / Brevo):
     * await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ email: email.trim(), platform }) })
     */
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setDone(true)
  }

  return (
    <section id="waitlist" ref={box} className="relative px-3 pb-24 sm:px-5 sm:pb-32">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-violet-12 px-5 py-14 sm:rounded-[44px] sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-violet-9/60 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-[420px] rounded-full bg-pink-9/40 blur-[100px]" />
        <Sticker drag={box} name="bell" size={76} rotate={-12} className="right-[6%] top-10 z-20 hidden lg:block" />
        <Sticker drag={box} name="heart" size={56} rotate={10} delay={0.2} className="bottom-12 left-[44%] z-20 hidden lg:block" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-white">
            <p className="text-sm font-medium uppercase tracking-[.18em] text-pink-7">Your name. Your space.</p>
            <h2 className="mt-4 font-display whitespace-nowrap text-[clamp(2.6rem,5.2vw,4.4rem)] font-semibold leading-[.92] tracking-[-0.04em]">
              Be the first&nbsp;<span className="text-pink-7">@</span>
            </h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-violet-6">
              Get notified when iizy launches and be ready to choose your unique @. A new chapter deserves a name that feels like you.
            </p>
          </div>

          <form onSubmit={submit} noValidate className="rounded-[28px] bg-white p-5 sm:p-7">
            <p className="text-sm font-medium text-mauve-11">I'm on</p>
            <ToggleGroup.Root
              type="single" value={platform} onValueChange={(v) => v && setPlatform(v as Platform)}
              aria-label="Your device" className="relative mt-2 grid grid-cols-2 rounded-2xl bg-mauve-3 p-1"
            >
              {(['Android', 'iOS'] as Platform[]).map((p) => (
                <ToggleGroup.Item key={p} value={p} className="relative z-10 flex items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-medium text-mauve-11 transition-colors data-[state=on]:text-violet-12">
                  {platform === p && (
                    <motion.span layoutId="platform-pill" className="absolute inset-0 -z-10 rounded-xl bg-white shadow-[0_2px_8px_rgb(0_0_0/.08)]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <BrandIcon icon={p === 'Android' ? brands.android : brands.apple} className="size-4" /> {p}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-mauve-11">Your email address</span>
              <input
                type="email" value={email} autoComplete="email" placeholder="you@example.com"
                onChange={(e) => { setEmail(e.target.value); if (errors.email && isEmail(e.target.value)) setErrors((x) => ({ ...x, email: undefined })) }}
                aria-invalid={!!errors.email} aria-describedby="email-err"
                className={cn('mt-2 w-full rounded-2xl border bg-mauve-1 px-4 py-3.5 text-[16px] text-mauve-12 outline-none transition-all placeholder:text-mauve-9 focus:bg-white focus:ring-4',
                  errors.email ? 'border-pink-9 focus:ring-pink-4' : 'border-mauve-6 focus:border-violet-8 focus:ring-violet-4')}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.span id="email-err" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="block pt-1.5 text-sm text-pink-11">
                    {errors.email}
                  </motion.span>
                )}
              </AnimatePresence>
            </label>

            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-mauve-11">
              <Checkbox.Root
                checked={agree} onCheckedChange={(v) => { setAgree(v === true); setErrors((x) => ({ ...x, agree: false })) }}
                className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-[1.5px] transition-colors data-[state=checked]:border-violet-9 data-[state=checked]:bg-violet-9',
                  errors.agree ? 'border-pink-9' : 'border-mauve-8')}
              >
                <Checkbox.Indicator asChild>
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="size-3.5 text-white" strokeWidth={3} /></motion.span>
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span>I agree to receive an email to confirm my address and one {platform} launch notification.</span>
            </label>

            <motion.button
              type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-9 py-4 font-medium text-white shadow-[0_14px_30px_-14px_var(--violet-9)] transition-colors hover:bg-violet-10 disabled:opacity-80"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <BellRing className="size-4" />}
              {loading ? 'Joining…' : 'Notify me'}
            </motion.button>
            <p className="mt-4 text-xs leading-relaxed text-mauve-10">
              Joining doesn't reserve a username. Names are subject to availability at signup. Unsubscribe anytime.{' '}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-violet-11">Privacy policy</Link>
            </p>
          </form>
        </div>
      </Reveal>

      <Dialog.Root open={done} onOpenChange={setDone}>
        <AnimatePresence>
          {done && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div className="fixed inset-0 z-50 bg-violet-12/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount>
                <motion.div
                  className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,420px)] rounded-[32px] bg-white p-8 text-center shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-45%' }} animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }} exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                >
                  <Dialog.Close className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-mauve-3 text-mauve-11 hover:bg-mauve-4" aria-label="Close"><X className="size-4" /></Dialog.Close>
                  <motion.img src="/stickers/party.png" alt="" className="sticker mx-auto size-24" initial={{ rotate: -30, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 }} />
                  <Dialog.Title className="mt-4 font-display text-3xl font-semibold text-violet-12">You're on the list!</Dialog.Title>
                  <Dialog.Description className="mt-3 text-[15px] leading-relaxed text-mauve-11">
                    We'll email <b className="text-mauve-12">{email.trim()}</b> once to confirm, and once when iizy lands on {platform}. Your next chapter is loading.
                  </Dialog.Description>
                  <Dialog.Close className="mt-6 w-full rounded-2xl bg-violet-12 py-3.5 font-medium text-white hover:bg-violet-11">Can't wait</Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  )
}
