import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import type { FlowMode } from '../three/flow'
import { cn } from '../lib/cn'

type Props = {
  mode: FlowMode
  /** Scroll progress (0–1) for the Clarity Map. */
  progress?: MotionValue<number>
  className?: string
}

/**
 * Decorative three.js layer. three.js is loaded in its own chunk once the browser is idle,
 * so it never delays the first paint. Renders nothing if WebGL isn't available.
 */
export function FlowCanvas({ mode, progress, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const live: { cancelled: boolean; dispose?: () => void; unsub?: () => void } = { cancelled: false }

    const boot = async () => {
      try {
        const { createFlow } = await import('../three/flow')
        if (live.cancelled) return
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const flow = createFlow(canvas, mode, { reducedMotion })
        live.dispose = flow.dispose
        if (progress) {
          flow.setProgress(progress.get())
          live.unsub = progress.on('change', (v) => flow.setProgress(v))
        }
        setReady(true)
      } catch {
        // No WebGL (or it failed): the page works fine without this layer.
      }
    }

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void boot(), { timeout: 1500 })
      : window.setTimeout(() => void boot(), 600)

    return () => {
      live.cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
      live.unsub?.()
      live.dispose?.()
    }
  }, [mode, progress])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none block size-full transition-opacity duration-[1400ms] ease-out', ready ? 'opacity-100' : 'opacity-0', className)}
    />
  )
}
