import * as Accordion from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import { CONTACT } from '../lib/brand'
import { Kicker, Reveal } from './Reveal'

const faqs = [
  { q: 'What is iizy?', a: 'iizy helps you plan goals and habits in a plan you can return to, share chosen progress with your people, ask for encouragement and celebrate wins together, and see your progress over time on a lifetime Clarity Map that connects your recorded steps.' },
  { q: 'When can I download it?', a: "iizy is in testing right now. Join the waitlist and you'll be notified the moment it launches on Android, iOS or the web." },
  { q: 'Does the waitlist reserve my @?', a: "Not quite. Joining doesn't reserve a username; names are subject to availability at signup. Being on the list means you hear first, so you're ready to choose yours." },
  { q: 'What emails will I receive?', a: "One email to confirm your address and one launch notification. That's it. Unsubscribe anytime." },
  { q: 'Is iizy free?', a: 'Yes. The core of iizy is free. iizy+ is an optional subscription ($3.99/month USD base price) for expanded customization, capacity and insights.' },
]

export function Faq() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[.8fr_1.2fr] md:gap-16">
        <div>
          <Reveal><Kicker>Before we meet</Kicker></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[.95] tracking-[-0.035em] text-violet-12">A few <span className="text-violet-9">answers.</span></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[17px] text-mauve-11">Still curious? Write to<br />
              <a href={`mailto:${CONTACT}`} className="font-medium text-violet-11 underline decoration-violet-7 underline-offset-4 hover:decoration-violet-11">{CONTACT}</a>
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Accordion.Root type="single" collapsible defaultValue="0" className="space-y-3">
            {faqs.map((f, i) => (
              <Accordion.Item key={f.q} value={String(i)} className="overflow-hidden rounded-3xl border border-mauve-4 bg-white transition-colors data-[state=open]:border-violet-6 data-[state=open]:bg-violet-1">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-lg font-semibold text-violet-12 sm:text-xl">
                    {f.q}
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-violet-3 text-violet-11 transition-all duration-500 group-data-[state=open]:rotate-[135deg] group-data-[state=open]:bg-violet-9 group-data-[state=open]:text-white">
                      <Plus className="size-4" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="accordion-content overflow-hidden">
                  <p className="px-6 pb-6 pr-16 text-[16px] leading-relaxed text-mauve-11">{f.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  )
}
