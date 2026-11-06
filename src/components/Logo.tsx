import { cn } from '../lib/cn'

/** Recreates iizy's existing app tile: rounded gradient square, white wordmark. */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid size-9 place-items-center rounded-[11px] bg-[linear-gradient(140deg,var(--violet-8),var(--violet-9)_55%,var(--violet-12))] font-display text-[13px] font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgb(255_255_255/.35),0_6px_14px_-6px_var(--violet-9)]">
        iizy
      </span>
      <span className={cn('font-display text-[22px] font-semibold tracking-tight', dark ? 'text-white' : 'text-violet-12')}>iizy</span>
    </span>
  )
}
