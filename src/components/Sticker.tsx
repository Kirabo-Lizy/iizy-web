import { motion } from 'motion/react'
import type { RefObject } from 'react'
import { cn } from '../lib/cn'

type Props = {
  name: string
  alt?: string
  className?: string
  size?: number
  rotate?: number
  delay?: number
  drag?: RefObject<HTMLElement | null>
}

/** Fluent 3D emoji (Microsoft, MIT). Optional drag inside a constraint box. */
export function Sticker({ name, alt = '', className, size = 72, rotate = 0, delay = 0, drag }: Props) {
  return (
    <motion.img
      src={`/stickers/${name}.png`}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={cn('sticker absolute', drag && 'cursor-grab touch-none active:cursor-grabbing', className)}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.4, rotate: rotate - 25 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 220, damping: 14, delay }}
      drag={!!drag}
      dragConstraints={drag}
      dragElastic={0.18}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
      whileHover={drag ? { scale: 1.08, rotate: rotate + 6 } : undefined}
      whileDrag={{ scale: 1.18, rotate: rotate - 8, zIndex: 40 }}
    />
  )
}
