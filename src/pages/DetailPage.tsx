import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useNav } from '../app/navigation'
import AppHeader from '../components/AppHeader'
import IgLink from '../components/IgLink'
import { getLook, looksByStyle, randomLookForGender } from '../data/content'
import { asset } from '../data/types'
import { track } from '../analytics'
import { shareLook } from '../look/share'
import type { MakeupLook } from '../data/types'

type ShareState = 'idle' | 'busy' | 'saved' | 'error'

export default function DetailPage() {
  const { t, loc, lang } = useLang()
  const { current, replace, go } = useNav()
  const [shareState, setShareState] = useState<ShareState>('idle')

  const lookId = current.params?.lookId
  const look = lookId ? getLook(lookId) : undefined
  const fromChance = current.params?.fromChance

  // Which looks people open to show the artist — re-fires when cycling siblings.
  useEffect(() => {
    if (look) {
      track('look_view', { look: look.id, style: look.styleId, chance: !!fromChance })
    }
  }, [look?.id, look?.styleId, fromChance])

  if (!look) {
    return (
      <main className="page">
        <AppHeader />
      </main>
    )
  }

  const gender = current.params?.gender

  // Cycle through the looks of the same style with Previous / Next.
  const siblings = looksByStyle(look.styleId)
  const idx = siblings.findIndex((l) => l.id === look.id)
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length]
  const next = siblings[(idx + 1) % siblings.length]
  const goTo = (l: MakeupLook) =>
    replace('detail', { styleId: look.styleId, lookId: l.id })

  // Re-roll another random look for the same gender (Chance flow).
  const tryAgain = () => {
    track('try_again', { gender: gender ?? 'woman' })
    const l = randomLookForGender(gender ?? 'woman')
    if (l) replace('detail', { styleId: l.styleId, lookId: l.id, fromChance: true, gender })
  }

  // Render a story-sized image of the look and open the native share sheet
  // (Instagram, etc.), falling back to a download on desktop.
  const onShare = async () => {
    if (shareState === 'busy') return
    setShareState('busy')
    track('look_share', { look: look.id, style: look.styleId })
    try {
      const result = await shareLook(
        look,
        lang,
        { brand: 'varushniak makeup', madeBy: t('madeBy') },
        t('shareText'),
      )
      // Native share returns to idle; download shows a brief "saved" hint.
      setShareState(result === 'downloaded' ? 'saved' : 'idle')
    } catch (err) {
      // AbortError = user dismissed the share sheet; not a real failure.
      if (err instanceof Error && err.name === 'AbortError') setShareState('idle')
      else setShareState('error')
    }
  }

  const shareLabel =
    shareState === 'busy'
      ? t('sharing')
      : shareState === 'saved'
        ? t('shareSaved')
        : shareState === 'error'
          ? t('shareError')
          : t('share')

  const shareButton = (
    <button
      className="btn btn--ghost detail__share"
      onClick={onShare}
      disabled={shareState === 'busy'}
    >
      <svg
        className="detail__share-icon"
        viewBox="0 0 24 24"
        width="17"
        height="17"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
      </svg>
      {shareLabel}
    </button>
  )

  return (
    <main className="page detail">
      <AppHeader />

      <div className="detail__media">
        <img
          src={asset(look.image)}
          alt={loc(look.name)}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {fromChance ? (
        <div className="detail__nav">
          <button className="btn btn--ghost detail__again" onClick={tryAgain}>
            <span aria-hidden="true">↻</span> {t('tryAgain')}
          </button>
          {shareButton}
        </div>
      ) : (
        <div className="detail__nav">
          <button
            className="btn btn--ghost detail__arrow"
            onClick={() => goTo(prev)}
            aria-label={t('prev')}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <polyline
                points="15 5 9 12 15 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {shareButton}
          <button
            className="btn btn--ghost detail__arrow"
            onClick={() => goTo(next)}
            aria-label={t('next')}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <polyline
                points="9 5 16 12 9 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="detail__body">
        <h1 className="detail__name">{loc(look.name)}</h1>
        {look.description && <p className="detail__desc">{loc(look.description)}</p>}
        <p className="detail__hint">{t('showToArtist')}</p>
        <button
          className="detail__contest-link"
          onClick={() => {
            track('contest_open', { source: 'detail' })
            go('contest')
          }}
        >
          <span aria-hidden="true">✦</span>{' '}
          <span className="detail__contest-text">{t('winInContest')}</span>{' '}
          <span aria-hidden="true">✦</span>
        </button>
      </div>

      {/* Pinned to the bottom of the page so it sits on the same level as the
          fixed day/night toggle. */}
      <IgLink
        account="daria_kalechits"
        location="detail"
        className="detail__artist-link"
        ariaLabel="@daria_kalechits on Instagram"
      >
        <img
          className="detail__artist"
          src={asset('daria.webp')}
          alt=""
          loading="lazy"
        />
      </IgLink>
    </main>
  )
}
