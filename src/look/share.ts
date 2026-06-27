import type { Lang, MakeupLook } from '../data/types'
import { asset } from '../data/types'

// ── Instagram-story share ──────────────────────────────────────────────────
// Mirrors kitsunebi: Instagram has no web "post" API, so the reliable path on a
// phone is to render a story-sized (1080×1920) image of the chosen look and hand
// it to the native share sheet via the Web Share API — Instagram (Stories /
// Feed / Direct) shows up there. Browsers without file-share support (most
// desktops) fall back to downloading the image so it can be posted manually.

const W = 1080
const H = 1920
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif"

// Night-Kupalle palette (matches the app's default theme).
const BG = '#140a1e'
const GOLD = '#f4c66a'
const INK_DIM = '#c7b6c9'

interface ShareLabels {
  /** Localized brand/event line, e.g. "varushniak makeup". */
  brand: string
  /** "created by …" footer line. */
  madeBy: string
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`failed to load ${src}`))
    img.src = src
  })
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxW: number,
  lineH: number,
): number {
  let cy = y
  for (const line of wrapLines(ctx, text, maxW)) {
    ctx.fillText(line, cx, cy)
    cy += lineH
  }
  return cy
}

function setLetterSpacing(ctx: CanvasRenderingContext2D, value: string) {
  try {
    ;(ctx as unknown as { letterSpacing: string }).letterSpacing = value
  } catch {
    /* unsupported — ignore */
  }
}

/** Cover-fit an image into a box (crop overflow, favouring the eyes/top). */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  focusY = 0.4,
) {
  const scale = Math.max(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  const dx = x + (w - dw) / 2
  const dy = y + (h - dh) * focusY
  ctx.drawImage(img, dx, dy, dw, dh)
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob returned null'))),
      'image/png',
    )
  })
}

/** Render the shareable story image for a single look. */
async function renderLookImage(look: MakeupLook, lang: Lang, labels: ShareLabels): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')

  // Backdrop: deep indigo with a warm glow rising from the lower third.
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, H * 0.7)
  glow.addColorStop(0, '#2a1533')
  glow.addColorStop(0.6, '#170c22')
  glow.addColorStop(1, BG)
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // Brand wordmark at the top.
  ctx.textAlign = 'center'
  ctx.fillStyle = GOLD
  ctx.font = `700 64px ${SANS}`
  setLetterSpacing(ctx, '1px')
  ctx.shadowColor = 'rgba(255, 122, 60, 0.5)'
  ctx.shadowBlur = 30
  ctx.fillText(labels.brand, W / 2, 180)
  ctx.shadowBlur = 0
  setLetterSpacing(ctx, '0px')

  // The look photo, framed.
  const img = await loadImage(asset(look.image))
  const cardW = 640
  const cardH = Math.round((cardW * 4) / 3)
  const cardX = (W - cardW) / 2
  const cardY = 286
  const radius = 28

  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
  ctx.shadowBlur = 60
  ctx.shadowOffsetY = 24
  roundRect(ctx, cardX, cardY, cardW, cardH, radius)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()

  ctx.save()
  roundRect(ctx, cardX, cardY, cardW, cardH, radius)
  ctx.clip()
  drawCover(ctx, img, cardX, cardY, cardW, cardH, look.crop != null ? look.crop / 100 : 0.4)
  ctx.restore()

  ctx.save()
  roundRect(ctx, cardX, cardY, cardW, cardH, radius)
  ctx.strokeStyle = 'rgba(244, 198, 106, 0.55)'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()

  // Look name beneath the photo.
  let y = cardY + cardH + 96
  ctx.fillStyle = GOLD
  ctx.font = `700 66px ${SANS}`
  y = drawWrapped(ctx, look.name[lang], W / 2, y, W - 160, 80)

  // English equivalent when displaying Belarusian.
  if (lang !== 'en') {
    ctx.fillStyle = INK_DIM
    ctx.font = `400 30px ${SANS}`
    ctx.fillText(look.name.en, W / 2, y + 20)
  }

  // Footer credit.
  ctx.fillStyle = INK_DIM
  ctx.font = `400 26px ${SANS}`
  setLetterSpacing(ctx, '3px')
  ctx.globalAlpha = 0.75
  ctx.fillText(labels.madeBy, W / 2, H - 90)
  ctx.globalAlpha = 1
  setLetterSpacing(ctx, '0px')

  return toBlob(canvas)
}

export type ShareResult = 'shared' | 'downloaded'

/**
 * Whether this device can share an image file via the native share sheet.
 * On a phone a true result means the share sheet — where Instagram appears if
 * installed — is available. False on desktop browsers without file-share.
 */
export function canShareImage(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false
  }
  const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean }
  if (typeof nav.canShare !== 'function') return false
  try {
    const probe = new File([new Uint8Array(1)], 'probe.png', { type: 'image/png' })
    return nav.canShare({ files: [probe] })
  } catch {
    return false
  }
}

/** Render and share a single look. Uses the native share sheet, falls back to download. */
export async function shareLook(
  look: MakeupLook,
  lang: Lang,
  labels: ShareLabels,
  shareText: string,
): Promise<ShareResult> {
  const blob = await renderLookImage(look, lang, labels)
  const file = new File([blob], `varushniak-${look.id}.png`, { type: 'image/png' })

  const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean }
  if (typeof navigator.share === 'function' && nav.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'varushniak makeup', text: shareText })
    return 'shared'
  }

  // Fallback (desktop / unsupported): download the image.
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
  return 'downloaded'
}
