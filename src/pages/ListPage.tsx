import { useLang } from '../i18n/LanguageContext'
import { useNav } from '../app/navigation'
import AppHeader from '../components/AppHeader'
import { getStyle, looksByStyle } from '../data/content'
import { asset } from '../data/types'
import Footer from '../components/Footer'

export default function ListPage() {
  const { t, loc } = useLang()
  const { current, go } = useNav()

  const styleId = current.params?.styleId
  const style = styleId ? getStyle(styleId) : undefined
  const looks = styleId ? looksByStyle(styleId) : []

  return (
    <main className="page">
      <AppHeader title={style ? loc(style.name) : undefined} />
      <h1 className="page__title">{t('chooseLook')}</h1>

      <div className="style-grid">
        {looks.map((look) => (
          <button
            key={look.id}
            className="style-card"
            onClick={() => go('detail', { styleId, lookId: look.id })}
          >
            <div className="style-card__media">
              <img
                src={asset(look.image.replace(/\.webp$/, '.thumb.webp'))}
                alt=""
                loading="lazy"
                decoding="async"
                style={look.crop ? { objectPosition: `50% ${look.crop}%` } : undefined}
              />
            </div>
            <div className="style-card__body">
              <h2 className="style-card__name">{loc(look.name)}</h2>
            </div>
          </button>
        ))}
      </div>

      <Footer />
    </main>
  )
}
