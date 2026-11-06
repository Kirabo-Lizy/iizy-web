import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo } from './Logo'

export function LegalHeader({ back = { to: '/', label: 'Back to iizy' } }: { back?: { to: string; label: string } }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-mauve-a4 bg-white/80 pl-4 pr-2.5 backdrop-blur-xl">
        <Link to="/" aria-label="iizy home"><Logo /></Link>
        <Link to={back.to} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium text-mauve-11 hover:bg-violet-3 hover:text-violet-12 sm:px-4">
          <ArrowLeft className="size-4" /> <span>{back.label}</span>
        </Link>
      </nav>
    </header>
  )
}
