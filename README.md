# iizy: website redesign (concept v2)

A redesign concept for **iizy**, the planning and social app by Kirabo Prosper.

**Stack:** React 19 · Vite · Tailwind CSS v4 · Motion (Framer Motion) · Lenis · Radix UI · Lucide · React Router

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npx vercel --prod  # deploy (vercel.json already handles the /privacy route)
```

## Design system: every choice traces back to a published source

| Layer | Source | Why |
|---|---|---|
| Color | [Radix Colors](https://www.radix-ui.com/colors), the **violet**, **plum** and **pink** scales on **mauve** gray (Radix's recommended pairing) | Violet is iizy's existing brand hue; pink and plum echo Kirabo's Linktree. Each 12-step scale has documented roles (1–2 backgrounds, 3–5 UI states, 6–8 borders, 9–10 solids, 11–12 text), with contrast built in. Dark sections use Radix's official dark scales via `.dark-theme`. |
| Type | [Chillax](https://www.fontshare.com/fonts/chillax) (display) + [General Sans](https://www.fontshare.com/fonts/general-sans) (body), both by the Indian Type Foundry via Fontshare and free for commercial use | Chillax's soft, rounded forms echo iizy's rounded logo tile; General Sans keeps body copy clean and neutral. |
| UI icons | [Lucide](https://lucide.dev) | Consistent 24px stroke icon set. |
| Brand icons | [Simple Icons](https://simpleicons.org) (CC0) paths in `src/lib/brand-paths.ts` | Official TikTok, Instagram, YouTube, Snapchat, Apple and Android marks. |
| Stickers | [Microsoft Fluent Emoji 3D](https://github.com/microsoft/fluentui-emoji) (MIT), in `public/stickers/` | Matches the 3D sticker style already on her Linktree (books, gem, pin, laptop, ribbon). |
| Primitives | Radix UI: Accordion, ToggleGroup, Checkbox, Dialog, Tooltip | Accessible keyboard and screen-reader behavior out of the box. |

## What's interactive
- **Hero:** draggable stickers, a typed @handle, a phone whose habits you can tick off, and parallax on scroll.
- **Board:** a working habit grid, a 25-minute focus timer, Circle reactions, an Ask iizy typing reply, event RSVP, a confetti "Celebrate" button and a mood check-in.
- **Clarity Map:** a scroll-linked story where the path draws as you scroll, milestones pop in and the step counter rises.
- **Waitlist:** an Android/iOS toggle, validation and a success dialog.
- **Smooth scrolling** throughout with Lenis. `prefers-reduced-motion` is respected everywhere.

## Before it goes live
- **The waitlist is a demo.** It stores nothing. Connect iizy's real backend at the `DEMO` comment in `src/components/Waitlist.tsx`.
- **If a policy changes on the live site,** update `src/data/legal.json` to match.
- **Founder photo:** drop a photo at `public/kirabo.jpg` and the profile card picks it up automatically (it falls back to a "K" monogram).
- **Sample content:** "Amara", the goals and the milestones are sample content. Kirabo should review the founder copy.

## Legal & Safety pages
All eight of iizy's live legal documents are rebuilt inside the site, plus the index page:

`/legal` · `/privacy` · `/terms` · `/community-guidelines` · `/teen-safety` · `/subscription-terms` · `/refund-policy` · `/cookies` · `/wellbeing-notice`

- The wording is taken word for word from the live site (effective 7 October 2026) and stored in `src/data/legal.json`. Edit that file to update a policy; the pages render from it through `src/pages/LegalDoc.tsx`.
- Each page includes the short version, a section list that tracks your scroll, external references (Paddle, Google Play, PDPO), a contact card and previous/next links.
- The legal pages are lazy-loaded, so the homepage doesn't download policy text.
