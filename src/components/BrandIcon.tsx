import type { SimpleIcon } from '../lib/brand-paths'

/** Official brand marks from Simple Icons (CC0). */
export function BrandIcon({ icon, className = 'size-5' }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}
