import { useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useNav } from '../app/navigation'
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'
import IgLink from '../components/IgLink'
import { getLook, looksByStyle, randomLookForGender } from '../data/content'
import { asset } from '../data/types'
import { track } from '../analytics'
import type { MakeupLook } from '../data/types'

export default function DetailPage() {
  const { t, loc } = useLang()
  const { current, replace, go } = useNav()

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
        </div>
      ) : (
        <div className="detail__nav">
          <button className="btn btn--ghost" onClick={() => goTo(prev)}>
            ‹ {t('prev')}
          </button>
          <button className="btn btn--ghost" onClick={() => goTo(next)}>
            {t('next')} ›
          </button>
        </div>
      )}

      <div className="detail__body">
        <h1 className="detail__name">{loc(look.name)}</h1>
        {look.description && <p className="detail__desc">{loc(look.description)}</p>}
        <p className="detail__hint">{t('showToArtist')}</p>
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
        <button
          className="detail__contest-link"
          onClick={() => {
            track('contest_open', { source: 'detail' })
            go('contest')
          }}
        >
          ✦ {t('winInContest')} ✦
        </button>
      </div>

      <Footer />
    </main>
  )
}
