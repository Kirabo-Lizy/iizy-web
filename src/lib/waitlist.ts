export type Platform = 'Android' | 'iOS'

/**
 * Where waitlist signups are sent. Set VITE_WAITLIST_ENDPOINT (e.g. in Vercel → Settings →
 * Environment Variables) to iizy's waitlist backend: a Brevo/Firebase function or an /api route
 * that accepts POST { email, platform } as JSON and returns a 2xx status.
 * When it's not set, the form runs in demo mode and stores nothing.
 */
const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined

export const isDemo = !ENDPOINT

export async function joinWaitlist(email: string, platform: Platform): Promise<void> {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 900))
    return
  }
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15000)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), platform }),
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`Waitlist request failed (${res.status})`)
  } finally {
    clearTimeout(timer)
  }
}
