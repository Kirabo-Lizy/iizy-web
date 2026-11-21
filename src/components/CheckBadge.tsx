import { Check } from 'lucide-react'
import { cn } from '../lib/cn'

const tones = {
  violet: 'bg-violet-3 text-violet-11',
  pink: 'bg-pink-7 text-pink-12',
}

export function CheckBadge({ tone = 'violet', className }: { tone?: keyof typeof tones; className?: string }) {
  return (
    <span className={cn('grid size-5 place-items-center rounded-full', tones[tone], className)}>
      <Check className="size-3" strokeWidth={3} />
    </span>
  )
}
