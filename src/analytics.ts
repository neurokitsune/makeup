// Vendor-agnostic analytics. Each track() call is forwarded to whichever
// analytics script happens to be loaded on the page (Umami, Plausible, GA4,
// or PostHog). If none is loaded it no-ops (and logs in dev), so the app
// works identically with or without analytics configured.
//
// To enable: set the Umami `data-website-id` in index.html. No app code changes
// needed to swap providers — just drop a different snippet in index.html.

type Props = Record<string, string | number | boolean | undefined>

interface AnalyticsWindow {
  umami?: { track: (event: string, props?: Props) => void }
  plausible?: (event: string, opts?: { props?: Props }) => void
  posthog?: { capture: (event: string, props?: Props) => void }
  gtag?: (command: string, event: string, props?: Props) => void
}

// ── Session ─────────────────────────────────────────────────────────────────
// A stable id for this browsing session (one per tab session). It is attached
// to every event so all of a visit's events — including device_info — can be
// grouped together. Persisted in sessionStorage so it survives in-tab reloads
// (the app itself returns to the home screen on reload), and falls back to an
// in-memory id if storage is unavailable (private mode, etc.).
const SESSION_KEY = 'mu_session'
let sessionId: string | undefined

function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function getSessionId(): string {
  if (sessionId) return sessionId
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) {
      sessionId = stored
      return stored
    }
    const created = newId()
    sessionStorage.setItem(SESSION_KEY, created)
    sessionId = created
    return created
  } catch {
    // sessionStorage blocked — keep an in-memory id for this page load.
    sessionId ??= newId()
    return sessionId
  }
}

export function track(event: string, props?: Props): void {
  try {
    const payload: Props = { session: getSessionId(), ...props }
    const w = window as unknown as AnalyticsWindow
    if (typeof w.umami?.track === 'function') {
      w.umami.track(event, payload)
    } else if (typeof w.plausible === 'function') {
      w.plausible(event, { props: payload })
    } else if (typeof w.posthog?.capture === 'function') {
      w.posthog.capture(event, payload)
    } else if (typeof w.gtag === 'function') {
      w.gtag('event', event, payload)
    } else if (import.meta.env.DEV) {
      console.debug('[analytics]', event, payload)
    }
  } catch {
    // Analytics must never break the app.
  }
}

/** A view of one of the in-memory screens (home / style / list / detail / …). */
export function trackScreen(screen: string): void {
  track('screen_view', { screen })
}

// ── Device info ──────────────────────────────────────────────────────────────
interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  os: string
  browser: string
  touch: boolean
  /** Running as an installed PWA / standalone web app. */
  standalone: boolean
  viewport: string
  screen: string
  dpr: number
  lang: string
}

function detectOS(ua: string, touchPoints: number): string {
  if (/iPhone|iPod/.test(ua)) return 'iOS'
  if (/iPad/.test(ua)) return 'iPadOS'
  // iPadOS 13+ reports as Mac; disambiguate via touch support.
  if (/Macintosh/.test(ua) && touchPoints > 1) return 'iPadOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Macintosh|Mac OS X/.test(ua)) return 'macOS'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Linux/.test(ua)) return 'Linux'
  return 'other'
}

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return 'Edge'
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet'
  if (/OPR\/|Opera/.test(ua)) return 'Opera'
  if (/FxiOS|Firefox/.test(ua)) return 'Firefox'
  if (/CriOS|Chrome/.test(ua)) return 'Chrome'
  if (/Safari/.test(ua)) return 'Safari'
  return 'other'
}

function detectDeviceType(ua: string, os: string): DeviceInfo['deviceType'] {
  if (os === 'iPadOS' || /iPad/.test(ua)) return 'tablet'
  if (/Mobi|iPhone|iPod/.test(ua)) return 'mobile'
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? 'mobile' : 'tablet'
  return 'desktop'
}

export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent || ''
  const touchPoints = navigator.maxTouchPoints ?? 0
  const os = detectOS(ua, touchPoints)
  let standalone = false
  try {
    standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
  } catch {
    /* ignore */
  }
  return {
    deviceType: detectDeviceType(ua, os),
    os,
    browser: detectBrowser(ua),
    touch: touchPoints > 0,
    standalone,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
    dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    lang: navigator.language || '',
  }
}

let deviceLogged = false

/**
 * Emit a one-time `device_info` event for this session. Guarded so reloads in
 * the same tab don't duplicate it. Safe to call on every app mount.
 */
export function trackDeviceOnce(): void {
  try {
    const flag = 'mu_device_logged'
    if (sessionStorage.getItem(flag)) return
    sessionStorage.setItem(flag, '1')
  } catch {
    // Storage blocked: fall back to a once-per-page-load guard.
    if (deviceLogged) return
    deviceLogged = true
  }
  track('device_info', { ...getDeviceInfo() })
}
