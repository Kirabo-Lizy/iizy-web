import { motion, type HTMLMotionProps } from 'motion/react'

export function Reveal({ delay = 0, y = 24, ...rest }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.8, ease: [0.2, 0.7, 0.1, 1], delay }}
      {...rest}
    />
  )
}

export function Kicker({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-4 inline-flex items-center gap-2 rounded-full border border-violet-6 bg-violet-1/70 px-3 py-1 text-[13px] font-medium text-violet-11 ${className}`}>
      <span className="size-1.5 rounded-full bg-violet-9" />
      {children}
    </p>
  )
}
