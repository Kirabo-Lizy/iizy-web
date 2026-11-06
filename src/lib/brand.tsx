import { siAndroid, siApple, siInstagram, siSnapchat, siTiktok, siYoutube, type SimpleIcon } from './brand-paths'

/** Official brand marks from Simple Icons (CC0). */
export function BrandIcon({ icon, className = 'size-5' }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}

export const brands = { tiktok: siTiktok, instagram: siInstagram, youtube: siYoutube, snapchat: siSnapchat, apple: siApple, android: siAndroid }

export const socials = [
  { name: 'TikTok', handle: '@kirabo_prosper', stat: '25K', icon: siTiktok, href: 'https://www.tiktok.com/@kirabo_prosper' },
  { name: 'Instagram', handle: '@kirabo_prosper', stat: '5.1K', icon: siInstagram, href: 'https://www.instagram.com/kirabo_prosper' },
  { name: 'YouTube', handle: 'Kirabo Prosper', stat: 'Vlogs', icon: siYoutube, href: 'https://linktr.ee/kirabo_prosper' },
  { name: 'Snapchat', handle: '@kiraboprosper', stat: 'Daily', icon: siSnapchat, href: 'https://www.snapchat.com/add/kiraboprosper' },
]

export const CONTACT = 'kiraboprosperofficial@gmail.com'
