import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import { MotionConfig } from 'motion/react'
import * as Tooltip from '@radix-ui/react-tooltip'
import Home from './pages/Home'
import { legalNav } from './lib/legal-nav'

const LegalHub = lazy(() => import('./pages/LegalHub'))
const LegalDoc = lazy(() => import('./pages/LegalDoc'))

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()
  useEffect(() => {
    if (hash) return
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, hash, lenis])
  return null
}

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduced, anchors: { offset: -88 } }}>
      <MotionConfig reducedMotion="user">
        <Tooltip.Provider delayDuration={150}>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/legal" element={<LegalHub />} />
            {legalNav.map(({ slug }) => (
              <Route key={slug} path={`/${slug}`} element={<LegalDoc key={slug} slug={slug} />} />
            ))}
            <Route path="*" element={<Home />} />
          </Routes>
          </Suspense>
        </Tooltip.Provider>
      </MotionConfig>
    </ReactLenis>
  )
}
