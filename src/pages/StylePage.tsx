import { useLang } from '../i18n/LanguageContext'
import { useNav } from '../app/navigation'
import AppHeader from '../components/AppHeader'
import { getStyle } from '../data/content'
import { asset } from '../data/types'
import { track } from '../analytics'
import Footer from '../components/Footer'

export default function StylePage() {
  const { t, loc } = useLang()
  const { go } = useNav()

  // Log the picked category, then navigate (same shape as nav's go()).
  const choose = (category: string, ...nav: Parameters<typeof go>) => {
    track('category_select', { category })
    go(...nav)
  }

  const lines = getStyle('lines')
  const rhinestones = getStyle('rhinestones')
  const flowers = getStyle('flowers')
  const pearls = getStyle('pearls')
  const men = getStyle('men')

  return (
    <main className="page style-page">
      <AppHeader />
      <h1 className="page__title">{t('chooseStyle')}</h1>

      <div className="style-grid">
        {/* 1 — Contest */}
        <button
          className="style-card style-card--prize"
          onClick={() => choose('contest', 'contest')}
        >
          <div className="style-card__media">
            <img src={asset('styles/contest.svg')} alt="" loading="lazy" />
          </div>
          <div className="style-card__body">
            <h2 className="style-card__name">{t('contestName')}</h2>
            <p className="style-card__tagline">{t('contestTagline')}</p>
          </div>
        </button>

        {/* 2–6 — Lines, Rhinestones, Flowers, Pearls, Men */}
        {[lines, rhinestones, flowers, pearls, men].map(
          (style) =>
            style && (
              <button
                key={style.id}
                className="style-card"
                onClick={() => choose(style.id, 'list', { styleId: style.id })}
              >
                <div className="style-card__media">
                  <img src={asset(style.image)} alt="" loading="lazy" />
                </div>
                <div className="style-card__body">
                  <h2 className="style-card__name">{loc(style.name)}</h2>
                  <p className="style-card__tagline">{loc(style.tagline)}</p>
                </div>
              </button>
            ),
        )}

        {/* 7 — Chance */}
        <button
          className="style-card style-card--special"
          onClick={() => choose('chance', 'chance')}
        >
          <div className="style-card__media style-card__media--glyph">
            <span aria-hidden="true">✦</span>
          </div>
          <div className="style-card__body">
            <h2 className="style-card__name">{t('randomName')}</h2>
            <p className="style-card__tagline">{t('randomTagline')}</p>
          </div>
        </button>
      </div>

      <Footer />
    </main>
  )
}
