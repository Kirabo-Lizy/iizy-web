import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Ticker } from '../components/Ticker'
import { Board } from '../components/Board'
import { ClarityMap } from '../components/ClarityMap'
import { Trust } from '../components/Trust'
import { Pricing } from '../components/Pricing'
import { Founder } from '../components/Founder'
import { Faq } from '../components/Faq'
import { Waitlist } from '../components/Waitlist'
import { Footer } from '../components/Footer'

export default function Home() {
  const { hash } = useLocation()
  const lenis = useLenis()
  useEffect(() => {
    if (!hash || !lenis) return
    const t = setTimeout(() => lenis.scrollTo(hash, { offset: -88, duration: 1.2 }), 120)
    return () => clearTimeout(t)
  }, [hash, lenis])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Board />
        <ClarityMap />
        <Trust />
        <Pricing />
        <Founder />
        <Faq />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
