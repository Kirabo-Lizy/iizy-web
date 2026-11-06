import { Baby, Cookie, FileText, HeartPulse, ReceiptText, ShieldCheck, Sparkles, UsersRound, type LucideIcon } from 'lucide-react'
import data from '../data/legal.json'

/* Content is iizy's live legal wording (effective 7 October 2026), extracted verbatim
   from clarity--clarity-circle.us-east4.hosted.app. Edit src/data/legal.json to update. */

export type Block = { p: string } | { list: string[] }
export type LegalSection = { id: string; title: string; blocks: Block[] }
export type LegalDoc = {
  title: string
  subtitle: string
  effective: string
  short: string[]
  sections: LegalSection[]
  links: { label: string; href: string }[]
}

export const legalHub = data.hub
export const legalOrder = data.order as string[]
export const legalDocs = data.docs as unknown as Record<string, LegalDoc>

export const legalMeta: Record<string, { icon: LucideIcon; sticker: string; short: string }> = {
  privacy: { icon: ShieldCheck, sticker: 'lock', short: 'Privacy' },
  terms: { icon: FileText, sticker: 'notebook', short: 'Terms' },
  'community-guidelines': { icon: UsersRound, sticker: 'heart', short: 'Community' },
  'teen-safety': { icon: Baby, sticker: 'seedling', short: 'Teen safety' },
  'subscription-terms': { icon: Sparkles, sticker: 'gem', short: 'iizy+' },
  'refund-policy': { icon: ReceiptText, sticker: 'ticket', short: 'Refunds' },
  cookies: { icon: Cookie, sticker: 'cookie', short: 'Cookies' },
  'wellbeing-notice': { icon: HeartPulse, sticker: 'blossom', short: 'Wellbeing' },
}
